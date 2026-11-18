import { Activity, Bell, Bot, CalendarClock, CalendarDays, FileHeart, HeartPulse, Home, LayoutDashboard, Pill, Settings, ShieldCheck, Sparkles, Store, UserRound } from "lucide-react";

export const patientNavigation = [
  { href: "/patient", label: "dashboard" as const, icon: Home },
  { href: "/patient/medicines", label: "medicines" as const, icon: Pill },
  { href: "/patient/medical-information", label: "medicalInfo" as const, icon: FileHeart },
  { href: "/patient/appointments", label: "appointments" as const, icon: CalendarDays },
  { href: "/patient/assistant", label: "assistant" as const, icon: Bot },
  { href: "/patient/profile", label: "profile" as const, icon: UserRound },
];

export const ecosystemNavigation = [
  { href: "/patient/vitals", label: "vitals" as const, icon: Activity },
  { href: "/patient/insurance", label: "insurance" as const, icon: ShieldCheck },
  { href: "/patient/pharmacies", label: "pharmacies" as const, icon: Store },
  { href: "/patient/innovations", label: "innovations" as const, icon: Sparkles },
];

export const patientNavigationSections = [
  { label: "dailyCare" as const, items: patientNavigation.slice(0, 3) },
  { label: "healthAndSupport" as const, items: patientNavigation.slice(3) },
  { label: "ecosystemServices" as const, items: ecosystemNavigation },
];

export const caregiverNavigation = [
  { href: "/caregiver", label: "patientOverview" as const, icon: Home },
  { href: "/caregiver/assistant", label: "assistant" as const, icon: Bot },
  { href: "/caregiver/notifications", label: "notifications" as const, icon: Bell },
  { href: "/settings", label: "settings" as const, icon: Settings },
];

export const doctorNavigation = [
  { href: "/doctor", label: "appointments" as const, icon: CalendarDays },
  { href: "/doctor/availability", label: "availability" as const, icon: CalendarClock },
  { href: "/settings", label: "settings" as const, icon: Settings },
];

export const patientMobileNavigation = [
  patientNavigation[0],
  patientNavigation[1],
  patientNavigation[3],
  patientNavigation[2],
  patientNavigation[5],
];

export const adminNavigation = [
  { href: "/admin", label: "adminOverview" as const, icon: LayoutDashboard },
  { href: "/settings", label: "settings" as const, icon: Settings },
];

export const brandIcon = HeartPulse;
