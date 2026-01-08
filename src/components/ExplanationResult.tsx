import { AlertCircle, CheckCircle, AlertTriangle, ExternalLink, BookOpen, MessageCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Finding {
  text: string;
  severity: "normal" | "warning" | "critical";
  explanation?: string;
}

export interface ExplanationData {
  summary: string;
  findings: Finding[];
  questionsForDoctor?: string[];
  clinicalHighlights?: string[];
  suggestedNextSteps?: string[];
  citations: { title: string; url: string }[];
}

interface ExplanationResultProps {
  data: ExplanationData;
  mode: "patient" | "clinician";
}

const severityConfig = {
  normal: {
    icon: CheckCircle,
    className: "finding-normal",
    iconClass: "text-success",
    label: "Normal"
  },
  warning: {
    icon: AlertTriangle,
    className: "finding-warning",
    iconClass: "text-warning",
    label: "Attention"
  },
  critical: {
    icon: AlertCircle,
    className: "finding-critical",
    iconClass: "text-critical",
    label: "Critical"
  }
};

export function ExplanationResult({ data, mode }: ExplanationResultProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="healthcare-card p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
          {mode === "patient" ? "What This Report Means" : "Clinical Summary"}
        </h3>
        <p className="text-foreground leading-relaxed">{data.summary}</p>
      </div>

      {/* Key Findings */}
      <div className="healthcare-card p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
          Key Findings
        </h3>
        <div className="space-y-3">
          {data.findings.map((finding, index) => {
            const config = severityConfig[finding.severity];
            const Icon = config.icon;
            return (
              <div
                key={index}
                className={cn("finding-card", config.className)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconClass)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", 
                        finding.severity === "normal" && "bg-success/20 text-success",
                        finding.severity === "warning" && "bg-warning/20 text-warning",
                        finding.severity === "critical" && "bg-critical/20 text-critical"
                      )}>
                        {config.label}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">{finding.text}</p>
                    {finding.explanation && (
                      <p className="text-sm text-muted-foreground mt-1">{finding.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Patient Mode: Questions to Ask */}
      {mode === "patient" && data.questionsForDoctor && data.questionsForDoctor.length > 0 && (
        <div className="healthcare-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Questions to Ask Your Doctor
            </h3>
          </div>
          <ul className="space-y-2">
            {data.questionsForDoctor.map((question, index) => (
              <li key={index} className="flex items-start gap-2 text-foreground">
                <span className="text-primary font-medium">{index + 1}.</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinician Mode: Clinical Highlights */}
      {mode === "clinician" && data.clinicalHighlights && data.clinicalHighlights.length > 0 && (
        <div className="healthcare-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Clinical Highlights
            </h3>
          </div>
          <ul className="space-y-2">
            {data.clinicalHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinician Mode: Suggested Next Steps */}
      {mode === "clinician" && data.suggestedNextSteps && data.suggestedNextSteps.length > 0 && (
        <div className="healthcare-card p-6 border-l-4 border-l-primary">
          <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
            Suggested Next Steps (Non-Prescriptive)
          </h3>
          <ul className="space-y-2">
            {data.suggestedNextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-foreground">
                <span className="text-primary font-medium">→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations */}
      {data.citations.length > 0 && (
        <div className="healthcare-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-lg font-semibold text-foreground">
              References & Sources
            </h3>
          </div>
          <div className="space-y-2">
            {data.citations.map((citation, index) => (
              <a
                key={index}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {citation.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
