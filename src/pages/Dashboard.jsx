import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./dashboard.css";
import RegisteredUsers from "../components/RegisteredUsers";
import AdminPanel from "../components/AdminPanel";
import RoomCreateForm from "../components/RoomCreateForm";
import { getData } from "../utils/getRooms";
import RoomListContainer from "../components/RoomListContainer";
import LoaderApp from "../components/Loader";

function hasLocalToken() {
	const localToken = localStorage.getItem("login_bearer");
	if (!localToken) {
		return false;
	}
	return localToken;
}

export default function Dashboard() {
	const [hasToken, setHasToken] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [roomName, setRoomName] = useState("");
	const createButton = useRef(null);
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
				setIsLoaded(true);
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
			createButton.current?.setAttribute("disabled", null);
			setIsLoaded(false);
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
						const data = await getData(token, liveUrl);
						setDataSet(data);
					} catch (err) {
						console.log(err);
					}
				}
				createButton.current?.removeAttribute("disabled", null);
				setIsLoaded(true);
			} catch (err) {
				console.log(err);
			}
		}
	};

	return hasToken ? (
		<main>
			<RoomCreateForm
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				roomName={roomName}
				createbtn={createButton}
			/>
			<button className="navigate-pvt-room-btn">
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
			{isLoaded ? (
				<section className="room-list-section">
					<RoomListContainer
						dataSet={dataSet}
						setDataSet={setDataSet}
						setIsLoaded={setIsLoaded}
					/>
					<div className="dashboard-user-info-container">
						<AdminPanel />
						<RegisteredUsers />
					</div>
				</section>
			) : (
				<LoaderApp />
			)}
		</main>
	) : (
		<div>
			<a href="/login">Log in</a>
		</div>
	);
}
