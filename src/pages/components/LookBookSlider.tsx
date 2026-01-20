import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {FreeMode} from "swiper/modules";

const LookSLIDES = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    src: `/images/Home/Slide1/LOOK_BOOK_FIRST (${i + 1}).jpg`,
    title: `알마 01(V)`, // 예시 타이틀
    price: `₩279,000`,
    buyLink: "/category/view-all",
}));

function LookBookSlider() {
    return (
        <section className="w-full">
            <Swiper
                modules={[FreeMode]}
                slidesPerView={2.5}
                spaceBetween={0}
                loop={false}
                grabCursor={true}

                // 🌟 속도와 관성의 밸런스 조정
                freeMode={{
                    enabled: true,
                    sticky: false,
                    momentum: true,
                    // 1. 관성 비율은 유지하되
                    momentumRatio: 1,
                    // 2. 가속도(Velocity)에 제동을 겁니다. (숫자를 낮추면 묵직해짐)
                    momentumVelocityRatio: 0.2,
                    momentumBounce: false,
                }}

                // 3. 사용자가 당기는 힘의 민감도를 살짝 낮춤
                touchRatio={1.0}
                // 4. 슬라이드가 움직일 때의 기본 전환 애니메이션 속도를 늦춤 (느릴수록 우아함)
                speed={1500}

                className="w-full h-[960px]"
            >
                {LookSLIDES.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative">
                        <div className="w-full h-full flex flex-col justify-between">
                            {/* 이미지 영역 */}
                            <div className="w-[960px] h-[85%] overflow-hidden">
                                <img
                                    src={slide.src}
                                    alt={slide.title}
                                    className="w-full h-full object-cover px-5"
                                />
                            </div>

                            {/* 텍스트 정보 영역 (캡처본 하단 스타일) */}
                            <div className="p-6 text-[11px] leading-relaxed">
                                <p className="font-bold">{slide.title}</p>
                                <p>{slide.price}</p>
                                <button className="mt-2 underline underline-offset-4 opacity-60 hover:opacity-100">
                                    위시리스트에 추가하기
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

export default LookBookSlider;