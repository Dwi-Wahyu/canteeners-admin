"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateDiscountInput,
  CreateDiscountSchema,
} from "../lib/discount-types";
import { createDiscount, updateDiscount } from "../lib/discount-actions";
import SubmitButton from "@/components/submit-button";
import NavButton from "@/components/nav-button";
import { useRouter } from "next/navigation";

import { Discount } from "@prisma/client";

interface DiscountFormProps {
  initialData?: Discount;
}

export function DiscountForm({ initialData }: DiscountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEdit = !!initialData;

  const form = useForm<CreateDiscountInput>({
    resolver: zodResolver(CreateDiscountSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || "",
          code: initialData.code || "",
          type: initialData.type,
          value: initialData.value,
          max_discount: initialData.max_discount,
          min_purchase: initialData.min_purchase,
        }
      : {
          name: "",
          description: "",
          code: "",
          type: "FIXED",
          value: 0,
          max_discount: null,
          min_purchase: 0,
        },
  });

  async function onSubmit(data: CreateDiscountInput) {
    setIsLoading(true);

    const result = isEdit
      ? await updateDiscount(initialData.id, data)
      : await createDiscount(data);

    if (result.success) {
      toast.success(result.message);
      router.push("/authenticated/voucher");
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Voucher" : "Buat Voucher Baru"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Perbarui detail voucher."
              : "Isi detail voucher yang akan dibuat."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="discount-form"
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Nama Voucher</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Contoh: Diskon Akhir Tahun"
                    />
                    {fieldState.error?.message && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="code">
                      Kode Voucher (Opsional)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      id="code"
                      placeholder="Contoh: PROMO123"
                      className="uppercase"
                    />
                    {fieldState.error?.message && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="type">Tipe Potongan</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Pilih Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIXED">
                          Fixed (Nominal Rupiah)
                        </SelectItem>
                        <SelectItem value="PERCENTAGE">
                          Persentase (%)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error?.message && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="value"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="value">Nilai Potongan</FieldLabel>
                    <Input
                      type="number"
                      id="value"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                    {fieldState.error?.message && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="min_purchase"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="min_purchase">
                      Minimal Belanja
                    </FieldLabel>
                    <Input
                      type="number"
                      id="min_purchase"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value || 0}
                    />
                    {fieldState.error?.message && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {form.watch("type") === "PERCENTAGE" && (
                <Controller
                  name="max_discount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="max_discount">
                        Maksimal Potongan
                      </FieldLabel>
                      <Input
                        type="number"
                        id="max_discount"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                      />
                      {fieldState.error?.message && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              )}
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Tuliskan keterangan tentang voucher ini..."
                  />
                  {fieldState.error?.message && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="flex justify-end gap-3 pt-6 border-t">
              <NavButton variant="outline" href="/authenticated/voucher">
                Batal
              </NavButton>
              <SubmitButton
                isLoading={isLoading}
                label={isEdit ? "Perbarui Voucher" : "Simpan Voucher"}
                form="discount-form"
                className="w-full md:w-[200px]"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
