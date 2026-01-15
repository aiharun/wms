'use client'

import { useState, useEffect } from 'react'
import {
    ShoppingBag,
    Percent,
    Truck,
    ChevronDown,
    HelpCircle,
    Zap,
    Wallet,
    Box
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProfitCalculator() {
    // Toggles
    const [isMicroExport, setIsMicroExport] = useState(false)
    const [isShippedToday, setIsShippedToday] = useState(false)

    // Inputs
    const [cost, setCost] = useState<number>(0)
    const [profitMode, setProfitMode] = useState<'amount' | 'rate'>('amount')
    const [targetProfit, setTargetProfit] = useState<number>(0)
    const [shipping, setShipping] = useState<number>(0)
    const [vatRate, setVatRate] = useState<number>(20)
    const [category, setCategory] = useState('')
    const [commission, setCommission] = useState<number>(0)

    // Calculated Sale Price
    const [salePrice, setSalePrice] = useState<number>(0)

    useEffect(() => {
        const commRatio = commission / 100

        let calculatedPrice = 0
        if (profitMode === 'amount') {
            const numerator = cost + shipping + targetProfit
            const denominator = 1 - commRatio
            calculatedPrice = denominator > 0 ? numerator / denominator : 0
        } else {
            const profitRatio = targetProfit / 100
            const numerator = cost + shipping
            const denominator = 1 - commRatio - profitRatio
            calculatedPrice = denominator > 0 ? numerator / denominator : 0
        }

        setSalePrice(calculatedPrice)
    }, [cost, targetProfit, profitMode, commission, shipping])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)
    }

    const VatOption = ({ value }: { value: number }) => (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
                <input
                    type="radio"
                    className="sr-only"
                    name="vat"
                    checked={vatRate === value}
                    onChange={() => setVatRate(value)}
                />
                <div className={cn(
                    "w-10 h-5 rounded-full transition-all duration-300 flex items-center px-1",
                    vatRate === value ? "bg-[#FF9F81]" : "bg-zinc-200"
                )}>
                    <div className={cn(
                        "w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm",
                        vatRate === value ? "translate-x-5" : "translate-x-0"
                    )} />
                </div>
            </div>
            <span className={cn(
                "text-xs font-bold transition-colors",
                vatRate === value ? "text-zinc-900" : "text-zinc-500"
            )}>{value} %</span>
        </label>
    )

    const Toggle = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative" onClick={onClick}>
                <div className={cn(
                    "w-10 h-5 rounded-full transition-all duration-300 flex items-center px-1",
                    active ? "bg-zinc-900" : "bg-zinc-200"
                )}>
                    <div className={cn(
                        "w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm",
                        active ? "translate-x-5" : "translate-x-0"
                    )} />
                </div>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">{label}</span>
        </label>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Column 1: Seçimler/Maliyet & KDV */}
            <div className="space-y-8">
                {/* Seçimler & Ürün Maliyeti Card */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-50 shadow-sm space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-900">Seçimler</h3>
                        </div>
                        <div className="flex items-center gap-6">
                            <Toggle
                                active={isMicroExport}
                                onClick={() => setIsMicroExport(!isMicroExport)}
                                label="Mikro ihracat"
                            />
                            <Toggle
                                active={isShippedToday}
                                onClick={() => setIsShippedToday(!isShippedToday)}
                                label="Bugün kargoda"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-900">Ürün Maliyeti</h3>
                            <HelpCircle className="w-5 h-5 text-sky-400 opacity-60" />
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Box className="w-4 h-4 text-zinc-400" />
                            </div>
                            <input
                                type="number"
                                value={cost || ''}
                                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                                placeholder="0 ₺"
                                className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-lg font-bold text-zinc-900 focus:outline-none focus:border-zinc-200 transition-all placeholder:text-zinc-400"
                            />
                        </div>
                    </div>
                </div>

                {/* KDV (%) Card */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-50 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-900">KDV (%)</h3>
                        <HelpCircle className="w-5 h-5 text-sky-400 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between">
                        <VatOption value={20} />
                        <VatOption value={10} />
                        <VatOption value={1} />
                        <VatOption value={0} />
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Percent className="w-4 h-4 text-zinc-400" />
                        </div>
                        <input
                            type="number"
                            value={vatRate || ''}
                            onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-lg font-bold text-zinc-900 focus:outline-none focus:border-zinc-200 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Column 2: İstenilen Kâr & Kategori */}
            <div className="space-y-8">
                {/* İstenilen Kâr Oranı / Tutarı Card */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-50 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-900">İstenilen Kâr Oranı / Tutarı</h3>
                        <HelpCircle className="w-5 h-5 text-sky-400 opacity-60" />
                    </div>
                    <div className="relative group">
                        <select
                            value={profitMode}
                            onChange={(e) => setProfitMode(e.target.value as any)}
                            className="w-full pl-6 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 appearance-none focus:outline-none transition-all"
                        >
                            <option value="amount">Tutara Göre (₺)</option>
                            <option value="rate">Orana Göre (%)</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Wallet className="w-4 h-4 text-zinc-400" />
                        </div>
                        <input
                            type="number"
                            value={targetProfit || ''}
                            onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
                            placeholder="0 ₺"
                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-lg font-bold text-zinc-900 focus:outline-none focus:border-zinc-200 transition-all placeholder:text-zinc-400"
                        />
                    </div>
                </div>

                {/* Kategori Card */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-50 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-900">Kategori</h3>
                        <HelpCircle className="w-5 h-5 text-sky-400 opacity-60" />
                    </div>
                    <div className="relative group">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-6 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 appearance-none focus:outline-none transition-all"
                        >
                            <option value="">Kategori Seçin</option>
                            <option value="moda">Giyim & Moda</option>
                            <option value="elektronik">Elektronik</option>
                            <option value="kozmetik">Kozmetik</option>
                            <option value="ev">Ev & Yaşam</option>
                            <option value="diger">Diğer</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Komisyon Oranı:</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                value={commission || ''}
                                onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                                placeholder="Özel komisyon oranı"
                                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-600 focus:outline-none placeholder:text-zinc-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 3: Kargo & Result */}
            <div className="space-y-8">
                {/* Kargo Ücreti Card */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-50 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-900">Kargo Ücreti</h3>
                        <HelpCircle className="w-5 h-5 text-sky-400 opacity-60" />
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Truck className="w-4 h-4 text-zinc-400" />
                        </div>
                        <input
                            type="number"
                            value={shipping || ''}
                            onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                            placeholder="0 ₺"
                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-lg font-bold text-zinc-900 focus:outline-none focus:border-zinc-200 transition-all placeholder:text-zinc-400"
                        />
                    </div>
                </div>

                {/* Final Price Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-50 shadow-sm flex flex-col items-center justify-center text-center gap-6">
                    <div className="space-y-1">
                        <h2 className="text-6xl font-extrabold text-zinc-900 tracking-tight">
                            ₺{formatCurrency(salePrice)}
                        </h2>
                    </div>

                    <button className="w-full py-5 bg-[#FFB096] hover:bg-[#FF9F81] text-white rounded-2xl text-base font-bold transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-3 active:scale-[0.98]">
                        <Zap className="w-5 h-5 fill-current" />
                        Fiyat Oluştur
                    </button>
                </div>
            </div>

        </div>
    )
}
