"use client";

import { useEffect, useRef } from "react";

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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize del textarea
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [value]);

  return (
    <div className="space-y-1">

      <div className="text-xs font-medium text-gray-600">
        {languageLabel(language)}
      </div>

      <textarea
  ref={textareaRef}
  rows={1}
  className="w-full max-w-full border rounded-lg p-2 text-sm resize-none overflow-hidden
  focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
  value={value}
  onChange={(e) => onChange(e.target.value)}
/>

    </div>
  );
}