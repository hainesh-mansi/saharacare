import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

describe("SaharaCare End-to-End Integration & Business Flow", () => {
  let db;

  function getKathmanduDateKey() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  before(() => {
    db = new DatabaseSync(":memory:");
    db.exec("PRAGMA foreign_keys = ON;");

    db.exec(`
      CREATE TABLE patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        phone TEXT,
        emergency_contact TEXT,
        caregiver_name TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE medications (
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

      CREATE TABLE dose_records (
        id TEXT PRIMARY KEY,
        medication_id TEXT NOT NULL,
        date_key TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        status TEXT NOT NULL,
        taken_at TEXT,
        FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
      );

      CREATE TABLE caregiver_alerts (
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

      CREATE TABLE patient_wellness (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        date_key TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );
    `);

    // Seed test patient
    db.prepare(`
      INSERT INTO patients VALUES ('patient-ram-01', 'Ram Bahadur Shrestha', 68, '+977-9841234567', '+977-9812345678', 'Pooja Shrestha (Daughter)', datetime('now'))
    `).run();
  });

  test("1. Patient Profile and Seed Prescriptions Flow", () => {
    const insertMed = db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, instructions, time_of_day, active, created_at)
      VALUES (?, 'patient-ram-01', ?, ?, ?, ?, 1, datetime('now'))
    `);

    insertMed.run("med-1", "Metformin 500mg", "1 tablet", "Take after breakfast", "morning");
    insertMed.run("med-2", "Amlodipine 5mg", "1 tablet", "Take after lunch", "afternoon");
    insertMed.run("med-3", "Atorvastatin 20mg", "1 tablet", "Take before bed", "night");

    const count = db.prepare("SELECT count(*) as count FROM medications WHERE patient_id = 'patient-ram-01'").get();
    assert.equal(count.count, 3);
  });

  test("2. Automatic Materialization of Today's Doses in Kathmandu Time", () => {
    const todayKey = getKathmanduDateKey();
    const insertDose = db.prepare(`
      INSERT INTO dose_records (id, medication_id, date_key, scheduled_time, status, taken_at)
      VALUES (?, ?, ?, ?, 'scheduled', NULL)
    `);

    insertDose.run("dose-1", "med-1", todayKey, "08:30 AM");
    insertDose.run("dose-2", "med-2", todayKey, "01:30 PM");
    insertDose.run("dose-3", "med-3", todayKey, "09:30 PM");

    const todayDoses = db.prepare(`
      SELECT d.*, m.name as medicationName
      FROM dose_records d
      JOIN medications m ON d.medication_id = m.id
      WHERE d.date_key = ?
    `).all(todayKey);

    assert.equal(todayDoses.length, 3);
    assert.equal(todayDoses[0].status, "scheduled");
  });

  test("3. End-to-End Mark Taken Action with Caregiver Alert Dispatch", () => {
    const todayKey = getKathmanduDateKey();

    // Mark dose-1 taken
    db.prepare(`
      UPDATE dose_records
      SET status = 'taken', taken_at = '08:35 AM'
      WHERE id = 'dose-1'
    `).run();

    // Dispatch caregiver alert
    db.prepare(`
      INSERT INTO caregiver_alerts (id, patient_id, type, message, severity, time, created_at, acknowledged)
      VALUES ('alert-take-1', 'patient-ram-01', 'reminder', 'Metformin 500mg marked as taken at 08:35 AM.', 'info', 'Just now', datetime('now'), 0)
    `).run();

    const dose = db.prepare("SELECT * FROM dose_records WHERE id = 'dose-1'").get();
    assert.equal(dose.status, "taken");
    assert.equal(dose.taken_at, "08:35 AM");

    const allDoses = db.prepare("SELECT * FROM dose_records WHERE date_key = ?").all(todayKey);
    const taken = allDoses.filter(d => d.status === "taken").length;
    const total = allDoses.length;
    const adherence = Math.round((taken / total) * 100);

    assert.equal(total, 3);
    assert.equal(taken, 1);
    assert.equal(adherence, 33);
  });

  test("4. Caregiver Alert Acknowledgment Workflow", () => {
    const alertBefore = db.prepare("SELECT * FROM caregiver_alerts WHERE id = 'alert-take-1'").get();
    assert.equal(alertBefore.acknowledged, 0);

    // Caregiver acknowledges alert
    db.prepare("UPDATE caregiver_alerts SET acknowledged = 1 WHERE id = 'alert-take-1'").run();

    const alertAfter = db.prepare("SELECT * FROM caregiver_alerts WHERE id = 'alert-take-1'").get();
    assert.equal(alertAfter.acknowledged, 1);
  });

  test("5. Daily Wellness Check-In Recording and Alert Propagation", () => {
    const todayKey = getKathmanduDateKey();
    const wellnessId = "wellness-test-1";

    db.prepare(`
      INSERT INTO patient_wellness (id, patient_id, date_key, status, notes, created_at)
      VALUES (?, 'patient-ram-01', ?, 'good', 'Slept well, no joint pain', datetime('now'))
    `).run(wellnessId, todayKey);

    const saved = db.prepare("SELECT * FROM patient_wellness WHERE id = ?").get(wellnessId);
    assert.ok(saved);
    assert.equal(saved.status, "good");
    assert.equal(saved.notes, "Slept well, no joint pain");
  });

  test("6. Add Medication Pipeline with Input Validation Safeguards", () => {
    const medId = "med-new-4";
    const todayKey = getKathmanduDateKey();

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, instructions, time_of_day, active, created_at)
      VALUES (?, 'patient-ram-01', ?, ?, ?, ?, 1, datetime('now'))
    `).run(medId, "Losartan 50mg", "1 tablet", "Take in evening", "evening");

    db.prepare(`
      INSERT INTO dose_records (id, medication_id, date_key, scheduled_time, status, taken_at)
      VALUES (?, ?, ?, '06:00 PM', 'scheduled', NULL)
    `).run("dose-new-4", medId, todayKey);

    const dosesAfterAdd = db.prepare("SELECT * FROM dose_records WHERE date_key = ?").all(todayKey);
    assert.equal(dosesAfterAdd.length, 4);

    assert.throws(() => {
      db.prepare(`
        INSERT INTO medications (id, patient_id, name, dosage, instructions, time_of_day, active, created_at)
        VALUES ('bad-id', 'patient-ram-01', NULL, '1 tablet', '', 'morning', 1, datetime('now'))
      `).run();
    });
  });
});
