"use client";

import { BsCalendar2DateFill } from "react-icons/bs";
import { IoIosTime } from "react-icons/io";

export default function GameTimeInfoCard({ date }: { date: string }) {
  // 날짜 유효성 체크
  const parseDate = (d: string) => {
    if (!d) return null;

    // 공백 포함 문자열을 ISO 형식으로 변환
    // 예: "2025-11-16 15:00" -> "2025-11-16T15:00"
    const fixed = d.replace(" ", "T");

    const parsed = new Date(fixed);

    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const gameDate = parseDate(date);

  // 날짜가 유효하지 않을 경우 표시
  if (!gameDate) {
    return (
      <div className="text-sm text-red-600">날짜 정보가 올바르지 않습니다.</div>
    );
  }

  // 한국 시간 변환
  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간제 적용
  };

  const formattedDate = new Intl.DateTimeFormat("ko-KR", optionsDate).format(
    gameDate
  );
  const formattedTime = new Intl.DateTimeFormat("ko-KR", optionsTime).format(
    gameDate
  );

  return (
    <div className="space-y-4 text-sm leading-relaxed text-gray-800">
      {/* 날짜 */}
      <div className="flex items-center gap-2 font-semibold">
        <BsCalendar2DateFill className="text-blue-400" />
        <span>날짜:</span>
        <span className="font-normal">{formattedDate}</span>
      </div>

      {/* 시간 */}
      <div className="flex items-center gap-2 font-semibold">
        <IoIosTime className="text-blue-400" />
        <span>시간:</span>
        <span className="font-normal">{formattedTime}</span>
      </div>
    </div>
  );
}
