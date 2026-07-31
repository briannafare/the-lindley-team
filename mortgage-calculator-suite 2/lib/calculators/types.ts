export type LoanTermBand = ">20" | "<=20";

export type CreditTier =
  | "760_plus"
  | "740_759"
  | "720_739"
  | "700_719"
  | "680_699"
  | "660_679"
  | "640_659"
  | "620_639";

export interface MiContext {
  ltv: number;
  loanTermYears: number;
  isFixed: boolean;
  occupancy: "primary" | "second_home" | "investment";
  isCashOutRefi: boolean;
  dtiOver45: boolean;
  numBorrowers: 1 | 2 | 3 | 4;
  isManufactured: boolean;
  units: 1 | 2 | 3 | 4;
  creditTier: CreditTier;
}

export interface ConventionalInputs {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number; // annual, percent
  loanTermYears: number;
  isFixed: boolean;
  occupancy: "primary" | "second_home" | "investment";
  isCashOutRefi: boolean;
  estimatedCreditScore: number;
  annualPropertyTax: number;
  annualHomeownersInsurance: number;
  monthlyHoa: number;
  startDate: Date;
}

export interface ConventionalOutputs {
  monthlyPrincipalAndInterest: number;
  monthlyMi: number;
  monthlyPropertyTax: number;
  monthlyHomeownersInsurance: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  ltv: number;
  totalInterestPaid: number;
  payoffDate: Date;
}

export interface AmortizationRow {
  month: number;
  interest: number;
  principal: number;
  balance: number;
}
