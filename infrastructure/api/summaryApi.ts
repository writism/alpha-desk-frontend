import { httpClient } from "@/infrastructure/http/httpClient";
import { TagItem } from "@/app/mocks/summaryMocks";

export interface StockSummaryItem {
  symbol: string;
  name: string;
  summary: string;
  tags: TagItem[];
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentiment_score: number;
  confidence: number;
}

export const summaryApi = {
  getSummaries: async (): Promise<StockSummaryItem[]> => {
    const res = await httpClient.get("/pipeline/summaries");
    if (!res.ok) throw new Error("요약 데이터 조회에 실패했습니다.");
    return res.json();
  },

  runPipeline: async (): Promise<void> => {
    const res = await httpClient.post("/pipeline/run", undefined);
    if (!res.ok) throw new Error("파이프라인 실행에 실패했습니다.");
  },
};
