import { atom } from "recoil";

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

export const homeModalOpenState = atom<ModalOpenState>({
  key: "homeModalOpenState",
  default: {
    colorPicker: false,
    settings: false,
    help: false,
    createLobby: false,
  },
});
