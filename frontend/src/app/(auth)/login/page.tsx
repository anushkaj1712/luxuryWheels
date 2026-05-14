"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Form = z.infer<typeof schema>;

/**
 * Login — exchanges credentials for JWT; stores session in Zustand persist.
 */
export default function LoginPage() {
  const setSession = useAuthStore((s) => s.setSession);
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { data } = await api.post("/auth/login", values);
      setSession(data.data.token, data.data.user);
      toast.success("Welcome back");
      window.location.href = "/dashboard";
    } catch {
      toast.error("Invalid credentials");
    }
  });

  return (
    <Card className="border-white/10 bg-black/60 backdrop-blur-2xl">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Sign in</CardTitle>
        <CardDescription>Access your garage, bookings, and invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/45" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" className="mt-1" {...register("email")} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/45" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" className="mt-1" {...register("password")} />
          </div>
          <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
            Continue
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-white/45">
          New collector?{" "}
          <Link className="text-white underline-offset-4 hover:underline" href="/signup">
            Create account
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-white/35">
          Google OAuth: wire `/api/auth/google` callback in production.
        </p>
      </CardContent>
    </Card>
  );
}
