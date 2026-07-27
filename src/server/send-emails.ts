import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
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
  requestedDate: z.string().max(80).optional(),
  requestedTime: z.string().max(40).optional(),
  schedulingNotes: z.string().max(1000).optional(),
});

const scheduleSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().max(40).optional(),
  notes: z.string().max(1000).optional(),
  dateStr: z.string().min(1).max(80),
  time: z.string().min(1).max(40),
  signature: z.string().min(1).max(120),
  signatureDate: z.string().min(1).max(40),
});

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email is not configured. Missing RESEND_API_KEY.");
  }
  const to = process.env.RESEND_TO_EMAIL || "consultations@kianprive.com";
  const from = process.env.RESEND_FROM_EMAIL || "KIAN Privé <onboarding@resend.dev>";
  return { resend: new Resend(apiKey), to, from };
}

export const sendIntakeFormEmail = createServerFn({ method: "POST" })
  .validator(intakeSchema)
  .handler(async ({ data }) => {
    const { resend, to, from } = getResendConfig();
    const payload = data as IntakeFormData;
    const text = formatIntakeEmailBody(payload);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.email,
      subject: `Intake Form — ${payload.fullName}`,
      text,
    });

    if (error) {
      console.error("Resend intake error:", error);
      throw new Error(error.message || "Failed to send intake form.");
    }

    return { ok: true as const };
  });

export const sendScheduleRequestEmail = createServerFn({ method: "POST" })
  .validator(scheduleSchema)
  .handler(async ({ data }) => {
    const { resend, to, from } = getResendConfig();

    const text = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      "",
      `Requested date: ${data.dateStr}`,
      `Requested time: ${data.time}`,
      "",
      data.notes ? `Notes:\n${data.notes}` : null,
      "",
      `Signature: ${data.signature}`,
      `Date signed: ${data.signatureDate}`,
      "",
      "— Sent from the KIAN Privé scheduling page",
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `Consultation Request — ${data.name} — ${data.dateStr} at ${data.time}`,
      text,
    });

    if (error) {
      console.error("Resend schedule error:", error);
      throw new Error(error.message || "Failed to send consultation request.");
    }

    return { ok: true as const };
  });
