import { cn } from "@/lib/utils";
import { User, Stethoscope } from "lucide-react";

interface ModeToggleProps {
  mode: "patient" | "clinician";
  onModeChange: (mode: "patient" | "clinician") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full bg-muted p-1 gap-1">
      <button
        onClick={() => onModeChange("patient")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          mode === "patient"
            ? "bg-card text-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <User className="w-4 h-4" />
        Patient
      </button>
      <button
        onClick={() => onModeChange("clinician")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          mode === "clinician"
            ? "bg-card text-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Stethoscope className="w-4 h-4" />
        Clinician
      </button>
    </div>
  );
}
