import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { w3cwebsocket as W3CWebsocket } from "websocket";
import MessageSection from "../components/MessageSection";
import "./room.css";

const localhostURL = "http://localhost:8000";
const deployedURL = "https://chatroombackend-officialhaze.onrender.com";

function hasLocalToken() {
	const localToken = localStorage.getItem("login_bearer");
	if (!localToken) {
		return false;
	}
	return localToken;
}

async function getMessages(token, id) {
	try {
		const { data } = await axios({
			method: "GET",
			url: `${deployedURL}/api/rooms/${id}/`,
			// url: `${localhostURL}/api/rooms/${id}/`,
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

async function getParticipants(token, room_id) {
	try {
		const { data } = await axios({
			method: "GET",
			url: `${deployedURL}/api/rooms/${room_id}/get-participants/`,
			// url: `${localhostURL}/api/rooms/${room_id}/get-participants/`,
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

export default function Room() {
	const [hasToken, setHasToken] = useState(false);
	const [token, setToken] = useState("");
	const [dataSet, setDataSet] = useState([]);
	const [participants, addParticipants] = useState([]);
	const [message, setMessage] = useState("");
	const { room_name, id } = useParams();

	useEffect(() => {
		const localToken = hasLocalToken();
		if (localToken) {
			setHasToken(true);
			setToken(localToken);
		} else {
			setHasToken(false);
		}

		const postDataToBackend = async () => {
			try {
				const res = await axios({
					method: "POST",
					url: `${deployedURL}/api/rooms/${id}/participants/`,
					// url: `${localhostURL}/api/rooms/${id}/participants/`,
					headers: {
						Authorization: `Token ${token}`,
					},
				});
				console.log(res.status);
			} catch (err) {
				console.log(err.message);
			}
		};
		postDataToBackend();

		const getDataFromBackend = async () => {
			try {
				const messages = await getMessages(localToken, id);
				const participants = await getParticipants(localToken, id);
				setDataSet(messages);
				addParticipants(participants);
			} catch (err) {
				localStorage.removeItem("login_bearer");
				setHasToken(false);
				setToken("");
			}
		};
		getDataFromBackend();

		const client = new W3CWebsocket(
			`wss://chatroombackend-officialhaze.onrender.com/ws/rooms/${id}/?token=${token}`,
		);
		// const client = new W3CWebsocket(`ws://127.0.0.1:8000/ws/rooms/${id}/?token=${token}`);
		// client.onopen = () => {
		// 	console.log("websocket connection established!");
		// };

		client.onmessage = async e => {
			const data = JSON.parse(e.data);

			if (data.type === "chat_content") {
				setDataSet(prevObj => {
					return [...prevObj, data];
				});
			} else if (data.type === "user-joined") {
				try {
					const participants = await getParticipants(localToken, id);
					addParticipants(participants);
				} catch (err) {
					console.log(err.message);
				}
			} else if (data.type === "user-disconnected") {
				try {
					const participants = await getParticipants(localToken, id);
					addParticipants(participants);
				} catch (err) {
					console.log(err.message);
				}
			}
		};
	}, [id, token]);

	const handleChange = e => {
		const { value } = e.target;
		setMessage(value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setMessage("");
		const currentDate = new Date();

		const username = localStorage.getItem("user");

		try {
			const res = await axios({
				method: "POST",
				url: `${deployedURL}/api/rooms/${id}/post-message/`,
				// url: `${localhostURL}/api/rooms/${id}/post-message/`,
				data: {
					message_body: message,
				},
				headers: {
					Authorization: `Token ${token}`,
				},
			});
			console.log(res.status);

			const client = new W3CWebsocket(
				`wss://chatroombackend-officialhaze.onrender.com/ws/rooms/${id}/?token=${token}`,
			);
			// const client = new W3CWebsocket(`ws://127.0.0.1:8000/ws/rooms/${id}/?token=${token}`);

			client.onopen = () => {
				client.send(
					JSON.stringify({
						message: message,
						username: username,
						created: currentDate,
					}),
				);
			};
		} catch (err) {
			console.log(err.message);
		}
	};

	return hasToken ? (
		<main>
			<h1 style={{ padding: "2rem" }}>{room_name}</h1>
			<div
				className="message-participants-section"
				style={{ display: "flex", justifyContent: "space-evenly" }}>
				<MessageSection
					dataSet={dataSet}
					messageValue={message}
					submit={handleSubmit}
					change={handleChange}
				/>
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
			</div>
		</main>
	) : (
		<div>
			<a href="/login">please log in to view the content</a>
		</div>
	);
}
