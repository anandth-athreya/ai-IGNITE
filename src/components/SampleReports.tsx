import { FileText, ChevronRight } from "lucide-react";

const sampleReports = [
  {
    id: "chest-xray",
    title: "Chest X-Ray",
    description: "PA and lateral views showing possible infiltrate",
    content: `CHEST X-RAY (PA AND LATERAL)

CLINICAL HISTORY: Cough and fever for 3 days.

FINDINGS:
The cardiac silhouette is normal in size. The mediastinal contours are unremarkable. There is a focal area of increased opacity in the right lower lobe, measuring approximately 3 cm, consistent with an infiltrate. No pleural effusion is identified. The left lung is clear. No pneumothorax. The visualized bony structures are intact.

IMPRESSION:
1. Right lower lobe infiltrate, likely representing pneumonia in the appropriate clinical setting.
2. No pleural effusion or pneumothorax.
3. Recommend clinical correlation and follow-up imaging in 4-6 weeks to document resolution.`
  },
  {
    id: "cbc",
    title: "Complete Blood Count (CBC)",
    description: "Routine blood work with mild abnormalities",
    content: `COMPLETE BLOOD COUNT (CBC)

PATIENT: Synthetic Patient, Age 45, M
COLLECTION DATE: 2024-01-15

RESULTS:
WBC: 11.2 x10^9/L (Reference: 4.5-11.0) - HIGH
RBC: 4.8 x10^12/L (Reference: 4.5-5.5) - Normal
Hemoglobin: 14.2 g/dL (Reference: 13.5-17.5) - Normal
Hematocrit: 42% (Reference: 38-50) - Normal
Platelets: 245 x10^9/L (Reference: 150-400) - Normal
MCV: 88 fL (Reference: 80-100) - Normal
MCH: 29.6 pg (Reference: 27-33) - Normal
MCHC: 33.8 g/dL (Reference: 32-36) - Normal

DIFFERENTIAL:
Neutrophils: 72% (Reference: 40-70) - HIGH
Lymphocytes: 20% (Reference: 20-40) - Normal
Monocytes: 6% (Reference: 2-8) - Normal
Eosinophils: 1.5% (Reference: 1-4) - Normal
Basophils: 0.5% (Reference: 0-1) - Normal

INTERPRETATION:
Mild leukocytosis with neutrophilia, which may indicate acute bacterial infection or inflammation. All other parameters within normal limits.`
  },
  {
    id: "mri-brain",
    title: "MRI Brain",
    description: "Brain imaging with incidental finding",
    content: `MRI BRAIN WITHOUT AND WITH CONTRAST

CLINICAL INDICATION: Headaches for 2 weeks.

TECHNIQUE: Multiplanar, multisequence MR imaging of the brain was performed before and after the administration of 15 mL of Gadavist IV contrast.

FINDINGS:
Brain parenchyma demonstrates normal gray-white matter differentiation. No acute infarct on diffusion-weighted imaging. No intracranial hemorrhage. Ventricles and sulci are normal in size and configuration for patient age. Midline structures are normally positioned.

A 4 mm focus of increased T2/FLAIR signal is seen in the right frontal subcortical white matter, nonspecific but may represent a small area of gliosis or chronic microvascular ischemic change. No abnormal enhancement post-contrast.

Pituitary gland is normal. Orbits, paranasal sinuses, and mastoid air cells are unremarkable. No extra-axial collection.

IMPRESSION:
1. No acute intracranial abnormality.
2. Incidental 4 mm nonspecific white matter focus in the right frontal lobe, likely representing chronic microvascular change. Clinical correlation recommended.
3. No mass, hemorrhage, or acute infarct.`
  },
  {
    id: "lipid-panel",
    title: "Lipid Panel",
    description: "Cholesterol and triglycerides assessment",
    content: `LIPID PANEL

PATIENT: Synthetic Patient, Age 52, F
COLLECTION DATE: 2024-01-15
FASTING: Yes (12 hours)

RESULTS:
Total Cholesterol: 238 mg/dL (Reference: <200) - HIGH
LDL Cholesterol: 158 mg/dL (Reference: <100) - HIGH
HDL Cholesterol: 42 mg/dL (Reference: >60) - LOW
Triglycerides: 190 mg/dL (Reference: <150) - HIGH
VLDL: 38 mg/dL (Reference: 5-40) - Normal
Total/HDL Ratio: 5.7 (Reference: <5.0) - HIGH

INTERPRETATION:
Dyslipidemia with elevated LDL cholesterol, low HDL cholesterol, and elevated triglycerides. This lipid profile is associated with increased cardiovascular risk. Lifestyle modifications and possible pharmacotherapy should be considered. Repeat testing in 3 months recommended.`
  },
  {
    id: "ct-abdomen",
    title: "CT Abdomen/Pelvis",
    description: "Abdominal imaging with common finding",
    content: `CT ABDOMEN AND PELVIS WITH CONTRAST

CLINICAL INDICATION: Abdominal pain.

TECHNIQUE: Axial CT images of the abdomen and pelvis were obtained following oral and IV contrast administration.

FINDINGS:
LIVER: Normal size and attenuation. No focal lesion. No biliary dilatation.
GALLBLADDER: Unremarkable. No gallstones.
PANCREAS: Normal. No peripancreatic fluid.
SPLEEN: Normal size at 11 cm. Homogeneous.
ADRENAL GLANDS: Unremarkable bilaterally.
KIDNEYS: Normal size and enhancement. A 6 mm simple cyst is noted in the lower pole of the right kidney. No hydronephrosis or calculi.
BOWEL: No obstruction or wall thickening. Appendix is normal.
VASCULATURE: Aorta and major branches are patent. No aneurysm.
LYMPH NODES: No pathologic lymphadenopathy.
PELVIS: Bladder is unremarkable. No free fluid.
BONES: Mild degenerative changes in the lumbar spine.

IMPRESSION:
1. No acute abdominal or pelvic pathology to explain patient's symptoms.
2. Incidental 6 mm simple renal cyst in right kidney, benign.
3. Mild lumbar degenerative changes.`
  }
];

interface SampleReportsProps {
  onSelect: (content: string) => void;
}

export function SampleReports({ onSelect }: SampleReportsProps) {
  return (
    <div className="healthcare-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-serif text-lg font-semibold text-foreground">Sample Reports</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Try the explainer with these synthetic medical reports:
      </p>
      <div className="space-y-2">
        {sampleReports.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelect(report.content)}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left group"
          >
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {report.title}
              </p>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
