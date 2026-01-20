import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {IoIosSearch} from "react-icons/io";
import {RiShoppingBagLine} from "react-icons/ri";
import {LuUser} from "react-icons/lu";

const MENU = [
    {
        name: "선글라스",
        path: "/sunglasses/view-all",
        subMenu: [
            { name: "전체보기", path: "/category/sunglasses/view-all" },
            { name: "2026 컬렉션", path: "/category/sunglasses/2026-collection" },
            { name: "FALL 컬렉션", path: "/category/sunglasses/2025-fall-collection" },
            { name: "볼드 컬렉션", path: "/category/sunglasses/2025-bold-collection" },
            { name: "포켓 컬렉션", path: "/category/sunglasses/pocket-collection" },
            { name: "베스트 셀러", path: "/category/sunglasses/bestsellers" },
            { name: "틴트 렌즈", path: "/category/sunglasses/tinted-lenses" },
        ],
    },
    {
        name: "안경",
        path: "/glasses/view-all",
        subMenu: [
            { name: "전체보기", path: "/category/glasses/view-all" },
            { name: "2026 컬렉션", path: "/category/glasses/2026-collection" },
            { name: "FALL 컬렉션", path: "/category/glasses/2025-fall-collection" },
            { name: "볼드 컬렉션", path: "/category/glasses/2025-bold-collection" },
            { name: "포켓 컬렉션", path: "/category/glasses/pocket-collection" },
            { name: "베스트 셀러", path: "/category/glasses/bestsellers" },
            { name: "블루라이트", path: "/category/glasses/blue-light-lenses" },
            { name: "틴트 렌즈", path: "/category/glasses/tinted-lenses" },
        ],
    },
    {
        name: "컬렉션",
        path: "/collections/2026-collection",
        subMenu: [
            { name: "2026 컬렉션", path: "/category/collections/2026-collection" },
            { name: "2025 FALL", path: "/category/collections/2025-fall-collection" },
            { name: "2025 볼드", path: "/category/collections/2025-bold-collection" },
            { name: "포켓", path: "/category/collections/pocket-collection" },
            { name: "메종 마르지엘라", path: "/category/collections/maison-margiela" },
            { name: "2025 컬렉션", path: "/category/collections/2025-collection" },
            { name: "철권8", path: "/category/collections/tekken8" },
            { name: "뮈글러", path: "/category/collections/mugler" },
            { name: "젠틀 살롱", path: "/category/collections/jentle-salon" },
        ],
    },
    {
        name: "더 알아보기",
        path: "/stories",
        subMenu: [
            { name: "스토리", path: "/stories" },
        ],
    },
];

const RIGHT_MENU = [
    { name: '슬라이드', path: '/slide' },
    { name: '검색', path: '/search', icon: <IoIosSearch  size={24}/> },
    { name: '로그인', path: '/login', icon:<LuUser  size={24}/> },
    { name: '쇼핑백', path: '/cart', icon: <RiShoppingBagLine size={24} /> },
];

export default function Header() {
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [menuPositions, setMenuPositions] = useState<{ [key: string]: number }>({});
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const isHome = location.pathname === '/' || location.pathname === '/home';

    useEffect(() => {
        if (!isHome) {
            setIsScrolled(false);
            return;
        }
        const handleScroll = () => {
            const triggerPoint = window.innerHeight * 0.8;
            setIsScrolled(window.scrollY >= triggerPoint);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    const handleMenuHover = (menuName: string, event: React.MouseEvent<HTMLDivElement>) => {
        setHoveredMenu(menuName);
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPositions(prev => ({ ...prev, [menuName]: rect.left }));
    };

    // 비디오 구간을 지났는지 여부
    const isVideoPassed = !isHome || isScrolled;

    return (
        <div className="relative">
            <header
                // 🌟 전체 헤더 영역에서 마우스가 나가야만 서브메뉴가 닫히도록 설정
                onMouseLeave={() => setHoveredMenu(null)}
                className={twMerge(
                    "fixed top-0 left-0 right-0 z-50 transition-all",
                    isVideoPassed
                        ? "bg-[#f2f3f5]/30 backdrop-blur-xl text-black "
                        : (hoveredMenu ? "text-white" : "bg-transparent text-white"),
                    !isHome && "relative"
                )}
            >
                {/* 메인 메뉴 상단 바 */}
                <div className="grid grid-cols-3 items-center h-[90px] px-[60px] mobile:h-[56px] mobile:px-[12px]">
                    <nav className="flex gap-5 font-bold h-full items-center">
                        {MENU.map(menu => (
                            <div
                                key={menu.name}
                                onMouseEnter={(e) => handleMenuHover(menu.name, e)}
                                className="relative h-full flex items-center cursor-pointer"
                            >
                                <Link to={menu.path} className="text-[14px] py-2">
                                    {menu.name}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <div className="text-4xl text-center font-bold tracking-tighter">
                        <Link to="/">GENTLE MONSTER</Link>
                    </div>

                    {/* RIGHT: 아이콘 메뉴 */}
                    <div className="flex gap-3 justify-end items-center">
                        <div className={twMerge("flex","items-center")}>
                            <Link to="/slide" className="text-[13px] font-bold">슬라이드</Link> {/*이 부분 수정*/}
                            <span className="text-[10px] opacity-30">|</span>
                            <Link to="/search" className="p-1"><IoIosSearch  size={24} /></Link>
                        </div>
                        <Link to="/login" className="p-1"><LuUser size={24} /></Link>
                        <Link to="/cart" className="p-1"><RiShoppingBagLine size={24} /></Link>
                    </div>
                </div>

                {/* 🌟 서브메뉴 드롭다운 (헤더 박스 내부에 위치) */}
                <div
                    className={twMerge(
                        "overflow-hidden transition-all duration-500 ease-in-out",
                        // 비디오를 지났을 때만 서브메뉴 배경에도 blur 적용
                        hoveredMenu ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="py-3 px-[10px]">
                        {MENU.map(menu => (
                            <div
                                key={menu.name}
                                className={twMerge(
                                    "flex flex-col gap-3",
                                    hoveredMenu === menu.name ? "opacity-100" : "opacity-0 hidden"
                                )}
                                style={{ marginLeft: `${menuPositions[menu.name] || 0}px` }}
                            >
                                {menu.subMenu.map(subItem => (
                                    <Link
                                        key={subItem.name}
                                        to={subItem.path}
                                        className={twMerge(
                                            "text-[13px] font-bold transition-colors whitespace-nowrap w-fit",
                                            isVideoPassed ? "text-black ": "text-white"
                                        )}
                                    >
                                        {subItem.name}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </header>
        </div>
    );
}