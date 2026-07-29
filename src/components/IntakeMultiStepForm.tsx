import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  CONTRAINDICATIONS,
  emptyIntakeForm,
  GLP_MEDICATIONS,
  MEDICAL_CONDITIONS,
  PROVIDER_CONNECT_STEPS,
  type IntakeFormData,
} from "@/lib/intake-form";
import { sendProviderConnectEmail } from "@/lib/send-emails";
import { SignaturePad } from "@/components/SignaturePad";

const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const inputClass =
  "min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/70";

const textareaClass = `${inputClass} min-h-[96px] resize-y`;

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckboxGrid({
  options,
  values,
  onChange,
  name,
}: {
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
  name: string;
}) {
  const toggle = (option: string) => {
    const exclusive = option === "None of the above";
    if (exclusive) {
      onChange(values.includes(option) ? [] : [option]);
      return;
    }
    const withoutNone = values.filter((v) => v !== "None of the above");
    onChange(
      withoutNone.includes(option)
        ? withoutNone.filter((v) => v !== option)
        : [...withoutNone, option],
    );
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const checked = values.includes(option);
        return (
          <label
            key={option}
            className={cn(
              "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
              checked
                ? "border-primary bg-primary/10 text-foreground"
                : "border-primary/20 bg-background/50 text-foreground/85 hover:border-primary/50",
            )}
          >
            <input
              type="checkbox"
              name={name}
              checked={checked}
              onChange={() => toggle(option)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

export function ProviderConnectForm() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [step, setStep] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IntakeFormData>(() => emptyIntakeForm());
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [signatureFullscreen, setSignatureFullscreen] = useState(false);

  const setField = <K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (index: number): string | null => {
    if (index === 0) {
      if (!date) return "Please select a consultation date.";
      if (!time) return "Please select a time slot.";
    }
    if (index === 1) {
      if (!data.fullName.trim()) return "Please enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Please enter a valid email.";
      if (!data.phone.trim()) return "Please enter your phone number.";
      if (!data.dateOfBirth) return "Please enter your date of birth.";
    }
    if (index === 5) {
      if (!data.familyMtcMen2) return "Please answer the family history question.";
      if (!data.allergicReactionAny) return "Please answer the allergy question.";
      if (data.allergicReactionAny === "Yes" && !data.allergicReactionDetails.trim()) {
        return "Please describe the allergic reaction.";
      }
      if (!consentAcknowledged) {
        return "Please acknowledge the disclaimer and informed consent.";
      }
      if (data.attestationName.trim().length < 2) {
        return "Please type your full name as your printed signature.";
      }
      if (!data.attestationDate) return "Please select the attestation date.";
      if (!data.clientSignatureDataUrl || data.clientSignatureDataUrl.length < 40) {
        return "Please add your handwritten signature (open full screen to sign).";
      }
    }
    return null;
  };

  const goNext = () => {
    const msg = validateStep(step);
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    if (step === 1 && !data.attestationName.trim()) {
      setField("attestationName", data.fullName);
    }
    setStep((s) => Math.min(s + 1, PROVIDER_CONNECT_STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const msg = validateStep(5);
    if (msg) {
      setError(msg);
      return;
    }
    if (!date || !time) {
      setError("Please select a date and time.");
      setStep(0);
      return;
    }

    setError(null);
    setSending(true);
    try {
      await sendProviderConnectEmail({
        data: {
          ...data,
          assignedProvider: data.assignedProvider?.trim() || "Dr. Carmen Ramirez",
          requestedDate: format(date, "EEEE, MMMM d, yyyy"),
          requestedTime: time,
          schedulingNotes: data.schedulingNotes?.trim() || undefined,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your request. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <section
        className="mt-12 w-full rounded-2xl border border-primary/30 bg-card/60 p-8 text-center shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)]"
        aria-live="polite"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
          <Check className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl text-foreground" style={serif}>
          Request & intake sent
        </h2>
        <p className="mt-3 text-sm text-foreground/80">
          Your consultation request and compounded wellness intake were emailed to our clinical
          team. We will confirm availability shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setStep(0);
            setDate(undefined);
            setTime(undefined);
            setData(emptyIntakeForm());
            setConsentAcknowledged(false);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-5 py-2 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10"
          style={serif}
        >
          Submit another request
        </button>
      </section>
    );
  }

  return (
    <section className="mt-12 w-full rounded-2xl border border-primary/20 bg-card/60 p-6 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />
          <div className="h-px w-16 bg-primary/40" />
        </div>
        <h2 className="mt-4 text-2xl text-foreground sm:text-3xl" style={serif}>
          Book & Complete Intake
        </h2>
        <p className="mt-2 max-w-lg text-sm text-foreground/75" style={serif}>
          Choose your consultation time, then complete the compounded wellness intake in one
          guided flow. Everything is sent securely to our team.
        </p>
        <a
          href="/assets/kian-prive-intake-form.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs uppercase tracking-[0.2em] text-primary underline-offset-4 hover:underline"
        >
          Download PDF copy
        </a>
      </div>

      <ol className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Form steps">
        {PROVIDER_CONNECT_STEPS.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] tracking-wide sm:text-xs",
              i === step
                ? "border-primary bg-primary text-primary-foreground"
                : i < step
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-primary/20 text-foreground/55",
            )}
          >
            {s.id}. {s.title}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-5" aria-live="polite">
        {step === 0 && (
          <>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="flex flex-col items-center">
                <div className="mb-3 flex items-center gap-2 text-sm text-foreground/80" style={serif}>
                  <CalendarIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                  Select a date
                </div>
                <div className="rounded-xl border border-primary/20 bg-background/60 p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setTime(undefined);
                    }}
                    disabled={(d) => {
                      const day = d.getDay();
                      return d < today || day === 0 || day === 6;
                    }}
                    initialFocus
                    className={cn("pointer-events-auto")}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="mb-3 flex items-center gap-2 text-sm text-foreground/80" style={serif}>
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                  Select a time
                </div>
                <div
                  role="radiogroup"
                  aria-label="Available time slots"
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {TIME_SLOTS.map((slot) => {
                    const active = time === slot;
                    const disabled = !date;
                    return (
                      <button
                        type="button"
                        key={slot}
                        role="radio"
                        aria-checked={active}
                        disabled={disabled}
                        onClick={() => setTime(slot)}
                        className={cn(
                          "min-h-11 rounded-full border px-4 py-2.5 text-xs tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/30 bg-background/60 text-foreground hover:border-primary hover:bg-primary/10",
                          disabled &&
                            "cursor-not-allowed opacity-50 hover:border-primary/30 hover:bg-background/60",
                        )}
                        style={serif}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {!date && (
                  <p className="mt-3 text-xs italic text-foreground/60">
                    Choose a date to see available times.
                  </p>
                )}
                {date && time && (
                  <p className="mt-4 text-sm text-foreground/80" style={serif}>
                    Requesting{" "}
                    <span className="font-semibold text-foreground">
                      {format(date, "EEEE, MMMM d")} at {time}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <Field id="schedulingNotes" label="What would you like to discuss? (optional)">
              <textarea
                id="schedulingNotes"
                className={textareaClass}
                value={data.schedulingNotes ?? ""}
                onChange={(e) => setField("schedulingNotes", e.target.value.slice(0, 1000))}
                rows={3}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="fullName" label="Full Name">
                <input
                  id="fullName"
                  className={inputClass}
                  value={data.fullName}
                  onChange={(e) => setField("fullName", e.target.value.slice(0, 120))}
                  autoComplete="name"
                />
              </Field>
              <Field id="dateOfBirth" label="Date of Birth">
                <input
                  id="dateOfBirth"
                  type="date"
                  className={inputClass}
                  value={data.dateOfBirth}
                  onChange={(e) => setField("dateOfBirth", e.target.value)}
                />
              </Field>
              <Field id="age" label="Age">
                <input
                  id="age"
                  className={inputClass}
                  value={data.age}
                  onChange={(e) => setField("age", e.target.value.slice(0, 10))}
                  inputMode="numeric"
                />
              </Field>
              <Field id="sexAtBirth" label="Sex at Birth">
                <select
                  id="sexAtBirth"
                  className={inputClass}
                  value={data.sexAtBirth}
                  onChange={(e) => setField("sexAtBirth", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Intersex">Intersex</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </Field>
              <Field id="phone" label="Phone">
                <input
                  id="phone"
                  type="tel"
                  className={inputClass}
                  value={data.phone}
                  onChange={(e) => setField("phone", e.target.value.slice(0, 40))}
                  autoComplete="tel"
                />
              </Field>
              <Field id="email" label="Email">
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={data.email}
                  onChange={(e) => setField("email", e.target.value.slice(0, 255))}
                  autoComplete="email"
                />
              </Field>
            </div>
            <Field id="address" label="Address">
              <textarea
                id="address"
                className={textareaClass}
                value={data.address}
                onChange={(e) => setField("address", e.target.value.slice(0, 500))}
                rows={2}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="idNumber" label="Driver's License or Passport #">
                <input
                  id="idNumber"
                  className={inputClass}
                  value={data.idNumber}
                  onChange={(e) => setField("idNumber", e.target.value.slice(0, 120))}
                />
              </Field>
              <Field id="idIssuePlace" label="State / Country of Issue">
                <input
                  id="idIssuePlace"
                  className={inputClass}
                  value={data.idIssuePlace}
                  onChange={(e) => setField("idIssuePlace", e.target.value.slice(0, 120))}
                />
              </Field>
              <Field id="primaryCarePhysician" label="Primary Care Physician">
                <input
                  id="primaryCarePhysician"
                  className={inputClass}
                  value={data.primaryCarePhysician}
                  onChange={(e) => setField("primaryCarePhysician", e.target.value.slice(0, 120))}
                />
              </Field>
              <Field id="firstAppointmentDate" label="Date of First Appointment">
                <input
                  id="firstAppointmentDate"
                  type="date"
                  className={inputClass}
                  value={data.firstAppointmentDate}
                  onChange={(e) => setField("firstAppointmentDate", e.target.value)}
                />
              </Field>
            </div>
            <Field id="assignedProvider" label="Assigned KIAN Privé Provider">
              <input
                id="assignedProvider"
                className={inputClass}
                value={data.assignedProvider || "Dr. Carmen Ramirez"}
                onChange={(e) => setField("assignedProvider", e.target.value.slice(0, 120))}
                placeholder="Dr. Carmen Ramirez"
              />
            </Field>
            <Field id="referredBy" label="Referred by">
              <input
                id="referredBy"
                className={inputClass}
                value={data.referredBy}
                onChange={(e) => setField("referredBy", e.target.value.slice(0, 200))}
                placeholder="Name of person or clinic who referred you"
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field id="prescriptionMedications" label="Prescription Medications (name, dose, frequency)">
              <textarea
                id="prescriptionMedications"
                className={textareaClass}
                value={data.prescriptionMedications}
                onChange={(e) => setField("prescriptionMedications", e.target.value.slice(0, 2000))}
                rows={3}
              />
            </Field>
            <Field id="supplementsPeptides" label="Supplements & Peptides Currently in Use">
              <textarea
                id="supplementsPeptides"
                className={textareaClass}
                value={data.supplementsPeptides}
                onChange={(e) => setField("supplementsPeptides", e.target.value.slice(0, 2000))}
                rows={3}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="medicationAllergies" label="Medication Allergies">
                <textarea
                  id="medicationAllergies"
                  className={textareaClass}
                  value={data.medicationAllergies}
                  onChange={(e) => setField("medicationAllergies", e.target.value.slice(0, 1000))}
                  rows={2}
                />
              </Field>
              <Field id="foodAllergies" label="Food Allergies">
                <textarea
                  id="foodAllergies"
                  className={textareaClass}
                  value={data.foodAllergies}
                  onChange={(e) => setField("foodAllergies", e.target.value.slice(0, 1000))}
                  rows={2}
                />
              </Field>
              <Field id="otherAllergies" label="Other Allergies">
                <textarea
                  id="otherAllergies"
                  className={textareaClass}
                  value={data.otherAllergies}
                  onChange={(e) => setField("otherAllergies", e.target.value.slice(0, 1000))}
                  rows={2}
                />
              </Field>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-foreground/80">Please check any conditions that apply to you:</p>
            <CheckboxGrid
              name="conditions"
              options={MEDICAL_CONDITIONS}
              values={data.conditions}
              onChange={(next) => setField("conditions", next)}
            />
            <Field id="otherConditions" label="Other pre-existing medical conditions">
              <textarea
                id="otherConditions"
                className={textareaClass}
                value={data.otherConditions}
                onChange={(e) => setField("otherConditions", e.target.value.slice(0, 1000))}
                rows={2}
              />
            </Field>
            <Field id="recentSurgeries" label="Surgical procedures, past 12 months">
              <textarea
                id="recentSurgeries"
                className={textareaClass}
                value={data.recentSurgeries}
                onChange={(e) => setField("recentSurgeries", e.target.value.slice(0, 1000))}
                rows={2}
              />
            </Field>
            <Field
              id="pregnantBreastfeeding"
              label="Currently pregnant, breastfeeding, or planning to become pregnant"
            >
              <select
                id="pregnantBreastfeeding"
                className={inputClass}
                value={data.pregnantBreastfeeding}
                onChange={(e) => setField("pregnantBreastfeeding", e.target.value)}
              >
                <option value="">Select</option>
                <option value="No">No</option>
                <option value="Yes — pregnant">Yes — pregnant</option>
                <option value="Yes — breastfeeding">Yes — breastfeeding</option>
                <option value="Yes — planning">Yes — planning</option>
                <option value="Not applicable">Not applicable</option>
              </select>
            </Field>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-foreground/80">
              Have you previously used any of the following? (Select all that apply)
            </p>
            <CheckboxGrid
              name="glpMedications"
              options={GLP_MEDICATIONS}
              values={data.glpMedications}
              onChange={(next) => setField("glpMedications", next)}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="glpDose" label="Dose">
                <input
                  id="glpDose"
                  className={inputClass}
                  value={data.glpDose}
                  onChange={(e) => setField("glpDose", e.target.value.slice(0, 200))}
                />
              </Field>
              <Field id="glpDuration" label="Duration Used">
                <input
                  id="glpDuration"
                  className={inputClass}
                  value={data.glpDuration}
                  onChange={(e) => setField("glpDuration", e.target.value.slice(0, 200))}
                />
              </Field>
              <Field id="glpReasonStopped" label="Reason Stopped (if applicable)">
                <input
                  id="glpReasonStopped"
                  className={inputClass}
                  value={data.glpReasonStopped}
                  onChange={(e) => setField("glpReasonStopped", e.target.value.slice(0, 500))}
                />
              </Field>
            </div>
            <Field
              id="glpSideEffects"
              label="Side effects or notable experience with prior GLP / peptide therapy"
            >
              <textarea
                id="glpSideEffects"
                className={textareaClass}
                value={data.glpSideEffects}
                onChange={(e) => setField("glpSideEffects", e.target.value.slice(0, 2000))}
                rows={3}
              />
            </Field>
          </>
        )}

        {step === 5 && (
          <>
            <p className="text-sm text-foreground/80">
              Personal history of any of the following (may affect treatment eligibility):
            </p>
            <CheckboxGrid
              name="contraindications"
              options={CONTRAINDICATIONS}
              values={data.contraindications}
              onChange={(next) => setField("contraindications", next)}
            />

            <fieldset className="space-y-3">
              <legend className={labelClass}>
                Family history of MTC or MEN2 syndrome (parent, sibling, or child)?
              </legend>
              <div className="flex gap-4">
                {(["Yes", "No"] as const).map((opt) => (
                  <label key={opt} className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="familyMtcMen2"
                      checked={data.familyMtcMen2 === opt}
                      onChange={() => setField("familyMtcMen2", opt)}
                      className="accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className={labelClass}>
                Allergic reaction to any medication, supplement, or peptide?
              </legend>
              <div className="flex gap-4">
                {(["Yes", "No"] as const).map((opt) => (
                  <label key={opt} className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="allergicReactionAny"
                      checked={data.allergicReactionAny === opt}
                      onChange={() => setField("allergicReactionAny", opt)}
                      className="accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>

            {data.allergicReactionAny === "Yes" && (
              <Field id="allergicReactionDetails" label="If yes, please specify substance & reaction">
                <textarea
                  id="allergicReactionDetails"
                  className={textareaClass}
                  value={data.allergicReactionDetails}
                  onChange={(e) =>
                    setField("allergicReactionDetails", e.target.value.slice(0, 1000))
                  }
                  rows={2}
                />
              </Field>
            )}

            <div className="rounded-xl border border-primary/20 bg-background/40 p-4 sm:p-5">
              <p className="text-sm font-medium text-foreground">Disclaimer & Informed Consent</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-foreground/80">
                <li>
                  Information is for consultation only and does not constitute a diagnosis or treatment
                  plan.
                </li>
                <li>
                  Peptide therapies are provided only under licensed physician oversight after clinical
                  evaluation.
                </li>
                <li>
                  Some therapies may be used off-label or investigationally; risks will be discussed
                  before any protocol begins.
                </li>
                <li>
                  All personal and medical information is confidential and protected under HIPAA
                  guidelines.
                </li>
              </ol>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-primary/25 bg-background/60 px-3 py-2.5 text-sm text-foreground/85">
                <input
                  type="checkbox"
                  checked={consentAcknowledged}
                  onChange={(e) => setConsentAcknowledged(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span>
                  I confirm the information above is accurate and complete, and I agree to the
                  disclaimer and informed consent.
                </span>
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="attestationName" label="Printed full name">
                  <input
                    id="attestationName"
                    className={`${inputClass} font-[cursive]`}
                    value={data.attestationName}
                    onChange={(e) => setField("attestationName", e.target.value.slice(0, 120))}
                    placeholder="Your full legal name"
                  />
                </Field>
                <Field id="attestationDate" label="Date signed">
                  <input
                    id="attestationDate"
                    type="date"
                    className={inputClass}
                    value={data.attestationDate}
                    onChange={(e) => setField("attestationDate", e.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-5 rounded-xl border border-primary/25 bg-background/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">Handwritten signature</p>
                  <button
                    type="button"
                    onClick={() => setSignatureFullscreen(true)}
                    className="rounded-full border border-primary px-4 py-2 text-xs uppercase tracking-[0.14em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    Sign full screen
                  </button>
                </div>
                {data.clientSignatureDataUrl ? (
                  <img
                    src={data.clientSignatureDataUrl}
                    alt="Your signature"
                    className="mt-3 max-h-28 rounded-md border border-primary/20 bg-white p-2"
                  />
                ) : (
                  <p className="mt-3 text-xs text-foreground/65">
                    Open full screen to sign with your finger or mouse, then apply it to this form.
                  </p>
                )}
                <div className="mt-3">
                  <SignaturePad
                    value={data.clientSignatureDataUrl || null}
                    onChange={(url) => setField("clientSignatureDataUrl", url ?? "")}
                    label="Quick sign"
                    height={140}
                  />
                </div>
              </div>

              {signatureFullscreen ? (
                <SignaturePad
                  fullScreen
                  value={data.clientSignatureDataUrl || null}
                  onChange={(url) => setField("clientSignatureDataUrl", url ?? "")}
                  label="Sign your intake form"
                  onCloseFullScreen={() => setSignatureFullscreen(false)}
                />
              ) : null}
            </div>

            {date && time && (
              <p className="text-center text-sm text-foreground/80" style={serif}>
                Submitting for{" "}
                <span className="font-semibold text-foreground">
                  {format(date, "EEEE, MMMM d")} at {time}
                </span>
              </p>
            )}
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-5 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || sending}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm tracking-wide transition-colors",
            step === 0 ? "cursor-not-allowed opacity-40" : "hover:border-primary hover:bg-primary/10",
          )}
          style={serif}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        {step < PROVIDER_CONNECT_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            style={serif}
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            style={serif}
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" aria-hidden="true" />
                Submit Request & Intake
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

/** @deprecated use ProviderConnectForm */
export const IntakeMultiStepForm = ProviderConnectForm;
