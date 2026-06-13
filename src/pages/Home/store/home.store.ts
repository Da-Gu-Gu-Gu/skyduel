import { atom } from "recoil";
import type { EmoteType } from "../emotes";

export interface BodyPartColors {
  Body: string;
  Face: string;
  Eye: string;
  Ear: string;
}

export type BodyPart = keyof BodyPartColors;

export interface ModalOpenState {
  colorPicker: boolean;
  settings: boolean;
  help: boolean;
  createLobby: boolean;
  joinLobby: boolean;
  emote: boolean;
}

export const bodyPartColors = atom<BodyPartColors>({
  key: "bodyPartColors",
  default: {
    Body: "#FF0000",
    Face: "#00FF00",
    Eye: "#0000FF",
    Ear: "#FFFF00",
  },
});

export const bodyPart = atom<BodyPart>({
  key: "bodyPart",
  default: "Body",
});

/** The most recently triggered emote. `nonce` lets the same emote re-fire on repeat clicks. */
export const activeEmoteState = atom<{ type: EmoteType; nonce: number } | null>({
  key: "activeEmote",
  default: null,
});

export const homeModalOpenState = atom<ModalOpenState>({
  key: "homeModalOpenState",
  default: {
    colorPicker: false,
    settings: false,
    help: false,
    createLobby: false,
    joinLobby: false,
    emote: false,
  },
});
