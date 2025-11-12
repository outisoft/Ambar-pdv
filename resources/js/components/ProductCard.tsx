// resources/js/Components/ProductCard.tsx
import { Product } from '@/types'; // Importaremos tu tipo 'Product'

// Definimos las props que espera este componente
interface Props {
    product: Product;
    // Esta es la clave: una prop que ES una función
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
    const stockBadge =
        product.stock > 0
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-rose-100 text-rose-700';

    return (
        <div className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
            <div className="space-y-1.5">
                <h4 className="text-base font-semibold text-gray-900">
                    {product.name}
                </h4>
                <p className="text-sm font-medium text-indigo-700">
                    ${product.price.toFixed(2)}
                </p>
                <span
                    className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${stockBadge}`}
                >
                    Disponibles: {product.stock}
                </span>
            </div>

            <button
                onClick={() => onAddToCart(product)}
                aria-label={`Añadir ${product.name} al carrito`}
                className="mt-4 w-full rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
                Añadir al Carrito
            </button>
        </div>
    );
}
