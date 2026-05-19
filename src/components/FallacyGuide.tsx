import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  RefreshCw, 
  Info, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Fallacy {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  description: string;
  badScenario: string;
  goodAlternative: string;
  coachAdvice: string;
}

const FALLACIES: Fallacy[] = [
  {
    id: "hasty",
    name: "Acele Genelleme",
    englishName: "Hasty Generalization",
    icon: "🐈",
    description: "Sadece bir veya birkaç küçük örneğe bakarak, o gruptaki HER ŞEY ve HERKES hakkında kesin bir yargıya varmaktır.",
    badScenario: "Örn: 'Sınıf arkadaşım Can ödevini yapmamıştı. Bütün erkek çocukları zaten tembel!'",
    goodAlternative: "Doğrusu: 'Bazı arkadaşlarımız zaman yönetiminde zorlanabiliyor, ancak bunu cinsiyete veya kitleye genellemek yanlıştır.'",
    coachAdvice: "Koç Tüyosu: Cümlede 'herkes', 'hiç kimse', 'hepsi', 'her zaman' kelimeleri sık geçiyorsa acele genelleme tuzağına düşülüyor olabilir!"
  },
  {
    id: "strawman",
    name: "Korkuluk (Hasır Adam) Safsatası",
    englishName: "Strawman Fallacy",
    icon: "🌾",
    description: "Rakibin gerçek argümanını çarpıtıp abartarak, savunması imkansız yapay bir korkuluk yaratmak ve gerçekmiş gibi ona saldırmaktır.",
    badScenario: "Örn: Sen dedin ki: 'Okulda teneffüsler 5 dakika daha uzasa iyi olur.' Rakip dedi ki: 'Yani sen dersleri tamamen sabote edip okulu bir parti alanına çevirmek istiyorsun!'",
    goodAlternative: "Doğrusu: 'Teneffüsün uzaması ders süresini kısaltıp eğitim kalitesini düşürebilir, bunu başka çözümlerle tartışalım.'",
    coachAdvice: "Koç Tüyosu: Rakibin senin sözlerini 'Yani sen şunu demek istiyorsun...' diyerek uca götürdüğünü fark edersen, 'Ben bunu demedim' diyerek argümanını hemen jüriye hatırlat!"
  },
  {
    id: "adhominem",
    name: "Kişiye Saldırı",
    englishName: "Ad Hominem",
    icon: "🛑",
    description: "Rakibin sunduğu fikre/argümana cevap vermek yerine, doğrudan onun kişiliğine, dış görünüşüne veya geçmişine saldırarak onu değersizleştirmektir.",
    badScenario: "Örn: 'Bizimle çevre temizliği tartışıyorsun ama daha geçen hafta Türkçe sınavından 40 aldın! Sen daha dersi geçemiyorsun!'",
    goodAlternative: "Doğrusu: 'Görüşlerin çevre koruma konusunda değerli olabilir ancak sunduğun bu verilerin bilimsel kaynağı yetersiz.'",
    coachAdvice: "Koç Tüyosu: Fikir yerine kişisel durumlar tartışılıyorsa bu bir ad hominem'dir ve jüri gözünde büyük bir ceza sebebidir!"
  },
  {
    id: "falsedilemma",
    name: "Yalancı İkilem (Siyah-Beyaz)",
    englishName: "False Dilemma",
    icon: "☯️",
    description: "Ortada çok sayıda seçenek veya orta yol varken, sanki sadece iki uç seçenek varmış gibi sunup insanları bunlardan birini seçmeye zorlamaktır.",
    badScenario: "Örn: 'Ya okul üniformasını desteklersin ya da okulda zengin-fakir kavgalarının çıkmasını istiyorsundur!'",
    goodAlternative: "Doğrusu: 'Eşitliği korumak için tek tip kiyafet dışında, okul arması veya ortak aksesuarlar gibi farklı orta yollar da bulunabilir.'",
    coachAdvice: "Koç Tüyosu: Rakibin seni 'Ya X ya Y' diye köşeye sıkıştırıyorsa üçüncü, dördüncü alternatifleri sunarak onun bu yalan dünyasını hemen yık!"
  },
  {
    id: "bandwagon",
    name: "Sürüye Uyma (Çoğunluk)",
    englishName: "Bandwagon Fallacy",
    icon: "🚲",
    description: "Bir fikrin, sırf çoğunluk tarafından kabul ediliyor veya yapılıyor diye doğru veya en iyi olduğunu iddia etmektir.",
    badScenario: "Örn: 'Bütün okul bu markanın ayakkabısını giyiyor, demek ki en kaliteli ve ergonomik ayakkabı kesinlikle bu!'",
    goodAlternative: "Doğrusu: 'Popülerlik bir ürünün kaliteli veya sağlıklı olduğunu kanıtlamaz. Teknik özelliklerini bağımsızca incelemeliyiz.'",
    coachAdvice: "Koç Tüyosu: Reklamların ve sınıf eğilimlerinin seni kandırmasına izin verme; mantık, çoğunluğun parmak sayısıyla ölçülmez!"
  }
];

