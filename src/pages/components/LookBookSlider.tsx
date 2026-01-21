import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Controller } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { twMerge } from "tailwind-merge";

const LookSLIDES = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    src: `/images/Home/Slide1/LOOK_BOOK_FIRST (${i + 1}).jpg`,
    title: `알마 01(V)`,
    price: `₩279,000`,
}));

function LookBookSlider() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="w-full">
            {/* 1. 전체 섹션: 하단 아이템 뷰까지 포함하므로 넉넉하게 높이 설정 또는 최소 높이 지정 */}
            <section className="w-full flex flex-col items-center">

                {/* 2. 메인 슬라이더: 이미지 컨테이너인 700px에 맞춤 */}
                <Swiper
                    modules={[FreeMode, Thumbs, Controller]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    slidesPerView={"2.8"}
                    centeredSlides={false}
                    spaceBetween={10}
                    grabCursor={true}
                    freeMode={{
                        enabled: true,
                        sticky: true,
                        momentum: false,
                    }}
                    speed={800}
                    touchRatio={1.2}
                    className="w-full h-[700px]" // 슬라이더 자체 높이를 이미지 박스와 일치시킴
                >
                    {LookSLIDES.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="w-full h-full">
                                {/* 3. 이미지 박스: 정확히 700px 공간 차지 */}
                                <div className="w-[85%] h-[700px] overflow-hidden relative ml-auto">
                                    <img
                                        src={slide.src}
                                        alt={slide.title}
                                        /* 4. 이미지 크기: 700px의 160% 높이 적용 */
                                        className="absolute w-full h-[160%] object-cover"
                                        style={{
                                            top: '0',
                                            transform: 'translateY(-150px) translateX(10px)'
                                        }}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 5. 하단 아이템 뷰 영역 */}
                <div className="flex items-center justify-center mt-5 w-full">
                    <div className="flex items-center gap-4border-black/10 pb-2">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            modules={[FreeMode, Thumbs, Controller]}
                            slidesPerView={"7"}
                            spaceBetween={8}
                            watchSlidesProgress={true}
                            slideToClickedSlide={true}
                            freeMode={true}
                            className="max-w-[500px]"
                        >
                            {LookSLIDES.map((slide) => (
                                <SwiperSlide
                                    key={slide.id}
                                    style={{ width: '60px' }}
                                    className="cursor-pointer  swiper-slide-thumb-active:opacity-100"
                                >
                                    <div className="w-[60px] h-[80px] overflow-hidden">
                                        <img src={slide.src} className="w-full h-[130%] object-cover" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <span className="text-[13px] font-bold whitespace-nowrap ml-2 pt-2">아이템 뷰</span>
                    </div>
                </div>

                <style>{`
                    .swiper-slide-thumb-active {
                        position: relative;
                    }
                    .swiper-slide-thumb-active::after {
                        content: '';
                        position: absolute;
                        bottom: -10px;
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