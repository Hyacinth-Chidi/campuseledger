import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Briefcase, ShieldCheck, Fingerprint, Key, ChevronRight, Award } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import Image from "next/image";
import DotField from "@/components/DotField";
import { AnimatedBadge } from "@/components/shared/AnimatedBadge";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-16 pb-32 px-6 text-center overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#1f23e5"
            gradientTo="#B497CF"
            glowColor="rgba(155, 162, 220, 0.08)"
          />
        </div>

        {/* Dynamic Graphic Orbit Elements */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden hidden md:flex">
          <div className="absolute top-[15%] left-[2%] lg:left-[8%] xl:left-[15%] bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 animate-[bounce_4s_infinite]">
            <Award className="size-8 text-amber-500" />
          </div>
          <div className="absolute bottom-[20%] left-[8%] lg:left-[15%] xl:left-[22%] bg-white/90 backdrop-blur-sm p-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 animate-[bounce_5s_infinite_1s]">
            <Key className="size-6 text-indigo-500" />
          </div>
          <div className="absolute top-[20%] right-[2%] lg:right-[8%] xl:right-[15%] bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 animate-[bounce_6s_infinite_2s]">
            <Fingerprint className="size-8 text-purple-500" />
          </div>
          <div className="absolute bottom-[25%] right-[8%] lg:right-[15%] xl:right-[22%] bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-blue-100 animate-[bounce_7s_infinite_1.5s]">
            <ShieldCheck className="size-10 text-blue-600" />
          </div>
        </div>
        <div className="max-w-5xl w-full px-4 space-y-6 z-10">
          <AnimatedBadge />
          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-black tracking-tight text-foreground leading-[1.1]">
            Decentralized Identity for  <br className="hidden md:block" />
            <span className="text-primary"> the Modern Campus</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Empower your students with cryptographically secure, verifiable credentials. No more phone calls, no more paper transcripts. Just instant, mathematically proven verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
              <Link href="/institution/signup">
                Issue Credentials <ChevronRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto border-border hover:bg-secondary">
              <Link href="/verify">Verify a Student</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works (Features) Section */}
      <section id="features" className="py-28 px-6 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-white/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <ScrollReveal>
            <div className="text-center space-y-5">
              <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground mb-2">
                How it works
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">One Identity, Unlimited Possibilities</h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                CampusLedger brings students, institutions, and employers together in a zero-trust cryptographic environment.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Feature */}
            <ScrollReveal delayMs={0}>
              <div className="group relative flex flex-col items-start p-8 rounded-3xl bg-card text-card-foreground shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-500 h-full overflow-hidden">
                {/* Decorative corner gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                {/* Step number */}
                <span className="absolute top-6 right-6 text-6xl font-black text-primary/[0.07] leading-none select-none">01</span>

                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-7 shadow-lg shadow-primary/25">
                  <GraduationCap className="size-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">For Students</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  Hold your academic identity in your pocket. Log in seamlessly using biometric WebAuthn (Face ID / Touch ID). Your credentials stay with you forever.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Link href="/student/login" className="flex items-center gap-1.5 hover:underline">
                    Get started <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Institution Feature */}
            <ScrollReveal delayMs={150}>
              <div className="group relative flex flex-col items-start p-8 rounded-3xl bg-card text-card-foreground shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                <span className="absolute top-6 right-6 text-6xl font-black text-primary/[0.07] leading-none select-none">02</span>

                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-7 shadow-lg shadow-primary/25">
                  <Building2 className="size-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">For Institutions</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  Issue cryptographically signed diplomas and transcripts instantly. Manage your roster and eliminate fraudulent credential claims.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Link href="/institution/signup" className="flex items-center gap-1.5 hover:underline">
                    Start issuing <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Employer Feature */}
            <ScrollReveal delayMs={300}>
              <div className="group relative flex flex-col items-start p-8 rounded-3xl bg-card text-card-foreground shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                <span className="absolute top-6 right-6 text-6xl font-black text-primary/[0.07] leading-none select-none">03</span>

                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-7 shadow-lg shadow-primary/25">
                  <Briefcase className="size-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">For Employers</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  Verify applicant credentials in milliseconds. Zero reliance on the issuing university&apos;s uptime. Mathematical certainty for every hire.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Link href="/verify" className="flex items-center gap-1.5 hover:underline">
                    Verify now <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section id="security" className="py-28 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <ScrollReveal>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                Bank-grade Security
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built on Unbreakable Cryptography</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                We replace outdated paper verification with modern cryptographic primitives, ensuring complete privacy and mathematical trust.
              </p>
            </ScrollReveal>
            <ul className="space-y-2">
              <ScrollReveal delayMs={100}>
                <li className="group flex gap-5 p-4 -mx-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-default">
                  <div className="mt-1 bg-primary/10 p-3 rounded-2xl h-fit text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                    <Key className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Ed25519 Signatures</h4>
                    <p className="text-muted-foreground leading-relaxed">Lightning-fast, highly secure cryptographic signatures ensure credentials can never be forged or tampered with.</p>
                  </div>
                </li>
              </ScrollReveal>
              <ScrollReveal delayMs={200}>
                <li className="group flex gap-5 p-4 -mx-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-default">
                  <div className="mt-1 bg-primary/10 p-3 rounded-2xl h-fit text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Zero-Tracking Verification</h4>
                    <p className="text-muted-foreground leading-relaxed">Employers verify credentials directly against public keys. Institutions cannot track when or where a student shares their credentials.</p>
                  </div>
                </li>
              </ScrollReveal>
              <ScrollReveal delayMs={300}>
                <li className="group flex gap-5 p-4 -mx-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-default">
                  <div className="mt-1 bg-primary/10 p-3 rounded-2xl h-fit text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                    <Fingerprint className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Biometric Access</h4>
                    <p className="text-muted-foreground leading-relaxed">Passwords are easily stolen. We utilize WebAuthn to secure student accounts with unphishable biometric authentication.</p>
                  </div>
                </li>
              </ScrollReveal>
            </ul>
          </div>

          <ScrollReveal delayMs={200} className="relative rounded-2xl border border-slate-800/80 bg-[#0B0F19] p-0 shadow-[0_0_60px_-15px_rgba(59,130,246,0.4)] overflow-hidden hidden lg:block">
            {/* Mac Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60 bg-slate-900/50">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-yellow-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
              <div className="ml-4 text-xs text-slate-500 font-mono">credential.json</div>
            </div>

            <div className="p-8 relative font-mono text-sm leading-relaxed text-slate-400 space-y-4">
              {/* Decorative background element for the mock code/data */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div><span className="text-blue-400">{"{"}</span></div>
                <div className="pl-4">
                  <span className="text-slate-300">"credentialType"</span>: <span className="text-emerald-400">"Degree"</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-300">"issuerDID"</span>: <span className="text-emerald-400">"did:cledger:institution:5f8a..."</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-300">"holderDID"</span>: <span className="text-emerald-400">"did:cledger:student:8b2c..."</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-300">"claims"</span>: <span className="text-blue-400">{"{"}</span>
                </div>
                <div className="pl-8">
                  <span className="text-slate-300">"degree"</span>: <span className="text-emerald-400">"B.Sc. Computer Science"</span>,
                </div>
                <div className="pl-8">
                  <span className="text-slate-300">"honors"</span>: <span className="text-emerald-400">"Summa Cum Laude"</span>
                </div>
                <div className="pl-4"><span className="text-blue-400">{"}"}</span>,</div>
                <div className="pl-4 flex items-center">
                  <span className="text-slate-300">"signature"</span>: <span className="text-emerald-400">"eyJhbGciOiJFZERTQSIsInR5c..."</span>
                  <span className="ml-1 w-1.5 h-4 bg-blue-400 animate-pulse inline-block" />
                </div>
                <div><span className="text-blue-400">{"}"}</span></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center text-emerald-400 font-medium text-sm">
                <ShieldCheck className="size-4 mr-2" /> Signature Verified
              </div>
              <div className="text-xs text-slate-500 font-mono">Ed25519 Verified</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-24 px-6 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to modernize your institution?</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Join the leading universities issuing cryptographically verifiable degrees today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 text-base h-12 w-full sm:w-auto text-primary hover:bg-white/90 shadow-lg shadow-black/10">
              <Link href="/institution/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base h-12 w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground backdrop-blur-sm">
              <Link href="/verify">Verify a Student</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <Image src="/logo.png" alt="CampusLedger Logo" width={160} height={40} className="object-contain" />
              <p className="text-slate-500 text-base max-w-sm leading-relaxed">
                Empowering students, institutions, and employers with mathematically proven, cryptographically secure academic credentials.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-5">Platform</h4>
              <ul className="space-y-3.5 text-sm text-slate-500 font-medium">
                <li><Link href="/student/login" className="hover:text-primary transition-colors">Student Wallet</Link></li>
                <li><Link href="/institution/signup" className="hover:text-primary transition-colors">Issuer Portal</Link></li>
                <li><Link href="/verify" className="hover:text-primary transition-colors">Verification Engine</Link></li>
                <li><Link href="https://github.com/w3c/vc-data-model" target="_blank" className="hover:text-primary transition-colors flex items-center">W3C Spec <ChevronRight className="size-3 ml-1" /></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-5">Solutions</h4>
              <ul className="space-y-3.5 text-sm text-slate-500 font-medium">
                <li><Link href="#features" className="hover:text-primary transition-colors">For Students</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">For Universities</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">For Employers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-5">Company</h4>
              <ul className="space-y-3.5 text-sm text-slate-500 font-medium">
                <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Portal</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} CampusLedger Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
