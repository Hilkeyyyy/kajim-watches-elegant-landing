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
    details: {
      brand: "KAJIM",
      model: "Elite",
      movement: "Automático Suíço",
      caseSize: "42mm",
      material: "Aço Inoxidável 316L",
      waterResistance: "100m",
      warranty: "2 anos"
    },
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
    details: {
      brand: "KAJIM",
      model: "Classic",
      movement: "Quartzo Suíço",
      caseSize: "40mm",
      material: "Aço Inoxidável",
      waterResistance: "50m",
      warranty: "2 anos"
    },
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
    details: {
      brand: "KAJIM",
      model: "Sport",
      movement: "Cronógrafo Automático",
      caseSize: "44mm",
      material: "Titânio",
      waterResistance: "200m",
      warranty: "3 anos"
    },
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