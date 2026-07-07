export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;

  // In dev, clear any stale workers so Vite HMR and CSS updates apply immediately.
  if (import.meta.env.DEV) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister();
      }
    });
    return;
  }

  void navigator.serviceWorker.register("/sw.js");
};
