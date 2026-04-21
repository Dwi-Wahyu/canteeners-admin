"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBanner, updateBanner } from "../lib/banner-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BannerSchema, type BannerInput } from "../types/banner-schema";
import { FileUploadImage } from "@/components/file-upload-image";
import * as React from "react";
import { LocalStorageService } from "@/services/storage";
import { getImageUrl } from "@/helper/get-image-url";

interface BannerFormProps {
  initialData?: { id: number } & BannerInput;
  mode: "create" | "edit";
}

export default function BannerForm({ initialData, mode }: BannerFormProps) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const storageService = new LocalStorageService();

  const form = useForm<BannerInput>({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      order: initialData?.order ?? 0,
      file: initialData?.file ?? "",
      cta_path: initialData?.cta_path ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: BannerInput) {
    try {
      let filename = data.file;

      if (selectedFiles.length > 0) {
        filename = await storageService.uploadImage(selectedFiles[0], "banners");
      }

      if (!filename) {
        toast.error("File banner harus diunggah");
        return;
      }

      // Convert empty string to null for CTA path
      const payload: BannerInput = {
        ...data,
        file: filename,
        cta_path: data.cta_path || null,
      };

      let res;
      if (mode === "edit" && initialData) {
        res = await updateBanner(initialData.id, payload);
      } else {
        res = await createBanner(payload);
      }

      if (res.success) {
        toast.success(
          mode === "create" ? "Banner berhasil dibuat" : "Banner berhasil diperbarui"
        );
        router.push("/authenticated/banner");
        router.refresh();
      } else {
        toast.error(res.error || "Terjadi kesalahan");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah gambar");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-auto container"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gambar Banner</FormLabel>
              <FormControl>
                <FileUploadImage
                  multiple={false}
                  onFilesChange={(files) => {
                    setSelectedFiles(files);
                    if (files.length > 0) {
                      form.setValue("file", files[0].name);
                    }
                  }}
                  initialPreviewUrl={initialData?.file ? getImageUrl("/banners/" + initialData.file) : null}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urutan</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Misal: 1"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cta_path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CTA Path (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Misal: /authenticated/kantin"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
