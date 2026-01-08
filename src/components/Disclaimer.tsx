import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="disclaimer-banner flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium mb-1">Important Medical Disclaimer</p>
        <p className="text-muted-foreground text-sm">
          This tool provides educational explanations only and is <strong>not a medical diagnosis</strong>. 
          Always consult your healthcare provider for medical advice. Uses synthetic/de-identified data only.
        </p>
      </div>
    </div>
  );
}
