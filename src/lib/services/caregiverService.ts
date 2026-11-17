import { getDatabase, getKathmanduDateKey } from "../db";
import { doseService } from "./doseService";
import { PatientProfile, CaregiverAlert, AdherenceSummary, WellnessStatus, PatientWellness } from "@/types";

export const caregiverService = {
  getOverview(patientId: string = "patient-ram-01"): {
    patient: PatientProfile;
    adherence: AdherenceSummary;
    alerts: CaregiverAlert[];
  } {
    const db = getDatabase();
    const todayKey = getKathmanduDateKey();

    const patientRow = db
      .prepare(`
        SELECT id, name, age, phone, emergency_contact as emergencyContact, caregiver_name as caregiverName
        FROM patients
        WHERE id = ?
      `)
      .get(patientId) as any;

    // Check today's wellness checkin
    const wellnessRow = db
      .prepare(`
        SELECT status, notes, created_at as recordedAt
        FROM patient_wellness
        WHERE patient_id = ? AND date_key = ?
        ORDER BY created_at DESC
        LIMIT 1
      `)
      .get(patientId, todayKey) as any;

    const todayWellness: PatientWellness | null = wellnessRow
      ? {
          status: wellnessRow.status as WellnessStatus,
          notes: wellnessRow.notes || "",
          recordedAt: wellnessRow.recordedAt,
        }
      : null;

    const patient: PatientProfile = patientRow
      ? {
          id: patientRow.id,
          name: patientRow.name,
          age: patientRow.age,
          phone: patientRow.phone,
          emergencyContact: patientRow.emergencyContact,
          caregiverName: patientRow.caregiverName,
          todayWellness,
        }
      : {
          id: patientId,
          name: "Ram Bahadur Shrestha",
          age: 68,
          phone: "+977-9841234567",
          emergencyContact: "+977-9812345678",
          caregiverName: "Pooja Shrestha (Daughter)",
          todayWellness,
        };

    const adherence = doseService.getAdherenceSummary(patientId);

    const alertRows = db
      .prepare(`
        SELECT 
          a.id,
          p.name as patientName,
          a.type,
          a.message,
          a.severity,
          a.time,
          COALESCE(a.acknowledged, 0) as acknowledged
        FROM caregiver_alerts a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.patient_id = ?
        ORDER BY a.created_at DESC
        LIMIT 15
      `)
      .all(patientId) as any[];

    const alerts: CaregiverAlert[] = alertRows.map((r) => ({
      id: r.id,
      patientName: r.patientName,
      type: r.type,
      message: r.message,
      severity: r.severity,
      time: r.time,
      acknowledged: Boolean(r.acknowledged),
    }));

    return {
      patient,
      adherence,
      alerts,
    };
  },

  acknowledgeAlert(alertId: string): boolean {
    const db = getDatabase();
    db.prepare(`
      UPDATE caregiver_alerts
      SET acknowledged = 1
      WHERE id = ?
    `).run(alertId);
    return true;
  },

  recordWellness(patientId: string = "patient-ram-01", status: WellnessStatus, notes: string = ""): PatientWellness {
    const db = getDatabase();
    const todayKey = getKathmanduDateKey();
    const id = `wellness-${Date.now()}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    db.prepare(`
      INSERT INTO patient_wellness (id, patient_id, date_key, status, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, patientId, todayKey, status, notes, now.toISOString());

    // Also dispatch caregiver alert
    const statusLabels = {
      good: "Feeling Good / Energetic",
      normal: "Normal / Stable",
      unwell: "Feeling Unwell / Needs Attention",
    };

    const severityMap: Record<WellnessStatus, "info" | "warning" | "urgent"> = {
      good: "info",
      normal: "info",
      unwell: "urgent",
    };

    const alertId = `alert-${Date.now()}`;
    db.prepare(`
      INSERT INTO caregiver_alerts (id, patient_id, type, message, severity, time, created_at, acknowledged)
      VALUES (?, ?, 'wellness_checkin', ?, ?, 'Just now', ?, 0)
    `).run(
      alertId,
      patientId,
      `Daily Check-in: Ram Bahadur reported ${statusLabels[status]}${notes ? ` ("${notes}")` : ""} at ${timeString}.`,
      severityMap[status],
      now.toISOString()
    );

    return {
      status,
      notes,
      recordedAt: timeString,
    };
  },
};
