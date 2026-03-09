"use client";

type Props = {
  text: string;
};

function formatWhatsAppText(text: string) {
  let html = text;

  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  html = html.replace(/~(.*?)~/g, "<del>$1</del>");
  html = html.replace(
    /`(.*?)`/g,
    "<code class='bg-gray-200 px-1 rounded break-all'>$1</code>"
  );

  html = html.replace(/\n/g, "<br/>");

  return html;
}

export default function WhatsAppPreview({ text }: Props) {
  if (!text) return null;

  const html = formatWhatsAppText(text);

  return (
    <div className="bg-[#ECE5DD] rounded-2xl p-4 shadow-inner w-full overflow-hidden">
      <div className="max-w-xs bg-white p-3 rounded-2xl shadow text-sm leading-relaxed break-words">
        <div
          className="break-words"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}