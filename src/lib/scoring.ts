import { Phone, QuizAnswers, ScoredPhone } from "@/types/phone";

function getWeights(answers: QuizAnswers) {
  const w = { performance: 25, camera: 20, battery: 20, display: 15, storage: 10, extras: 10 };
  const uses = answers.primaryUse || [];
  if (uses.includes("gaming") || answers.performance === "power-user") {
    w.performance = 35; w.camera -= 5; w.battery -= 5;
  }
  if (uses.includes("photography") || uses.includes("content") || answers.cameraPriority === "very-important") {
    w.camera = 30; w.performance -= 5; w.storage -= 5;
  }
  if (uses.includes("battery") || answers.batteryPriority === "very-important") {
    w.battery = 30; w.display -= 5; w.extras -= 5;
  }
  return w;
}

// Soft filters: apply penalty instead of excluding
function budgetPenalty(phone: Phone, answers: QuizAnswers): number {
  if (!answers.budget || !phone.price) return 0;
  const b = answers.budget;
  const p = phone.price;
  const ranges: Record<string, [number, number]> = {
    "under300": [0, 300],
    "300-500": [300, 500],
    "500-800": [500, 800],
    "800-1200": [800, 1200],
    "1200+": [1200, 9999],
  };
  const [lo, hi] = ranges[b] || [0, 9999];
  if (p >= lo && p <= hi) return 0;
  // How far outside range
  const dist = p < lo ? lo - p : p - hi;
  // Gentle penalty: -1 point per $50 over
  return Math.min(Math.round(dist / 50), 20);
}

function screenSizePenalty(phone: Phone, answers: QuizAnswers): number {
  if (!answers.screenSize || answers.screenSize === "no-preference") return 0;
  const size = phone.displaySizeIn;
  if (answers.screenSize === "compact" && size > 6.3) return Math.min(Math.round((size - 6.3) * 10), 10);
  if (answers.screenSize === "large" && size < 6.4) return Math.min(Math.round((6.4 - size) * 10), 10);
  return 0;
}

function passesHardFilters(phone: Phone, answers: QuizAnswers): boolean {
  // Only OS is a hard filter now
  if (answers.os && answers.os !== "no-preference" && phone.os !== answers.os) return false;
  // OLED "must" is hard filter
  if (answers.displayPref === "must-oled" && phone.displayType === "LCD") return false;
  return true;
}

function scorePerformance(phone: Phone): number {
  const cpuScore = (phone.cpuTierScore / 10) * 60;
  const ramScore = Math.min((phone.ramGB / 16) * 40, 40);
  return cpuScore + ramScore;
}

function scoreCamera(phone: Phone): number {
  let s = Math.min((phone.mainCameraMp / 200) * 50, 50);
  if (phone.cameraNotes.toLowerCase().includes("telephoto")) s += 15;
  if (phone.cameraNotes.toLowerCase().includes("ultrawide")) s += 10;
  if (phone.cameraNotes.toLowerCase().includes("night")) s += 10;
  if (phone.cameraNotes.toLowerCase().includes("pro")) s += 10;
  s += Math.min((phone.selfieCameraMp / 32) * 5, 5);
  return Math.min(s, 100);
}

function scoreBattery(phone: Phone): number {
  const cap = Math.min((phone.batteryMah / 5500) * 60, 60);
  const charging = Math.min((phone.chargingW / 120) * 40, 40);
  return cap + charging;
}

function scoreDisplay(phone: Phone): number {
  let s = 0;
  if (phone.displayType === "OLED" || phone.displayType === "AMOLED") s += 40;
  else s += 15;
  s += Math.min(((phone.refreshRateHz - 60) / 84) * 40, 40);
  s += Math.min((phone.displaySizeIn / 7) * 20, 20);
  return Math.min(s, 100);
}

function scoreStorage(phone: Phone, answers: QuizAnswers): number {
  const pref = answers.storage;
  if (!pref || pref === "no-preference") return 70;
  const needed = pref === "128" ? 128 : pref === "256" ? 256 : 512;
  if (phone.storageGB >= needed) return 100;
  if (phone.storageGB >= needed * 0.5) return 50;
  return 20;
}

function scoreExtras(phone: Phone, answers: QuizAnswers): number {
  const wanted = answers.extras || [];
  if (wanted.length === 0 || wanted.includes("none")) return 70;
  let matched = 0;
  const relevant = wanted.filter(w => w !== "none");
  if (relevant.length === 0) return 70;
  if (wanted.includes("120hz") && phone.refreshRateHz >= 120) matched++;
  if (wanted.includes("wireless-charging") && phone.extras.some(e => e.toLowerCase().includes("wireless"))) matched++;
  if (wanted.includes("durability") && phone.ipRating && phone.ipRating.includes("IP6")) matched++;
  if (wanted.includes("esim") && phone.extras.some(e => e.toLowerCase().includes("esim"))) matched++;
  if (wanted.includes("fast-charging") && phone.chargingW >= 30) matched++;
  return Math.round((matched / relevant.length) * 100);
}

