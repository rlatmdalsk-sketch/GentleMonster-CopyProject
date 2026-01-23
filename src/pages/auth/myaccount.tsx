import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";

function MyAccount() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout(); // Zustand 스토어의 로그아웃 로직 실행
        navigate("/"); // 홈으로 이동
    };

    return (
        <div className="p-10"> {/* 여백 등을 위해 스타일을 살짝 추가해보세요 */}
            <h1 className="text-2xl font-bold mb-4">마이 페이지</h1>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
                로그아웃
            </button>
        </div>
    );
}

export default MyAccount;