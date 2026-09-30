"use client";

import { useEffect } from "react";

const KEY = "kian_partner_ref";

export function capturePartnerRef(value?: string | null) {
  const ref = (value ?? "").trim().slice(0, 80);
  if (!ref) return;
  try {
    sessionStorage.setItem(KEY, ref.toUpperCase());
  } catch {
    /* ignore */
  }
}

export function readPartnerRef() {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/** Remember ?ref= or ?partner= from KIAN Privé so the clinical intake keeps the code. */
export function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    capturePartnerRef(params.get("ref") || params.get("partner"));
  }, []);
  return null;
}
