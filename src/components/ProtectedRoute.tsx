"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ACCESS_PASSWORD = "james213!"; // ✅ 여기에 관리용 비밀번호 설정

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("authorized");
    if (savedAuth === "true") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ACCESS_PASSWORD) {
      setAuthorized(true);
      sessionStorage.setItem("authorized", "true");
    } else {
      setError("비밀번호가 틀렸습니다.");
      setTimeout(() => {
        router.push("/"); // mainPage로 이동
      }, 1000);
    }
  };

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-xl font-bold">관리자 페이지 접근</h2>
        <form onSubmit={handleSubmit} className="flex flex-col w-64 gap-2">
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            입장
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
