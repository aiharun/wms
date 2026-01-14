'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    PackagePlus,
    PackageMinus,
    Settings,
    Menu,
    X,
    Package,
    ScanLine,
    PlusCircle,
    LibrarySquare,
    Warehouse,
    ShoppingBag,
    ArrowDownLeft,
    ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppShellProps {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const navigation = [
        { name: 'Genel Bakış', href: '/', icon: LayoutDashboard },
        { name: 'Stok Giriş', href: '/stock-in', icon: ArrowDownLeft },
        { name: 'Stok Çıkış', href: '/stock-out', icon: ArrowUpRight },
        { name: 'Envanter', href: '/inventory', icon: Package },
        { name: 'Raflar', href: '/shelves', icon: LibrarySquare },
        { name: 'Trendyol', href: '/trendyol', icon: ShoppingBag },
        { name: 'Hızlı Kontrol', href: '/audit', icon: ScanLine },
        { name: 'Ürün Ekle', href: '/products/new', icon: PlusCircle },
        { name: 'Ayarlar', href: '/settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
            {/* Desktop Sidebar - Premium Glass Effect */}
            <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white min-h-screen fixed left-0 top-0 z-30">
                {/* Logo Area */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Warehouse className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-xl tracking-tight">DepoPro</span>
                            <p className="text-xs text-slate-400 -mt-0.5">Depo Yönetim Sistemi</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-transform duration-200",
                                    !isActive && "group-hover:scale-110"
                                )} />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <div className="px-4 py-3 rounded-xl bg-white/5 text-center">
                        <p className="text-xs text-slate-500">Versiyon 2.0</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">Premium Edition</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header - Premium */}
            <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 p-4 sticky top-0 z-40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        <Warehouse className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-zinc-900">DepoPro</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="text-zinc-700" /> : <Menu className="text-zinc-700" />}
                </button>
            </div>

            {/* Mobile Drawer - Premium */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-white pt-20 px-4 animate-fade-in">
                    <nav className="space-y-2">
                        {navigation.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-lg transition-all animate-slide-in",
                                    pathname === item.href
                                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg"
                                        : "text-zinc-600 hover:bg-zinc-100"
                                )}
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            <main className="flex-1 md:ml-72 min-h-screen">
                <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade">
                    {children}
                </div>
            </main>
        </div>
    )
}
