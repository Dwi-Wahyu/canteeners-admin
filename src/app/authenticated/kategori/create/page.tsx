"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

import { toast } from "sonner";
import {
  CreateCategoryInput,
  CreateCategorySchema,
} from "@/features/categories/lib/category-types";
import { createCategory } from "@/features/categories/lib/category-actions";
import Link from "next/link";
import SubmitButton from "@/components/submit-button";

export default function CreateCategoryPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  async function onSubmit(data: CreateCategoryInput) {
    if (!inputFileRef.current?.files) {
      form.setError("image_url", { message: "Tolong pilih gambar" });

      return;
    }

    setIsLoading(true);

    const file = inputFileRef.current.files[0];

    const filename = `categories/${file.name}`;

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
        setIsLoading(false);
        return;
      }

      const uploadedBlob = await uploadResponse.json();

      console.log(uploadedBlob);

      const url = uploadedBlob.pathname;

      const formDataWithImage = { ...data, image_url: url };

      console.log("File berhasil diunggah:", url);
      console.log("Data form lengkap:", formDataWithImage);

      const result = await createCategory(formDataWithImage);

      if (result.success) {
        form.reset();
        toast.success("Berhasil input kategori");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal mengunggah file:", error);
      setIsLoading(false);
      form.setError("image_url", {
        message: "Gagal mengunggah gambar. Silakan coba lagi.",
      });
    }
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
        <Button asChild type="button" variant={"outline"}>
          <Link href={"/authenticated/kategori"}>Batal</Link>
        </Button>

        <SubmitButton
          isLoading={isLoading}
          label="Simpan"
          form="create-shop-form"
        />
      </div>
    </form>
  );
}
