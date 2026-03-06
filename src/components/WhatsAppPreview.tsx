"use client";

type Props = {
  text: string;
};

function formatWhatsAppText(text: string) {
  let html = text;

  // escapar HTML
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // formato WhatsApp
  html = html.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  html = html.replace(/~(.*?)~/g, "<del>$1</del>");
  html = html.replace(/`(.*?)`/g, "<code class='bg-gray-200 px-1 rounded'>$1</code>");

  // saltos de linea
  html = html.replace(/\n/g, "<br/>");

  return html;
}

export default function WhatsAppPreview({ text }: Props) {
  if (!text) return null;

  const html = formatWhatsAppText(text);

  return (
    <div className="bg-[#ECE5DD] rounded-2xl p-4 shadow-inner">
      <div className="max-w-xs bg-white p-3 rounded-2xl shadow text-sm leading-relaxed">
        <div
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}