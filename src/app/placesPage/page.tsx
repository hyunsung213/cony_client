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
                  <div>
                    <Label>시간</Label>
                    <Input
                      type="time"
                      value={gameData.time}
                      onChange={(e) =>
                        setGameData({ ...gameData, time: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>인원</Label>
                    <Input
                      type="number"
                      value={gameData.numOfMember}
                      onChange={(e) =>
                        setGameData({
                          ...gameData,
                          numOfMember: Number(e.target.value),
                        })
                      }
                      placeholder="예: 8"
                    />
                  </div>
                  <div>
                    <Label>가격</Label>
                    <Input
                      type="number"
                      value={gameData.cost}
                      onChange={(e) =>
                        setGameData({
                          ...gameData,
                          cost: Number(e.target.value),
                        })
                      }
                      placeholder="예: 10000"
                    />
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
