"use client";

import { useState } from "react";
import { Activity, AlertCircle, CheckCircle2, Heart, Plus, Scale } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { calculateBmi, classifyBloodPressure } from "@/lib/vitals";

export type VitalsRecord = {
  id: string;
  recordedAt: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  bloodGlucose: number;
  glucoseType: "fasting" | "postPrandial" | "random";
  weightKg: number;
  heightCm: number;
};

export const initialVitalsHistory: VitalsRecord[] = [
  {
    id: "vit-1",
    recordedAt: "2026-11-17T08:30:00.000Z",
    systolic: 124,
    diastolic: 82,
    heartRate: 74,
    bloodGlucose: 112,
    glucoseType: "fasting",
    weightKg: 68,
    heightCm: 165,
  },
  {
    id: "vit-2",
    recordedAt: "2026-11-15T09:00:00.000Z",
    systolic: 128,
    diastolic: 84,
    heartRate: 78,
    bloodGlucose: 142,
    glucoseType: "postPrandial",
    weightKg: 68.2,
    heightCm: 165,
  },
  {
    id: "vit-3",
    recordedAt: "2026-11-12T08:15:00.000Z",
    systolic: 120,
    diastolic: 78,
    heartRate: 72,
    bloodGlucose: 104,
    glucoseType: "fasting",
    weightKg: 68.5,
    heightCm: 165,
  },
];

export function VitalsTracker() {
  const { t } = useApp();
  const [history, setHistory] = useState<VitalsRecord[]>(initialVitalsHistory);
  const [showLogModal, setShowLogModal] = useState(false);
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [heartRate, setHeartRate] = useState("72");
  const [glucose, setGlucose] = useState("105");
  const [glucoseType, setGlucoseType] = useState<VitalsRecord["glucoseType"]>("fasting");
  const [weight, setWeight] = useState("68");
  const [height, setHeight] = useState("165");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const latest = history[0] || initialVitalsHistory[0];
  const bmiInfo = calculateBmi(latest.weightKg, latest.heightCm);
  const bpInfo = classifyBloodPressure(latest.systolic, latest.diastolic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VitalsRecord = {
      id: `vit-${Date.now()}`,
      recordedAt: new Date().toISOString(),
      systolic: Number(systolic) || 120,
      diastolic: Number(diastolic) || 80,
      heartRate: Number(heartRate) || 72,
      bloodGlucose: Number(glucose) || 100,
      glucoseType,
      weightKg: Number(weight) || 68,
      heightCm: Number(height) || 165,
    };
    setHistory([newRecord, ...history]);
    setShowLogModal(false);
    setToastMessage(t("recordSaved"));
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{t("vitalsTitle")}</h1>
          <p className="mt-1 text-sm text-muted">{t("vitalsIntro")}</p>
        </div>
        <Button onClick={() => setShowLogModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{t("logVitals")}</span>
        </Button>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className={`rounded-xl px-2.5 py-1 text-xs font-bold ${bpInfo.colorClass}`}>
              {t(bpInfo.key)}
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{t("bloodPressure")}</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {latest.systolic}/{latest.diastolic} <span className="text-sm font-semibold text-muted">{t("unitMmHg")}</span>
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="rounded-xl bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
              {t("bpNormal")}
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{t("heartRate")}</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {latest.heartRate} <span className="text-sm font-semibold text-muted">{t("unitBpm")}</span>
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              {t(latest.glucoseType === "fasting" ? "fastingSugar" : latest.glucoseType === "postPrandial" ? "postPrandialSugar" : "randomSugar")}
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{t("bloodGlucose")}</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {latest.bloodGlucose} <span className="text-sm font-semibold text-muted">{t("unitMgDl")}</span>
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Scale className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {t(bmiInfo.categoryKey)}
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{t("weightAndBmi")}</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {latest.weightKg} <span className="text-sm font-semibold text-muted">{t("unitKg")}</span> • {t("bmiValue", { value: bmiInfo.value })}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-foreground">{t("vitalsHistory")}</h2>
        <div className="mt-4 divide-y divide-border overflow-x-auto">
          <div className="grid min-w-[500px] grid-cols-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">
            <div>{t("registeredDate")}</div>
            <div>{t("bloodPressure")}</div>
            <div>{t("bloodGlucose")}</div>
            <div>{t("weightAndBmi")}</div>
          </div>
          {history.map((item) => {
            const bmi = calculateBmi(item.weightKg, item.heightCm);
            const bp = classifyBloodPressure(item.systolic, item.diastolic);
            return (
              <div key={item.id} className="grid min-w-[500px] grid-cols-4 items-center py-3 text-sm">
                <div className="font-semibold text-foreground">
                  {new Date(item.recordedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-extrabold text-foreground">{item.systolic}/{item.diastolic}</span>
                  <span className={`ms-2 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold ${bp.colorClass}`}>
                    {t(bp.key)}
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-foreground">{item.bloodGlucose} {t("unitMgDl")}</span>
                  <span className="ms-1 text-xs text-muted">({t(item.glucoseType === "fasting" ? "fastingSugar" : "postPrandialSugar")})</span>
                </div>
                <div>
                  <span className="font-extrabold text-foreground">{item.weightKg} {t("unitKg")}</span>
                  <span className="ms-1 text-xs text-muted">({t("bmiValue", { value: bmi.value })})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-foreground">{t("logVitals")}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted">{t("systolic")}</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted">{t("diastolic")}</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted">{t("heartRate")}</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted">{t("bloodGlucose")}</label>
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted">{t("claimCategory")}</label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(["fasting", "postPrandial", "random"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setGlucoseType(type)}
                      className={`rounded-xl border p-2 text-xs font-bold ${
                        glucoseType === type
                          ? "border-primary bg-primary text-white"
                          : "bg-background text-foreground hover:bg-blue-50/50"
                      }`}
                    >
                      {t(type === "fasting" ? "fastingSugar" : type === "postPrandial" ? "postPrandialSugar" : "randomSugar")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted">{t("weightKg")}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted">{t("heightCm")}</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowLogModal(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
