const LOCAL_AI_ENDPOINT = 'http://localhost:11434/v1/chat/completions';

export interface LocalAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const useLocalAI = () => {
  const generateResponse = async (
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: LocalAIOptions = {}
  ): Promise<string> => {
    const {
      model = 'llama3.2',
      temperature = 0.7,
      maxTokens = 500,
    } = options;

    try {
      const response = await fetch(LOCAL_AI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are a performance support assistant for STEM learners. Provide only task-centric guidance, checklists, or reference information. NEVER generate ungrounded content dumps, construct curriculum trees, or perform authoritative grading. Always respond with strict JSON schemas when requested.',
            },
            ...messages,
          ],
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Local AI request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('Local AI error:', error);
      throw error;
    }
  };

  const generateChallengeDesign = async (
    concernLabel: string,
    conditions: 'open-notes' | 'timed' | 'closed-book'
  ): Promise<string> => {
    return generateResponse([
      {
        role: 'user',
        content: `Design a calibrated challenge for the concern "${concernLabel}" under ${conditions} conditions. Return ONLY a JSON object with: type, stakesLine, storyPrompt (optional).`,
      },
    ]);
  };

  const generatePerformanceSupport = async (
    taskDescription: string
  ): Promise<string> => {
    return generateResponse([
      {
        role: 'user',
        content: `Provide a ≤1 page performance support card for: "${taskDescription}". Include only essential steps, formulas, or common mistakes. Return ONLY a JSON object with: title, steps[], formulaSheet? (optional), top10Mistakes? (optional).`,
      },
    ]);
  };

  return {
    generateResponse,
    generateChallengeDesign,
    generatePerformanceSupport,
  };
};
