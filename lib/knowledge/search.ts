import { knowledgeChunks } from "./documents";

const synonymGroups = [
  ["cancel", "cancellation", "churn", "renewal"],
  ["billing", "invoice", "dispute"],
  ["credit", "discount", "incentive"],
  ["usage", "adoption", "active", "seats"],
  ["call", "session", "meeting", "onboarding"],
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function queryTerms(query: string) {
  const terms = new Set(normalize(query).split(/\s+/).filter((term) => term.length > 2));
  for (const group of synonymGroups) {
    if (group.some((term) => terms.has(term))) group.forEach((term) => terms.add(term));
  }
  return [...terms];
}

export type KnowledgeSearchMatch = Omit<(typeof knowledgeChunks)[number], "keywords"> & { score: number };

export function searchKnowledgeBase(query: string, limit = 3): KnowledgeSearchMatch[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];

  return knowledgeChunks
    .map((chunk) => {
      const title = normalize(`${chunk.title} ${chunk.section}`);
      const body = normalize(chunk.content);
      const keywords = normalize(chunk.keywords.join(" "));
      const rawScore = terms.reduce((score, term) => {
        if (title.includes(term)) score += 4;
        if (keywords.includes(term)) score += 3;
        if (body.includes(term)) score += 1;
        return score;
      }, 0);
      return { ...chunk, score: rawScore };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, Math.min(Math.max(limit, 1), 5))
    .map((chunk) => ({
      id: chunk.id,
      documentId: chunk.documentId,
      title: chunk.title,
      section: chunk.section,
      content: chunk.content,
      citation: chunk.citation,
      score: Number((chunk.score / Math.max(terms.length * 8, 1)).toFixed(2)),
    }));
}
