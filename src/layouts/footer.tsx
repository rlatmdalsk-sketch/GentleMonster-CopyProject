import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

function Footer() {
    return (
        <footer>
            <div className={twMerge("flex flex-col md:flex-row", "mt-10 md:mt-15", "p-6 md:px-10", "justify-between gap-8 md:gap-0")}>

                <div className="flex-1">
                    <div
                        className={twMerge(
                            "flex flex-wrap gap-x-4 gap-y-2",
                            "text-[12px] md:text-[13px] text-[#111111] font-[500]"
                        )}>
                        <Link to={"/inquiry"}>문의하기</Link>
                        <Link to={"/admin"}>어드민</Link>
                        <Link to={"https://www.youtube.com/c/gentlemonsterofficial"}>YOUTUBE</Link>
                        <Link to={""} className="whitespace-nowrap">법적 고지</Link>
                        <Link to={""} className="whitespace-nowrap">개인정보 처리방침</Link>
                        <Link to={""} className="whitespace-nowrap">고객 서비스</Link>
                        <Link to={""} className="whitespace-nowrap">국가: South Korea</Link>
                    </div>

                    <p className={twMerge(
                        "text-[9px] text-[#858585] font-semibold mt-6 md:mt-4",
                        "leading-relaxed max-w-full md:max-w-[80%]"
                    )}>
                        주) 아이아이컴바인드 | 대표자명: 김한국 | 사업자번호: 119-86-38589 | 통신판매신고번호: 제 2014-서울마포-1050호(사업자 정보 확인↗) | 이메일
                        문의: service.kr@gentlemonster.com | 개인정보보호책임자: 정태호 | 주소: 서울특별시 성동구 뚝섬로 433 | 대표번호:1600-2126 <br className="hidden md:block"/>
                        고객님의 안전한 현금자산 거래를 위해 하나은행과 채무지급보증계약을 체결하여 보장해드리고 있습니다. 서비스 가입 여부 확인↗ 고정형 영상 정보 처리기기 운영 및 관리↗
                    </p>
                </div>

                <div className={twMerge(
                    "md:pr-7 text-[11px] md:text-[12px] font-bold",
                    "text-left md:text-right"
                )}>
                    © 2026 GENTLE MONSTER
                </div>
            </div>
        </footer>
    );
}

export default Footer;