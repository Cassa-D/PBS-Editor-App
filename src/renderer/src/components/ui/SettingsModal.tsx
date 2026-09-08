import React from "react";
import Modal from "./Modal.tsx";
import ImportComponent from "@components/import/ImportComponent.tsx";
import InputField from "@components/ui/InputField.tsx";
import { useProjectContext } from "@providers/ProjectProvider.tsx";

interface SettingsModalProps {
  triggerElement: React.ReactNode;
}

const SettingsModal = ({ triggerElement }: SettingsModalProps) => {
  const { usesOldTypeBubble, setUsesOldTypeBubble } = useProjectContext();

  return (
    <Modal
      triggerElement={triggerElement}
      title="Settings"
      maxWidth="max-w-4xl"
      contentClass="max-h-[80vh] overflow-y-auto"
      showCloseButton={true}
      onClose={() => {}}
    >
      <div className="border-t border-slate-700/50 py-4">
        <ImportComponent />
      </div>
      <div className="border-t border-slate-700/50 py-4">
        <InputField
          label="Use old Type bubble"
          type="checkbox"
          value={usesOldTypeBubble}
          onChange={(value) => setUsesOldTypeBubble(value as boolean)}
        />
      </div>
    </Modal>
  );
};

export default SettingsModal;
