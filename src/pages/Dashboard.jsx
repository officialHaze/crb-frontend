import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import RegisteredUsers from "../components/RegisteredUsers";
import AdminPanel from "../components/AdminPanel";
import RoomCreateForm from "../components/RoomCreateForm";
import { getData } from "../utils/getRooms";
import RoomListContainer from "../components/RoomListContainer";

function hasLocalToken() {
	const localToken = localStorage.getItem("login_bearer");
	if (!localToken) {
		return false;
	}
	return localToken;
}

export default function Dashboard() {
	const [hasToken, setHasToken] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [roomName, setRoomName] = useState("");
	const liveUrl = "https://chatroombackend-officialhaze.onrender.com/api/rooms/";
	const localUrl = "http://localhost:8000/api/rooms/";

	useEffect(() => {
		const localToken = hasLocalToken();
		if (localToken) {
			setHasToken(true);
		} else {
			setHasToken(false);
		}
		const getDataFromBackend = async () => {
			try {
				const data = await getData(localToken, liveUrl);
				setDataSet(data);
			} catch (err) {
				localStorage.removeItem("login_bearer");
				setHasToken(false);
			}
		};
		getDataFromBackend();
	}, []);

	const handleChange = e => {
		const { value } = e.target;
		setRoomName(value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		console.log(roomName);
		if (roomName) {
			setRoomName("");
			const token = localStorage.getItem("login_bearer");
			try {
				const res = await axios({
					method: "POST",
					url: "https://chatroombackend-officialhaze.onrender.com/api/rooms/create/",
					// url: "http://localhost:8000/api/rooms/create/",
					data: {
						room_name: roomName,
					},
					headers: {
						Authorization: `Token ${token}`,
					},
				});
				if (res.status === 200) {
					try {
						const data = await getData(token);
						setDataSet(data);
					} catch (err) {
						console.log(err);
					}
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	};

	return hasToken ? (
		<main>
			<RoomCreateForm
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				roomName={roomName}
			/>
			<button className="create-pvt-room-btn">
				<a
					style={{ textDecoration: "underline" }}
					href="/private-rooms/dashboard">
					Click here,
				</a>
				<span style={{ color: "white" }}>
					{" "}
					to navigate to the private chat room dashboard
				</span>
			</button>
			<section className="room-list-section">
				<RoomListContainer
					dataSet={dataSet}
					setDataSet={setDataSet}
				/>
				<div className="dashboard-user-info-container">
					<AdminPanel />
					<RegisteredUsers />
				</div>
			</section>
		</main>
	) : (
		<div>
			<a href="/login">Log in</a>
		</div>
	);
}
