import { PaymentMethod } from "@/generated/prisma";
import { Coins, CreditCard, QrCode } from "lucide-react";

export const paymentMethodMapping = {
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer Bank",
  CASH: "Tunai",
};

export const paymentMethodIconMapping = {
  CASH: <Coins />,
  QRIS: <QrCode />,
  BANK_TRANSFER: <CreditCard />,
};

export function getPaymentMethodIcon({
  paymentMethod,
  className,
}: {
  paymentMethod: PaymentMethod;
  className?: string;
}) {
  if (paymentMethod === "CASH") return <Coins className={className} />;

  if (paymentMethod === "QRIS") return <QrCode className={className} />;

  if (paymentMethod === "BANK_TRANSFER")
    return <CreditCard className={className} />;

  return <Coins className={className} />;
}
