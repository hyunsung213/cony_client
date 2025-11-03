"use client";

import GameCard from "@/components/mainPage/GameCard";
import GameList from "@/components/mainPage/GameList";
import { fontColor } from "@/styles/color";

export default function Home() {
  return (
    <div className="relative flex flex-col w-full min-h-screen px-4 overflow-x-hidden">
      <div className="max-w-screen-lg pt-4 mx-auto -mb-2">
        <h2 className="sm:text-2xl text-[#ec802b] font-semibold text-xl">
          🔥 오늘의 게임 🔥
        </h2>
      </div>

      <div className="relative z-20 flex items-center justify-center w-full">
        <GameCard />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full pb-20 ">
        <GameList />
      </div>
    </div>
  );
}
