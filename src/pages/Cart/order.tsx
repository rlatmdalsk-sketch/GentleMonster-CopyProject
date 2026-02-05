import { useState } from "react";
import { twMerge } from "tailwind-merge";
import useAuthStore from "../../stores/useAuthStore.ts";
import useCartStore from "../../stores/useCartStore.ts";
import { IoSearchOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import {Link} from "react-router-dom";

function Order() {
    const { user } = useAuthStore();
    const { items, getTotalPrice } = useCartStore();

    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [openInfo, setOpenInfo] = useState<string | null>(null);

    const toggleInfo = (id: string) => {
        setOpenInfo(openInfo === id ? null : id);
    };

    return (
        <>
            <h2 className={twMerge("text-center", "py-7", "text-[17px]", "text-[#111]")}>결제</h2>

            <div className={twMerge("flex", "justify-end", "mt-30")}>
                <main className={twMerge("flex", "w-[1300px]", "justify-between")}>

                    {/* 좌측 영역 (기존 유지) */}
                    <div className={twMerge("w-[650px]", "flex", "flex-col", "gap-3", "text-[12px]")}>
                        <div className={twMerge("flex")}>
                            <p className="font-[450]">1 이메일주소</p>
                        </div>
                        <div className={twMerge("pt-4")}>
                            <p className="text-gray-600">{user?.email} 계정으로 로그인하셨습니다.</p>
                        </div>
                        <div className={twMerge("border-b", "mt-3", "border-gray-200")} />

                        <form className={twMerge("flex", "flex-col", "gap-3", "mt-4")}>
                            <div className="flex justify-between items-center">
                                <p className="font-[450]">2 배송</p>
                                <p className="text-[10px] text-gray-400">*필수 입력 항목</p>
                            </div>
                            <div className="bg-[#fff] rounded-[8px] border border-gray-200 p-2 shadow-sm flex flex-col">
                                <span className="text-[10px] text-gray-400 mb-1">이름*</span>
                                <input defaultValue={user?.name} className="outline-none text-[13px] font-[450]" />
                            </div>
                            <div className="bg-[#fff] rounded-[8px] flex items-center border border-gray-200 p-3.5 shadow-sm cursor-pointer">
                                <IoSearchOutline className="mr-2 text-gray-400" />
                                <span className="text-[13px] text-gray-400">주소 찾기*</span>
                            </div>
                            <div className="bg-[#fff] rounded-[8px] flex flex-col border border-gray-200 p-2 shadow-sm">
                                <span className="text-[10px] text-gray-400 mb-1">전화번호*</span>
                                <input defaultValue={user?.phone} className="outline-none text-[13px]" />
                            </div>
                            <button className="mt-4 bg-[#858585] text-white text-[13px] h-[48px] rounded-[8px] font-bold">
                                결제하기
                            </button>
                        </form>
                    </div>

                    {/* 우측 영역 (트랜지션 추가) */}
                    <div className={twMerge("w-[420px]", "self-start", "mr-15")}>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[13px]">주문 요약</h3>
                                <button
                                    onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                                    className="text-[11px] flex items-center gap-1 cursor-pointer"
                                >
                                    더 보기 {isSummaryOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                                </button>
                            </div>

                            {/* 🌟 주문 요약 아코디언 트랜지션 */}
                            <div className={twMerge(
                                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                                isSummaryOpen ? "grid-rows-[1fr] mb-6 border-b border-gray-100 pb-6" : "grid-rows-[0fr]"
                            )}>
                                <div className="overflow-hidden">
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 w-full">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="h-20 bg-[#f7f7f7] rounded-[4px] flex-shrink-0 overflow-hidden w-[200px]">
                                                    <img src={item.product.images[0]?.url} alt="" className="w-full h-full object-contain scale-400 translate-y-[-15px]" />
                                                </div>
                                                <div className="flex-1 text-[11px]">
                                                    <p className="font-bold text-[#111]">{item.product.name}</p>
                                                    <p className="text-gray-400">수량: {item.quantity}</p>
                                                    <p className="mt-1 font-medium">₩{item.product.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to={"/shoppingBag"}>
                                        <button className={twMerge("border","py-3","rounded-md","border-[#d8d8d8]","mt-13","text-[13px]","w-full","cursor-pointer")}>쇼핑백 편집하기</button>
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3 text-[12px] border-b border-gray-100 pb-6 mb-6 font-bold">
                                <div className="flex justify-between">
                                    <span>소계</span>
                                    <span>₩{getTotalPrice().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>배송</span>
                                    <span>무료</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[13px] font-bold">총계</span>
                                <div className="text-right">
                                    <p className="text-[18px] font-bold">₩{getTotalPrice().toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 leading-tight">세금 포함</p>
                                </div>
                            </div>

                            {/* 🌟 하단 정보 아코디언 트랜지션 */}
                            <div className="mt-4 space-y-2 text-[12px]">
                                <div className="border-b border-gray-200">
                                    <button onClick={() => toggleInfo('shipping')} className="w-full flex justify-between items-center py-4 cursor-pointer">
                                        <span>무료 배송 & 반품</span>
                                        <span className="text-lg">{openInfo === 'shipping' ? '-' : '+'}</span>
                                    </button>
                                    <div className={twMerge(
                                        "grid transition-[grid-template-rows] duration-300 ease-in-out",
                                        openInfo === 'shipping' ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                    )}>
                                        <div className="overflow-hidden">
                                            <div className="pb-4 font-bold leading-relaxed text-[11px]">
                                                모든 주문에 대해 무료 배송 서비스가 제공되며, 수령 후 7일 이내에 무료 반품이 가능합니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200">
                                    <button onClick={() => toggleInfo('payment')} className="w-full flex justify-between items-center py-4 cursor-pointer">
                                        <span>무이자 할부 및 다양한 결제 옵션</span>
                                        <span className="text-lg">{openInfo === 'payment' ? '-' : '+'}</span>
                                    </button>
                                    <div className={twMerge(
                                        "grid transition-[grid-template-rows] duration-300 ease-in-out",
                                        openInfo === 'payment' ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                    )}>
                                        <div className="overflow-hidden">
                                            <div className="pb-4 font-bold leading-relaxed text-[11px]">
                                                신용카드 무이자 할부 혜택 및 네이버페이, 카카오페이 등 다양한 결제 수단을 이용하실 수 있습니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Order;