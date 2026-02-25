export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: "single" | "multi";
  maxSelections?: number;
  options: { value: string; label: string; icon?: string }[];
  skippable?: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "budget",
    question: "What's your budget?",
    description: "We'll find the best phone in your price range.",
    type: "single",
    options: [
      { value: "under300", label: "Under $300", icon: "💰" },
      { value: "300-500", label: "$300 – $500", icon: "💵" },
      { value: "500-800", label: "$500 – $800", icon: "💳" },
      { value: "800-1200", label: "$800 – $1,200", icon: "💎" },
      { value: "1200+", label: "$1,200+", icon: "👑" },
    ],
    skippable: true,
  },
  {
    id: "os",
    question: "Android or iPhone?",
    description: "Pick your preferred ecosystem.",
    type: "single",
    options: [
      { value: "Android", label: "Android", icon: "🤖" },
      { value: "iOS", label: "iPhone (iOS)", icon: "🍎" },
      { value: "no-preference", label: "No preference", icon: "🤷" },
    ],
  },
  {
    id: "primaryUse",
    question: "What will you use it for most?",
    description: "Pick up to 2 that matter most.",
    type: "multi",
    maxSelections: 2,
    options: [
      { value: "social", label: "Social + everyday", icon: "📱" },
      { value: "photography", label: "Photography / video", icon: "📸" },
      { value: "gaming", label: "Gaming", icon: "🎮" },
      { value: "work", label: "Work / business", icon: "💼" },
      { value: "content", label: "Content creation", icon: "🎬" },
      { value: "battery", label: "Battery / travel", icon: "🔋" },
    ],
  },
  {
    id: "cameraPriority",
    question: "How important is the camera?",
    type: "single",
    options: [
      { value: "not-important", label: "Not important", icon: "😐" },
      { value: "balanced", label: "Balanced", icon: "⚖️" },
      { value: "very-important", label: "Very important", icon: "📷" },
    ],
  },
  {
    id: "batteryPriority",
    question: "How important is battery life?",
    type: "single",
    options: [
      { value: "not-important", label: "Not important", icon: "🔌" },
      { value: "balanced", label: "Balanced", icon: "⚖️" },
      { value: "very-important", label: "Very important", icon: "🔋" },
    ],
  },
  {
    id: "screenSize",
    question: "What screen size do you prefer?",
    type: "single",
    options: [
      { value: "compact", label: "Compact (≤ 6.1\")", icon: "📏" },
      { value: "medium", label: "Medium (6.2\"–6.5\")", icon: "📐" },
      { value: "large", label: "Large (≥ 6.6\")", icon: "🖥️" },
      { value: "no-preference", label: "No preference", icon: "🤷" },
    ],
    skippable: true,
  },
  {
    id: "performance",
    question: "How much power do you need?",
    description: "Gaming and heavy multitasking need more power.",
    type: "single",
    options: [
      { value: "basic", label: "Basic", icon: "🐢" },
      { value: "balanced", label: "Balanced", icon: "⚖️" },
      { value: "power-user", label: "Power user", icon: "🚀" },
    ],
  },
  {
    id: "storage",
    question: "How much storage do you need?",
    type: "single",
    options: [
      { value: "128", label: "128GB is fine", icon: "📁" },
      { value: "256", label: "256GB preferred", icon: "📂" },
      { value: "512+", label: "512GB+", icon: "🗄️" },
      { value: "no-preference", label: "No preference", icon: "🤷" },
    ],
    skippable: true,
  },
  {
    id: "displayPref",
    question: "Display preference?",
    description: "OLED offers deeper blacks and more vivid colors.",
    type: "single",
    options: [
      { value: "must-oled", label: "Must be OLED", icon: "✨" },
      { value: "prefer-oled", label: "OLED preferred", icon: "👍" },
      { value: "no-preference", label: "No preference", icon: "🤷" },
    ],
    skippable: true,
  },
  {
    id: "extras",
    question: "Any must-have extras?",
    description: "Select all that apply.",
    type: "multi",
    options: [
      { value: "120hz", label: "120Hz+ display", icon: "🖵" },
      { value: "wireless-charging", label: "Wireless charging", icon: "🔄" },
      { value: "durability", label: "Best durability", icon: "🛡️" },
      { value: "esim", label: "eSIM", icon: "📡" },
      { value: "fast-charging", label: "Fast charging", icon: "⚡" },
      { value: "none", label: "No extras needed", icon: "❌" },
    ],
    skippable: true,
  },
];
