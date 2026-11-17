import { NextResponse } from "next/server";
import { caregiverService } from "@/lib/services/caregiverService";

export async function GET() {
  try {
    const data = caregiverService.getOverview();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch caregiver overview." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.alertId || typeof body.alertId !== "string") {
      return NextResponse.json(
        { success: false, error: "Alert ID is required." },
        { status: 400 }
      );
    }

    caregiverService.acknowledgeAlert(body.alertId);
    return NextResponse.json({ success: true, alertId: body.alertId, acknowledged: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to acknowledge alert." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.status || !["good", "normal", "unwell"].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Valid wellness status (good, normal, unwell) is required." },
        { status: 400 }
      );
    }

    const wellness = caregiverService.recordWellness(
      body.patientId || "patient-ram-01",
      body.status,
      body.notes || ""
    );

    return NextResponse.json({ success: true, wellness }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record wellness check-in." },
      { status: 500 }
    );
  }
}
