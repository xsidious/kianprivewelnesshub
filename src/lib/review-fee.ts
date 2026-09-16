import { createServerFn } from "@tanstack/react-start";

export const REVIEW_FEE_USD = 75;

export const getReviewFeeConfig = createServerFn({ method: "GET" }).handler(async () => {
  const base = (process.env.KIAN_PRIVE_API_URL || "https://www.kianprive.com").replace(/\/$/, "");
  const response = await fetch(`${base}/api/commerce/authorize-net/config`);
  if (!response.ok) {
    throw new Error("Could not load the payment form.");
  }
  return (await response.json()) as {
    configured: boolean;
    apiLoginId: string;
    clientKey: string;
    env: string;
    testMode: boolean;
    testCard: {
      number: string;
      expMonth: string;
      expYear: string;
      cvv: string;
      zip: string;
      hint: string;
    } | null;
  };
});
