export interface ReactionPayload {
  emoji: string;
  title: string;
  subtitle?: string;
  particles?: string[];
}

export type ReactionListener = (payload: ReactionPayload) => void;

export const reactionListeners = new Set<ReactionListener>();

export const triggerReaction = (payload: ReactionPayload) => {
  reactionListeners.forEach((fn) => fn(payload));
};
