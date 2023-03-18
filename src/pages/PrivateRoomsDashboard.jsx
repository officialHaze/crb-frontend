import React, { useState, useEffect } from "react";
import RoomCreateForm from "../components/RoomCreateForm";
import axios from "axios";
import { getData } from "../utils/getRooms";
import RoomListContainer from "../components/RoomListContainer";
import LoaderApp from "../components/Loader";

export default function PrivateRoomsDashboard() {
	const [hasToken, setHasToken] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [token, setToken] = useState("");
	const [dataSet, setDataSet] = useState([]);
	const [isRoomCreated, setIsRoomCreated] = useState(false);

	const localUrlToGetPvtRooms = "http://localhost:8000/api/rooms/private-rooms/";
	const liveUrlToGetPvtRooms =
		"https://chatroombackend-officialhaze.onrender.com/api/rooms/private-rooms/";

	useEffect(() => {
		const hasToken = () => {
			const tokenValue = localStorage.getItem("login_bearer");
			if (tokenValue) setHasToken(true);
			setToken(tokenValue);
		};
		hasToken();

		const getPvtRooms = async () => {
			setIsLoaded(false);
			try {
				const rooms = await getData(token, liveUrlToGetPvtRooms);
				setDataSet(rooms);
				setIsLoaded(true);
			} catch (err) {
				console.log(err.message);
				// localStorage.removeItem("login_bearer");
				// setHasToken(false);
				// setToken("");
			}
		};
		getPvtRooms();
	}, [token, isRoomCreated]);

	const handleSubmit = async e => {
		e.preventDefault();
		const roomName = e.target.children[0].value;
		if (roomName) {
			try {
				console.log(roomName);
				e.target.children[0].value = "";
				const res = await axios({
					method: "POST",
					url: `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-rooms/`,
					data: {
						room_name: roomName,
					},
					headers: {
						Authorization: `Token ${token}`,
					},
				});
				setIsRoomCreated(true);
			} catch (err) {
				console.log(err.message);
			}
		}
	};

	return hasToken ? (
		<div>
			<div style={{ background: "#1B2430", padding: "0.2rem" }}>
				<h4 style={{ color: "white" }}>Private Chat Rooms</h4>
			</div>
			<RoomCreateForm handleSubmit={handleSubmit} />
			{isLoaded ? (
				<section className="room-list-section">
					<RoomListContainer
						dataSet={dataSet}
						setDataSet={setDataSet}
						setIsLoaded={setIsLoaded}
					/>
				</section>
			) : (
				<LoaderApp />
			)}
		</div>
	) : (
		<div>login</div>
	);
}
