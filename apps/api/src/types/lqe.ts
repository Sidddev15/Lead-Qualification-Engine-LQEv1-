export type InputMode = "manual" | "pdf_zip" | "excel";

export interface LQERunRequest {
  inputMode: InputMode;
  companies?: string[];
  uploadContext?: {
    storage: "local-temp";
    files: {
      fileName: string;
      originalName: string;
      mimeType: string;
    }[];
  };
}

export type LeadTier = "HOT" | "WARM" | "COLD" | "IGNORE";

export interface LQERunLead {
  id: string;
  companyStyle: string;
  website?: string;
  emails: string[];
  phones: string[];
  linkedin?: string;
  scores: {
    industryRelevance: number;
    contactQuality: number;
    companySize: number;
    webPresence: number;
    linkedinActivity: number;
    keywordMatch: number;
    finalScore: number;
  };
  tier: LeadTier;
  notes: string;
}

export interface LQERunResponse {
  runId: string;
  leads: LQERunLead[];
  meta: {
    inputMode: InputMode;
    totalCompanies: number;
    processedAt: string;
  };
}
