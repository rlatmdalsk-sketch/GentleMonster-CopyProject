interface ProductListHeroProps {
    currentCategory: {
        title: string;
        description: string;
        image?: string; // image가 있으면 Collection 타입으로 판단
    };
}

const ProductListHero = ({ currentCategory }: ProductListHeroProps) => {
    const isCollection = "image" in currentCategory;

    if (isCollection) {
        return (
            <section className="relative w-full h-screen">
                <img
                    src={currentCategory.image}
                    className="w-full h-full object-cover"
                    alt="hero"
                />

                <div className="absolute inset-0 bg-black/10 flex flex-col justify-end pb-20 md:pb-24 px-6 md:px-10">

                    <h2 className="text-white text-[20px] md:text-[24px] font-bold uppercase mb-2">
                        {currentCategory.title}
                    </h2>

                    <p className="text-white text-[11px] md:text-[12px] opacity-90 w-full max-w-[400px] leading-relaxed">
                        {currentCategory.description}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-20 md:pt-32 pb-10 md:pb-16 text-center px-4">
            <h2 className="text-[16px] md:text-[18px] font-bold uppercase tracking-widest">
                {currentCategory.title}
            </h2>
            <p className="text-[10px] md:text-[11px] text-gray-500 mt-3 md:mt-4 max-w-[500px] mx-auto">
                {currentCategory.description}
            </p>
        </section>
    );
};

export default ProductListHero;