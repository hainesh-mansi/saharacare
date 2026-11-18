import assert from "node:assert/strict";
import test from "node:test";

import { calculateBmi, classifyBloodPressure } from "../lib/vitals";
import { costEstimates, nepalAmbulanceServices, verifiedPharmacies, commonMedicines } from "../lib/ecosystem-data";

test("calculateBmi computes correct BMI value and categories", () => {
  // Normal weight: 60 kg at 165 cm -> BMI 22.0
  const normal = calculateBmi(60, 165);
  assert.equal(normal.value, 22.0);
  assert.equal(normal.categoryKey, "bmiCategoryNormal");

  // Underweight: 45 kg at 165 cm -> BMI 16.5
  const under = calculateBmi(45, 165);
  assert.equal(under.value, 16.5);
  assert.equal(under.categoryKey, "bmiCategoryUnderweight");

  // Overweight: 75 kg at 165 cm -> BMI 27.5
  const over = calculateBmi(75, 165);
  assert.equal(over.value, 27.5);
  assert.equal(over.categoryKey, "bmiCategoryOverweight");

  // Obese: 95 kg at 165 cm -> BMI 34.9
  const obese = calculateBmi(95, 165);
  assert.equal(obese.value, 34.9);
  assert.equal(obese.categoryKey, "bmiCategoryObese");

  // Zero / negative boundary
  assert.equal(calculateBmi(0, 0).value, 0);
});

test("classifyBloodPressure accurately tags clinical AHA/NMC stages", () => {
  // Normal: <120 and <80
  assert.equal(classifyBloodPressure(115, 75).key, "bpNormal");

  // Elevated: 120-129 and <80
  assert.equal(classifyBloodPressure(125, 78).key, "bpElevated");

  // Stage 1: 130-139 or 80-89
  assert.equal(classifyBloodPressure(135, 85).key, "bpStage1");

  // Stage 2: >=140 or >=90
  assert.equal(classifyBloodPressure(145, 92).key, "bpStage2");

  // Crisis: >=180 or >=120
  assert.equal(classifyBloodPressure(185, 110).key, "bpCrisis");
  assert.equal(classifyBloodPressure(130, 125).key, "bpCrisis");
});

test("ambulance directory contains national 102 and Kathmandu valley services", () => {
  const national102 = nepalAmbulanceServices.find((s) => s.phone === "102");
  assert.ok(national102);
  assert.equal(national102.is24x7, true);

  const apf = nepalAmbulanceServices.find((s) => s.phone === "1114");
  assert.ok(apf);
});

test("pharmacy marketplace lists 24/7 pharmacies and generic price data", () => {
  const has24x7 = verifiedPharmacies.some((ph) => ph.is24x7);
  assert.equal(has24x7, true);

  const paracetamol = commonMedicines.find((m) => m.genericName.includes("Paracetamol"));
  assert.ok(paracetamol);
  assert.match(paracetamol.brandNames, /Cetmol/);
});

test("cost estimator features HIB government insurance coverage", () => {
  assert.ok(costEstimates.length >= 5);
  const coveredCount = costEstimates.filter((c) => c.hibCovered).length;
  assert.ok(coveredCount >= 4);
});
