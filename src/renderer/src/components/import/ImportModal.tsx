import React, { useState } from "react";
import Modal from "../ui/Modal.tsx";
import { usePokedexContext } from "@lib/providers/PokedexProvider";
import { FolderUp } from "lucide-react";
import { useToastNotifications } from "@lib/hooks/useToast";
import { Switch } from "radix-ui";
import { importMoves } from "@lib/services/importMoves";
import { importAbilities } from "@lib/services/importAbilities";
import { importItems } from "@lib/services/importItems";
import { useAlertContext } from "@providers/AlertProvider.tsx";
import type { Pokemon } from "@models/Pokemon.ts";
import { importTypes } from "@services/importTypes.ts";

interface ExportModalProps {
  triggerElement: React.ReactNode;
}

const ImportModal = ({ triggerElement }: ExportModalProps) => {
  const {
    setSelectedPokemon,
    setSelectedMove,
    setSelectedAbility,
    setSelectedItem,
    setSelectedType,
    importPokemonMerge,
    importPokemonOverride,
    importMovesMerge,
    importMovesOverride,
    importAbilitiesMerge,
    importAbilitiesOverride,
    importItemsMerge,
    importItemsOverride,
    importTypesMerge,
    importTypesOverride
  } = usePokedexContext();

  const [importMode, setImportMode] = useState<"Override" | "Merge">("Override");
  const [importChecked, setImportChecked] = useState(false);

  const { showWarning } = useAlertContext();
  const toast = useToastNotifications();

  const handleImportPokemon = async () => {
    const selectedFile: string = await window.electron.ipcRenderer.invoke("select-file");

    if (
      !selectedFile.includes("pokemon") &&
      !(await showWarning(
        "The file does not contain 'pokemon' on the name",
        "Are you shure you selected the correct file?"
      ))
    ) {
      return;
    }

    const content: string = await window.electron.ipcRenderer.invoke("read-file", selectedFile);

    try {
      let firstPokemon: Pokemon;
      if (importMode === "Merge") {
        firstPokemon = importPokemonMerge(content)[0];
        toast.showSuccess(`Successfully merged imported data with existing Pokemon.`, "Merge Successful");
      } else {
        firstPokemon = importPokemonOverride(content)[0];
        toast.showSuccess(`Successfully overridden existing Pokemon data.`, "Override Successful");
      }

      setSelectedPokemon(firstPokemon);
    } catch (error: any) {
      toast.showError(error.message, "Import Failed");
    }
  };

  const handleImportMoves = async () => {
    const selectedFile: string = await window.electron.ipcRenderer.invoke("select-file");

    if (
      !selectedFile.includes("moves") &&
      !(await showWarning(
        "The file does not contain 'moves' on the name",
        "Are you shure you selected the correct file?"
      ))
    ) {
      return;
    }

    const content: string = await window.electron.ipcRenderer.invoke("read-file", selectedFile);

    try {
      const importedMoves = importMoves(content);
      toast.showSuccess(`Successfully imported ${importedMoves.length} Moves.`, "Import Successful");
      if (importMode === "Merge") {
        importMovesMerge(importedMoves);
        toast.showSuccess(`Successfully merged imported data with existing Moves.`, "Merge Successful");
      } else {
        importMovesOverride(importedMoves);
        toast.showSuccess(`Successfully overridden existing Moves data.`, "Override Successful");
      }

      setSelectedMove(importedMoves[0] || null);
    } catch (error: any) {
      toast.showError(error.message, "Import Failed");
    }
  };

  const handleImportAbilities = async () => {
    const selectedFile: string = await window.electron.ipcRenderer.invoke("select-file");

    if (
      !selectedFile.includes("abilities") &&
      !(await showWarning(
        "The file does not contain 'abilities' on the name",
        "Are you shure you selected the correct file?"
      ))
    ) {
      return;
    }

    const content: string = await window.electron.ipcRenderer.invoke("read-file", selectedFile);

    try {
      const importedAbilities = importAbilities(content);
      toast.showSuccess(`Successfully imported ${importedAbilities.length} Abilities.`, "Import Successful");
      if (importMode === "Merge") {
        importAbilitiesMerge(importedAbilities);
        toast.showSuccess(`Successfully merged imported data with existing Abilities.`, "Merge Successful");
      } else {
        importAbilitiesOverride(importedAbilities);
        toast.showSuccess(`Successfully overridden existing Abilities data.`, "Override Successful");
      }

      setSelectedAbility(importedAbilities[0] || null);
    } catch (error: any) {
      toast.showError(error.message, "Import Failed");
    }
  };

  const handleImportItems = async () => {
    const selectedFile: string = await window.electron.ipcRenderer.invoke("select-file");

    if (
      !selectedFile.includes("items") &&
      !(await showWarning(
        "The file does not contain 'items' on the name",
        "Are you shure you selected the correct file?"
      ))
    ) {
      return;
    }

    const content: string = await window.electron.ipcRenderer.invoke("read-file", selectedFile);

    try {
      const importedItems = importItems(content);
      toast.showSuccess(`Successfully imported ${importedItems.length} Items.`, "Import Successful");
      if (importMode === "Merge") {
        importItemsMerge(importedItems);
        toast.showSuccess(`Successfully merged imported data with existing Items.`, "Merge Successful");
      } else {
        importItemsOverride(importedItems);
        toast.showSuccess(`Successfully overridden existing Items data.`, "Override Successful");
      }

      setSelectedItem(importedItems[0] || null);
    } catch (error: any) {
      toast.showError(error.message, "Import Failed");
    }
  };

  const handleImportTypes = async () => {
    const selectedFile: string = await window.electron.ipcRenderer.invoke("select-file");

    if (
      !selectedFile.includes("types") &&
      !(await showWarning(
        "The file does not contain 'types' on the name",
        "Are you shure you selected the correct file?"
      ))
    ) {
      return;
    }

    const content: string = await window.electron.ipcRenderer.invoke("read-file", selectedFile);

    try {
      const importedTypes = importTypes(content);
      if (importMode === "Merge") {
        importTypesMerge(importedTypes);
        toast.showSuccess("Successfully merged imported data with existing types.", "Merge Successful");
      } else {
        importTypesOverride(importedTypes);
        toast.showSuccess("Successfully overridden existing types data.", "Override Successful");
      }

      setSelectedType(importedTypes[0] || null);
    } catch (error: any) {
      toast.showError(error.message, "Import Failed");
    }
  };

  return (
    <Modal
      triggerElement={triggerElement}
      title="Manage Data"
      maxWidth="max-w-4xl"
      contentClass="max-h-[80vh] overflow-y-auto"
      showCloseButton={true}
      onClose={() => {}}
    >
      {/* Import */}
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-1">Import</h2>
            <p className="text-slate-400 text-sm">Import your data from an existing PBS file.</p>
          </div>

          {/* Import Mode Switch */}
          <div className="flex flex-col items-end">
            <p className="text-slate-300">Import Mode</p>
            <div className="flex items-center space-x-3">
              {importMode === "Override" && <p className="text-sm text-rose-400 mt-1">Override</p>}
              {importMode === "Merge" && <p className="text-sm text-emerald-400 mt-1">Merge</p>}
              <Switch.Root
                className="w-12 h-6 bg-slate-700 rounded-full relative shadow-inner mt-2 focus:outline-none"
                checked={importChecked}
                onCheckedChange={(checked) => {
                  setImportChecked(checked);
                  setImportMode(checked ? "Merge" : "Override");
                }}
                aria-label="Import Mode"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out translate-x-0 data-[state=checked]:translate-x-6" />
              </Switch.Root>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center h-full">
          <button
            className="bg-slate-600 flex items-center justify-center px-8 py-6 rounded-lg hover:bg-sky-600 transition-all cursor-pointer"
            onClick={handleImportPokemon}
          >
            <FolderUp size={24} className="mr-2" />
            Pokemon
          </button>
          <button
            className="bg-slate-600 flex items-center justify-center px-8 py-6 rounded-lg hover:bg-amber-600 transition-all cursor-pointer"
            onClick={handleImportMoves}
          >
            <FolderUp size={24} className="mr-2" />
            Moves
          </button>
          <button
            className="bg-slate-600 flex items-center justify-center px-8 py-6 rounded-lg hover:bg-emerald-600 transition-all cursor-pointer"
            onClick={handleImportAbilities}
          >
            <FolderUp size={24} className="mr-2" />
            Abilities
          </button>
          <button
            className="bg-slate-600 flex items-center justify-center px-8 py-6 rounded-lg hover:bg-violet-600 transition-all cursor-pointer"
            onClick={handleImportItems}
          >
            <FolderUp size={24} className="mr-2" />
            Items
          </button>
          <button
            className="bg-slate-600 flex items-center justify-center px-8 py-6 rounded-lg hover:bg-rose-600 transition-all cursor-pointer"
            onClick={handleImportTypes}
          >
            <FolderUp size={24} className="mr-2" />
            Types
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
