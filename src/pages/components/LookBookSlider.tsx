import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Controller } from "swiper/modules";
import { Link } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { fetchProducts } from "../../api/product.api.ts";
import { getCategories } from "../../api/category.api.ts";
import type { Product } from "../../types/product.ts";

function LookBookSlider() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const categories = await getCategories();
                const rawData = Array.isArray(categories) ? categories : (categories as any).data;

                const findCategoryByPath = (list: any[]): any => {
                    for (const cat of list) {
                        if (cat.path === "c-2026-collection" || cat.path === "/c-2026-collection") {
                            return cat;
                        }
                        if (cat.children) {
                            const found = findCategoryByPath(cat.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const targetCategory = findCategoryByPath(rawData);

                if (targetCategory) {
                    const productsResponse = await fetchProducts({ page: 1, limit: 100 });
                    const allProducts = Array.isArray(productsResponse)
                        ? productsResponse
                        : (productsResponse.data || []);

                    const filtered = allProducts.filter((p: Product) =>
                        String(p.categoryId) === String(targetCategory.id)
                    );
                    setProducts(filtered);
                }
            } catch (error) {
                console.error("컬렉션 데이터 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center py-20 text-[10px] tracking-widest">LOADING...</div>;

    return (
        <div className="w-full">
            <section className="w-full flex flex-col items-center">

                {/* 1. 메인 슬라이더: 사진 크기 체감 확대 */}
                <Swiper
                    modules={[FreeMode, Thumbs, Controller]}
                    onSwiper={setThumbsSwiper}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}

                    slidesPerView={1}
                    spaceBetween={10}
                    grabCursor={true}
                    speed={800}

                    breakpoints={{
                        768: {
                            slidesPerView: 2.5,
                            spaceBetween: 15,
                        },
                        1024: {
                            slidesPerView: 3.5,
                            spaceBetween: 0,
                        }
                    }}
                    className="w-full h-[500px] md:h-[700px]"
                >
                    {products.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full group">
                                <Link to={`/product/${slide.id}`} className="w-full h-full block overflow-hidden">
                                    <img
                                        src={slide.images?.[0]?.url}
                                        alt={slide.name}
                                        className="w-full h-full object-contain scale-[1.4] md:scale-170"
                                    />
                                </Link>

                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 pointer-events-none">
                                    <div className="flex flex-col gap-0.5 text-black">
                                        <p className="text-[12px] md:text-[13px] font-bold uppercase tracking-tighter">{slide.name}</p>
                                        <p className="text-[11px] md:text-[12px] tracking-tighter">₩{slide.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 2. 하단 아이템 뷰: 박스 내 사진 크기 키우기 */}
                <div className="flex flex-col items-center justify-center mt-8 md:mt-12 mb-10 md:mb-20 w-full">
                    <div className="flex items-center pb-2 w-full justify-center">
                        <Swiper
                            onSwiper={(swiper) => setThumbsSwiper(swiper)}
                            modules={[FreeMode, Thumbs, Controller]}
                            slidesPerView={4}
                            spaceBetween={5}
                            watchSlidesProgress={true}
                            slideToClickedSlide={true}
                            freeMode={true}
                            className="w-[90%] max-w-[400px]"
                        >
                            {products.map((slide) => (
                                <SwiperSlide
                                    key={`thumb-${slide.id}`}
                                    className="cursor-pointer"
                                >
                                    <div className="w-full aspect-square flex items-center justify-center overflow-hidden border border-gray-100 md:border-none">
                                        <img
                                            src={slide.images?.[0]?.url}
                                            className="w-full h-full object-contain scale-110 md:scale-125"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <style>{`
                    .swiper-slide-thumb-active { position: relative; }
                    .swiper-slide-thumb-active::after {
                        content: '';
                        position: absolute;
                        bottom: -5px;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background-color: black;
                    }
                `}</style>
            </section>
        </div>
    );
}

export default LookBookSlider;