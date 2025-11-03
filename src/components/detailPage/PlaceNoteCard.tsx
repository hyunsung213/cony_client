"use Client";
import { Note } from "@/utils/interface/note";

export default function PlaceNoteCard({ note }: { note: Note }) {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-gray-800">
      {/* 찾아가는 길 */}
      <div>
        <div className="mb-2 font-semibold">■ 찾아가는 길</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>{note.direction}</li>
        </ul>
      </div>

      {/* 주차 */}
      <div>
        <div className="mb-2 font-semibold">■ 주차</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>{note.parking}</li>
        </ul>
      </div>

      {/* 흡연 */}
      <div>
        <div className="mb-2 font-semibold">■ 흡연</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>{note.smoking}</li>
        </ul>
      </div>

      {/* 기타 */}
      <div>
        <div className="mb-2 font-semibold">■ 기타</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>{note.etc}</li>
        </ul>
      </div>

      {/* 문의 */}
      <div>
        <div className="font-semibold">이외 문의 : 010-2655-6262</div>
      </div>

      {/* 하단 안내 */}
      <div className="space-y-2 text-xs text-gray-600">
        <p>
          ※ 구장 이용 중 각종 부상, 구장 기물, 용품 등 파손에 대한 책임은 참가자
          본인에게 있으며, 손해배상 청구되며 별도 보험처리가 되지 않음을 참고
          부탁드립니다.
        </p>
        <p>
          ※ 스포츠 서비스로 배드민턴하는 영상이 촬영되는 구장이니 영상 서비스
          많은 이용 부탁드리며 '상시 촬영' 되고 있으니 방문하시는 분들의 참고
          부탁드립니다.
        </p>
      </div>
    </div>
  );
}
