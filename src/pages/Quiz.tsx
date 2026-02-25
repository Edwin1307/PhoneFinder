import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizQuestions } from "@/data/quizQuestions";
import { QuizAnswers } from "@/types/phone";

const STORAGE_KEY = "phonefinder-quiz";

export default function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const q = quizQuestions[step];
  const currentAnswer = (answers as Record<string, unknown>)[q.id];
  const total = quizQuestions.length;
  const progress = ((step + 1) / total) * 100;

  const selectOption = (value: string) => {
    if (q.type === "single") {
      setAnswers(prev => ({ ...prev, [q.id]: value }));
    } else {
      const current = (currentAnswer as string[]) || [];
      if (value === "none") {
        setAnswers(prev => ({ ...prev, [q.id]: ["none"] }));
        return;
      }
      const without = current.filter(v => v !== "none");
      if (without.includes(value)) {
        setAnswers(prev => ({ ...prev, [q.id]: without.filter(v => v !== value) }));
      } else {
        const max = q.maxSelections || 99;
        if (without.length < max) {
          setAnswers(prev => ({ ...prev, [q.id]: [...without, value] }));
        }
      }
    }
  };

  const isSelected = (value: string) => {
    if (q.type === "single") return currentAnswer === value;
    return Array.isArray(currentAnswer) && currentAnswer.includes(value);
  };

  const canAdvance = q.skippable || (q.type === "single" ? !!currentAnswer : Array.isArray(currentAnswer) && currentAnswer.length > 0);

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      navigate("/results");
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/");
  };

  const skip = () => {
    if (step < total - 1) setStep(step + 1);
    else navigate("/results");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="container py-6 flex items-center justify-between">
        <button onClick={back} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="font-mono text-sm text-muted-foreground">
          {step + 1} / {total}
        </span>
        {q.skippable && (
          <button onClick={skip} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
            Skip <SkipForward className="w-4 h-4" />
          </button>
        )}
        {!q.skippable && <div />}
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">{q.question}</h2>
            {q.description && (
              <p className="text-muted-foreground text-center mb-8">{q.description}</p>
            )}
            {!q.description && <div className="mb-8" />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectOption(opt.value)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected(opt.value)
                      ? "border-primary bg-primary/10 glow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="text-xl mr-3">{opt.icon}</span>
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                onClick={next}
                disabled={!canAdvance}
                className="bg-gradient-primary text-primary-foreground font-semibold px-10 py-5 rounded-full glow-sm disabled:opacity-30 disabled:glow-none"
              >
                {step === total - 1 ? "See results" : "Next"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
