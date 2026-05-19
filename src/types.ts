export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  proArguments: string[];
  conArguments: string[];
  difficulty: "Başlangıç" | "Orta" | "İleri";
  popularInMiddleSchool: boolean;
}

export interface EvaluationResult {
  scores: {
    structure: number; // Argüman Yapısı (Iddia-Kanit-Gerekce)
    evidence: number;  // Kanıt ve Destekleyiciler
    persuasion: number;// İkna Edicilik ve Hitabet
    fallacies: number; // Mantıksal Tutarlılık (safsata payı) - 10 üzerinden puan (yüksek = temiz/tutarlı)
  };
  positives: string[];     // Beğenilen güçlü yönler (Öğretmen Şefkatiyle)
  criticisms: string[];    // Eleştiriler ve eksikler (Jüri Ciddiyetiyle)
  fallaciesFound: string[];// Saptanan mantık hataları (Genelleme vb.)
  improvedExample: string; // "Şöyle Yazabilirdin" Örneği
  coachTips: string[];     // Bir sonraki adım için tavsiyeler
  overallSummary: string;  // Genel değerlendirme özeti
}

export interface Message {
  id: string;
  sender: "user" | "opponent" | "jury" | "system";
  text: string;
  timestamp: string;
  coachAdvice?: string; // Real-time coach feedback on this turn
}

export interface ActiveDebate {
  id: string;
  topic: DebateTopic;
  userPosition: "pro" | "con"; // pro = Destekliyor, con = Karşı çıkıyor
  opponentPosition: "pro" | "con";
  messages: Message[];
  status: "ongoing" | "finished";
  roundNumber: number;
  juryVerdict?: string; // Summary of the game by jury
  finalScores?: {
    user: number;
    opponent: number;
  };
}

export interface SavedAnalysis {
  id: string;
  topic: string;
  argument: string;
  position: "pro" | "con";
  evaluation: EvaluationResult;
  timestamp: string;
}
