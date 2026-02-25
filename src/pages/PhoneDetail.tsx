import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertTriangle, Cpu, Camera, Battery, Monitor, HardDrive, Star, ShoppingCart, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockPhones } from "@/data/mockPhones";
import { scorePhones, getBuyUrl, isOlderPhone } from "@/lib/scoring";
import { QuizAnswers } from "@/types/phone";
import ScoreBar from "@/components/ScoreBar";

const specSections = [
  {
    title: "Performance",
    icon: Cpu,
    fields: [
      { label: "Chipset", key: "chipset" },
      { label: "CPU Tier", key: "cpuTierScore", fmt: (v: number) => `${v}/10` },
      { label: "RAM", key: "ramGB", fmt: (v: number) => `${v}GB` },
    ],
  },
  {
    title: "Camera",
    icon: Camera,
    fields: [
      { label: "Main Camera", key: "mainCameraMp", fmt: (v: number) => `${v}MP` },
      { label: "Selfie", key: "selfieCameraMp", fmt: (v: number) => `${v}MP` },
      { label: "Details", key: "cameraNotes" },
    ],
  },
  {
    title: "Battery",
    icon: Battery,
    fields: [
      { label: "Capacity", key: "batteryMah", fmt: (v: number) => `${v}mAh` },
      { label: "Charging", key: "chargingW", fmt: (v: number) => `${v}W` },
    ],
  },
  {
    title: "Display",
    icon: Monitor,
    fields: [
      { label: "Size", key: "displaySizeIn", fmt: (v: number) => `${v}"` },
      { label: "Type", key: "displayType" },
      { label: "Refresh Rate", key: "refreshRateHz", fmt: (v: number) => `${v}Hz` },
    ],
  },
  {
    title: "Storage & Other",
    icon: HardDrive,
    fields: [
      { label: "Storage", key: "storageGB", fmt: (v: number) => `${v}GB` },
      { label: "Weight", key: "weightG", fmt: (v: number | undefined) => v ? `${v}g` : "N/A" },
      { label: "IP Rating", key: "ipRating", fmt: (v: string | undefined) => v || "N/A" },
    ],
  },
];

export default function PhoneDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const answers: QuizAnswers = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("phonefinder-quiz") || "{}"); } catch { return {}; }
  }, []);

  const scored = useMemo(() => scorePhones(mockPhones, answers), [answers]);
  const phone = scored.find(p => p.id === id);

  if (!phone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Phone not found.</p>
          <button onClick={() => navigate("/results")} className="text-primary hover:underline">Back to results</button>
        </div>
      </div>
    );
  }

  const related = scored.filter(p => p.id !== phone.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-6 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="font-mono text-primary text-sm">PhoneFinder</p>
            <h1 className="text-2xl font-bold">{phone.brand} {phone.modelName}</h1>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left column: score + highlights */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6 sticky top-6"
            >
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-score font-mono mb-1">{phone.fitScore}</div>
                <div className="text-sm text-muted-foreground">Fit Score</div>
                {phone.badge && (
                  <Badge className="mt-3 bg-primary/15 text-primary border-primary/30">
                    <Star className="w-3 h-3 mr-1" /> {phone.badge}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <ScoreBar label="Performance" value={phone.scoreBreakdown.performance} />
                <ScoreBar label="Camera" value={phone.scoreBreakdown.camera} />
                <ScoreBar label="Battery" value={phone.scoreBreakdown.battery} />
                <ScoreBar label="Display" value={phone.scoreBreakdown.display} />
                <ScoreBar label="Storage" value={phone.scoreBreakdown.storage} />
                <ScoreBar label="Extras" value={phone.scoreBreakdown.extrasFit} />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> What it's best at
                  </p>
                  <ul className="space-y-1">
                    {phone.whyItFits.map(r => (
                      <li key={r} className="text-sm text-muted-foreground">• {r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-score uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Not ideal if…
                  </p>
                  <ul className="space-y-1">
                    {phone.tradeoffs.map(t => (
                      <li key={t} className="text-sm text-muted-foreground">• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buy link */}
              <a
                href={getBuyUrl(phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4" />
                {isOlderPhone(phone) ? "Find on eBay (Used)" : "Buy on Amazon"}
                <ExternalLink className="w-3 h-3" />
              </a>
              {isOlderPhone(phone) && (
                <p className="text-xs text-score text-center mt-2">
                  Older model — great deals on refurbished units
                </p>
              )}
            </motion.div>
          </div>

          {/* Right column: full specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick info */}
            <div className="flex flex-wrap gap-2 mb-2">
              {phone.extras.map(e => (
                <span key={e} className="text-xs px-3 py-1.5 rounded-full bg-surface text-surface-foreground font-mono">{e}</span>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              {phone.os} · {phone.releaseYear || "Unknown year"}
              {phone.price && ` · $${phone.price}`}
            </div>

            {/* Spec sections */}
            {specSections.map(section => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-card border border-border p-5"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-primary" /> {section.title}
                </h3>
                <div className="space-y-3">
                  {section.fields.map(field => {
                    const val = (phone as any)[field.key];
                    const display = (field as any).fmt ? (field as any).fmt(val) : String(val ?? "N/A");
                    return (
                      <div key={field.key} className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">{field.label}</span>
                        <span className="text-sm font-medium text-right max-w-[60%]">{display}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="font-semibold mb-4">Similar phones</h3>
                <div className="space-y-2">
                  {related.map(p => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/phone/${p.id}`)}
                      className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border cursor-pointer card-hover"
                    >
                      <span className="font-mono text-primary text-sm w-10">{p.fitScore}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{p.brand} {p.modelName}</p>
                        <p className="text-xs text-muted-foreground">{p.chipset}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
