import React from "react";
import LoaderApp from "./Loader";

export default function RoomParticipantsSM({ participants, isLoaded }) {
	return (
		<div className="participants-container-sm">
			<div style={{ textAlign: "left", fontSize: "1.25rem" }}>
				<i
					style={{ cursor: "pointer" }}
					className="fa-regular fa-circle-xmark"
				/>
			</div>
			<h2>Current Participants:</h2>
			{isLoaded ? (
				participants.map((participant, index) => {
					return (
						<div
							className="participant-username"
							key={index}>
							<h3>@{participant.participant.username}</h3>
						</div>
					);
				})
			) : (
				<LoaderApp />
			)}
		</div>
	);
}
