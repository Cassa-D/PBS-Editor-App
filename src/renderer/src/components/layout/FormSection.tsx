import type { ReactNode } from "react";
import InfoTooltip from "../ui/InfoTooltip.tsx";
import { Plus } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  tooltip?: string;
  buttonText?: string;
  buttonHandleClick?: () => void;
}

const FormSection = ({ title, children, className = "", tooltip, buttonText, buttonHandleClick }: FormSectionProps) => {
  return (
    <section className={`bg-slate-700/40 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 mb-4 items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          {tooltip && <InfoTooltip description={tooltip} />}
        </div>
        {buttonText && (
          <button
            onClick={buttonHandleClick}
            className="px-3 py-1 text-sm border border-slate-500 rounded-md text-slate-500 cursor-pointer hover:text-slate-300 hover:bg-slate-500/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            {buttonText}
          </button>
        )}
      </div>
      {children}
    </section>
  );
};

export default FormSection;
