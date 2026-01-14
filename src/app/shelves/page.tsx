import { getShelves } from '@/lib/actions'
import { Package, MapPin } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ShelvesPage() {
    const shelves = await getShelves()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Depo Rafları</h1>
                        <p className="text-zinc-500 text-sm">{shelves.length} raf tanımlı</p>
                    </div>
                </div>
                <Link
                    href="/shelves/new"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                    + Yeni Raf
                </Link>
            </div>

            {/* Shelf Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shelves.map((shelf, index) => (
                    <div
                        key={shelf.id}
                        className="group bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center mb-4 group-hover:from-indigo-200 group-hover:to-indigo-100 transition-all">
                            <MapPin className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-lg text-zinc-900">{shelf.code}</h3>
                        <p className="text-sm text-zinc-500 mt-1">Kapasite: {shelf.capacity}</p>
                    </div>
                ))}
            </div>

            {shelves.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
                    <Package className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                    <p className="text-zinc-500 mb-4">Henüz raf tanımlanmadı</p>
                    <Link
                        href="/shelves/new"
                        className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all"
                    >
                        İlk Rafı Oluştur
                    </Link>
                </div>
            )}
        </div>
    )
}
