"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, ShieldAlert, ShieldCheck, Sparkles, Store } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";

export function EcosystemHubCard() {
  const { t } = useApp();

  const services = [
    {
      href: "/emergency/DEMO-EMG-2026",
      labelKey: "emergencyId" as const,
      icon: ShieldAlert,
      color: "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400",
    },
    {
      href: "/patient/vitals",
      labelKey: "trackVitals" as const,
      icon: Activity,
      color: "bg-blue-50 text-primary dark:bg-blue-950/60 dark:text-blue-300",
    },
    {
      href: "/patient/insurance",
      labelKey: "manageInsurance" as const,
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    },
    {
      href: "/patient/pharmacies",
      labelKey: "browsePharmacies" as const,
      icon: Store,
      color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
    },
    {
      href: "/patient/innovations",
      labelKey: "exploreInnovations" as const,
      icon: Sparkles,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    },
  ];

  return (
    <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-sm">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-foreground sm:text-xl">{t("ecosystemHub")}</h2>
            <p className="text-xs text-muted">{t("ecosystemHubDetail")}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {services.map(({ href, labelKey, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center justify-center rounded-2xl border bg-background p-4 text-center transition-all hover:border-primary hover:shadow-sm"
          >
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color} transition-transform group-hover:scale-105`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="mt-3 text-xs font-extrabold text-foreground leading-tight">
              {t(labelKey)}
            </span>
            <span className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
