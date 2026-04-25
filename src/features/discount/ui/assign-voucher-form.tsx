"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader, Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { assignVoucherToCustomers } from "../lib/discount-actions";
import { Badge } from "@/components/ui/badge";

const AssignVoucherSchema = z.object({
  discountId: z.string().min(1, "Voucher harus dipilih"),
  customerIds: z.array(z.string()).min(1, "Minimal satu pelanggan harus dipilih"),
});

type AssignVoucherInput = z.infer<typeof AssignVoucherSchema>;

interface AssignVoucherFormProps {
  discounts: {
    id: string;
    name: string;
    code: string | null;
  }[];
  customers: {
    id: string;
    email: string | null;
    user: {
      name: string;
      username: string | null;
    };
  }[];
}

export function AssignVoucherForm({ discounts, customers }: AssignVoucherFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<AssignVoucherInput>({
    resolver: zodResolver(AssignVoucherSchema),
    defaultValues: {
      discountId: "",
      customerIds: [],
    },
  });

  async function onSubmit(data: AssignVoucherInput) {
    setIsLoading(true);
    const result = await assignVoucherToCustomers(data.discountId, data.customerIds);

    if (result.success) {
      toast.success(result.message);
      form.reset();
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Berikan Voucher ke Pelanggan</CardTitle>
        <CardDescription>
          Pilih voucher dan pelanggan yang akan menerima voucher tersebut.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="assign-voucher-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="discountId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="discountId">Pilih Voucher</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="discountId">
                    <SelectValue placeholder="Pilih Voucher" />
                  </SelectTrigger>
                  <SelectContent>
                    {discounts.map((discount) => (
                      <SelectItem key={discount.id} value={discount.id}>
                        {discount.name} ({discount.code || "No Code"})
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
            name="customerIds"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Pilih Pelanggan</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between h-auto min-h-10 text-left font-normal"
                    >
                      {field.value.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {field.value.map((id) => {
                            const customer = customers.find((c) => c.id === id);
                            return (
                              <Badge key={id} variant="secondary">
                                {customer?.user.name}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        "Pilih pelanggan..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Cari pelanggan..." />
                      <CommandList>
                        <CommandEmpty>Pelanggan tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.user.name}
                              onSelect={() => {
                                const newValue = field.value.includes(customer.id)
                                  ? field.value.filter((id: string) => id !== customer.id)
                                  : [...field.value, customer.id];
                                field.onChange(newValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes(customer.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {customer.user.name} ({customer.user.username || customer.email})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.error?.message && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          form="assign-voucher-form"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Berikan Voucher"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
