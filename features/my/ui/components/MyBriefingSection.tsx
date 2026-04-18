'use client'

import { useHome } from '@/features/home/application/hooks/useHome'
import { HomeTodayBriefing } from '@/app/components/HomeTodayBriefing'

export function MyBriefingSection() {
    const state = useHome()

    return (
        <section>
            <div className="mb-3 font-mono text-xs font-bold text-on-surface uppercase tracking-widest">
                TODAY_BRIEFING
            </div>

            {state.status === 'LOADING' && (
                <div className="h-32 bg-surface-container animate-pulse" />
            )}

            {(state.status === 'READY' || state.status === 'PUBLIC_READY') && (
                <HomeTodayBriefing briefing={state.briefing} />
            )}

            {state.status === 'EMPTY' && (
                <div className="border border-dashed border-outline px-5 py-8 text-center">
                    <p className="font-mono text-sm text-on-surface-variant mb-1">아직 오늘의 브리핑이 없습니다.</p>
                    <p className="font-mono text-xs text-outline">
                        아래 SETTINGS → BRIEFING_TIME에서 설정한 시간에 자동으로 채워집니다.
                    </p>
                    <p className="mt-1 font-mono text-xs text-outline">
                        지금 바로 보려면 DASHBOARD에서 RUN_ANALYSIS를 실행하세요.
                    </p>
                </div>
            )}

            {state.status === 'ERROR' && (
                <div className="border border-dashed border-outline px-5 py-6 text-center">
                    <p className="font-mono text-sm text-error">[ERROR] {state.message}</p>
                </div>
            )}
        </section>
    )
}
