import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCart, addToCart, updateCart, removeCart } from "../api/cart.api.ts";
import type { CartItem } from "../types/Cart.ts";

interface CartState {
    items: CartItem[];
    loading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (productId: number, quantity: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    getTotalCount: () => number;
    getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,

            // 1. 장바구니 데이터 로드
            fetchCart: async () => {
                set({ loading: true });
                try {
                    const result = await getCart();
                    // result가 { items: [...] } 구조인지, 아니면 배열 그 자체인지에 따라 처리
                    const cartData = Array.isArray(result) ? result : (result as any).items || [];
                    set({ items: cartData });
                } catch (e) {
                    console.error("장바구니 로드 실패", e);
                } finally {
                    set({ loading: false });
                }
            },

            // 2. 상품 추가
            addItem: async (productId, quantity) => {
                try {
                    await addToCart(productId, quantity);
                    await get().fetchCart(); // 목록 갱신
                } catch (e) {
                    console.error("장바구니 담기 실패", e);
                    throw e;
                }
            },

            // 3. 수량 변경
            updateQuantity: async (cartItemId, quantity) => {
                if (quantity < 1) return;

                const prevItems = get().items;

                // 낙관적 업데이트
                set({
                    items: prevItems.map(item =>
                        item.id === cartItemId ? { ...item, quantity } : item,
                    ),
                });

                try {
                    await updateCart(cartItemId, quantity); // 👈 API 함수명 수정
                } catch (e) {
                    console.error("수량 변경 실패", e);
                    set({ items: prevItems }); // 실패 시 롤백
                }
            },

            // 4. 상품 삭제
            removeItem: async (cartItemId) => {
                const prevItems = get().items;

                set({ items: prevItems.filter(item => item.id !== cartItemId) });

                try {
                    await removeCart(cartItemId); // 👈 API 함수명 수정
                } catch (e) {
                    console.error("상품 삭제 실패", e);
                    set({ items: prevItems }); // 실패 시 롤백
                }
            },

            // 5. 총 수량 계산
            getTotalCount: () => {
                const items = get().items || [];
                return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
            },

            // 6. 총 가격 계산
            getTotalPrice: () => {
                const items = get().items || [];
                return items.reduce((acc, item) => {
                    const price = item.product?.price || 0;
                    const qty = item.quantity || 0;
                    return acc + (price * qty);
                }, 0);
            },
        }),
        {
            name: "cart-storage", // 로컬 스토리지 키
        },
    ),
);

export default useCartStore;