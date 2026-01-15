import {twMerge} from "tailwind-merge";

function Header() {
    return <>
        <header
            className={twMerge(["fixed", "left-0", "right-0", "z-60"], ["transition-all", "duration-300", "border-b"],)}>
            <div
                className={twMerge("container", "mx-auto", "px-4", "h-20", ["flex", "justify-between", "items-center"])}>
                {/* 왼쪽*/}
                <div className={twMerge("text-blue-200")}>
                    ㅎㅇ
                </div>
                {/* 로고 */}
                <div>
                    GENTLE MONSTER
                </div>
                <div>
                    {/*오른쪽*/}
                    ㅂㅇ
                </div>
                {/**/}
            </div>
        </header>
    </>
}

export default Header;