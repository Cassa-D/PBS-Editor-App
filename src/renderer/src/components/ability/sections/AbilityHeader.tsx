import ActionButtons from "@components/ui/ActionButtons";
import React from "react";
import type { Ability } from "@lib/models/Ability";

interface AbilityHeaderProps {
  ability: Ability;
  onSave: () => void;
  onReset: () => void;
  onDelete: () => void;
  dirty: boolean;
}

const AbilityHeader: React.FC<AbilityHeaderProps> = ({
  ability,
  onSave,
  onReset,
  onDelete,
  dirty,
}) => {
  return (
    <div className="p-6 h-25 bg-slate-800 border-b-3 border-slate-700 shadow-sm">
      <div className="flex h-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ability.name}</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-300">[ {ability.id} ]</p>
          </div>
        </div>
        <ActionButtons onSave={onSave} onReset={onReset} onDelete={onDelete} dirty={dirty} />
      </div>
    </div>
  );
};

export default AbilityHeader;
