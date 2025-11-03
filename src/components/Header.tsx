"use client";

import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { bgColor, brandColors, fontColor } from "@/styles/color";
import { FaStar } from "react-icons/fa";
export default function Header() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b shadow-sm sm:static">
      <div className="w-full px-4 sm:px-6">
        {/* ✅ 이 부분을 감싸는 div에 max-width 적용 */}
        <div className="flex items-center justify-between w-full max-w-screen-lg mx-auto h-15 sm:p-5">
          {/* 왼쪽 로고 */}
          <div
            className="flex items-center space-x-2 cursor-pointer sm:space-x-3"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="로고"
              width={80}
              height={80}
              className="w-[60px] h-[40px] sm:w-[80px] sm:h-[60px] pt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => router.push("/managerPage")}>
              <FaStar size={20} color={brandColors.teal26} />
            </Button>
            <Button variant="ghost" onClick={() => router.push("/placesPage")}>
              <FaStar size={20} color={brandColors.teal26} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
