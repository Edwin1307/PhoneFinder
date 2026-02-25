export interface Phone {
  id: string;
  brand: string;
  modelName: string;
  imageUrl: string;
  releaseYear?: number;
  price?: number;
  os: "Android" | "iOS";
  chipset: string;
  cpuTierScore: number; // 1-10
  ramGB: number;
  storageGB: number;
  displaySizeIn: number;
  displayType: "OLED" | "LCD" | "AMOLED";
  refreshRateHz: number;
  batteryMah: number;
  chargingW: number;
  mainCameraMp: number;
  cameraNotes: string;
  selfieCameraMp: number;
  weightG?: number;
  ipRating?: string;
  extras: string[];
  buyUrl?: string;
}

export interface QuizAnswers {
  budget?: string;
  os?: string;
  primaryUse?: string[];
  cameraPriority?: string;
  batteryPriority?: string;
  screenSize?: string;
  performance?: string;
  storage?: string;
  displayPref?: string;
  extras?: string[];
}

export interface ScoredPhone extends Phone {
  fitScore: number;
  whyItFits: string[];
  tradeoffs: string[];
  badge?: string;
  scoreBreakdown: {
    performance: number;
    camera: number;
    battery: number;
    display: number;
    storage: number;
    extrasFit: number;
  };
}
