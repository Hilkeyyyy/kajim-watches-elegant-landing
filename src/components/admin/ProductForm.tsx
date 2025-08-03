import React from "react";
import { ProductFormCore } from "./forms/ProductFormCore";
import { ProductFormErrorBoundary } from "./ProductFormErrorBoundary";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = React.memo(({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const mode = product ? 'edit' : 'create';
  
  return (
    <ProductFormErrorBoundary>
      <ProductFormCore
        product={product}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
        mode={mode}
      />
    </ProductFormErrorBoundary>
  );
});

ProductForm.displayName = 'ProductForm';