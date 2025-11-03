"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getAllGameDetail } from "@/utils/get";
import { GameDetail } from "@/utils/interface/game";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminGameListPage() {
  const [games, setGames] = useState<GameDetail[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameDetail[]>([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchGames();
  }, []);

  // 필터링 로직
  const handleFilter = () => {
    let result = [...games];

    if (searchDate) {
      const selectedDate = new Date(searchDate).toDateString();
      result = result.filter((g) => {
        const gameDate = new Date(g.date).toDateString();
        return gameDate === selectedDate;
      });
    }

    if (searchPhone) {
      result = result.filter((g) =>
        g.Payments?.some((p) => p.userPhoneNum.includes(searchPhone))
      );
    }

    setFilteredGames(result);
  };

  const resetFilter = () => {
    setSearchDate("");
    setSearchPhone("");
    setFilteredGames(games);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full max-w-screen-lg min-h-screen px-1 py-6 mx-auto sm:px-6">
        <h1 className="mb-4 text-2xl font-bold">📅 게임 신청 관리</h1>

        {/* --- 필터 영역 --- */}
        <form
          className="flex flex-col items-center gap-3 mb-6 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault(); // 페이지 리로드 방지
            handleFilter();
          }}
        >
          <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
            <Label className="text-sm font-medium">날짜 선택</Label>
            <Input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="sm:w-48"
            />
          </div>

          <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
            <Label className="text-sm font-medium">전화번호</Label>
            <Input
              type="text"
              placeholder="ex) 010-1234-5678"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="sm:w-48"
            />
          </div>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              type="submit" // submit 타입으로 변경
              className="bg-blue-600 hover:bg-blue-700"
            >
              조회
            </Button>
            <Button
              type="button" // submit이 되지 않도록
              variant="outline"
              onClick={resetFilter}
            >
              초기화
            </Button>
          </div>
        </form>

        {/* --- 게임 리스트 --- */}
        <div className="p-3 overflow-y-auto">
          {filteredGames.length === 0 ? (
            <p className="py-6 text-center text-gray-500">
              검색 조건에 맞는 게임이 없습니다.
            </p>
          ) : (
            filteredGames.map((game) => (
              <Link
                key={game.gameId}
                href={`/managerPage/detail/${game.gameId}`}
                className="block p-4 transition border border-gray-200 rounded-xl hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(game.date).toLocaleDateString()}{" "}
                      {new Date(game.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {game.Place?.placeName || "장소 정보 없음"}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    👥 {game.Payments?.filter((p) => p.isConfirmed).length ?? 0}{" "}
                    / {game.numOfMember}명
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
