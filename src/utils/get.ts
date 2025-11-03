import apiClient from "./api";
import { GameDetail } from "./interface/game";
import { PlaceDetail } from "./interface/place";

export interface DateFilter {
  startDate: string;
  endDate: string;
}

// 모든 게임 디테일 정보 가져오기
export async function getAllGameDetail() {
  try {
    const response = await apiClient.get<GameDetail[]>(`/games`);
    return response.data;
  } catch (error) {
    console.log("모든 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 게임 디테일 정보 가져오기
export async function getGameDetail(gameId: number) {
  try {
    const response = await apiClient.get<GameDetail>(`/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.log("GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 날짜별 게임 디테일 정보 가져오기
export async function getGameDetailByDate(data: DateFilter) {
  try {
    console.log(data);
    const response = await apiClient.get<GameDetail[]>(`/games/date`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.log("날짜별로 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 장소 정보 가져오기
export async function getAllPlaceDetail() {
  try {
    const response = await apiClient.get<PlaceDetail[]>(`/places`);
    return response.data;
  } catch (error) {
    console.log("GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}
