"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, BookOpen, ShieldCheck, Database } from "lucide-react";
import MovingLogo from "@/components/moving-logo";
import DirectionCard from "@/components/direction-card";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(75,46,131,0.14),transparent_32%),linear-gradient(to_bottom,#f8f9fa,#eef1f6)] text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4b2e83]">
              University of Washington
            </p>
            <h2 className="mt-2 text-2xl font-bold">HuskyPath</h2>
          </div>

          <Link
            href="/advisor"
            className="rounded-full bg-[#4b2e83] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4b2e83]/20 transition hover:-translate-y-0.5 hover:bg-[#3d256d]"
          >
            Launch Advisor
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <div className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-[#4b2e83] backdrop-blur-md">
              Agentic Course Planning Dashboard
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                HuskyPath: Agentic Course Planning
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A premium academic dashboard for prerequisite checks, catalog-grounded advising,
                policy review, and explainable AI planning across University of Washington course pathways.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/advisor"
                className="rounded-2xl bg-[#4b2e83] px-6 py-4 font-semibold text-white shadow-xl shadow-[#4b2e83]/20 transition hover:-translate-y-1 hover:bg-[#3d256d]"
              >
                Start Advising
              </Link>
              <a
                href="#sections"
                className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 font-semibold text-slate-800 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#4b2e83]"
              >
                Explore Features
              </a>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/70 p-5 backdrop-blur-md shadow-sm">
                <p className="text-2xl font-bold text-[#4b2e83]">25+</p>
                <p className="mt-1 text-sm text-slate-600">University documents</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/70 p-5 backdrop-blur-md shadow-sm">
                <p className="text-2xl font-bold text-[#4b2e83]">Grounded</p>
                <p className="mt-1 text-sm text-slate-600">Citations in every answer</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/70 p-5 backdrop-blur-md shadow-sm">
                <p className="text-2xl font-bold text-[#4b2e83]">Safe</p>
                <p className="mt-1 text-sm text-slate-600">Clarifies when uncertain</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-[#4b2e83]/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-2xl backdrop-blur-xl">
              <MovingLogo />
            </div>
          </motion.div>
        </div>

        <section id="sections" className="grid gap-5 pb-12 md:grid-cols-2 xl:grid-cols-4">
          <DirectionCard
            icon={MessageSquare}
            title="Assistant"
            desc="Check eligibility, compare prerequisites, and build term-wise course plans."
            href="/advisor"
          />
          <DirectionCard
            icon={BookOpen}
            title="Catalog"
            desc="Browse course descriptions, prerequisites, and branch-specific requirements."
            href="/advisor"
          />
          <DirectionCard
            icon={ShieldCheck}
            title="Policies"
            desc="Review grading rules, residency logic, credits, and academic constraints."
            href="/advisor"
          />
          <DirectionCard
            icon={Database}
            title="Architecture"
            desc="Show agentic reasoning flow, retrieval activity, and source-grounded outputs."
            href="/advisor"
          />
        </section>

        <footer className="mt-auto grid gap-8 border-t border-slate-200/80 py-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#85754d]">
              About
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              HuskyPath is designed as an academic intelligence layer over official course,
              program, and policy data. The interface is built to demonstrate grounded answers,
              agentic retrieval, safe abstention, and a polished assessment-ready product experience.
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#85754d]">
              Stack
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Next.js · Tailwind CSS · Framer Motion · React Three Fiber · Lucide ·
              Agentic RAG Backend
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}