"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader, Quote } from "lucide-react";
import { LoginSchema, LoginInput } from "@/features/auth/lib/auth-type";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const testimonials = [
  {
    text: "Pesan makanan jadi jauh lebih cepat, nggak perlu antre panjang lagi di kantin!",
    author: "Budi Santoso",
    role: "Mahasiswa Teknik",
  },
  {
    text: "Manajemen stok kantin jadi lebih rapi dan transparan sejak pakai Canteeners.",
    author: "Ibu Kantin",
    role: "Pemilik Gerai",
  },
  {
    text: "Interface-nya keren banget! Bikin pengalaman makan di kampus jadi naik level.",
    author: "Siti Aminah",
    role: "Staf Administrasi",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Logic untuk ganti testimoni tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      form.setError("username", { message: "Username atau Password salah" });
      form.setError("password", { message: "Username atau Password salah" });
    } else {
      router.push("/authenticated/dashboard");
    }
  }

  return (
    <div className="grid min-h-svh w-full grid-cols-1 lg:grid-cols-2">
      {/* KIRI: FORM LOGIN */}
      <div className="flex flex-col md:justify-center px-8 py-12 md:px-16 lg:px-24">
        <div className="mb-4 md:mb-8 flex items-center gap-3">
          <Image
            src="/app-logo.svg"
            alt="Canteeners Logo"
            width={40}
            height={40}
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Canteeners</h1>
            <h1 className="font-medium">Kantin Naik Level</h1>
          </div>
        </div>

        <div className="mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Selamat Datang!</h1>
            <p className="text-muted-foreground mt-2">
              Masukan credentials Admin
            </p>
            <p className="text-primary font-medium text-sm"></p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Username</FieldLabel>
                  <Input {...field} placeholder="Username" />
                  {fieldState.error && (
                    <FieldError className="text-red-400">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input {...field} type="password" placeholder="••••••••" />
                  {fieldState.invalid && (
                    <FieldError
                      className="text-red-400"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader className="animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {/* KANAN: VISUAL & TESTIMONI (Hidden on Mobile) */}
      <div className="hidden lg:flex relative bg-linear-to-tr from-primary to-primary/70 items-center justify-center p-16 overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg transition-all duration-700 ease-in-out">
          <Quote className="w-16 h-16 mb-6 opacity-30 text-white" />
          <h2 className="text-3xl font-medium leading-relaxed mb-8 italic">
            "{testimonials[currentTestimonial].text}"
          </h2>
          <div>
            <p className="font-bold text-xl">
              {testimonials[currentTestimonial].author}
            </p>
            <p className="text-white/70">
              {testimonials[currentTestimonial].role}
            </p>
          </div>

          {/* Dot Indicators */}
          <div className="flex gap-2 mt-8">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentTestimonial ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
