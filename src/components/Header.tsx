import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl healthcare-gradient-bg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">MedExplain</h1>
            <p className="text-xs text-muted-foreground">Healthcare Report Explainer</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">AI-Powered Analysis</span>
        </nav>
      </div>
    </header>
  );
}
