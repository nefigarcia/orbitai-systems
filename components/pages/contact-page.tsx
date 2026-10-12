"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Phone,
  Sparkles,
  Mail,
  Building2,
  Target,
  ExternalLink,
  Loader2,
  PhoneOff,
  MailCheck,
} from "lucide-react";
import { wizardContactSchema, type WizardContactValues } from "@/lib/validations";
import { INDUSTRIES, COMPANY_SIZES, CHALLENGES, AURIVA_URL } from "@/lib/constants";

type StepKey = "contact" | "business" | "challenges" | "processing" | "success";

const STEPS: { key: StepKey; label: string; icon: typeof Mail }[] = [
  { key: "contact", label: "You", icon: Mail },
  { key: "business", label: "Business", icon: Building2 },
  { key: "challenges", label: "Challenges", icon: Target },
];

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-teal/60 focus:bg-white/8 transition-all";

const SELECT_CLASS =
  "w-full px-4 py-3 rounded-lg border border-white/10 bg-[oklch(0.13_0.01_240)] text-white text-sm focus:outline-none focus:border-teal/60 transition-all appearance-none";

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-teal ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

type CallPhase = "scheduled" | "ringing" | "in-progress" | "ended" | "unknown";

export function ContactPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<StepKey>("contact");
  const [serverError, setServerError] = useState<string | null>(null);
  const [callScheduled, setCallScheduled] = useState(false);
  const [vapiCallId, setVapiCallId] = useState<string | null>(null);
  const [callPhase, setCallPhase] = useState<CallPhase>("unknown");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!vapiCallId || !callScheduled) return;
    if (callPhase === "ended") return;

    let cancelled = false;
    const started = Date.now();
    const MAX_POLL_MS = 20 * 60 * 1000;

    async function pollOnce() {
      try {
        const res = await fetch(`/api/contact/call-status?callId=${vapiCallId}`);
        if (!res.ok) return;
        const body = (await res.json()) as { status?: string };
        if (cancelled) return;
        const s = (body.status || "").toLowerCase();
        if (s === "queued" || s === "ringing") setCallPhase("ringing");
        else if (s === "in-progress" || s === "forwarding") setCallPhase("in-progress");
        else if (s === "ended") setCallPhase("ended");
      } catch {}
      if (Date.now() - started > MAX_POLL_MS && pollRef.current) {
        clearInterval(pollRef.current);
      }
    }

    pollOnce();
    pollRef.current = setInterval(pollOnce, 5000);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [vapiCallId, callScheduled, callPhase]);

  useEffect(() => {
    if (callPhase === "ended" && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [callPhase]);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    getValues,
    formState: { errors },
  } = useForm<WizardContactValues>({
    resolver: zodResolver(wizardContactSchema),
    mode: "onTouched",
    defaultValues: { challenges: [], challengeDetail: "" },
  });

  async function goNext() {
    setServerError(null);
    const fields: Record<number, (keyof WizardContactValues)[]> = {
      0: ["name", "email", "phone"],
      1: ["company", "industry", "companySize"],
      2: ["challenges"],
    };
    const ok = await trigger(fields[stepIndex]);
    if (!ok) return;

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      setPhase(STEPS[stepIndex + 1].key);
    } else {
      handleSubmit(onSubmit)();
    }
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex(stepIndex - 1);
    setPhase(STEPS[stepIndex - 1].key);
  }

  async function onSubmit(data: WizardContactValues) {
    setPhase("processing");
    setServerError(null);

    try {
      const res = await fetch("/api/contact/initiate-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        callScheduled?: boolean;
        vapiCallId?: string | null;
        error?: string;
      };

      if (!res.ok || !body.success) {
        setServerError(body.error || "Something went wrong. Please try again.");
        setPhase("challenges");
        return;
      }

      setCallScheduled(Boolean(body.callScheduled));
      setVapiCallId(body.vapiCallId ?? null);
      setCallPhase(body.callScheduled ? "scheduled" : "unknown");
      setPhase("success");
    } catch (err) {
      console.error(err);
      setServerError("Network error. Please try again.");
      setPhase("challenges");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-8 bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-teal/8 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/30 bg-teal/5 text-teal text-xs font-medium mb-6"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
              </span>
              AI Agent Available Now
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
              Let&apos;s Talk About
              <span className="text-gradient-teal"> Your Business</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Just filling out this form, you&apos;re already experiencing our AI
              automation —{" "}
              <span className="text-white font-medium">
                our AI agent will call you within minutes
              </span>{" "}
              for a short, friendly interview, then send a tailored roadmap to
              your inbox.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wizard + Live Demo */}
      <section className="relative pb-24 bg-navy overflow-hidden">
        {/* Ambient drifting orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-24 w-80 h-80 rounded-full bg-teal/6 blur-[120px] animate-float" />
          <div className="absolute bottom-10 -right-24 w-96 h-96 rounded-full bg-[oklch(0.60_0.20_220/4%)] blur-[140px] animate-float" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
          {/* Progress bar */}
          <AnimatePresence>
            {phase !== "processing" && phase !== "success" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-3">
                  {STEPS.map((s, i) => {
                    const active = i === stepIndex;
                    const done = i < stepIndex;
                    const Icon = s.icon;
                    return (
                      <div key={s.key} className="flex items-center flex-1 last:flex-none">
                        <motion.div
                          animate={{
                            scale: active ? 1.05 : 1,
                            backgroundColor: done
                              ? "oklch(0.72 0.18 195 / 20%)"
                              : active
                              ? "oklch(0.72 0.18 195 / 15%)"
                              : "oklch(1 0 0 / 4%)",
                          }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                            active
                              ? "border-teal/50"
                              : done
                              ? "border-teal/30"
                              : "border-white/10"
                          }`}
                        >
                          {done ? (
                            <Check className="w-3 h-3 text-teal" />
                          ) : (
                            <Icon
                              className={`w-3 h-3 ${
                                active ? "text-teal" : "text-muted-foreground"
                              }`}
                            />
                          )}
                          <span
                            className={`text-[11px] font-medium tracking-wide ${
                              active
                                ? "text-teal"
                                : done
                                ? "text-teal/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {s.label}
                          </span>
                        </motion.div>
                        {i < STEPS.length - 1 && (
                          <div className="flex-1 h-px mx-2 bg-white/8 overflow-hidden">
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: i < stepIndex ? 1 : 0 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              style={{ originX: 0 }}
                              className="h-full bg-teal/60"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card */}
          <div className="relative rounded-2xl border border-white/8 bg-graphite overflow-hidden">
            {/* Shimmer top edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal/40 to-transparent" />

            <div className="p-6 sm:p-10 min-h-[480px]">
              <AnimatePresence mode="wait">
                {phase === "contact" && (
                  <motion.div
                    key="contact"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <StepHeader
                      kicker="Step 1 of 3"
                      title="Who should our AI agent speak with?"
                      sub="We only use this to introduce the call and send your roadmap."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Full Name" required error={errors.name?.message}>
                        <input
                          {...register("name")}
                          className={INPUT_CLASS}
                          placeholder="Jane Smith"
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="Email" required error={errors.email?.message}>
                        <input
                          {...register("email")}
                          type="email"
                          className={INPUT_CLASS}
                          placeholder="jane@company.com"
                          autoComplete="email"
                        />
                      </Field>
                    </div>
                    <Field label="Phone (the AI will call this number)" required error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        className={INPUT_CLASS}
                        placeholder="+1 (555) 000-0000"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </Field>
                  </motion.div>
                )}

                {phase === "business" && (
                  <motion.div
                    key="business"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <StepHeader
                      kicker="Step 2 of 3"
                      title="Tell us about your business"
                      sub="So our agent can tailor the questions to your context."
                    />
                    <Field label="Company Name" required error={errors.company?.message}>
                      <input
                        {...register("company")}
                        className={INPUT_CLASS}
                        placeholder="Acme Corp"
                        autoComplete="organization"
                      />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Industry" required error={errors.industry?.message}>
                        <select {...register("industry")} className={SELECT_CLASS} defaultValue="">
                          <option value="" disabled>Select industry</option>
                          {INDUSTRIES.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Company Size" required error={errors.companySize?.message}>
                        <select {...register("companySize")} className={SELECT_CLASS} defaultValue="">
                          <option value="" disabled>Select size</option>
                          {COMPANY_SIZES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </motion.div>
                )}

                {phase === "challenges" && (
                  <motion.div
                    key="challenges"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <StepHeader
                      kicker="Step 3 of 3"
                      title="What's slowing your team down?"
                      sub="Pick everything that applies — our agent will dig into these on the call."
                    />
                    <Controller
                      control={control}
                      name="challenges"
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CHALLENGES.map((c, i) => {
                            const selected = field.value?.includes(c.id);
                            return (
                              <motion.button
                                key={c.id}
                                type="button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.25 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    selected
                                      ? current.filter((x: string) => x !== c.id)
                                      : [...current, c.id]
                                  );
                                }}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                  selected
                                    ? "border-teal/50 bg-teal/10"
                                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                }`}
                              >
                                <span className="text-xl">{c.icon}</span>
                                <span className={`text-sm flex-1 ${selected ? "text-white" : "text-muted-foreground"}`}>
                                  {c.label}
                                </span>
                                <AnimatePresence>
                                  {selected && (
                                    <motion.span
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      className="w-5 h-5 rounded-full bg-teal flex items-center justify-center flex-shrink-0"
                                    >
                                      <Check className="w-3 h-3 text-[oklch(0.08_0.01_240)]" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.challenges && (
                      <p className="text-xs text-red-400">{errors.challenges.message as string}</p>
                    )}
                    <Field label="Anything else our agent should know? (optional)">
                      <textarea
                        {...register("challengeDetail")}
                        rows={3}
                        placeholder="e.g. We spend 10+ hours a week on manual quoting."
                        className={`${INPUT_CLASS} resize-none`}
                      />
                    </Field>
                  </motion.div>
                )}

                {phase === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-[400px] flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative w-24 h-24 mb-6">
                      {[0, 0.4, 0.8].map((d) => (
                        <motion.span
                          key={d}
                          className="absolute inset-0 rounded-full border border-teal/40"
                          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            delay: d,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                      <div className="absolute inset-4 rounded-full bg-teal/15 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-teal" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Routing to our AI agent…
                    </h3>
                    <AnimatedThoughts />
                  </motion.div>
                )}

                {phase === "success" && (
                  <SuccessView
                    callScheduled={callScheduled}
                    callPhase={callPhase}
                    firstName={getValues("name").split(" ")[0]}
                    email={getValues("email")}
                  />
                )}
              </AnimatePresence>

              {/* Server error */}
              <AnimatePresence>
                {serverError && phase !== "processing" && phase !== "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg px-4 py-3"
                  >
                    {serverError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Nav */}
            {phase !== "processing" && phase !== "success" && (
              <div className="flex items-center justify-between gap-3 px-6 sm:px-10 py-5 border-t border-white/8 bg-[oklch(0.11_0.01_240/60%)]">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <p className="hidden sm:block text-[11px] text-muted-foreground">
                  {stepIndex + 1} of {STEPS.length}
                </p>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal text-[oklch(0.08_0.01_240)] text-sm font-semibold hover:bg-[oklch(0.78_0.18_195)] transition-all teal-glow-xs"
                >
                  {stepIndex === STEPS.length - 1 ? (
                    <>
                      Start AI Call
                      <Phone className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground/70 mt-6">
            No spam. The AI call takes 5–10 minutes. You can hang up at any time.
          </p>
          </div>

          {/* Live demo column */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <LiveCallDemo compact={phase === "processing" || phase === "success"} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StepHeader({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-2">{kicker}</p>
      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1.5">{title}</h2>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function SuccessView({
  callScheduled,
  callPhase,
  firstName,
  email,
}: {
  callScheduled: boolean;
  callPhase: CallPhase;
  firstName: string;
  email: string;
}) {
  const ended = callPhase === "ended";
  const active = callScheduled && !ended;

  const headline = !callScheduled
    ? "Request received"
    : ended
    ? `Thanks for the call, ${firstName}`
    : callPhase === "in-progress"
    ? "You're on the call with our AI agent"
    : "Our AI agent is calling you now";

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[400px] flex flex-col items-center justify-center text-center"
    >
      {/* Icon */}
      <motion.div
        layout
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 14 }}
        className="relative w-20 h-20 mb-6"
      >
        {active && (
          <>
            {[0, 0.6, 1.2].map((d) => (
              <motion.span
                key={d}
                className="absolute inset-0 rounded-full border border-teal/50"
                animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        <div className="absolute inset-0 rounded-full bg-teal flex items-center justify-center teal-glow">
          <AnimatePresence mode="wait" initial={false}>
            {!callScheduled ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <Check className="w-9 h-9 text-[oklch(0.08_0.01_240)]" />
              </motion.div>
            ) : ended ? (
              <motion.div
                key="mailcheck"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.3 }}
              >
                <MailCheck className="w-8 h-8 text-[oklch(0.08_0.01_240)]" />
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <Phone className="w-8 h-8 text-[oklch(0.08_0.01_240)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Headline + copy */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${callScheduled}-${ended}-${callPhase}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="max-w-md"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{headline}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {!callScheduled ? (
              <>Thanks for reaching out. Our team will contact you within 1 business day to schedule your strategy session.</>
            ) : ended ? (
              <>
                Your personalized AI automation audit report is being prepared and
                will arrive at{" "}
                <span className="text-white font-medium">{email}</span> within a
                few minutes.{" "}
                <span className="text-white/80">
                  Don&apos;t see it? Check your <span className="text-teal">spam</span> or
                  promotions folder.
                </span>
              </>
            ) : callPhase === "in-progress" ? (
              <>
                Stay on the line, <span className="text-white font-medium">{firstName}</span> —
                your AI agent is interviewing you now. The audit report will land in{" "}
                <span className="text-white font-medium">{email}</span> as soon as the call wraps.
              </>
            ) : (
              <>
                Keep your phone handy, <span className="text-white font-medium">{firstName}</span> —
                our agent should ring within a minute or two. Afterwards, your tailored
                automation roadmap arrives in <span className="text-white font-medium">{email}</span>.
              </>
            )}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Live status pill while call is active */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-[11px] font-medium mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
            </span>
            {callPhase === "in-progress" ? "Call in progress" : "Ringing your phone…"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.a
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        href={AURIVA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-teal/30 text-teal text-sm font-medium hover:bg-teal/10 transition-all"
      >
        {ended ? "Explore more automation ideas" : "Try our free AI audit while you wait"}
        <ExternalLink className="w-3.5 h-3.5" />
      </motion.a>

      {ended && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <PhoneOff className="w-3 h-3" />
          Call ended
        </motion.p>
      )}
    </motion.div>
  );
}

function AnimatedThoughts() {
  const lines = [
    "Preparing your business brief",
    "Warming up the AI voice agent",
    "Dialing your phone",
  ];
  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {lines.map((line, i) => (
        <motion.li
          key={line}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.5, duration: 0.3 }}
          className="flex items-center gap-2 justify-center"
        >
          <Loader2 className="w-3 h-3 text-teal animate-spin" />
          {line}
        </motion.li>
      ))}
    </ul>
  );
}

function LiveCallDemo({ compact }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl border border-white/8 bg-graphite/80 backdrop-blur p-5 overflow-hidden ${
        compact ? "lg:scale-[0.92] lg:opacity-80" : ""
      } transition-all duration-500`}
    >
      {/* Shimmer top edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal/50 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal/30 to-[oklch(0.60_0.20_220/30%)] flex items-center justify-center">
          <Phone className="w-5 h-5 text-white" />
          <span className="absolute inset-0 rounded-xl border border-teal/40 animate-pulse" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">AI Auditor</p>
          <p className="text-[11px] text-green-400 mt-1 inline-flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            Live call in progress
          </p>
        </div>
      </div>

      {/* Voice bars */}
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/8 px-3 py-3">
        <div className="flex items-end gap-[2px] h-5 w-20">
          {Array.from({ length: 18 }).map((_, k) => (
            <motion.span
              key={k}
              className="w-[2px] rounded-full bg-gradient-to-t from-teal to-[oklch(0.65_0.20_280)]"
              animate={{ scaleY: [0.3, 1, 0.5, 0.9, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: k * 0.05,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "bottom", height: "100%" }}
            />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">AI is speaking…</p>
      </div>
    </motion.div>
  );
}
