"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserRole, Language, TodayDose, Medication, TimeOfDay, AdherenceSummary, CaregiverAlert, PatientProfile, WellnessStatus } from "@/types";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import { api } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { PatientHeaderCard } from "@/components/patient/PatientHeaderCard";
import { PatientWellnessCard } from "@/components/patient/PatientWellnessCard";
import { AudioAssistantCard } from "@/components/audio/AudioAssistantCard";
import { TodayDoseTimeline } from "@/components/patient/TodayDoseTimeline";
import { MedicationList } from "@/components/patient/MedicationList";
import { MedicationForm } from "@/components/patient/MedicationForm";
import { CaregiverDashboard } from "@/components/caregiver/CaregiverDashboard";
import { EmergencyModal } from "@/components/emergency/EmergencyModal";
import { FontSize } from "@/components/accessibility/FontSizeControl";
import { CalendarDays, Pill, Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

const defaultPatient: PatientProfile = {
  id: "patient-ram-01",
  name: "Ram Bahadur Shrestha",
  age: 68,
  phone: "+977-9841234567",
  emergencyContact: "+977-9812345678",
  caregiverName: "Pooja Shrestha (Daughter)",
  todayWellness: null,
};

const defaultAdherence: AdherenceSummary = {
  percentage: 0,
  totalScheduled: 0,
  taken: 0,
  missed: 0,
  pending: 0,
};

export default function SaharaCareApp() {
  const [role, setRole] = useState<UserRole>("patient");
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<"schedule" | "medicines">("schedule");
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [searchQuery, setSearchQuery] = useState("");

  // Live Backend State
  const [patient, setPatient] = useState<PatientProfile>(defaultPatient);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doses, setDoses] = useState<TodayDose[]>([]);
  const [adherence, setAdherence] = useState<AdherenceSummary>(defaultAdherence);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);

  // Async States
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const t = lang === "ne" ? ne : en;

  // Load all initial data from backend API routes
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [dosesRes, medsRes, caregiverRes] = await Promise.all([
        api.getDoses(),
        api.getMedications(),
        api.getCaregiverOverview(),
      ]);

      if (dosesRes.success) {
        setDoses(dosesRes.doses);
        setAdherence(dosesRes.adherence);
      }
      if (medsRes.success) {
        setMedications(medsRes.medications);
      }
      if (caregiverRes.success) {
        setPatient(caregiverRes.patient);
        setAlerts(caregiverRes.alerts);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to SaharaCare server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mark Dose Taken via Real API
  const handleMarkTaken = async (doseId: string) => {
    try {
      const res = await api.markDoseTaken(doseId);
      if (res.success) {
        setDoses((prev) =>
          prev.map((d) => (d.id === doseId ? res.dose : d))
        );
        setAdherence(res.adherence);

        setFeedbackMessage(`Confirmed: ${res.dose.medicationName} marked as taken.`);
        setTimeout(() => setFeedbackMessage(null), 3500);

        const caregiverRes = await api.getCaregiverOverview();
        if (caregiverRes.success) {
          setAlerts(caregiverRes.alerts);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to record dose.");
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  // Add Medication via Real API
  const handleSaveMedication = async (newMedData: {
    name: string;
    dosage: string;
    instructions: string;
    timeOfDay: TimeOfDay;
  }) => {
    try {
      const res = await api.createMedication(newMedData);
      if (res.success) {
        setMedications((prev) => [res.medication, ...prev]);

        const dosesRes = await api.getDoses();
        if (dosesRes.success) {
          setDoses(dosesRes.doses);
          setAdherence(dosesRes.adherence);
        }

        setFeedbackMessage(`Saved: ${res.medication.name} added to your prescriptions.`);
        setTimeout(() => setFeedbackMessage(null), 3500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create medication.");
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  // Daily Wellness Check-In Action
  const handleRecordWellness = async (status: WellnessStatus) => {
    try {
      const res = await api.recordWellness(status);
      if (res.success) {
        setPatient((prev) => ({
          ...prev,
          todayWellness: res.wellness,
        }));
        setFeedbackMessage("Thank you! Your wellness status was shared with your caregiver.");
        setTimeout(() => setFeedbackMessage(null), 3500);

        const caregiverRes = await api.getCaregiverOverview();
        if (caregiverRes.success) {
          setAlerts(caregiverRes.alerts);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to record wellness.");
    }
  };

  // Acknowledge Caregiver Alert Action
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const res = await api.acknowledgeAlert(alertId);
      if (res.success) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to acknowledge alert.");
    }
  };

  const fontSizeClass = {
    normal: "",
    large: "text-lg [&_h1]:text-2xl [&_h2]:text-2xl [&_h3]:text-xl [&_p]:text-base [&_span]:text-sm",
    "extra-large": "text-xl [&_h1]:text-3xl [&_h2]:text-3xl [&_h3]:text-2xl [&_p]:text-lg [&_span]:text-base",
  }[fontSize];

  return (
    <div className={`min-h-screen bg-mint-50 flex flex-col pb-20 sm:pb-8 ${fontSizeClass}`}>
      {/* Top Header */}
      <Header
        role={role}
        onRoleChange={setRole}
        lang={lang}
        onLanguageToggle={() => setLang((prev) => (prev === "en" ? "ne" : "en"))}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Error Notice */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-sm flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Success / Feedback Notice */}
        {feedbackMessage && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-mint-200">
            <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
            <p className="text-sm font-bold text-forest-900">Connecting to SaharaCare server...</p>
            <p className="text-xs text-forest-600">Retrieving medications and today's schedule</p>
          </div>
        ) : (
          <>
            {/* Patient View */}
            {role === "patient" && (
              <div className="space-y-5">
                {/* Patient Header Progress Card */}
                <PatientHeaderCard adherence={adherence} lang={lang} />

                {/* Daily Wellness Check-In Card */}
                <PatientWellnessCard
                  currentWellness={patient.todayWellness}
                  onRecordWellness={handleRecordWellness}
                  lang={lang}
                />

                {/* Audio-Assisted Accessibility Subsystem */}
                <AudioAssistantCard
                  doses={doses}
                  adherence={adherence}
                  lang={lang}
                  onVoiceSearch={(query) => {
                    setSearchQuery(query);
                    setFeedbackMessage(`Voice search applied: "${query}"`);
                    setTimeout(() => setFeedbackMessage(null), 3500);
                  }}
                />

                {/* Tab Navigation */}
                <div className="flex items-center justify-between border-b border-mint-200 pb-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab("schedule")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "schedule"
                          ? "bg-forest-900 text-white shadow-sm"
                          : "bg-white text-forest-800 border border-mint-200 hover:bg-mint-100"
                      }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>{t.todaySchedule}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("medicines")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "medicines"
                          ? "bg-forest-900 text-white shadow-sm"
                          : "bg-white text-forest-800 border border-mint-200 hover:bg-mint-100"
                      }`}
                    >
                      <Pill className="w-4 h-4" />
                      <span>{t.myMedicines}</span>
                    </button>
                  </div>

                  {activeTab === "schedule" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAddMedOpen(true)}
                      className="hidden sm:inline-flex"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      <span>{t.addMedication}</span>
                    </Button>
                  )}
                </div>

                {/* Tab Contents */}
                {activeTab === "schedule" ? (
                  <TodayDoseTimeline
                    doses={doses}
                    onMarkTaken={handleMarkTaken}
                    lang={lang}
                    searchFilter={searchQuery}
                    onClearSearch={() => setSearchQuery("")}
                  />
                ) : (
                  <MedicationList
                    medications={medications}
                    onOpenAddModal={() => setIsAddMedOpen(true)}
                    lang={lang}
                  />
                )}
              </div>
            )}

            {/* Caregiver View */}
            {role === "caregiver" && (
              <CaregiverDashboard
                patient={patient}
                adherence={adherence}
                alerts={alerts}
                lang={lang}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        role={role}
        onRoleChange={setRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        lang={lang}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        lang={lang}
      />

      {/* Add Medication Modal */}
      <MedicationForm
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        onSave={handleSaveMedication}
        lang={lang}
      />
    </div>
  );
}
