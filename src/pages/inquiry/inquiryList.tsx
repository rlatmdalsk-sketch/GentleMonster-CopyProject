import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInquiryList } from "../../api/inquiry.api";
import type { InquiryItem, InquiryType, InquiryStatus } from "../../types/inquiry";

const InquiryList = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const limit = 20;

    // 문의 유형 라벨
    const getTypeLabel = (type: InquiryType): string => {
        const labels: Record<InquiryType, string> = {
            PRODUCT: "상품",
            DELIVERY: "배송",
            EXCHANGE_RETURN: "교환/반품",
            MEMBER: "회원",
            OTHER: "기타",
        };
        return labels[type];
    };

    // 상태 라벨
    const getStatusLabel = (status: InquiryStatus): string => {
        return status === "ANSWERED" ? "답변완료" : "답변대기";
    };

    // 날짜 포맷
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };

    // 문의 내역 로드
    const loadInquiries = async (page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchInquiryList(Number(page), Number(limit));
            setInquiries(response.data);
            setTotalPages(response.pagination.totalPages);
            setTotal(response.pagination.total);
            setCurrentPage(response.pagination.currentPage);
        } catch (error: any) {
            console.error("문의 내역 로드 실패", error);

            // 상세 에러 로깅
            if (error.response?.data) {
                console.error("서버 에러 상세:", error.response.data);
            }

            // 에러 메시지 설정
            if (error.response?.status === 401) {
                setError("로그인이 필요한 서비스입니다.");
            } else if (error.response?.status === 500) {
                setError("서버 오류가 발생했습니다. 백엔드 개발자에게 문의해주세요.");
            } else {
                setError("문의 내역을 불러오는데 실패했습니다.");
            }

            setInquiries([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 로드
    useEffect(() => {
        loadInquiries(1);
    }, []);

    // 페이지 변경
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        loadInquiries(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 문의 상세로 이동
    const handleInquiryClick = (id: number) => {
        navigate(`/inquiry/${id}`);
    };

    // 문의 작성 페이지로 이동
    const handleWriteClick = () => {
        navigate("/inquiry/write");
    };

    // 재시도
    const handleRetry = () => {
        loadInquiries(currentPage);
    };

    // 페이지네이션 범위 계산
    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">문의 내역</h1>
                    {!error && (
                        <p className="text-sm text-gray-600 mt-1">
                            총 {total}건의 문의가 있습니다.
                        </p>
                    )}
                </div>
                <button
                    onClick={handleWriteClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    문의하기
                </button>
            </div>

            {/* 로딩 */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                // 에러 상태
                <div className="text-center py-20">
                    <div className="text-red-500 mb-4">
                        <svg
                            className="mx-auto h-12 w-12 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-lg font-medium mb-2">{error}</p>
                        <p className="text-sm text-gray-600">
                            백엔드 서버에서 limit 파라미터를 숫자로 변환해야 합니다.
                        </p>
                    </div>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            ) : inquiries.length === 0 ? (
                // 빈 상태
                <div className="text-center py-20">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <p className="text-gray-500 mb-4">등록된 문의가 없습니다.</p>
                    <button
                        onClick={handleWriteClick}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        첫 문의 작성하기
                    </button>
                </div>
            ) : (
                <>
                    {/* 문의 목록 테이블 */}
                    <div className="bg-white border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    번호
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    유형
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    제목
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    작성일
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상태
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {inquiries.map((inquiry, index) => (
                                <tr
                                    key={inquiry.id}
                                    onClick={() => handleInquiryClick(inquiry.id)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {total - (currentPage - 1) * limit - index}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {getTypeLabel(inquiry.type)}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            {inquiry.title}
                                            {inquiry.images.length > 0 && (
                                                <span className="text-gray-400">
                                                        📎 {inquiry.images.length}
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(inquiry.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    inquiry.status === "ANSWERED"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {getStatusLabel(inquiry.status)}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ««
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ‹
                            </button>
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                        page === currentPage
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ›
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                »»
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InquiryList;