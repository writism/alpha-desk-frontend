"use client"

import { useCallback } from "react"
import { useAtom } from "jotai"
import useSWR, { mutate as globalMutate } from "swr"
import { ApiError } from "@/infrastructure/http/apiError"
import type { PipelineProgressEvent } from "../../domain/model/pipelineProgressEvent"
import {
    fetchAnalysisLogs,
    fetchDashboardSummaries,
    fetchReportSummaries,
    runPipeline,
    runPipelineStream,
} from "../../infrastructure/api/dashboardApi"
import type { AnalysisLog, StockSummary, PipelineResult } from "../../domain/model/stockSummary"
import {
    pipelineRunningAtom,
    pipelineProgressEventsAtom,
    pipelineResultAtom,
    pipelineElapsedSecondsAtom,
    pipelineErrorAtom,
    articleModeAtom,
} from "../atoms/pipelineAtom"

const DASHBOARD_KEY = "/dashboard/data"

async function fetchDashboardData() {
    const [summaryData, reportData, logData] = await Promise.all([
        fetchDashboardSummaries(),
        fetchReportSummaries(),
        fetchAnalysisLogs(),
    ])
    return { summaries: summaryData, reportSummaries: reportData, analysisLogs: logData }
}

function formatLoadError(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.status === 401) return "로그인이 필요합니다. 다시 로그인해 주세요."
        return err.message || "데이터를 불러오지 못했습니다."
    }
    return "데이터를 불러오지 못했습니다."
}

function formatPipelineError(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.status === 401) return "로그인이 만료되었습니다. 다시 로그인해 주세요."
        return err.message || "파이프라인 실행에 실패했습니다."
    }
    return "파이프라인 실행에 실패했습니다."
}

export const useDashboard = () => {
    const { data, error: swrError, isLoading, mutate } = useSWR(
        DASHBOARD_KEY,
        fetchDashboardData,
        { dedupingInterval: 10 * 60 * 1000 },
    )

    const [running, setRunning] = useAtom(pipelineRunningAtom)
    const [pipelineError, setPipelineError] = useAtom(pipelineErrorAtom)
    const [pipelineResult, setPipelineResult] = useAtom(pipelineResultAtom)
    const [progressEvents, setProgressEvents] = useAtom(pipelineProgressEventsAtom)
    const [elapsedSeconds, setElapsedSeconds] = useAtom(pipelineElapsedSecondsAtom)
    const [articleMode, setArticleMode] = useAtom(articleModeAtom)

    const executePipeline = useCallback(async (symbols?: string[]) => {
        setPipelineError(null)
        setPipelineResult(null)
        setProgressEvents([])
        setElapsedSeconds(null)
        setRunning(true)

        const startedAt = Date.now()

        const onEvent = (event: PipelineProgressEvent) => {
            setProgressEvents((prev) => [...prev, event])
        }

        try {
            const streamResult = await runPipelineStream(symbols, onEvent, articleMode)

            if (!streamResult.used) {
                const result = await runPipeline(symbols, articleMode)
                setPipelineResult(result)
            } else if (streamResult.streamError) {
                setPipelineError(streamResult.streamError)
            }

            setElapsedSeconds(Math.round((Date.now() - startedAt) / 1000))
            await globalMutate(DASHBOARD_KEY)
            setProgressEvents([])
        } catch (err) {
            setElapsedSeconds(Math.round((Date.now() - startedAt) / 1000))
            setPipelineError(formatPipelineError(err))
            setProgressEvents([])
        } finally {
            setRunning(false)
        }
    }, [setPipelineError, setPipelineResult, setProgressEvents, setElapsedSeconds, setRunning, articleMode])

    const error = swrError ? formatLoadError(swrError) : pipelineError

    return {
        summaries: data?.summaries ?? [],
        reportSummaries: data?.reportSummaries ?? [],
        analysisLogs: data?.analysisLogs ?? [],
        isLoading,
        error,
        running,
        pipelineResult,
        progressEvents,
        elapsedSeconds,
        articleMode,
        setArticleMode,
        executePipeline,
        reload: mutate,
    }
}
