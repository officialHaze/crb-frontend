import React from "react";
import LoaderApp from "./Loader";

export default function RoomParticipants({ participants, isLoaded }) {
	return (
		<div className="participants-container">
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
