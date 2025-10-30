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
      dispatch(logout()); // ✅ must CALL the action
      navigate("/login"); // ✅ redirect after logout
    } catch (error) {
      console.error("Error logging out in LogoutBtn component:", error);
    }
  };

  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
