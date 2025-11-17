import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, AlertTriangle, Package } from 'lucide-react';
import { Product } from '../data/mockProducts';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const isLowStock = product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock === 0;

  if (viewMode === 'list') {
    return (
      <Card className="p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-[#f6f6f7] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#e1e3e5]">
            <Package className="w-8 h-8 text-[#6d7175]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 mb-1">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.sku}</p>
              </div>
              <p className="text-green-600">₦{product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isOutOfStock ? 'destructive' : isLowStock ? 'outline' : 'secondary'} className="text-xs">
                {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
              </Badge>
              {isLowStock && !isOutOfStock && (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>

          <Button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            size="sm"
            className="bg-[#008060] hover:bg-[#006e52] flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        onClick={() => !isOutOfStock && onAddToCart(product)}
        className={`cursor-pointer ${isOutOfStock ? 'opacity-50' : ''}`}
      >
        <div className="relative aspect-[4/3] bg-[#f6f6f7] flex items-center justify-center border border-[#e1e3e5]">
          <Package className="w-12 h-12 text-[#6d7175]" />
          {isLowStock && (
            <div className="absolute top-2 right-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-600">₦{product.price.toFixed(2)}</p>
            <p className="text-gray-500 text-xs">{product.sku}</p>
          </div>

          <Badge 
            variant={isOutOfStock ? 'destructive' : isLowStock ? 'outline' : 'secondary'} 
            className="w-full text-xs justify-center"
          >
            {isOutOfStock ? 'Out of Stock' : `${product.stock} available`}
          </Badge>
        </div>
      </div>
    </Card>
  );
}