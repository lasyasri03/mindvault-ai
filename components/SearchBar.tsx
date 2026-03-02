"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search notes..." }: SearchBarProps) {
  return (
    <input
      aria-label="Search notes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="glass-input w-full"
    />
  );
}
