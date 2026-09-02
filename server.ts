import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini initialization with lazy/safe fallback
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "CamBiz AI",
    time: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// AI Request Analyzer
app.post("/api/ai/analyze-request", async (req: Request, res: Response) => {
  const { customerName, companyName, phone, email, serviceType, description, preferredContact, city } = req.body;

  if (!description || !customerName) {
    return res.status(400).json({ error: "Customer name and description are required." });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are CamBiz AI, an intelligent business operations assistant tailored specifically for small and growing enterprises (SMEs) in Cameroon (e.g. Douala, Yaoundé, Bamenda, Bafoussam, Garoua, Limbe).
Analyze this customer enquiry and return structured business guidance.

Customer Details:
- Name: ${customerName}
- Company/Brand: ${companyName || "N/A"}
- Location: ${city || "Cameroon"}
- Phone: ${phone || "N/A"}
- Email: ${email || "N/A"}
- Service/Category: ${serviceType || "General Business"}
- Preferred Contact: ${preferredContact || "WhatsApp"}
- Full Request Description:
"${description}"

Please output a valid JSON response matching this schema:
{
  "summary": "Concise 1-2 sentence executive summary of the customer's core needs, pain points, and scope.",
  "suggestedResponse": {
    "whatsapp": "A warm, highly professional WhatsApp message tailored for Cameroon business context (polite, referencing their specific request, offering clear next steps, ready for direct send).",
    "email": "A complete, structured formal business email reply with subject line, greeting, value proposition, and closing.",
    "phoneScript": "A bulleted 30-second telephone pitch/call checklist for the sales rep."
  },
  "recommendedAction": "Concrete priority business step (e.g. 'Issue quotation with 50% advance payment terms via MTN MoMo / Orange Money', 'Schedule on-site technical inspection in Douala', etc.)",
  "suggestedFollowUp": {
    "timingText": "e.g. In 24 hours / In 2 business days",
    "daysDelay": 2,
    "reason": "Clear commercial reason for this follow-up timing",
    "suggestedDate": "YYYY-MM-DD (suggested date relative to current time)"
  },
  "suggestedItems": [
    {
      "name": "Line item name suitable for Cameroon market",
      "description": "Short item detail",
      "quantity": 1,
      "unitPrice": 50000
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
          systemInstruction: "You are an expert African SME business automation consultant specialized in Cameroonian commercial workflows (WhatsApp commerce, bilingual business communications, mobile money, prompt quotation delivery).",
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        // Ensure suggestedDate is valid
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (parsed.suggestedFollowUp?.daysDelay || 2));
        if (!parsed.suggestedFollowUp?.suggestedDate || isNaN(Date.parse(parsed.suggestedFollowUp.suggestedDate))) {
          parsed.suggestedFollowUp.suggestedDate = targetDate.toISOString().split("T")[0];
        }
        parsed.analyzedAt = new Date().toISOString();
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to local business intelligence engine:", err?.message);
    }
  }

  // High quality local Cameroon business heuristic engine
  const targetDate = new Date();
  const daysDelay = preferredContact === "WhatsApp" ? 1 : 2;
  targetDate.setDate(targetDate.getDate() + daysDelay);
  const formattedDate = targetDate.toISOString().split("T")[0];

  const firstName = customerName.split(" ")[0];
  const companyPhrase = companyName ? ` for ${companyName}` : "";
  const cityPhrase = city ? ` in ${city}` : " in Cameroon";

  // Heuristic pricing items based on service type in FCFA (Central African CFA Franc)
  let heuristicItems = [
    {
      name: `${serviceType || "Professional Service"} - Base Package`,
      description: `Complete scope covering customer request requirements${companyPhrase}`,
      quantity: 1,
      unitPrice: 150000,
    },
    {
      name: "Delivery & Implementation Support",
      description: "Setup, quality check, and customer onboarding",
      quantity: 1,
      unitPrice: 35000,
    },
  ];

  if (serviceType?.toLowerCase().includes("web") || serviceType?.toLowerCase().includes("software")) {
    heuristicItems = [
      { name: "Custom Platform Development & Setup", description: "Responsive architecture, database and UI deployment", quantity: 1, unitPrice: 350000 },
      { name: "Domain, SSL & Cloud Hosting (1 Year)", description: "Secure domain registration and high-speed cloud hosting", quantity: 1, unitPrice: 65000 },
      { name: "Training & Technical Support Handover", description: "Admin walkthrough and 30 days post-launch support", quantity: 1, unitPrice: 40000 }
    ];
  } else if (serviceType?.toLowerCase().includes("agro") || serviceType?.toLowerCase().includes("farm")) {
    heuristicItems = [
      { name: "High-grade Agricultural Supply Batch", description: "Grade A certified quality harvest / processed inventory", quantity: 5, unitPrice: 45000 },
      { name: "Eco-Packaging & Quality Labeling", description: "Standardized bulk packaging for wholesale transport", quantity: 5, unitPrice: 4500 },
      { name: "Inter-city Freight & Transport", description: `Logistics transport to client destination${cityPhrase}`, quantity: 1, unitPrice: 30000 }
    ];
  } else if (serviceType?.toLowerCase().includes("logistics") || serviceType?.toLowerCase().includes("freight")) {
    heuristicItems = [
      { name: "Consignment Handling & Warehousing", description: "Cargo verification, sorting, and secure storage", quantity: 1, unitPrice: 75000 },
      { name: "Express Waybill & Dispatch", description: `Direct transit to delivery address${cityPhrase}`, quantity: 1, unitPrice: 45000 },
      { name: "Transit Insurance & Tracking Support", description: "Live GPS tracking and shipment protection guarantee", quantity: 1, unitPrice: 15000 }
    ];
  }

  const fallbackAnalysis = {
    summary: `${customerName}${companyPhrase} is requesting assistance with ${serviceType || "business services"}. Core objective: "${description.length > 90 ? description.slice(0, 90) + "..." : description}".`,
    suggestedResponse: {
      whatsapp: `Hello ${firstName}, thank you for contacting us regarding your request for ${serviceType || "our services"}${companyPhrase}! We have reviewed your details and are ready to assist you. Would you like us to share our official quotation and schedule a brief call today to finalize the timeline? Best regards!`,
      email: `Subject: Re: Inquiry regarding ${serviceType || "Business Services"} - CamBiz AI\n\nDear ${customerName},\n\nThank you for reaching out to us. We have received your detailed request:\n\n"${description}"\n\nOur team specializes in delivering high-impact solutions with verified reliability. We are currently preparing a tailored quotation and technical scope for you.\n\nPlease let us know if you have any preferred delivery deadlines or specific specifications you would like included.\n\nWarm regards,\nClient Services Team`,
      phoneScript: `1. Introduce company and mention receipt of enquiry.\n2. Confirm specific details: "${description.slice(0, 60)}...".\n3. Propose formal quotation with 50% Mobile Money/Bank deposit terms.\n4. Confirm recipient WhatsApp/Email for instant invoice dispatch.`
    },
    recommendedAction: `Generate and dispatch a formal quotation in FCFA within 4 hours. Follow up via ${preferredContact || "WhatsApp"} with mobile money payment options.`,
    suggestedFollowUp: {
      timingText: preferredContact === "WhatsApp" ? "In 24 hours" : "In 2 business days",
      daysDelay,
      reason: `Quick response time dramatically increases conversion rate for ${preferredContact} leads in Cameroon.`,
      suggestedDate: formattedDate,
    },
    suggestedItems: heuristicItems,
    analyzedAt: new Date().toISOString(),
  };

  return res.json(fallbackAnalysis);
});

// AI Quotation Line Items Generator
app.post("/api/ai/generate-quotation-draft", async (req: Request, res: Response) => {
  const { serviceType, description, customerName } = req.body;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Generate realistic itemized quotation items in Central African CFA Francs (FCFA / XAF) for this SME service in Cameroon:
Service: ${serviceType}
Customer: ${customerName}
Details: ${description}

Return JSON with this schema:
{
  "items": [
    {
      "name": "Item or service title",
      "description": "Specific deliverables or specs",
      "quantity": 1,
      "unitPrice": 75000
    }
  ],
  "suggestedAdditionalCosts": [
    {
      "label": "Delivery / Transport or Setup",
      "amount": 15000
    }
  ],
  "paymentTerms": "e.g. 50% advance payment upon approval via MTN MoMo / Orange Money, balance of 50% upon final delivery."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err: any) {
      console.warn("AI quotation generation failed, using fallback:", err?.message);
    }
  }

  // Fallback quotation draft
  return res.json({
    items: [
      {
        name: `${serviceType || "Business Solution"} Implementation`,
        description: `Primary deliverables for ${customerName || "client"} based on requested specifications`,
        quantity: 1,
        unitPrice: 180000,
      },
      {
        name: "Quality Assurance & Onboarding",
        description: "Standard testing, verification, and client handover",
        quantity: 1,
        unitPrice: 45000,
      },
    ],
    suggestedAdditionalCosts: [
      { label: "Direct Express Logistics / Transport", amount: 15000 },
    ],
    paymentTerms: "50% advance payment via MTN MoMo / Orange Money / Bank Transfer, 50% balance upon final completion & delivery.",
  });
});

