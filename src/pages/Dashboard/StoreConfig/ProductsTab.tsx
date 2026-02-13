import React from 'react'
import { StoreProductList } from './StoreProductList'

export const ProductsTab: React.FC = () => {
    return (
        <div className="py-6">
            <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Gerenciar Produtos da Vitrine</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Selecione quais produtos estarão visíveis publicamente na sua loja virtual.
                </p>
            </div>

            <StoreProductList />
        </div>
    )
}
