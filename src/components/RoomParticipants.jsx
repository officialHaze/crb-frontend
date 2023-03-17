import React from "react";

export default function RoomParticipants({participants}) {
	return (
		<div className="participants-container">
			<h1>Current Participants:</h1>
			{participants.map((participant, index) => {
				return (
					<div
						className="participant-username"
						key={index}>
						<h3>@{participant.participant.username}</h3>
					</div>
				);
			})}
		</div>
	);
}
