import React from "react";
import { Link } from "react-router-dom";

const Footer =()=>{
    return(
       <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-8">
            {/* Left: Brand*/}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">E-Buying</h2>
                <p className="text-gray-400 text-sm max-w-xs">
                    Sustainable & stylish fashion for everyone.
                </p>
            </div>
            {/*Center: Quick Links*/}
            <div>
                <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link to='/' className="hover:text-[#0096FF]">Home</Link></li>
                    <li><Link to='/about' className="hover:text-[#0096FF]">About</Link></li>
                    <li><Link to='/contact' className="hover:text-[#0096FF]">Contact</Link></li>
                    <li><Link to='/term-privacy' className="hover:text-[#0096FF]">Terms & Privacy</Link></li>
                </ul>
            </div>

            {/*Right: Socials */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-[#009FF]">Facebook</a>
                    <a href="#" className="hover:text-[#009FF]">Instagram</a>
                    <a href="#" className="hover:text-[#009FF]">Twitter</a>

                </div>
            </div>
        </div>
        {/* Bottom Section*/}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
             © {new Date().getFullYear()} E-Buying. All rights reserved.
        </div>
       </footer>
    )
}

export default Footer;