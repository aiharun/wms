'use client'

import { useState } from 'react'
import { Truck, Package, Calendar, Clock, History, X, ChevronRight, MapPin, Loader2, Save, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTrendyolOrderDetail, updateSettings } from '@/lib/actions'

interface InTransitListProps {
    orders: any[]
    initialThreshold?: number
    showThresholdInput?: boolean
}

export default function InTransitList({ orders: initialOrders, initialThreshold = 0, showThresholdInput = false }: InTransitListProps) {
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [threshold, setThreshold] = useState(initialThreshold)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSaveThreshold = async () => {
        setIsSaving(true)
        try {
            await updateSettings('shipping_delay_threshold', threshold.toString())
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err) {
            console.error('Failed to save threshold:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleViewProcess = async (order: any) => {
        setSelectedOrder(order)
        setIsLoadingDetail(true)
        try {
            const result = await getTrendyolOrderDetail(order.orderNumber)
            if (result.success && result.order) {
                setSelectedOrder(result.order)
            }
        } catch (err) {
            console.error('Failed to fetch order detail:', err)
        } finally {
            setIsLoadingDetail(false)
        }
    }

    const parseDate = (dateVal: any) => {
        if (!dateVal) return null

        // Handle numeric timestamps
        if (typeof dateVal === 'number') {
            // Trendyol sometimes sends seconds, sometimes milliseconds
            const timestamp = dateVal < 10000000000 ? dateVal * 1000 : dateVal
            return new Date(timestamp)
        }

        // Handle numeric strings
        if (typeof dateVal === 'string' && /^\d+$/.test(dateVal)) {
            const num = parseInt(dateVal)
            const timestamp = num < 10000000000 ? num * 1000 : num
            return new Date(timestamp)
        }

        const d = new Date(dateVal)
        return isNaN(d.getTime()) ? null : d
    }

    const calculateDaysPassed = (dateVal: any) => {
        const orderDate = parseDate(dateVal)
        if (!orderDate) return 0
        const diffTime = Math.abs(new Date().getTime() - orderDate.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const formatDate = (dateVal: any) => {
        const d = parseDate(dateVal)
        if (!d) return '---'
        return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const formatDateTime = (dateVal: any) => {
        const d = parseDate(dateVal)
        if (!d) return '---'
        return d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const filteredOrders = initialThreshold > 0 || threshold > 0
        ? initialOrders.filter(order => calculateDaysPassed(order.orderDate) >= threshold)
        : initialOrders

    return (
        <div className="space-y-6">
            {showThresholdInput && (
                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100/50">
                        <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1.5 pl-1">Gecikme Günü Sınırı</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                                className="w-20 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-inner"
                            />
                            <button
                                onClick={handleSaveThreshold}
                                disabled={isSaving || threshold === initialThreshold}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    showSuccess
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        : "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400"
                                )}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : showSuccess ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                    <Save className="w-3.5 h-3.5" />
                                )}
                                {showSuccess ? 'KAYDEDİLDİ' : 'GÜNCELLE VE KAYDET'}
                            </button>
                            <span className="text-[10px] font-medium text-zinc-400 hidden sm:inline">
                                * Günü değiştirip kaydedebilirsiniz.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => {
                    const days = calculateDaysPassed(order.orderDate)
                    return (
                        <div key={order.orderNumber} className="group bg-white rounded-[2rem] border border-zinc-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black text-blue-500 font-mono tracking-tighter uppercase">#{order.orderNumber}</span>
                                        <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {order.customerFirstName} {order.customerLastName}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100/50">
                                            {days} GÜN
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <div className="w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                            <Calendar className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[11px] font-bold text-zinc-600">{formatDate(order.orderDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <div className="w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                            <MapPin className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-[11px] font-bold text-zinc-600 line-clamp-1">{order.cargoProviderName}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-zinc-500">
                                        <div className="w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 shrink-0">
                                            <Package className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[11px] font-bold text-zinc-600 line-clamp-2">
                                                {order.lines.map((l: any) => l.productName).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <button
                                    onClick={() => handleViewProcess(order)}
                                    className="w-full py-3 bg-zinc-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-zinc-200 hover:shadow-blue-500/20 flex items-center justify-center gap-2 group/btn"
                                >
                                    Süreci Gör
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                                    <History className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-zinc-900">Sevkiyat Süreci</h2>
                                    <p className="text-xs font-bold text-zinc-400 font-mono tracking-wider">PAKET #{selectedOrder.orderNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100 shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-8 relative">
                            {isLoadingDetail && (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Detaylar Yükleniyor...</p>
                                    </div>
                                </div>
                            )}

                            {/* Products Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sipariş İçeriği</span>
                                </div>
                                <div className="grid gap-3">
                                    {selectedOrder.lines?.map((line: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-900 line-clamp-1">{line.productName}</p>
                                                    <p className="text-[10px] font-medium text-zinc-400">SKU: {line.merchantSku || line.barcode}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-white border border-zinc-100 rounded-lg text-xs font-black text-zinc-900">
                                                {line.quantity} ADET
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* History Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sevkiyat Geçmişi</span>
                                </div>
                                <div className="relative pl-6 space-y-8 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
                                    {/* Try direct history (from /shipment-packages) then fallbacks */}
                                    {(selectedOrder.history || selectedOrder.shipmentPackages?.[0]?.history || selectedOrder.packageHistories || []).length > 0 ? (
                                        (selectedOrder.history || selectedOrder.shipmentPackages?.[0]?.history || selectedOrder.packageHistories || []).map((h: any, i: number) => (
                                            <div key={i} className="relative">
                                                <div className={cn(
                                                    "absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white",
                                                    i === 0 ? "bg-blue-500 ring-4 ring-blue-50" : "bg-zinc-200"
                                                )} />
                                                <div className="flex flex-col gap-1">
                                                    <span className={cn(
                                                        "text-sm font-black uppercase tracking-wide",
                                                        i === 0 ? "text-blue-600" : "text-zinc-900"
                                                    )}>
                                                        {h.status === 'Awaiting' ? 'Beklemede' :
                                                            h.status === 'Created' || h.status === 'CreatedDate' ? 'Sipariş Oluşturuldu' :
                                                                h.status === 'Picking' ? 'Toplanıyor' :
                                                                    h.status === 'Invoiced' ? 'Faturalandı' :
                                                                        h.status === 'Shipped' ? 'Kargoya Verildi' :
                                                                            h.status === 'Delivered' ? 'Teslim Edildi' : h.status}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span className="text-[11px] font-bold">
                                                            {formatDateTime(
                                                                h.assignmentDate ||
                                                                h.historyDate ||
                                                                h.creationDate ||
                                                                h.createdDate ||
                                                                h.createdDateLong ||
                                                                h.statusDate ||
                                                                h.date ||
                                                                h.timestamp ||
                                                                h.updatedDate ||
                                                                h.lastModifiedDate ||
                                                                h.pointDate
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-500 ring-4 ring-blue-50" />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black uppercase tracking-wide text-blue-600">
                                                    {selectedOrder.status === 'Shipped' ? 'Kargoda' : selectedOrder.status}
                                                </span>
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold">
                                                        Son Güncelleme: {formatDateTime(selectedOrder.orderDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Müşteri</p>
                                <p className="text-sm font-bold text-zinc-900">{selectedOrder.customerFirstName} {selectedOrder.customerLastName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Kargo No</p>
                                <p className="text-sm font-mono font-bold text-blue-600">
                                    {selectedOrder.shipmentPackages?.[0]?.trackingNumber ||
                                        selectedOrder.trackingNumber ||
                                        selectedOrder.cargoTrackingNumber ||
                                        selectedOrder.barcode ||
                                        selectedOrder.shipmentPackages?.[0]?.barcode ||
                                        '---'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
