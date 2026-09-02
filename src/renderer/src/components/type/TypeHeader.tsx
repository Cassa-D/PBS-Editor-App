import type { Type } from "@models/Type.ts";
import ActionButtons from "@components/ui/ActionButtons.tsx";
import TypeBubble from "@components/ui/TypeBubble.tsx";

interface TypeHeaderProps {
  type: Type;
  onSave: () => void;
  onReset: () => void;
  onDelete: () => void;
  dirty: boolean;
}

const TypeHeader = ({ type, onSave, onReset, onDelete, dirty }: TypeHeaderProps) => {
  return (
    <div className="p-6 h-25 bg-slate-800 border-b-3 border-slate-700 shadow-sm">
      <div className="flex h-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{type.name}</h1>
          <div className="flex items-center gap-4 mt-1">
            <TypeBubble type={type.id} />
          </div>
        </div>
        <ActionButtons onReset={onReset} onDelete={onDelete} onSave={onSave} dirty={dirty} />
      </div>
    </div>
  );
};

export default TypeHeader;
