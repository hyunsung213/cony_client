import { LiaRestroomSolid } from "react-icons/lia";
import { FaShower } from "react-icons/fa6";
import { GiShuttlecock } from "react-icons/gi";
import { FaParking } from "react-icons/fa";
import { FaHouseUser } from "react-icons/fa";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import { is } from "date-fns/locale";

export const optionList = [
  { icon: LiaRestroomSolid, ename: "isToilet", label: "화장실" },
  { icon: FaShower, ename: "isShowerRoom", label: "샤워실" },
  { icon: FaParking, ename: "isParkingLot", label: "주차장" },
  { icon: FaHouseUser, ename: "isIndoor", label: "실내" },
  { icon: FaGlassWaterDroplet, ename: "isWater", label: "정수기" },
];

export const PlaceBasicOption = {
  isIndoor: false,
  isParkingLot: false,
  isShowerRoom: false,
  isToilet: false,
  isWater: false,
  optionId: 0,
  placeId: 0,
};