interface QuizQuestion {
  id: number;
  unveiledText: string;
  correctAnswerId: string;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    unveiledText: '"Sen daha hayatında hiç yurt dışına çıkmamışsın, küreselleşmenin yararlarını nasıl tartışabilirsin ki?!"',
    correctAnswerId: "adhominem",
    explanation: "Doğru! Fikri çürütmek yerine karşısındakinin seyahat geçmişine (kişisel durumuna) saldırıyor."
  },
  {
    id: 2,
    unveiledText: '"Telefon serbest olsun dediler. Yani derslerde herkes oyun oynasın, öğretmenler susturulsun, tam bir kaos çıksın istiyorlar!"',
    correctAnswerId: "strawman",
    explanation: "Harika! Öğrencinin isteğini abartıp canavarlaştırarak savunulamaz bir 'korkuluk' argüman yarattı."
  },
  {
    id: 3,
    unveiledText: '"Sınıfımızdaki iki çalışkan öğrenci de gözlüklüydü. Buradan anlıyoruz ki gözlük takanlar her zaman daha zekidir."',
    correctAnswerId: "hasty",
    explanation: "Tebrikler! Yalnızca iki kişiye bakarak tüm gözlüklüler adına 'Acele Genelleme' yaptı."
  },
  {
    id: 4,
    unveiledText: '"Ya kantinde kola satılmasını tamamen kabul edersiniz ya da kantinin komple batıp kapanmasını istersiniz!"',
    correctAnswerId: "falsedilemma",
    explanation: "Kesinlikle! Başka hiçbir bütçe/menü seçeneği yokmuş gibi sadece iki felaket senaryosu sunarak 'Yalancı İkilem' yarattı."
  }
];

interface FallacyGuideProps {
  themeId: string;
}

