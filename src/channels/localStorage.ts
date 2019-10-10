import { Channel } from "@/channels";

function getId() {
  return `${location.hostname}${location.pathname}`;
}

export function createLocalStorageChannel(): Channel {
  const key = getId();
  const listeners: Array<(data: unknown) => void> = [];
  const handler = (event: StorageEvent) => {
    if (event.key === key) {
      if (event.newValue && listeners.length) {
        const data = JSON.parse(event.newValue);
        listeners.forEach(fn => fn(data));
      }
    }
  };

  window.addEventListener("storage", handler, { passive: true });

  return {
    send(data) {
      localStorage.setItem(key, JSON.stringify(data));
    },
    on(event, fn) {
      if (event === "data") listeners.push(fn);
    },
  };
}
