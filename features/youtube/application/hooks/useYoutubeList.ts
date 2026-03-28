"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiError } from "@/infrastructure/http/apiError"
import { fetchYoutubeList } from "../../infrastructure/api/youtubeApi"
import type { YoutubeVideo } from "../../domain/model/youtubeVideo"

export function useYoutubeList(stockName?: string) {
    const [items, setItems] = useState<YoutubeVideo[]>([])
    const [nextPageToken, setNextPageToken] = useState<string | null>(null)
    const [prevPageToken, setPrevPageToken] = useState<string | null>(null)
    const [totalResults, setTotalResults] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async (pageToken?: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await fetchYoutubeList(stockName, pageToken)
            setItems(data.items)
            setNextPageToken(data.next_page_token)
            setPrevPageToken(data.prev_page_token)
            setTotalResults(data.total_results)
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 401) setError("로그인이 필요합니다.")
                else setError(err.message || "영상 목록을 불러오지 못했습니다.")
            } else {
                setError("영상 목록을 불러오지 못했습니다.")
            }
        } finally {
            setIsLoading(false)
        }
    }, [stockName])

    useEffect(() => {
        load()
    }, [load])

    return {
        items,
        nextPageToken,
        prevPageToken,
        totalResults,
        isLoading,
        error,
        goNext: () => { if (nextPageToken) load(nextPageToken) },
        goPrev: () => { if (prevPageToken) load(prevPageToken) },
    }
}
