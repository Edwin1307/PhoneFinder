import { Badge } from "@/components/ui/badge";
import { ScoredPhone } from "@/types/phone";
import { getBuyUrl, isOlderPhone } from "@/lib/scoring";
import ScoreBar from "./ScoreBar";
import { BarChart3, Eye, CheckCircle, AlertTriangle, ExternalLink, ShoppingCart } from "lucide-react";

interface PhoneCardProps {
  phone: ScoredPhone;
  rank: number;
  isCompare: boolean;
  onToggleCompare: () => void;
  onViewDetails: () => void;
}

export default function PhoneCard({ phone, rank, isCompare, onToggleCompare, onViewDetails }: PhoneCardProps) {
  const highlightChips = [
    phone.batteryMah >= 4500 && `${phone.batteryMah}mAh`,
    (phone.displayType === "OLED" || phone.displayType === "AMOLED") && phone.displayType,
    phone.refreshRateHz >= 120 && `${phone.refreshRateHz}Hz`,
    phone.ramGB >= 8 && `${phone.ramGB}GB RAM`,
    phone.chargingW >= 45 && `${phone.chargingW}W charge`,
  ].filter(Boolean) as string[];

  const older = isOlderPhone(phone);
  const buyUrl = getBuyUrl(phone);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden card-hover flex flex-col h-full">
      {/* Top section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-3xl font-black font-mono ${rank <= 1 ? "text-gradient" : "text-muted-foreground"}`}>
              #{rank}
            </span>
            {phone.badge && (
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                {phone.badge}
              </Badge>
            )}
            {older && (
              <Badge className="bg-score/15 text-score border-score/30 text-xs">
                Look on eBay
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-score font-mono">{phone.fitScore}</div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-1">{phone.brand} {phone.modelName}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          {phone.chipset} · {phone.os}
          {phone.price && ` · $${phone.price}`}
        </p>
        {phone.releaseYear && (
          <p className="text-xs text-muted-foreground mb-3">
            Released {phone.releaseYear}
            {older && " · Consider used/refurbished"}
          </p>
        )}

        {/* Highlight chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {highlightChips.slice(0, 4).map(chip => (
            <span key={chip} className="text-xs px-2.5 py-1 rounded-full bg-surface text-surface-foreground font-mono">
              {chip}
            </span>
          ))}
        </div>

        {/* Score breakdown mini bars */}
        <div className="space-y-2 mb-5">
          <ScoreBar label="Performance" value={phone.scoreBreakdown.performance} />
          <ScoreBar label="Camera" value={phone.scoreBreakdown.camera} />
          <ScoreBar label="Battery" value={phone.scoreBreakdown.battery} />
          <ScoreBar label="Display" value={phone.scoreBreakdown.display} />
        </div>
      </div>

      {/* Why & Tradeoffs */}
      <div className="px-6 pb-4 flex-1">
        <div className="mb-3">
          <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Why it fits you
          </p>
          <ul className="space-y-1">
            {phone.whyItFits.map(r => (
              <li key={r} className="text-sm text-muted-foreground">• {r}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-score uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Tradeoffs
          </p>
          <ul className="space-y-1">
            {phone.tradeoffs.map(t => (
              <li key={t} className="text-sm text-muted-foreground">• {t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Buy link */}
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-4 h-4" />
          {older ? "Find on eBay" : "Buy on Amazon"}
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
        <div className="flex gap-2">
          <button
            onClick={onToggleCompare}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isCompare
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {isCompare ? "Added" : "Compare"}
          </button>
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
