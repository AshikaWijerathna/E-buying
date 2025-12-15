import React from "react";

const AboutPage = () =>{
    return(
        <div className='min-h-screen bg-gray-900 text-white py-16 px-6 ml-10 mr-10 mt-10 border-4 border-gray-400 border-dashed flex justify-center items-center'>
            <div className="max-w-6xl mx-auto">
                {/*Header*/}
                <h1 className="text-5xl font-bold text-[#0096FF] text-center mb-6">
                    About Us
                </h1>
                <p className="text-center text-gray-300 text-lg max-w-3xl mx-auto mb-14">
                    E-Buying is dedicated to combining sustainability with modern style. Our mission is to create high-quality fashion products with the best quality.
                </p>
                {/* Grid Section*/ }
                <div className="grid grid-cols-1 md:grid-cols gap-12">
                    {/*Left side text*/}
                    <div>
                        <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
                        <p className="text-gray-400 leading-7">
                            We are a passionate team of designers, creators, and innovators committed to bringing sustainable fashion to everyone.
                            Each product is crafted with eco-friendly materials, ensuring style and responsibility go hand in hand.
                        </p>
                        <h2 className="text-3xl font-semibold mt-10 mb-4">What We Believe</h2>
                        <p className="text-gray-400 leading-7">
                            Fashion can be beautiful without harming the environment. 
                            We believe in ethical production, recycled materials, and long-lasting quality that reduces waste.
                        </p>
                    </div>
                    {/*Mission Section*/}
                    <div className="mt-15 text-center">
                        <h2 className="text-4xl font-semibold text-[#0096FF] mb-6">
                            Our Mission
                        </h2>
                        <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-7">
                            To inspire concious shopping while delivering premium, stylish and eco-friendly fashion pieces.
                            We aim to reduce waste, promote sustainable materials, and empower consumers to make environmentally responsible choices.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AboutPage;