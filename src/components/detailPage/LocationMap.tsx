import { useEffect } from "react";
import { Button } from "../ui/button";
import { FaRegCopy } from "react-icons/fa6";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function LocationMap({ address }: { address: string }) {
  const baseAddress = address?.split("/")[0]?.trim(); // '/' 또는 ',' 기준 분리 가능
  const detailAddress = address?.split("/")[1]?.trim();
  const handleCopyLocation = (location: string) => {
    navigator.clipboard
      .writeText(location)
      .then(() => {
        alert("주소가 복사되었습니다!");
      })
      .catch(() => {
        alert("복사에 실패했습니다. 브라우저 설정을 확인하세요.");
      });
  };

  useEffect(() => {
    if (!baseAddress) return;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(
          baseAddress,
          function (result: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );
              const container = document.getElementById("map");
              const options = {
                center: coords,
                level: 3,
              };

              const map = new window.kakao.maps.Map(container, options);
              new window.kakao.maps.Marker({ map, position: coords });
            }
          }
        );
      });
    };

    document.head.appendChild(script);
  }, [baseAddress]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">위치</h2>
      <div className="flex items-center gap-2">
        <span>
          {baseAddress} {detailAddress}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="p-1"
          onClick={() => handleCopyLocation(address || "")}
        >
          <FaRegCopy />
        </Button>
      </div>
      <div id="map" className="w-full border border-gray-300 h-72 rounded-xl" />
    </div>
  );
}
