"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateGlobalSetting } from "./actions";
import { Loader2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";

interface GlobalSetting {
  key: string;
  value: string;
}

export default function GlobalSettingsClient({
  initialSettings,
}: {
  initialSettings: GlobalSetting[];
}) {
  const [loading, setLoading] = useState(false);

  // Find specific setting or default
  const paymentTimeout =
    initialSettings.find((s) => s.key === "payment_timeout_minutes")?.value ||
    "15";
  const [timeout, setTimeoutValue] = useState(paymentTimeout);

  const shopConfirmationTimeout =
    initialSettings.find((s) => s.key === "shop_confirmation_timeout_minutes")
      ?.value || "30";
  const [confTimeout, setConfTimeoutValue] = useState(shopConfirmationTimeout);

  const shopOrderAcceptanceTimeout =
    initialSettings.find((s) => s.key === "shop_order_acceptance_timeout_minutes")
      ?.value || "10";
  const [orderAcceptanceTimeout, setOrderAcceptanceTimeoutValue] = useState(shopOrderAcceptanceTimeout);

  const handleSaveTimeout = async () => {
    if (!timeout || isNaN(Number(timeout)) || Number(timeout) <= 0) {
      toast.error("Masa tenggang harus berupa angka positif");
      return;
    }

    setLoading(true);
    const result = await updateGlobalSetting(
      "payment_timeout_minutes",
      timeout,
    );
    setLoading(false);

    if (result.success) {
      toast.success("Pengaturan berhasil disimpan");
    } else {
      toast.error(result.message || "Gagal menyimpan pengaturan");
    }
  };

  const handleSaveConfTimeout = async () => {
    if (!confTimeout || isNaN(Number(confTimeout)) || Number(confTimeout) <= 0) {
      toast.error("Waktu konfirmasi harus berupa angka positif");
      return;
    }

    setLoading(true);
    const result = await updateGlobalSetting(
      "shop_confirmation_timeout_minutes",
      confTimeout,
    );
    setLoading(false);

    if (result.success) {
      toast.success("Pengaturan berhasil disimpan");
    } else {
      toast.error(result.message || "Gagal menyimpan pengaturan");
    }
  };

  const handleSaveOrderAcceptanceTimeout = async () => {
    if (!orderAcceptanceTimeout || isNaN(Number(orderAcceptanceTimeout)) || Number(orderAcceptanceTimeout) <= 0) {
      toast.error("Waktu penerimaan pesanan harus berupa angka positif");
      return;
    }

    setLoading(true);
    const result = await updateGlobalSetting(
      "shop_order_acceptance_timeout_minutes",
      orderAcceptanceTimeout,
    );
    setLoading(false);

    if (result.success) {
      toast.success("Pengaturan berhasil disimpan");
    } else {
      toast.error(result.message || "Gagal menyimpan pengaturan");
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Batas Waktu Pembayaran</CardTitle>
          <CardDescription>
            Tentukan durasi maksimum (dalam menit) bagi pelanggan untuk
            menyelesaikan pembayaran sebelum pesanan dibatalkan otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 max-w-sm">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="payment_timeout">Durasi (Menit)</Label>
              <Input
                id="payment_timeout"
                type="number"
                value={timeout}
                onChange={(e) => setTimeoutValue(e.target.value)}
                placeholder="Contoh: 15"
              />
            </div>
            <Button onClick={handleSaveTimeout} disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Batas Waktu Konfirmasi Kedai</CardTitle>
          <CardDescription>
            Tentukan durasi maksimum (dalam menit) bagi pemilik kedai untuk
            mengonfirmasi bukti pembayaran sebelum pesanan dibatalkan otomatis
            dan refund dibuat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 max-w-sm">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="shop_confirmation_timeout">Durasi (Menit)</Label>
              <Input
                id="shop_confirmation_timeout"
                type="number"
                value={confTimeout}
                onChange={(e) => setConfTimeoutValue(e.target.value)}
                placeholder="Contoh: 30"
              />
            </div>
            <Button onClick={handleSaveConfTimeout} disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Batas Waktu Penerimaan Pesanan</CardTitle>
          <CardDescription>
            Tentukan durasi maksimum (dalam menit) bagi pemilik kedai untuk
            menerima/mengonfirmasi pesanan baru sebelum pesanan dibatalkan otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 max-w-sm">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="shop_order_acceptance_timeout">Durasi (Menit)</Label>
              <Input
                id="shop_order_acceptance_timeout"
                type="number"
                value={orderAcceptanceTimeout}
                onChange={(e) => setOrderAcceptanceTimeoutValue(e.target.value)}
                placeholder="Contoh: 10"
              />
            </div>
            <Button onClick={handleSaveOrderAcceptanceTimeout} disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
