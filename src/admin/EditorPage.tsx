import { useMemo, useState } from "react";
import type { Language, SiteContent, SiteMedia, SiteSettings } from "../content/types";
import { Field, ImageField } from "./fields";
import { logout, saveContent, uploadFile } from "./api";
import { updateTranslation } from "./updateContent";

const LANGS: { id: Language; label: string }[] = [
  { id: "ru", label: "RU" },
  { id: "uz", label: "UZ" },
  { id: "en", label: "EN" },
];

const SECTIONS = [
  "Hero",
  "Источник",
  "Состав",
  "Очистка",
  "Форматы",
  "Где купить",
  "CTA",
  "Футер",
  "Медиа",
  "Настройки",
] as const;

type Section = (typeof SECTIONS)[number];

export const EditorPage = ({
  initialContent,
  onReload,
}: {
  initialContent: SiteContent;
  onReload: () => void;
}) => {
  const [content, setContent] = useState(initialContent);
  const [lang, setLang] = useState<Language>("ru");
  const [section, setSection] = useState<Section>("Hero");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const t = content.translations[lang];

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const saved = await saveContent(content);
      setContent(saved);
      setStatus("Сохранено");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (onApply: (url: string) => void, file: File) => {
    const { url } = await uploadFile(file);
    onApply(url);
    setStatus(`Файл загружен: ${url}`);
  };

  const updateMedia = (mutate: (media: SiteMedia) => void) => {
    setContent((current) => {
      const next = structuredClone(current);
      mutate(next.media);
      return next;
    });
  };

  const updateSettings = (mutate: (settings: SiteSettings) => void) => {
    setContent((current) => {
      const next = structuredClone(current);
      mutate(next.settings);
      return next;
    });
  };

  const sectionContent = useMemo(() => {
    switch (section) {
      case "Hero":
        return (
          <div className="grid gap-4">
            <Field label="Eyebrow" value={t.hero.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.hero.eyebrow = v; })} />
            <Field label="Заголовок" value={t.hero.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.hero.title = v; })} multiline hint="Перенос строки: \n" />
            <Field label="Подзаголовок" value={t.hero.subtitle} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.hero.subtitle = v; })} multiline />
          </div>
        );
      case "Источник":
        return (
          <div className="grid gap-4">
            <Field label="Eyebrow" value={t.source.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.source.eyebrow = v; })} />
            <Field label="Заголовок" value={t.source.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.source.title = v; })} multiline />
            <Field label="Текст" value={t.source.text} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.source.text = v; })} multiline />
            <Field label="Intro line (desktop)" value={t.source.introLine} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.source.introLine = v; })} />
            <Field label="Подпись глубины" value={t.source.depthLabel} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.source.depthLabel = v; })} multiline />
            <Field label="Единица глубины" value={t.source.depthUnit} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.source.depthUnit = v; })} />
          </div>
        );
      case "Состав":
        return (
          <div className="grid gap-4">
            <Field label="Eyebrow" value={t.composition.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.eyebrow = v; })} />
            <Field label="Заголовок" value={t.composition.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.title = v; })} multiline />
            <Field label="Текст" value={t.composition.text} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.text = v; })} multiline />
            <Field label="Минерализация" value={t.composition.mineralization} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.mineralization = v; })} />
            <Field label="Описание минерализации" value={t.composition.mineralizationDesc} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.mineralizationDesc = v; })} multiline />
            <Field label="Значение" value={t.composition.mineralizationValue} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.mineralizationValue = v; })} />
            <ImageField
              label="Изображение бутылки"
              value={t.composition.bottleImage}
              onChange={(v) => updateTranslation(setContent, lang, (b) => { b.composition.bottleImage = v; })}
              onUpload={(f) => handleUpload((url) => updateTranslation(setContent, lang, (b) => { b.composition.bottleImage = url; }), f)}
            />
          </div>
        );
      case "Очистка":
        return (
          <div className="grid gap-6">
            <Field label="Eyebrow" value={t.purification.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.purification.eyebrow = v; })} />
            <Field label="Заголовок" value={t.purification.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.purification.title = v; })} multiline />
            <Field label="Текст" value={t.purification.text} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.purification.text = v; })} multiline />
            {t.purification.steps.map((step, i) => (
              <div key={i} className="rounded-2xl border border-montis-ink/10 p-4 grid gap-3 bg-white/70">
                <div className="eyebrow-s text-montis-navy">Шаг {i + 1}</div>
                <Field label="Название" value={step.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.purification.steps[i].title = v; })} />
                <Field label="Описание" value={step.desc} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.purification.steps[i].desc = v; })} multiline />
              </div>
            ))}
          </div>
        );
      case "Форматы":
        return (
          <div className="grid gap-6">
            <Field label="Eyebrow" value={t.formats.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.eyebrow = v; })} />
            <Field label="Заголовок" value={t.formats.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.title = v; })} multiline />
            <Field label="Текст" value={t.formats.text} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.text = v; })} multiline />
            {t.formats.cards.map((card, i) => (
              <div key={i} className="rounded-2xl border border-montis-ink/10 p-4 grid gap-3 bg-white/70">
                <div className="eyebrow-s text-montis-navy">Формат {i + 1}</div>
                <Field label="Объём" value={card.volume} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.cards[i].volume = v; })} />
                <Field label="Описание" value={card.desc} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.cards[i].desc = v; })} multiline />
                <ImageField label="Негазированная" value={card.image} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.cards[i].image = v; })} onUpload={(f) => handleUpload((url) => updateTranslation(setContent, lang, (b) => { b.formats.cards[i].image = url; }), f)} />
                <ImageField label="Газированная" value={card.sparkImage} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.formats.cards[i].sparkImage = v; })} onUpload={(f) => handleUpload((url) => updateTranslation(setContent, lang, (b) => { b.formats.cards[i].sparkImage = url; }), f)} />
              </div>
            ))}
          </div>
        );
      case "Где купить":
        return (
          <div className="grid gap-4">
            <Field label="Eyebrow" value={t.distributors.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.distributors.eyebrow = v; })} />
            <Field label="Заголовок" value={t.distributors.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.distributors.title = v; })} multiline />
            <Field label="Текст" value={t.distributors.text} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.distributors.text = v; })} multiline />
            <Field label="Кнопка" value={t.distributors.offline} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.distributors.offline = v; })} />
          </div>
        );
      case "CTA":
        return (
          <div className="grid gap-4">
            <Field label="Eyebrow" value={t.cta.eyebrow} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.cta.eyebrow = v; })} />
            <Field label="Заголовок" value={t.cta.title} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.cta.title = v; })} multiline />
            <Field label="Кнопка" value={t.cta.button} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.cta.button = v; })} />
          </div>
        );
      case "Футер":
        return (
          <div className="grid gap-4">
            <Field label="Описание" value={t.footer.desc} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.footer.desc = v; })} multiline />
            <Field label="Кнопка «Где купить»" value={t.buy} onChange={(v) => updateTranslation(setContent, lang, (b) => { b.buy = v; })} />
          </div>
        );
      case "Медиа":
        return (
          <div className="grid gap-6">
            <p className="text-sm text-montis-ink/60">
              Общие медиафайлы для всего сайта. Изменения применяются ко всем языкам.
            </p>
            <div className="rounded-2xl border border-montis-ink/10 p-4 grid gap-4 bg-white/70">
              <div className="eyebrow-s text-montis-navy">Hero</div>
              <ImageField
                label="Видео фона"
                value={content.media.heroVideo}
                onChange={(v) => updateMedia((m) => { m.heroVideo = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.heroVideo = url; }), f)}
              />
              <ImageField
                label="Постер видео"
                value={content.media.heroPoster}
                onChange={(v) => updateMedia((m) => { m.heroPoster = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.heroPoster = url; }), f)}
              />
            </div>
            <div className="rounded-2xl border border-montis-ink/10 p-4 grid gap-4 bg-white/70">
              <div className="eyebrow-s text-montis-navy">Бренд</div>
              <ImageField
                label="Логотип"
                value={content.media.logo}
                onChange={(v) => updateMedia((m) => { m.logo = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.logo = url; }), f)}
              />
              <ImageField
                label="Иконка (favicon)"
                value={content.media.logoIcon}
                onChange={(v) => updateMedia((m) => { m.logoIcon = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.logoIcon = url; }), f)}
              />
            </div>
            <div className="rounded-2xl border border-montis-ink/10 p-4 grid gap-4 bg-white/70">
              <div className="eyebrow-s text-montis-navy">Источник (второй экран)</div>
              <ImageField
                label="Видео бутылки"
                value={content.media.sourceVideo}
                onChange={(v) => updateMedia((m) => { m.sourceVideo = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.sourceVideo = url; }), f)}
              />
              <ImageField
                label="Постер видео"
                value={content.media.sourcePoster}
                onChange={(v) => updateMedia((m) => { m.sourcePoster = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.sourcePoster = url; }), f)}
              />
              <ImageField
                label="Изображение (мобильная версия)"
                value={content.media.sourceMobileImage}
                onChange={(v) => updateMedia((m) => { m.sourceMobileImage = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.sourceMobileImage = url; }), f)}
              />
            </div>
            <div className="rounded-2xl border border-montis-ink/10 p-4 grid gap-4 bg-white/70">
              <div className="eyebrow-s text-montis-navy">Очистка</div>
              {content.media.purificationSteps.map((src, i) => (
                <ImageField
                  key={i}
                  label={`Шаг ${i + 1}`}
                  value={src}
                  onChange={(v) => updateMedia((m) => { m.purificationSteps[i] = v; })}
                  onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.purificationSteps[i] = url; }), f)}
                />
              ))}
            </div>
            <div className="rounded-2xl border border-montis-ink/10 p-4 grid gap-4 bg-white/70">
              <div className="eyebrow-s text-montis-navy">CTA</div>
              <ImageField
                label="Фоновое изображение"
                value={content.media.ctaBackground}
                onChange={(v) => updateMedia((m) => { m.ctaBackground = v; })}
                onUpload={(f) => handleUpload((url) => updateMedia((m) => { m.ctaBackground = url; }), f)}
              />
            </div>
          </div>
        );
      case "Настройки":
        return (
          <div className="grid gap-4">
            <Field label="Телефон 1" value={content.settings.phones[0] ?? ""} onChange={(v) => updateSettings((s) => { s.phones = [v, s.phones[1] ?? ""]; })} />
            <Field label="Телефон 2" value={content.settings.phones[1] ?? ""} onChange={(v) => updateSettings((s) => { s.phones = [s.phones[0] ?? "", v]; })} />
            <Field label="Адрес" value={content.settings.address} onChange={(v) => updateSettings((s) => { s.address = v; })} />
            <Field label="Карта embed URL" value={content.settings.mapEmbedUrl} onChange={(v) => updateSettings((s) => { s.mapEmbedUrl = v; })} multiline />
            <Field label="Карта external URL" value={content.settings.mapExternalUrl} onChange={(v) => updateSettings((s) => { s.mapExternalUrl = v; })} multiline />
            <Field label="Instagram URL" value={content.settings.instagramUrl ?? ""} onChange={(v) => updateSettings((s) => { s.instagramUrl = v; })} hint="Пустое поле — иконка неактивна" />
            <Field label="Telegram URL" value={content.settings.telegramUrl ?? ""} onChange={(v) => updateSettings((s) => { s.telegramUrl = v; })} hint="Пустое поле — иконка неактивна" />
          </div>
        );
      default:
        return null;
    }
  }, [content, lang, section, t]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-montis-ink/10 bg-montis-cream/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="eyebrow-s text-montis-ink/60">MONTIS CMS</div>
            <h1 className="font-sans not-italic text-2xl text-montis-navy">Редактор контента</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-montis-ink/15 px-4 py-2 eyebrow-s hover:border-montis-navy">
              Сайт ↗
            </a>
            <button type="button" onClick={() => void onReload()} className="rounded-full border border-montis-ink/15 px-4 py-2 eyebrow-s">
              Обновить
            </button>
            <button
              type="button"
              onClick={() => void logout().then(() => window.location.reload())}
              className="rounded-full border border-montis-ink/15 px-4 py-2 eyebrow-s"
            >
              Выйти
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-full bg-montis-navy text-white px-5 py-2 eyebrow-s disabled:opacity-60"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="flex gap-2">
            {LANGS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLang(item.id)}
                className={`rounded-full px-3 py-1.5 eyebrow-s border ${lang === item.id ? "bg-montis-navy text-white border-montis-navy" : "border-montis-ink/15"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <nav className="flex lg:flex-col flex-wrap gap-2">
            {SECTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                className={`rounded-xl px-3 py-2 text-left text-sm border ${section === item ? "bg-white border-montis-blue text-montis-navy" : "border-transparent hover:bg-white/70"}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="rounded-3xl border border-montis-ink/10 bg-white/80 p-5 sm:p-6">
          <h2 className="font-sans not-italic text-3xl text-montis-navy mb-5">{section}</h2>
          {sectionContent}
        </main>
      </div>

      {status && (
        <div className="fixed bottom-4 right-4 rounded-full bg-montis-navy text-white px-4 py-2 text-sm shadow-lg">
          {status}
        </div>
      )}
    </div>
  );
};
