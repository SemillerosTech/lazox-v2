/** Ilustración decorativa: sus lomos no representan títulos ni existencias. */
const BOOK_COLORS = [
  "var(--brand-pink)",
  "var(--brand-yellow)",
  "var(--brand-blue)",
  "var(--brand-green)",
  "var(--brand-red)",
  "var(--brand-lavender)",
] as const;

const BOOKS = [
  { x: 26, width: 36, height: 108 },
  { x: 67, width: 32, height: 128 },
  { x: 104, width: 38, height: 94 },
  { x: 147, width: 40, height: 138 },
  { x: 192, width: 35, height: 118 },
  { x: 255, width: 34, height: 106 },
] as const;

export function ShelfBooks({ variant = "" }: { variant?: string | undefined }) {
  const seed = Array.from(variant).reduce((total, letter) => total + letter.charCodeAt(0), 0);

  return (
    <svg
      viewBox="0 0 320 166"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="block h-auto w-full"
    >
      {BOOKS.map((book, index) => {
        const height = book.height - ((seed + index) % 3) * 6;
        const top = 150 - height;

        return (
          <g
            key={book.x}
            transform={
              index === BOOKS.length - 1 ? `rotate(-14 ${book.x + book.width} 150)` : undefined
            }
          >
            <rect
              x={book.x}
              y={top}
              width={book.width}
              height={height}
              rx="7"
              fill={BOOK_COLORS[(seed + index) % BOOK_COLORS.length]}
            />
            <rect
              x={book.x + 4}
              y={top + 6}
              width="3"
              height={height - 12}
              rx="1.5"
              fill="var(--brand-cream)"
              opacity="0.16"
            />
            <rect
              x={book.x + 8}
              y={top + 18}
              width={book.width - 16}
              height="5"
              rx="2"
              fill="var(--brand-cream)"
              opacity="0.85"
            />
          </g>
        );
      })}
      <rect x="8" y="150" width="304" height="14" rx="7" fill="var(--brand-ink)" />
    </svg>
  );
}
