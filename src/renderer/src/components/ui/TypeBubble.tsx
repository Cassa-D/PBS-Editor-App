import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import { useMemo } from "react";

interface TypeBubbleProps {
  type: string;
  overrideText?: string;
  size?: "small" | "medium" | "large";
}

const typeSize = {
  medium: { style: "min-w-[64px] h-[28px]", multiplicator: 28 },
  small: { style: "min-w-[50.28px] h-[22px]", multiplicator: 22 }
};

const TypeBubble = ({ type, size = "medium" }: TypeBubbleProps) => {
  const { types, typeImg } = usePokedexContext();

  const iconPosition = useMemo(() => {
    const currType = types.find((t) => t.id === type);
    if (!currType) return types.find((t) => t.id === "QMARKS")?.iconPosition || 9;
    return currType.iconPosition;
  }, [type]);

  return (
    typeImg && (
      <div className={`${typeSize[size].style} overflow-hidden relative`}>
        <img src={typeImg} alt="Types image" className="absolute" style={{ top: -(iconPosition || 0) * typeSize[size].multiplicator }} />
      </div>
    )
  );
};

export default TypeBubble;
