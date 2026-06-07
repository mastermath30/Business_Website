import { topics } from "./data";
import type { Question, Topic } from "./types";

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getQuestionsForTopic(topicId: string, count = 8): Question[] {
  void topicId;
  void count;
  return [];
}
