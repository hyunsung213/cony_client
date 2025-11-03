import { Game } from "./game";
import { Note } from "./note";
import { Option } from "./option";
import { Photo } from "./photo";

export interface Place {
  placeId: number;
  placeName: string;
  location: string;
}

export interface IPlace {
  placeName: string;
  location: string;
}

export interface PlaceDetail {
  placeId: number;
  placeName: string;
  location: string;
  Option: Option;
  Note: Note;
  Photos: Photo[];
}

export interface PlaceDetailWithGames {
  placeId: number;
  placeName: string;
  location: string;
  Option: Option;
  Note: Note;
  Photos: Photo[];
  Games: Game[];
}
