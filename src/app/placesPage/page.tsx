"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { getAllPlaceDetail } from "@/utils/get";
import { PlaceDetail } from "@/utils/interface/place";
import { postGame, postPhoto } from "@/utils/post";
import { deletePhoto } from "@/utils/delete";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Slider } from "@/components/ui/slider";

interface Photo {
  photoId: number;
  url: string;
}

export default function PlaceManagementPage() {
  const [places, setPlaces] = useState<PlaceDetail[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [open, setOpen] = useState(false);

  // 게임 생성용 상태
  const [gameData, setGameData] = useState({
    date: "",
    time: "",
    numOfMember: 0,
    cost: 0,
  });

  const fetchPlaces = async () => {
    const data = await getAllPlaceDetail();
    setPlaces(data || []);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // 선택된 장소의 사진 불러오기
  useEffect(() => {
    if (!selectedPlace) return;
    const place = places.find((p) => p.placeId === selectedPlace);
    if (place && place.Photos) {
      const formatted = place.Photos.map((photo: any) => ({
        photoId: photo.photoId,
        url: `${process.env.NEXT_PUBLIC_API_URL}${photo.photoUrl}`,
      }));
      setPhotos(formatted);
    } else {
      setPhotos([]);
    }
  }, [selectedPlace, places]);

  // 게임 생성
  const handleCreateGame = async () => {
    if (!selectedPlace) return alert("장소를 선택해주세요.");
    if (!gameData.date || !gameData.time)
      return alert("날짜와 시간을 모두 입력해주세요.");

    // 날짜 + 시간 결합
    const datetime = `${gameData.date} ${gameData.time}`;

    await postGame({
      placeId: selectedPlace,
      date: datetime, // string으로 전달
      numOfMember: gameData.numOfMember,
      cost: gameData.cost,
    });

    alert("게임이 생성되었습니다!");
    setOpen(false);
  };

  // 사진 업로드
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files?.length || !selectedPlace) return;

      const files = Array.from(e.target.files);
      await Promise.all(files.map((file) => postPhoto(selectedPlace, file)));

      // 업로드 후 최신 데이터 반영
      const updatedPlaces = await getAllPlaceDetail();
      setPlaces(updatedPlaces || []);
    } catch (err) {
      console.error("사진 업로드 실패:", err);
      alert("사진 업로드 중 문제가 발생했습니다.");
    }
  };

  // 사진 삭제
  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deletePhoto(photoId);

      const updatedPlaces = await getAllPlaceDetail();
      setPlaces(updatedPlaces || []);
    } catch (err) {
      console.error("사진 삭제 실패:", err);
      alert("사진 삭제 중 문제가 발생했습니다.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full max-w-screen-lg min-h-screen px-1 py-6 mx-auto sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>장소 관리</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 장소 선택 */}
            <div>
              <Label>장소 선택</Label>
              <Select onValueChange={(val) => setSelectedPlace(Number(val))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="장소를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((p) => (
                    <SelectItem key={p.placeId} value={String(p.placeId)}>
                      {p.placeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 게임 생성 다이얼로그 */}
            <Button onClick={() => setOpen(true)} disabled={!selectedPlace}>
              게임 생성
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>게임 생성</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {/* 날짜 선택 */}
                  <div>
                    <Label>날짜</Label>
                    <Input
                      type="date"
                      value={gameData.date}
                      onChange={(e) =>
                        setGameData({ ...gameData, date: e.target.value })
                      }
                    />
                  </div>

                  {/* 시간 선택 */}
                  <div>
                    <Label>시간</Label>
                    <div className="flex gap-3 mt-1">
                      {/* 시 선택 */}
                      <Select
                        value={gameData.time.split(":")[0] || ""}
                        onValueChange={(hour) => {
                          const [_, minute = "00"] = gameData.time.split(":");
                          setGameData({
                            ...gameData,
                            time: `${hour}:${minute}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-1/2">
                          <SelectValue placeholder="시" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {Array.from({ length: 18 }, (_, i) => i + 6).map(
                            (hour) => (
                              <SelectItem
                                key={hour}
                                value={String(hour).padStart(2, "0")}
                              >
                                {hour}시
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      {/* 분 선택 */}
                      <Select
                        value={gameData.time.split(":")[1] || ""}
                        onValueChange={(minute) => {
                          const [hour = "06"] = gameData.time.split(":");
                          setGameData({
                            ...gameData,
                            time: `${hour}:${minute}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-1/2">
                          <SelectValue placeholder="분" />
                        </SelectTrigger>
                        <SelectContent>
                          {["00", "10", "20", "30", "40", "50"].map(
                            (minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}분
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {gameData.time && (
                      <p className="mt-2 text-sm font-semibold text-blue-600">
                        선택된 시간: {gameData.time}
                      </p>
                    )}
                  </div>

                  {/* 인원 선택 (슬라이더) */}
                  <div className="mt-4">
                    <Label>인원</Label>
                    <div className="mt-3">
                      <Slider
                        value={[gameData.numOfMember]}
                        onValueChange={(val) =>
                          setGameData({
                            ...gameData,
                            numOfMember: Math.round(val[0]),
                          })
                        }
                        min={2}
                        max={8}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>2명</span>
                        <span className="font-semibold text-blue-600">
                          {gameData.numOfMember}명
                        </span>
                        <span>8명</span>
                      </div>
                    </div>
                  </div>

                  {/* 가격 선택 (슬라이더) */}
                  <div className="mt-4">
                    <Label>가격</Label>
                    <div className="mt-3">
                      <Slider
                        value={[gameData.cost]}
                        onValueChange={(val) =>
                          setGameData({
                            ...gameData,
                            cost: Math.round(val[0] / 1000) * 1000,
                          })
                        }
                        min={0}
                        max={20000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>0원</span>
                        <span className="font-semibold text-blue-600">
                          {gameData.cost.toLocaleString()}원
                        </span>
                        <span>20,000원</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleCreateGame}>생성</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 사진 관리 */}
            {selectedPlace && (
              <div>
                <Label>장소 사진 관리</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input type="file" multiple onChange={handlePhotoUpload} />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {photos.map((photo) => (
                    <div key={photo.photoId} className="relative group">
                      <Image
                        src={photo.url}
                        alt="place photo"
                        width={200}
                        height={150}
                        className="object-cover w-full rounded-lg h-36"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute transition opacity-0 top-1 right-1 group-hover:opacity-100"
                        onClick={() => handleDeletePhoto(photo.photoId)}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
