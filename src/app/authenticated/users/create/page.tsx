"use client";

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
import { Input } from "@/components/ui/input";
import {
  CreateUserInput,
  CreateUserSchema,
} from "@/features/users/lib/user-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/generated/prisma";
import { createUser } from "@/features/users/lib/user-action";
import { toast } from "sonner";
import { userRoleMapping } from "@/features/users/constants";

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "SHOP_OWNER",
      avatar: "avatars/default-avatar.jpg",
    },
  });

  async function onSubmit(data: CreateUserInput) {
    setIsLoading(true);

    const result = await createUser(data);

    if (result.success) {
      toast.success("Berhasil tambahkan user");
      form.reset();
    } else {
      toast.error("Gagal tambahkan user", {
        description: "Terjadi kesalahan",
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="mx-auto w-full md:max-w-md">
      <CardHeader>
        <CardTitle>Tambahkan User</CardTitle>
        <CardDescription>Masukkan detail</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          className="flex flex-col gap-4"
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
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...field}
                  id="username"
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  id="password"
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
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="role">Role</FieldLabel>

                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent id="role">
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {userRoleMapping[role]}
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
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          form="login-form"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin" /> Loading
            </>
          ) : (
            <>Simpan</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
