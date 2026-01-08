import { useState, useRef } from "react";
import { FileText, Sparkles, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReportInputProps {
  onAnalyze: (text: string) => void;
  isLoading?: boolean;
}

export function ReportInput({ onAnalyze, isLoading }: ReportInputProps) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    // Accept text files and PDFs (text only for now)
    const allowedTypes = ['text/plain', 'application/pdf', '.txt', '.pdf'];
    const isAllowed = allowedTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type)
    );

    setIsReadingFile(true);
    setFileName(file.name);

    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // For PDF files, we'll extract text using FileReader
        const arrayBuffer = await file.arrayBuffer();
        // Simple PDF text extraction - look for text content between stream markers
        const uint8Array = new Uint8Array(arrayBuffer);
        const textDecoder = new TextDecoder('utf-8', { fatal: false });
        const pdfText = textDecoder.decode(uint8Array);
        
        // Try to extract readable text from PDF
        // This is a simple extraction - works for text-based PDFs
        const textMatches = pdfText.match(/\((.*?)\)/g);
        if (textMatches && textMatches.length > 10) {
          const extractedText = textMatches
            .map(match => match.slice(1, -1))
            .filter(t => t.length > 1 && !/^[\\\/\d]+$/.test(t))
            .join(' ')
            .replace(/\\n/g, '\n')
            .replace(/\\/g, '');
          
          if (extractedText.trim().length > 50) {
            setText(extractedText);
            toast.success(`Loaded ${file.name}`);
          } else {
            toast.error("Could not extract text from PDF. Please paste the report text manually.");
            setFileName(null);
          }
        } else {
          toast.error("Could not extract text from PDF. Please paste the report text manually.");
          setFileName(null);
        }
      } else {
        // For text files, read directly
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setText(content);
          toast.success(`Loaded ${file.name}`);
        };
        reader.onerror = () => {
          toast.error("Failed to read file. Please try again.");
          setFileName(null);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file. Please try pasting the text manually.");
      setFileName(null);
    } finally {
      setIsReadingFile(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    setFileName(null);
    setText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="healthcare-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-lg font-semibold">Enter Your Report</h3>
        </div>
        
        {/* File Upload Button */}
        <div className="flex items-center gap-2">
          {fileName && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              <span className="max-w-[150px] truncate">{fileName}</span>
              <button onClick={clearFile} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isReadingFile || isLoading}
            className="gap-2"
          >
            {isReadingFile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,text/plain,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      <Textarea
        placeholder="Paste your radiology report, lab results, or medical imaging findings here... Or upload a file above."
        className="min-h-[200px] resize-none bg-background border-border focus:ring-2 focus:ring-primary/20"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Your data is processed securely and not stored.
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="healthcare-gradient-bg border-0 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Explain Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
