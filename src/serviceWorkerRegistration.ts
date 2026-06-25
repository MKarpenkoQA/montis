export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;
  void navigator.serviceWorker.register("/sw.js");
};
