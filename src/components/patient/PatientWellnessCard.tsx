"use client";

import React, { useState } from "react";
import { WellnessStatus, PatientWellness, Language } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { Card } from "@/components/ui/Card";
import { Smile, Meh, Frown, CheckCircle2 } from "lucide-react";

interface PatientWellnessCardProps {
  currentWellness?: PatientWellness | null;
  onRecordWellness: (status: WellnessStatus) => void;
  lang: Language;
}

export const PatientWellnessCard: React.FC<PatientWellnessCardProps> = ({
  currentWellness,
  onRecordWellness,
  lang,
}) => {
  const t = lang === "ne" ? ne : en;
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = async (status: WellnessStatus) => {
    setSubmitting(true);
    try {
      await onRecordWellness(status);
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    good: {
      label: lang === "ne" ? "राम्रो / ऊर्जावान्" : "Feeling Good",
      icon: <Smile className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900",
    },
    normal: {
      label: lang === "ne" ? "सामान्य / ठीकै" : "Normal / Stable",
      icon: <Meh className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900",
    },
    unwell: {
      label: lang === "ne" ? "असहज / दुखाइ" : "Tired / Unwell",
      icon: <Frown className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900",
    },
  };

  return (
    <Card className="border-mint-200 p-4 sm:p-5 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-forest-900">
            {lang === "ne" ? "आज तपाईंको स्वास्थ्य अवस्था कस्तो छ?" : "Daily Wellness Check-in"}
          </h3>
          <p className="text-xs text-forest-600">
            {lang === "ne"
              ? "एक क्लिकमा आफ्नो स्वास्थ्य अवस्था जनाउनुहोस्, परिवारलाई जानकारी हुनेछ।"
              : "Let your caregiver know how you are feeling today with a single tap."}
          </p>
        </div>

        {currentWellness && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {lang === "ne" ? "दर्ता भयो:" : "Reported:"} {statusConfig[currentWellness.status]?.label}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {(["good", "normal", "unwell"] as WellnessStatus[]).map((status) => {
          const item = statusConfig[status];
          const isSelected = currentWellness?.status === status;

          return (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              disabled={submitting}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all min-h-[64px] active:scale-95 ${
                item.bg
              } ${isSelected ? "ring-2 ring-forest-700 font-extrabold shadow-sm" : ""}`}
            >
              {item.icon}
              <span className="text-xs font-bold mt-1 leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
