import { ColumnDef } from "@tanstack/react-table";
import { TierBadge } from "./TierBadge";
import { ScoreBadge } from "./ScoreBadge";
import { RowExpand } from "./RowExpand";

export const leadColumns: ColumnDef<any>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.companyName}</div>
    ),
  },
  {
    accessorKey: "tier",
    header: "Tier",
    cell: ({ row }) => <TierBadge tier={row.original.tier} />,
  },
  {
    accessorKey: "scores.finalScore",
    header: "Score",
    cell: ({ row }) => <ScoreBadge score={row.original.scores.finalScore} />,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) =>
      row.original.website ? (
        <a
          href={row.original.website}
          target="_blank"
          className="text-blue-400 underline"
        >
          {row.original.website}
        </a>
      ) : (
        <span className="text-slate-500 text-xs">N/A</span>
      ),
  },
  {
    id: "expand",
    header: "",
    cell: ({ row }) => <RowExpand lead={row.original} />,
  },
];
