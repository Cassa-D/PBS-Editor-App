import { useState } from "react";
import * as ReactTooltip from "@radix-ui/react-tooltip";

interface TooltipData {
  title?: string;
  description: string;
  children?: React.ReactNode;
  position: "top" | "bottom" | "left" | "right";
  show?: boolean;
}

const positionInfo = {
  top: { side: 5, align: 10 },
  right: { side: -46, align: 70 },

  // Unused
  bottom: { side: 5, align: 10 },
  left: { side: 5, align: 10 },
};

const Tooltip = ({ title, description, children, position, show = true }: TooltipData) => {
  const [open, setOpen] = useState(false);

  return (
    <ReactTooltip.Root open={open} onOpenChange={setOpen} delayDuration={100}>
      <ReactTooltip.Trigger asChild>{children}</ReactTooltip.Trigger>
      {show &&
        <ReactTooltip.Portal>
          <ReactTooltip.Content
            className="z-[9999] TooltipContent"
            align="start"
            sideOffset={positionInfo[position].side}
            alignOffset={positionInfo[position].align}
          >
            {title && (
              <div className="mb-1 border-b border-slate-700 pb-1 text-sm font-semibold text-slate-200">{title}</div>
            )}
            <div className="max-w-xs rounded-md border border-slate-700 bg-slate-800 p-3 text-sm text-slate-300 shadow-lg">
              {description}
            </div>
          </ReactTooltip.Content>
        </ReactTooltip.Portal>
      }
    </ReactTooltip.Root>
  );
};

export default Tooltip;
