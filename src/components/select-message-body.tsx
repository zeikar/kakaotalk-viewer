interface Props {
  options: string[];
  onSelect: (value: string) => void;
}

export function SelectMessageBody({ options, onSelect }: Props) {
  return (
    <select
      class="rounded border px-2 py-1 text-base"
      onChange={(e) => onSelect((e.target as HTMLSelectElement).value)}
    >
      <option value="">-</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
