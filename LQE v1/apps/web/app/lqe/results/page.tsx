"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { leadColumns } from "@/components/table/columns";
import { ExportButtons } from "@/components/export/ExportButtons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TierFilter = "ALL" | "HOT" | "WARM" | "COLD";

export default function LQEResultsPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("ALL");

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem("lqe_result") : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      setData(parsed.leads || []);
    }
  }, []);

  const filtered = useMemo(() => {
    return data.filter((lead) => {
      if (tierFilter !== "ALL" && lead.tier !== tierFilter) {
        return false;
      }
      if (
        search &&
        !lead.companyName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data, search, tierFilter]);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">LQE Results</h1>
          <p className="text-sm text-slate-400">
            Filter, inspect, and export your qualified leads.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/")}
        >
          New run
        </Button>
      </div>

      <ExportButtons data={filtered} />

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Input
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-slate-900 border-slate-700"
        />

        <div className="flex gap-2 text-xs">
          {(["ALL", "HOT", "WARM", "COLD"] as TierFilter[]).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={tierFilter === t ? "default" : "secondary"}
              onClick={() => setTierFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <DataTable columns={leadColumns} data={filtered} />
      </div>
    </main>
  );
}
