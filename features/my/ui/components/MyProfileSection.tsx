'use client'

import { useMyProfile } from '@/features/my/application/hooks/useMyProfile'

export function MyProfileSection() {
    const { user, email, setEmail, saving, message, saveEmail } = useMyProfile()

    return (
        <section className="border border-outline bg-surface-container-low px-5 py-4">
            <div className="mb-3 font-mono text-xs font-bold text-on-surface uppercase tracking-widest">
                MY_INFO
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-outline w-16 shrink-0">닉네임</span>
                    <span className="font-mono text-sm text-on-surface">{user?.nickname ?? '—'}</span>
                </div>

                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-mono text-xs text-outline w-16 shrink-0">이메일</span>
                    <div className="flex flex-1 gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 주소"
                            className="flex-1 bg-surface-container-lowest border border-outline px-3 py-1.5 font-mono text-sm text-on-surface outline-none focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={saveEmail}
                            disabled={saving}
                            className="shrink-0 border border-outline font-mono text-xs px-3 py-1.5 text-on-surface-variant hover:bg-surface-container uppercase disabled:opacity-50"
                        >
                            {saving ? 'SAVING...' : 'SAVE'}
                        </button>
                    </div>
                </div>

                {message && (
                    <p className={`font-mono text-xs ${message.type === 'success' ? 'text-tertiary' : 'text-error'}`}>
                        {message.text}
                    </p>
                )}
            </div>
        </section>
    )
}
