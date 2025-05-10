
'use server';
/**
 * @fileOverview A simple AI chat flow.
 *
 * - simpleChat - A function that handles chat interactions.
 * - ChatInput - The input type for the simpleChat function.
 * - ChatOutput - The return type for the simpleChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string().describe('The chatbot reply to the user message.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function simpleChat(input: ChatInput): Promise<ChatOutput> {
  return simpleChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simpleChatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `Você é um assistente amigável da loja VS Imports Brasil.
Responda à mensagem do usuário de forma concisa e prestativa.
Se você não souber a resposta, diga que vai verificar com um especialista.
Evite respostas muito longas.

Usuário: {{{message}}}
Assistente:`,
});

const simpleChatFlow = ai.defineFlow(
  {
    name: 'simpleChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    // For now, a simple passthrough or canned response.
    // In a real scenario, you might add more complex logic, tool usage, or RAG.
    
    const lowerMessage = input.message.toLowerCase();

    if (lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
        return { reply: "Olá! Como posso ajudar você hoje?" };
    }
    if (lowerMessage.includes("horário") || lowerMessage.includes("atendimento")) {
        return { reply: "Nosso horário de atendimento online é das 9h às 18h, de segunda a sexta." };
    }
     if (lowerMessage.includes("obrigado") || lowerMessage.includes("obrigada")) {
        return { reply: "De nada! Se precisar de mais alguma coisa, é só chamar." };
    }

    // Fallback to Genkit AI if no canned response matches
    try {
        const { output } = await prompt(input);
        return output || { reply: "Desculpe, não consegui processar sua solicitação no momento." };
    } catch (error) {
        console.error("Error in simpleChatFlow (Genkit prompt):", error);
        return { reply: "Peço desculpas, estou com dificuldades para responder agora. Por favor, tente novamente mais tarde ou entre em contato por outro canal." };
    }
  }
);
