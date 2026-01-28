export interface ProductImage {
    id: number;
    url: string;
    productId: number;
}

export interface Category {
    id: number;
    name: string;
    path: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    material: string;
    summary: string;
    collection: string;
    lens: string;
    originCountry: string;
    Shape: string;
    sizeInfo: string;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
    category: Category;
}

export interface ProductResponse {
    data: Product;
}