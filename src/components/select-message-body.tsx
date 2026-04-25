interface Props {
  options: string[];
  onSelect: (value: string) => void;
}

export function SelectMessageBody({ options, onSelect }: Props) {
  const selectableOptions = options.filter((option) => option.trim().length > 0);

  return (
    <select
      class="rounded border px-2 py-1 text-base w-full max-w-full"
      defaultValue=""
      onChange={(e) => onSelect((e.target as HTMLSelectElement).value)}
    >
      <option value="" disabled hidden>
        선택
      </option>
      {selectableOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
