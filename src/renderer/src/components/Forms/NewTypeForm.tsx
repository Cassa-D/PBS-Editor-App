import Modal from "@components/ui/Modal.tsx";
import InputField from "@components/ui/InputField.tsx";
import Autocomplete from "@components/ui/Autocomplete.tsx";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import { useAlertContext } from "@providers/AlertProvider.tsx";
import { Plus } from "lucide-react";
import type { Type } from "@models/Type.ts";

const NewTypeForm = () => {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<Type | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { types, isTypeInPokedex, addType } = usePokedexContext();

  const { showError, showWarning } = useAlertContext();

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter a valid Type identifier.");
      showError("Invalid Identifier", "Please enter a valid Type identifier.");
      setSelectedType(null);
      return;
    }

    if (isTypeInPokedex(name.trim().toUpperCase())) {
      setError("This Type identifier is already in the Pokédex. Please choose another Identifier.");
      showWarning(
        "Duplicate Identifier",
        "This Type identifier is already in the Pokédex. Please choose another Identifier."
      );
      console.warn("Tried to add duplicate Type ID to Pokédex.");
      return;
    }

    if (selectedType && !isTypeInPokedex(selectedType.id)) {
      setError("Could not find the Base Type.");
      showError("Base Type Not Found", "Could not find the Base Type.");
      setSelectedType(null);
      return;
    }

    addType(name.trim().toUpperCase(), selectedType || undefined);
    clearFields();
  };

  const clearFields = () => {
    setName("");
    setSelectedType(null);
    setError(null);
  };

  const handleClose = () => {
    clearFields();
  };

  const triggerButton = () => {
    return (
      <div className="p-2 px-3 bg-emerald-600 text-emerald-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-colors">
        <Plus className="w-5 h-5" />
      </div>
    );
  };

  return (
    <>
      <Modal triggerElement={triggerButton()} onClose={handleClose} title="New Type">
        <InputField
          label="Item Identifier"
          type="text"
          value={name}
          onChange={(e) => setName(e as string)}
          placeholder="Ex. PIKACHU"
          tooltip={{
            description: "This must be unique. Spaces will be removed and everything converted to uppercase."
          }}
        />

        <div className="flex items-center gap-2 mt-4 h-20">
          <div className="flex-1 relative">
            <p className=" text-slate-300 font-semibold text-sm absolute -top-6">Base Item (Optional)</p>
            <Autocomplete
              inputClass="max-w-45"
              options={types.map((type) => type.id)}
              value={selectedType?.id || ""}
              onValueChange={(value) => {
                const selected = types.find((type) => type.id === value);
                setSelectedType(selected || null);
              }}
            />
          </div>

          <Dialog.Close className="flex flex-1 relative h-full items-center justify-center">
            <div
              onClick={handleSubmit}
              className="px-4 w-40 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Submit
            </div>
          </Dialog.Close>
        </div>
        {error && <div className="text-red-500 text-center max-w-80 m-auto">{error}</div>}
      </Modal>
    </>
  );
};

export default NewTypeForm;
