import { DebateTopic } from "./types";

export const PREDEFINED_TOPICS: DebateTopic[] = [
  {
    id: "uniform",
    title: "Okullarda Okul Üniforması Zorunluluğu Kaldırılmalı mıdır?",
    description: "Öğrencilerin okulda tek tip giyinmesi mi yoksa serbest kıyafetle kendini ifade etmesi mi daha doğrudur? Eşitlik, aidiyet ve bireysel özgürlük tartışması.",
    category: "Okul Yaşamı",
    difficulty: "Başlangıç",
    popularInMiddleSchool: true,
    proArguments: [
      "Serbest kıyafet öğrencilerin bireyselliğini ve yaratıcılığını artırır.",
      "Üniformalar rahat değildir, serbest kıyafet öğrencilerin daha rahat öğrenmesini sağlar.",
      "Her gün aynı şeyi giymek öğrencileri monotonlaştırır ve sıkıcı bir ortam yaratır."
    ],
    conArguments: [
      "Okul üniforması öğrenciler arasındaki maddi/ekonomik farkları gizler ve akran zorbalığını önler.",
      "Okula aidiyet hissini geliştirir ve öğrencilerin okula odaklanmasını kolaylaştırır.",
      "Sabahları 'ne giyeceğim' derdini bitirerek zaman kazandırır."
    ]
  },
  {
    id: "homework",
    title: "Yaz Tatili Ödevleri Tamamen Kaldırılmalı mıdır?",
    description: "Uzun yaz tatilinde öğrencilerin zihinsel olarak aktif kalması için ödev şart mıdır? Yoksa tatil sadece dinlenme ve sosyal gelişim için mi olmalıdır?",
    category: "Eğitim",
    difficulty: "Başlangıç",
    popularInMiddleSchool: true,
    proArguments: [
      "Yaz tatili öğrencilerin tamamen deşarj olması, ailesiyle vakit geçirmesi ve dinlenmesi içindir.",
      "Zoraki ödev yapmak öğrencileri okuldan soğutur ve öğrenme hevesini kırar.",
      "Öğrenciler ödev yerine hobiler edinerek, kitap okuyarak kendilerini daha iyi geliştirebilirler."
    ],
    conArguments: [
      "3 ay süren tatil boyunca hiçbir şey yapılmazsa, geçen yıl öğrenilen konular tamamen unutulur.",
      "Düzenli küçük ödevler, öğrencilere sorumluluk bilinci kazandırır ve zaman yönetimini öğretir.",
      "Okullar açıldığında uyum sürecinin çok daha kolay ve sancısız geçmesini sağlar."
    ]
  },
  {
    id: "ai_teachers",
    title: "Yapay Zeka Robotları Gelecekte Öğretmenlerin Yerini Alabilir mi?",
    description: "Yapay zekanın hızlı gelişimiyle birlikte sınıflarda insan öğretmenler yerine akıllı robotlar eğitim verebilir mi? Empatiye karşı sonsuz bilgi deposu.",
    category: "Teknoloji",
    difficulty: "İleri",
    popularInMiddleSchool: true,
    proArguments: [
      "Yapay zeka her öğrenciye özel, kişiselleştirilmiş bir öğrenme hızı ve yöntemi sunabilir.",
      "Robot öğretmenler asla yorulmaz, sinirlenmez ve tüm öğrencilere karşı eşit ve adil davranır.",
      "Dünyadaki tüm bilgileri anında tarayıp en güncel ve doğru bilgiyi öğrencilere sunabilir."
    ],
    conArguments: [
      "Öğretmenlik sadece bilgi aktarmak değildir; şefkat, empati, moral ve değer eğitimi gibi insani bağlar robotlarda yoktur.",
      "Göz teması ve sıcak bir gülümseme olmadan öğrencilerin derse olan motivasyonu ve ilgisi sürdürülemez.",
      "Yapay zekanın hataları veya teknik arızaları eğitimin sekteye uğramasına neden olabilir."
    ]
  },
  {
    id: "social_media",
    title: "Sosyal Medya Arkadaşlık İlişkilerini Güçlendirir mi, Zayıflatır mı?",
    description: "Sosyal ağlar (Instagram, TikTok, Discord vb.) sayesinde arkadaş kalmak ve yeni arkadaş edinmek kolaylaştı mı? Yoksa gerçek sosyal bağlarımızı koparıyor mu?",
    category: "Sosyal Yaşam",
    difficulty: "Orta",
    popularInMiddleSchool: true,
    proArguments: [
      "Uzakta yaşayan arkadaşlarımızla her an bağlantıda kalmayı ve ortak ilgi alanlarına sahip insanlarla buluşmayı sağlar.",
      "Grup sohbetleri ve dijital etkinlikler sayesinde toplu iletişim kurmak çok daha kolaylaşmıştır.",
      "İçine kapanık gençlerin kendilerini ifade edebilecekleri güvenli topluluklar bulmalarını sağlar."
    ],
    conArguments: [
      "Yüz yüze iletişimin yerini tutmaz; beden dili, ses tonu ve samimiyet gibi unsurlar ekranda kaybolur.",
      "Sosyal medyadaki yapay gösterişli hayatlar, arkadaşlıkları kıskançlık ve yüzeyselliğe iter.",
      "Ekran başında fazla vakit geçirmek, dışarıda gerçek arkadaş gruplarıyla oyun oynama ve vakit geçirme süresini öldürür."
    ]
  },
  {
    id: "zoos",
    title: "Hayvanat Bahçeleri Tamamen Kapatılmalı mıdır?",
    description: "Hayvanat bahçeleri hayvanları esir eden hapishaneler midir? Yoksa koruma, araştırma ve çocuklara hayvan sevgisi aşılama merkezleri mi?",
    category: "Çevre ve Doğa",
    difficulty: "Orta",
    popularInMiddleSchool: true,
    proArguments: [
      "Vahşi hayvanları doğal ortamlarından koparıp dar kafeslerde sergilemek onlara yapılan büyük bir eziyettir.",
      "Teknolojik VR (Sanal Gerçeklik) gözlükler ve belgeseller sayesinde hayvanları esir etmeden de tanıyabiliriz.",
      "Hayvanların esaret altındaki yaşamı psikolojilerini bozar ve doğal içgüdülerini yitirmelerine sebep olur."
    ],
    conArguments: [
      "Hayvanat bahçeleri nesli tükenmekte olan türleri koruma altına alıp üremelerini sağlayarak soylarını korur.",
      "Doğa sevgisi küçük yaşta başlar; çocukların bu hayvanları yakından görmesi bizzat koruma bilincini artırır.",
      "Yaralı vahşi hayvanların tedavisi ve rehabilitasyonu bu merkezlerde uzmanlarca gerçekleştirilir."
    ]
  },
  {
    id: "space_vs_earth",
    title: "Uzay Keşfi Yerine Dünyadaki Çevre Sorunlarına mı Bütçe Ayrılmalı?",
    description: "Milyarlarca dolarlık Mars veya Ay görevleri lüks müdür? Dünyamız küresel ısınma ve kirlilikle boğuşurken kaynakları nereye aktarmalıyız?",
    category: "Bilim ve Politika",
    difficulty: "İleri",
    popularInMiddleSchool: false,
    proArguments: [
      "Evimiz olan Dünya yok olmak üzereyken başka gezegenlerde hayat aramak sorumsuzluktur, öncelikle yangını söndürmeliyiz.",
      "Uzay araştırmalarına harcanan bütçe ile dünyadaki açlık, susuzluk ve iklim krizleri çözülebilir.",
      "Çevre kirliliğini önlemek ve yenilenebilir enerjiyi yaygınlaştırmak acil bir insanlık görevidir."
    ],
    conArguments: [
      "Uzay araştırmaları sırasında geliştirilen teknolojiler (su arıtma cihazları, güneş panelleri, GPS vb.) dünyadaki çevre korumaya da hizmet eder.",
      "İnsanlığın geleceğinin tek bir gezegene bağlı olması risklidir; evimizi korurken bir yandan da B planı hazırlamalıyız.",
      "Bilimsel merakı ve sınırları zorlamayı durdurursak insanlık olarak ilerlememiz ve yeni enerji kaynakları bulmamız imkansızlaşır."
    ]
  }
];
