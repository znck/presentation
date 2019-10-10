export * from "./localStorage";

export interface Channel {
  send(data: unknown): void;
  on(event: "data", fn: (data: unknown) => void): void;
}
