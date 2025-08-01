export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  description: string;
  details: {
    brand: string;
    model: string;
    movement: string;
    caseSize: string;
    material: string;
    waterResistance: string;
    warranty: string;
  };
  features: string[];
}

export interface ProductCardProps {
  product: Omit<Product, 'images' | 'details' | 'features'>;
  onProductClick: (id: string) => void;
}