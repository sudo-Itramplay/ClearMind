import { tokenize, TOKEN } from "./tokenizer";
import { resolvePriority } from "./priorityResolver";
import { resolveDate } from "./dateResolver";

// Composes tokenizer + resolvers. Pure (clock is the only external dep, DI'd).
export const parseQuickInput = (input, config, clock) => {
  const tokens = tokenize(input, config);
  const task = tokens
    .filter((t) => t.kind === TOKEN.TEXT)
    .map((t) => t.raw)
    .join(" ");
  return {
    task,
    priority: resolvePriority(tokens),
    date: resolveDate(tokens, clock),
    isExam: tokens.some((t) => t.kind === TOKEN.EXAM),
    tokens,
  };
};
