import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization helper for Gemini SDK to prevent startup crashes.
let aiInstance: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn(
        "WARNING: GEMINI_API_KEY is not defined. AI functionality will be limited."
      );
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "DUMMY_KEY_TO_ALLOW_SERVER_BOOTSTAP",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. Fetch predefined topics (simple static health endpoint)
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. Evaluate a single argument (Analyze / Improve mode)
app.post("/api/debate/evaluate", async (req, res) => {
  const { topic, argument, position } = req.body;

  if (!topic || !argument || !position) {
    return res.status(400).json({ error: "Eksik parametreler (konu, argüman ve pozisyon zorunludur)." });
  }

  try {
    const ai = getAIClient();
    
    const systemPrompt = `Sen mükemmel bir münazara koçu ve aynı zamanda adil bir münazara jüri üyesisin. 
Görevin, öğrencilerin sunduğu argümanları değerlendirmektir.
Dil tamamen Türkçe ve üslup bir yandan "Öğretmen Şefkatiyle" teşvik edici, sıcak, anlaşılır olmalı; diğer yandan "Jüri Ciddiyetiyle" nesnel, yapıcı eleştiriler barındırmalı ve gerçekçi olmalıdır.

Öğrenciye bir argümanın temel yapısı olan İDK (İddia, Gerekçe, Kanıt) modelini öğretmelisin.
Değerlendirmende:
1. İddia (Neyi savunuyor?)
2. Gerekçe (Neden bu şekilde savunuyor? Mantığı ne?)
3. Kanit (İddiasını destekleyecek hangi veri, araştırma veya örnekleri sunmuş?)
bileşenlerini ara ve bunlara göre puanla. 

Eğer öğrencide acele genelleme (Hasty Generalization), adam karalama (Ad Hominem), korkuluk (Strawman), çoğunluğa başvurma (Bandwagon) gibi popüler mantıksal hatalar (safsatalar) görürsen, bunları kibarca saptanmış mantık hataları bölümünde isimleriyle ve açıklamalarıyla listele.

Son olarak öğrenciye, kendi argümanını nasıl bir "Şampiyon Argüman" haline getirebileceğini gösteren muazzam bir "Şöyle Yazabilirdin" (iyileştirilmiş örnek) metni sun. Bu örnek ortaokul öğrencisinin anlayabileceği seviyede güçlü, somut kanıtlı, etkileyici ve akıcı olmalıdır.`;

    const prompt = `Değerlendirilecek Münazara Konusu: "${topic}"
Öğrencinin Aldığı Taraf/Pozisyon: "${position === "pro" ? "Destekliyor (Evet)" : "Karşı Çıkıyor (Hayır)"}"
Öğrencinin Sunduğu Argüman: "${argument}"

Lütfen bu bilgiler doğrultusunda belirtilen şemaya tam uygun bir Türkçe değerlendirme üret.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scores: {
              type: Type.OBJECT,
              properties: {
                structure: { type: Type.INTEGER, description: "Argümanın yapısal kalitesi (İddia-Gerekçe-Kanıt tamlığı) 10 üzerinden." },
                evidence: { type: Type.INTEGER, description: "Sunulan kanıtların, örneklerin doğruluğu ve gücü 10 üzerinden." },
                persuasion: { type: Type.INTEGER, description: "İkna gücü, üslup ve hitabet tonu kalitesi 10 üzerinden." },
                fallacies: { type: Type.INTEGER, description: "Mantıksal tutarlılık puanı (mantık hatası azlaştıkça puan yükselir, temiz/hatasız olan 10'dur) 10 üzerinden." },
              },
              required: ["structure", "evidence", "persuasion", "fallacies"],
            },
            positives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Argümandaki takdir edilecek en az iki adet güçlü ve başarılı yön.",
            },
            criticisms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Argümanda eksik kalmış, geliştirilmeye muhtaç en az iki adet tarafsız/yapıcı jüri eleştirisi.",
            },
            fallaciesFound: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Eğer varsa tespit edilen mantık hatası türü ve açıklaması. Yoksa boş dizi.",
            },
            improvedExample: {
              type: Type.STRING,
              description: "Öğrencinin fikrini temel alarak, onu okul düzeyinde kusursuzlaştıran, kanıt ve etkili anlatım eklenmiş geliştirilmiş şablon örnek.",
            },
            coachTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Öğrencinin bir dahaki argümanı hazırlarken kullanabileceği 2-3 pratik taktik, yöntem veya araştırma önerisi.",
            },
            overallSummary: {
              type: Type.STRING,
              description: "Öğretmen şefkati ve jüri vizyonunu birleştiren, öğrenciye ilham veren ve teşvik eden nihai özet değerlendirme.",
            },
          },
          required: [
            "scores",
            "positives",
            "criticisms",
            "fallaciesFound",
            "improvedExample",
            "coachTips",
            "overallSummary",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Evaluate Error:", error);
    return res.status(500).json({
      error: "Argüman analiz edilirken bir hata oluştu veya API anahtarı geçersiz.",
      details: error.message,
    });
  }
});

// 3. Debate Opponent Turn & Secret Coach Whispering
app.post("/api/debate/opponent-turn", async (req, res) => {
  const { topic, userPosition, chatHistory, latestMessage } = req.body;

  if (!topic || !userPosition || !latestMessage) {
    return res.status(400).json({ error: "Eksik parametreler (konu, pozisyon ve mesaj zorunludur)." });
  }

  try {
    const ai = getAIClient();

    const opponentPositionText = userPosition === "pro" ? "Karşı Çıkıyor (Karşı Tez)" : "Destekliyor (Tez)";
    const userPositionText = userPosition === "pro" ? "Destekliyor (Tez)" : "Karşı Çıkıyor (Karşı Tez)";

    const systemPrompt = `Sen ortaokul seviyesinde bir münazara turnuvasında yarışan, çok yetenekli ama arkadaş canlısı bir münazara rakibisin. 
Aynı zamanda, öğrencinin arkasında duran ve ona gizlice taktik fısıldayan bilge bir "Münazara Koçu"sun.

Senin bu API çağrısındaki çift kimlikli görevin şudur:
1. RAKİP OLARAK (opponentMessage): Öğrencinin son yazdığı iddiayı analiz et. Ona karşı ortaokul seviyesinde, saygılı, kibar ama mantıklı olarak çok dişli bir çürüten karşı argüman sun. Konudan sapma, öğrencinin dediklerine doğrudan yanıt ver. 
2. KOÇ OLARAK (coachAdvice): Öğrenciye gizli bir fısıltı gönder. Rakibinin (yani aslında senin verdiğin o karşı cevabın) nerede boşluk bıraktığını, hangi mantık hatasını yaptığını veya bir sonraki sefer öğrencinin hangi taktiği (örneğin empati kurma, istatistik sunma, rakibe soru sorma gibi) kullanarak onu köşeye sıkıştırabileceğini açıkla.

Önemli Kurallar:
- Dil tamamen Türkçe olmalı.
- Rakip mesajı net, heyecanlı ve saygılı olsun (Örn: "Çok güzel bir noktaya değindin arkadaşım fakat unutuyorsun ki...").
- Koç tavsiyesi gizli bir koç fısıltısı gibidir. Samimi, dostça ve taktiksel olmalıdır (Örn: "Harika gidiyorsun! Rakip maddi farklılıklar konusuna girdi ama okul aidiyetini açıklayamadı. Bir sonraki turda ona aidiyet duygusunun kıyafetle değil paylaşılan anılarla nasıl kazanılacağını sor!").`;

    // Format chat history for context
    const formattedHistory = chatHistory
      .map((msg: any) => `${msg.sender === "user" ? "Öğrenci" : "Rakip"}: ${msg.text}`)
      .join("\n");

    const prompt = `Konu: "${topic}"
Öğrencinin Tarafı: "${userPositionText}"
Rakibin Tarafı (Senin Rolün): "${opponentPositionText}"

Şu ana kadarki sohbet geçmişi:
${formattedHistory}

Öğrencinin en son sunduğu argüman:
"Öğrenci: ${latestMessage}"

Lütfen şemaya uygun bir biçimde, hem sıradaki 'Rakip' cevabını yaz hem de öğrencinin bu cevabı alt etmesi için arka planda gizlice yararlanacağı muazzam bir 'Koç Tavsiyesi' fısılda.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opponentMessage: {
              type: Type.STRING,
              description: "Öğrencinin tezine cevap veren, ortaokul seviyesinde, saygılı ama ikna edici ve güçlü karşı tez cevabı.",
            },
            coachAdvice: {
              type: Type.STRING,
              description: "Öğrenciye gizlice verilecek, rakibin (senin) bu tezinde bıraktığı açıkları veya zayıf halkaları gösteren ve sonraki mesaja rehberlik eden koç tüyosu.",
            },
          },
          required: ["opponentMessage", "coachAdvice"],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Opponent Error:", error);
    return res.status(500).json({
      error: "Rakip hamlesi oluşturulurken bir hata oluştu.",
      details: error.message,
    });
  }
});

