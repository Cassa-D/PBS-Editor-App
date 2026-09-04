import { memo, type MutableRefObject } from "react";
import type { Type } from "@models/Type.ts";

interface TypeListItemProps {
  type: Type;
  selectedType: Type | null;
  typeRefs: MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  selectAndScrollToType: (type: Type) => void;
}

const TypeListItem = ({ type, selectedType, typeRefs, selectAndScrollToType }: TypeListItemProps) => {
  return (
    <div
      key={type.id}
      ref={(el) => {
        typeRefs.current[type.id] = el;
      }}
      className={`p-3 border-b border-slate-500 bg-gradient-to-r from-slate-800/10 to-slate-800 cursor-pointer transition-colors ${
        selectedType?.id === type.id ? "bg-blue-600/20 border-l-4 border-l-blue-600/40" : "hover:bg-slate-600/40"
      }`}
      onClick={() => selectAndScrollToType(type)}
    >
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 min-w-0">
          <div className="pl-3 font-medium truncate text-medium">{type.name}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(TypeListItem);
