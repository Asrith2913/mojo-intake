type Props = {
  label: string;
  value: string | number;
};

export default function ScoreBadge({ label, value }: Props) {
  return (
    <div className="rounded-xl border px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}