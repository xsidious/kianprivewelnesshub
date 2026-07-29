export type IntakeFormData = {
  // 01 Patient
  fullName: string;
  dateOfBirth: string;
  age: string;
  sexAtBirth: string;
  phone: string;
  email: string;
  address: string;
  idNumber: string;
  idIssuePlace: string;
  primaryCarePhysician: string;
  firstAppointmentDate: string;
  assignedProvider: string;
  referredBy: string;
  // 02 Meds
  prescriptionMedications: string;
  supplementsPeptides: string;
  medicationAllergies: string;
  foodAllergies: string;
  otherAllergies: string;
  // 03 History
  conditions: string[];
  otherConditions: string;
  recentSurgeries: string;
  pregnantBreastfeeding: string;
  // 04 GLP
  glpMedications: string[];
  glpDose: string;
  glpDuration: string;
  glpReasonStopped: string;
  glpSideEffects: string;
  // 05 Contraindications
  contraindications: string[];
  familyMtcMen2: string;
  allergicReactionAny: string;
  allergicReactionDetails: string;
  // 07 Attestation
  attestationName: string;
  attestationDate: string;
  clientSignatureDataUrl: string;
  // Scheduling context (optional, filled from page)
  requestedDate?: string;
  requestedTime?: string;
  schedulingNotes?: string;
};

export const MEDICAL_CONDITIONS = [
  "Type 2 Diabetes / Prediabetes",
  "Hypertension",
  "Hyperlipidemia",
  "Coronary Artery / Heart Disease",
  "Sleep Apnea",
  "PCOS / Hormonal Disorder",
  "Fatty Liver Disease",
  "Kidney Disease",
  "GERD / Gastric Ulcer",
  "IBS / Crohn's / Ulcerative Colitis",
  "Gallstones / Gallbladder Removal",
  "Thyroid Disease",
  "Depression / Anxiety / Eating Disorder",
  "Cancer (any type)",
] as const;

export const GLP_MEDICATIONS = [
  "Semaglutide (Ozempic/Wegovy)",
  "Tirzepatide (Mounjaro/Zepbound)",
  "Retatrutide",
  "Liraglutide (Saxenda/Victoza)",
  "Dulaglutide (Trulicity)",
  "Exenatide (Byetta/Bydureon)",
  "Cagrilintide",
  "Tesofensine",
  "Other prescription weight-loss medication",
  "None of the above",
] as const;

export const CONTRAINDICATIONS = [
  "Medullary Thyroid Cancer (MTC)",
  "Multiple Endocrine Neoplasia type 2 (MEN2)",
  "Pancreatitis",
  "Gastroparesis",
  "Severe / uncontrolled GERD",
  "Bowel obstruction",
  "Severe kidney disease",
  "Severe liver disease",
  "None of the above",
] as const;

export const PROVIDER_CONNECT_STEPS = [
  { id: 1, title: "Patient Info" },
  { id: 2, title: "Medications" },
  { id: 3, title: "History" },
  { id: 4, title: "GLP History" },
  { id: 5, title: "Screening & Consent" },
  { id: 6, title: "Schedule" },
] as const;

/** @deprecated use PROVIDER_CONNECT_STEPS */
export const INTAKE_STEPS = PROVIDER_CONNECT_STEPS;

export const emptyIntakeForm = (): IntakeFormData => ({
  fullName: "",
  dateOfBirth: "",
  age: "",
  sexAtBirth: "",
  phone: "",
  email: "",
  address: "",
  idNumber: "",
  idIssuePlace: "",
  primaryCarePhysician: "",
  firstAppointmentDate: "",
  assignedProvider: "Dr. Carmen Ramirez",
  referredBy: "",
  prescriptionMedications: "",
  supplementsPeptides: "",
  medicationAllergies: "",
  foodAllergies: "",
  otherAllergies: "",
  conditions: [],
  otherConditions: "",
  recentSurgeries: "",
  pregnantBreastfeeding: "",
  glpMedications: [],
  glpDose: "",
  glpDuration: "",
  glpReasonStopped: "",
  glpSideEffects: "",
  contraindications: [],
  familyMtcMen2: "",
  allergicReactionAny: "",
  allergicReactionDetails: "",
  attestationName: "",
  attestationDate: new Date().toISOString().slice(0, 10),
  clientSignatureDataUrl: "",
});

export function formatIntakeEmailBody(data: IntakeFormData): string {
  const list = (items: string[]) => (items.length ? items.join(", ") : "—");
  const line = (label: string, value: string) => `${label}: ${value?.trim() || "—"}`;

  return [
    "KIAN PRIVÉ — Provider Connect + Compounded Wellness Intake",
    "==========================================================",
    "",
    "SCHEDULING REQUEST",
    line("Requested date", data.requestedDate ?? ""),
    line("Requested time", data.requestedTime ?? ""),
    line("Discussion notes", data.schedulingNotes ?? ""),
    "",
    "01 PATIENT INFORMATION",
    line("Full Name", data.fullName),
    line("Date of Birth", data.dateOfBirth),
    line("Age", data.age),
    line("Sex at Birth", data.sexAtBirth),
    line("Phone", data.phone),
    line("Email", data.email),
    line("Address", data.address),
    line("Driver's License / Passport #", data.idNumber),
    line("State / Country of Issue", data.idIssuePlace),
    line("Primary Care Physician", data.primaryCarePhysician),
    line("Date of First Appointment", data.firstAppointmentDate),
    line("Assigned KIAN Privé Provider", data.assignedProvider),
    line("Referred by", data.referredBy),
    "",
    "02 CURRENT MEDICATIONS, SUPPLEMENTS & ALLERGIES",
    line("Prescription Medications", data.prescriptionMedications),
    line("Supplements & Peptides", data.supplementsPeptides),
    line("Medication Allergies", data.medicationAllergies),
    line("Food Allergies", data.foodAllergies),
    line("Other Allergies", data.otherAllergies),
    "",
    "03 PAST MEDICAL & SURGICAL HISTORY",
    line("Conditions", list(data.conditions)),
    line("Other conditions", data.otherConditions),
    line("Surgical procedures (past 12 months)", data.recentSurgeries),
    line("Pregnant / breastfeeding / planning", data.pregnantBreastfeeding),
    "",
    "04 GLP-1 / GLP-2 / GLP-3 & WEIGHT-LOSS HISTORY",
    line("Previous medications", list(data.glpMedications)),
    line("Dose", data.glpDose),
    line("Duration Used", data.glpDuration),
    line("Reason Stopped", data.glpReasonStopped),
    line("Side effects / notable experience", data.glpSideEffects),
    "",
    "05 CONTRAINDICATION SCREENING",
    line("Personal history", list(data.contraindications)),
    line("Family history of MTC or MEN2", data.familyMtcMen2),
    line("Allergic reaction to med/supplement/peptide", data.allergicReactionAny),
    line("If yes, substance & reaction", data.allergicReactionDetails),
    "",
    "07 PATIENT ATTESTATION",
    line("Printed Name", data.attestationName),
    line("Date", data.attestationDate),
    line("Handwritten signature", data.clientSignatureDataUrl ? "Captured" : "Missing"),
    "",
    "— Submitted via KIAN Privé Connect with Provider page",
    "This information is confidential and protected under HIPAA guidelines.",
  ].join("\n");
}