export default function FallacyGuide({ themeId }: FallacyGuideProps) {
  const [selectedFallacy, setSelectedFallacy] = useState<Fallacy | null>(null);
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Theme computed styles
  const isDark = themeId === "dark" || themeId === "retro" || themeId === "space";
  
  const cardClass = themeId === "dark" 
    ? "bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/20"
    : themeId === "retro"
    ? "bg-stone-900/90 border-amber-900/40 text-amber-100 shadow-amber-950/20"
    : themeId === "space"
    ? "bg-indigo-950/40 border-indigo-900/40 text-slate-100 shadow-indigo-950/20 backdrop-blur-md"
    : themeId === "forest"
    ? "bg-white border-emerald-100 text-slate-800 shadow-emerald-50"
    : "bg-white border-slate-200 text-slate-800 shadow-sm";

  const textMutedClass = isDark ? "text-indigo-200/70" : "text-slate-500";
  const labelClass = isDark ? "text-amber-400" : "text-slate-600";
  const accentColor = themeId === "forest" ? "text-emerald-600" : "text-amber-600";
  const accentBgLight = themeId === "forest" ? "bg-emerald-50" : "bg-amber-50";
  const btnPrimary = themeId === "forest"
    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
    : themeId === "space"
    ? "bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse"
    : "bg-amber-600 hover:bg-amber-700 text-white";

  const handleQuizAnswer = (fallacyId: string) => {
    if (quizAnswer) return; // Already answered this question
    const original = QUIZ_QUESTIONS[currentQuizIndex];
    setQuizAnswer(fallacyId);
    
    if (fallacyId === original.correctAnswerId) {
      setQuizFeedback(`🎉 Doğru! \n${original.explanation}`);
      setQuizScore(prev => prev + 1);
    } else {
      const correctRef = FALLACIES.find(f => f.id === original.correctAnswerId);
      setQuizFeedback(`❌ Hatalı. Doğru cevap "${correctRef?.name}" olmalıydı.\n${original.explanation}`);
    }
  };

  const nextQuiz = () => {
    setQuizAnswer(null);
    setQuizFeedback(null);
    setCurrentQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="fallacy-section">
      {/* List / Learn Side */}
      <div className="lg:col-span-7 space-y-4">
        <div className={`${cardClass} rounded-xl p-5 border transition-all duration-300`}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className={`${accentColor} w-5 h-5 animate-pulse`} />
            <span className={`font-mono text-xs ${accentColor} font-bold uppercase tracking-wider`}>Münazara Teorisi</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Safsata (Mantık Hatası) Nedir?</h2>
          <p className={`${textMutedClass} text-sm mt-2 leading-relaxed`}>
            Münazarada haklı çıkmaya çalışırken en sık düşülen tuzaklar, kulağa ikna edici gelse de <b>mantıksal olarak hatalı</b> olan iddialardır. 
            Jüriler bu hataları hemen fark eder ve puan kırar! Bunları öğrenerek hem kendi argümanlarını temiz tut, hem de rakibinin açıklarını jüriye göster.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FALLACIES.map((fallacy) => (
            <button
              id={`fallacy-btn-${fallacy.id}`}
              key={fallacy.id}
              onClick={() => setSelectedFallacy(fallacy)}
              className={`text-left p-4 rounded-xl border transition-all duration-300 shadow-sm cursor-pointer ${
                selectedFallacy?.id === fallacy.id 
                  ? "border-amber-500 bg-amber-50/50 scale-[1.02] ring-1 ring-amber-400 font-extrabold" 
                  : isDark 
                  ? "border-slate-800 bg-slate-900/40 text-slate-100 hover:border-slate-700 hover:bg-slate-900/80"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex gap-3">
                <span className="text-2xl mt-0.5" role="img" aria-label={fallacy.name}>
                  {fallacy.icon}
                </span>
                <div>
                  <h3 className="font-display font-black text-sm flex items-center gap-1.5 focus:outline-none">
                    {fallacy.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {fallacy.englishName}
                  </span>
                  <p className={`${textMutedClass} text-xs mt-1.5 line-clamp-2 leading-relaxed`}>
                    {fallacy.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Fallacy Modal/Card */}
        <AnimatePresence mode="wait">
          {selectedFallacy ? (
            <motion.div
              layoutId="selected-fallacy-details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`${cardClass} rounded-xl p-5 border shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedFallacy.icon}</span>
                  <div>
                    <h3 className="font-display font-bold text-base">{selectedFallacy.name}</h3>
                    <span className="text-xs font-mono text-amber-600">{selectedFallacy.englishName}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFallacy(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline font-mono cursor-pointer"
                >
                  Kapat
                </button>
              </div>

              <p className="text-sm mt-3 leading-relaxed opacity-95">
                {selectedFallacy.description}
              </p>

              <div className="mt-4 space-y-2.5">
                <div className="bg-red-50/70 p-3 rounded-lg border border-red-100 flex gap-2.5 items-start text-slate-800">
                  <span className="text-lg">🤦🔴</span>
                  <div>
                    <strong className="text-red-800 text-xs block font-bold">Safsata Tuzağı (Yapma!):</strong>
                    <span className="text-slate-700 text-xs italic mt-0.5 block">{selectedFallacy.badScenario}</span>
                  </div>
                </div>

                <div className="bg-green-50/70 p-3 rounded-lg border border-green-100 flex gap-2.5 items-start text-slate-800">
                  <span className="text-lg">🎯🟢</span>
                  <div>
                    <strong className="text-green-800 text-xs block font-bold">Doğru Strateji (Böyle Yap!):</strong>
                    <span className="text-slate-700 text-xs mt-0.5 block">{selectedFallacy.goodAlternative}</span>
                  </div>
                </div>

                <div className="bg-slate-100/80 p-3 rounded-lg border border-slate-200/60 flex gap-2.5 items-start text-slate-800">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-850 text-xs block font-mono font-bold">Koçun Taktik Kartı:</strong>
                    <span className="text-slate-600 text-xs mt-0.5 block leading-relaxed">{selectedFallacy.coachAdvice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className={`${cardClass} rounded-xl p-6 border text-center text-sm`}>
              <Info className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              Detayları incelemek, hatalı tuzakları ve koç çözüm önerilerini görmek için yukarıdaki safsatalardan birine tıkla!
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quiz Side (Safsata Dedektörü Game) */}
      <div className="lg:col-span-5">
        <div className={`${cardClass} rounded-xl p-5 border shadow-sm h-full flex flex-col justify-between transition-all duration-300`}>
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className={`${accentColor} w-4 h-4`} />
                <h3 className="font-display font-extrabold text-sm">Tuzak Avcısı Oyunu</h3>
              </div>
              <span className="font-mono text-xs font-bold bg-slate-100/80 px-2 py-0.5 rounded-full text-slate-800">
                Doğru: {quizScore}/{QUIZ_QUESTIONS.length}
              </span>
            </div>

            <p className={`${textMutedClass} text-xs mb-4 leading-relaxed`}>
              Aşağıdaki cümle bir safsata tuzağı içeriyor. Bakalım hangi mantık hatası olduğunu bulabilecek misin dedektör?
            </p>

            {/* Current Question Block */}
            <div className="bg-slate-100/30 rounded-lg p-4 border border-slate-200/60 mb-4 text-center">
              <HelpCircle className="w-5 h-5 text-slate-400 mx-auto mb-2 animate-bounce" />
              <p className="italic font-serif font-medium text-sm leading-relaxed">
                {QUIZ_QUESTIONS[currentQuizIndex].unveiledText}
              </p>
            </div>

            {/* Answer Selector */}
            <div className="space-y-2">
              {FALLACIES.map((fallacy) => {
                const isSelected = quizAnswer === fallacy.id;
                const isCorrectAnswer = QUIZ_QUESTIONS[currentQuizIndex].correctAnswerId === fallacy.id;
                
                let btnColor = isDark 
                  ? "border-slate-800 hover:border-amber-400 bg-slate-900/40 text-slate-100 cursor-pointer"
                  : "border-slate-200 hover:border-amber-300 bg-white text-slate-700 cursor-pointer";
                if (quizAnswer) {
                  if (isSelected) {
                    btnColor = isCorrectAnswer 
                      ? "border-green-500 bg-green-50 text-green-800 scale-[1.01]" 
                      : "border-red-500 bg-red-50 text-red-800 scale-[1.01]";
                  } else if (isCorrectAnswer) {
                    btnColor = "border-green-300 bg-green-50 text-green-700";
                  } else {
                    btnColor = "border-slate-100 bg-slate-50 opacity-50 text-slate-400";
                  }
                }

                return (
                  <button
                    id={`quiz-opt-${fallacy.id}`}
                    key={fallacy.id}
                    disabled={quizAnswer !== null}
                    onClick={() => handleQuizAnswer(fallacy.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex justify-between items-center transition-all ${btnColor}`}
                  >
                    <span>{fallacy.icon} {fallacy.name}</span>
                    {quizAnswer && isCorrectAnswer && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {quizAnswer && isSelected && !isCorrectAnswer && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quiz Feedback */}
            <AnimatePresence>
              {quizFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-slate-100/30 rounded-lg border border-slate-205 text-xs whitespace-pre-line leading-relaxed text-indigo-200"
                >
                  <p className={isDark ? "text-amber-400" : "text-emerald-800"}>{quizFeedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100/20 flex justify-end">
            <button
              id="next-quiz-btn"
              onClick={nextQuiz}
              className={`flex items-center gap-1 text-xs font-bold uppercase px-3 py-1.5 rounded transition-all cursor-pointer ${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-705 text-amber-400 hover:text-amber-300" 
                  : "bg-amber-50 hover:bg-amber-100/80 text-amber-700 hover:text-amber-800"
              }`}
            >
              <span>{quizAnswer ? "Sıradaki Soru" : "Değiştir / Pas Geç"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
