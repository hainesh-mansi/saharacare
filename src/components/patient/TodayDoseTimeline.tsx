import React, { useState } from "react";
import { TodayDose, Language, TimeOfDay } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Clock, CheckCircle2, Pill, Sun, Sunrise, Sunset, Moon, Search, X } from "lucide-react";

interface TodayDoseTimelineProps {
  doses: TodayDose[];
  onMarkTaken: (doseId: string) => void;
  lang: Language;
  searchFilter?: string;
  onClearSearch?: () => void;
}

export const TodayDoseTimeline: React.FC<TodayDoseTimelineProps> = ({
  doses,
  onMarkTaken,
  lang,
  searchFilter = "",
  onClearSearch,
}) => {
  const t = lang === "ne" ? ne : en;
  const [internalFilter, setInternalFilter] = useState("");

  const activeQuery = (searchFilter || internalFilter).toLowerCase().trim();

  const filteredDoses = doses.filter((d) => {
    if (!activeQuery) return true;
    return (
      d.medicationName.toLowerCase().includes(activeQuery) ||
      d.dosage.toLowerCase().includes(activeQuery) ||
      d.instructions.toLowerCase().includes(activeQuery) ||
      d.timeOfDay.toLowerCase().includes(activeQuery)
    );
  });

  const timeGroups: { key: TimeOfDay; label: string; icon: React.ReactNode }[] = [
    { key: "morning", label: t.morning, icon: <Sunrise className="w-5 h-5 text-amber-500" /> },
    { key: "afternoon", label: t.afternoon, icon: <Sun className="w-5 h-5 text-orange-500" /> },
    { key: "evening", label: t.evening, icon: <Sunset className="w-5 h-5 text-indigo-500" /> },
    { key: "night", label: t.night, icon: <Moon className="w-5 h-5 text-slate-600" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Quick Filter Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-forest-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchFilter || internalFilter}
          onChange={(e) => setInternalFilter(e.target.value)}
          placeholder={lang === "ne" ? "औषधिको नाम वा समय खोज्नुहोस्..." : "Search medication name or timing..."}
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-mint-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
        />
        {(searchFilter || internalFilter) && (
          <button
            onClick={() => {
              setInternalFilter("");
              if (onClearSearch) onClearSearch();
            }}
            className="absolute right-2.5 p-1 text-forest-500 hover:text-forest-900"
            title="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {activeQuery && (
        <div className="flex items-center justify-between text-xs text-forest-700 bg-mint-100/60 px-3 py-1.5 rounded-lg border border-mint-200">
          <span>
            {lang === "ne" ? "खोजिएको नतिजा:" : "Filtered results for:"} <strong>"{activeQuery}"</strong> ({filteredDoses.length} {filteredDoses.length === 1 ? "dose" : "doses"})
          </span>
          <button
            onClick={() => {
              setInternalFilter("");
              if (onClearSearch) onClearSearch();
            }}
            className="underline font-bold text-forest-900"
          >
            Clear
          </button>
        </div>
      )}

      {filteredDoses.length === 0 ? (
        <Card className="text-center py-10 bg-mint-50/50">
          <Pill className="w-12 h-12 text-forest-400 mx-auto mb-3 opacity-60" />
          <p className="text-base font-semibold text-forest-900">
            {activeQuery ? "No matching medications found." : t.noDosesToday}
          </p>
          {activeQuery && (
            <button
              onClick={() => {
                setInternalFilter("");
                if (onClearSearch) onClearSearch();
              }}
              className="mt-2 text-xs font-bold text-forest-700 underline"
            >
              Reset filter
            </button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {timeGroups.map((group) => {
            const groupDoses = filteredDoses.filter((d) => d.timeOfDay === group.key);
            if (groupDoses.length === 0) return null;

            return (
              <div key={group.key} className="space-y-3">
                {/* Time Category Header */}
                <div className="flex items-center space-x-2 px-1">
                  {group.icon}
                  <h2 className="text-base font-bold text-forest-900">{group.label}</h2>
                  <span className="text-xs font-medium text-forest-600 bg-mint-100 px-2 py-0.5 rounded-full border border-mint-200">
                    {groupDoses.length} {groupDoses.length === 1 ? "dose" : "doses"}
                  </span>
                </div>

                {/* Dose Cards */}
                <div className="grid gap-3 sm:grid-cols-1">
                  {groupDoses.map((dose) => {
                    const isTaken = dose.status === "taken";

                    return (
                      <Card
                        key={dose.id}
                        className={`transition-all duration-200 ${
                          isTaken
                            ? "bg-emerald-50/40 border-emerald-200"
                            : "border-mint-200 hover:border-mint-300 shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Left: Info */}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-forest-900 leading-snug">
                                {dose.medicationName}
                              </h3>
                              <StatusBadge status={dose.status} lang={lang} />
                            </div>
                            <p className="text-sm font-medium text-forest-800">
                              {dose.dosage}
                            </p>
                            {dose.instructions && (
                              <p className="text-xs text-forest-600 italic">
                                “{dose.instructions}”
                              </p>
                            )}
                            <div className="flex items-center space-x-2 text-xs text-forest-500 pt-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Scheduled: {dose.scheduledTime}</span>
                              {dose.takenAt && (
                                <span className="text-emerald-700 font-medium">
                                  · Taken at {dose.takenAt}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Action Button */}
                          <div>
                            {isTaken ? (
                              <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-sm border border-emerald-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{t.taken}</span>
                              </div>
                            ) : (
                              <Button
                                variant="primary"
                                size="md"
                                onClick={() => onMarkTaken(dose.id)}
                                className="w-full sm:w-auto font-semibold"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                {t.markTaken}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
