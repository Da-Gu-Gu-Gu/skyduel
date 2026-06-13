export type EmoteType =
  | "happy"
  | "laugh"
  | "love"
  | "cool"
  | "think"
  | "surprised"
  | "sad"
  | "angry";

export interface EmoteDef {
  type: EmoteType;
  emoji: string;
  label: string;
}

export const EMOTES: EmoteDef[] = [
  { type: "happy", emoji: "😊", label: "Happy" },
  { type: "laugh", emoji: "😂", label: "Laughing" },
  { type: "love", emoji: "😍", label: "Love" },
  { type: "cool", emoji: "😎", label: "Cool" },
  { type: "think", emoji: "🤔", label: "Thinking" },
  { type: "surprised", emoji: "😮", label: "Surprised" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😡", label: "Angry" },
];

export const EMOTE_EMOJI = EMOTES.reduce(
  (acc, e) => ({ ...acc, [e.type]: e.emoji }),
  {} as Record<EmoteType, string>
);
