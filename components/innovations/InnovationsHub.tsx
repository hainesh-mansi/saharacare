"use client";

import { useState } from "react";
import { AlertCircle, Calculator, CheckCircle2, Droplet, Heart, MapPin, Phone, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { costEstimates } from "@/lib/ecosystem-data";

export type BloodBankItem = {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  availableTypes: string[];
};

export type UrgentRequestItem = {
  id: string;
  patientHospital: string;
  bloodType: string;
  units: number;
  contactPhone: string;
  timeAgo: string;
};

export const verifiedBloodBanks: BloodBankItem[] = [
  {
    id: "bb-1",
    name: "Central Blood Transfusion Service (Nepal Red Cross)",
    district: "Kathmandu",
    address: "Exhibition Road, Bhrikutimandap, Kathmandu",
    phone: "+977 1 4288484",
    availableTypes: ["A+", "B+", "O+", "AB+", "O-", "A-"],
  },
  {
    id: "bb-2",
    name: "Lalitpur Red Cross Blood Bank",
    district: "Lalitpur",
    address: "Pulchowk, Lalitpur",
    phone: "+977 1 5521255",
    availableTypes: ["A+", "B+", "O+", "AB+"],
  },
  {
    id: "bb-3",
    name: "Bhaktapur Blood Bank & Transfusion Center",
    district: "Bhaktapur",
    address: "Doodhpati, Bhaktapur",
    phone: "+977 1 6611661",
    availableTypes: ["A+", "B+", "O+", "AB+", "B-"],
  },
  {
    id: "bb-4",
    name: "Pokhara Regional Blood Transfusion Service",
    district: "Pokhara",
    address: "Ramghat, Pokhara",
    phone: "+977 61 521091",
    availableTypes: ["A+", "B+", "O+", "AB+"],
  },
];

export const urgentBloodRequests: UrgentRequestItem[] = [
  {
    id: "urg-1",
    patientHospital: "Tribhuvan University Teaching Hospital (TUTH)",
    bloodType: "O+",
    units: 2,
    contactPhone: "+977 9841000001",
    timeAgo: "25 min",
  },
  {
    id: "urg-2",
    patientHospital: "Shahid Gangalal Heart Centre",
    bloodType: "B-",
    units: 1,
    contactPhone: "+977 9851000002",
    timeAgo: "1 hour",
  },
];

export function InnovationsHub() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<"blood" | "costs">("blood");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all");
  const [searchProcedure, setSearchProcedure] = useState("");
  const [donorRegistered, setDonorRegistered] = useState(false);

  const bloodTypes = ["all", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const filteredBloodBanks = verifiedBloodBanks.filter((bank) => {
    if (selectedBloodType === "all") return true;
    return bank.availableTypes.includes(selectedBloodType);
  });

  const filteredCosts = costEstimates.filter((item) =>
    item.serviceName.toLowerCase().includes(searchProcedure.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t("innovationsTitle")}</h1>
          </div>
          <p className="mt-1 text-sm text-muted">{t("costEstimatorIntro")}</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("blood")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === "blood"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Droplet className="h-4 w-4" aria-hidden="true" />
            <span>{t("bloodDonorNetwork")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("costs")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === "costs"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span>{t("costEstimator")}</span>
          </button>
        </div>
      </div>

      {activeTab === "blood" && (
        <div className="space-y-6">
          {/* Urgent Blood Requests */}
          <div className="rounded-3xl border-2 border-red-200 bg-red-50/50 p-6 shadow-sm dark:border-red-950 dark:bg-red-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
                <h2 className="text-lg font-extrabold text-red-900 dark:text-red-200">{t("urgentBloodRequests")}</h2>
              </div>
              <span className="rounded-xl bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">
                {urgentBloodRequests.length}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {urgentBloodRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-card p-4 shadow-sm dark:border-red-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-red-500 bg-red-50 text-xl font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                      {req.bloodType}
                    </span>
                    <div>
                      <p className="font-extrabold text-foreground">{req.patientHospital}</p>
                      <p className="text-xs text-muted">
                        {t("bloodUnits", { count: req.units })} • {req.timeAgo}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${req.contactPhone.replace(/[\s+]/g, "")}`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-600 text-white hover:bg-red-700"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Blood Type Filter & Donor Registration */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{t("bloodGroup")}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedBloodType(type)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-extrabold ${
                      selectedBloodType === type
                        ? "bg-red-600 text-white"
                        : "bg-background text-foreground hover:bg-red-50 dark:hover:bg-red-950/40"
                    }`}
                  >
                    {type === "all" ? t("all") : type}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setDonorRegistered(!donorRegistered)}
              variant={donorRegistered ? "secondary" : "primary"}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span>{t("registerAsDonor")}</span>
            </Button>
          </div>

          {donorRegistered && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold">{t("recordSaved")}</p>
            </div>
          )}

          {/* Verified Blood Banks */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-foreground">{t("bloodBankDirectory")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredBloodBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-red-300"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950">
                        <Droplet className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <a
                        href={`tel:${bank.phone.replace(/[\s+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold text-primary hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{bank.phone}</span>
                      </a>
                    </div>

                    <h3 className="mt-3 font-extrabold text-foreground">{bank.name}</h3>
                    <p className="mt-1 flex items-start gap-1 text-xs text-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{bank.address}</span>
                    </p>
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("bloodGroup")}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {bank.availableTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "costs" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">{t("costEstimator")}</h2>
              <p className="mt-1 text-xs text-muted">{t("costEstimatorIntro")}</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={searchProcedure}
                onChange={(e) => setSearchProcedure(e.target.value)}
                placeholder={t("all")}
                className="w-full rounded-2xl border bg-background py-2 pe-3 ps-9 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="divide-y divide-border overflow-x-auto">
              <div className="grid min-w-[600px] grid-cols-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">
                <div>{t("procedureOrTest")}</div>
                <div>{t("govtHospitalFee")}</div>
                <div>{t("privateHospitalFee")}</div>
                <div>{t("insuranceCovered")}</div>
              </div>
              {filteredCosts.map((item) => (
                <div key={item.id} className="grid min-w-[600px] grid-cols-4 items-center py-4 text-sm">
                  <div>
                    <p className="font-extrabold text-foreground">{item.serviceName}</p>
                    <p className="text-xs text-muted">{item.category}</p>
                  </div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">
                    {t("currencyNpr")} {item.govtNpr}
                  </div>
                  <div className="font-bold text-foreground">
                    {t("currencyNpr")} {item.privateNpr}
                  </div>
                  <div>
                    {item.hibCovered ? (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t("insuranceCovered")}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
