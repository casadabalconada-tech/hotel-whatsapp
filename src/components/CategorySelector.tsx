"use client";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
};

export default function CategorySelector({
  categories,
  value,
  onChange,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">

      <div className="text-sm font-semibold text-gray-700">
        Categoría
      </div>

      <div className="flex flex-wrap gap-2">

        {categories.map((c) => {

          const active = value === c.id;

          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`
                px-3 py-1.5 rounded-full text-sm transition
                border
                ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }
              `}
            >
              {c.name}
            </button>
          );
        })}

      </div>
    </div>
  );
}