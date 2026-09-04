import { memo, useEffect, useState } from "react";
import Autocomplete from "@components/ui/Autocomplete.tsx";
import { X } from "lucide-react";

interface TypeEntryProps {
  type: string;
  options?: string[];
  onTypeChange: (type: string) => void;
  onRemove: () => void;
}

const TypeEntry = ({ type, onTypeChange, onRemove, options = [] }: TypeEntryProps) => {
  const [typeName, setTypeName] = useState<string>(type);

  useEffect(() => {
    setTypeName(type);
  }, [type]);

  return (
    <div
      tabIndex={-1}
      className="flex items-center gap-1 p-1 py-2 shadow-md rounded-sm bg-slate-700/50 text-sm min-w-0"
    >
      <div className="flex-1 min-w-0">
        <Autocomplete
          value={typeName}
          onValueChange={setTypeName}
          options={type ? [...options, type] : options}
          placeholder="Enter move..."
          inputClass="rounded-none border-b border-t-0 border-l-0 border-r-0 focus:ring-transparent focus:border-blue-300"
          onBlur={() => onTypeChange(typeName)}
        />
      </div>
      <button onClick={onRemove} className="p-0.5 text-rose-300 hover:text-rose-500 flex-shrink-0 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default memo(TypeEntry);
