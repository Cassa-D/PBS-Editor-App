import React from "react";
import Modal from "./Modal.tsx";
import ImportComponent from "@components/import/ImportComponent.tsx";

interface SettingsModalProps {
  triggerElement: React.ReactNode;
}

const SettingsModal = ({ triggerElement }: SettingsModalProps) => {
  return (
    <Modal
      triggerElement={triggerElement}
      title="Settings"
      maxWidth="max-w-4xl"
      contentClass="max-h-[80vh] overflow-y-auto"
      showCloseButton={true}
      onClose={() => {}}
    >
      <div className="border-t border-slate-700/50 pt-4">
        <ImportComponent />
      </div>
    </Modal>
  );
};

export default SettingsModal;
