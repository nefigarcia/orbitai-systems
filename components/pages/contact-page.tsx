"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { submitContactForm } from "@/actions/leads";
import {
  INDUSTRIES,
  COMPANY_SIZES,
  BUDGET_RANGES,
  SERVICE_INTERESTS,
  CONTACT_METHODS,
  AURIVA_URL,
} from "@/lib/constants";

function FormField({
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
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-teal/50 focus:bg-white/8 transition-all";

const SELECT_CLASS =
  "w-full px-4 py-3 rounded-lg border border-white/10 bg-[oklch(0.13_0.01_240)] text-white text-sm focus:outline-none focus:border-teal/50 transition-all appearance-none";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    setSubmitting(true);
    setServerError(null);
    const result = await submitContactForm(data);
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error || "Something went wrong.");
    }
    setSubmitting(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-8 bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-6">
              <span>Free Strategy Session</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Let's Talk About
              <span className="text-teal"> Your Business</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Tell us about your challenge. We'll review your submission and schedule
              a free strategy call to outline how AI automation can help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-xl border border-white/8 bg-graphite p-6">
                <h3 className="text-sm font-semibold text-white mb-4">What happens next</h3>
                <ol className="space-y-4">
                  {[
                    "We review your submission within 1 business day",
                    "Our team schedules a free 30-min strategy call",
                    "We prepare a tailored automation roadmap",
                    "You receive a clear proposal with scope and pricing",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] text-teal font-bold">{i + 1}</span>
                      </div>
                      <span className="text-xs text-muted-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl border border-teal/20 bg-teal/5 p-6">
                <p className="text-xs font-semibold text-teal mb-2">Not ready for a call?</p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Start with a free AI business audit powered by Auriva — get instant insights
                  into your automation opportunities.
                </p>
                <a
                  href={AURIVA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-teal hover:text-teal/80 transition-colors"
                >
                  Start free audit
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-teal/25 bg-teal/5 p-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-teal/15 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-teal" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Request Received</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. Our team will review your request and
                      contact you within 1 business day to schedule your strategy session.
                    </p>
                    <a
                      href={AURIVA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-teal/30 text-teal text-sm font-medium hover:bg-teal/10 transition-all"
                    >
                      Get your free AI audit while you wait
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-2xl border border-white/8 bg-graphite p-8 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Full Name" error={errors.name?.message} required>
                        <input
                          {...register("name")}
                          placeholder="Jane Smith"
                          className={INPUT_CLASS}
                        />
                      </FormField>
                      <FormField label="Email Address" error={errors.email?.message} required>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="jane@company.com"
                          className={INPUT_CLASS}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Phone Number" error={errors.phone?.message}>
                        <input
                          {...register("phone")}
                          placeholder="+1 (555) 000-0000"
                          className={INPUT_CLASS}
                        />
                      </FormField>
                      <FormField label="Company Name" error={errors.company?.message}>
                        <input
                          {...register("company")}
                          placeholder="Acme Corp"
                          className={INPUT_CLASS}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Company Website" error={errors.website?.message}>
                        <input
                          {...register("website")}
                          placeholder="https://company.com"
                          className={INPUT_CLASS}
                        />
                      </FormField>
                      <FormField label="Industry" error={errors.industry?.message}>
                        <select {...register("industry")} className={SELECT_CLASS}>
                          <option value="">Select industry</option>
                          {INDUSTRIES.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Company Size" error={errors.companySize?.message}>
                        <select {...register("companySize")} className={SELECT_CLASS}>
                          <option value="">Select size</option>
                          {COMPANY_SIZES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Service Interest" error={errors.serviceInterest?.message} required>
                        <select {...register("serviceInterest")} className={SELECT_CLASS}>
                          <option value="">Select a service</option>
                          {SERVICE_INTERESTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </FormField>
                    </div>

                    <FormField label="Describe Your Current Challenge" error={errors.currentChallenge?.message} required>
                      <textarea
                        {...register("currentChallenge")}
                        rows={5}
                        placeholder="What business problem are you trying to solve? What processes are manual, slow, or error-prone? What would success look like?"
                        className={`${INPUT_CLASS} resize-none`}
                      />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Budget Range" error={errors.budgetRange?.message}>
                        <select {...register("budgetRange")} className={SELECT_CLASS}>
                          <option value="">Select budget</option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Preferred Contact Method" error={errors.preferredContactMethod?.message}>
                        <select {...register("preferredContactMethod")} className={SELECT_CLASS}>
                          <option value="">Select method</option>
                          {CONTACT_METHODS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </FormField>
                    </div>

                    {serverError && (
                      <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg px-4 py-3">
                        {serverError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal text-[oklch(0.08_0.01_240)] font-semibold text-sm hover:bg-teal/90 transition-all teal-glow disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[oklch(0.08_0.01_240)] border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Consultation Request
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      We'll respond within 1 business day. No spam, no unsolicited sales calls.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
