"use client";

import { getGameDetail, getGameDetailByDate } from "@/utils/get";
import { GameDetail } from "@/utils/interface/game";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { bgColor, fontColor } from "@/styles/color";

export interface DateFilter {
  startDate: string;
  endDate: string;
}

export default function GameCard() {
  const router = useRouter();
  const [games, setGames] = useState<GameDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pad = (n: any) => n.toString().padStart(2, "0");

  //Game 상세 페이지로 이동하는 함수
  const goToGameDetail = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  // 오늘 날짜 (한국 시간 기준)
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());

  // Luxon으로 한국 시간 기준 DateTime 객체 생성
  const kstDate = DateTime.fromISO(`${yyyy}-${mm}-${dd}`, {
    zone: "Asia/Seoul",
  });

  // 한국 시간의 00:00 ~ 23:59 → UTC로 변환
  const formattedStart = kstDate.startOf("day").toUTC().toISO()!; // "2025-07-16T15:00:00.000Z"
  const formattedEnd = kstDate.endOf("day").toUTC().toISO()!; // "2025-07-17T14:59:59.999Z"

  const [startDate, setStartDate] = useState(formattedStart);
  const [endDate, setEndDate] = useState(formattedEnd);

  // 날짜 필터 객체 반환
  const getDateFilter = (): DateFilter => {
    return { startDate, endDate };
  };

  // 게임 데이터를 불러오는 함수
  const fetchGames = async () => {
    setLoading(true);
    try {
      const dateFilter = getDateFilter();
      const result = await getGameDetailByDate(dateFilter);
      console.log("Games: ", result);
      setGames(result || []);
    } catch (err) {
      console.error(err);
      setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 사진 URL로 사진 불러오기
  const getPhotoByURL = (photoUrl: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}${photoUrl}`;
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-screen-lg px-3 sm:px-6 md:px-10">
        <Carousel className="w-full">
          <CarouselContent>
            {games.map((game) => (
              <CarouselItem
                key={game.gameId}
                className="p-2 sm:basis-1/2 md:basis-1/3"
              >
                <Card
                  className={`w-full max-w-sm mx-auto flex flex-col p-0 overflow-hidden transition-transform shadow-lg cursor-pointer hover:scale-103 ${bgColor.skyblue}`}
                  onClick={() => goToGameDetail(game.gameId)}
                >
                  <div className="w-full h-45 sm:h-50">
                    {game.Place?.Photos?.length ? (
                      <img
                        src={getPhotoByURL(game.Place.Photos[0].photoUrl)}
                        alt={game.Place?.placeName || "장소 이미지"}
                        className="object-cover w-full h-full fade-mask md:fade-mask"
                      />
                    ) : (
                      <div
                        className={`flex items-center justify-center w-full h-full text-xs sm:text-sm text-gray-500 ${bgColor.skyblue}`}
                      >
                        이미지 없음
                      </div>
                    )}
                  </div>

                  <CardContent className="flex flex-col gap-1 p-3 sm:p-4 sm:gap-2">
                    <div
                      className={`flex justify-between text-[11px] sm:text-xs ${fontColor.gray}`}
                    >
                      <span>
                        {game.Place.location.match(/.+?구/)?.[0] ??
                          game.Place.location}
                      </span>
                    </div>

                    <h3
                      className={`text-base sm:text-xl font-extrabold ${fontColor.orange}`}
                    >
                      {game.Place?.placeName}
                    </h3>

                    <div className="flex justify-between text-sm font-bold text-gray-600">
                      <span className={`${fontColor.blue}`}>
                        {(() => {
                          const dateObj = new Date(game.date);
                          const pad = (n: number) =>
                            n.toString().padStart(2, "0");
                          const hours = pad(dateObj.getHours());
                          const minutes = pad(dateObj.getMinutes());
                          return `${hours}:${minutes}`;
                        })()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className={`font-bold ${fontColor.deepOrange}`}>
                        {game.Payments.length || 0}
                      </span>
                      <span className="font-bold text-gray-500">
                        / {game.numOfMember} 명
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden lg:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
