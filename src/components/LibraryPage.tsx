import React from "react";

export default function LibraryPage({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-neutral-800 text-white rounded hover:bg-orange-600 transition"
      >
        ← Geri
      </button>
      <h2 className="text-2xl font-bold mb-4">Kitaplık</h2>
      <div className="text-gray-400">Kitaplık özelliği yakında aktif olacak.</div>
    </div>
  );
}
