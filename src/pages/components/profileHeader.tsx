import { twMerge } from "tailwind-merge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";

function ProfileHeader() {
    const { logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            logout();
            navigate(-1);
        }
    };

    const getButtonStyle = (path: string) => {
        const isActive = location.pathname === path;

        return twMerge(
            "border cursor-pointer text-[12px] px-[11px] py-[7px] rounded-[20px] transition-colors border-[#dfe3e8]",
            isActive
                ? "bg-[#DFE3E8] text-[#111]"
                : "text-[#858585] bg-none hover:bg-[#DFE3E8] hover:text-[#111]"
        );
    };

    return (
        <div className={twMerge(
            "flex flex-col md:flex-row justify-between items-start md:items-center",
            "px-6 md:px-[60px] gap-4 md:gap-0"
        )}>

            <div className={twMerge("flex flex-wrap gap-2 md:gap-3")}>
                <Link to="/myaccount">
                    <button className={getButtonStyle("/myaccount")}>
                        계정
                    </button>
                </Link>

                <Link to="/myaccount/orderList">
                    <button className={getButtonStyle("/myaccount/orderList")}>
                        구매한 제품
                    </button>
                </Link>

                <Link to="/myaccount/WishList">
                    <button className={getButtonStyle("/myaccount/WishList")}>
                        위시 리스트
                    </button>
                </Link>
                <Link to="/myaccount/profileEdit">
                    <button className={getButtonStyle("/myaccount/profileEdit")}>
                        프로필
                    </button>
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className={twMerge(
                    "text-[13px] font-semibold cursor-pointer transition-colors text-[#858585] hover:text-[#111]",
                    "px-[11px] py-[7px]",
                    "md:mr-0"
                )}
            >
                로그아웃
            </button>
        </div>
    );
}

export default ProfileHeader;