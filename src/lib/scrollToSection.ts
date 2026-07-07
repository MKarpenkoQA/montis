/** Scroll to a section by id without leaving a hash in the URL. */
export const scrollToSection = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", window.location.pathname + window.location.search);
};
