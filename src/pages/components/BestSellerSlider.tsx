import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/product.api.ts";
import { getCategories } from "../../api/category.api.ts"; // 🌟 전체 카테고리 가져오기로 변경
import type { Product } from "../../types/product.ts";

function BestSellerSlider() {
    const [bestProducts, setBestProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.group("🚀 베스트셀러 로드 디버깅");

                // 1. 전체 카테고리를 가져와서 '베스트셀러'라는 이름을 가진 카테고리 찾기
                const categories = await getCategories();
                console.log("1. 전체 카테고리 데이터:", categories);

                // 재귀적으로 자식까지 뒤져서 '베스트 셀러' 또는 '베스트셀러' 찾기
                const findBestCategory = (list: any[]): any => {
                    for (const cat of list) {
                        if (cat.name.replace(/\s/g, "") === "베스트셀러") return cat;
                        if (cat.children) {
                            const found = findBestCategory(cat.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const bestCategory = findBestCategory(Array.isArray(categories) ? categories : (categories as any).data);
                console.log("2. 찾은 베스트셀러 카테고리 객체:", bestCategory);

                if (bestCategory) {
                    const targetCategoryId = bestCategory.id;

                    // 2. 전체 상품 가져오기
                    const productsResponse = await fetchProducts({ page: 1, limit: 100 });
                    const allProducts = Array.isArray(productsResponse)
                        ? productsResponse
                        : (productsResponse.data || []);

                    console.log("3. 전체 상품 수:", allProducts.length);

                    // 3. 필터링 (ID 매칭)
                    const filtered = allProducts.filter((p: Product) =>
                        String(p.categoryId) === String(targetCategoryId)
                    );

                    console.log("4. 필터링된 결과:", filtered.length);
                    setBestProducts(filtered);
                } else {
                    console.error("❌ '베스트셀러'라는 이름의 카테고리를 찾을 수 없습니다.");
                }

                console.groupEnd();
            } catch (error) {
                console.error("❌ 에러 발생:", error);
                console.groupEnd();
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center py-20 text-[10px]">LOADING...</div>;

    return (
        <div className="w-full">
            <section className="w-full">
                {bestProducts.length > 0 ? (
                    <Swiper
                        modules={[FreeMode]}
                        // 공식 홈페이지 비율에 맞춰 슬라이드 개수 조절 (4.2~4.5 추천)
                        slidesPerView={4.2}
                        // 이미지 사이의 간격을 촘촘하게 조절
                        spaceBetween={10}
                        loop={true}
                        grabCursor={true}
                        freeMode={{ enabled: true, sticky: true, momentum: false }}
                        speed={800}
                        // 전체 슬라이더의 높이를 이미지 비율에 맞게 최적화
                        className="w-full h-[550px]"
                    >
                        {bestProducts.map((item) => (
                            <SwiperSlide key={item.id}>
                                <Link to={`/product/${item.id}`} className="block w-full h-full">
                                    {/* ml-[50px] 제거: Swiper 자체 간격(spaceBetween)으로 조절하는 것이 정석입니다 */}
                                    <div className="w-full h-full flex flex-col pt-10">
                                        {/* 이미지 영역: h-[75%] 정도로 고정하여 하단 텍스트 공간 확보 */}
                                        <div className="w-full h-[75%] overflow-hidden relative">
                                            <img
                                                src={item.images?.[0]?.url || item.image}
                                                alt={item.name}
                                                // translateY 수치를 조절하여 안경이 중앙에 오도록 맞춤
                                                className="w-full h-full object-contain scale-200"
                                            />
                                        </div>

                                        {/* 텍스트 정보: 이미지 바로 밑으로 붙임 */}
                                        <div className="mt-4 px-4 ml-[50px] text-[11px] leading-tight text-black text-left flex justify-between items-start">
                                            <div>
                                                <p className="font-bold mb-1 uppercase tracking-tighter">{item.name}</p>
                                                <p className="text-gray-600">₩{item.price?.toLocaleString()}</p>
                                            </div>
                                            {/* 북마크 아이콘 자리가 필요하다면 여기에 추가 (공홈 스타일) */}
                                            <div className="pt-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="py-20 text-center text-[10px] text-gray-400">
                        베스트셀러 상품이 없습니다.
                    </div>
                )}
            </section>
        </div>
    );
}

export default BestSellerSlider;