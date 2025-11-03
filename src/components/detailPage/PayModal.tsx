"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameDetail } from "@/utils/interface/game";
import { IPayment } from "@/utils/interface/payment";
import { postPayment } from "@/utils/post";

export default function PayModal({
  open,
  game,
  onClose,
}: {
  open: boolean;
  game?: GameDetail;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<IPayment>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value } as IPayment));
  };

  const handleNextStep = () => {
    if (!userInfo?.userName || !userInfo.userPhoneNum || !userInfo.userEmail) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    setStep(2);
  };

  const handleSubmitApplication = async (payment: IPayment) => {
    setIsLoading(true);
    try {
      await postPayment(payment);
      alert(
        "신청이 접수되었습니다. 입금 확인까지 시간이 소요됩니다. (최대 1시간)"
      );
      handleClose();
      router.push("/");
    } catch (error) {
      console.error("신청 접수 실패:", error);
      alert("신청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setUserInfo(undefined);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold sm:text-xl">
            {step === 1 ? "신청자 정보 입력" : "입금 안내"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="grid gap-5 py-5 text-sm sm:text-base">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  name="userName"
                  value={userInfo?.userName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="홍길동"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="phone" className="text-right">
                  전화번호
                </Label>
                <Input
                  id="phone"
                  name="userPhoneNum"
                  value={userInfo?.userPhoneNum}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="010-1234-5678"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="email"
                  name="userEmail"
                  value={userInfo?.userEmail}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <p className="px-1 text-xs leading-relaxed text-red-600">
              ❗️ <span className="font-bold">계좌이체 시 입금자명</span>은
              반드시 신청자 이름과 동일해야 합니다.
            </p>
            <p className="px-1 mt-1 text-xs leading-relaxed text-gray-700">
              ❗️ 취소 시 연락 바랍니다.{" "}
              <span className="font-bold">010-2655-6262</span>
            </p>
            <DialogFooter>
              <Button variant="ghost" onClick={handleClose}>
                취소
              </Button>
              <Button onClick={handleNextStep}>다음</Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <div className="py-5 space-y-4 text-sm leading-relaxed sm:text-base">
              <p className="text-base font-bold">아래 계좌로 입금해주세요.</p>

              <div className="p-4 space-y-1 border rounded-md bg-gray-50">
                <p>🎮 게임: {game?.Place.placeName || "게임 이름"}</p>
                <p>
                  💰 입금할 금액:{" "}
                  <span className="font-bold text-blue-600">
                    {game?.cost}원
                  </span>
                </p>
              </div>

              <div className="p-4 space-y-1 border rounded-md bg-gray-50">
                <p>
                  🏦 은행: <span className="font-bold">신한은행</span>
                </p>
                <p>
                  💳 계좌번호: <span className="font-bold">110-446-821163</span>
                </p>
                <p>
                  👤 예금주: <span className="font-bold">신현성</span>
                </p>
              </div>

              <p className="px-1 text-sm font-medium text-red-600">
                ❗️ 관리자가 직접 입금 내역을 확인하므로,
                <br />
                <span className="font-bold">
                  확인까지 일정 시간(최대 1시간)이 소요될 수 있습니다.
                </span>
              </p>
              <p className="px-1 text-xs text-gray-600">
                * 입금 확인 후 신청 시 입력하신 전화번호(
                {userInfo?.userPhoneNum}
                )로 안내 문자가 발송됩니다.
              </p>
            </div>
            <DialogFooter className="flex justify-between w-full">
              <Button variant="ghost" onClick={() => setStep(1)}>
                뒤로
              </Button>
              <Button
                onClick={() =>
                  handleSubmitApplication({
                    gameId: game?.gameId ?? 0,
                    ...userInfo,
                  } as IPayment)
                }
                disabled={isLoading}
              >
                {isLoading ? "신청 중..." : "입금 대기 (신청 완료)"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
