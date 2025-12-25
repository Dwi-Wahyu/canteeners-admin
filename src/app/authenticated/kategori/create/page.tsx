"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import {
  CreateCategoryInput,
  CreateCategorySchema,
} from "@/features/categories/lib/category-types";
import { createCategory } from "@/features/categories/lib/category-actions";
import Link from "next/link";
import SubmitButton from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, Plus, X, UploadCloud } from "lucide-react";
import Image from "next/image";
import NavButton from "@/components/nav-button";

export default function CreateCategoryPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  // Handle preview gambar
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  async function onSubmit(data: CreateCategoryInput) {
    if (!inputFileRef.current?.files?.length) {
      form.setError("image_url", { message: "Tolong pilih gambar" });
      return;
    }

    setIsLoading(true);
    const file = inputFileRef.current.files[0];
    const filename = `categories/${Date.now()}-${file.name}`; // Tambah timestamp agar unik

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", filename);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Gagal upload");

      const uploadedBlob = await uploadResponse.json();
      const url = uploadedBlob.pathname;

      const result = await createCategory({ ...data, image_url: url });

      if (result.success) {
        form.reset();
        setPreviewUrl(null);
        toast.success("Berhasil menambahkan kategori baru!");
      }
    } catch (error) {
      toast.error("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Tambah Kategori</h1>
        <p className="text-muted-foreground mt-1">
          Buat kategori baru untuk mengelompokkan produk.
        </p>
      </div>

      <Card className="shadow-lg border-muted/60">
        <CardContent>
          <form
            id="create-category-form"
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kolom Kiri: Input Nama */}
              <div className="space-y-4">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name" className="font-semibold">
                        Nama
                      </FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Contoh: Makanan Berat, Minuman Dingin..."
                        className="h-11"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.error?.message && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Kolom Kanan: Upload Gambar */}
              <div className="space-y-4">
                <Field>
                  <FieldLabel className="font-semibold">Gambar</FieldLabel>

                  {!previewUrl ? (
                    <div
                      onClick={() => inputFileRef.current?.click()}
                      className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer bg-muted/30 h-[200px]"
                    >
                      <UploadCloud className="w-10 h-10 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Klik untuk unggah gambar
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        PNG, JPG atau WEBP (Maks. 2MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border h-[200px] group">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Ganti Gambar
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={inputFileRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {form.formState.errors.image_url && (
                    <p className="text-xs font-medium text-destructive mt-2">
                      {form.formState.errors.image_url.message}
                    </p>
                  )}
                </Field>
              </div>
            </div>

            {/* Footer Form / Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <NavButton variant="outline" href="/authenticated/kategori">
                Batal
              </NavButton>
              <SubmitButton
                isLoading={isLoading}
                label="Simpan"
                form="create-category-form"
                className="w-full md:w-[200px]"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
