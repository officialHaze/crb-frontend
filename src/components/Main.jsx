import React, { useEffect, useState } from "react";
import axios from "axios";

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
			url: "http://localhost:8000/api/rooms/",
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		return data;
	} catch (err) {
		console.log(err.message);
		throw err.message;
	}
}

function Main() {
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
		setRoomName(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(roomName);
		const token = localStorage.getItem("login_bearer");
		try {
			const res = await axios({
				method: "POST",
				url: "http://localhost:8000/api/rooms/create/",
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
	};

	return hasToken ? (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Create Room</h1>
				<input onChange={handleChange} placeholder="Room Name" value={roomName} />
				<button>Submit</button>
			</form>
			{dataSet.map((data, index) => {
				return (
					<div key={data.room_id} style={{ textAlign: "left", padding: "1rem 2rem" }}>
						<h1>
							<a href={`/room/${data.room_name}/${data.room_id}`}>{data.room_name}</a>
						</h1>
						<p>Room created by: {data.host.username}</p>
					</div>
				);
			})}
		</div>
	) : (
		<div>
			<a href="/login">please log in to view the content</a>
		</div>
	);
}

export default Main;
