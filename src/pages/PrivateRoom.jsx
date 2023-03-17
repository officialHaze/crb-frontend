import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useParams } from "react-router-dom";
import { getPvtMessages } from "../utils/getPvtMessages";
import MessageSection from "../components/MessageSection";
import { addParticipants } from "../utils/addParticipants";
import { getParticipants } from "../utils/getParticipants";
import RoomParticipants from "../components/RoomParticipants";
import "./room.css";
import { postMessages } from "../utils/postMessages";

export default function PrivateRoom() {
	const { pvtRoomKey, pvtRoomId, room_name } = useParams();
	const [messageSet, setMessageSet] = useState([]);
	const [hasPermission, setHasPermission] = useState(false);
	const [pvtParticipants, setPvtParticipants] = useState([]);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const localURLToAddOrGetParticipant = `http://localhost:8000/api/rooms/private-room/${pvtRoomId}/private-room-participants/`;

		const liveURLToAddOrGetParticipant = `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-room/${pvtRoomId}/private-room-participants/`;
		const token = localStorage.getItem("login_bearer");

		// const client = new W3CWebSocket(
		// 	`ws://127.0.0.1:8000/ws/private-room/${pvtRoomId}/?token=${token}&pvtkey=${pvtRoomKey}`,
		// );
		const client = new W3CWebSocket(
			`wss://chatroombackend-officialhaze.onrender.com/ws/private-room/${pvtRoomId}/?token=${token}&pvtkey=${pvtRoomKey}`,
		);

		client.onopen = () => {
			console.log("WS connection established");
		};

		client.onmessage = async e => {
			const data = JSON.parse(e.data);

			if (data.type === "chat_content") {
				setMessageSet(prevObj => {
					return [...prevObj, data];
				});
			} else if (data.type === "user-joined") {
				try {
					const pvtParticipants = await getParticipants(
						token,
						liveURLToAddOrGetParticipant,
					);
					setPvtParticipants(pvtParticipants);
				} catch (err) {
					console.log(err.message);
				}
			} else if (data.type === "user-disconnected") {
				try {
					const pvtParticipants = await getParticipants(
						token,
						liveURLToAddOrGetParticipant,
					);
					setPvtParticipants(pvtParticipants);
				} catch (err) {
					console.log(err.message);
				}
			}
		};
	}, [pvtRoomKey, pvtRoomId]);

	useEffect(() => {
		const localURLToFirstAuthenticate = `http://localhost:8000/api/rooms/private-room/${pvtRoomId}/participant/authenticate/`;

		const localURLToGetPvtTexts = `http://localhost:8000/api/rooms/private-room/${pvtRoomId}/`;

		const localURLToAddOrGetParticipant = `http://localhost:8000/api/rooms/private-room/${pvtRoomId}/private-room-participants/`;

		const liveURLToFirstAuthenticate = `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-room/${pvtRoomId}/participant/authenticate/`;

		const liveURLToGetPvtTexts = `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-room/${pvtRoomId}/`;

		const liveURLToAddOrGetParticipant = `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-room/${pvtRoomId}/private-room-participants/`;

		const pvtKey = sessionStorage.getItem("p_node_hex_id");
		const token = localStorage.getItem("login_bearer");

		const addParticipantToTheRoom = async () => {
			try {
				const status = await addParticipants(token, liveURLToAddOrGetParticipant);
				if (status === 200) {
					const pvtParticipants = await getParticipants(
						token,
						liveURLToAddOrGetParticipant,
					);
					setPvtParticipants(pvtParticipants);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		addParticipantToTheRoom();

		const getPvtTexts = async () => {
			try {
				const messages = await getPvtMessages(
					token,
					pvtKey,
					liveURLToFirstAuthenticate,
					liveURLToGetPvtTexts,
				);
				setMessageSet(messages);
				setHasPermission(true);
			} catch (err) {
				console.log(err.message);
				setHasPermission(false);
			}
		};
		getPvtTexts();
	}, [pvtRoomId]);

	const handleChange = e => {
		const { value } = e.target;
		setMessage(value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setMessage("");
		const currentDate = new Date();
		const username = localStorage.getItem("user");
		const token = localStorage.getItem("login_bearer");
		const localUrlToPostMessage = `http://localhost:8000/api/rooms/private-room/${pvtRoomId}/`;
		const liveUrlToPostMessage = `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-room/${pvtRoomId}/`;
		if (message) {
			try {
				const res = await postMessages(token, liveUrlToPostMessage, message);
				console.log(res);
			} catch (err) {
				console.log(err.message);
			}
		}

		// const client = new W3CWebSocket(
		// 	`ws://127.0.0.1:8000/ws/private-room/${pvtRoomId}/?token=${token}&pvtkey=${pvtRoomKey}`,
		// );

		const client = new W3CWebSocket(
			`wss://chatroombackend-officialhaze.onrender.com/ws/private-room/${pvtRoomId}/?token=${token}&pvtkey=${pvtRoomKey}`,
		);

		client.onopen = () => {
			client.send(
				JSON.stringify({
					message: message,
					username: username,
					created: currentDate,
				}),
			);
		};
	};

	return hasPermission ? (
		<main>
			<h1 style={{ padding: "2rem" }}>{room_name}</h1>
			<div
				className="message-participants-section"
				style={{ display: "flex", justifyContent: "space-evenly" }}>
				<MessageSection
					dataSet={messageSet}
					submit={handleSubmit}
					change={handleChange}
					messageValue={message}
				/>
				<RoomParticipants participants={pvtParticipants} />
			</div>
		</main>
	) : (
		<div className="not-authorized-page">
			<h1>You are not authorized to view this page!</h1>
		</div>
	);
}
