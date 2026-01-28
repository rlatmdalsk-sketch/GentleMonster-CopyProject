import { httpClient as api } from "./axios";

// 새로운 상품 등록
export const createProduct = async (productData: FormData) => {
    const response = await api.post(`/products/{id}`, productData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};