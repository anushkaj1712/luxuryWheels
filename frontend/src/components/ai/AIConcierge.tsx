"use client";

import * as React from "react";
import { MessageCircle, Mic, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * AI Concierge — lightweight scripted assistant (swap `responses` for OpenAI API later).
 * Demonstrates "AI chatbot assistant" UX without requiring API keys in the template.
 */
const responses: Record<string, string> = {
  hello: "Welcome to Drive Luxury Wheels. Shall I curate a shortlist by occasion — track, chauffeur, or daily?",
  finance: "We orchestrate bespoke finance with partner institutions — indicative EMI tools are on each listing.",
  test: "Test drives are by appointment with a dedicated product specialist and optional track access.",
  default:
    "I can guide collection picks, financing pathways, or concierge logistics. Try: hello, finance, or test.",
};

export function AIConcierge() {
  const [open, setOpen] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: responses.hello },
  ]);

  const send = (text: string) => {
    const key = text.trim().toLowerCase();
    const reply = responses[key] ?? responses.default;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: reply }]);
  };

  const onVoice = () => {
    // Web Speech API is vendor-prefixed; `any` keeps the demo portable across browsers.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = typeof window !== "undefined" ? (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition : null;
    if (!SR) {
      setMessages((m) => [...m, { role: "assistant", text: "Voice search is not supported in this browser." }]);
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    setListening(true);
    rec.onresult = (e: Event) => {
      const ev = e as unknown as { results: { 0: { 0: { transcript: string } } } };
      const text = ev.results[0][0].transcript;
      send(text);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.start();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-3">
        <a
          href="https://wa.me/919000000000"
          className="flex h-12 items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 text-sm text-emerald-100 backdrop-blur-xl"
          aria-label="WhatsApp concierge"
        >
          <MessageCircle className="h-4 w-4" />
          Live desk
        </a>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full border border-white/15 bg-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
          onClick={() => setOpen(true)}
          aria-label="Open AI concierge"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-end bg-black/60 p-4 backdrop-blur-sm md:items-center md:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="AI concierge"
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              className="flex h-[min(560px,85vh)] w-full max-w-md flex-col rounded-3xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Concierge AI</p>
                <button type="button" className="rounded-full p-2 text-white/60 hover:text-white" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/5 bg-black/40 p-3">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <span
                      className={
                        m.role === "user"
                          ? "inline-block rounded-2xl bg-white/10 px-3 py-2 text-sm text-white"
                          : "inline-block rounded-2xl bg-white/[0.04] px-3 py-2 text-sm text-white/80"
                      }
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const text = String(fd.get("q") ?? "");
                  if (!text.trim()) return;
                  send(text);
                  e.currentTarget.reset();
                }}
              >
                <input name="q" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Ask anything…" />
                <Button type="button" variant="ghost" size="icon" onClick={onVoice} aria-label="Voice search" className={listening ? "animate-pulse" : ""}>
                  <Mic className="h-4 w-4" />
                </Button>
                <Button type="submit">Send</Button>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
