import { Payment } from "./payment";
import { PlaceDetail } from "./place";

export interface Game {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  isRecruiting: boolean;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGame {
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
}

export interface GameDetail {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  isRecruiting: boolean;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
  Place: PlaceDetail;
  Payments: Payment[];
}
