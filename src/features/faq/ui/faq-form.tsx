"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Asumsi project pakai sonner dari file list
import { createFaq, updateFaq } from "../lib/faq-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaqInput, FaqSchema } from "../types/faq-schema";

interface FaqFormProps {
  initialData?: { id: number } & FaqInput;
  mode: "create" | "edit";
}

export default function FaqForm({ initialData, mode }: FaqFormProps) {
  const router = useRouter();

  const form = useForm<FaqInput>({
    resolver: zodResolver(FaqSchema),
    defaultValues: {
      question: initialData?.question || "",
      answer: initialData?.answer || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FaqInput) {
    let res;
    if (mode === "edit" && initialData) {
      res = await updateFaq(initialData.id, values);
    } else {
      res = await createFaq(values);
    }

    if (res.success) {
      toast.success(
        mode === "create" ? "FAQ berhasil dibuat" : "FAQ berhasil diperbarui"
      );
      router.push("/authenticated/faq");
      router.refresh();
    } else {
      toast.error(res.error || "Terjadi kesalahan");
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
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pertanyaan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Misal: Jam berapa kantin buka?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jawaban</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Misal: Kantin buka jam 08:00 - 17:00"
                  className="min-h-[100px]"
                  {...field}
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
