/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { Hero } from "./components/sections/Hero";
import { SecondScreenVideo } from "./components/sections/SecondScreenVideo";
import { Composition } from "./components/sections/Composition";
import { Purification } from "./components/sections/Purification";
import { Formats } from "./components/sections/Formats";
import { Distributors } from "./components/sections/Distributors";
import { CtaSection } from "./components/sections/CtaSection";
import { prefetchSecondaryContent } from "./preloadContent";
import { initSectionPrefetch } from "./mediaManifest";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import type { Language } from "./content/types";
import { useSiteContent } from "./hooks/useSiteContent";
import { scrollToSection } from "./lib/scrollToSection";

export default function App() {
  const [lang, setLang] = useState<Language>("ru");
  const [loading, setLoading] = useState(true);
  const { content } = useSiteContent();

  const t = content.translations[lang];

  const handlePreloaderDone = useCallback(() => {
    setLoading(false);
    prefetchSecondaryContent();
    registerServiceWorker();
    initSectionPrefetch();
  }, []);

  useEffect(() => {
    if (window.location.hash === "#contact") {
      scrollToSection("contact");
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <div className="relative min-h-screen">
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>

      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={handlePreloaderDone} media={content.media} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Header
            t={t}
            lang={lang}
            setLang={setLang}
            media={content.media}
          />

          <main id="main-content">
            <Hero t={t} media={content.media} />
            <SecondScreenVideo t={t} media={content.media} />
            <Composition t={t} />
            <Purification t={t} media={content.media} />
            <Formats t={t} />
            <Distributors t={t} settings={content.settings} />
            <CtaSection t={t} media={content.media} />
          </main>

          <Footer t={t} settings={content.settings} lang={lang} setLang={setLang} />
        </>
      )}
    </div>
  );
}
