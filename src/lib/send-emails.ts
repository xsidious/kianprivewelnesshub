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
  lastPhysicalDate: z.string().max(20).optional().default(""),
  lastBloodworkDate: z.string().max(20).optional().default(""),
  bloodworkWithinNormalLimits: z.string().max(10).optional().default(""),
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
  photoVideoConsentAccepted: z.boolean().refine((value) => value === true, {
    message: "Photo/video HIPAA media authorization is required.",
  }),
  photoVideoConsentSignedAt: z.string().min(1).max(40),
  photoVideoConsentPrintedName: z.string().trim().min(2).max(120),
  photoVideoGuardianName: z.string().max(120).optional().default(""),
  photoVideoGuardianRelationship: z.string().max(120).optional().default(""),
  requestedDate: z.string().max(80).optional().default("To be scheduled"),
  requestedTime: z.string().max(40).optional().default("TBD"),
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

async function forwardToKianPrive(
  payload: IntakeFormData,
  payment: {
    opaqueData: { dataDescriptor: string; dataValue: string };
    billTo?: { zip?: string; firstName?: string; lastName?: string };
    testCardNumber?: string;
  },
) {
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
    body: JSON.stringify({
      intake: payload,
      opaqueData: payment.opaqueData,
      billTo: payment.billTo,
      testCardNumber: payment.testCardNumber,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[wellness-hub] KIAN Privé intake forward failed:", response.status, errorText);
    let message = "The $75 provider review deposit could not be processed. Please check the card and try again.";
    try {
      const parsed = JSON.parse(errorText) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      // keep the default message
    }
    throw new Error(message);
  }

  const result = (await response.json()) as {
    ok?: boolean;
    referenceId?: string;
    trackingToken?: string;
    trackUrl?: string;
    hasAccount?: boolean;
  };

  // Prefer patient-facing KP- code; production used to put the cuid in referenceId.
  const requestCode =
    (result.trackingToken && /^KP-/i.test(result.trackingToken) ? result.trackingToken : null) ||
    (result.referenceId && /^KP-/i.test(result.referenceId) ? result.referenceId : null) ||
    result.trackingToken ||
    result.referenceId;

  return {
    forwarded: true as const,
    referenceId: requestCode,
    trackingToken: requestCode,
    trackUrl: result.trackUrl,
    hasAccount: result.hasAccount,
  };
}

const submitSchema = z.object({
  intake: intakeSchema,
  opaqueData: z.object({
    dataDescriptor: z.string().min(1),
    dataValue: z.string().min(1),
  }),
  billTo: z
    .object({
      zip: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })
    .optional(),
  testCardNumber: z.string().optional(),
});

export const sendProviderConnectEmail = createServerFn({ method: "POST" })
  .validator(submitSchema)
  .handler(async ({ data }) => {
    const payload = data.intake as IntakeFormData;

    if (!process.env.KIAN_PRIVE_INTAKE_SECRET?.trim()) {
      throw new Error("Provider review deposit cannot be processed right now. Please contact concierge.");
    }

    // Charge the $75 deposit and store the chart before anyone is emailed.
    const sync = await forwardToKianPrive(payload, {
      opaqueData: data.opaqueData,
      billTo: data.billTo,
      testCardNumber: data.testCardNumber,
    });

    await sendWithResend({
      subject: `Provider Connect — ${payload.fullName} ($75 review deposit paid)`,
      text: `${formatIntakeEmailBody(payload)}\n\nProvider review deposit: $75 paid. Chart is in Wellness Tech for physician review.`,
      replyTo: payload.email,
    });

    const requestCode = sync.forwarded
      ? sync.trackingToken || sync.referenceId
      : undefined;

    return {
      ok: true as const,
      forwardedToKianPrive: sync.forwarded,
      referenceId: requestCode,
      trackingToken: requestCode,
      trackUrl: sync.forwarded ? sync.trackUrl : undefined,
      hasAccount: sync.forwarded ? sync.hasAccount : undefined,
    };
  });

/** @deprecated use sendProviderConnectEmail */
export const sendIntakeFormEmail = sendProviderConnectEmail;
