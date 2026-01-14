
import { getLowStockProducts, fetchTrendyolProducts } from '@/lib/actions'
import { AlertTriangle } from 'lucide-react'
import LowStockList from '@/components/LowStockList'

export const dynamic = 'force-dynamic'

export default async function LowStockPage() {
    const [warehouseProducts, trendyolData] = await Promise.all([
        getLowStockProducts(),
        fetchTrendyolProducts()
    ])

    const trendyolProducts = (trendyolData.products || []).filter((p: any) => p.onSale && p.quantity <= 5)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                    <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 leading-tight">Kritik Stoklar</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Envanter sağlığını buradan takip edin</p>
                </div>
            </div>

            <LowStockList
                warehouseProducts={warehouseProducts}
                trendyolProducts={trendyolProducts}
            />
        </div>
    )
}
