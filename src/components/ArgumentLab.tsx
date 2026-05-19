import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle,
  Clock,
  BookOpen,
  CornerDownRight,
  Shield,
  Trash2
} from "lucide-react";
import { PREDEFINED_TOPICS } from "../topicsData";
import { EvaluationResult, SavedAnalysis } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ArgumentLabProps {
  themeId?: "classic" | "midnight" | "cyber" | "forest";
}

export default function ArgumentLab({ themeId = "classic" }: ArgumentLabProps) {
  const [selectedTopicId, setSelectedTopicId] = useState(PREDEFINED_TOPICS[0].id);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicTitle, setCustomTopicTitle] = useState("");
  const [position, setPosition] = useState<"pro" | "con">("pro");
  const [argumentText, setArgumentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Design Variables Computed based on Theme Prop
  const cardClass = themeId === "midnight"
    ? "bg-slate-900 border-slate-800 text-slate-100"
    : themeId === "cyber"
      ? "bg-slate-950/90 border-cyan-500/30 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
      : themeId === "forest"
        ? "bg-white border-emerald-100 text-slate-800"
        : "bg-white border-slate-200 text-slate-800";

  const textMutedClass = themeId === "midnight" || themeId === "cyber" ? "text-slate-450" : "text-slate-500";
  const labelClass = themeId === "midnight" || themeId === "cyber" ? "text-slate-300" : "text-slate-600";

  const btnPrimary = themeId === "midnight"
    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/15"
    : themeId === "cyber"
      ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-950 font-black hover:opacity-95"
      : themeId === "forest"
        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
        : "bg-amber-600 hover:bg-amber-700 text-white";

  const accentColor = themeId === "midnight"
    ? "text-indigo-400"
    : themeId === "cyber"
      ? "text-cyan-400"
      : themeId === "forest"
        ? "text-emerald-700"
        : "text-amber-600";

  const accentBgLight = themeId === "midnight"
    ? "bg-indigo-950/50 border-indigo-900 text-indigo-200"
    : themeId === "cyber"
      ? "bg-cyan-950/40 border-cyan-500/20 text-cyan-300"
      : themeId === "forest"
        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
        : "bg-amber-50 border-amber-200 text-amber-900";

  const badgeClass = themeId === "midnight"
    ? "border-indigo-900 bg-indigo-950 text-indigo-400"
    : themeId === "cyber"
      ? "border-cyan-500/30 bg-cyan-950/50 text-cyan-400"
      : themeId === "forest"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  const inputClass = themeId === "midnight"
    ? "bg-slate-800 border-slate-755 text-white focus:ring-indigo-500 focus:border-indigo-500"
    : themeId === "cyber"
      ? "bg-slate-900/80 border-cyan-500/30 text-cyan-100 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
      : "bg-white border-slate-200 text-slate-800 focus:ring-amber-500 focus:border-amber-500";

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("munazara_lab_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  // Save history helper
  const saveToHistory = (topicStr: string, text: string, pos: "pro" | "con", evalRes: EvaluationResult) => {
    const freshItem: SavedAnalysis = {
      id: "analysis_" + Date.now(),
      topic: topicStr,
      argument: text,
      position: pos,
      evaluation: evalRes,
      timestamp: new Date().toLocaleString("tr-TR")
    };
    const updated = [freshItem, ...history.slice(0, 9)]; // Keep max 10
    setHistory(updated);
    try {
      localStorage.setItem("munazara_lab_history", JSON.stringify(updated));
    } catch (_) {}
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem("munazara_lab_history", JSON.stringify(updated));
    } catch (_) {}
  };

  const handleEvaluate = async () => {
    setErrorMsg(null);
    if (!argumentText.trim()) {
      setErrorMsg("Lütfen değerlendirmek istediğiniz argüman metnini yazın!");
      return;
    }

    const topicTitle = isCustomTopic 
      ? customTopicTitle 
      : PREDEFINED_TOPICS.find(t => t.id === selectedTopicId)?.title || "Bilinmeyen Konu";

    if (isCustomTopic && !customTopicTitle.trim()) {
      setErrorMsg("Lütfen özel münazara konunuzu yazın!");
      return;
    }

    setLoading(true);
    setEvaluation(null);

    try {
      const response = await fetch("/api/debate/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicTitle,
          argument: argumentText,
          position: position
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Sunucu hatası");
      }

      const result: EvaluationResult = await response.json();
      setEvaluation(result);
      saveToHistory(topicTitle, argumentText, position, result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Argüman analiz edilirken bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: SavedAnalysis) => {
    setArgumentText(item.argument);
    setPosition(item.position);
    setEvaluation(item.evaluation);
    setErrorMsg(null);
    
    // Check if topic is predefined, match id, else custom
    const matched = PREDEFINED_TOPICS.find(t => t.title === item.topic);
    if (matched) {
      setSelectedTopicId(matched.id);
      setIsCustomTopic(false);
    } else {
      setIsCustomTopic(true);
      setCustomTopicTitle(item.topic);
    }
  };

  const currentPredefinedTopic = PREDEFINED_TOPICS.find(t => t.id === selectedTopicId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="argument-lab-section">
      {/* Input panel (Left Side) - occupying 5 spaces on large screens */}
      <div className="lg:col-span-5 space-y-4">
        <div className={`${cardClass} rounded-xl p-5 border transition-all duration-300`}>
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2 mb-3">
            <Sparkles className={`${accentColor} w-5 h-5`} />
            <span className={`${themeId === "classic" || themeId === "forest" ? "text-slate-800" : "text-white opacity-95"}`}>Argümanını Puanla ve Geliştir</span>
          </h2>
          <p className={`${textMutedClass} text-xs leading-relaxed mb-4`}>
            Bir münazara tezi seç, kendi tarafını belirle ve aklına gelen ilk iddiaları yaz. Jürimiz seni tarafsızca puanlarken, dijital koçun kelimelerini nasıl sihirli bir şampiyon argümana dönüştürebileceğini gösterecek!
          </p>

          <div className="space-y-4">
            {/* Topic Switcher */}
            <div>
              <label htmlFor="topic-select" className={`block text-xs font-bold ${labelClass} mb-1.5 uppercase tracking-wider`}>Münazara Konusu</label>
              
              <div className="flex gap-2 mb-2">
                <button
                  id="tab-predefined-topics"
                  onClick={() => setIsCustomTopic(false)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    !isCustomTopic 
                      ? "border-amber-600 bg-amber-50 text-amber-700 font-extrabold" 
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Önerilen Konular
                </button>
                <button
                  id="tab-custom-topic"
                  onClick={() => setIsCustomTopic(true)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isCustomTopic 
                      ? "border-amber-600 bg-amber-50 text-amber-700 font-extrabold" 
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Kendi Konunu Yaz
                </button>
              </div>

              {!isCustomTopic ? (
                <select
                  id="topic-select"
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {PREDEFINED_TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="custom-topic-input"
                  type="text"
                  placeholder="Münazara konusunu girin (Örn: Hayvanlar sirklerde çalıştırılmamalıdır)..."
                  value={customTopicTitle}
                  onChange={(e) => setCustomTopicTitle(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-lg border ${inputClass} focus:outline-none`}
                />
              )}
            </div>


            {/* Position Selection */}
            <div>
              <span className={`block text-xs font-bold ${labelClass} mb-1.5 uppercase tracking-wider`}>Sen hangi tarafı savunuyorsun?</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-pos-pro"
                  onClick={() => setPosition("pro")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    position === "pro"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
                      : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${position === "pro" ? "text-emerald-600" : "text-slate-400"}`} />
                  <div>
                    <span className="block font-extrabold font-sans text-xs">Tez (Evet)</span>
                    <span className="text-[9px] font-normal text-slate-400 block -mt-0.5">Destekliyorum</span>
                  </div>
                </button>

                <button
                  id="btn-pos-con"
                  onClick={() => setPosition("con")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    position === "con"
                      ? "border-red-600 bg-red-50 text-red-000 ring-1 ring-red-500"
                      : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${position === "con" ? "text-red-000" : "text-slate-400"}`} />
                  <div>
                    <span className="block font-extrabold font-sans text-xs">Antitez (Hayır)</span>
                    <span className="text-[9px] font-normal text-slate-400 block -mt-0.5">Karşıyım</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Hint / Helper box for topic arguments to trigger students */}
            {!isCustomTopic && currentPredefinedTopic && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex gap-2 items-start text-xs">
                  <BookOpen className={`w-4 h-4 ${accentColor} mt-0.5 shrink-0`} />
                  <div>
                    <strong className="text-slate-700 font-bold">Kullanabileceğin Yardımcı Fikirler:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-600">
                      {(position === "pro" ? currentPredefinedTopic.proArguments : currentPredefinedTopic.conArguments).map((arg, idx) => (
                        <li key={idx} className="italic text-[11px] leading-relaxed">{arg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Main Argument Input */}
            <div>
              <label htmlFor="argument-textarea" className={`block text-xs font-bold ${labelClass} mb-1 uppercase tracking-wider`}>Senin Argümanın</label>
              <textarea
                id="argument-textarea"
                rows={5}
                placeholder="Örn: Bence üniformalar kaldırılmalıdır. Çünkü herkes aynı giyinince öğrenciler mutsuz oluyor, kendi tarzını yansıtamıyorlar. Ayrıca üniformalar kışın sıcak yazın serin tutmuyor ve rahatsızlar..."
                value={argumentText}
                onChange={(e) => setArgumentText(e.target.value)}
                className={`w-full text-xs p-3 rounded-lg border ${inputClass} placeholder-slate-400 focus:outline-none`}
              />
            </div>


            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              id="btn-evaluate-argument"
              onClick={handleEvaluate}
              disabled={loading}
              className={`w-full ${btnPrimary} py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]`}
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Jüri & Koç İnceliyor, Lütfen Bekleyin...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Argümanımı Analiz Et ve Geliştir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* History of Saved arguments */}
        {history.length > 0 && (
          <div className={`${cardClass} rounded-xl p-5 border shadow-sm`}>
            <h3 className={`text-xs font-extrabold ${labelClass} uppercase tracking-widest mb-3 flex items-center gap-1.5`}>
              <Clock className="w-4 h-4 text-slate-400" />
              Önceki Analizlerim ({history.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  id={`history-${item.id}`}
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="p-2.5 rounded-lg border border-slate-150 hover:border-amber-400 bg-slate-50/50 hover:bg-white text-left transition-all text-xs cursor-pointer flex justify-between items-start gap-1.5 text-slate-800"
                >
                  <div className="space-y-0.5 truncate flex-1">
                    <strong className="text-slate-800 block truncate font-semibold">{item.topic}</strong>
                    <span className="text-[10px] text-slate-400 italic block truncate">"{item.argument}"</span>

                    <span className={`inline-block px-1.5 py-0.2 text-[9px] rounded font-bold ${
                      item.position === "pro" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      {item.position === "pro" ? "Tez" : "Antitez"}
                    </span>
                    <span className="text-[9px] text-slate-400 ml-2">{item.timestamp}</span>
                  </div>
                  <button
                    id={`delete-history-${item.id}`}
                    onClick={(e) => deleteHistoryItem(item.id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all shrink-0 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output results (Right Side) - 7 column grid space */}
      <div className="lg:col-span-7 space-y-4">
        {loading && (
          <div className={`${cardClass} rounded-xl p-12 border shadow-sm h-full flex flex-col justify-center items-center text-center`}>
            <div className={`w-16 h-16 ${accentBgLight} rounded-full flex items-center justify-center mb-4 border animate-bounce`}>
              <Sparkles className={`w-8 h-8 ${accentColor} animate-spin`} />
            </div>
            <h3 className="font-display font-bold text-lg">Argüman Laboratuvarı Çalışıyor 🧪</h3>
            <p className={`${textMutedClass} text-xs max-w-sm mt-2 leading-relaxed`}>
              Jüri üyelerimiz argümanındaki kanıtları ve mantıksal yapıyı tartıyor; koçunuz ise bu fikri kusursuzlaştıracak sihirli cümleleri hazırlıyor...
            </p>
          </div>
        )}

        {!loading && !evaluation && (
          <div className={`${cardClass} rounded-xl p-12 border shadow-sm h-full flex flex-col justify-center items-center text-center`}>
            <HelpCircle className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
            <h3 className="font-display font-medium text-sm">Laboratuvarda Analiz Bekleniyor</h3>
            <p className={`${textMutedClass} text-xs max-w-xs mt-1 leading-relaxed`}>
              Soldaki formdan konuyu seçip argümanını girerek analiz işlemini başlatabilirsin.
            </p>
          </div>
        )}

        {evaluation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* 1. Scorecard Panel */}
            <div className={`${cardClass} rounded-xl p-5 border shadow-sm`}>
              <span className={`font-mono text-[9px] ${accentColor} font-bold tracking-widest uppercase mb-1.5 block`}>Jüri Değerlendirme Raporu</span>
              <h3 className="font-display text-lg font-extrabold border-b border-slate-100 pb-2 mb-4">Münazara Skor Tablosu (10 Üzerinden)</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Score 1 */}
                <div id="score-structure" className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-center text-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Argüman Yapısı</span>
                  <div className="text-xl font-display font-extrabold text-amber-600">
                    {evaluation.scores.structure}
                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${evaluation.scores.structure * 10}%` }}></div>
                  </div>
                </div>


                {/* Score 2 */}
                <div id="score-evidence" className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Kanıt ve Destek</span>
                  <div className="text-xl font-display font-extrabold text-emerald-600">
                    {evaluation.scores.evidence}
                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${evaluation.scores.evidence * 10}%` }}></div>
                  </div>
                </div>

                {/* Score 3 */}
                <div id="score-persuasion" className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">İkna Gücü</span>
                  <div className="text-xl font-display font-extrabold text-indigo-600">
                    {evaluation.scores.persuasion}
                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${evaluation.scores.persuasion * 10}%` }}></div>
                  </div>
                </div>

                {/* Score 4 */}
                <div id="score-fallacies" className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1" title="Tuzak hatalardan korunma derecesi">Bilimsel Tutarlılık</span>
                  <div className="text-xl font-display font-extrabold text-rose-600">
                    {evaluation.scores.fallacies}
                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${evaluation.scores.fallacies * 10}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Logical Fallacy Alert Box */}
            {evaluation.fallaciesFound && evaluation.fallaciesFound.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-xs text-red-800 uppercase tracking-wider mb-1">Mantık Hatası (Safsata) Tuzağı Tespit Edildi! 🙅‍♂️</h4>
                  <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 mt-1 leading-relaxed">
                    {evaluation.fallaciesFound.map((fallacy, idx) => (
                      <li key={idx} className="font-medium">{fallacy}</li>
                    ))}
                  </ul>
                  <span className="text-[10px] text-slate-400 block mt-2">İpucu: Sağ üstteki "Safsata Rehberi" sekmesine giderek bu tuzakların örneklerini inceleyebilirsin.</span>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-xs text-emerald-800 uppercase tracking-wider">Kusursuz Mantıksal Tutarlılık! 🛡️</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">Argümanında mantık hatası/safsata tuzağına rastlanmadı. Jüri, safsata yapmama disiplininden ötürü seni tebrik ediyor!</p>
                </div>
              </div>
            )}

            {/* 3. Dual Critique Cards (Praise vs Criticism) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mentors Praise */}
              <div className="bg-emerald-50/20 rounded-xl p-4 border border-emerald-100/80">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-emerald-700 text-lg">👩‍🏫</span>
                  <h4 className="font-display font-extrabold text-xs text-emerald-800 uppercase tracking-wider">Öğretmenimin Övgüleri</h4>
                </div>
                <ul className="space-y-2">
                  {evaluation.positives.map((pos, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex gap-2 items-start leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Juries strictly but construct critique */}
              <div className="bg-red-50/10 rounded-xl p-4 border border-red-100/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-amber-800 text-lg">⚖️</span>
                  <h4 className="font-display font-extrabold text-xs text-amber-800 uppercase tracking-wider">Jüriden Yapıcı Eleştiriler</h4>
                </div>
                <ul className="space-y-2">
                  {evaluation.criticisms.map((crit, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex gap-2 items-start leading-relaxed">
                      <span className="text-amber-600 font-bold shrink-0">!</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Beautiful Framed Rewrite "Şöyle Yazabilirdin" */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-amber-600 px-4 py-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white animate-spin" />
                <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Şampiyon Münazara Örneği ("Şöyle Yazabilirdin")</h4>
              </div>
              <div className="p-4 bg-amber-50/10 border-b border-dashed border-slate-100">
                <div className="flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="font-serif font-medium text-slate-800 text-sm leading-relaxed whitespace-pre-line select-all">
                    "{evaluation.improvedExample}"
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 text-[10px] text-slate-500 font-medium flex items-center justify-between">
                <span>💡 Bu taslağı kopyalayıp, konuşmanda nasıl somut veriler ve iddia-kanıt dengesi kurulduğunu incele!</span>
              </div>
            </div>

            {/* 5. Coach Tips Box & Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-xl">🦉</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-slate-800 text-xs font-bold font-mono">Bilge Koç Köşesi:</strong>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      {evaluation.overallSummary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <strong className="text-slate-700 text-[10px] font-bold uppercase tracking-wider">Bir Sonraki Adım İçin Taktikler</strong>
                    <ul className="list-disc pl-4 mt-1.5 text-xs text-slate-600 space-y-1">
                      {evaluation.coachTips.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
