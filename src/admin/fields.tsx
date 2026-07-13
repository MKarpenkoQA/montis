type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
};

export const Field = ({ label, value, onChange, multiline, hint }: FieldProps) => (
  <label className="block">
    <span className="eyebrow-s text-montis-ink/70 mb-1.5 block">{label}</span>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-montis-ink/15 px-3 py-2.5 bg-white focus:outline-none focus:border-montis-blue resize-y min-h-[88px]"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-montis-ink/15 px-3 py-2.5 bg-white focus:outline-none focus:border-montis-blue"
      />
    )}
    {hint && <span className="text-xs text-montis-ink/50 mt-1 block">{hint}</span>}
  </label>
);

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
};

export const ImageField = ({ label, value, onChange, onUpload }: ImageFieldProps) => {
  const isVideo = /\.(mp4|webm)(\?|$)/i.test(value);

  return (
  <div className="block">
    <span className="eyebrow-s text-montis-ink/70 mb-1.5 block">{label}</span>
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-xl border border-montis-ink/15 px-3 py-2.5 bg-white focus:outline-none focus:border-montis-blue"
      />
      <label className="inline-flex items-center justify-center rounded-full border border-montis-navy px-4 py-2.5 eyebrow-s cursor-pointer hover:bg-montis-navy hover:text-white transition-colors">
        Загрузить
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onUpload(file);
            e.currentTarget.value = "";
          }}
        />
      </label>
    </div>
    {value && (
      isVideo ? (
        <video
          src={value}
          muted
          playsInline
          className="mt-3 h-24 w-auto object-contain rounded-lg border border-montis-ink/10 bg-white p-2"
        />
      ) : (
        <img src={value} alt="" className="mt-3 h-24 w-auto object-contain rounded-lg border border-montis-ink/10 bg-white p-2" />
      )
    )}
  </div>
  );
};
