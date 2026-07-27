import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageSquare, Sparkles, Send, Clock, Shield, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { appRoutes } from "@/app/router/routes";
import { apiClient } from "@/services/api/client";
import { contactResponseSchema } from "@/services/api/schemas";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Ambient glowing background spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      <div className="pt-32 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEDICATED SUPPORT TEAM</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.12] mb-4">
              Get in <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Touch</span> with Us
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Have a technical question about our computer vision engine, commercial plans, or custom workflows? Our engineering and support teams are ready to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column — Contact Information & Benefits */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    title: "Email Support",
                    info: "support@pixelmint.ai",
                    sub: "Avg response under 2 hours",
                    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    icon: MessageSquare,
                    title: "Live Assistance",
                    info: "Available Mon-Fri, 9am-6pm IST",
                    sub: "Priority routing for Pro creators",
                    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                  },
                  {
                    icon: MapPin,
                    title: "Global Headquarters",
                    info: "Bengaluru, India",
                    sub: "Distributed engineering team",
                    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  },
                ].map((contact) => (
                  <div
                    key={contact.title}
                    className="flex items-start gap-4 p-5 rounded-[22px] bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 shadow-lg shadow-black/40 group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${contact.color} group-hover:scale-105 transition-transform duration-300`}>
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-['Outfit']">{contact.title}</h3>
                      <p className="text-sm font-medium text-slate-200 mt-0.5">{contact.info}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {contact.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SLA & Security Card */}
              <div className="p-6 rounded-[22px] bg-gradient-to-br from-blue-950/20 via-[#0C1222] to-white/[0.02] border border-blue-500/20 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Studio-Grade Reliability
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>256-bit TLS encrypted communication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Strict zero data retention on support attachments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Direct escalation to core computer vision engineers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column — Glassmorphic Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-black/80">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white font-['Outfit']">Send us a Message</h2>
                  <p className="text-sm text-slate-400 mt-1">Fill out the form below and we will get back to you promptly.</p>
                </div>

                <form
                  className="space-y-5"
                  noValidate
                  onSubmit={(e) =>
                    void handleSubmit(async (values) => {
                      try {
                        const response = await apiClient.post(
                          "/api/contact",
                          values,
                          contactResponseSchema,
                        );

                        toast.success(
                          response.message ||
                            "Message sent successfully! Our support team will respond shortly.",
                        );

                        reset();
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Unable to send message. Please try again.",
                        );
                      }
                    })(e)
                  }
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 ml-1">Your Name</label>
                      <input
                        {...register("name")}
                        placeholder="John Doe"
                        aria-invalid={Boolean(errors.name)}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200"
                      />
                      {errors.name ? <p className="text-xs text-red-400 ml-1">{errors.name.message}</p> : null}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="john@company.com"
                        aria-invalid={Boolean(errors.email)}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200"
                      />
                      {errors.email ? <p className="text-xs text-red-400 ml-1">{errors.email.message}</p> : null}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 ml-1">Subject</label>
                    <input
                      {...register("subject")}
                      placeholder="How can we help you today?"
                      aria-invalid={Boolean(errors.subject)}
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200"
                    />
                    {errors.subject ? <p className="text-xs text-red-400 ml-1">{errors.subject.message}</p> : null}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 ml-1">Message</label>
                    <textarea
                      {...register("message")}
                      placeholder="Please describe your inquiry or technical issue in detail..."
                      rows={5}
                      aria-invalid={Boolean(errors.message)}
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200 resize-none"
                    />
                    {errors.message ? <p className="text-xs text-red-400 ml-1">{errors.message.message}</p> : null}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 border-0 mt-2 min-h-[48px]"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                  <span>Need instant answers? Check our FAQ</span>
                  <Link to={appRoutes.home + "#faq"} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors">
                    <span>View Frequently Asked Questions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