function generateWhyItFits(phone: Phone, answers: QuizAnswers): string[] {
  const reasons: string[] = [];
  if (phone.cpuTierScore >= 9) reasons.push("Top-tier processor for smooth performance");
  if (phone.batteryMah >= 5000) reasons.push("Large battery for all-day use");
  if (phone.mainCameraMp >= 50) reasons.push("High-resolution camera system");
  if ((phone.displayType === "OLED" || phone.displayType === "AMOLED") && phone.refreshRateHz >= 120)
    reasons.push("Stunning OLED display with 120Hz refresh");
  if (phone.chargingW >= 60) reasons.push(`Blazing fast ${phone.chargingW}W charging`);
  if (phone.extras.includes("Wireless Charging")) reasons.push("Wireless charging supported");
  if (phone.ipRating && phone.ipRating.includes("IP68")) reasons.push("Excellent water resistance (IP68)");
  if (phone.price && phone.price < 500) reasons.push("Great value for the specs");
  if (phone.storageGB >= 256) reasons.push(`Generous ${phone.storageGB}GB storage`);
  if (phone.releaseYear && phone.releaseYear <= 2022) reasons.push("Proven reliability — well-reviewed over time");
  return reasons.slice(0, 3);
}

function generateTradeoffs(phone: Phone): string[] {
  const t: string[] = [];
  if (phone.releaseYear && phone.releaseYear <= 2021) t.push("Older model — consider buying used/refurbished");
  if (phone.batteryMah < 4000) t.push("Smaller battery may need midday charging");
  if (phone.chargingW < 25) t.push("Slower charging speed");
  if (phone.refreshRateHz <= 60) t.push("Standard 60Hz display (no high refresh)");
  if (phone.displayType === "LCD") t.push("LCD display (less vivid than OLED)");
  if (phone.ramGB <= 6) t.push("Limited RAM for heavy multitasking");
  if (phone.storageGB <= 64) t.push("Limited base storage");
  if (!phone.ipRating || phone.ipRating === "") t.push("No official water resistance rating");
  if (phone.weightG && phone.weightG > 220) t.push(`Heavier at ${phone.weightG}g`);
  if (phone.price && phone.price > 1200) t.push("Premium price point");
  return t.slice(0, 2);
}

function assignBadge(phone: ScoredPhone): string | undefined {
  const bd = phone.scoreBreakdown;
  const max = Math.max(bd.performance, bd.camera, bd.battery, bd.display);
  if (max === bd.camera && bd.camera >= 70) return "Best for Camera";
  if (max === bd.battery && bd.battery >= 70) return "Best Battery";
  if (max === bd.performance && bd.performance >= 80) return "Performance King";
  if (phone.price && phone.price < 500 && phone.fitScore >= 55) return "Best Value";
  if (max === bd.display && bd.display >= 80) return "Best Display";
  if (phone.releaseYear && phone.releaseYear <= 2022 && phone.fitScore >= 50) return "Great Used Buy";
  return undefined;
}

export function getBuyUrl(phone: Phone): string {
  if (phone.buyUrl) return phone.buyUrl;
  const isOld = phone.releaseYear && phone.releaseYear <= 2022;
  const query = encodeURIComponent(`${phone.brand} ${phone.modelName}`);
  return isOld
    ? `https://www.ebay.com/sch/i.html?_nkw=${query}`
    : `https://www.amazon.com/s?k=${query}`;
}

export function isOlderPhone(phone: Phone): boolean {
  return !!phone.releaseYear && phone.releaseYear <= 2022;
}

export function scorePhones(phones: Phone[], answers: QuizAnswers): ScoredPhone[] {
  const weights = getWeights(answers);
  const totalWeight = weights.performance + weights.camera + weights.battery + weights.display + weights.storage + weights.extras;

  const filtered = phones.filter(p => passesHardFilters(p, answers));

  const scored: ScoredPhone[] = filtered.map(phone => {
    const breakdown = {
      performance: Math.round(scorePerformance(phone)),
      camera: Math.round(scoreCamera(phone)),
      battery: Math.round(scoreBattery(phone)),
      display: Math.round(scoreDisplay(phone)),
      storage: Math.round(scoreStorage(phone, answers)),
      extrasFit: Math.round(scoreExtras(phone, answers)),
    };

    let fitScore = Math.round(
      (breakdown.performance * weights.performance +
        breakdown.camera * weights.camera +
        breakdown.battery * weights.battery +
        breakdown.display * weights.display +
        breakdown.storage * weights.storage +
        breakdown.extrasFit * weights.extras) / totalWeight
    );

    // Apply soft penalties
    fitScore = Math.max(fitScore - budgetPenalty(phone, answers) - screenSizePenalty(phone, answers), 5);

    const sp: ScoredPhone = {
      ...phone,
      fitScore,
      scoreBreakdown: breakdown,
      whyItFits: generateWhyItFits(phone, answers),
      tradeoffs: generateTradeoffs(phone),
    };

    sp.badge = assignBadge(sp);
    return sp;
  });

  scored.sort((a, b) => b.fitScore - a.fitScore);

  // Ensure variety in badges
  const usedBadges = new Set<string>();
  scored.forEach(p => {
    if (p.badge && usedBadges.has(p.badge)) p.badge = undefined;
    if (p.badge) usedBadges.add(p.badge);
  });

  return scored;
}
