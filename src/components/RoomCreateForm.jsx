import React from "react";
import LogoutBtn from "./LogoutBtn";

export default function RoomCreateForm({ handleSubmit, handleChange, roomName, createbtn }) {
	return (
		<div style={{ position: "relative" }}>
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
					ref={createbtn}
					type="submit">
					<i className="fa-solid fa-fingerprint"></i>
				</button>
			</form>
			{window.innerWidth >= 600 && <LogoutBtn />}
		</div>
	);
}
