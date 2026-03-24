"use client"

import { useEffect, useState } from "react"
import { useDashboard } from "@/features/dashboard/application/hooks/useDashboard"
import { useWatchlist } from "@/features/watchlist/application/hooks/useWatchlist"
import { DashboardAnalysisLogsSection } from "./components/DashboardAnalysisLogsSection"
import { DashboardPipelineResult } from "./components/DashboardPipelineResult"
import { DashboardSummarySection } from "./components/DashboardSummarySection"
import { DashboardWatchlistSection } from "./components/DashboardWatchlistSection"

export default function DashboardPage() {
    const {
        summaries,
        analysisLogs,
        isLoading: isSummaryLoading,
        error: summaryError,
        pipelineResult,
        executePipeline,
        reload,
    } = useDashboard()
    const { items, isLoading: isWatchlistLoading, error: watchlistError } = useWatchlist()
    const [running, setRunning] = useState(false)
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
    const [hasInitializedSelection, setHasInitializedSelection] = useState(false)

    useEffect(() => {
        const itemSymbols = items.map((item) => item.symbol)

        if (itemSymbols.length === 0) {
            setSelectedSymbols([])
            setHasInitializedSelection(false)
            return
        }

        setSelectedSymbols((prev) => {
            if (!hasInitializedSelection) return itemSymbols
            return prev.filter((symbol) => itemSymbols.includes(symbol))
        })
        setHasInitializedSelection(true)
    }, [items, hasInitializedSelection])

    const selectedCount = selectedSymbols.length
    const allSelected = items.length > 0 && selectedCount === items.length

    const handleSelectSymbol = (symbol: string, checked: boolean) => {
        setSelectedSymbols((prev) => {
            if (checked) {
                return prev.includes(symbol) ? prev : [...prev, symbol]
            }
            return prev.filter((item) => item !== symbol)
        })
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedSymbols(checked ? items.map((item) => item.symbol) : [])
    }

    const handleRunPipeline = async () => {
        if (selectedSymbols.length === 0) return
        setRunning(true)
        try {
            await executePipeline(selectedSymbols)
        } finally {
            setRunning(false)
        }
    }

    const allSkipped = pipelineResult ? pipelineResult.processed.every((p) => p.skipped) : false
    const canRun = selectedSymbols.length > 0

    return (
        <main
            className="min-h-screen bg-background text-foreground p-6 md:p-10"
            aria-busy={running}
        >
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">대시보드</h1>
                    <p className="text-sm text-gray-500 mt-1">관심종목 요약 정보</p>
                </div>
                <button
                    type="button"
                    onClick={handleRunPipeline}
                    disabled={running || isSummaryLoading || !canRun}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-colors flex items-center gap-2"
                >
                    {running && (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {running
                        ? `선택 종목 AI 분석 중... (${selectedSymbols.length}개)`
                        : `선택 종목 분석 (${selectedSymbols.length}개)`}
                </button>
            </header>

            {running && (
                <div
                    className="mb-6 px-4 py-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300"
                    role="status"
                    aria-live="polite"
                >
                    선택한 {selectedSymbols.length}개 종목에 대해 뉴스 수집 및 AI 분석을 진행 중입니다. 보통 30초~1분
                    정도 걸릴 수 있습니다.
                </div>
            )}

            <DashboardPipelineResult
                running={running}
                pipelineResult={pipelineResult}
                allSkipped={allSkipped}
            />

            {summaryError && (
                <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
                    <span className="flex-1 text-sm">{summaryError}</span>
                    <button
                        type="button"
                        onClick={() => reload()}
                        className="shrink-0 rounded border border-red-400 px-3 py-1 text-sm font-medium hover:bg-red-100"
                    >
                        다시 시도
                    </button>
                </div>
            )}

            <DashboardWatchlistSection
                items={items}
                isWatchlistLoading={isWatchlistLoading}
                watchlistError={watchlistError}
                selectedSymbols={selectedSymbols}
                allSelected={allSelected}
                selectedCount={selectedCount}
                running={running}
                onSelectAll={handleSelectAll}
                onSelectSymbol={handleSelectSymbol}
            />

            <DashboardSummarySection
                summaries={summaries}
                isSummaryLoading={isSummaryLoading}
                running={running}
                watchlistCount={items.length}
                canRunPipeline={canRun}
                onRunPipeline={handleRunPipeline}
            />

            <DashboardAnalysisLogsSection
                analysisLogs={analysisLogs}
                isSummaryLoading={isSummaryLoading}
                running={running}
                canRunPipeline={canRun}
                onRunPipeline={handleRunPipeline}
            />
        </main>
    )
}
