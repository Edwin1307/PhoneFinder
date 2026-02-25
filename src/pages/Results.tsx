import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Eye, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPhones } from "@/data/mockPhones";
import { scorePhones } from "@/lib/scoring";
import { QuizAnswers } from "@/types/phone";
import PhoneCard from "@/components/PhoneCard";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const answers: QuizAnswers = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("phonefinder-quiz") || "{}");
    } catch {
      return {};
    }
  }, []);

  const scored = useMemo(() => scorePhones(mockPhones, answers), [answers]);
  const top5 = scored.slice(0, 5);
  const rest = scored.slice(5);

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const goCompare = () => {
    if (compareList.length >= 2) {
      navigate(`/compare?ids=${compareList.join(",")}`);
    }
  };

  if (scored.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold mb-4">No matches found</h2>
          <p className="text-muted-foreground mb-6">Try adjusting your preferences for broader results.</p>
          <Button onClick={() => navigate("/quiz")} className="bg-gradient-primary text-primary-foreground rounded-full">
            <RotateCcw className="mr-2 w-4 h-4" /> Retake quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-primary text-sm">PhoneFinder</p>
            <h1 className="text-2xl font-bold">Your Top Picks</h1>
            <p className="text-sm text-muted-foreground mt-1">{scored.length} phones matched your preferences</p>
          </div>
          <div className="flex gap-3">
            {compareList.length >= 2 && (
              <Button onClick={goCompare} variant="outline" size="sm" className="border-primary text-primary">
                <BarChart3 className="mr-1 w-4 h-4" /> Compare ({compareList.length})
              </Button>
            )}
            <Button onClick={() => navigate("/quiz")} variant="ghost" size="sm">
              <RotateCcw className="mr-1 w-4 h-4" /> Retake
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Top 5 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {top5.map((phone, i) => (
            <motion.div
              key={phone.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <PhoneCard
                phone={phone}
                rank={i + 1}
                isCompare={compareList.includes(phone.id)}
                onToggleCompare={() => toggleCompare(phone.id)}
                onViewDetails={() => navigate(`/phone/${phone.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* More matches */}
        {rest.length > 0 && (
          <div>
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <span className="font-semibold">Show more options ({rest.length})</span>
              {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                {rest.map((phone, i) => (
                  <div
                    key={phone.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border card-hover cursor-pointer"
                    onClick={() => navigate(`/phone/${phone.id}`)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center font-mono text-sm text-primary">
                      {phone.fitScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{phone.brand} {phone.modelName}</p>
                        {phone.releaseYear && phone.releaseYear <= 2022 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-score/15 text-score whitespace-nowrap">
                            Used/eBay
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {phone.chipset} · {phone.ramGB}GB RAM
                        {phone.price && ` · $${phone.price}`}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompare(phone.id); }}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                          compareList.includes(phone.id) ? "border-primary text-primary" : "border-border text-muted-foreground"
                        }`}
                      >
                        {compareList.includes(phone.id) ? "Added" : "Compare"}
                      </button>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
