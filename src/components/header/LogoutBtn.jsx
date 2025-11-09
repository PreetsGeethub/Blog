import React from "react";
import authService from "../../firebase/auth";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out in LogoutBtn component:", error);
    }
  };

  return (
    <button
      className="w-full lg:w-auto inline-block px-6 py-2 duration-200 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium text-gray-700 transition-colors"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;