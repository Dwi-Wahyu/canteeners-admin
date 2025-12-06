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
} from "@/features/users/lib/user-type";
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
import { Role } from "@/app/generated/prisma";

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "CUSTOMER",
      avatar:
        "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/avatars/default-avatar.jpg",
    },
  });

  async function onSubmit(data: CreateUserInput) {
    setIsLoading(true);

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

                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent id="role">
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
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
            <>Login</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
