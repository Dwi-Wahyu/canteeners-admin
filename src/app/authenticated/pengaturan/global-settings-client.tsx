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
    </div>
  );
}
