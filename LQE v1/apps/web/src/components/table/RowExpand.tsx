"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RowExpand({ lead }: { lead: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Expand toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="text-slate-300 hover:text-white"
      >
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Button>

      {/* Expanded row */}
      {open && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="bg-slate-900/70 border-t border-slate-700 px-6 py-4 text-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* LEFT: Contact & Presence */}
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400">Website:</span>{" "}
                    {lead.website || "N/A"}
                  </div>
                  <div>
                    <span className="text-slate-400">Emails:</span>{" "}
                    {lead.emails?.length ? lead.emails.join(", ") : "None"}
                  </div>
                  <div>
                    <span className="text-slate-400">Phones:</span>{" "}
                    {lead.phones?.length ? lead.phones.join(", ") : "None"}
                  </div>
                  <div>
                    <span className="text-slate-400">LinkedIn:</span>{" "}
                    {lead.linkedin || "N/A"}
                  </div>
                </div>

                {/* RIGHT: Reasons */}
                <div>
                  <div className="text-slate-300 font-medium mb-2">
                    Why this lead?
                  </div>
                  <ul className="list-disc ml-5 text-slate-400 space-y-1">
                    {lead.reasons?.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 text-slate-400">
                <span className="text-slate-300 font-medium">Notes:</span>{" "}
                {lead.notes}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
