import type { AnalysisLog } from "@/features/dashboard/domain/model/stockSummary"
import type { GaugeLabel, HomeStats } from "../model/homeStats"

function calcGaugeLabel(score: number): GaugeLabel {
    if (score <= 35) return "공포"
    if (score <= 64) return "중립"
    return "탐욕"
}

export function calcHomeStats(logs: AnalysisLog[]): HomeStats {
    if (logs.length === 0) {
        return {
            gauge: { score: 50, label: "중립" },
            distribution: { positive: 0, neutral: 0, negative: 0, total: 0 },
        }
    }

    const avgScore = logs.reduce((sum, l) => sum + l.sentiment_score, 0) / logs.length
    const gaugeScore = Math.round(((avgScore + 1) / 2) * 100)

    const distribution = {
        positive: logs.filter((l) => l.sentiment === "POSITIVE").length,
        neutral: logs.filter((l) => l.sentiment === "NEUTRAL").length,
        negative: logs.filter((l) => l.sentiment === "NEGATIVE").length,
        total: logs.length,
    }

    return {
        gauge: { score: gaugeScore, label: calcGaugeLabel(gaugeScore) },
        distribution,
    }
}
