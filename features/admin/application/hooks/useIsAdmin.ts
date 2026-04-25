"use client"

import { useEffect, useState } from "react"
import { adminApi } from "../../infrastructure/api/adminApi"

export function useIsAdmin(): boolean | null {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

    useEffect(() => {
        adminApi
            .getStats()
            .then(() => setIsAdmin(true))
            .catch((err: unknown) => {
                const code = (err as { status?: number }).status
                setIsAdmin(code === 403 ? false : null)
            })
    }, [])

    return isAdmin
}
