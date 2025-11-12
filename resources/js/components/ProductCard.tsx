// resources/js/Components/ProductCard.tsx
import { Product } from '@/types'; // Importaremos tu tipo 'Product'

// Definimos las props que espera este componente
interface Props {
    product: Product;
    // Esta es la clave: una prop que ES una función
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
    return (
        <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
            <div>
                <h4 className="text-lg font-bold">{product.name}</h4>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">
                    Disponibles: {product.stock}
                </p>
            </div>

            {/* Este es el evento. Al hacer clic, llamamos a la función
        que recibimos en las props ('onAddToCart') y le pasamos
        el producto de ESTA tarjeta.
      */}
            <button
                onClick={() => onAddToCart(product)}
                className="mt-4 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
                Añadir al Carrito
            </button>
        </div>
    );
}
