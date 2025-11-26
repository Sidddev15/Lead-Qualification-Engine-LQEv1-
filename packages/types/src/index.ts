// --------------------------------------------
// Core Enums
// --------------------------------------------
export type LeadTier = "HOT" | "WARM" | "COLD" | "IGNORED";

// --------------------------------------------
// Scoring Breakdown
// --------------------------------------------
export interface LqeScoreBreakdown {
  industryRelevance: number; // 0–100
  contactQuality: number; // 0–100
  companySize: number; // 0–100
  webPresence: number; // 0–100
  linkedinActivity: number; // 0–100
  keywordMatch: number; // 0–100

  finalScore: number; // Weighted 0–100
}

// --------------------------------------------
// Base Company Metadata
// --------------------------------------------
export interface LeadCompanyBase {
  id: string;

  rawName: string; // Direct extracted name
  normalizedName: string; // Cleaned, standardized version

  website?: string;
  emails: string[];
  phones: string[];

  country?: string;
  city?: string;
  region?: string; // e.g. "Europe"

  keywordsMatched: string[]; // Matched from config KEYWORDS
  productCategories: string[]; // Derived from matched keywords
}

// --------------------------------------------
// Final Lead Object Returned to Frontend
// --------------------------------------------
export interface LeadRecord extends LeadCompanyBase {
  scores: LqeScoreBreakdown;
  tier: LeadTier;
  autoNotes: string[];

  source: "pdf" | "zip" | "excel" | "manual";
}
