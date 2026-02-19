import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInquiryDetail, deleteInquiry } from "../../api/inquiry.api";
import type { InquiryDetailResponse } from "../../types/inquiry";
import { MdDelete, MdEdit } from "react-icons/md";

export default function InquiryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inquiry, setInquiry] = useState<InquiryDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(Number(id));
    }, [id]);

    const loadData = async (inquiryId: number) => {
        try {
            const data = await fetchInquiryDetail(inquiryId);
            setInquiry(data);
        } catch (error) {
            console.log("로드 실패",error);
            navigate("/inquiry");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInquiry = async () => {
        if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
        try {
            if (inquiry) {
                await deleteInquiry(inquiry.id);
                alert("삭제되었습니다.");
                navigate("/inquiry");
            }
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다.");
        }
    };

    const formatDate = (str: string) => {
        const d = new Date(str);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    };

    const formatDateTime = (str: string) => {
        const d = new Date(str);
        const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
        const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return `${date} ${time}`;
    };

    if (loading) {
        return (
            <div className="max-w-[1100px] mx-auto px-8 py-20">
                <div className="flex justify-center items-center py-40">
                    <div className="w-6 h-6 border-t-2 border-black rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!inquiry) return null;

    const statusText = inquiry.status === "ANSWERED" ? "답변완료" : "답변대기";

    return (
        <div className="max-w-[1100px] mx-auto px-8 py-20 text-black tracking-tight">
            <div className="flex items-center justify-between mb-6 border-b-[1.5px] border-black pb-3">
                <h1 className="text-2xl font-[500]">문의 내용</h1>
                <button
                    onClick={() => navigate("/inquiry")}
                    className="text-xs font-black border border-black px-10 py-3.5 cursor-pointer"
                >
                    목록으로
                </button>
            </div>

            {/* 문의 본문 영역 */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[11px] font-black px-3 py-1 ${
                            inquiry.status === "ANSWERED"
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                            {statusText}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500">
                            {formatDate(inquiry.createdAt)}
                        </span>
                    </div>
                    <h2 className="text-xl font-medium">{inquiry.title}</h2>
                </div>
                <div className="min-h-[150px] text-[14px] leading-relaxed whitespace-pre-wrap">
                    {inquiry.content}
                </div>

                {/* 버튼 영역: 답변 대기 중일 때만 수정/삭제 가능 */}
                {inquiry.status === "PENDING" && (
                    <div className="flex justify-end gap-2 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate(`/inquiry/edit/${inquiry.id}`)}
                            className="flex items-center gap-1 px-6 py-2.5 text-[11px] font-black border border-black hover:bg-gray-50"
                        >
                            <MdEdit /> 수정
                        </button>
                        <button
                            onClick={handleDeleteInquiry}
                            className="flex items-center gap-1 px-6 py-2.5 text-[11px] font-black bg-black text-white hover:bg-gray-800"
                        >
                            <MdDelete /> 삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 답변 영역 */}
            {inquiry.status === "ANSWERED" && inquiry.answer ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[13px] font-black flex items-center gap-2">
                            ADMIN 답변
                            {inquiry.answeredAt && (
                                <span className="text-[11px] text-gray-500 font-medium">
                                    {formatDateTime(inquiry.answeredAt)}
                                </span>
                            )}
                        </h3>
                    </div>
                    <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{inquiry.answer}</div>
                </div>
            ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-[13px] font-bold text-gray-300 tracking-widest">
                        아직 답변이 등록되지 않았습니다
                    </p>
                </div>
            )}
        </div>
    );
}