/** Scroll to a section by id without leaving a hash in the URL. */
export const scrollToSection = (id: string): boolean => {
  const element = document.getElementById(id);

  if (!element) {
    return false;
  }

  element.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", window.location.pathname + window.location.search);
  return true;
};
