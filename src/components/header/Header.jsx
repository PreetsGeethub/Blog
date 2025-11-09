import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  return (
    <header className="py-4 shadow-md bg-white sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">B</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-4 xl:px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {/* User Info & Logout (Desktop) */}
            {authStatus && (
              <>
                <li className="ml-4 px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600 truncate max-w-[150px] inline-block">
                     {userData?.displayName || userData?.email?.split("@")[0]}
                  </span>
                </li>
                <li>
                  <LogoutBtn />
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              // Close Icon
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200 animate-slideDown">
            <ul className="space-y-2">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.slug)}
                        className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}

              {/* User Info & Logout (Mobile) */}
              {authStatus && (
                <>
                  <li className="px-4 py-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {(userData?.displayName || userData?.email)?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium truncate">
                        {userData?.displayName || userData?.email?.split("@")[0]}
                      </span>
                    </div>
                  </li>
                  <li>
                    <LogoutBtn />
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;