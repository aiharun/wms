'use server'

import { getLowStockProducts, fetchTrendyolProducts } from '@/lib/actions'
import { AlertTriangle, Package, ShoppingBag, MapPin, ExternalLink, Barcode } from 'lucide-react'
import Link from 'next/link'

export default async function LowStockPage() {
    const [warehouseProducts, trendyolData] = await Promise.all([
        getLowStockProducts(),
        fetchTrendyolProducts()
    ])

    const trendyolProducts = (trendyolData.products || []).filter((p: any) => p.onSale && p.quantity <= 5)

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                        <AlertTriangle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 leading-tight">Kritik Stoklar</h1>
                        <p className="text-zinc-500 font-medium">Depo ve Trendyol mağazanızdaki kritik seviyeler</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Warehouse Details */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="flex items-center gap-2 font-black text-zinc-800 uppercase tracking-widest text-sm">
                            <Package className="w-4 h-4 text-amber-600" />
                            Depo Stoğu ({warehouseProducts.length})
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {warehouseProducts.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-zinc-100">
                                <Package className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                                <p className="text-zinc-500 font-bold italic">Depo stoğu güvende.</p>
                            </div>
                        ) : (
                            warehouseProducts.map((product) => (
                                <div key={product.id} className="group bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                                                <Package className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-zinc-900 truncate group-hover:text-indigo-600 transition-colors" title={product.name}>{product.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] font-black text-zinc-800 font-mono px-2 py-0.5 bg-zinc-100 rounded-md">{product.barcode}</span>
                                                    {product.shelves?.code && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100">
                                                            <MapPin className="w-3 h-3" />
                                                            {product.shelves.code}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="px-3 py-1 bg-rose-50 text-rose-700 rounded-xl font-black text-lg">
                                                {product.quantity}
                                            </div>
                                            <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Min: {product.min_stock}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Trendyol Details */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="flex items-center gap-2 font-black text-zinc-800 uppercase tracking-widest text-sm">
                            <ShoppingBag className="w-4 h-4 text-orange-600" />
                            Trendyol Mağaza ({trendyolProducts.length})
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {trendyolProducts.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-zinc-100">
                                <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                                <p className="text-zinc-500 font-bold italic">Mağaza stoğu güvende.</p>
                            </div>
                        ) : (
                            trendyolProducts.map((product: any) => (
                                <div key={product.barcode} className="group bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100 transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0].url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-black text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-1" title={product.title}>{product.title}</h4>
                                                    <a
                                                        href={product.productContentId ? `https://www.trendyol.com/p/${product.productContentId}` : `https://www.trendyol.com/sr?q=${product.barcode}`}
                                                        target="_blank"
                                                        className="p-1.5 text-zinc-400 hover:text-orange-500 transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] font-black text-zinc-800 font-mono px-2 py-0.5 bg-zinc-100 rounded-md flex items-center gap-1">
                                                        <Barcode className="w-3 h-3 text-zinc-400" />
                                                        {product.barcode}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-black text-orange-600 leading-none">{product.salePrice} TL</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 line-through leading-none">{product.listPrice} TL</span>
                                                </div>
                                                <div className="px-3 py-1 bg-orange-50 text-orange-700 rounded-xl font-black text-lg">
                                                    {product.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
