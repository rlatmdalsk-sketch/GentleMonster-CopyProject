import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import useCartStore from "../../stores/useCartStore.ts";
import { twMerge } from "tailwind-merge";

const ShoppingBag = () => {
    const { items, fetchCart, getTotalPrice, getTotalCount, updateQuantity, removeItem, loading } = useCartStore();
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const toggleAccordion = (section: string) => {
        setOpenAccordion(prev => (prev === section ? null : section));
    };

    // 🌟 수량 변경 핸들러 (디자인 유지하면서 로직만 추가)
    const handleQuantity = (id: number, current: number, delta: number) => {
        const next = current + delta;
        if (next >= 1) {
            updateQuantity(id, next);
        }
    };

    if (loading) return <div className="pt-60 text-center text-[10px] tracking-widest animate-pulse">LOADING...</div>;

    if (items.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center ">
                <div className="flex gap-10 mb-20 absolute top-10">
                    <span className="text-[13px] font-bold border-b border-black pb-1">쇼핑백</span>
                </div>
                <p className="text-[12px] mb-8 font-medium">쇼핑백에 추가된 제품이 없습니다.</p>
                <Link
                    to="/"
                    className="px-20 py-4 border border-gray-300 text-[12px] bg-white hover:bg-gray-50 transition-colors rounded-[5px]"
                >
                    쇼핑 계속하기
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pt-10 pb-20">
            {/* 헤더 섹션 */}
            <div className="flex justify-center items-center relative mb-16">
                <div className="flex gap-6">
                    <button className="text-[17px] font-[450] bg-[#e2e4e5] h-[30px] px-[12px] rounded-lg">
                        쇼핑백<sup>{getTotalCount()}</sup>
                    </button>
                </div>
                <button onClick={() => navigate(-1)} className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl mr-9">
                    <IoCloseOutline />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row mx-auto items-start px-10">
                {/* 좌측: 상품 리스트 영역 */}
                <div className="flex-1 space-y-12 flex flex-col justify-center items-center overflow-hidden ml-100">
                    {items.map((item) => (
                        <div key={item.id} className="flex md:flex-row items-center gap-10 pb-12 m-auto overflow-hidden px-50 pt-40">
                            <div className="w-[280px] h-[280px]  flex items-center justify-center bg-transparent">
                                <img
                                    src={item.product.images?.[0]?.url}
                                    alt={item.product.name}
                                    className={twMerge("scale-280","mb-30")}
                                />
                            </div>

                            <div className="flex-1 flex flex-col  w-full z-20 pl-5 pb-15">
                                <h3 className="text-[11px] font-[450] text-[#111]">{item.product.name}</h3>
                                <p className="text-[11px] text-[#111] font-medium">₩{item.product.price.toLocaleString()}</p>

                                <div className="mt-2  text-[11px]  ">
                                    <div className="flex items-center gap-2 justify-center text-center">
                                        <span>수량</span>
                                        <select
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                            className=" flex  border-none outline-none  font-[450] -4 px-4 text-[12px] py-1 mx-auto  text-center"
                                        >
                                            {/* 1부터 10까지 옵션 생성 */}
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                                <button
                                    onClick={() => {
                                        if (window.confirm("상품을 삭제하시겠습니까?")) removeItem(item.id);
                                    }}
                                    className="text-111 text-[10px] mt-2 p-2 bg-[#e2e4e5] rounded-md mr-auto font-semibold"
                                >
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 우측: 결제 요약 섹션 */}
                <aside className="w-full md:w-[30%] lg:w-[420px] px-8 md:px-12 py-20 md:sticky md:top-20 md:self-start">
                    <div className="w-full flex flex-col">
                        <div className="text-[12px] border-b border-gray-200 pb-10">
                            <div className="flex justify-between text-[#111] font-[450]">
                                <span>소계</span>
                                <span>₩{getTotalPrice().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[#111] font-[450]">
                                <span>배송</span>
                                <span>무료</span>
                            </div>
                            <div className="flex justify-between font-[450] text-[12px] pt-4 text-[#111]">
                                <span>총계</span>
                                <div className="text-right">
                                    <p className={twMerge("text-[18px]")}>₩{getTotalPrice().toLocaleString()}</p>
                                    <p className="text-[10px] font-normal text-gray-400">세금 포함</p>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 space-y-3">
                            <button className="w-full bg-black text-white py-4 text-[12px] font-bold rounded-[11px] tracking-tight hover:bg-[#333] transition-colors">
                                결제하기 - ₩{getTotalPrice().toLocaleString()}
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="block w-full border border-gray-300 bg-white py-4 text-[12px] font-bold rounded-[11px] text-center hover:bg-gray-50 transition-colors"
                            >
                                쇼핑 계속하기
                            </button>
                        </div>

                        <div className="space-y-0 border-t border-gray-200">
                            {/* 아코디언 생략 (기존 코드와 동일) */}
                            <div className="border-b border-gray-200">
                                <button onClick={() => toggleAccordion("shipping")} className="w-full flex justify-between font-[550] items-center py-5 text-[13px] ">
                                    <span>무료 배송 & 반품</span>
                                    <span className={`text-xl transition-transform duration-300 ${openAccordion === "shipping" ? "rotate-45" : ""}`}>+</span>
                                </button>
                                <div className={`overflow-hidden transition-all ease-out ${openAccordion === "shipping" ? "max-h-40 opacity-100 duration-500" : "max-h-0 opacity-0 duration-300"}`}>
                                    <div className="pb-6 text-[12px] font-[550] leading-relaxed"><p>젠틀몬스터 공식 온라인 스토어는 무료 배송 및 반품 서비스를 제공합니다.</p></div>
                                </div>
                            </div>
                            <div className="border-b border-gray-200">
                                <button onClick={() => toggleAccordion("payment")} className="w-full flex justify-between items-center py-5 text-[13px] font-[550] ">
                                    <span>무이자 할부 및 다양한 결제 옵션</span>
                                    <span className={`text-xl transition-transform duration-300 ${openAccordion === "payment" ? "rotate-45" : ""}`}>+</span>
                                </button>
                                <div className={`overflow-hidden transition-all ease-out ${openAccordion === "payment" ? "max-h-40 opacity-100 duration-500" : "max-h-0 opacity-0 duration-300"}`}>
                                    <div className="pb-6 text-[12px] font-[550] leading-relaxed"><p>다양한 신용카드 무이자 할부 혜택 및 결제가 가능합니다.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ShoppingBag;