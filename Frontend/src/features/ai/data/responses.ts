import type { AIMessage } from '@/features/ai/types';

export const AI_MESSAGES_INIT: AIMessage[] = [
  {
    role: 'assistant',
    text: "Hello! I'm your AI academic assistant. I can help with explaining concepts, solving problems step-by-step, reviewing your work, or answering subject-matter questions. What would you like to learn today? 🎓",
  },
];

export const AI_RESPONSES: Record<string, string> = {
  recursion:
    '**Recursion** is when a function calls itself to solve a smaller version of the same problem.\n\nThink of Russian dolls — each opens to reveal a smaller one, until the smallest.\n\n**Key parts:**\n1. **Base case** — when to stop (e.g. `if n===0 return 1`)\n2. **Recursive case** — break the problem down\n\nWould you like a step-by-step trace?',
  integration:
    '**Integration** is the reverse of differentiation — it finds area under a curve.\n\n• ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n• ∫eˣ dx = eˣ + C\n• ∫cos(x) dx = sin(x) + C\n\nWhich technique do you need? (substitution, parts, partial fractions?)',
  'big o':
    '**Big O** describes how runtime grows with input size.\n\nO(1) → Constant · O(log n) → Logarithmic · O(n) → Linear · O(n²) → Quadratic\n\nLower is better. O(log n) scales much better than O(n²) for large inputs.',
  quadratic:
    '**Quadratic formula:** x = (−b ± √(b²−4ac)) / 2a\n\nExample: 2x² + 5x − 3 = 0\n→ a=2, b=5, c=−3\n→ x = (−5 ± √49) / 4\n→ x = 0.5 or x = −3',
};

export const AI_FALLBACK = (q: string) =>
  `Great question about "${q}"!\n\n1. **Core principle**: Understand the logic before memorising formulas.\n2. **Application**: Practice with varied examples — start simple.\n3. **Common pitfalls**: Always check edge cases.\n\nWant me to go deeper or provide practice problems?`;
