"use client";

import { useState } from "react";
import { Ambulance, MapPin, Phone, Search } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { nepalAmbulanceServices } from "@/lib/ecosystem-data";

export function AmbulanceDirectory() {
  const { t } = useApp();
  const [filter, setFilter] = useState("");

  const filtered = nepalAmbulanceServices.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.district.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Ambulance className="h-5 w-5 text-red-600" aria-hidden="true" />
          <h3 className="text-lg font-extrabold text-foreground">{t("ambulanceServices")}</h3>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t("all")}
            className="w-full rounded-xl border bg-card py-2 pe-3 ps-9 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:border-red-300"
          >
            <div className="min-w-0">
              <p className="truncate font-extrabold text-foreground">{service.name}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {service.district}
                </span>
                {service.is24x7 && (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {t("open24Hours")}
                  </span>
                )}
              </div>
            </div>
            <a
              href={`tel:${service.phone.replace(/[\s+]/g, "")}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
