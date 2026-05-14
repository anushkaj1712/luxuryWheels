"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(8),
});

type Form = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post("/contact", values);
      toast.success("Message received");
      reset();
    } catch {
      toast.error("Could not send");
    }
  });

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
      <div>
        <h1 className="font-display text-4xl text-white">Concierge</h1>
        <p className="mt-4 text-sm text-white/55">Flagship atelier · appointments only.</p>
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
          <iframe title="Office map" className="h-full w-full" src="https://www.google.com/maps?q=New+Delhi&z=11&output=embed" loading="lazy" />
        </div>
        <a className="mt-6 inline-flex text-sm text-emerald-300 hover:underline" href="https://wa.me/919000000000">
          WhatsApp →
        </a>
      </div>
      <Card className="border-white/10 bg-white/[0.02]">
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input placeholder="Name" {...register("name")} />
            <Input placeholder="Email" type="email" {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
            <textarea
              className="min-h-[140px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35"
              placeholder="How may we assist?"
              {...register("message")}
            />
            <Button type="submit" disabled={formState.isSubmitting}>
              Send inquiry
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
