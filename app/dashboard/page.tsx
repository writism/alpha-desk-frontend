import StockSummaryCard from '../components/StockSummaryCard';
import { MOCK_SUMMARIES } from '../mocks/summaryMocks';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-10">

      <header className="mb-8">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">관심종목 요약 정보</p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SUMMARIES.map((stock) => (
            <StockSummaryCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              summary={stock.summary}
              tags={stock.tags}
              sentiment={stock.sentiment}
              sentiment_score={stock.sentiment_score}
              confidence={stock.confidence}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
