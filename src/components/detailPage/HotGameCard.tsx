import { brandColors } from "@/styles/color";

export default function HotGameCard() {
  return (
    <div
      className="flex items-center justify-center w-full gap-4 p-3 bg-white border shadow rounded-2xl"
      style={{ borderColor: brandColors.deepOrange }}
    >
      <img
        src="/images/badminton.png"
        className="object-contain w-10 h-10 opacity-100"
        alt="Badminton"
      />
      <span className="font-semibold tracking-wide text-gray-700 text-md">
        강서구에서 가장 관심받는 게임!
      </span>
    </div>
  );
}
