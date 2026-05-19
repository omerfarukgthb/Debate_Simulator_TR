import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Play, 
  Send, 
  Swords, 
  HelpCircle, 
  Trophy, 
  Clock, 
  Award, 
  User, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  BookOpen,
  CornerDownRight,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { PREDEFINED_TOPICS } from "../topicsData";
import { Message, DebateTopic, ActiveDebate } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface JuryVerdictData {
  juryVerdict: string;
  finalVerdictSummary: string;
  userScore: number;
  opponentScore: number;
  learningTakeaways: string[];
}

interface DebateDuelProps {
  themeId?: "classic" | "midnight" | "cyber" | "forest";
}

const CHAR_PROFILES = [
  { id: "owl", name: "Bilge Baykuş 🦉", emoji: "🦉", label: "Bilge Baykuş", motto: "Bilgi en keskin kılıçtır!" },
  { id: "lion", name: "Cesur Aslan 🦁", emoji: "🦁", label: "Cesur Aslan", motto: "Korkusuzca savun, gürle!" },
  { id: "fox", name: "Zeki Tilki 🦊", emoji: "🦊", label: "Zeki Tilki", motto: "Stratejik zeka ve taktik!" },
  { id: "dolphin", name: "Sakin Yunus 🐬", emoji: "🐬", label: "Sakin Yunus", motto: "Zarif, barışçıl ve etkili!" },
  { id: "eagle", name: "Keskin Kartal 🦅", emoji: "🦅", label: "Keskin Kartal", motto: "Yukarıdan bak ve çürüt!" }
];

