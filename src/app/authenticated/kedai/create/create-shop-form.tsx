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

import { createShop } from "@/features/shop/lib/shop-actions";
import { toast } from "sonner";
import { getCanteens } from "@/features/canteen/lib/canteen-queries";

export default function CreateShopForm({
  owners,
  canteens,
}: {
  owners: GetShopOwners;
  canteens: Awaited<ReturnType<typeof getCanteens>>;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateShopInput>({
    resolver: zodResolver(CreateShopSchema),
    defaultValues: {
      name: "",
      owner_id: "",
      canteen_id: undefined,
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

    try {
      const formData = new FormData();
      formData.append("path", "shop");
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        form.setError("image_url", {
          message: "Gagal mengunggah file melalui API.",
        });
        setIsLoading(false);
        return;
      }

      const uploadResult = await uploadResponse.json();
      const filename = uploadResult.data?.filename;

      if (!filename) {
        form.setError("image_url", {
          message: "API tidak mengembalikan nama file.",
        });
        setIsLoading(false);
        return;
      }

      const formDataWithImage = { ...data, image_url: filename };

      console.log("File berhasil diunggah:", filename);
      console.log("Data form lengkap:", formDataWithImage);

      const result = await createShop(formDataWithImage);

      if (result.success) {
        form.reset();
        toast.success("Berhasil input kedai");
      } else {
        toast.error(result.message || "Gagal input kedai");
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

            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Pemilik" />
              </SelectTrigger>
              <SelectContent id="role">
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.user.name}
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
        name="canteen_id"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="canteen">Kantin</FieldLabel>

            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kantin" />
              </SelectTrigger>
              <SelectContent id="canteen">
                {canteens.map((canteen) => (
                  <SelectItem key={canteen.id} value={canteen.id.toString()}>
                    {canteen.name}
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
