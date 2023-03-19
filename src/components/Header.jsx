import React, { useRef } from "react";
import HamMenu from "./HamMenu";
import DashboardSideMenu from "./DashboardSideMenu";
import "./header.css";

export default function Header() {
	const hamMenu = useRef(null);
	const handleHamMenuCloseOnClick = () => {
		hamMenu.current?.classList.add("side-menu");
		hamMenu.current?.classList.remove("side-menu-visible");
	};
	return (
		<div className="header">
			<HamMenu hamMenu={hamMenu} />
			<div
				onClick={handleHamMenuCloseOnClick}
				ref={hamMenu}
				className="side-menu">
				<DashboardSideMenu />
			</div>
		</div>
	);
}
