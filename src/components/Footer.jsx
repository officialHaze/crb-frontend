import React, { useEffect, useState } from "react";
import "./footer.css";

export default function Footer() {
	const [currentYear, setCurrentYear] = useState("");
	useEffect(() => {
		const currentYear = new Date().getFullYear();
		setCurrentYear(currentYear);
	}, []);

	return (
		<div className="footer-container">
			<p>&copy; Copyright {currentYear}</p>
			<p>Made by Moinak Dey</p>
		</div>
	);
}
