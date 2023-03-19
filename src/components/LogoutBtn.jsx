import React from "react";
import "./logout-btn.css";

export default function LogoutBtn() {
	const handleLogout = () => {
		localStorage.removeItem("login_bearer");
		localStorage.removeItem("user");
	};
	return (
		<a
			onClick={handleLogout}
			href="/login"
			className="logout-btn"
			type="#">
			<i className="fa-solid fa-right-from-bracket"></i>
		</a>
	);
}
