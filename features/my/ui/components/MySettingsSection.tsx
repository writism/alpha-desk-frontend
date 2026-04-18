'use client'

import { useMySettings } from '@/features/my/application/hooks/useMySettings'
import { ARTICLE_MODE_OPTIONS, type ArticleMode } from '@/features/dashboard/application/atoms/pipelineAtom'
import { useTheme } from '@/features/theme/application/hooks/useTheme'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function hourLabel(h: number): string {
    return `${String(h).padStart(2, '0')}:00`
}

export function MySettingsSection() {
    const { articleMode, updateArticleMode, briefingSettings, saveBriefingSettings, saveMessage } = useMySettings()
    const { theme, toggle } = useTheme()

    return (
        <section className="border border-outline bg-surface-container-low px-5 py-4 space-y-6">
            <div className="font-mono text-xs font-bold text-on-surface uppercase tracking-widest">
                SETTINGS
            </div>

            {/* 브리핑 시간 설정 */}
            <div>
                <div className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    BRIEFING_TIME
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-outline w-24 shrink-0">한국 증시</span>
                        <select
                            value={briefingSettings.korea_time}
                            onChange={(e) =>
                                saveBriefingSettings({ ...briefingSettings, korea_time: Number(e.target.value) })
                            }
                            className="border border-outline bg-surface-container-lowest font-mono text-sm text-on-surface px-3 py-1.5 outline-none focus:border-primary"
                        >
                            {HOURS.map((h) => (
                                <option key={h} value={h}>{hourLabel(h)}</option>
                            ))}
                        </select>
                        <span className="font-mono text-xs text-outline">KST</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-outline w-24 shrink-0">미국 증시</span>
                        <select
                            value={briefingSettings.us_time}
                            onChange={(e) =>
                                saveBriefingSettings({ ...briefingSettings, us_time: Number(e.target.value) })
                            }
                            className="border border-outline bg-surface-container-lowest font-mono text-sm text-on-surface px-3 py-1.5 outline-none focus:border-primary"
                        >
                            {HOURS.map((h) => (
                                <option key={h} value={h}>{hourLabel(h)}</option>
                            ))}
                        </select>
                        <span className="font-mono text-xs text-outline">KST</span>
                    </div>
                </div>

                {saveMessage && (
                    <p className="mt-2 font-mono text-xs text-tertiary">{saveMessage}</p>
                )}
            </div>

            {/* AI 분석 설정 */}
            <div>
                <div className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    AI_ANALYSIS_MODE
                </div>
                <div className="font-mono text-xs text-outline mb-2">
                    분석 시 종목당 수집할 뉴스·공시 건수
                </div>
                <div className="flex flex-wrap gap-2">
                    {ARTICLE_MODE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateArticleMode(opt.value as ArticleMode)}
                            className={`font-mono text-xs px-3 py-1.5 border uppercase transition-none ${
                                articleMode === opt.value
                                    ? 'border-primary bg-primary text-white font-bold'
                                    : 'border-outline text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 테마 */}
            <div>
                <div className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    DISPLAY_THEME
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    suppressHydrationWarning
                    className="flex items-center gap-2 border border-outline font-mono text-xs px-3 py-1.5 text-on-surface-variant hover:bg-surface-container uppercase transition-none"
                >
                    <span className="material-symbols-outlined text-[14px]" suppressHydrationWarning>
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span suppressHydrationWarning>{theme === 'dark' ? 'LIGHT_MODE로 전환' : 'DARK_MODE로 전환'}</span>
                </button>
            </div>
        </section>
    )
}
