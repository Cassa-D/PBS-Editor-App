import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import { useMemo } from "react";
import { useProjectContext } from "@providers/ProjectProvider.tsx";

interface TypeBubbleProps {
  type: string;
  overrideText?: string;
  size?: "small" | "medium" | "large";
}

const typeSize = {
  medium: { style: "min-w-[64px] h-[28px]", multiplicator: 28 },
  small: { style: "min-w-[50.28px] h-[22px]", multiplicator: 22 }
};

const TypeBubbleNew = ({ type, size = "medium" }: TypeBubbleProps) => {
  const { types, typeImg } = usePokedexContext();

  const iconPosition = useMemo(() => {
    const currType = types.find((t) => t.id === type);
    if (!currType) return types.find((t) => t.id === "QMARKS")?.iconPosition || 9;
    return currType.iconPosition;
  }, [type]);

  return (
    typeImg && (
      <div className={`${typeSize[size].style} overflow-hidden relative`}>
        <img
          src={typeImg}
          alt="Types image"
          className="absolute"
          style={{ top: -(iconPosition || 0) * typeSize[size].multiplicator }}
        />
      </div>
    )
  );
};

const TypeBubbleOld = ({ type }: TypeBubbleProps) => {
  const { types } = usePokedexContext();

  return (
    <span
      key={type}
      style={{
        backgroundColor:
          types.find((t) => t.id === type)?.color || types.find((t) => t.id === "QMARKS")?.color || "#ff6467"
      }}
      className="px-2 py-0.5 rounded text-xs font-medium flex items-center justify-center text-center text-white"
    >
      {type}
    </span>
  );
};

const TypeBubble = (props: TypeBubbleProps) => {
  const { usesOldTypeBubble } = useProjectContext();

  return usesOldTypeBubble ? <TypeBubbleOld {...props} /> : <TypeBubbleNew {...props} />;
};

export default TypeBubble;
