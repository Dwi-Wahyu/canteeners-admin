"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSchema, EventSchemaType } from "../lib/event-schema";
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
import { Switch } from "@/components/ui/switch";
import { createEvent, updateEvent } from "../lib/event-actions";
import { toast } from "sonner";
import { useState } from "react";

interface EventFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          is_active: initialData.is_active,
        }
      : {
          name: "",
          is_active: true,
        },
  });

  const onSubmit = async (values: EventSchemaType) => {
    setIsLoading(true);
    try {
      const res = initialData
        ? await updateEvent(initialData.id, values)
        : await createEvent(values);

      if (res.success) {
        toast.success(initialData ? "Event diperbarui" : "Event dibuat");
        onSuccess?.();
      } else {
        toast.error("Gagal menyimpan event");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Event</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Ramadhan Sale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktif</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
