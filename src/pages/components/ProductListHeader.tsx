import { Link, useParams, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/category.api.ts";

const ProductListHeader = () => {
    const params = useParams();
    const location = useLocation();
    const [currentSubMenus, setCurrentSubMenus] = useState<any[]>([]);

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const urlParent = params.parentCategory || pathSegments[1];
    const urlSub = params.subCategory || pathSegments[2];

    useEffect(() => {
        const fetchAndFilter = async () => {
            try {
                const res = await getCategories();
                const rawData = Array.isArray(res) ? res : res.data;

                if (rawData && urlParent) {
                    const parent = rawData.find(
                        (cat: any) =>
                            cat.path.replace(/^\//, "").toLowerCase() === urlParent.toLowerCase(),
                    );

                    if (parent && parent.children) {
                        setCurrentSubMenus(parent.children);
                    }
                }
            } catch (error) {
                console.error("메뉴 로드 실패", error);
            }
        };
        fetchAndFilter();
    }, [urlParent]);

    if (currentSubMenus.length === 0) return null;

    return (
        <div className="z-40 w-full">
            {/* 1. 패딩 수정: 모바일에서는 px-4 정도로 줄여서 공간 확보 */}
            <div className="max-w-[1600px] md:pl-[50px] px-4  md:pr-[10px] h-[55px] flex items-center">

                {/* 2. 가로 스크롤 적용: overflow-x-auto와 scrollbar-hide가 핵심 */}
                <nav className="flex gap-2 md:gap-3 h-full items-center overflow-x-auto no-scrollbar scroll-smooth">
                    {currentSubMenus.map(sub => {
                        const subPath = sub.path.replace(/^\//, "");
                        const isActive = urlSub === subPath;

                        return (
                            <Link
                                key={sub.id}
                                to={`/category/${urlParent}/${subPath}`}
                                className={twMerge(
                                    "text-[12px] tracking-tight relative h-[30px] flex items-center border border-[#dfe3e8] px-[12px] py-[7px] rounded-[35px] whitespace-nowrap flex-shrink-0 transition duration-300",
                                    isActive
                                        ? "text-[#111] font-[700] bg-[#dfe3e8]"
                                        : "text-[#858585] hover:bg-[#dfe3e8]"
                                )}>
                                {sub.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default ProductListHeader;
