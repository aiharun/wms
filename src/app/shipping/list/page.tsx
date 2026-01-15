'use client'

import { Truck, ListFilter, Search } from 'lucide-react'

export default function ShippingListPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Truck className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Kargo Listesi</h1>
                    <p className="text-zinc-500 text-sm font-medium">Tüm gönderileri burada bulabilirsiniz</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 shadow-sm text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <ListFilter className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Henüz kargo kaydı yok</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">Kargo işlemleri altyapısı hazırlandı. Çok yakında yeni kargo ekleyebileceksiniz.</p>
            </div>
        </div>
    )
}
