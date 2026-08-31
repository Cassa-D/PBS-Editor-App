import { Info } from "lucide-react";
import Tooltip from "./Tooltip.tsx";

interface TooltipData {
  title?: string;
  description: string;
  link?: string;
}

const InfoTooltip = (data: TooltipData) => {
  return (
    <Tooltip {...data} position="top">
      <Info
        onClick={() => {
          if (data.link) {
            window.open(data.link, "_blank");
          }
        }}
        className={`${data.link ? "cursor-pointer" : ""}`}
        width={16}
        height={16}
      />
    </Tooltip>
  );
};

export default InfoTooltip;
