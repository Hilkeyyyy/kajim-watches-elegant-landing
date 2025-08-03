import React from "react";
import { ProductFormCore } from "./forms/ProductFormCore";

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
    <ProductFormCore
      product={product}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      mode={mode}
    />
  );
});

ProductForm.displayName = 'ProductForm';