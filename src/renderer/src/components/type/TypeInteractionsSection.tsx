import React, { memo, useMemo } from "react";
import type { Type } from "@models/Type.ts";
import FormSection from "@components/layout/FormSection.tsx";
import TypeEntry from "@components/type/TypeEntry.tsx";

interface TypeInteractionsSectionProps {
  type: Type;
  title: string;
  setType: React.Dispatch<React.SetStateAction<Type | null>>;
  interaction: "weaknesses" | "resistances" | "immunities";
}

const TypeInteractionsSection = ({ type, title, setType, interaction }: TypeInteractionsSectionProps) => {
  const types = useMemo(() => {
    return type[interaction].sort((a, b) => a.localeCompare(b));
  }, [type.weaknesses, type.resistances, type.immunities, interaction]);

  const handleAddType = () => {
    const newType = "";
    setType((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [interaction]: [...prev[interaction], newType]
      };
    });
  };

  const handleChangeType = (index: number, newType: string) => {
    console.log(`Setting type at index ${index} for type interaction ${interaction} to ${JSON.stringify(newType)}`);

    setType((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [interaction]: prev[interaction].map((t, i) => (i === index ? newType.toUpperCase() : t))
      };
    });
  };

  const handleRemoveType = (index: number) => {
    setType(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [interaction]: prev[interaction].filter((_, i) => i !== index)
      }
    })
  }

  const typesExport =
    types.length > 0 ? (
      types.map((type, idx) => (
        <div key={`${interaction}-type-${type}-${idx}`} className="w-full">
          <TypeEntry
            type={type}
            onTypeChange={(value) => handleChangeType(idx, value)}
            onRemove={() => handleRemoveType(idx)}
          />
        </div>
      ))
    ) : (
      <div className="col-span-full">
        <p className="text-slate-500 italic py-4 text-center">No {interaction} type interaction added yet</p>
      </div>
    );

  return (
    <FormSection title={title} buttonText="Add Type" buttonHandleClick={handleAddType}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">{typesExport}</div>
    </FormSection>
  );
};

const areEqual = (prevProps: TypeInteractionsSectionProps, nextProps: TypeInteractionsSectionProps) => {
  if (prevProps.interaction !== nextProps.interaction) return false;
  return prevProps.type[nextProps.interaction] === nextProps.type[prevProps.interaction];
};

export default memo(TypeInteractionsSection, areEqual);
