import { MdDashboard, MdPeople, MdInventory, MdLogout, MdArrowForward } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthStore from "../../stores/useAuthStore.ts";

const AdminSlideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {user, logout} = useAuthStore();

    // 로그아웃 로직 (전달해주신 방식 적용)
    const handleLogout = () => {
        logout(); // 외부에서 정의된 로그아웃 함수 호출
        navigate("/"); // 홈으로 이동
    };

    const isActive = (path: string) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    const getMenuClass = (path: string) => {
        const baseClass = "flex items-center gap-3 p-3 rounded-sm cursor-pointer transition-all uppercase tracking-widest text-[11px]";
        return isActive(path)
            ? `${baseClass} bg-white text-black font-bold shadow-md`
            : `${baseClass} text-gray-500 hover:text-white hover:bg-white/5 font-medium`;
    };

    return (
        <aside className="w-64 bg-[#111111] text-white flex flex-col shrink-0 min-h-screen sticky top-0">
            <div className="p-8 text-white font-bold text-xl tracking-[0.2em] uppercase border-b border-white/5">
                Gentle Admin
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link to="/admin" className="block text-decoration-none">
                    <div className={getMenuClass("/admin")}>
                        <MdDashboard className="text-xl" />
                        <span>대시보드</span>
                    </div>
                </Link>

                <Link to="/admin/user" className="block text-decoration-none">
                    <div className={getMenuClass("/admin/user")}>
                        <MdPeople className="text-xl" />
                        <span>회원 관리</span>
                    </div>
                </Link>

                <Link to="/admin/productEdit" className="block text-decoration-none">
                    <div className={getMenuClass("/admin/product")}>
                        <MdInventory className="text-xl" />
                        <span>상품 관리</span>
                    </div>
                </Link>
            </nav>

            <div className="p-8 border-t border-white/10 space-y-4">
                <Link to="/" className="block text-decoration-none">
                    <div className="flex items-center justify-between text-[10px] text-white hover:text-white cursor-pointer tracking-widest transition-colors uppercase font-bold">
                        메인 사이트 이동 <MdArrowForward className="text-sm" />
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full border-none bg-transparent p-0 flex items-center justify-between text-[10px] text-red-500/80 hover:text-red-500 cursor-pointer tracking-widest transition-colors uppercase font-bold focus:outline-none"
                >
                    로그아웃 <MdLogout className="text-sm" />
                </button>
            </div>
        </aside>
    );
};

export default AdminSlideBar;