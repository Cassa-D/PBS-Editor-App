import { RotateCcw, Save } from "lucide-react";
import DeleteButton from "./DeleteButton.tsx";
import { theme } from "@theme/colors.ts";

interface ActionButtonsProps {
  onReset: () => void;
  onDelete: () => void;
  onSave: () => void;
  dirty: boolean;
}

const ActionButtons = ({
  onReset,
  onDelete,
  onSave,
  dirty,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      <button
        disabled={!dirty}
        onClick={onReset}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          shadow-sm cursor-pointer
          ${theme.colors.button.primary}`}
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
      <button
        disabled={!dirty}
        onClick={onSave}
        className={`flex items-center
          ${dirty ? theme.colors.accent.success : theme.colors.button.primary} gap-2 px-4 py-2 shadow-sm rounded-lg transition-colors cursor-pointer`}
      >
        <Save className="w-5 h-5" />
        Save Changes
      </button>
      <DeleteButton
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
};

export default ActionButtons;