export default function DebateDuel({ themeId = "classic" }: DebateDuelProps) {
  // Setup State
  const [selectedTopicId, setSelectedTopicId] = useState(PREDEFINED_TOPICS[0].id);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicTitle, setCustomTopicTitle] = useState("");
  const [userPosition, setUserPosition] = useState<"pro" | "con">("pro");
  const [selectedProfileId, setSelectedProfileId] = useState("owl");
  const [studentName, setStudentName] = useState("Bilge Baykuş 🦉");
  const [difficulty, setDifficulty] = useState<"Başlangıç" | "Orta" | "İleri">("Başlangıç");
  
  // Design Variables Computed based on Theme Prop
  const cardClass = themeId === "midnight"
    ? "bg-slate-900 border-slate-800 text-slate-100"
    : themeId === "cyber"
      ? "bg-slate-950/90 border-cyan-500/30 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
      : themeId === "forest"
        ? "bg-white border-emerald-100 text-slate-800"
        : "bg-white border-slate-200 text-slate-800";

  const textMutedClass = themeId === "midnight" || themeId === "cyber" ? "text-slate-400" : "text-slate-500";
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
    ? "bg-slate-800 border-slate-750 text-white focus:ring-indigo-500 focus:border-indigo-500"
    : themeId === "cyber"
      ? "bg-slate-900/80 border-cyan-500/30 text-cyan-100 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
      : "bg-white border-slate-200 text-slate-800 focus:ring-amber-500 focus:border-amber-500";
  
  // Game Play State
  const [activeDebate, setActiveDebate] = useState<ActiveDebate | null>(null);
  const [latestUserMsg, setLatestUserMsg] = useState("");
  const [loadingTurn, setLoadingTurn] = useState(false);
  const [coachAdvice, setCoachAdvice] = useState<string>("Münazaraya başlamak üzeresin! İlk olarak konuya giriş yapmalı ve fikrini tanımlayan net bir iddia sunmalısın. Kanıt eklemeyi unutma!");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Jury Verdict State
  const [loadingJury, setLoadingJury] = useState(false);
  const [verdictResult, setVerdictResult] = useState<JuryVerdictData | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeDebate?.messages, loadingTurn]);

  // Start Debate Game Action
  const handleStartDebate = () => {
    setErrorMsg(null);
    const topic = isCustomTopic 
      ? {
          id: "custom_" + Date.now(),
          title: customTopicTitle,
          description: "Özel seçilmiş münazara konusu.",
          category: "Özel Alan",
          proArguments: [],
          conArguments: [],
          difficulty: difficulty,
          popularInMiddleSchool: false
        }
      : PREDEFINED_TOPICS.find(t => t.id === selectedTopicId);

    if (!topic || (isCustomTopic && !customTopicTitle.trim())) {
      setErrorMsg("Lütfen geçerli bir münazara konusu seçin veya yazın!");
      return;
    }

    const opponentPos = userPosition === "pro" ? "con" : "pro";
    const initialOpponentMsg = userPosition === "pro" 
      ? `Merhaba! Ben senin bugünkü rakibinim. "${topic.title}" konusunda ben "KARŞI" taraftayım. Görüşlerini çok merak ediyorum. Münazara kurallarına göre açılış konuşmasını yapman için sözü sana devrediyorum, başarılar!`
      : `Merhaba! Münazara rakibin olarak buradayım. "${topic.title}" konusunda ben "DESTEKLEYEN (LEHTE)" taraftayım. Kurallara göre ilk iddiayı senin açmanı rica ediyorum. Kozlarımızı paylaşalım!`;

    const initialMessages: Message[] = [
      {
        id: "sys_1",
        sender: "system",
        text: `Münazara başladı! 🎯 Konu: "${topic.title}". Senin Rolün: ${userPosition === "pro" ? "TEZ (Destekleyen)" : "ANTİTEZ (Karşı Çıkan)"}. Rakip Rolü: ${opponentPos === "pro" ? "TEZ" : "ANTİTEZ"}.`,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: "opp_1",
        sender: "opponent",
        text: initialOpponentMsg,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setActiveDebate({
      id: "debate_" + Date.now(),
      topic,
      userPosition,
      opponentPosition: opponentPos,
      messages: initialMessages,
      status: "ongoing",
      roundNumber: 1
    });

    setCoachAdvice("Münazara başladı! Rakibin sözü sana bıraktı. Giriş konuşmanda iddiayı ortaya koy ve 'Çünkü...' diyerek en güçlü nedenlerinden birini açıkla. Sabırlı ve saygılı bir ton kullan!");
    setVerdictResult(null);
    setLatestUserMsg("");
  };

  // Submit User Turn Dialogue
  const onSubmitMessage = async () => {
    if (!activeDebate || !latestUserMsg.trim() || loadingTurn) return;

    setErrorMsg(null);
    const userMsgText = latestUserMsg.trim();
    const currentMessages = [...activeDebate.messages];

    const userMessageObj: Message = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentMessages, userMessageObj];
    setActiveDebate({
      ...activeDebate,
      messages: updatedMessages,
      roundNumber: activeDebate.roundNumber + 1
    });

    setLatestUserMsg("");
    setLoadingTurn(true);

    try {
      const response = await fetch("/api/debate/opponent-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeDebate.topic.title,
          userPosition: activeDebate.userPosition,
          chatHistory: updatedMessages.filter(m => m.sender !== "system"),
          latestMessage: userMsgText
        })
      });

      if (!response.ok) {
        throw new Error("Sunucudan rakip cevabı alınamadı.");
      }

      const turnResult = await response.json();

      const opponentMsgObj: Message = {
        id: "opp_resp_" + Date.now(),
        sender: "opponent",
        text: turnResult.opponentMessage,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' }),
        coachAdvice: turnResult.coachAdvice
      };

      setActiveDebate(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, opponentMsgObj]
        };
      });

      setCoachAdvice(turnResult.coachAdvice);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Rakip cevap verirken bir aksaklık oldu. Lütfen internetini kontrol edip tekrar dene.");
    } finally {
      setLoadingTurn(false);
    }
  };

  // End entire debate & get final verdict
  const handleEndDebateAndGetVerdict = async () => {
    if (!activeDebate || activeDebate.messages.length < 3) {
      setErrorMsg("Jürinin oylayabilmesi için en az birer tur karşılıklı iddia sunmuş olmalısınız!");
      return;
    }

    setLoadingJury(true);
    setErrorMsg(null);

    // Filter status messages
    const actualMessages = activeDebate.messages.filter(m => m.sender !== "system");

    try {
      const response = await fetch("/api/debate/jury-verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeDebate.topic.title,
          userPosition: activeDebate.userPosition,
          chatHistory: actualMessages
        })
      });

      if (!response.ok) {
        throw new Error("Jüri odasından karar çıkamadı.");
      }

      const verdict: JuryVerdictData = await response.json();
      setVerdictResult(verdict);
      
      setActiveDebate({
        ...activeDebate,
        status: "finished"
      });
      setCoachAdvice("Münazara tamamlandı! Jürinin resmî karar belgesini aşağıda inceleyebilirsin. Harika bir gelişim gösterdin!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Jüri değerlendirme yaparken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoadingJury(false);
    }
  };

  const currentTopicData = PREDEFINED_TOPICS.find(t => t.id === selectedTopicId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="debate-duel-section">
      
      {/* 1. SETUP VIEW (Before active debate) */}
      {!activeDebate && (
        <div className={`lg:col-span-8 lg:col-start-3 ${cardClass} rounded-xl p-6 border transition-all duration-300`}>
          <div className="text-center max-w-lg mx-auto mb-6">
            <div className={`w-12 h-12 ${accentBgLight} rounded-full flex items-center justify-center mx-auto mb-3 border`}>
              <Swords className={`w-6 h-6 ${accentColor}`} />
            </div>
            <h2 className="font-display text-2xl font-black tracking-tight text-slate-800">İnteraktif Münazara Düellosu</h2>
            <p className={`${textMutedClass} text-xs mt-1.5 leading-relaxed`}>
              Yapay zekalı rakibinle karşı karşıya gelip tezlerini savunacağın gerçek münazara simülatörü! 
              Sen argümanını sunarken, bilge koçun arkadan sana zayıf halkaları fısıldayacak.
            </p>
          </div>

          <div className="space-y-5">
            {/* Quick-tap Character profile instead of username input */}
            <div>
              <label className={`block text-xs font-bold ${labelClass} mb-2 uppercase tracking-wider`}>
                Münazaracı Kimliğin (Profilini Dokunarak Seç)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CHAR_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProfileId(p.id);
                      setStudentName(p.name);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedProfileId === p.id
                        ? `${accentBgLight} ring-2 ring-amber-500/20 scale-[1.03] border-amber-500`
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <span className="text-2xl" role="img" aria-label={p.name}>{p.emoji}</span>
                    <span className="text-[10px] font-extrabold text-center leading-tight whitespace-nowrap">{p.label}</span>
                    <span className="text-[8px] text-slate-400 font-medium text-center italic hidden sm:block">{p.motto}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic choose */}
            <div>
              <label className={`block text-xs font-bold ${labelClass} mb-1.5 uppercase tracking-wider`}>Münazara Konusu Seçeceği</label>
              <div className="flex gap-2 mb-2">
                <button
                  id="tab-duel-predefined"
                  onClick={() => setIsCustomTopic(false)}
                  className={`flex-1 py-1 px-3 rounded text-xs font-bold border transition-all cursor-pointer ${
                    !isCustomTopic ? "border-amber-600 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"
                  }`}
                >
                  Hazır Konular
                </button>
                <button
                  id="tab-duel-custom"
                  onClick={() => setIsCustomTopic(true)}
                  className={`flex-1 py-1 px-3 rounded text-xs font-bold border transition-all cursor-pointer ${
                    isCustomTopic ? "border-amber-600 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"
                  }`}
                >
                  Kendi Konum
                </button>
              </div>

              {!isCustomTopic ? (
                <select
                  id="duel-topic-select"
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer`}
                >
                  {PREDEFINED_TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      [{topic.category}] {topic.title} ({topic.difficulty})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="duel-custom-topic-input"
                  type="text"
                  placeholder="Kendi münazara konunu buraya yaz sınırsız!"
                  value={customTopicTitle}
                  onChange={(e) => setCustomTopicTitle(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-lg border ${inputClass} focus:outline-none`}
                />
              )}
            </div>

            {/* Position and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Position */}
              <div>
                <label className={`block text-xs font-bold ${labelClass} mb-1.5 uppercase tracking-wider`}>Tarafın</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="duel-btn-pro"
                    onClick={() => setUserPosition("pro")}
                    className={`p-2.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                      userPosition === "pro"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold text-xs text-center block">TEZ</span>
                    <span className="text-[9px] font-normal text-slate-400 block mt-0.5">Destekliyorum</span>
                  </button>
                  <button
                    id="duel-btn-con"
                    onClick={() => setUserPosition("con")}
                    className={`p-2.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                      userPosition === "con"
                        ? "border-red-600 bg-red-50 text-red-800 ring-1 ring-red-500"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold text-xs text-center block">ANTİTEZ</span>
                    <span className="text-[9px] font-normal text-slate-400 block mt-0.5">Karşı çıkıyorum</span>
                  </button>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty-select" className={`block text-xs font-bold ${labelClass} mb-1.5 uppercase tracking-wider`}>Seviye/Zorluk</label>
                <select
                  id="difficulty-select"
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer`}
                >
                  <option value="Başlangıç">Başlangıç Seviyesi (Yumuşak Çürütmeler)</option>
                  <option value="Orta">Orta Seviye (Detaylı Sorgulama)</option>
                  <option value="İleri">İleri Seviye (Dişli ve Argüman Çürüten)</option>
                </select>
              </div>
            </div>


            {/* Helper arguments preview */}
            {!isCustomTopic && currentTopicData && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500">
                <span className="font-bold text-slate-600 uppercase block mb-1 tracking-wider text-[10px]">Bilgi Kartı Ön Okuma:</span>
                <p className="leading-relaxed mb-2">{currentTopicData.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-slate-200/50">
                  <div>
                    <strong className="text-emerald-700 block font-semibold mb-1">Tez (Evet) Savunmaları:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-serif italic">
                      {currentTopicData.proArguments.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-red-700 block font-semibold mb-1">Antitez (Hayır) Savunmaları:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-serif italic">
                      {currentTopicData.conArguments.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Start Duel submit */}
            <button
              id="btn-start-duel"
              onClick={handleStartDebate}
              className={`w-full ${btnPrimary} font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]`}
            >
              <Play className="w-4 h-4" />
              <span>Münazara Düellosunu Başlat!</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE DEBATE SCENARIOS */}
      {activeDebate && (
        <>
          {/* Chat Timeline (Left Side - 8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className={`${cardClass} overflow-hidden flex flex-col h-[550px] rounded-xl border`}>
              
              {/* Active Debate Header */}
              <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Canlı Karşılaşma (Tur {activeDebate.roundNumber})</span>
                  <h3 className="font-display font-black text-sm text-slate-100 truncate max-w-lg">{activeDebate.topic.title}</h3>
                </div>
                <button
                  id="btn-back-to-setup"
                  onClick={() => {
                    if (confirm("Münazaradan çıkmak istediğinize emin misiniz? Puan alamayacaksınız.")) {
                      setActiveDebate(null);
                      setVerdictResult(null);
                    }
                  }}
                  className="text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Çıkış</span>
                </button>
              </div>

              {/* Chat Log Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-slate-800">
                {activeDebate.messages.map((msg) => {
                  if (msg.sender === "system") {
                    return (
                      <div id={`msg-${msg.id}`} key={msg.id} className="text-center">
                        <span className="inline-block bg-slate-200/80 text-slate-700 px-3 py-1 rounded-full text-[10px] font-bold border border-slate-300">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isUser = msg.sender === "user";
                  return (
                    <div
                      id={`msg-${msg.id}`}
                      key={msg.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                        isUser 
                          ? `${btnPrimary} rounded-tr-none text-white` 
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                      }`}>
                        {/* Name header inside message */}
                        <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-white/10 text-[10px] opacity-75">
                          <strong className="font-bold flex items-center gap-1 font-mono uppercase">
                            <User className="w-3 h-3" />
                            {isUser ? (studentName || "Münazaracı") : `Rakip (${difficulty})`}
                          </strong>
                          <span>{msg.timestamp}</span>
                        </div>
                        {/* Message body */}
                        <p className="font-medium font-serif leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {loadingTurn && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-slate-200 shadow-sm max-w-[80%] flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium font-mono">Rakip çürütücü hamlesini yazıyor...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Footer */}
              {activeDebate.status === "ongoing" && (
                <div className="p-3 bg-white border-t border-slate-200 shrink-0 text-slate-800">
                  <div className="flex gap-2">
                    <textarea
                      id="duel-input-textarea"
                      rows={1}
                      disabled={loadingTurn || loadingJury}
                      value={latestUserMsg}
                      onChange={(e) => setLatestUserMsg(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSubmitMessage();
                        }
                      }}
                      placeholder="Buraya tezini, savını veya karşı çürütmeni yaz ve Gönder..."
                      className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500 max-h-24 min-h-[42px]"
                    />
                    <button
                      id="btn-send-duel-msg"
                      onClick={onSubmitMessage}
                      disabled={loadingTurn || loadingJury || !latestUserMsg.trim()}
                      className={`disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 w-11 h-11 cursor-pointer self-end ${btnPrimary}`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">İpucu: Söylediklerini sağlam bir gerekçe (neden) ve kanıta bağla!</span>
                    <button
                      id="btn-jury-verdict"
                      onClick={handleEndDebateAndGetVerdict}
                      disabled={loadingTurn || loadingJury || activeDebate.messages.length < 3}
                      className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-black py-1 px-3 rounded-lg border border-red-500 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Jüriden Resmi Karar Talebi 📜</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* loading jury box */}
            {loadingJury && (
              <div className="bg-white rounded-xl p-10 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <Award className="w-12 h-12 text-red-600 animate-spin mb-3" />
                <h4 className="font-display font-bold text-base text-slate-800">Jüri Değerlendirme Komitesi Toplanıyor ⚖️</h4>
                <p className="text-slate-500 text-xs max-w-md mt-2 leading-relaxed">
                  Bağlantılı jüri heyetimiz, sunduğunuz argümanların kelime dökümünü, mantıksal çıkmazları ve ikna ritimlerini en baştan okuyor. Kazananı belirlemek için son oylama yapılıyor, lütfen sayfayı kapatmayın...
                </p>
              </div>
            )}

            {/* 3. JURY VERDICT CERTIFICATE */}
            {verdictResult && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50/20 border-2 border-amber-600/40 rounded-xl p-6 shadow-md overflow-hidden bg-[radial-gradient(#d9770611_1px,transparent_1px)] bg-[size:16px_16px]"
              >
                {/* Royal Jury Header */}
                <div className="text-center pb-5 border-b-2 border-dashed border-amber-600/20">
                  <div className="inline-block bg-amber-600/10 border border-amber-500 rounded-full py-1 px-3 mb-2">
                    <span className="font-mono text-[9px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-600 animate-bounce" />
                      Münazara Jürisi Gerekçeli Karar Belgesi
                    </span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-slate-800 tracking-tight mt-1">RESMÎ SEÇİM KARARI VE BEYANNAMESİ</h3>
                </div>

                {/* Performance Dials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-amber-600/10">
                  {/* Student */}
                  <div id="jury-student-score" className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center flex flex-col justify-center items-center">
                    <Award className="w-8 h-8 text-amber-600 mb-1" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Metrik Performans Puanın</span>
                    <div className="text-4xl font-display font-black text-slate-800 mt-1">
                      {verdictResult.userScore}
                      <span className="text-lg text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="w-full max-w-[150px] bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${verdictResult.userScore}%` }}></div>
                    </div>
                  </div>

                  {/* Opponent */}
                  <div id="jury-opponent-score" className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center flex flex-col justify-center items-center">
                    <Award className="w-8 h-8 text-indigo-600 mb-1" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rakip Performans Puanı</span>
                    <div className="text-4xl font-display font-black text-slate-800 mt-1">
                      {verdictResult.opponentScore}
                      <span className="text-lg text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="w-full max-w-[150px] bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${verdictResult.opponentScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Verdict text details */}
                <div className="mt-5 space-y-4">
                  {/* Winner Announcement */}
                  <div className="bg-amber-600 text-white rounded-xl p-4 shadow-inner flex gap-3 items-center">
                    <Trophy className="w-8 h-8 shrink-0 text-yellow-300 animate-pulse" />
                    <div>
                      <strong className="text-[10px] font-mono text-amber-200 uppercase tracking-widest font-bold">Resmî Gerekçe Özeti</strong>
                      <p className="font-serif font-black text-sm mt-0.5 leading-relaxed">{verdictResult.finalVerdictSummary}</p>
                    </div>
                  </div>

                  {/* Full Jury explanation report */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
                    <strong className="text-slate-800 text-xs font-bold font-mono uppercase tracking-wider block">Gerekçeli Mahkeme Raporu:</strong>
                    <p className="text-slate-600 text-xs font-serif leading-relaxed whitespace-pre-line">{verdictResult.juryVerdict}</p>
                  </div>

                  {/* 3 takeaways */}
                  <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200">
                    <strong className="text-slate-800 text-xs font-extrabold uppercase tracking-wider block mb-2.5">💡 Cebindeki 3 Altın Taktik (Gelişim Notları):</strong>
                    <ul className="space-y-2">
                      {verdictResult.learningTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex gap-2 items-start leading-relaxed">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reset button */}
                  <button
                    id="btn-duel-reset"
                    onClick={() => {
                      setActiveDebate(null);
                      setVerdictResult(null);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Münazara Karşılaşmasını Kapat ve Yeni Düello Kur!</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}

        {/* Floating Coach Tips Panel (Right Side - 4 Cols) */}
        {activeDebate && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 sticky top-4">
              
              {/* Leader Avatar representation */}
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-200 shadow-sm relative">
                  <span className="text-3xl">🦉</span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
                </div>
                <h4 className="font-display font-extrabold text-sm text-slate-800">Bilge Koç Köşesi</h4>
                <p className="text-[10px] text-slate-400 font-medium">Büyük Karşılaşma Yardımcın • Aktif Dinleme Modu</p>
              </div>

              {/* Coach Whispering box */}
              <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 shadow-inner">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block mb-1">Gizli Fısıltı / Strateji yardımı</span>
                <p className="text-slate-700 text-xs italic leading-relaxed whitespace-pre-line">
                  "{coachAdvice}"
                </p>
              </div>

              {/* Recommended structure alert card */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150 text-[11px] text-slate-500 space-y-1">
                <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">İdeal Sağlam Şablon (İ-D-K):</h5>
                <p className="text-slate-600">Başarılı bir münazaracı argümanını 3 adımda yazar:</p>
                <ul className="list-disc pl-4 space-y-0.5 mt-1">
                  <li><strong>İddia:</strong> Neyi savunuyorsun?</li>
                  <li><strong>Gerekçe:</strong> Neden bu doğru? Mantığı ne?</li>
                  <li><strong>Kanıt:</strong> Hangi veri, istatistik veya gözlem bunu destekliyor?</li>
                </ul>
              </div>

              {/* Quick instructions cheat sheet */}
              <div className="bg-indigo-50/30 p-3 rounded-lg border border-indigo-100 text-[10px] text-indigo-700 space-y-1">
                <strong className="font-bold uppercase text-[9px] tracking-wider block">⚠️ Jürinin Sevmediği Şeyler (Ceza Puanı Alırsın!):</strong>
                <ul className="list-disc pl-3.5 space-y-0.5">
                  <li>Rakibe ve kişiliğine laf atmak (Ad Hominem)</li>
                  <li>Kanıt sunmadan sadece 'bence öyle' deyip geçmek</li>
                  <li>"Herkes biliyor ki..." gibi genellemeler yapmak</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
