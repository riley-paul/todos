import { Workbox } from "workbox-window";

export function registerServiceWorker(onUpdate: () => void) {
  if (!("serviceWorker" in navigator)) return;

  const wb = new Workbox("/sw.js");

  // Fired when a new SW is waiting to activate
  wb.addEventListener("waiting", () => {
    onUpdate();
  });

  wb.register();
}
