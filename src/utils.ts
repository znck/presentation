import uuid from "uuid/v4";

export function getZoomToFitAspectRatio(
  aspectRatio: number,
  width: number,
  height: number
) {
  const heightFromWidth = width / aspectRatio;
  const widthFromHeight = height * aspectRatio;
  const currentHeight = width * aspectRatio;

  if (currentHeight < height) {
    return 1;
  } else if (heightFromWidth > height) {
    return widthFromHeight / width;
  } else {
    return 1;
  }
}

export let id: string;
export function renewId() {
  id = uuid();
  if (isBrowser) localStorage.setItem("UUID", id);
  return id;
}

export const isBrowser = typeof window !== "undefined";
id = isBrowser ? localStorage.getItem("UUID") || renewId() : renewId();
