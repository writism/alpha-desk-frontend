'use client';

import { useState } from 'react';

interface WatchlistItem {
  id: number;
  symbol: string;
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [input, setInput] = useState('');
  const [nextId, setNextId] = useState(1);

  const handleAdd = () => {
    const symbol = input.trim().toUpperCase();
    if (!symbol) return;
    setItems((prev) => [...prev, { id: nextId, symbol }]);
    setNextId((n) => n + 1);
    setInput('');
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold mb-8">관심종목</h1>

      {/* 등록 UI */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">종목 등록</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="종목 코드 입력 (예: AAPL)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground dark:border-gray-600"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            등록
          </button>
        </div>
      </section>

      {/* 목록 UI */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          관심종목 목록{' '}
          <span className="text-sm font-normal text-gray-500">({items.length})</span>
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg dark:border-gray-600">
            등록된 관심종목이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg dark:border-gray-700"
              >
                <span className="font-medium">{item.symbol}</span>

                {/* 삭제 버튼 UI */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 active:bg-red-100 transition-colors dark:hover:bg-red-950"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
