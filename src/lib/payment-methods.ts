import type { PaymentMethodType } from "@/lib/auth";
import unitelMoneyLogo from "@/assets/payment/unitel-money.png";
import multicaixaLogo from "@/assets/payment/multicaixa.png";
import paypayLogo from "@/assets/payment/paypay.jpg";

export const paymentMethodInfo: Record<
  PaymentMethodType,
  { label: string; logo: string; fields: "iban" | "phone" }
> = {
  paypay: { label: "PayPay África", logo: paypayLogo, fields: "iban" },
  unitel_money: { label: "Unitel Money", logo: unitelMoneyLogo, fields: "phone" },
  bank_transfer: { label: "Transferência bancária", logo: multicaixaLogo, fields: "iban" },
};

export const paymentMethodOrder: PaymentMethodType[] = ["paypay", "unitel_money", "bank_transfer"];

/** Mostra só os últimos 4 caracteres de um IBAN/telefone, o resto mascarado */
export function maskAccount(value: string) {
  const clean = value.replace(/\s+/g, "");
  if (clean.length <= 4) return clean;
  return `•••• ${clean.slice(-4)}`;
}
