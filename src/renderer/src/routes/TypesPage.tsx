import FormSection from "@/components/layout/FormSection";
import { useEffect, useMemo, useState } from "react";
import type { Type } from "@models/Type.ts";
import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import TypeList from "@components/type/TypeList.tsx";
import _ from "lodash";
import InputField from "@components/ui/InputField.tsx";
import TypeHeader from "@components/type/TypeHeader.tsx";
import { useToastNotifications } from "@hooks/useToast.ts";
import { useAlertContext } from "@providers/AlertProvider.tsx";
import TypeInteractionsSection from "@components/type/TypeInteractionsSection.tsx";
import { useProjectContext } from "@providers/ProjectProvider.tsx";

const COLOR_REGEXP = /^#([0-9A-Fa-f]+){6}/;

const TypesPage = () => {
  const { types, selectedType, setSelectedType, removeType, setTypeData } = usePokedexContext();
  const { usesOldTypeBubble } = useProjectContext();
  const { showWarning, showError } = useAlertContext();
  const { showSuccess } = useToastNotifications();

  const [editData, setEditData] = useState<Type | null>(types[0] || null);
  const [colorHasError, setColorHasError] = useState(false);

  useEffect(() => {
    if (selectedType) {
      setEditData(selectedType);
      setColorHasError(false);
    }
  }, [selectedType, setSelectedType]);

  const validateType = (type: Type) => {
    const errors: string[] = [];

    if (!type.id || type.id.trim() === "" || type.id === "[]") {
      errors.push("ID");
    }
    if (!type.name || type.name.trim() === "") {
      errors.push("Name");
    }
    if (type.iconPosition === undefined || type.iconPosition === null || isNaN(Number(type.iconPosition))) {
      errors.push("Icon Position");
    }
    if (!COLOR_REGEXP.test(type.color)) {
      errors.push("Color");
    }

    return errors.length > 0 ? errors : null;
  };

  const handleSave = async () => {
    if (!selectedType || !editData) return;

    const validationErrors = validateType(editData);
    if (validationErrors) {
      console.error("Validation Errors:", validationErrors);
      showError(
        "Validation Errors",
        `The following fields have an invalid input or have been left blank:\n\n ${validationErrors.join("\n")}`
      );
      return;
    }

    if (selectedType.id !== editData.id) {
      const response = await showWarning(
        "Different Type ID",
        `You've changed the unique Type id for ${selectedType.name}. If you proceed, this item will be overwritten. It is recommended that if you want to change the ID, you instead create a new Type.`
      );

      if (!response) {
        const id = selectedType.id;
        setEditData((prev) => (prev ? { ...prev, id } : null));
        return;
      }
    }

    setTypeData(editData);
    showSuccess(`Type ${editData.name} was updated.`);
  };

  const handleReset = async () => {
    if (!selectedType || !editData) return;
    if (
      await showWarning(
        "Reset to Default",
        `This will reset all details for ${selectedType.name} to their default values. Are you sure you want to do this?`
      )
    ) {
      setEditData((prev) => (prev ? { ...prev, ...selectedType } : null));
      setColorHasError(false);
      showSuccess(`Reseted ${selectedType.name} values.`);
    }
  };

  const handleDelete = async () => {
    if (!selectedType || !editData) return;

    if (
      await showWarning(
        "Delete Item?",
        `ATTENTION: Deleting ${selectedType.name} will not remove it's ID from the Pokemon that had this item. Are you sure you want to do this?`
      )
    ) {
      removeType(selectedType.id);
      setSelectedType(null);
      showSuccess(`Item ${selectedType.name} was deleted.`);
    }
  };

  const handleOnChange = (value: string | number | boolean, key: keyof Type) => {
    if (key === "iconPosition") {
      setEditData((prev) => (prev ? { ...prev, iconPosition: value as number } : null));
      return;
    }

    if (key === "color") {
      setColorHasError(!COLOR_REGEXP.test(value as string));
    }

    setEditData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSelectType = async (type: Type) => {
    setSelectedType(type);
    setEditData(type);
  };

  const memoTypeList = useMemo(() => {
    return <TypeList selectedType={selectedType} onTypeSelect={handleSelectType} />;
  }, [types, selectedType]);

  const dirty = useMemo(() => !_.isEqual(editData, selectedType), [editData, selectedType]);

  // Early return if no data is available
  if (!editData || !selectedType) {
    return (
      <div className="flex h-screen text-slate-200 shadow-xl items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Type Data</h2>
          <p className="text-slate-400">Loading Type data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-w-[70vw] w-full text-slate-200 shadow-xl">
      {/* Left Sidebar - Type List */}
      {memoTypeList}

      {/* Main Content - Move Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <TypeHeader type={editData} onSave={handleSave} onReset={handleReset} onDelete={handleDelete} dirty={dirty} />

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-800">
          <div className="max-w-4xl mx-auto space-y-8 mb-60">
            <FormSection title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                <InputField label="ID" value={editData.id} onChange={(value) => handleOnChange(value, "id")} />
                <InputField
                  label="Name"
                  value={editData.name}
                  onChange={(value) => handleOnChange(value, "name")}
                />
                <InputField
                  label="Icon Position"
                  type="number"
                  value={editData.iconPosition}
                  tooltip={{ description: "The position of the type on 'Graphics/UI/types.png'." }}
                  onChange={(value) => handleOnChange(value, "iconPosition")}
                />
              </div>
            </FormSection>
            <TypeInteractionsSection
              title="Weaknesses"
              type={editData}
              setType={setEditData}
              interaction="weaknesses"
            />
            <TypeInteractionsSection
              title="Resistances"
              type={editData}
              setType={setEditData}
              interaction="resistances"
            />
            <TypeInteractionsSection
              title="Immunities"
              type={editData}
              setType={setEditData}
              interaction="immunities"
            />
            <FormSection title="Advanced Properties">
              <div className="flex flex-wrap gap-4">
                <InputField
                  label="Is Special Type"
                  type="checkbox"
                  value={editData.isSpecialType}
                  onChange={(value) => handleOnChange(value, "isSpecialType")}
                />
                <InputField
                  label="Is Pseudo Type"
                  type="checkbox"
                  value={editData.isPseudoType}
                  onChange={(value) => handleOnChange(value, "isPseudoType")}
                />
              </div>
            </FormSection>

            {usesOldTypeBubble && (
              <FormSection title="Flare">
                <InputField
                  label="Type color"
                  type="color"
                  value={editData.color}
                  onChange={(value) => handleOnChange(value, "color")}
                  tooltip={{
                    description:
                      "The bubble's color, default to most common color on type inside 'Graphics/UI/types.png' and his iconPosition. Slightly improves performance. *It's only used for this APP."
                  }}
                  errorMessage={colorHasError ? "Color needs to be in format: #FFFFFF." : ""}
                />
              </FormSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypesPage;
