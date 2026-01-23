import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import type { RegisterFormType } from "../../types/uesr.ts";
import { twMerge } from "tailwind-merge";
import Input from "../components/input.tsx";
import useAuthStore from "../../stores/useAuthStore.ts";
import { registerUser, loginUser } from "../../api/auth.api.ts"; // 중복 임포트 정리

function Register() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormType>({
        defaultValues: {
            gender: "MALE",
        },
    });

    const password = watch("password");

    // 단 하나의 onSubmit 함수로 정리 (회원가입 -> 로그인 연속 처리)
    const onSubmit = async (data: RegisterFormType) => {
        setError("root", { message: "" });
        try {
            console.log("1. 회원가입 시도...");
            await registerUser(data);

            console.log("2. 로그인 시도...");
            const response = await loginUser({
                email: data.email,
                password: data.password
            });

            console.log("3. 로그인 응답 데이터 상세:", response);

            // 핵심 수정: response.data 내부의 값을 확인합니다.
            if (response && response.data && response.data.token) {
                const token = response.data.token;
                const user = response.data.user;

                // Zustand 스토어에 저장 (순서 주의: user, token)
                login(user, token);

                console.log("4. 스토어 및 로컬스토리지 저장 완료");
                alert("회원가입 및 로그인이 완료되었습니다!");
                navigate("/");
            } else {
                console.error("구조 불일치! response.data.token이 있는지 확인하세요.");
                alert("자동 로그인 처리 중 구조 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("오류 발생 지점:", error);
            if (error instanceof AxiosError) {
                const serverMessage = error.response?.data?.message || "처리에 실패했습니다.";
                setError("root", { message: serverMessage });
            }
        }
    };

    const errorInputStyle = "border-red-500 focus:border-red-500";

    return (
        <div className="flex flex-col items-center min-h-screen px-4 py-40">
            <h2 className="text-3xl font-bold mb-10 text-center">JOIN MEMBER</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-lg gap-5">
                {/* 이메일 */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="email"
                        placeholder="이메일을 입력해주세요*"
                        className={twMerge(errors.email && errorInputStyle)}
                        {...register("email", {
                            required: "이메일은 필수입니다.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "올바른 이메일 형식이 아닙니다."
                            }
                        })}
                    />
                    {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
                </div>

                {/* 비밀번호 */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="password"
                        placeholder="비밀번호 (8자 이상)*"
                        className={twMerge(errors.password && errorInputStyle)}
                        {...register("password", {
                            required: "비밀번호는 필수입니다.",
                            minLength: { value: 8, message: "8자리 이상 입력해주세요." }
                        })}
                    />
                    {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
                </div>

                {/* 비밀번호 확인 */}
                <div className="flex flex-col gap-1">
                    <Input
                        type="password"
                        placeholder="비밀번호 확인*"
                        className={twMerge(errors.password_confirm && errorInputStyle)}
                        {...register("password_confirm", {
                            required: "비밀번호 확인이 필요합니다.",
                            validate: (val) => val === password || "비밀번호가 일치하지 않습니다."
                        })}
                    />
                    {errors.password_confirm && <span className="text-xs text-red-500 ml-1">{errors.password_confirm.message}</span>}
                </div>

                {/* 이름 */}
                <div className="flex flex-col gap-1">
                    <Input
                        placeholder="이름*"
                        className={twMerge(errors.name && errorInputStyle)}
                        {...register("name", { required: "이름은 필수입니다." })}
                    />
                    {errors.name && <span className="text-xs text-red-500 ml-1">{errors.name.message}</span>}
                </div>

                {/* 휴대폰 번호 */}
                <div className="flex flex-col gap-1">
                    <Input
                        placeholder="휴대폰 번호 (-없이 입력)*"
                        className={twMerge(errors.phone && errorInputStyle)}
                        {...register("phone", {
                            required: "휴대폰 번호는 필수값입니다.",
                            pattern: {
                                value: /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/,
                                message: "올바른 휴대폰 번호 형식이 아닙니다."
                            }
                        })}
                    />
                    {errors.phone && <span className="text-xs text-red-500 ml-1">{errors.phone.message}</span>}
                </div>

                {/* 생년월일 & 성별 */}
                <div className="flex flex-col gap-1">
                    <div className={twMerge("flex", "justify-between", "gap-4")}>
                        <div className="flex-[2]">
                            <Input
                                {...register("birthdate", {
                                    required: "생년월일은 필수입니다.",
                                    pattern: {
                                        value: /^\d{8}$/,
                                        message: "YYYYMMDD 형식으로 8자리를 입력해주세요."
                                    }
                                })}
                                placeholder="생년월일 (YYYYMMDD)*"
                                className={twMerge(errors.birthdate && errorInputStyle)}
                            />
                        </div>
                        <div className="flex-1">
                            <select
                                className={twMerge(
                                    "bg-white w-full h-full border rounded-md text-center outline-none focus:border-black transition-colors",
                                    errors.gender && "border-red-500"
                                )}
                                {...register("gender")}
                            >
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                            </select>
                        </div>
                    </div>
                    {errors.birthdate && <span className="text-xs text-red-500 ml-1">{errors.birthdate.message}</span>}
                </div>

                {errors.root && (
                    <p className="text-red-600 text-sm text-center font-semibold">
                        {errors.root.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-black text-white font-bold rounded-md transition-all hover:bg-zinc-800 disabled:bg-gray-400 active:scale-[0.98] mt-4"
                >
                    {isSubmitting ? "처리 중..." : "회원가입"}
                </button>
            </form>
        </div>
    );
}

export default Register;