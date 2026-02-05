import { twMerge } from "tailwind-merge";

// 임시 데이터 (나중에 API 연결)
const ORDERS = [
    {
        id: "20240205-0000123",
        date: "2024.02.05",
        status: "배송 준비중",
        productName: "오리가미 01",
        price: 289000,
        image: "https://image.gentlemonster.com/main/product/origami_01.jpg", // 임시 경로
    },
    {
        id: "20240120-0000456",
        date: "2024.01.20",
        status: "배송 완료",
        productName: "볼드 02",
        price: 320000,
        image: "https://image.gentlemonster.com/main/product/bold_02.jpg",
    }
];

function OrderList() {
    return (
        <div className="py-10">
            {/* 섹션 타이틀 */}
            <div className="mb-10 border-b border-gray-300 pb-4">
                <h2 className="text-[14px] font-bold tracking-tight text-[#111]">주문 내역</h2>
            </div>

            <div className="space-y-6">
                {ORDERS.length > 0 ? (
                    ORDERS.map((order) => (
                        <div
                            key={order.id}
                            className="bg-[#ebebeb] p-6 rounded-[4px] flex flex-col md:flex-row gap-8 items-center border border-transparent hover:border-gray-400 transition-all"
                        >
                            {/* 상품 이미지 영역 (흰색 배경 지양 - 투명하게 처리) */}
                            <div className="w-[120px] h-[120px] bg-transparent flex items-center justify-center overflow-hidden">
                                <img
                                    src={order.image}
                                    alt={order.productName}
                                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                                />
                            </div>

                            {/* 주문 정보 영역 */}
                            <div className="flex-1 flex flex-col gap-1 w-full">
                                <div className="flex justify-between items-start">
                                    <span className="text-[11px] text-gray-500 font-medium">{order.date} | 주문번호 {order.id}</span>
                                    <span className={twMerge(
                                        "text-[11px] font-bold px-2 py-1 rounded",
                                        order.status === "배송 완료" ? "text-blue-600" : "text-[#111]"
                                    )}>
                    {order.status}
                  </span>
                                </div>

                                <h3 className="text-[16px] font-bold mt-2">{order.productName}</h3>
                                <p className="text-[13px] font-medium text-gray-700">₩{order.price.toLocaleString()}</p>

                                <div className="mt-6 flex gap-3">
                                    <button className="text-[11px] font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                                        주문 상세 보기
                                    </button>
                                    {order.status === "배송 완료" && (
                                        <button className="text-[11px] font-bold bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600">
                                            반품 신청
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* 주문 내역이 없을 때 */
                    <div className="py-40 text-center">
                        <p className="text-[12px] text-gray-400">최근 6개월간 주문하신 내역이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderList;