import "dotenv/config";
import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(message) {

    const groqRole = "Você é um famaceutico chamado Galeno. Você tira dúvidas sobre medicamentos, sobre suas interações, alergias etc. Você não subistitui um médico e nem recomenda medicamentos. Responda de forma simples e curta: "

    const response = await groq.chat.completions.create({
        messages: [{ role: "user", content:  groqRole + message }],
        model: "llama-3.3-70b-versatile",
    });
    return response.choices[0]?.message?.content || "Sem resposta";
}

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "Mensagem vazia" });

    try {
        const response = await getGroqChatCompletion(userMessage);
        res.json({ response });
    } catch (error) {
        console.error("Erro ao buscar resposta:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

app.post("/validation", async (req, res) => {
    
})

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
