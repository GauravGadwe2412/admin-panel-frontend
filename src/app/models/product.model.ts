export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    category: string;
    price: number;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedProductResponse {
    data: Product[];
    total: number;
}