export type SectorType = 'non-oil-private' | 'oil-or-state' | 'it-park' | 'private' | 'state' | string;

export interface SalaryBreakdown {
  grossSalary: number;
  netSalary: number;
  incomeTax: number;
  dsmfEmployee: number;
  dsmfEmployer: number;
  itsEmployee: number;
  itsEmployer: number;
  unemploymentEmployee: number;
  unemploymentEmployer: number;
  totalEmployeeDeductions: number;
  totalEmployerCost: number;
  totalTaxesAndContributions: number;
}

export interface SalaryCalculationResult {
  gross: number;
  net: number;
  breakdown: SalaryBreakdown;
  sector: SectorType;
  totalEmployerCost?: number;
  totalEmployeeDeductions?: number;
  incomeTax?: number;
  dsmf?: number;
  healthInsurance?: number;
  unemployment?: number;
  employerDsmf?: number;
  employerHealthInsurance?: number;
  employerUnemployment?: number;
  [key: string]: any;
}

export function calculateFromGross(gross: number, rawSector: SectorType = 'non-oil-private'): SalaryCalculationResult {
  const safeGross = Math.max(0, gross);
  const sector: SectorType =
    rawSector === 'private' ? 'non-oil-private' : rawSector === 'state' ? 'oil-or-state' : rawSector;

  let incomeTax = 0;
  let dsmfEmployee = 0;
  let dsmfEmployer = 0;
  let itsEmployee = 0;
  let itsEmployer = 0;
  let unemploymentEmployee = 0;
  let unemploymentEmployer = 0;

  if (sector === 'non-oil-private') {
    // Income tax (Gəlir vergisi): 0% up to 8,000 AZN, 14% over 8,000 AZN
    if (safeGross > 8000) {
      incomeTax = (safeGross - 8000) * 0.14;
    }

    // DSMF (Sosial sığorta)
    if (safeGross <= 200) {
      dsmfEmployee = safeGross * 0.03;
      dsmfEmployer = safeGross * 0.22;
    } else {
      dsmfEmployee = 6 + (safeGross - 200) * 0.10;
      dsmfEmployer = 44 + (safeGross - 200) * 0.15;
    }

    // İTS (İcbari tibbi sığorta)
    if (safeGross <= 8000) {
      itsEmployee = safeGross * 0.02;
      itsEmployer = safeGross * 0.02;
    } else {
      itsEmployee = 160 + (safeGross - 8000) * 0.005;
      itsEmployer = 160 + (safeGross - 8000) * 0.005;
    }

    // İşsizlik
    unemploymentEmployee = safeGross * 0.005;
    unemploymentEmployer = safeGross * 0.005;
  } else if (sector === 'it-park') {
    // IT Park (Texnopark rezidenti) güzəştləri
    incomeTax = 0;
    dsmfEmployee = safeGross <= 200 ? safeGross * 0.03 : 6 + (safeGross - 200) * 0.10;
    dsmfEmployer = safeGross <= 200 ? safeGross * 0.22 : 44 + (safeGross - 200) * 0.15;
    itsEmployee = safeGross * 0.02;
    itsEmployer = safeGross * 0.02;
    unemploymentEmployee = safeGross * 0.005;
    unemploymentEmployer = safeGross * 0.005;
  } else {
    // Neft-qaz / Dövlət sektoru
    const taxableIncome = Math.max(0, safeGross - 200);
    if (taxableIncome <= 2500) {
      incomeTax = taxableIncome * 0.14;
    } else {
      incomeTax = 350 + (taxableIncome - 2500) * 0.25;
    }

    dsmfEmployee = safeGross * 0.03;
    dsmfEmployer = safeGross * 0.22;
    itsEmployee = safeGross * 0.02;
    itsEmployer = safeGross * 0.02;
    unemploymentEmployee = safeGross * 0.005;
    unemploymentEmployer = safeGross * 0.005;
  }

  const totalEmployeeDeductions = incomeTax + dsmfEmployee + itsEmployee + unemploymentEmployee;
  const netSalary = Math.max(0, safeGross - totalEmployeeDeductions);
  const totalEmployerContributions = dsmfEmployer + itsEmployer + unemploymentEmployer;
  const totalEmployerCost = safeGross + totalEmployerContributions;
  const totalTaxesAndContributions = totalEmployeeDeductions + totalEmployerContributions;

  return {
    gross: Math.round(safeGross * 100) / 100,
    net: Math.round(netSalary * 100) / 100,
    sector: rawSector,
    totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
    totalEmployeeDeductions: Math.round(totalEmployeeDeductions * 100) / 100,
    incomeTax: Math.round(incomeTax * 100) / 100,
    dsmf: Math.round(dsmfEmployee * 100) / 100,
    healthInsurance: Math.round(itsEmployee * 100) / 100,
    unemployment: Math.round(unemploymentEmployee * 100) / 100,
    employerDsmf: Math.round(dsmfEmployer * 100) / 100,
    employerHealthInsurance: Math.round(itsEmployer * 100) / 100,
    employerUnemployment: Math.round(unemploymentEmployer * 100) / 100,
    breakdown: {
      grossSalary: Math.round(safeGross * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100,
      incomeTax: Math.round(incomeTax * 100) / 100,
      dsmfEmployee: Math.round(dsmfEmployee * 100) / 100,
      dsmfEmployer: Math.round(dsmfEmployer * 100) / 100,
      itsEmployee: Math.round(itsEmployee * 100) / 100,
      itsEmployer: Math.round(itsEmployer * 100) / 100,
      unemploymentEmployee: Math.round(unemploymentEmployee * 100) / 100,
      unemploymentEmployer: Math.round(unemploymentEmployer * 100) / 100,
      totalEmployeeDeductions: Math.round(totalEmployeeDeductions * 100) / 100,
      totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
      totalTaxesAndContributions: Math.round(totalTaxesAndContributions * 100) / 100,
    },
  };
}

export function calculateFromNet(targetNet: number, sector: SectorType = 'non-oil-private'): SalaryCalculationResult {
  if (targetNet <= 0) {
    return calculateFromGross(0, sector);
  }

  // Binary search to find gross accurately
  let low = targetNet;
  let high = targetNet * 2.5;
  let bestGross = targetNet;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const res = calculateFromGross(mid, sector);
    if (Math.abs(res.net - targetNet) < 0.01) {
      bestGross = mid;
      break;
    }
    if (res.net < targetNet) {
      low = mid;
    } else {
      high = mid;
      bestGross = mid;
    }
  }

  return calculateFromGross(bestGross, sector);
}

export function calculateNetSalary(gross: number, isOilSector = false): number {
  const sector: SectorType = isOilSector ? 'oil-or-state' : 'non-oil-private';
  return calculateFromGross(gross, sector).net;
}
