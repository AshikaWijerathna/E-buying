import React from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock,User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
const Navbar = () => {
  const { user, logout,checkingAuth } = useUserStore();
  const {cart} = useCartStore();
  if(checkingAuth) return null;
  console.log("Navbar user:, user");
  const isAdmin = user?.role === "admin";
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-[#0096FF]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-[#0096FF] items-center space-x-2 flex"
          >
            E-Buying
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-[#0096FF] transition duration-300 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-[#0096FF] transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-[#0096FF]"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -left-2 bg-[#0096FF] text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-[#0096FF] transition duration-300 ease-in-out">
                  {cart.length}
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/secret-dashboard"}
                className="bg-[#0096FF] hover:bg-[#4189cc] text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user && (
              <Link to="/profile" className="bg-[#0096FF] hover:bg-[#4189cc] text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
                <User className="mr-2" size={18} />
                Profile
              </Link>
            )}
            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-[#358ee2] hover:bg-[#0096FF] text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-[#358ee2] hover:bg-[#0096FF] text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
