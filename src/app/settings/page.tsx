import { Settings, Link as LinkIcon, Key, Bell } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Ayarlar</h1>
                    <p className="text-zinc-500 text-sm">Sistem ve entegrasyon ayarları</p>
                </div>
            </div>

            {/* Settings Cards */}
            <div className="space-y-4">
                {/* Trendyol Integration */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Trendyol Entegrasyonu</h3>
                                <p className="text-sm text-zinc-500">API bağlantısı yapılandırın</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">API Key</label>
                            <input
                                type="password"
                                placeholder="••••••••••••••••"
                                disabled
                                className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">API Secret</label>
                            <input
                                type="password"
                                placeholder="••••••••••••••••"
                                disabled
                                className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500"
                            />
                        </div>
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                                <Bell className="w-4 h-4" />
                                Yakında aktif olacak
                            </span>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <Key className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900">Sistem Bilgisi</h3>
                            <p className="text-sm text-zinc-500">Uygulama detayları</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-zinc-100">
                            <span className="text-zinc-500">Versiyon</span>
                            <span className="font-medium text-zinc-900">2.0.0 Premium</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-zinc-100">
                            <span className="text-zinc-500">Veritabanı</span>
                            <span className="font-medium text-zinc-900">Supabase</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-zinc-500">Framework</span>
                            <span className="font-medium text-zinc-900">Next.js 14</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
