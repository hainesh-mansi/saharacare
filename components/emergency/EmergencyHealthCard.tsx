"use client";

import { AlertTriangle, Phone, Printer, QrCode, ShieldAlert } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";

export type EmergencyProfileData = {
  id: string;
  patientName: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContacts: { name: string; relation: string; phone: string }[];
  primaryCaregiverPhone?: string;
};

export const defaultEmergencyProfile: EmergencyProfileData = {
  id: "DEMO-EMG-2026",
  patientName: "Maya Sharma",
  bloodGroup: "O+",
  allergies: ["Penicillin", "NSAIDs / Ibuprofen"],
  chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  emergencyContacts: [
    { name: "Suresh Sharma", relation: "Spouse", phone: "+977 9841234567" },
    { name: "Pooja Sharma", relation: "Daughter (Caregiver)", phone: "+977 9851987654" },
  ],
  primaryCaregiverPhone: "+977 9851987654",
};

export function EmergencyHealthCard({
  profile = defaultEmergencyProfile,
  isPublicResponder = false,
}: {
  profile?: EmergencyProfileData;
  isPublicResponder?: boolean;
}) {
  const { t } = useApp();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border-2 border-red-200 bg-card p-6 shadow-sm dark:border-red-900/60 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-100 pb-5 dark:border-red-950">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600 text-white shadow-sm">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">{t("emergencyCardTitle")}</h2>
              <p className="text-xs text-muted">{t("scanNotice")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-2 text-xl font-black text-red-700 dark:bg-red-950/60 dark:text-red-300">
              {profile.bloodGroup}
            </span>
            {!isPublicResponder && (
              <Button
                variant="secondary"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-2"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>{t("printHealthCard")}</span>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{t("bloodGroup")}</p>
              <p className="mt-1 text-lg font-extrabold text-red-600 dark:text-red-400">{profile.bloodGroup}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{t("allergies")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center rounded-xl bg-red-100 px-3 py-1 text-xs font-bold text-red-800 dark:bg-red-950 dark:text-red-200"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{t("chronicConditions")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.chronicConditions.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-1 text-xs font-bold text-primary dark:bg-blue-950 dark:text-blue-200"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-6 text-center dark:border-red-950 dark:bg-red-950/20">
            <span className="grid h-28 w-28 place-items-center rounded-2xl bg-white p-2 shadow-sm dark:bg-zinc-900">
              <QrCode className="h-24 w-24 text-foreground" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-bold text-foreground">{profile.id}</p>
            <p className="mt-1 text-xs text-muted">{t("emergencyDisclaimer")}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-red-100 pt-5 dark:border-red-950">
          <h3 className="mb-3 text-sm font-extrabold text-foreground">{t("emergencyContacts")}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.emergencyContacts.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-red-300 hover:bg-red-50/40 dark:hover:bg-red-950/30"
              >
                <div>
                  <p className="font-extrabold text-foreground">{contact.name}</p>
                  <p className="text-xs text-muted">{contact.relation} • {contact.phone}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 text-white">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-xs font-semibold">{t("emergencyDisclaimer")}</p>
          </div>
          <a
            href="tel:102"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t("dial102")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
