'use client';

export default function SearchOverlay({
  active,
  text = 'Searching…',
}: {
  active: boolean;
  text?: string;
}) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-grayscale">
      <div className="rounded-md bg-zinc-900/90 px-5 py-3 text-white shadow-lg flex-col items-center justify-center">
        <div className="loader"></div>
        <div className="text-center text-zinc-400">{text}</div>
      </div>
    </div>
  );
}