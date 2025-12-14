import { Product } from '@/types';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
    const isLowStock = product.stock <= product.min_stock;
    const isOutOfStock = product.stock === 0;

    return (
        <Card className={`group flex flex-col justify-between transition-all duration-200 hover:border-primary hover:shadow-md ${isOutOfStock ? 'opacity-60' : ''}`}>
            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold leading-tight line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h4>
                    <span className="text-lg font-extrabold text-primary shrink-0">
                        ${Number(product.price).toFixed(2)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 pb-2">
                <div className="min-h-[1.5rem] flex items-center">
                    {isOutOfStock ? (
                        <Badge variant="destructive" className="text-[10px] px-1.5 h-5 gap-1">
                            <AlertCircle className="w-3 h-3" /> Agotado
                        </Badge>
                    ) : isLowStock ? (
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 gap-1 text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400">
                            <AlertCircle className="w-3 h-3" /> Solo {product.stock}
                        </Badge>
                    ) : (
                        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Disponible
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <Button
                    onClick={() => onAddToCart(product)}
                    disabled={isOutOfStock}
                    size="sm"
                    className="w-full font-bold shadow-sm"
                    variant={isOutOfStock ? "ghost" : "default"}
                >
                    {isOutOfStock ? 'Sin Stock' : (
                        <>
                            Agregar <Plus className="w-4 h-4 ml-1" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
