"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  CreateShopInput,
  CreateShopSchema,
} from "@/features/shop/lib/shop-types";
import { GetShopOwners } from "@/features/users/lib/user-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

import { put } from "@vercel/blob";
import { createShop } from "@/features/shop/lib/shop-actions";
import { toast } from "sonner";

export default function CreateShopForm({ owners }: { owners: GetShopOwners }) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateShopInput>({
    resolver: zodResolver(CreateShopSchema),
    defaultValues: {
      name: "",
      owner_id: "",
      canteen_id: 4, // kantin kudapan
      image_url: "",
    },
  });

  async function onSubmit(data: CreateShopInput) {
    if (!inputFileRef.current?.files) {
      form.setError("image_url", { message: "Tolong pilih gambar" });

      return;
    }

    setIsLoading(true);

    const file = inputFileRef.current.files[0];

    const filename = `shops/${file.name}`;

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("filename", filename);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        form.setError("image_url", {
          message: "Gagal mengunggah file melalui API.",
        });
        return;
      }

      const uploadedBlob = await uploadResponse.json();
      const url = uploadedBlob.url;

      const formDataWithImage = { ...data, image_url: url };

      console.log("File berhasil diunggah:", url);
      console.log("Data form lengkap:", formDataWithImage);

      const result = await createShop(formDataWithImage);

      if (result.success) {
        form.reset();
        toast.success("Berhasil input kedai");
      }
    } catch (error) {
      console.error("Gagal mengunggah file:", error);
      form.setError("image_url", {
        message: "Gagal mengunggah gambar. Silakan coba lagi.",
      });
    }

    setIsLoading(false);
  }

  return (
    <form
      id="create-shop-form"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Nama</FieldLabel>
            <Input
              {...field}
              id="name"
              aria-invalid={fieldState.invalid}
              autoComplete="off"
            />

            {fieldState.error?.message && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="owner_id"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="role">Pemilik</FieldLabel>

            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pemilik" />
              </SelectTrigger>
              <SelectContent id="role">
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.error?.message && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="image_url"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="image">Gambar</FieldLabel>

            <Input
              id="image"
              ref={inputFileRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              required
            />

            {fieldState.error?.message && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />

      <div className="inline-flex items-end gap-4">
        <Button type="button" variant={"outline"}>
          Batal
        </Button>

        <Button type="submit" disabled={isLoading} form="create-shop-form">
          Simpan
        </Button>
      </div>
    </form>
  );
}
