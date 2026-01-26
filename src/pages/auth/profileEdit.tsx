import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore.ts";
import { httpClient } from "../../api/axios.ts"; // 기존 axios 설정 사용
import { twMerge } from "tailwind-merge";
import Input from "../components/input.tsx"; // 기존 Input 컴포넌트 재사용

interface ProfileEditForm {
    name: string;
    phone: string;
}

function ProfileEdit() {
    const navigate = useNavigate();
    const { user, login, token } = useAuthStore(); // login 함수를 사용해 스토어 갱신

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileEditForm>({
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
        },
    });

    const onSubmit = async (data: ProfileEditForm) => {
        try {
            // 1. 서버에 프로필 수정 요청 (엔드포인트는 서버 명세에 맞게 수정하세요)
            const response = await httpClient.patch("/auth/profile", data);

            // 2. 서버 응답 데이터 확인 (아까 확인한 대로 result.data 구조 가정)
            const updatedUser = response.data.data?.user || response.data.user;

            if (updatedUser && token) {
                // 3. Zustand 스토어 업데이트 (기존 토큰 유지하며 유저 정보만 갱신)
                login(updatedUser, token);
                alert("프로필이 성공적으로 수정되었습니다.");
                navigate("/my-account"); // 마이페이지로 이동
            }
        } catch (error: any) {
            console.error("수정 실패:", error);
            alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-20 px-4">
            <h2 className="text-2xl font-bold mb-10">프로필 수정</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-6">
                {/* 이름 수정 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">이름</label>
                    <Input
                        {...register("name", { required: "이름은 필수입니다." })}
                        placeholder="이름을 입력하세요"
                        className={twMerge(errors.name && "border-red-500")}
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>

                {/* 휴대폰 수정 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600 ml-1">휴대폰 번호</label>
                    <Input
                        {...register("phone", {
                            required: "휴대폰 번호는 필수입니다.",
                            pattern: {
                                value: /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/,
                                message: "올바른 번호 형식이 아닙니다."
                            }
                        })}
                        placeholder="휴대폰 번호를 입력하세요"
                        className={twMerge(errors.phone && "border-red-500")}
                    />
                    {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                </div>

                {/* 버튼 영역 */}
                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 h-12 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 bg-black text-white rounded-md font-bold hover:bg-zinc-800 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "저장 중..." : "수정 완료"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileEdit;