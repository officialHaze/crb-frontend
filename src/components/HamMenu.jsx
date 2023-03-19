import React from "react";

export default function HamMenu({ hamMenu }) {
	const handleHamMenuOnClick = () => {
		hamMenu.current?.classList.remove("side-menu");
		hamMenu.current?.classList.add("side-menu-visible");
	};

	return (
		<div
			onClick={handleHamMenuOnClick}
			className="hamburger-menu">
			<i className="fa-solid fa-bars" />
		</div>
	);
}
