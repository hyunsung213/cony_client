"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { seoulDistricts } from "@/lib/seoul";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { is } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { bgColor, brandColors, fontColor } from "@/styles/color";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { getAllGameDetail } from "@/utils/get";
import { GameDetail } from "@/utils/interface/game";

export default function GameList() {
  const today = new Date();
  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
  const router = useRouter();

  // 오늘 날짜 포맷: "YYYY-MM-DD"
  const getFormattedToday = () => {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  // ✅ 오늘 날짜로 초기화
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedToday());
  const [games, setGames] = useState<GameDetail[]>([]);
  const [selectDistrict, setSelectDistrict] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  const [startIndex, setStartIndex] = useState(0); // 현재 보여줄 날짜 인덱스 시작점
  const datesToShow = 5;
  const totalDates = 10;

  //Game 상세 페이지로 이동하는 함수
  const goToGameDetail = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  // GameList 불러오기
  const fetchGames = async () => {
    setLoading(true);
    try {
      const resultGames = await getAllGameDetail();
      setGames(resultGames || []);
      console.log("게임: ", resultGames);
    } catch (err) {
      console.error(err);
      setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜 + 지역구 필터
  const filteredGames = games.filter((game) => {
    const dateTime = DateTime.fromISO(game.date, { zone: "utc" }).setZone(
      "Asia/Seoul"
    );

    const gameDateStr = dateTime.toFormat("yyyy-MM-dd");
    const matchesDate = gameDateStr === selectedDate;

    const matchesDistrict = selectDistrict
      ? game.Place?.location?.includes(selectDistrict)
      : true;

    return matchesDate && matchesDistrict;
  });

  // 주소 구까지만 나타내기
  // "구"까지만 추출하는 함수
  const toDistrictOnly = (address: string) => {
    if (!address) return "인천광역시";

    // "중구", "강남구", "마포구" 등 "구"로 끝나는 단어 추출
    const match = address.match(/([가-힣]+구)/);
    return match ? match[0] : "인천광역시";
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-screen-lg px-1 sm:px-6">
      <div className="relative w-full pb-3">
        {/* Fade 효과용 오버레이 (왼쪽) */}
        {startIndex + totalDates - 1 === new Date(selectedDate).getDate() && (
          <div className="absolute top-0 left-0 z-20 h-4 w-6 sm:w-8 pointer-events-none bg-gradient-to-r from-[#e0f7fa] to-transparent" />
        )}

        {/* Fade 효과용 오버레이 (오른쪽) */}
        {startIndex === new Date(selectedDate).getDate() && (
          <div className="absolute top-0 right-0 z-20 h-4 w-6 sm:w-8 pointer-events-none bg-gradient-to-l from-[#e0f7fa] to-transparent" />
        )}

        <Carousel
          opts={{
            align: "center",
            slidesToScroll: 5,
            containScroll: "trimSnaps",
          }}
          className={`w-full justify-between rounded-full px-2 sm:px-4 ${bgColor.skyblue}`}
        >
          <CarouselPrevious className="absolute left-0 z-10 hidden -translate-y-1/2 lg:flex top-1/2" />

          <CarouselContent className="flex justify-start w-full gap-1 -ml-3">
            {Array.from({ length: totalDates }, (_, i) => {
              const index = startIndex + i;
              const newDate = new Date(today);
              newDate.setDate(today.getDate() + index);

              const day = daysKor[newDate.getDay()];
              const dateNum = newDate.getDate();
              const formattedDate = `${newDate.getFullYear()}-${String(
                newDate.getMonth() + 1
              ).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;

              const isSelected = selectedDate === formattedDate;
              const isSaturday = newDate.getDay() === 6;
              const isSunday = newDate.getDay() === 0;

              return (
                <CarouselItem
                  key={i}
                  className="basis-[20%] sm:basis-[10%] flex justify-center"
                >
                  <button
                    onClick={() => setSelectedDate(formattedDate)}
                    className={`
              w-12 h-12 rounded-full flex flex-col items-center justify-center
              text-[11px] font-extrabold leading-tight transition-all hover:scale-105
              ${isSelected ? `${bgColor.orange} text-white` : "bg-transparent"}
              ${
                isSaturday && !isSelected
                  ? "text-blue-500"
                  : isSunday && !isSelected
                  ? "text-red-500"
                  : !isSelected
                  ? "text-black"
                  : ""
              }
            `}
                  >
                    <span>{dateNum}</span>
                    <span className="text-[10px]">{day}</span>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselNext className="absolute right-0 z-10 hidden -translate-y-1/2 lg:flex top-1/2" />
        </Carousel>
      </div>

      {/* 지역구 선택 */}
      {/* <div>
        <Select onValueChange={(val) => setSelectDistrict(val)}>
          <SelectTrigger
            className={`h-8 text-xs sm:text-sm w-[140px] sm:w-[180px] ${bgColor.skyblue} ${fontColor.olive} rounded-md`}
          >
            <SelectValue placeholder="지역구 선택" />
          </SelectTrigger>

          <SelectContent className="overflow-y-auto bg-white border rounded-md shadow-lg max-h-80">
            <SelectGroup>
              <SelectLabel
                className={`px-2 py-1 ${fontColor.olive} text-xs font-bold`}
              >
                서울
              </SelectLabel>

              {seoulDistricts.map((district) => (
                <SelectItem
                  key={district.name}
                  value={district.address}
                  className={`text-sm text-gray-700 px-2 py-1 cursor-pointer hover:scale-105`}
                >
                  {district.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}

      {/* 게임 리스트 */}
      {filteredGames.length > 0 ? (
        <div className="flex flex-col gap-2 mt-4">
          {filteredGames.map((game, idx) => {
            const dateTime = DateTime.fromISO(game.date, {
              zone: "utc",
            }).setZone("Asia/Seoul");
            const isOdd = idx % 2 === 0; // 0부터 시작 → 0, 2, 4... 홀수 번째로 인식
            return (
              <div
                key={game.gameId}
                className={`flex sm:flex-nowrap items-center justify-between gap-1 px-3 sm:px-10 py-3 cursor-pointer rounded-xl hover:scale-102`}
                style={{
                  backgroundColor: isOdd
                    ? brandColors.skyorange
                    : brandColors.skyblue,
                }}
                onClick={() => goToGameDetail(game.gameId)}
              >
                {/* 시간 */}
                <div className="text-base font-bold text-left w-14 sm:w-16 sm:text-lg">
                  {dateTime.toFormat("HH:mm")}
                </div>

                {/* 장소 및 지역 */}
                <div className="flex items-center justify-between flex-1 gap-2 ml-5">
                  <div
                    className={`text-left ${fontColor.black}`}
                    style={{ maxWidth: "90%" }}
                  >
                    <div className="text-xs font-semibold truncate sm:text-sm">
                      {game.Place.placeName}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                      {toDistrictOnly(game.Place.location)}
                    </div>
                  </div>
                </div>

                {/* 인원 */}
                <div className="w-20 text-xs text-right text-gray-600 sm:text-sm">
                  {game.Payments.length}명 / {game.numOfMember}명
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          해당 날짜에 게임이 없습니다.
        </div>
      )}
    </div>
  );
}
