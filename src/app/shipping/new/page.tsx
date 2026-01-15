'use client'

import { Truck, ClipboardPen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewShippingPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <ClipboardPen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Yeni Kargo</h1>
                        <p className="text-zinc-500 text-sm font-medium">Yeni bir gönderi kaydı oluşturun</p>
                    </div>
                </div>

                <Link href="/shipping/list" className="flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-zinc-900 transition-colors font-bold text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Listeye Dön
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] border border-zinc-100 p-12 shadow-sm text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Form Hazırlanıyor</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">Yeni kargo ekleme formu geliştirme aşamasındadır.</p>
            </div>
        </div>
    )
}
