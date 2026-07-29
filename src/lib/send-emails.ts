import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { formatIntakeEmailBody, type IntakeFormData } from "@/lib/intake-form";

const intakeSchema = z.object({
  fullName: z.string().min(1).max(120),
  dateOfBirth: z.string().max(40),
  age: z.string().max(10),
  sexAtBirth: z.string().max(40),
  phone: z.string().max(40),
  email: z.string().email().max(255),
  address: z.string().max(500),
  idNumber: z.string().max(120),
  idIssuePlace: z.string().max(120),
  primaryCarePhysician: z.string().max(120),
  firstAppointmentDate: z.string().max(40),
  assignedProvider: z.string().max(120),
  referredBy: z.string().max(200).optional().default(""),
  prescriptionMedications: z.string().max(2000),
  supplementsPeptides: z.string().max(2000),
  medicationAllergies: z.string().max(1000),
  foodAllergies: z.string().max(1000),
  otherAllergies: z.string().max(1000),
  conditions: z.array(z.string().max(120)).max(30),
  otherConditions: z.string().max(1000),
  recentSurgeries: z.string().max(1000),
  pregnantBreastfeeding: z.string().max(40),
  glpMedications: z.array(z.string().max(120)).max(20),
  glpDose: z.string().max(200),
  glpDuration: z.string().max(200),
  glpReasonStopped: z.string().max(500),
  glpSideEffects: z.string().max(2000),
  contraindications: z.array(z.string().max(120)).max(20),
  familyMtcMen2: z.string().max(10),
  allergicReactionAny: z.string().max(10),
  allergicReactionDetails: z.string().max(1000),
  attestationName: z.string().min(1).max(120),
  attestationDate: z.string().min(1).max(40),
  clientSignatureDataUrl: z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z
      .string()
      .min(40, "Please add your handwritten signature on the last step before submitting.")
      .max(900_000),
  ),
  requestedDate: z.string().min(1).max(80),
  requestedTime: z.string().min(1).max(40),
  schedulingNotes: z.string().max(1000).optional(),
});

async function sendWithResend(options: {
  subject: string;
  text: string;
  replyTo: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email is not configured. Missing RESEND_API_KEY.");
  }

  const to = [
    process.env.RESEND_TO_EMAIL || "consultations@kianprive.com",
    "millenniumedgemed@gmail.com",
  ];
  const from = process.env.RESEND_FROM_EMAIL || "KIAN Privé <onboarding@resend.dev>";

  // Dynamic import keeps the Resend SDK out of the client bundle.
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [...new Set(to)],
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message || "Failed to send email.");
  }
}

async function forwardToKianPrive(payload: IntakeFormData) {
  const baseUrl = (process.env.KIAN_PRIVE_API_URL || "https://www.kianprive.com").replace(/\/$/, "");
  const secret = process.env.KIAN_PRIVE_INTAKE_SECRET?.trim();

  if (!secret) {
    console.warn(
      "[wellness-hub] KIAN_PRIVE_INTAKE_SECRET is not set — skipping forward to KIAN Privé Clinical Intake.",
    );
    return { forwarded: false as const, reason: "missing_secret" as const };
  }

  const response = await fetch(`${baseUrl}/api/intake/wellness-hub`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-wellness-hub-secret": secret,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[wellness-hub] KIAN Privé intake forward failed:", response.status, errorText);
    throw new Error("Could not sync intake to KIAN Privé. Please try again or contact concierge.");
  }

  const result = (await response.json()) as { ok?: boolean; referenceId?: string };
  return {
    forwarded: true as const,
    referenceId: result.referenceId,
  };
}

export const sendProviderConnectEmail = createServerFn({ method: "POST" })
  .validator(intakeSchema)
  .handler(async ({ data }) => {
    const payload = data as IntakeFormData;

    // 1) Keep existing Resend notification from Wellness Hub
    await sendWithResend({
      subject: `Provider Connect — ${payload.fullName} — ${payload.requestedDate} at ${payload.requestedTime}`,
      text: formatIntakeEmailBody(payload),
      replyTo: payload.email,
    });

    // 2) Mirror submission into KIAN Privé Clinical Intake (DB + staff/patient email there)
    const sync = await forwardToKianPrive(payload);

    return {
      ok: true as const,
      forwardedToKianPrive: sync.forwarded,
      referenceId: sync.forwarded ? sync.referenceId : undefined,
    };
  });

/** @deprecated use sendProviderConnectEmail */
export const sendIntakeFormEmail = sendProviderConnectEmail;