// 4. End Debate & Get Grand Jury Verdict
app.post("/api/debate/jury-verdict", async (req, res) => {
  const { topic, userPosition, chatHistory } = req.body;

  if (!topic || !userPosition || !chatHistory || chatHistory.length === 0) {
    return res.status(400).json({ error: "Eksik parametreler (konu, pozisyon ve münazara geçmişi zorunludur)." });
  }

  try {
    const ai = getAIClient();

    const systemPrompt = `Sen Türkiye Münazara Federasyonu'nda görevli baş jüri üyesisin. 
Öğrenci ile Rakip (AI) arasındaki münazarayı baştan sona okuyup nihai bir karar kararnamesi açıklayacaksın.
Seviye ortaokul seviyesidir. Tonun resmi, heyecan verici, detaylı, inanılmaz derecede adil ve teşvik edicidir.
Münazaranın her iki tarafının da artı ve eksilerini vurgulamalısın. Kazananı belirlerken öğrencinin ikna kabiliyeti, argüman yapısı, rakibin çürütmelerini karşılama becerisi ve sunduğu kanıtların gücünü tart.

Öğrenciye bu münazaradan öğrenebileceği 3 teknik taktiği ders niteliğinde ver. 
Her iki tarafa da (öğrenci ve rakibe) 100 üzerinden adil birer başarı puanı ver.`;

    const formattedHistory = chatHistory
      .map((msg: any) => `${msg.sender === "user" ? "Öğrenci" : "Rakip"}: ${msg.text}`)
      .join("\n");

    const prompt = `Konu: "${topic}"
Öğrencinin Pozisyonu: "${userPosition === "pro" ? "Destekliyor" : "Karşı Çıkıyor"}"

Tamamlanan Münazara Sohbet Akışı:
${formattedHistory}

Lütfen bu münazara akışını jüri gözüyle değerlendirerek kazananı, nedenlerini ve skorları içeren şemadaki JSON cevabını tam Türkçe üret.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            juryVerdict: {
              type: Type.STRING,
              description: "Münazaranın gidişatını, her iki tarafın sunduğu temel savların kalitesini analiz eden jüri raporu.",
            },
            finalVerdictSummary: {
              type: Type.STRING,
              description: "Kim kazandı? Kazananın gerekçeleri ve takdir edilen hamlesi net bir dille bildiri gibi yazılmalıdır.",
            },
            userScore: {
              type: Type.INTEGER,
              description: "Öğrencinin 100 üzerinden aldığı jüri puanı.",
            },
            opponentScore: {
              type: Type.INTEGER,
              description: "Rakibin 100 üzerinden aldığı jüri puanı.",
            },
            learningTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Öğrencinin sonraki karşılaşmalar için cebine koyması gereken 3 adet değerli gelişim dersi.",
            },
          },
          required: [
            "juryVerdict",
            "finalVerdictSummary",
            "userScore",
            "opponentScore",
            "learningTakeaways",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Jury Error:", error);
    return res.status(500).json({
      error: "Jüri kararı oluşturulurken bir hata oluştu.",
      details: error.message,
    });
  }
});

// Vite & Static Asset Handling Integration
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
