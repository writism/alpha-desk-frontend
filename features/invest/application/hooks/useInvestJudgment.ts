"use client"

import { useState, useCallback } from "react"
import { streamInvestmentDecision } from "@/features/invest/infrastructure/api/investApi"
import type { InvestmentDecisionResult } from "@/features/invest/domain/model/investJudgment"

export function useInvestJudgment() {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState<InvestmentDecisionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [logs, setLogs] = useState<string[]>([])

    const submit = useCallback(async () => {
        if (!query.trim()) return
        setIsLoading(true)
        setError(null)
        setResult(null)
        setLogs([])
        try {
            for await (const event of streamInvestmentDecision(query.trim())) {
                if (event.type === "log") {
                    setLogs((prev) => [...prev, event.data])
                } else if (event.type === "result") {
                    setResult({ answer: event.data })
                } else if (event.type === "error") {
                    setError(event.data)
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "투자 판단 요청에 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }, [query])

    const reset = useCallback(() => {
        setQuery("")
        setResult(null)
        setError(null)
        setLogs([])
    }, [])

    return { query, setQuery, result, isLoading, error, logs, submit, reset }
}
