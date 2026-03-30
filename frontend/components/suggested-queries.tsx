type Props = {
  items: string[];
  onSelect: (value: string) => void;
};

export default function SuggestedQueries({ items, onSelect }: Props) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-600">Suggested Queries</p>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-[#4b2e83]/20 hover:bg-[#4b2e83]/5 hover:text-[#4b2e83]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}