import { TOKEN } from "./tokenizer";

// Last priority token wins, so typing `p2 ... p1` ends up high — matches
// the user's mental model of overwriting an earlier choice.
export const resolvePriority = (tokens) => {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].kind === TOKEN.PRIORITY) return tokens[i].value;
  }
  return null;
};
