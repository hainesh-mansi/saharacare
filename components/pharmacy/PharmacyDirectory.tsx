"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Phone, Pill, Search, Store, Upload } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import {
  verifiedPharmacies,
  commonMedicines,
  type PharmacyItem,
} from "@/lib/ecosystem-data";

export function PharmacyDirectory() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyItem | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredMedicines = commonMedicines.filter(
    (med) =>
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brandNames.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPharmacies = verifiedPharmacies.filter(
    (ph) =>
      ph.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ph.district.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOrderModal(false);
    setToastMessage(t("orderSubmitted"));
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t("pharmacyTitle")}</h1>
          <p className="mt-1 text-sm text-muted">{t("searchMedicine")}</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("all")}
            className="w-full rounded-2xl border bg-card py-2.5 pe-4 ps-10 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Verified Pharmacies */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-extrabold text-foreground">{t("findPharmacy")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-primary dark:bg-blue-950">
                    <Store className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {pharmacy.is24x7 && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {t("open24Hours")}
                      </span>
                    )}
                    {pharmacy.hasDelivery && (
                      <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                        {t("homeDelivery")}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-3 font-extrabold text-foreground">{pharmacy.name}</h3>
                <p className="mt-1 flex items-start gap-1 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{pharmacy.address}</span>
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4">
                <a
                  href={`tel:${pharmacy.phone.replace(/[\s+]/g, "")}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{pharmacy.phone}</span>
                </a>
                <Button
                  onClick={() => {
                    setSelectedPharmacy(pharmacy);
                    setShowOrderModal(true);
                  }}
                  className="text-xs"
                >
                  {t("uploadPrescription")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medicine & Generic Price Comparison */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-extrabold text-foreground">{t("typicalPrice")}</h2>
        </div>
        <div className="mt-4 divide-y divide-border overflow-x-auto">
          <div className="grid min-w-[500px] grid-cols-3 py-2 text-xs font-bold uppercase tracking-wider text-muted">
            <div>{t("genericAlternative")}</div>
            <div>{t("brandName")}</div>
            <div>{t("typicalPrice")}</div>
          </div>
          {filteredMedicines.map((med) => (
            <div key={med.id} className="grid min-w-[500px] grid-cols-3 items-center py-3 text-sm">
              <div className="font-extrabold text-foreground">{med.genericName}</div>
              <div className="text-xs text-muted">{med.brandNames}</div>
              <div className="font-black text-emerald-700 dark:text-emerald-400">
                {t("currencyNpr")} {med.approxPriceNpr}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Prescription & Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-foreground">{t("uploadPrescription")}</h3>
            <p className="mt-1 text-xs text-muted">
              {selectedPharmacy?.name} • {selectedPharmacy?.district}
            </p>
            <form onSubmit={handleOrderSubmit} className="mt-4 space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-primary/30 p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-foreground">{t("uploadPrescription")}</p>
                <input type="file" accept="image/*,application/pdf" className="mt-2 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-muted">{t("deliveryAddress")}</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  required
                  placeholder={t("deliveryAddress")}
                  className="mt-1 w-full rounded-xl border bg-background p-3 text-xs font-semibold"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowOrderModal(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("uploadPrescription")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
