export type BmiCategory =
  | "bmiCategoryNormal"
  | "bmiCategoryUnderweight"
  | "bmiCategoryOverweight"
  | "bmiCategoryObese";

export type BpCategory =
  | "bpNormal"
  | "bpElevated"
  | "bpStage1"
  | "bpStage2"
  | "bpCrisis";

export function calculateBmi(
  weightKg: number,
  heightCm: number,
): { value: number; categoryKey: BmiCategory } {
  if (heightCm <= 0 || weightKg <= 0) return { value: 0, categoryKey: "bmiCategoryNormal" };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  if (bmi < 18.5) return { value: bmi, categoryKey: "bmiCategoryUnderweight" };
  if (bmi < 25) return { value: bmi, categoryKey: "bmiCategoryNormal" };
  if (bmi < 30) return { value: bmi, categoryKey: "bmiCategoryOverweight" };
  return { value: bmi, categoryKey: "bmiCategoryObese" };
}

export function classifyBloodPressure(
  systolic: number,
  diastolic: number,
): { key: BpCategory; colorClass: string } {
  if (systolic >= 180 || diastolic >= 120) {
    return { key: "bpCrisis", colorClass: "text-red-700 bg-red-100 dark:bg-red-950/80 dark:text-red-300" };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { key: "bpStage2", colorClass: "text-orange-700 bg-orange-100 dark:bg-orange-950/80 dark:text-orange-300" };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return { key: "bpStage1", colorClass: "text-amber-700 bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300" };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return { key: "bpElevated", colorClass: "text-blue-700 bg-blue-100 dark:bg-blue-950/80 dark:text-blue-300" };
  }
  return { key: "bpNormal", colorClass: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300" };
}
