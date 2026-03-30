import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
};

export default function DirectionCard({ icon: Icon, title, desc, href }: Props) {
  return (
    <Link
      href={href}
      className="group rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-[#4b2e83]/20 hover:shadow-2xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4b2e83]/10 text-[#4b2e83] transition group-hover:bg-[#4b2e83] group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#4b2e83]">
        Explore
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}