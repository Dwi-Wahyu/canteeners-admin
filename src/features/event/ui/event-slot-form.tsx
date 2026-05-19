"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSlotSchema, EventSlotSchemaType } from "../lib/event-schema";
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
import { createEventSlot, updateEventSlot } from "../lib/event-actions";
import { toast } from "sonner";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EventSlotFormProps {
  eventId: number;
  initialData?: any;
  onSuccess?: () => void;
}

export function EventSlotForm({ eventId, initialData, onSuccess }: EventSlotFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventSlotSchemaType>({
    resolver: zodResolver(EventSlotSchema),
    defaultValues: initialData
      ? {
          date: new Date(initialData.date),
          start_time: format(new Date(initialData.start_time), "HH:mm"),
          end_time: format(new Date(initialData.end_time), "HH:mm"),
          quota: initialData.quota,
          event_id: eventId,
        }
      : {
          date: new Date(),
          start_time: "08:00",
          end_time: "10:00",
          quota: 50,
          event_id: eventId,
        },
  });

  const onSubmit = async (values: EventSlotSchemaType) => {
    setIsLoading(true);
    try {
      const res = initialData
        ? await updateEventSlot(initialData.id, values)
        : await createEventSlot(values);

      if (res.success) {
        toast.success(initialData ? "Slot diperbarui" : "Slot dibuat");
        onSuccess?.();
      } else {
        toast.error("Gagal menyimpan slot");
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Mulai</FormLabel>
                <FormControl>
                  <Input placeholder="08:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Selesai</FormLabel>
                <FormControl>
                  <Input placeholder="10:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="quota"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kuota (User)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
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
