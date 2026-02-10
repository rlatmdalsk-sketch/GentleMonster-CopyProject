import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createInquiry } from "../../api/inquiry.api";
import type { InquiryType, CreateInquiryRequest } from "../../types/inquiry";

const InquiryWrite = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateInquiryRequest>({
        type: "PRODUCT",
        title: "",
        content: "",
        imageUrls: [],
    });
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        title: "",
        content: "",
    });

    const inquiryTypes: { value: InquiryType; label: string }[] = [
        { value: "PRODUCT", label: "상품" },
        { value: "DELIVERY", label: "배송" },
        { value: "EXCHANGE_RETURN", label: "교환/반품" },
        { value: "MEMBER", label: "회원" },
        { value: "OTHER", label: "기타" },
    ];

    // 컴포넌트 언마운트 시 URL 정리
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    // 입력 필드 변경 핸들러
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // 에러 초기화
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // 이미지 선택 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const newImages = [...images, ...fileArray].slice(0, 5); // 최대 5개
        setImages(newImages);

        // 미리보기 URL 생성
        const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));

        // 기존 URL 정리
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls(newPreviewUrls);
    };

    // 이미지 삭제 핸들러
    const handleImageRemove = (index: number) => {
        // 삭제할 URL 정리
        URL.revokeObjectURL(previewUrls[index]);

        const newImages = images.filter((_, i) => i !== index);
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewUrls(newPreviewUrls);
    };

    // 이미지 업로드 함수 (실제 구현 필요)
    const uploadImages = async (files: File[]): Promise<string[]> => {
        // TODO: 실제 이미지 업로드 API 호출
        console.log("Uploading images:", files);
        return [];
    };

    // 폼 검증
    const validateForm = (): boolean => {
        const newErrors = {
            title: "",
            content: "",
        };

        if (!formData.title.trim()) {
            newErrors.title = "제목을 입력해주세요.";
        }

        if (!formData.content.trim()) {
            newErrors.content = "문의 내용을 입력해주세요.";
        } else if (formData.content.trim().length < 10) {
            newErrors.content = "내용은 10자 이상 입력해주세요.";
        }

        setErrors(newErrors);
        return !newErrors.title && !newErrors.content;
    };

    // 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // 이미지 업로드
            let uploadedImageUrls: string[] = [];
            if (images.length > 0) {
                uploadedImageUrls = await uploadImages(images);
            }

            // 문의 등록
            await createInquiry({
                ...formData,
                imageUrls: uploadedImageUrls,
            });

            alert("문의가 등록되었습니다.");

            // 미리보기 URL 정리
            previewUrls.forEach(url => URL.revokeObjectURL(url));

            navigate("/inquiry"); // 문의 목록 페이지로 이동
        } catch (error: any) {
            console.error("문의 등록 실패:", error);

            // 서버 에러 메시지 처리
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                const newErrors = { title: "", content: "" };

                serverErrors.forEach((err: any) => {
                    if (err.field === "title") {
                        newErrors.title = err.message;
                    } else if (err.field === "content") {
                        newErrors.content = err.message;
                    }
                });

                setErrors(newErrors);
            } else {
                const errorMessage = error.response?.data?.message || "문의 등록에 실패했습니다. 다시 시도해주세요.";
                alert(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">문의하기</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 문의 유형 선택 */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                        문의 유형 <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {inquiryTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 제목 입력 */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="제목을 입력해주세요"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                </div>

                {/* 내용 입력 */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        문의 내용 <span className="text-red-500">*</span>
                        <span className="text-gray-500 text-xs ml-2">
                            (최소 10자 이상)
                        </span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={10}
                        placeholder="문의 내용을 상세히 입력해주세요 (최소 10자 이상)"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                            errors.content ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.content ? (
                            <p className="text-sm text-red-500">{errors.content}</p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                {formData.content.length}자
                            </p>
                        )}
                    </div>
                </div>

                {/* 이미지 업로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        이미지 첨부 (최대 5개)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={images.length >= 5}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`inline-block px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        이미지 선택 ({images.length}/5)
                    </label>

                    {/* 이미지 미리보기 */}
                    {previewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-5 gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative aspect-square">
                                    <img
                                        src={url}
                                        alt={`미리보기 ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleImageRemove(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 버튼 영역 */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/inquiry")}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? "등록 중..." : "문의 등록"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InquiryWrite;