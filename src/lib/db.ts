import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "saharacare.db");
  const db = new DatabaseSync(dbPath);

  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  // Bootstrap schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      phone TEXT,
      emergency_contact TEXT,
      caregiver_name TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      instructions TEXT,
      time_of_day TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dose_records (
      id TEXT PRIMARY KEY,
      medication_id TEXT NOT NULL,
      date_key TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      status TEXT NOT NULL,
      taken_at TEXT,
      FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS caregiver_alerts (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      acknowledged INTEGER DEFAULT 0,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS patient_wellness (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      date_key TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );
  `);

  try {
    db.exec("ALTER TABLE caregiver_alerts ADD COLUMN acknowledged INTEGER DEFAULT 0;");
  } catch {
    // Column already exists
  }

  // Seed synthetic initial data if empty
  const patientCount = db.prepare("SELECT count(*) as count FROM patients").get() as { count: number };
  if (patientCount.count === 0) {
    seedDatabase(db);
  }

  dbInstance = db;
  return dbInstance;
}

function seedDatabase(db: DatabaseSync) {
  const now = new Date().toISOString();
  const todayKey = getKathmanduDateKey();

  // 1. Seed Patient
  db.prepare(`
    INSERT INTO patients (id, name, age, phone, emergency_contact, caregiver_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    "patient-ram-01",
    "Ram Bahadur Shrestha",
    68,
    "+977-9841234567",
    "+977-9812345678",
    "Pooja Shrestha (Daughter)",
    now
  );

  // 2. Seed Medications
  const insertMed = db.prepare(`
    INSERT INTO medications (id, patient_id, name, dosage, instructions, time_of_day, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
  `);

  insertMed.run("med-1", "patient-ram-01", "Metformin 500mg", "1 tablet", "Take after breakfast with water", "morning", now);
  insertMed.run("med-2", "patient-ram-01", "Amlodipine 5mg", "1 tablet", "Blood pressure control, take after lunch", "afternoon", now);
  insertMed.run("med-3", "patient-ram-01", "Atorvastatin 20mg", "1 tablet", "Take before sleeping at night", "night", now);

  // 3. Seed Today's Doses
  const insertDose = db.prepare(`
    INSERT INTO dose_records (id, medication_id, date_key, scheduled_time, status, taken_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertDose.run("dose-1", "med-1", todayKey, "08:30 AM", "taken", "08:35 AM");
  insertDose.run("dose-2", "med-2", todayKey, "01:30 PM", "scheduled", null);
  insertDose.run("dose-3", "med-3", todayKey, "09:30 PM", "scheduled", null);

  // 4. Seed Alerts
  const insertAlert = db.prepare(`
    INSERT INTO caregiver_alerts (id, patient_id, type, message, severity, time, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertAlert.run("alert-1", "patient-ram-01", "late_take", "Amlodipine 5mg was taken 25 minutes past scheduled time yesterday.", "warning", "Yesterday, 01:55 PM", now);
  insertAlert.run("alert-2", "patient-ram-01", "reminder", "Morning Metformin was confirmed taken on time.", "info", "Today, 08:35 AM", now);
}

export function getKathmanduDateKey(): string {
  // Format as YYYY-MM-DD in Asia/Kathmandu
  const d = new Date();
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
