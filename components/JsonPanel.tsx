type Props = {
  title: string;
  data: unknown;
};

export default function JsonPanel({ title, data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
      <pre className="overflow-x-auto rounded-xl bg-gray-50 p-4 text-sm text-gray-900">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}