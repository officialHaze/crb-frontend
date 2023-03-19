import React from "react";
import "./betaVAlert.css";

export default function BetaVersionAlert() {
	return (
		<div className="beta-warning-container">
			<p>
				This project is currently in Beta version and running on free resources, so items
				might take some time to load. You can check out the site and report any bugs or
				provide feedback @
				<a
					href="mailto:moinak.dey8@gmail.com"
					style={{ textDecoration: "underline", color: "black" }}>
					<span> moinak.dey8@gmail.com</span>
				</a>
			</p>
		</div>
	);
}
