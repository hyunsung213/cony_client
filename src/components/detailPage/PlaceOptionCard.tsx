"use Client";

import { optionList } from "@/lib/option";
import { Option } from "@/utils/interface/option";

export default function PlaceOptionCard({ option }: { option: Option }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(option)
        .filter(([key, value]) => value)
        .map(([key]) => {
          const opt = optionList.find((o) => o.ename === key);
          if (!opt) return null;
          return (
            <div key={key} className="flex items-center gap-2 text-gray-700">
              <opt.icon size={20} />
              <span className="text-sm">{opt.label}</span>
            </div>
          );
        })}
    </div>
  );
}
