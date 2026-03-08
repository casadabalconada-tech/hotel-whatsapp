"use client";

type Props = {
  language: string;
  value: string;
  onChange: (text: string) => void;
};

const languageLabel = (lang: string) => {
  switch (lang) {
    case "ES": return "🇪🇸 Español";
    case "EN": return "🇬🇧 English";
    case "DE": return "🇩🇪 Deutsch";
    case "FR": return "🇫🇷 Français";
    case "IT": return "🇮🇹 Italiano";
    case "PT": return "🇵🇹 Português";
    default: return lang;
  }
};

export default function LanguageTextarea({
  language,
  value,
  onChange,
}: Props) {

  return (
    <div className="space-y-1">

      <div className="text-xs font-medium text-gray-600">
        {languageLabel(language)}
      </div>

      <textarea
        className="w-full border rounded-lg p-2 text-sm min-h-[80px]
        focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}