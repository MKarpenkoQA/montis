import { useState, type FormEvent } from "react";
import { login } from "./api";

export const LoginPage = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-montis-ink/10 bg-white p-8 shadow-[0_12px_40px_rgba(15,29,61,0.08)]"
      >
        <div className="eyebrow text-montis-navy/70 mb-2">MONTIS</div>
        <h1 className="font-sans not-italic text-3xl text-montis-navy mb-6">Админ-панель</h1>
        <label className="block mb-4">
          <span className="eyebrow-s text-montis-ink/70 mb-2 block">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-montis-ink/15 px-4 py-3 bg-montis-cream/50 focus:outline-none focus:border-montis-blue"
            autoFocus
          />
        </label>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-montis-navy text-white py-3 eyebrow-s disabled:opacity-60"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};
