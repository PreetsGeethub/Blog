import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="py-4 shadow-md bg-white sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Blog</span>
          </Link>

          {/* Right: Navigation */}
          <ul className="flex items-center space-x-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {/* User Info & Logout */}
            {authStatus && (
              <>
                <li className="ml-4 px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">
                    👋 {userData?.displayName || userData?.email?.split('@')[0]}
                  </span>
                </li>
                <li>
                  <LogoutBtn />
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;