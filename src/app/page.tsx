import { PackagePlus, PackageMinus, ScanLine, AlertTriangle, History, ArrowUpRight, ArrowDownLeft, TrendingUp, Package, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getRecentLogs, getLowStockProducts } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [logs, lowStockProducts] = await Promise.all([
    getRecentLogs(),
    getLowStockProducts()
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Hoş geldiniz 👋</h1>
        <p className="text-zinc-500 mt-1">Depo operasyonlarınızı buradan yönetin.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/stock-in"
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <PackagePlus className="w-8 h-8 mb-3 relative z-10" />
          <span className="font-bold text-lg block relative z-10">Stok Giriş</span>
          <span className="text-emerald-100 text-sm relative z-10">Ürün ekle</span>
          <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/stock-out"
          className="group relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <PackageMinus className="w-8 h-8 mb-3 relative z-10" />
          <span className="font-bold text-lg block relative z-10">Stok Çıkış</span>
          <span className="text-rose-100 text-sm relative z-10">Ürün çıkar</span>
          <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/audit"
          className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <ScanLine className="w-8 h-8 mb-3 relative z-10" />
          <span className="font-bold text-lg block relative z-10">Hızlı Kontrol</span>
          <span className="text-indigo-100 text-sm relative z-10">Tarama yap</span>
          <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/inventory"
          className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-2xl shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <Package className="w-8 h-8 mb-3 relative z-10" />
          <span className="font-bold text-lg block relative z-10">Depo Stoğu</span>
          <span className="text-slate-300 text-sm relative z-10">Tümünü gör</span>
          <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Critical Stock Alert - Only show if there are low stock items */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Kritik Stok Uyarısı</h3>
                <p className="text-sm text-amber-700">{lowStockProducts.length} ürün minimum stok seviyesinde veya altında</p>
              </div>
            </div>
            <Link
              href="/inventory"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="divide-y divide-amber-100">
            {lowStockProducts.slice(0, 5).map((product: any) => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-amber-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{product.name}</p>
                    <p className="text-xs text-zinc-500 font-mono">{product.barcode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {product.shelves?.code && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-500 bg-white px-2 py-1 rounded border border-zinc-200">
                      <MapPin className="w-3 h-3" />
                      {product.shelves.code}
                    </span>
                  )}
                  <div className="text-right">
                    <p className="text-lg font-bold text-rose-600">{product.quantity}</p>
                    <p className="text-xs text-zinc-400">min: {product.min_stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {lowStockProducts.length > 5 && (
            <div className="p-3 bg-amber-100/50 text-center">
              <Link href="/inventory" className="text-sm text-amber-700 font-medium hover:underline">
                +{lowStockProducts.length - 5} ürün daha...
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Stats & Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Stats Cards */}
        <div className="xl:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">0</p>
            <p className="text-sm text-zinc-500">Bugün Giriş</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">0</p>
            <p className="text-sm text-zinc-500">Bugün Çıkış</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{lowStockProducts.length}</p>
            <p className="text-sm text-zinc-500">Kritik Stok</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <History className="w-5 h-5 text-zinc-400" />
              Son Hareketler
            </h3>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.transaction_type === 'STOCK_IN'
                  ? 'bg-emerald-100 text-emerald-600'
                  : log.transaction_type === 'STOCK_OUT'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-indigo-100 text-indigo-600'
                  }`}>
                  {log.transaction_type === 'STOCK_IN' ? <ArrowUpRight className="w-4 h-4" /> :
                    log.transaction_type === 'STOCK_OUT' ? <ArrowDownLeft className="w-4 h-4" /> :
                      <ScanLine className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{log.products?.name}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`text-sm font-bold ${log.transaction_type === 'STOCK_OUT' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                  {log.transaction_type === 'STOCK_OUT' ? '-' : '+'}{Math.abs(log.quantity_change)}
                </span>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-8 text-zinc-400">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Henüz hareket kaydı yok</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
