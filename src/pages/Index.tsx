import { useState } from "react";
import { Header } from "@/components/Header";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Disclaimer } from "@/components/Disclaimer";
import { ReportInput } from "@/components/ReportInput";
import { SampleReports } from "@/components/SampleReports";
import { ExplanationResult, ExplanationData } from "@/components/ExplanationResult";
import { Activity, Shield, Zap, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Demo explanation generator (simulates AI analysis) - used as fallback
function generateExplanation(report: string, mode: "patient" | "clinician"): ExplanationData {
  const isChestXray = report.toLowerCase().includes("chest") && report.toLowerCase().includes("infiltrate");
  const isCBC = report.toLowerCase().includes("wbc") && report.toLowerCase().includes("neutrophil");
  const isMRI = report.toLowerCase().includes("mri") && report.toLowerCase().includes("brain");
  const isLipid = report.toLowerCase().includes("cholesterol") || report.toLowerCase().includes("ldl");
  const isCT = report.toLowerCase().includes("ct ") && report.toLowerCase().includes("abdomen");
  if (isChestXray) {
    return {
      summary: mode === "patient" ? "Your chest X-ray shows an area in your right lung that looks cloudier than normal. This could mean there's an infection like pneumonia. The good news is your heart looks normal and there's no fluid buildup around your lungs." : "PA and lateral chest radiograph demonstrates a focal infiltrate in the right lower lobe, measuring approximately 3 cm. Cardiac silhouette normal. No pleural effusion or pneumothorax. Findings consistent with community-acquired pneumonia.",
      findings: [{
        text: "Right lower lobe infiltrate (3 cm)",
        severity: "warning",
        explanation: mode === "patient" ? "An 'infiltrate' is an area where something (like fluid or infection) has collected in your lung tissue" : "Focal opacity suggesting consolidation, correlate with clinical presentation"
      }, {
        text: "Heart size normal",
        severity: "normal",
        explanation: mode === "patient" ? "Your heart appears healthy in size" : "No cardiomegaly"
      }, {
        text: "No pleural effusion",
        severity: "normal",
        explanation: mode === "patient" ? "No fluid around your lungs" : "Costophrenic angles clear"
      }],
      questionsForDoctor: mode === "patient" ? ["Do I need antibiotics for this infiltrate?", "Should I get a follow-up X-ray, and when?", "What symptoms should I watch for that would require immediate care?", "Is this contagious to my family members?"] : undefined,
      clinicalHighlights: mode === "clinician" ? ["Right lower lobe infiltrate consistent with bacterial pneumonia", "No complications (effusion, pneumothorax)", "Consider sputum culture if available", "Follow-up imaging in 4-6 weeks to confirm resolution"] : undefined,
      suggestedNextSteps: mode === "clinician" ? ["Consider empiric antibiotic therapy per local guidelines", "Obtain sputum culture if productive cough present", "Schedule follow-up chest radiograph in 4-6 weeks", "Monitor for clinical deterioration or treatment failure"] : undefined,
      citations: [{
        title: "CDC - Pneumonia Diagnosis",
        url: "https://www.cdc.gov/pneumonia/diagnosis.html"
      }, {
        title: "RSNA - Chest Radiograph Interpretation",
        url: "https://www.rsna.org/education"
      }]
    };
  }
  if (isCBC) {
    return {
      summary: mode === "patient" ? "Your blood test shows that your white blood cell count is slightly higher than normal. White blood cells fight infection, so this usually means your body is fighting something off – like a cold, infection, or inflammation. All your other blood counts are normal." : "CBC demonstrates mild leukocytosis (WBC 11.2) with neutrophilia (72%), suggestive of acute bacterial infection or inflammatory process. RBC indices, hemoglobin, and platelet count within normal limits.",
      findings: [{
        text: "White blood cell count: 11.2 (slightly elevated)",
        severity: "warning",
        explanation: mode === "patient" ? "Normal is 4.5-11.0. Yours is just above this, suggesting your body is fighting something" : "Mild leukocytosis, correlate with clinical presentation"
      }, {
        text: "Neutrophils: 72% (elevated)",
        severity: "warning",
        explanation: mode === "patient" ? "Neutrophils are infection-fighting cells. Higher levels often mean a bacterial infection" : "Neutrophilia suggests bacterial etiology over viral"
      }, {
        text: "Hemoglobin: 14.2 g/dL (normal)",
        severity: "normal",
        explanation: mode === "patient" ? "Your oxygen-carrying capacity is healthy" : "No anemia"
      }, {
        text: "Platelets: 245 (normal)",
        severity: "normal",
        explanation: mode === "patient" ? "Your blood clotting cells are in normal range" : "Normal platelet count"
      }],
      questionsForDoctor: mode === "patient" ? ["What could be causing my elevated white blood cells?", "Do I need any additional tests?", "Should I be taking any medication?", "When should I get retested?"] : undefined,
      clinicalHighlights: mode === "clinician" ? ["Leukocytosis with left shift indicates acute bacterial infection", "No anemia or thrombocytopenia", "Consider infection source workup based on symptoms", "Repeat CBC in 1-2 weeks if treating empirically"] : undefined,
      suggestedNextSteps: mode === "clinician" ? ["Correlate with patient symptoms and physical exam", "Consider CRP/ESR if inflammatory etiology suspected", "Culture specimens as clinically indicated", "Repeat CBC after treatment to confirm resolution"] : undefined,
      citations: [{
        title: "Lab Tests Online - WBC",
        url: "https://labtestsonline.org/tests/white-blood-cell-count-wbc"
      }]
    };
  }
  if (isMRI) {
    return {
      summary: mode === "patient" ? "Good news – your brain MRI looks mostly normal with no signs of stroke, bleeding, or tumors. There is one tiny spot (4mm) in your brain that's likely just a small change that happens naturally with age, similar to how we get wrinkles on the outside. This is very common and usually nothing to worry about." : "Brain MRI demonstrates no acute intracranial pathology. Incidental 4mm T2/FLAIR hyperintense focus in right frontal subcortical white matter, nonspecific but likely chronic microvascular ischemic change given patient demographics. No mass effect, hemorrhage, or acute infarct.",
      findings: [{
        text: "No acute stroke or bleeding",
        severity: "normal",
        explanation: mode === "patient" ? "Your brain shows no emergency problems" : "DWI negative, no hemorrhage"
      }, {
        text: "4mm white matter focus (incidental)",
        severity: "normal",
        explanation: mode === "patient" ? "A tiny spot that's likely just normal wear and tear – very common in adults" : "Nonspecific; likely chronic microvascular ischemic change"
      }, {
        text: "Normal brain structure",
        severity: "normal",
        explanation: mode === "patient" ? "Your brain's overall structure looks healthy" : "No mass effect or midline shift"
      }],
      questionsForDoctor: mode === "patient" ? ["Should I be concerned about the small spot found?", "What could be causing my headaches?", "Do I need any follow-up scans?", "Are there lifestyle changes I should make?"] : undefined,
      clinicalHighlights: mode === "clinician" ? ["No acute intracranial abnormality", "Incidental white matter lesion – consider vascular risk factors", "Headache evaluation may require clinical correlation", "Routine follow-up imaging not typically required"] : undefined,
      suggestedNextSteps: mode === "clinician" ? ["Clinical correlation for headache etiology", "Review vascular risk factors given white matter changes", "Consider headache diary and symptom monitoring", "Follow-up imaging only if symptoms change"] : undefined,
      citations: [{
        title: "RSNA - Brain MRI Interpretation",
        url: "https://www.rsna.org/education"
      }, {
        title: "NIH - White Matter Changes",
        url: "https://www.nih.gov/news-events/nih-research-matters/brain-changes"
      }]
    };
  }
  if (isLipid) {
    return {
      summary: mode === "patient" ? "Your cholesterol numbers show some areas that need attention. Your 'bad' cholesterol (LDL) is higher than we'd like, and your 'good' cholesterol (HDL) is a bit low. This combination can increase your risk for heart problems over time, but the good news is that diet, exercise, and sometimes medication can improve these numbers." : "Lipid panel reveals dyslipidemia with elevated LDL-C (158 mg/dL), suboptimal HDL-C (42 mg/dL), and elevated triglycerides (190 mg/dL). Total/HDL ratio of 5.7 indicates increased cardiovascular risk. ASCVD risk assessment recommended.",
      findings: [{
        text: "LDL Cholesterol: 158 mg/dL (high)",
        severity: "warning",
        explanation: mode === "patient" ? "LDL is 'bad' cholesterol that can clog arteries. Goal is below 100." : "Above optimal; consider statin therapy based on ASCVD risk"
      }, {
        text: "HDL Cholesterol: 42 mg/dL (low)",
        severity: "warning",
        explanation: mode === "patient" ? "HDL is 'good' cholesterol that cleans arteries. Higher is better – goal is above 60." : "Suboptimal; lifestyle modification primary intervention"
      }, {
        text: "Triglycerides: 190 mg/dL (elevated)",
        severity: "warning",
        explanation: mode === "patient" ? "These fats in your blood are elevated. Diet changes can help significantly." : "Elevated; consider dietary intervention and glycemic control assessment"
      }, {
        text: "Total/HDL Ratio: 5.7 (elevated risk)",
        severity: "warning",
        explanation: mode === "patient" ? "This ratio helps predict heart disease risk. Lower is better." : "Indicates elevated cardiovascular risk"
      }],
      questionsForDoctor: mode === "patient" ? ["What diet changes would help my cholesterol the most?", "Do I need medication, or can I try lifestyle changes first?", "How often should I get my cholesterol rechecked?", "What's my overall heart disease risk?"] : undefined,
      clinicalHighlights: mode === "clinician" ? ["Combined dyslipidemia with elevated CV risk", "Calculate 10-year ASCVD risk to guide therapy", "Consider metabolic syndrome evaluation", "Lifestyle modification first-line; statin if indicated"] : undefined,
      suggestedNextSteps: mode === "clinician" ? ["Calculate ASCVD risk score", "Initiate therapeutic lifestyle changes", "Consider statin therapy based on risk stratification", "Repeat lipid panel in 3 months"] : undefined,
      citations: [{
        title: "AHA - Cholesterol Guidelines",
        url: "https://www.heart.org/en/health-topics/cholesterol"
      }, {
        title: "CDC - Heart Disease Prevention",
        url: "https://www.cdc.gov/heartdisease/prevention.htm"
      }]
    };
  }
  if (isCT) {
    return {
      summary: mode === "patient" ? "Great news – your CT scan of your abdomen doesn't show anything that explains your pain. All your major organs (liver, kidneys, pancreas, intestines) look normal. They did find a tiny fluid-filled bubble on your kidney called a 'cyst' – this is very common and harmless. You also have some normal wear-and-tear in your lower back." : "CT abdomen/pelvis demonstrates no acute pathology to explain presenting symptoms. Incidental 6mm simple renal cyst right kidney, benign. Mild lumbar degenerative changes noted. No obstruction, free fluid, or lymphadenopathy.",
      findings: [{
        text: "No acute abdominal pathology",
        severity: "normal",
        explanation: mode === "patient" ? "No urgent problems found in your abdomen" : "No surgical emergency identified"
      }, {
        text: "6mm simple renal cyst (incidental)",
        severity: "normal",
        explanation: mode === "patient" ? "A tiny, harmless fluid pocket on your kidney – very common and doesn't need treatment" : "Simple cyst, Bosniak I, no follow-up required"
      }, {
        text: "All major organs unremarkable",
        severity: "normal",
        explanation: mode === "patient" ? "Liver, pancreas, and intestines all look healthy" : "No hepatic, pancreatic, or bowel pathology"
      }, {
        text: "Mild lumbar degenerative changes",
        severity: "normal",
        explanation: mode === "patient" ? "Normal age-related changes in your lower spine" : "Degenerative disc/facet disease, common incidental finding"
      }],
      questionsForDoctor: mode === "patient" ? ["What else could be causing my abdominal pain?", "Do I need any other tests?", "Should I be concerned about the kidney cyst?", "When should I come back if the pain continues?"] : undefined,
      clinicalHighlights: mode === "clinician" ? ["No acute intra-abdominal pathology identified", "Consider functional/non-structural etiology", "Simple renal cyst – no follow-up imaging needed", "Lumbar changes may warrant separate evaluation if symptomatic"] : undefined,
      suggestedNextSteps: mode === "clinician" ? ["Consider alternative diagnoses (functional, musculoskeletal)", "Symptom management as clinically indicated", "No imaging follow-up required for simple cyst", "Return precautions for worsening symptoms"] : undefined,
      citations: [{
        title: "ACR - Renal Cyst Guidelines",
        url: "https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems"
      }, {
        title: "RSNA - Abdominal CT",
        url: "https://www.rsna.org/education"
      }]
    };
  }

  // Default/generic response
  return {
    summary: mode === "patient" ? "I've analyzed your report and extracted the key findings below. Remember, this is an educational tool – please discuss these results with your healthcare provider for personalized medical advice." : "Report analysis complete. Key findings extracted and categorized by clinical significance. Correlate with clinical presentation and patient history.",
    findings: [{
      text: "Report analyzed successfully",
      severity: "normal",
      explanation: "See detailed findings below"
    }],
    questionsForDoctor: mode === "patient" ? ["Can you explain what these results mean for my health?", "Do I need any follow-up tests?", "Are there any lifestyle changes I should make?"] : undefined,
    clinicalHighlights: mode === "clinician" ? ["Review complete report for detailed findings", "Correlate with clinical presentation"] : undefined,
    citations: [{
      title: "NIH - Understanding Medical Tests",
      url: "https://www.nih.gov/"
    }]
  };
}
export default function Index() {
  const [mode, setMode] = useState<"patient" | "clinician">("patient");
  const [reportText, setReportText] = useState("");
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleAnalyze = async (text: string) => {
    setReportText(text);
    setIsLoading(true);
    setExplanation(null);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('analyze-report', {
        body: {
          reportText: text,
          mode
        }
      });
      if (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze report. Please try again.");
        // Fallback to demo explanations
        const result = generateExplanation(text, mode);
        setExplanation(result);
      } else if (data?.error) {
        toast.error(data.error);
        const result = generateExplanation(text, mode);
        setExplanation(result);
      } else {
        setExplanation(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Using demo mode.");
      const result = generateExplanation(text, mode);
      setExplanation(result);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSampleSelect = (content: string) => {
    setReportText(content);
    handleAnalyze(content);
  };
  const handleModeChange = (newMode: "patient" | "clinician") => {
    setMode(newMode);
    if (reportText) {
      // Re-analyze with new mode using AI
      handleAnalyze(reportText);
    }
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 healthcare-gradient-bg opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">Understand Your Medical Reports</h1>
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up">
              AI-powered explanations that translate complex medical language into clear, 
              actionable insights for both patients and clinicians.
            </p>
            
            {/* Mode Toggle */}
            <div className="flex justify-center mb-8">
              <ModeToggle mode={mode} onModeChange={handleModeChange} />
            </div>

            {/* Mode Description */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
              {mode === "patient" ? <>
                  <Users className="w-4 h-4" />
                  Simple explanations with questions to ask your doctor
                </> : <>
                  <Shield className="w-4 h-4" />
                  Clinical highlights with evidence-based next steps
                </>}
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span>HIPAA Mindful</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
              <Activity className="w-4 h-4 text-primary" />
              <span>Evidence-Based</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto mb-8">
            <Disclaimer />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left Column: Input & Samples */}
            <div className="lg:col-span-1 space-y-6">
              <SampleReports onSelect={handleSampleSelect} />
            </div>

            {/* Right Column: Input & Results */}
            <div className="lg:col-span-2 space-y-6">
              <ReportInput onAnalyze={handleAnalyze} isLoading={isLoading} />
              
              {explanation && <ExplanationResult data={explanation} mode={mode} />}

              {!explanation && !isLoading && <div className="healthcare-card p-12 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50 text-primary-foreground" />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-muted-foreground">
                    Paste a medical report above or select a sample to see how MedExplain works.
                  </p>
                </div>}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>MedExplain</strong> is an educational tool using synthetic data. 
            Not intended for medical diagnosis.
          </p>
          <p>
            Always consult qualified healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>;
}