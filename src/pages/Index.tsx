import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-phones.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const steps = [
  { icon: Search, title: "Answer a few questions", desc: "Tell us what matters most to you in a phone." },
  { icon: Zap, title: "We crunch the specs", desc: "Our engine scores every phone against your needs." },
  { icon: Shield, title: "Get your top picks", desc: "See ranked recommendations with clear reasoning." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-background/70" />

        <div className="container relative z-10 py-20">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            animate="visible"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-primary font-mono text-sm tracking-widest uppercase mb-4"
            >
              PhoneFinder
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6"
            >
              Find the best phone for your needs —{" "}
              <span className="text-gradient">fast.</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-lg mx-auto"
            >
              No endless scrolling. Answer a quick quiz and get personalized, spec-backed recommendations in seconds.
            </motion.p>
            <motion.div custom={3} variants={fadeUp}>
              <Button
                size="lg"
                onClick={() => navigate("/quiz")}
                className="bg-gradient-primary text-primary-foreground font-semibold text-lg px-8 py-6 rounded-full glow-md hover:glow-lg transition-shadow"
              >
                Find my phone
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-surface/30">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            How it works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-sm font-mono text-primary mb-2">Step {i + 1}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20">
        <div className="container text-center max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {[
              { stat: "15+", label: "Top brands" },
              { stat: "10s", label: "To get results" },
              { stat: "100%", label: "Transparent scoring" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-black text-gradient">{item.stat}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-mono text-primary mb-2">PhoneFinder</p>
          <p>Spec-based smartphone recommendations. No ads, no bias.</p>
        </div>
      </footer>
    </div>
  );
}
