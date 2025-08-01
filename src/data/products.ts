import { Product } from "@/types/product";
import heroWatch from "@/assets/hero-watch.jpg";
import watchDetails from "@/assets/watch-details.jpg";
import watchesCollection from "@/assets/watches-collection.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "KAJIM Elite",
    price: "R$ 2.899",
    image: heroWatch,
    images: [heroWatch, watchDetails, watchesCollection],
    description: "Relógio de luxo com movimento automático e design elegante.",
    brand: "KAJIM",
    model: "Elite",
    movement: "Automático Suíço",
    case_size: "42mm",
    material: "Aço Inoxidável 316L",
    water_resistance: "100m",
    warranty: "2 anos",
    watch_type: "Dress",
    glass_type: "Sapphire",
    features: [
      "Movimento automático de alta precisão",
      "Cristal de safira resistente a riscos",
      "Pulseira em aço inoxidável premium",
      "Resistente à água até 100 metros",
      "Garantia internacional de 2 anos"
    ]
  },
  {
    id: "2", 
    name: "KAJIM Classic",
    price: "R$ 1.899",
    image: watchDetails,
    images: [watchDetails, heroWatch, watchesCollection],
    description: "Design clássico atemporal com acabamento refinado.",
    brand: "KAJIM",
    model: "Classic",
    movement: "Quartzo Suíço",
    case_size: "40mm",
    material: "Aço Inoxidável",
    water_resistance: "50m",
    warranty: "2 anos",
    watch_type: "Classic",
    glass_type: "Mineral",
    features: [
      "Movimento quartzo de alta precisão",
      "Design clássico e elegante",
      "Pulseira em couro premium",
      "Resistente à água",
      "Embalagem premium inclusa"
    ]
  },
  {
    id: "3",
    name: "KAJIM Sport",
    price: "R$ 3.499", 
    image: watchesCollection,
    images: [watchesCollection, heroWatch, watchDetails],
    description: "Performance esportiva com tecnologia avançada.",
    brand: "KAJIM",
    model: "Sport",
    movement: "Cronógrafo Automático",
    case_size: "44mm",
    material: "Titânio",
    water_resistance: "200m",
    warranty: "3 anos",
    watch_type: "Sport",
    glass_type: "Sapphire",
    features: [
      "Cronógrafo de alta performance",
      "Caixa em titânio ultra-leve",
      "Resistência extrema à água",
      "Pulseira esportiva premium",
      "Certificação ISO para mergulho"
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};