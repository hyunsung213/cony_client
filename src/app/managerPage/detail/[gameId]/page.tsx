"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { Game, GameDetail } from "@/utils/interface/game";
import { Payment } from "@/utils/interface/payment";
import { updateConfirmPayment, updateDenyPayment } from "@/utils/update";
import { getGameDetail } from "@/utils/get";
import { set } from "date-fns";
import { deletePayment } from "@/utils/delete";

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.gameId;
  const [game, setGame] = useState<GameDetail | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 승인 버튼 클릭 시
  const handleApprove = async (gameId: number, userPhoneNum: string) => {
    try {
      await updateConfirmPayment(gameId, userPhoneNum);
      setPayments((prev) =>
        prev.map((p) =>
          p.userPhoneNum === userPhoneNum ? { ...p, isConfirmed: true } : p
        )
      );
    } catch (err) {
      console.error("승인 실패:", err);
    }
  };

  // ✅ 승인 취소 요청
  const handleCancel = async (gameId: number, userPhoneNum: string) => {
    try {
      await updateDenyPayment(gameId, userPhoneNum);
      setPayments((prev) =>
        prev.map((p) =>
          p.userPhoneNum === userPhoneNum ? { ...p, isConfirmed: false } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("승인 취소 실패");
    }
  };

  const fetchGame = async (gameId: number) => {
    setLoading(true);
    try {
      const resultGame = await getGameDetail(gameId);
      setGame(resultGame || null);
      setPayments(resultGame?.Payments || []);
      console.log("게임: ", resultGame);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGame(Number(gameId));
    }
  }, [gameId]);

  const confirmed = payments.filter((p) => p.isConfirmed);
  const pending = payments.filter((p) => !p.isConfirmed);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        로딩 중...
      </div>
    );

  return (
    <div className="flex flex-col w-full max-w-screen-lg min-h-screen px-1 py-4 mx-auto sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">게임 참여자 관리</h1>

      <div className="grid h-full grid-cols-1 gap-6 sm:grid-cols-2">
        {/* 왼쪽 - 미승인 */}
        <Card className="flex flex-col justify-start p-4">
          <CardHeader className="text-lg font-semibold text-red-600">
            미승인 참여자
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {pending.length > 0 ? (
              pending.map((p) => (
                <div
                  key={p.paymentId}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{p.userName}</p>
                    <p className="text-sm text-gray-500">{p.userPhoneNum}</p>
                  </div>
                  <Button
                    onClick={() => handleApprove(p.gameId, p.userPhoneNum)}
                  >
                    승인
                  </Button>
                </div>
              ))
            ) : (
              <p className="mt-4 text-center text-gray-500">
                대기 중인 인원이 없습니다.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 오른쪽 - 승인됨 */}
        <Card className="flex flex-col justify-start p-4">
          <CardHeader className="text-lg font-semibold text-green-600">
            승인된 참여자
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {confirmed.length > 0 ? (
              confirmed.map((p) => (
                <div
                  key={p.paymentId}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{p.userName}</p>
                    <p className="text-sm text-gray-500">{p.userPhoneNum}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCancel(p.gameId, p.userPhoneNum)}
                    className="font-semibold text-red-600 transition-all bg-white border border-red-500 hover:bg-red-600 hover:text-white hover:border-red-600"
                  >
                    승인 취소
                  </Button>
                </div>
              ))
            ) : (
              <p className="mt-4 text-center text-gray-500">
                아직 승인된 인원이 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
