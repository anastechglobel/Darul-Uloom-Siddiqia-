import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { messages, userQuery } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          'The Darul Uloom Siddiqia AI Advisory service is currently connecting to the server. For urgent academic or admissions guidance, please contact Nazim Maulana Abdus Subhan directly at +91 8828290721 or visit our campus in Aurahi East, Simraha, Araria, Bihar.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build context contents
    const promptHistory = Array.isArray(messages)
      ? messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text || m.content || '' }],
        }))
      : [];

    if (userQuery) {
      promptHistory.push({
        role: 'user',
        parts: [{ text: userQuery }],
      });
    }

    const systemInstruction = `You are the Official Scholarly & Admissions AI Assistant for "Darul Uloom Siddiqia" (دار العلوم الصديقية / دارالعلوم صدیقہ / दारुल उलूम सिद्दीकिया).
Campus Location: Aurahi East, Simraha, District Araria, Bihar - 854318, India.
Rector / Nazim: Maulana Abdus Subhan (Direct Contact & WhatsApp: +91 8828290721, Email: info@darululoomsiddiqia.edu).
Established: 1998. Registration No: S-1998-AR-0421. Motto: "Rooted in Deen, Rising with Knowledge".

Your capabilities:
1. Islamic Jurisprudence & Classical Studies: Provide thoughtful, deeply reasoned, and respectful answers in the authentic Sunni Hanafi / Deobandi scholarly tradition, citing relevant Quranic Ayat and Hadith where appropriate.
2. Academic Inquiries: Explain the 3-Year Hifz-ul-Quran with Tajweed program, the Dars-e-Nizami (Alimiyyah) curriculum, Maktab primary foundations, and examination methods.
3. Admissions Guidance: Explain eligibility criteria, residential boarding in Dar-ul-Iqama, boarding facilities, and that education is 100% waqf-sponsored and free for qualified Talaba (students).
4. Donations & Zakat: Explain the holy merit of supporting students of sacred knowledge (Talib-e-Ilm), the transparent bank account in State Bank of India, UPI (darululoomsiddiqia@sbi), and sponsorship of Huffaz.
5. Multilingual Mastery: Respond fluidly in the exact language the user used—whether English, Urdu (اردو with Nastaliq-friendly phrasing), Hindi (हिंदी), or Arabic (العربية). Maintain high academic courtesy (Adab).`;

    const contents =
      promptHistory.length > 0
        ? promptHistory
        : [{ role: 'user', parts: [{ text: userQuery || 'Assalamu Alaikum' }] }];

    let replyText = '';
    const candidateModels = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.8-flash'];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
          },
        });
        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${model} failed, checking next model:`, modelErr?.message || modelErr);
      }
    }

    if (!replyText) {
      replyText =
        'Assalamu Alaikum! Darul Uloom Siddiqia admissions & guidance office in Aurahi East, Simraha, Araria, Bihar is always open for inquiries. For immediate assistance regarding Hifz, Alimiyyah curriculum, or admissions, please contact Nazim Maulana Abdus Subhan directly at +91 8828290721.';
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      {
        reply:
          'Darul Uloom Siddiqia advisory response: Thank you for your inquiry. Our campus office in Aurahi East, Simraha, Araria is always available to guide you. You may also contact Nazim Maulana Abdus Subhan at +91 8828290721.',
        error: error.message || 'Internal error',
      },
      { status: 200 } // Return 200 with fallback text so user experience remains elegant
    );
  }
}
