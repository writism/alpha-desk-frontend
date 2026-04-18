import { httpClient } from '@/infrastructure/http/httpClient'
import type { BriefingTimeSettings } from '@/features/my/domain/model/mySettings'

export async function updateUserEmail(email: string): Promise<void> {
    await httpClient.patch('/users/me/email', { email })
}

const BRIEFING_SETTINGS_KEY = 'alpha_briefing_settings'

export function getBriefingSettingsLocal(): BriefingTimeSettings {
    if (typeof window === 'undefined') return { korea_time: 7, us_time: 7 }
    const raw = localStorage.getItem(BRIEFING_SETTINGS_KEY)
    if (!raw) return { korea_time: 7, us_time: 7 }
    try {
        return JSON.parse(raw)
    } catch {
        return { korea_time: 7, us_time: 7 }
    }
}

export function saveBriefingSettingsLocal(settings: BriefingTimeSettings): void {
    localStorage.setItem(BRIEFING_SETTINGS_KEY, JSON.stringify(settings))
}
