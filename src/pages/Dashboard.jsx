import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import RegisteredUsers from "../components/RegisteredUsers";
import AdminPanel from "../components/AdminPanel";

function hasLocalToken() {
	const localToken = localStorage.getItem("login_bearer");
	if (!localToken) {
		return false;
	}
	return localToken;
}

async function getData(token) {
	try {
		const { data } = await axios({
			method: "GET",
			url: "https://chatroombackend-officialhaze.onrender.com/api/rooms/",
			headers: {
				Authorization: `Token ${token}`,
			},
		});

		if (data.length === 0) {
			return data;
		}
		localStorage.setItem("user", data[0].user);
		return data.reverse();
	} catch (err) {
		console.log(err.message);
		throw err.message;
	}
}

export default function Dashboard() {
	const [hasToken, setHasToken] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [roomName, setRoomName] = useState("");

	useEffect(() => {
		const localToken = hasLocalToken();
		if (localToken) {
			setHasToken(true);
		} else {
			setHasToken(false);
		}
		const getDataFromBackend = async () => {
			try {
				const data = await getData(localToken);
				setDataSet(data);
			} catch (err) {
				localStorage.removeItem("login_bearer");
				setHasToken(false);
			}
		};
		getDataFromBackend();
	}, []);

	const handleChange = (e) => {
		const { value } = e.target;
		console.log(value);
		setRoomName(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(roomName);
		// if (!roomName === "") {
		setRoomName("");
		const token = localStorage.getItem("login_bearer");
		try {
			const res = await axios({
				method: "POST",
				url: "https://chatroombackend-officialhaze.onrender.com/api/rooms/create/",
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
		// }
	};

	return hasToken ? (
		<main>
			<form className="room-create-form" onSubmit={handleSubmit}>
				<input onChange={handleChange} placeholder="Room Name" value={roomName} />
				<button type="submit">Create</button>
			</form>
			<section className="room-list-section">
				<div className="rooms-container">
					{dataSet.map((data, index) => {
						return (
							<div className="rooms" key={data.room_id} style={{ textAlign: "left" }}>
								<p>@{data.host.username}</p>
								<h1>
									<a href={`/room/${data.room_name}/${data.room_id}`}>{data.room_name}</a>
								</h1>
							</div>
						);
					})}
				</div>
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
