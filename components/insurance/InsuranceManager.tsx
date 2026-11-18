"use client";

import { useState } from "react";
import { Building2, CheckCircle, FileText, Plus, ShieldCheck } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";

export type InsuranceClaim = {
  id: string;
  facility: string;
  date: string;
  amount: number;
  categoryKey: "opdConsultation" | "inpatientSurgery" | "pharmacyMedicines" | "diagnosticTests";
  status: "claimStatusSubmitted" | "claimStatusReview" | "claimStatusApproved" | "claimStatusRejected";
};

export const initialClaims: InsuranceClaim[] = [
  {
    id: "CLM-9021",
    facility: "Tribhuvan University Teaching Hospital (TUTH)",
    date: "2026-11-10",
    amount: 3200,
    categoryKey: "diagnosticTests",
    status: "claimStatusApproved",
  },
  {
    id: "CLM-9034",
    facility: "Patan Hospital",
    date: "2026-11-14",
    amount: 1850,
    categoryKey: "pharmacyMedicines",
    status: "claimStatusReview",
  },
];

export const networkHospitals = [
  "Tribhuvan University Teaching Hospital (TUTH), Maharajgunj",
  "Patan Academy of Health Sciences (Patan Hospital), Lagankhel",
  "Bir Hospital (National Academy of Medical Sciences), Kathmandu",
  "Civil Service Hospital, Minbhawan",
  "Shahid Gangalal National Heart Centre, Bansbari",
  "BP Koirala Memorial Cancer Hospital, Bharatpur, Chitwan",
];

export function InsuranceManager() {
  const { t } = useApp();
  const [claims, setClaims] = useState<InsuranceClaim[]>(initialClaims);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [facility, setFacility] = useState(networkHospitals[0]);
  const [billAmount, setBillAmount] = useState("");
  const [category, setCategory] = useState<InsuranceClaim["categoryKey"]>("opdConsultation");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billAmount) return;
    const newClaim: InsuranceClaim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      facility,
      date: new Date().toISOString().split("T")[0],
      amount: Number(billAmount) || 0,
      categoryKey: category,
      status: "claimStatusSubmitted",
    };
    setClaims([newClaim, ...claims]);
    setShowClaimModal(false);
    setBillAmount("");
    setToastMessage(t("recordSaved"));
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t("insuranceDashboardTitle")}</h1>
          <p className="mt-1 text-sm text-muted">{t("hibNotice")}</p>
        </div>
        <Button onClick={() => setShowClaimModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{t("submitClaim")}</span>
        </Button>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Digital Insurance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <ShieldCheck className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-emerald-100">{t("insuranceCardTitle")}</p>
              <h2 className="text-xl font-black">{t("hibTitle")}</h2>
            </div>
          </div>
          <span className="rounded-xl bg-white/20 px-3 py-1 text-xs font-bold uppercase backdrop-blur-sm">
            {t("claimStatusApproved")}
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-emerald-100">{t("policyNumber")}</p>
            <p className="mt-1 font-mono text-base font-bold">{"HIB-01-2026-8874"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-100">{t("coverageLimit")}</p>
            <p className="mt-1 text-lg font-black">{t("currencyNpr")} {"100,000"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-100">{t("remainingCoverage")}</p>
            <p className="mt-1 text-lg font-black text-emerald-200">{t("currencyNpr")} {"78,500"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-100">{t("validUntil")}</p>
            <p className="mt-1 text-base font-bold">{"2027-04-13"}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-4 text-xs text-emerald-100">
          <p>{t("hibNotice")}</p>
          <p className="font-semibold">{t("copay")}: {"10%"}</p>
        </div>
      </div>

      {/* Claims History */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-foreground">{t("claimsHistory")}</h2>
        <div className="mt-4 divide-y divide-border">
          {claims.map((claim) => (
            <div key={claim.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary dark:bg-blue-950">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-extrabold text-foreground">{claim.facility}</p>
                  <p className="text-xs text-muted">
                    {claim.id} • {claim.date} • {t(claim.categoryKey)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-foreground">{t("currencyNpr")} {claim.amount.toLocaleString()}</span>
                <span
                  className={`rounded-xl px-3 py-1 text-xs font-bold ${
                    claim.status === "claimStatusApproved"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : claim.status === "claimStatusReview"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                  }`}
                >
                  {t(claim.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Hospitals in Nepal */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-extrabold text-foreground">{t("networkHospitals")}</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {networkHospitals.map((hosp) => (
            <div key={hosp} className="flex items-center gap-3 rounded-2xl border bg-background p-4 text-xs font-bold text-foreground">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{hosp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-foreground">{t("submitClaim")}</h3>
            <form onSubmit={handleSubmitClaim} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted">{t("treatmentFacility")}</label>
                <select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs font-semibold"
                >
                  {networkHospitals.map((hosp) => (
                    <option key={hosp} value={hosp}>
                      {hosp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted">{t("claimCategory")}</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {(["opdConsultation", "inpatientSurgery", "pharmacyMedicines", "diagnosticTests"] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-xl border p-2.5 text-xs font-bold ${
                          category === cat
                            ? "border-primary bg-primary text-white"
                            : "bg-background text-foreground hover:bg-blue-50/50"
                        }`}
                      >
                        {t(cat)}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted">{t("billAmount")} ({t("currencyNpr")})</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  required
                  placeholder="2500"
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowClaimModal(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("submitClaim")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
