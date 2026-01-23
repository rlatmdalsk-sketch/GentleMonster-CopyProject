import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiShoppingBagLine } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import useAuthStore from "../stores/useAuthStore.ts";

const MENU = [
    {
        name: "선글라스",
        path: "/category/sunglasses/2026-collection",
        subMenu: [
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
        path: "/category/glasses/2026-collection",
        subMenu: [
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
        path: "/category/collections/2026-collection",
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

export default function Header({ onLoginClick }: { onLoginClick: () => void }) {
    const { isLoggedIn } = useAuthStore();
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [menuPositions, setMenuPositions] = useState<{ [key: string]: number }>({});
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const isHome = location.pathname === '/' || location.pathname === '/home';

    useEffect(() => {
        setHoveredMenu(null);
    }, [location.pathname]);

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

    const handleLogoClick = () => {
        if (isHome) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMenuHover = (menuName: string, event: React.MouseEvent<HTMLDivElement>) => {
        setHoveredMenu(menuName);
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPositions(prev => ({ ...prev, [menuName]: rect.left }));
    };

    const isVideoPassed = !isHome || isScrolled;

    return (
        <div className="relative w-full">
            <header
                onMouseLeave={() => setHoveredMenu(null)}
                className={twMerge(
                    "left-0 right-0 z-50 transition-all duration-300",
                    isHome ? "fixed" : "absolute",

                    // 🌟 헤더 배경 로직 수정
                    !isHome
                        ? "bg-[#f2f3f5] text-black" // 다른 페이지: 고정 배경
                        : (isScrolled
                            ? "bg-[#f2f3f5]/60 backdrop-blur-xl text-black" // 홈 스크롤 후: 반투명 + 블러
                            : "bg-transparent text-white") // 홈 스크롤 전: 완전 투명
                )}
            >
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
                        <Link to="/" onClick={handleLogoClick}>
                            GENTLE MONSTER
                        </Link>
                    </div>

                    <div className="flex gap-3 justify-end items-center">
                        <div className="flex items-center">
                            <Link to="/slide" className="text-[13px] font-bold">슬라이드</Link>
                            <span className="text-[10px] opacity-30 mx-2">|</span>
                            <Link to="/search" className="p-1"><IoIosSearch size={24} /></Link>
                        </div>
                        {isLoggedIn ? (
                            <Link to="/myaccount" className="p-1 hover:opacity-50 transition-opacity">
                                <LuUser size={24} />
                            </Link>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onLoginClick();
                                }}
                                className="p-1 hover:opacity-50 transition-opacity"
                            >
                                <LuUser size={24} />
                            </button>
                        )}
                        <Link to="/cart" className="p-1"><RiShoppingBagLine size={24} /></Link>
                    </div>
                </div>

                <div
                    className={twMerge(
                        "absolute top-[90px] left-0 right-0 overflow-hidden transition-all duration-500 ease-in-out",
                        hoveredMenu ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    )}
                >
                    <div
                        className={twMerge(
                            "py-2 px-[10px]",
                            // 1. 다른 페이지(!isHome) -> 고정 배경 (#f2f3f5)
                            // 2. 홈 스크롤 전 (!isScrolled) -> 배경색 X, 블러 X (완전 투명)
                            // 3. 홈 스크롤 후 (isScrolled) -> 반투명 배경 + 강한 블러 (backdrop-blur-xl)
                            !isHome
                                ? "bg-[#f2f3f5]"
                                : (isScrolled
                                    ? "bg-[#f2f3f5]/60 backdrop-blur-xs text-black"
                                    : "bg-transparent")
                        )}
                    >
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

            {!isHome && <div className="h-[90px] mobile:h-[56px] w-full" />}
        </div>
    );
}