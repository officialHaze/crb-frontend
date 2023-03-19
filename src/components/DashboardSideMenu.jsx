import React from "react";
import AdminPanel from "./AdminPanel";
import RegisteredUsers from "./RegisteredUsers";
import LogoutBtn from "./LogoutBtn";

export default function DashboardSideMenu() {
	return (
		<div>
			<div style={{ textAlign: "left", fontSize: "1.25rem", padding: "0.5rem" }}>
				<i
					style={{ cursor: "pointer" }}
					className="fa-solid fa-xmark"
				/>
			</div>
			{window.innerWidth <= 600 && <AdminPanel />}
			{window.innerWidth <= 600 && <RegisteredUsers />}
			<LogoutBtn />
		</div>
	);
}
