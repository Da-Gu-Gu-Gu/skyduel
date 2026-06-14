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

/** Ready state for the lobby. `opponent` is FE-simulated for now; BE will drive it later. */
export interface LobbyReadyState {
  player: boolean;
  opponent: boolean;
}

export const lobbyReadyState = atom<LobbyReadyState>({
  key: "lobbyReadyState",
  default: { player: false, opponent: false },
});

/** Lobby start countdown shown on the VS bar; null = idle (shows "VS"). */
export type LobbyCountdown = 3 | 2 | 1 | "Go" | null;

export const lobbyCountdownState = atom<LobbyCountdown>({
  key: "lobbyCountdown",
  default: null,
});

/** Inputs for the create/join lobby modals. */
export interface LobbyForm {
  id: string;
  passCode: string;
}

export const lobbyFormState = atom<LobbyForm>({
  key: "lobbyForm",
  default: { id: "", passCode: "" },
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
