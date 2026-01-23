import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import useAuthStore from "../../stores/useAuthStore.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const LoginDrawer = ({ isOpen, onClose }: Props) => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    // 1. 입력 필드 상태 관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2. 로그인 처리 핸들러
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!email || !password) {
            alert("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        // 실제 프로젝트에서는 여기서 백엔드 API를 호출합니다.
        // 현재는 Zustand 스토어의 login 함수를 실행하여 상태를 true로 바꿉니다.
        login();

        alert("로그인이 완료되었습니다.");
        onClose(); // 드로어 닫기
        navigate("/"); // 홈으로 이동
    };

    // 버튼 활성화 여부
    const isFormValid = email.length > 0 && password.length > 0;

    return (
        <>
            {/* 배경 어둡게 처리 (Overlay) */}
            <div
                className={twMerge(
                    "fixed inset-0 bg-black/30 z-[100] transition-opacity duration-300",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={onClose}
            />

            {/* 사이드바 본체 */}
            <div className={twMerge(
                "fixed top-0 right-0 h-full w-full md:w-[40%] bg-white z-[101] shadow-2xl transform transition-transform duration-700 ease-in-out p-10 overflow-y-auto",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* 닫기 버튼 */}
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-black">
                    <LuX size={30} />
                </button>

                {/* 내용물 */}
                <div className="mt-40 space-y-8">
                    <form onSubmit={handleLogin}>
                        <h2 className="text-[20px] font-bold mb-4">로그인 / 계정 생성</h2>
                        <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                            이메일 주소를 입력하여 로그인합니다 <br />
                            만약, 회원가입을 안하셨다면 계정생성을 눌러주세요
                        </p>

                        <div className="space-y-4">
                            <label className="text-[10px] text-gray-400 block">*필수 입력 항목</label>

                            {/* 이메일 입력 */}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일 주소*"
                                className="w-full border-b border-black py-2 outline-none text-[13px] focus:border-b-2 transition-all"
                            />

                            {/* 비밀번호 입력 */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호*"
                                className="w-full border-b border-black py-2 outline-none text-[13px] focus:border-b-2 transition-all"
                            />

                            {/* 로그인 버튼 */}
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={twMerge(
                                    "w-full py-4 text-[12px] font-bold mt-4 transition-all duration-300",
                                    isFormValid ? "bg-black text-white" : "bg-gray-300 text-white cursor-not-allowed"
                                )}
                            >
                                계속하기
                            </button>

                            <Link
                                to="/Register"
                                className="text-[12px] block text-center w-full mt-4 underline"
                                onClick={onClose}
                            >
                                계정 생성
                            </Link>
                        </div>
                    </form>

                    {/* 소셜 로그인 섹션 */}
                    <div className="space-y-3 pt-10 border-t border-gray-100">
                        <p className="text-[10px] text-center text-gray-400">다른 옵션 보기</p>
                        <button
                            className="w-full bg-[#FEE500] py-3 text-[12px] flex items-center justify-center gap-2 font-medium"
                            onClick={() => alert("현재 지원하지 않는 기능입니다.")}
                        >
                            카카오 계정으로 계속하기
                        </button>
                        <button
                            className="w-full border border-gray-200 py-3 text-[12px] flex items-center justify-center gap-2 font-medium"
                            onClick={() => alert("현재 지원하지 않는 기능입니다.")}
                        >
                            애플 계정으로 계속하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginDrawer;