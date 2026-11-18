import { EmergencyHealthCard } from "@/components/emergency/EmergencyHealthCard";
import { AmbulanceDirectory } from "@/components/emergency/AmbulanceDirectory";

export default async function PublicEmergencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <EmergencyHealthCard
          profile={{
            id: id || "DEMO-EMG-2026",
            patientName: "Maya Sharma",
            bloodGroup: "O+",
            allergies: ["Penicillin", "NSAIDs / Ibuprofen"],
            chronicConditions: ["Hypertension", "Type 2 Diabetes"],
            emergencyContacts: [
              { name: "Suresh Sharma", relation: "Spouse", phone: "+977 9841234567" },
              { name: "Pooja Sharma", relation: "Daughter (Caregiver)", phone: "+977 9851987654" },
            ],
            primaryCaregiverPhone: "+977 9851987654",
          }}
          isPublicResponder={true}
        />
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <AmbulanceDirectory />
        </div>
      </div>
    </main>
  );
}