// AI Smart Follow-up Message Generator
app.post("/api/ai/generate-followup-message", async (req: Request, res: Response) => {
  const { customerName, companyName, action, channel, quoteNumber, daysElapsed } = req.body;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Draft a polite, high-converting follow-up message for a Cameroonian business client:
Customer: ${customerName} (${companyName || "Individual"})
Action: ${action}
Channel: ${channel}
Quote Number: ${quoteNumber || "Recent Quotation"}
Days since contact: ${daysElapsed || 2} days

Return a JSON with { "message": "The polished ready-to-send text message or email draft" }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (e: any) {
      console.warn("AI followup message failed:", e?.message);
    }
  }

  const firstName = customerName ? customerName.split(" ")[0] : "Client";
  let fallbackText = `Hello ${firstName}, I hope you are having a productive week! Just checking in regarding ${action || "our previous discussion"}${quoteNumber ? ` (Quotation ${quoteNumber})` : ""}. Please let us know if you need any adjustments or if you'd like us to proceed with your order. We are at your service!`;

  if (channel === "Email") {
    fallbackText = `Subject: Following up on your request - CamBiz AI\n\nDear ${customerName},\n\nI hope this email finds you well.\n\nWe wanted to follow up on ${action || "our recent quotation"}${quoteNumber ? ` (#${quoteNumber})` : ""}. Our team is prepared to begin work as soon as you confirm.\n\nPlease let us know if you have questions or require any modifications to the proposal.\n\nBest regards,\nCustomer Relations`;
  }

  return res.json({ message: fallbackText });
});

// Vite Middleware for development and static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CamBiz AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
