import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { mockPhones } from "@/data/mockPhones";
import { scorePhones } from "@/lib/scoring";
import { QuizAnswers, ScoredPhone } from "@/types/phone";

const compareSpecs = [
  { key: "price", label: "Price", fmt: (v: number | undefined) => v ? `$${v}` : "N/A" },
  { key: "os", label: "OS" },
  { key: "chipset", label: "Chipset" },
  { key: "cpuTierScore", label: "CPU Tier", fmt: (v: number) => `${v}/10` },
  { key: "ramGB", label: "RAM", fmt: (v: number) => `${v}GB`, higher: true },
  { key: "storageGB", label: "Storage", fmt: (v: number) => `${v}GB`, higher: true },
  { key: "displaySizeIn", label: "Display", fmt: (v: number) => `${v}"` },
  { key: "displayType", label: "Display Type" },
  { key: "refreshRateHz", label: "Refresh Rate", fmt: (v: number) => `${v}Hz`, higher: true },
  { key: "batteryMah", label: "Battery", fmt: (v: number) => `${v}mAh`, higher: true },
  { key: "chargingW", label: "Charging", fmt: (v: number) => `${v}W`, higher: true },
  { key: "mainCameraMp", label: "Main Camera", fmt: (v: number) => `${v}MP`, higher: true },
  { key: "selfieCameraMp", label: "Selfie", fmt: (v: number) => `${v}MP` },
  { key: "weightG", label: "Weight", fmt: (v: number | undefined) => v ? `${v}g` : "N/A" },
  { key: "ipRating", label: "IP Rating", fmt: (v: string | undefined) => v || "N/A" },
] as const;

export default function ComparePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const ids = (params.get("ids") || "").split(",").filter(Boolean);

  const answers: QuizAnswers = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("phonefinder-quiz") || "{}"); } catch { return {}; }
  }, []);

  const scored = useMemo(() => scorePhones(mockPhones, answers), [answers]);
  const phones = ids.map(id => scored.find(p => p.id === id)).filter(Boolean) as ScoredPhone[];

  if (phones.length < 2) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Select at least 2 phones to compare.</p>
          <button onClick={() => navigate("/results")} className="text-primary hover:underline">Back to results</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container py-6 flex items-center gap-4">
          <button onClick={() => navigate("/results")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="font-mono text-primary text-sm">PhoneFinder</p>
            <h1 className="text-2xl font-bold">Compare</h1>
          </div>
        </div>
      </div>

      <div className="container py-8 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 text-sm text-muted-foreground font-medium sticky left-0 bg-background z-10">Spec</th>
              {phones.map(p => (
                <th key={p.id} className="p-3 text-center">
                  <div className="font-bold">{p.brand} {p.modelName}</div>
                  <div className="text-score font-mono text-lg">{p.fitScore}/100</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareSpecs.map(spec => {
              const values = phones.map(p => (p as any)[spec.key]);
              const numericValues = values.map(v => (typeof v === "number" ? v : undefined));
              const bestIdx = (spec as any).higher
                ? numericValues.indexOf(Math.max(...numericValues.filter((v): v is number => v !== undefined)))
                : -1;

              return (
                <tr key={spec.key} className="border-t border-border">
                  <td className="p-3 text-sm text-muted-foreground font-medium sticky left-0 bg-background z-10">{spec.label}</td>
                  {phones.map((p, i) => {
                    const val = (p as any)[spec.key];
                    const formatted = (spec as any).fmt ? (spec as any).fmt(val) : String(val ?? "N/A");
                    const isBest = bestIdx === i && bestIdx !== -1;
                    return (
                      <td key={p.id} className={`p-3 text-center text-sm font-mono ${isBest ? "text-primary font-bold" : "text-foreground"}`}>
                        {isBest && <Trophy className="w-3 h-3 inline mr-1 text-primary" />}
                        {formatted}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
