import { useEffect, useState } from "react";
import { checkAuth } from "./api";
import { LoginPage } from "./LoginPage";
import { EditorPage } from "./EditorPage";
import { useAdminContent } from "./useContent";

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const { content, loading, error, reload } = useAdminContent();

  useEffect(() => {
    checkAuth()
      .then((res) => setAuthed(res.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="eyebrow text-montis-ink/60">Загрузка...</p>
      </div>
    );
  }

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error ?? "Не удалось загрузить контент"}</p>
          <button type="button" onClick={() => void reload()} className="rounded-full bg-montis-navy text-white px-5 py-2 eyebrow-s">
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return <EditorPage initialContent={content} onReload={reload} />;
}
