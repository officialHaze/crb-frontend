import React from "react";

export default function RoomCreateForm({ handleSubmit, handleChange, roomName }) {
	return (
		<div>
			<form
				className="room-create-form"
				onSubmit={handleSubmit}>
				<input
					onChange={handleChange}
					placeholder="Create a room..."
					value={roomName}
				/>
				<button
					className="room-create-btn"
					type="submit">
					<i className="fa-solid fa-fingerprint"></i>
				</button>
			</form>
		</div>
	);
}
