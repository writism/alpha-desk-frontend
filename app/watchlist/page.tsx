'use client';

import { useEffect, useState } from 'react';
import { watchlistApi, WatchlistItem } from '@/infrastructure/api/watchlistApi';

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    watchlistApi
      .getList()
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!symbol.trim() || !name.trim()) return;
    setError(null);
    try {
      const added = await watchlistApi.add(symbol.trim(), name.trim());
      setItems((prev) => [...prev, added]);
      setSymbol('');
      setName('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await watchlistApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold mb-8">관심종목</h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg dark:bg-red-950 dark:border-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* 등록 UI */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">종목 등록</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="종목 코드 (예: 005930)"
            maxLength={6}
            className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground dark:border-gray-600"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="종목명 (예: 삼성전자)"
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

        {loading ? (
          <p className="text-gray-500 py-8 text-center">불러오는 중...</p>
        ) : items.length === 0 ? (
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
                <div className="flex gap-3 items-center">
                  <span className="font-mono text-sm text-gray-500">{item.symbol}</span>
                  <span className="font-medium">{item.name}</span>
                </div>

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
