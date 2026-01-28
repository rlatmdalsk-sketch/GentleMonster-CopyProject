import { useState, useRef } from "react";
import AdminSlideBar from "./AdminSlideBar";
import { createProduct } from "../../api/product.api";
import { useNavigate } from "react-router-dom";

// 1. 보내주신 MENU 데이터를 관리자용 구조로 변환
const CATEGORY_DATA = [
    {
        name: "선글라스",
        subMenu: [
            { name: "2026 컬렉션", path: "2026-collection" },
            { name: "FALL 컬렉션", path: "2025-fall-collection" },
            { name: "볼드 컬렉션", path: "2025-bold-collection" },
            { name: "포켓 컬렉션", path: "pocket-collection" },
            { name: "베스트 셀러", path: "bestsellers" },
            { name: "틴트 렌즈", path: "tinted-lenses" },
        ],
    },
    {
        name: "안경",
        subMenu: [
            { name: "2026 컬렉션", path: "2026-collection" },
            { name: "FALL 컬렉션", path: "2025-fall-collection" },
            { name: "볼드 컬렉션", path: "2025-bold-collection" },
            { name: "포켓 컬렉션", path: "pocket-collection" },
            { name: "베스트 셀러", path: "bestsellers" },
            { name: "블루라이트", path: "blue-light-lenses" },
            { name: "틴트 렌즈", path: "tinted-lenses" },
        ],
    },
    {
        name: "컬렉션",
        subMenu: [
            { name: "2026 컬렉션", path: "2026-collection" },
            { name: "2025 FALL", path: "2025-fall-collection" },
            { name: "2025 볼드", path: "2025-bold-collection" },
            { name: "포켓", path: "pocket-collection" },
            { name: "메종 마르지엘라", path: "maison-margiela" },
            { name: "2025 컬렉션", path: "2025-collection" },
            { name: "철권8", path: "tekken8" },
            { name: "뮈글러", path: "mugler" },
            { name: "젠틀 살롱", path: "jentle-salon" },
        ],
    },
];

export default function ProductEdit() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 대분류 선택 상태 (선글라스 / 안경 / 컬렉션)
    const [mainCategoryIndex, setMainCategoryIndex] = useState(0);

    const [productInfo, setProductInfo] = useState({
        name: "",
        price: "",
        material: "Acetate",
        summary: "",
        collection: "", // 소분류 이름 저장용
        subCategoryPath: "", // 사용자 페이지 연동을 위한 path
        lens: "Black Lenses",
        originCountry: "South Korea",
        shape: "Square",
        sizeInfo: "",
        categoryId: "" // 실제 DB 카테고리 ID (기획에 따라 사용)
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // 소분류(SubCategory)가 바뀔 때 path도 함께 업데이트
        if (name === "collection") {
            const selectedSub = CATEGORY_DATA[mainCategoryIndex].subMenu.find(s => s.name === value);
            setProductInfo(prev => ({
                ...prev,
                collection: value,
                subCategoryPath: selectedSub?.path || ""
            }));
        } else {
            setProductInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!imageFile) {
            alert("상품 이미지를 업로드해주세요.");
            return;
        }
        if (!productInfo.collection) {
            alert("컬렉션(소분류)을 선택해주세요.");
            return;
        }

        const formData = new FormData();

        // 1. 텍스트 데이터 추가
        Object.entries(productInfo).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // 2. 이미지 파일 추가
        formData.append("images", imageFile);

        try {
            // 3. 실제 API 호출
            const response = await createProduct(formData);

            // 4. 성공 콘솔 출력
            console.log("✅ 상품 등록 성공:", response);
            alert(`${productInfo.name} 상품이 ${productInfo.collection}에 등록되었습니다.`);

            // 5. 페이지 새로고침 (데이터 초기화 및 최신화)
            window.location.reload();

            // 만약 새로고침 대신 목록으로 가고 싶다면 아래 주석 해제
            // navigate("/admin/products");

        } catch (error: any) {
            // 서버가 보내준 구체적인 에러 메세지를 콘솔에 찍습니다.
            console.error("❌ 상세 에러 정보:", error.response?.data || error.message);
            alert(`등록 실패: ${error.response?.data?.message || "서버 응답 없음"}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2] flex text-black">
            <AdminSlideBar />
            <main className="flex-1 p-12 space-y-10">
                <h1 className="text-xl font-bold uppercase tracking-widest border-b border-black pb-4">New Product / Collection</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* 이미지 섹션 */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] bg-white border border-black/5 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                        {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <span className="text-xs tracking-[0.3em] opacity-40">UPLOAD IMAGE</span>}
                        <input type="file" ref={fileInputRef} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if(file) { setImageFile(file); setPreviewImage(URL.createObjectURL(file)); }
                        }} className="hidden" />
                    </div>

                    {/* 입력 폼 섹션 */}
                    <div className="bg-white p-8 space-y-6 border border-black/5">
                        <div className="grid grid-cols-2 gap-4">
                            {/* 대분류 선택 */}
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold opacity-40 uppercase mb-2">Main Category</label>
                                <select
                                    className="border-b border-black/10 py-2 outline-none text-sm uppercase"
                                    onChange={(e) => {
                                        setMainCategoryIndex(Number(e.target.value));
                                        setProductInfo(prev => ({ ...prev, collection: "", subCategoryPath: "" }));
                                    }}
                                >
                                    {CATEGORY_DATA.map((cat, idx) => (
                                        <option key={cat.name} value={idx}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 소분류(컬렉션) 선택 */}
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold opacity-40 uppercase mb-2">Sub Collection</label>
                                <select
                                    name="collection"
                                    value={productInfo.collection}
                                    onChange={handleChange}
                                    className="border-b border-black/10 py-2 outline-none text-sm uppercase"
                                    required
                                >
                                    <option value="">Select sub-menu</option>
                                    {CATEGORY_DATA[mainCategoryIndex].subMenu.map(sub => (
                                        <option key={sub.path} value={sub.name}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 나머지 입력 필드 (상품명, 가격 등) */}
                        <div className="space-y-4 pt-4">
                            <input name="name" placeholder="PRODUCT NAME" onChange={handleChange} className="w-full border-b border-black/10 py-3 outline-none text-sm uppercase" required />
                            <input name="price" type="number" placeholder="PRICE (KRW)" onChange={handleChange} className="w-full border-b border-black/10 py-3 outline-none text-sm uppercase" required />
                            <input name="summary" placeholder="SUMMARY (SHORT DESC)" onChange={handleChange} className="w-full border-b border-black/10 py-3 outline-none text-sm" />
                            <input name="sizeInfo" placeholder="SIZE INFO (e.g. 145mm...)" onChange={handleChange} className="w-full border-b border-black/10 py-3 outline-none text-sm" />
                        </div>

                        <button className="w-full bg-black text-white py-5 text-[10px] font-bold tracking-[0.5em] hover:bg-zinc-800 transition-colors mt-8">
                            REGISTER PRODUCT
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}