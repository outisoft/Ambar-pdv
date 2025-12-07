import { Product } from '@/types';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
    const isLowStock = product.stock <= product.min_stock;
    const isOutOfStock = product.stock === 0;

    return (
        <div
            className={`group flex flex-col justify-between rounded-lg border bg-white p-4 transition-all duration-200 hover:border-blue-600 hover:shadow-md ${isOutOfStock ? 'opacity-60 grayscale' : ''
                }`}
        >
            <div>
                {/* Header: Name and Price */}
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                    </h4>
                    <div className="text-right">
                        <span className="block text-lg font-extrabold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Stock Status - Booking Style Urgency */}
                <div className="mb-4 min-h-[1.5rem]">
                    {isOutOfStock ? (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Agotado
                        </span>
                    ) : isLowStock ? (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3" /> ¡Solo quedan {product.stock}!
                        </span>
                    ) : (
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Disponible
                        </span>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
                className={`w-full rounded-md py-2 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
            >
                {isOutOfStock ? (
                    'No disponible'
                ) : (
                    <>
                        Seleccionar <Plus className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
    );
}
