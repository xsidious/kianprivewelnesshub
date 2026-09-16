"use client";

import { useEffect, useState } from "react";
import { getReviewFeeConfig } from "@/lib/review-fee";

const REVIEW_FEE_USD = 75;

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: unknown,
        callback: (response: {
          messages?: { resultCode?: string; message?: Array<{ text?: string }> };
          opaqueData?: { dataDescriptor: string; dataValue: string };
        }) => void,
      ) => void;
    };
  }
}

type Props = {
  busy?: boolean;
  onPay: (input: {
    opaqueData: { dataDescriptor: string; dataValue: string };
    billTo: { zip?: string };
    testCardNumber?: string;
  }) => Promise<void>;
};

export function ReviewDepositPay({ busy = false, onPay }: Props) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [paying, setPaying] = useState(false);
  const [config, setConfig] = useState<Awaited<ReturnType<typeof getReviewFeeConfig>> | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    void (async () => {
      const data = await getReviewFeeConfig();
      setConfig(data);
      if (data.testMode && data.testCard) {
        setCardNumber(data.testCard.number);
        setExpMonth(data.testCard.expMonth);
        setExpYear(data.testCard.expYear);
        setCvv(data.testCard.cvv);
        setZip(data.testCard.zip);
        setReady(true);
        return;
      }
      const script = document.createElement("script");
      script.src =
        data.env === "production"
          ? "https://js.authorize.net/v1/Accept.js"
          : "https://jstest.authorize.net/v1/Accept.js";
      script.async = true;
      script.onload = () => setReady(true);
      document.body.appendChild(script);
    })().catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Could not load payment form.");
    });
  }, []);

  async function pay() {
    setPaying(true);
    setStatus("");
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < 13) {
      setPaying(false);
      setStatus("Enter a card number.");
      return;
    }

    const submit = async (opaqueData: { dataDescriptor: string; dataValue: string }) => {
      try {
        await onPay({
          opaqueData,
          billTo: { zip },
          testCardNumber: config?.testMode ? digits : undefined,
        });
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Payment failed.");
      } finally {
        setPaying(false);
      }
    };

    if (config?.testMode) {
      await submit({
        dataDescriptor: "COMMON.ACCEPT.INAPP.PAYMENT",
        dataValue: `TESTCARD:${digits}`,
      });
      return;
    }

    if (!config?.configured || !ready || !window.Accept) {
      setPaying(false);
      setStatus(ready ? "Card payments are not configured yet." : "Payment form is still loading.");
      return;
    }

    window.Accept.dispatchData(
      {
        authData: { clientKey: config.clientKey, apiLoginID: config.apiLoginId },
        cardData: { cardNumber: digits, month: expMonth, year: expYear, cardCode: cvv, zip },
      },
      (response) => {
        if (response.messages?.resultCode === "Error" || !response.opaqueData) {
          setPaying(false);
          setStatus(response.messages?.message?.[0]?.text || "Card validation failed.");
          return;
        }
        void submit(response.opaqueData);
      },
    );
  }

  const disabled = busy || paying;
  const field =
    "min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-3 py-2 text-sm text-foreground";

  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/70">Provider review deposit</p>
      <p className="font-serif text-3xl text-foreground">${REVIEW_FEE_USD}</p>
      <p className="text-sm leading-relaxed text-foreground/80">
        A ${REVIEW_FEE_USD} deposit is required for the physician to review this intake. The chart is not sent until
        this payment succeeds.
      </p>
      {config?.testMode ? (
        <p className="text-xs text-foreground/70">Test payment mode — no real charge. Use the filled Visa test card.</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2 text-xs uppercase tracking-[0.16em] text-foreground/60">
          Card number
          <input className={`${field} mt-1`} inputMode="numeric" autoComplete="cc-number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.16em] text-foreground/60">
          Exp month
          <input className={`${field} mt-1`} placeholder="MM" inputMode="numeric" autoComplete="cc-exp-month" value={expMonth} onChange={(e) => setExpMonth(e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.16em] text-foreground/60">
          Exp year
          <input className={`${field} mt-1`} placeholder="YYYY" inputMode="numeric" autoComplete="cc-exp-year" value={expYear} onChange={(e) => setExpYear(e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.16em] text-foreground/60">
          CVV
          <input className={`${field} mt-1`} inputMode="numeric" autoComplete="cc-csc" value={cvv} onChange={(e) => setCvv(e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.16em] text-foreground/60">
          ZIP
          <input className={`${field} mt-1`} autoComplete="postal-code" value={zip} onChange={(e) => setZip(e.target.value)} />
        </label>
      </div>
      {status ? <p className="text-sm text-destructive">{status}</p> : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => void pay()}
        className="inline-flex min-h-11 items-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {disabled ? "Processing…" : `Pay $${REVIEW_FEE_USD} and submit to physician`}
      </button>
    </div>
  );
}
