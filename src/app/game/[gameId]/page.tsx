"use client";

import HotGameCard from "@/components/detailPage/HotGameCard";
import PlaceNoteCard from "@/components/detailPage/PlaceNoteCard";
import PlaceOptionCard from "@/components/detailPage/PlaceOptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceBasicNote } from "@/lib/note";
import { PlaceBasicOption } from "@/lib/option";
import { Image } from "@radix-ui/react-avatar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiShare } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { set } from "date-fns";
import { is } from "date-fns/locale";
import GameInfoCard from "@/components/detailPage/GameInfoCard";
import { FaRegCopy } from "react-icons/fa";
import LocationMap from "@/components/detailPage/LocationMap";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { bgColor, fontColor } from "@/styles/color";
import PayModal from "@/components/detailPage/PayModal";
import { GameDetail } from "@/utils/interface/game";
import { getGameDetail } from "@/utils/get";

interface Props {
  params: Promise<{ gameId: string }>;
}

export default function GameDetailPage() {
  const params = useParams();
  const gameId = Number(params?.gameId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState<GameDetail>();
  const [isLiked, setIsLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const router = useRouter();

  // GameList 불러오기
  const fetchGames = async () => {
    setLoading(true);
    try {
      const resultGame = await getGameDetail(gameId);
      console.log(resultGame);
      setGame(resultGame);
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

  // URL 복사 기능
  const handleCopyUrl = () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      // Web Share API 지원 (모바일)
      navigator
        .share({
          title: "스포츠 플랫폼",
          text: "이 경기를 같이 확인해보세요!",
          url: currentUrl,
        })
        .catch((err) => {
          console.warn("공유 실패:", err);
        });
    } else if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      // 클립보드 복사 지원 (데스크탑 or 일부 모바일)
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          alert("현재 페이지 URL이 복사되었습니다!");
        })
        .catch(() => {
          alert("복사에 실패했습니다. 브라우저 설정을 확인하세요.");
        });
    } else {
      // 완전히 지원되지 않는 브라우저
      alert("URL 복사를 지원하지 않는 브라우저입니다.");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchGames();
    };
    fetchAll();
  }, []);

  const images =
    game?.Place?.Photos?.map((photo) => getPhotoByURL(photo.photoUrl)) ?? [];
  const fallback = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="max-w-screen-lg p-4 mx-auto space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        {/* 상단 이미지 영역 (반응형) */}
        <div
          className={`w-full gap-4 sm:p-4 overflow-hidden ${bgColor.skyblue} border border-gray-200 shadow-sm cursor-pointer rounded-lg 
  flex flex-col sm:grid sm:grid-cols-4`}
          onClick={() => setOpen(true)}
        >
          {/* 메인 이미지 */}
          <div className="w-full sm:col-span-2">
            {images[0] ? (
              <div className="w-full h-[240px] sm:h-[400px] overflow-hidden rounded-lg">
                <img
                  src={images[0]}
                  alt={game?.Place?.placeName || "장소 이미지"}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-[240px] rounded-lg bg-gray-100 text-sm text-gray-500">
                이미지 없음
              </div>
            )}
          </div>

          {/* 서브 이미지 (PC만 보임) */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 sm:col-span-2">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="w-full h-[200px] relative overflow-hidden rounded-lg"
              >
                {images[idx] ? (
                  <img
                    src={images[idx]}
                    alt={`image-${idx}`}
                    className="absolute inset-0 object-cover w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center w-full h-full text-sm text-gray-500 bg-gray-100">
                    이미지 없음
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 모달 안 전체 이미지 리스트 */}
        <DialogContent
          className="w-full max-w-[95vw] sm:max-w-screen-md mx-auto sm:max-h-[90vh] sm:overflow-y-auto p-0 rounded-lg
  "
        >
          {" "}
          <DialogTitle className="p-4">전체 이미지 보기</DialogTitle>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 max-h-[70vh] overflow-y-auto">
            {images.length > 0 ? (
              images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`gallery-${i}`}
                  className="object-contain w-full rounded-lg"
                />
              ))
            ) : (
              <p className="text-gray-400">이미지가 없습니다.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 게임 정보 카드 */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col items-start justify-between w-full">
          {/* 장소 정보 */}
          <div className="flex items-start justify-between w-full">
            {/* 장소 정보 */}
            <div className="w-3/4 space-y-1">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {game?.Place?.placeName}
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                {game?.Place?.location?.split("/")?.[0]}
              </p>
            </div>
            {/* 아이콘 버튼 */}
            <div className="flex items-center justify-end w-1/4 gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 cursor-pointer hover:bg-gray-100"
                onClick={() => handleCopyUrl()}
              >
                <FiShare className="text-gray-600" />
              </Button>
            </div>
          </div>
          <div className="w-full my-2 border-t border-blue-400" />{" "}
          {/* 구분선 */}
          {/* 왼쪽 메인 정보 */}
          <div className="w-full space-y-4 pointer-events-none lg:flex-2">
            {/* 편의시설 & 상세 정보 */}
            <PlaceOptionCard option={game?.Place?.Option || PlaceBasicOption} />
            <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
            {/* {game?.Us && <RateCard users={game.Users} />} */}
            {/* <div className="my-2 border-t border-blue-400" /> 구분선 */}
            <PlaceNoteCard note={game?.Place?.Note || PlaceBasicNote} />
            <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          </div>
        </div>

        <div className="w-full space-y-4 lg:sticky lg:top-24 lg:self-start lg:w-1/2">
          {/* 인기 게임 카드 */}
          {/* <div className="hidden lg:block">
            <HotGameCard />
          </div> */}

          {/* 게임 정보 카드 - PC에서만 보임 */}
          <div className="hidden lg:block">
            <GameInfoCard game={game} />
          </div>

          {/* 모바일 하단 고정 버튼 */}
          <div className="fixed bottom-0 left-0 z-50 w-full px-4 py-3 bg-white sm:block lg:hidden">
            {game?.isRecruiting ? (
              <Button
                className={`w-full pt-0 pb-0 text-base ${fontColor.white} ${bgColor.orange} hover:${bgColor.deepOrange}`}
                onClick={() => {
                  setIsPayOpen(true);
                }}
              >
                신청하기
              </Button>
            ) : (
              <Button
                disabled
                className="w-full py-2 text-base text-white bg-gray-400 cursor-not-allowed"
              >
                마감되었습니다
              </Button>
            )}
          </div>

          <PayModal
            open={isPayOpen}
            game={game}
            onClose={() => setIsPayOpen(false)}
          />
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="overflow-hidden pb-15 sm:pb-0">
        <LocationMap address={game?.Place?.location || ""} />
      </div>
    </div>
  );
}
