import { ReactNode } from "react";
import { Metadata } from "next";
import { GameDetail } from "@/utils/interface/game";
import { getGameDetail } from "@/utils/get";

type Props = {
  children: ReactNode;
  params: { id: string };
};

// ----------------------------
// layout 단에서 동적 메타 생성
// ----------------------------
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const gameId = Number(params.id);
  const game = await getGameDetail(gameId);

  const imageUrl = game?.Place?.Photos?.[0]
    ? `https://cony-backend.onrender.com${game.Place.Photos[0]}`
    : "https://cony.vercel.app/og-default.jpg";

  return {
    title: `Cony - ${game?.Place?.placeName || "배드민턴 경기"}`,
    description: `${game?.date}`,
    openGraph: {
      title: `Cony - ${game?.Place?.placeName || "배드민턴 경기"}`,
      description: `${game?.date}`,
      url: `https://cony.vercel.app/game/${gameId}`,
      siteName: "Cony",
      images: [
        {
          url: `${game?.Place?.Photos[0]}`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
  };
}

// ----------------------------
// layout 컴포넌트
// ----------------------------
export default async function GameLayout({ children }: Props) {
  return <>{children}</>;
}
