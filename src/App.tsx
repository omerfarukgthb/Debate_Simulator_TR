import React, { useState } from "react";
import { 
  Swords, 
  Award, 
  BookOpen, 
  Sparkles, 
  Compass, 
  HelpCircle,
  GraduationCap,
  Sparkle,
  Palette
} from "lucide-react";
import DebateDuel from "./components/DebateDuel";
import ArgumentLab from "./components/ArgumentLab";
import FallacyGuide from "./components/FallacyGuide";
import { motion } from "motion/react";

export type ThemeID = "classic" | "midnight" | "cyber" | "forest";

interface ThemeColors {
  id: ThemeID;
  name: string;
  emoji: string;
  dotColor: string;
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  heading: string;
  accent: string;
  badge: string;
  barColor: string;
  activeTabClass: string;
  inactiveTabClass: string;
  footerBox: string;
}

export const THEMES: ThemeColors[] = [
  {
    id: "classic",
    name: "Klasik Akademi",
    emoji: "📜",
    dotColor: "bg-amber-600",
    bg: "bg-amber-50/10 text-slate-800",
    card: "bg-white border-slate-200 shadow-sm",
    text: "text-slate-700",
    textMuted: "text-slate-500",
    heading: "text-slate-900",
    accent: "text-amber-600",
    badge: "text-amber-700 bg-amber-50 border-amber-200",
    barColor: "bg-slate-900 border-slate-800",
    activeTabClass: "bg-slate-900 text-white shadow-sm font-black",
    inactiveTabClass: "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
    footerBox: "bg-white border-slate-200 shadow-sm"
  },
  {
    id: "midnight",
    name: "Gece Meclisi",
    emoji: "🌌",
    dotColor: "bg-indigo-600",
    bg: "bg-slate-950 text-slate-100",
    card: "bg-slate-900 border-slate-800/80 shadow-xl",
    text: "text-slate-300",
    textMuted: "text-slate-500",
    heading: "text-indigo-300",
    accent: "text-indigo-400",
    badge: "text-indigo-400 bg-indigo-950/70 border-indigo-900",
    barColor: "bg-slate-950 border-b border-indigo-950",
    activeTabClass: "bg-indigo-600 text-white shadow-sm font-black",
    inactiveTabClass: "text-slate-400 hover:text-slate-200 hover:bg-slate-800",
    footerBox: "bg-slate-900 border-slate-850 shadow-md"
  },
  {
    id: "cyber",
    name: "Siber Kürsü",
    emoji: "👾",
    dotColor: "bg-cyan-500",
    bg: "bg-[#0b071e] text-cyan-200",
    card: "bg-slate-950/90 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]",
    text: "text-slate-200",
    textMuted: "text-cyan-600/70",
    heading: "text-fuchsia-400 font-mono",
    accent: "text-cyan-400",
    badge: "text-cyan-400 bg-cyan-950/50 border-cyan-500/30",
    barColor: "bg-black border-cyan-950",
    activeTabClass: "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-950 font-black shadow-lg",
    inactiveTabClass: "text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/30",
    footerBox: "bg-slate-950/90 border-cyan-500/20"
  },
  {
    id: "forest",
    name: "Doğa & Mantık",
    emoji: "🍃",
    dotColor: "bg-emerald-600",
    bg: "bg-emerald-50/20 text-slate-800",
    card: "bg-white border-emerald-100 shadow-sm",
    text: "text-slate-700",
    textMuted: "text-slate-500",
    heading: "text-emerald-900",
    accent: "text-emerald-600",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    barColor: "bg-emerald-950 border-emerald-900",
    activeTabClass: "bg-emerald-900 text-white shadow-sm font-black",
    inactiveTabClass: "text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50/40",
    footerBox: "bg-white border-emerald-100 shadow-sm"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"duel" | "lab" | "fallacies">("duel");
  const [activeThemeId, setActiveThemeId] = useState<ThemeID>(() => {
    return (localStorage.getItem("munazara_theme") as ThemeID) || "classic";
  });

  const handleThemeChange = (id: ThemeID) => {
    setActiveThemeId(id);
    try {
      localStorage.setItem("munazara_theme", id);
    } catch (_) {}
  };

  const currentTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  return (
    <div className={`min-h-screen ${currentTheme.bg} pb-12 font-sans overflow-x-hidden transition-colors duration-350 selection:bg-amber-100 selection:text-amber-900`}>
      
      {/* Academy Premium Top Banner / Utilities */}
      <div className={`${currentTheme.barColor} py-1 text-center shrink-0 transition-colors duration-300`}>
        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center justify-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 animate-pulse" />
          Türkiye Okullar Arası Münazara Birliği Dijital Eğitim Portalı
        </span>
      </div>

      {/* Main Hero Header Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className={`flex flex-col md:flex-row justify-between items-center ${currentTheme.card} rounded-2xl border p-6 transition-all duration-300 gap-4`}>
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-600 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-3xl" role="img" aria-label="owl-mascot">🦉</span>
            </div>
            <div>
              <h1 className={`font-display font-extrabold text-3xl ${currentTheme.heading} tracking-tight flex items-center justify-center md:justify-start gap-2`}>
                MÜNAZARA KOÇU
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mt-1 font-medium leading-relaxed">
                Ortaokul öğrencileri için hazırlanmış eğlenceli ve öğretici münazara akademisi. 
                Burada tezlerini savunun, jüriden karne alın ve safsata tuzaklarından kaçınmayı öğrenin!
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            {/* Theme Picker design selector */}
            <div className="flex items-center gap-2 bg-slate-50/5 hover:bg-slate-50/10 p-2 rounded-xl border border-dashed border-slate-300/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Tasarım:
              </span>
              <div className="flex gap-1.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    title={theme.name}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:scale-110 relative cursor-pointer ${
                      activeThemeId === theme.id
                        ? "ring-2 ring-amber-500 ring-offset-2 scale-105"
                        : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <span>{theme.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] block font-mono text-slate-400 font-bold uppercase">Münazara Seviyeniz</span>
              <span className={`text-xs font-bold ${currentTheme.badge} px-2 py-0.5 rounded block mt-0.5`}>Kursiyer Münazaracı 🎓</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid & Tabs Panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-6">
        
        {/* Rounded Tab Buttons Section */}
        <div className={`flex justify-center md:justify-start p-1 ${currentTheme.card} rounded-xl border max-w-fit mx-auto md:mx-0 gap-1`}>
          <button
            id="tab-btn-duel"
            onClick={() => setActiveTab("duel")}
            className={`py-2 px-4 rounded-lg text-xs font-extrabold flex items-center gap-2 border border-transparent transition-all cursor-pointer ${
              activeTab === "duel"
                ? currentTheme.activeTabClass
                : currentTheme.inactiveTabClass
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Münazara Düellosu (AI Rakip)</span>
          </button>

          <button
            id="tab-btn-lab"
            onClick={() => setActiveTab("lab")}
            className={`py-2 px-4 rounded-lg text-xs font-extrabold flex items-center gap-2 border border-transparent transition-all cursor-pointer ${
              activeTab === "lab"
                ? currentTheme.activeTabClass
                : currentTheme.inactiveTabClass
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Argüman Laboratuvarı</span>
          </button>

          <button
            id="tab-btn-fallacies"
            onClick={() => setActiveTab("fallacies")}
            className={`py-2 px-4 rounded-lg text-xs font-extrabold flex items-center gap-2 border border-transparent transition-all cursor-pointer ${
              activeTab === "fallacies"
                ? currentTheme.activeTabClass
                : currentTheme.inactiveTabClass
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Safsata Rehberi & Oyunu</span>
          </button>
        </div>

        {/* Dynamic Display Rendering */}
        <div className="min-h-[400px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "duel" && <DebateDuel themeId={activeThemeId} />}
            {activeTab === "lab" && <ArgumentLab themeId={activeThemeId} />}
            {activeTab === "fallacies" && <FallacyGuide themeId={activeThemeId} />}
          </motion.div>
        </div>

        {/* Common Help / Quick Strategy Tip Banner & Disclaimer */}
        <footer className="pt-8 border-t border-slate-200/50 text-center space-y-3">
          <div className={`max-w-md mx-auto ${currentTheme.footerBox} p-4 rounded-xl border`}>
            <div className="flex items-start gap-2 text-left">
              <Compass className={`w-4 h-4 ${currentTheme.accent} shrink-0 mt-0.5`} />
              <div>
                <strong className="text-xs font-bold font-mono">Bugünlük Altın Kural:</strong>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                  Güçlü bir münazaracı asla rakibinin kişiliğine laf atmaz. Daima onun argümanındaki fikirlere karşı "Kanıt, İstatistik veya Gözlemler" ile cevap verir. Doğruları samimiyetle savunun!
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-400 font-medium">
            Münazara Koçu Akademi Platformu • Tüm Hakları Saklıdır © {new Date().getFullYear()}
          </div>
        </footer>

      </main>
    </div>
  );
}
