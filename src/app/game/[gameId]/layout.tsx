// layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import { GameDetail } from "@/utils/interface/game";
import { getGameDetail } from "@/utils/get";

// layout Props
type LayoutProps = {
  children: ReactNode;
  params: { gameId: string };
};

// generateMetadata 전용 Params 타입
type GenerateMetadataParams = {
  params: { gameId: string };
};

// ----------------------------
// 서버 컴포넌트 전용: OG 메타 동적 생성
// ----------------------------
export async function generateMetadata({
  params,
}: GenerateMetadataParams): Promise<Metadata> {
  const gameId = Number(params.gameId);
  const game = await getGameDetail(gameId);

  const imageUrl =
    game?.Place?.Photos?.[0] || "https://cony.vercel.app/og-default.jpg";

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
export default async function GameLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
