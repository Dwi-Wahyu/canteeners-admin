"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GenerateBillingSchema,
  type GenerateBillingInput,
} from "../lib/billing-schema";
import { generateShopBilling } from "../lib/billing-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/submit-button";
import { useState } from "react";

export function GenerateBillingDialog({ shopId }: { shopId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<GenerateBillingInput>({
    resolver: zodResolver(GenerateBillingSchema),
    defaultValues: {
      shop_id: shopId,
    },
  });

  async function onSubmit(data: GenerateBillingInput) {
    const result = await generateShopBilling(data);
    if (result.success) {
      setIsOpen(false);

      toast.success("Tagihan berhasil dihitung dengan komisi Rp 1.000/item");
      form.reset({ shop_id: shopId });
    } else {
      toast.error(result.error);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>Generate Tagihan</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate Tagihan</AlertDialogTitle>
          <AlertDialogDescription>
            Komisi otomatis dihitung Rp 1.000 per item terjual.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="generate-billing-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-4">
            <Field>
              <FieldLabel>Dari Tanggal</FieldLabel>
              <Input
                type="date"
                {...form.register("start_date", { valueAsDate: true })}
              />
              {form.formState.errors.start_date && (
                <FieldError>
                  {form.formState.errors.start_date.message}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Sampai Tanggal</FieldLabel>
              <Input
                type="date"
                {...form.register("end_date", { valueAsDate: true })}
              />
              {form.formState.errors.end_date && (
                <FieldError>
                  {form.formState.errors.end_date.message}
                </FieldError>
              )}
            </Field>
          </div>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <SubmitButton
              form="generate-billing-form"
              isLoading={form.formState.isSubmitting}
              label="Hitung Tagihan"
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
