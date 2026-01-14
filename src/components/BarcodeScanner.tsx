'use client'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import { Camera, X, Scan } from 'lucide-react'

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void
    onScanFailure?: (error: any) => void
}

export default function BarcodeScanner({ onScanSuccess, onScanFailure }: BarcodeScannerProps) {
    const [scanResult, setScanResult] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null

        if (isScanning) {
            setTimeout(() => {
                scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    false
                )

                scanner.render(
                    (decodedText) => {
                        setScanResult(decodedText)
                        onScanSuccess(decodedText)
                        scanner?.clear()
                        setIsScanning(false)
                    },
                    (error) => {
                        if (onScanFailure) onScanFailure(error)
                    }
                )
            }, 100)
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error))
            }
        }
    }, [isScanning, onScanSuccess, onScanFailure])

    return (
        <div className="w-full">
            {!isScanning && (
                <div className="space-y-4">
                    {scanResult && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <p className="text-xs text-emerald-600 font-medium mb-1">Son Taranan</p>
                            <p className="text-xl font-mono font-bold text-emerald-900 tracking-wider">{scanResult}</p>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setScanResult(null)
                            setIsScanning(true)
                        }}
                        className="group w-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8" />
                        </div>
                        <span className="text-lg">Kamerayı Başlat</span>
                        <span className="text-indigo-200 text-sm font-normal">Barkod okutmak için dokunun</span>
                    </button>
                </div>
            )}

            {/* Scanner Modal */}
            {isScanning && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                                    <Scan className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Barkod Tara</h3>
                                    <p className="text-slate-400 text-xs">Kamerayı barkoda tutun</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsScanning(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scanner Area */}
                        <div className="bg-black min-h-[320px] relative">
                            <div id="reader" className="w-full h-full" />
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 bg-zinc-50 border-t border-zinc-100">
                            <p className="text-center text-sm text-zinc-500">
                                Barkod otomatik olarak algılanacaktır
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
