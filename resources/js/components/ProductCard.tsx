// resources/js/Components/ProductCard.tsx
import { Product } from '@/types'; // Importaremos tu tipo 'Product'

// Definimos las props que espera este componente
interface Props {
    product: Product;
    // Esta es la clave: una prop que ES una función
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {

    const isLowStock = product.stock <= product.min_stock;
    const isOutOfStock = product.stock === 0;

    const stockBadge =
        isOutOfStock
            ? 'bg-rose-100 text-rose-700'
            : isLowStock
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-emerald-100 text-emerald-700';

    return (
        <div className={`border p-4 rounded-lg shadow-sm flex flex-col justify-between transition-all
        ${isOutOfStock ? 'bg-gray-100 opacity-75 grayscale' : ''} 
        ${isLowStock && !isOutOfStock ? 'border-orange-300 bg-orange-50' : 'bg-white'}
    `}>
            <div>
                <h4 className="font-bold text-lg">{product.name}</h4>

                {/* Precio */}
                <p className="text-gray-600 font-bold text-xl">${Number(product.price).toFixed(2)}</p>

                {/* Stock con Alerta */}
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded 
                ${isOutOfStock ? 'bg-red-200 text-red-800' :
                            isLowStock ? 'bg-orange-200 text-orange-800' : 'bg-green-100 text-green-800'}
            `}>
                        {isOutOfStock ? 'AGOTADO' : `Stock: ${product.stock}`}
                    </span>

                    {/* Icono de advertencia si es bajo */}
                    {isLowStock && !isOutOfStock && (
                        <span className="text-xs text-orange-600 font-bold animate-pulse">
                            ¡Poco Stock!
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
                className={`mt-4 w-full p-2 rounded text-white font-bold transition
            ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
        `}
            >
                {isOutOfStock ? 'Sin Stock' : 'Añadir'}
            </button>
        </div>
    );
}
