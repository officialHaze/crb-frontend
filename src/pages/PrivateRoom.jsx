import React, { useEffect, useState, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useParams } from "react-router-dom";
import { getPvtMessages } from "../utils/getPvtMessages";
import MessageSection from "../components/MessageSection";
import { addParticipants } from "../utils/addParticipants";
import { getParticipants } from "../utils/getParticipants";
import RoomParticipants from "../components/RoomParticipants";
import { postMessages } from "../utils/postMessages";
import LoaderApp from "../components/Loader";
import RoomParticipantsSM from "../components/RoomParticipantsSmallScreen";
import "./room.css";

export default function PrivateRoom() {
	const { pvtRoomKey, pvtRoomId, room_name } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [messageSet, setMessageSet] = useState([]);
	const [hasPermission, setHasPermission] = useState(false);
	const [pvtParticipants, setPvtParticipants] = useState([]);
	const [message, setMessage] = useState("");
	const hamMenu = useRef(null);

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
				setIsLoaded(true);
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

	const handleHamMenuOnClick = () => {
		hamMenu.current?.classList.remove("ham-menu");
		hamMenu.current?.classList.add("ham-menu-visible");
	};

	const handleHamMenuCloseOnClick = () => {
		hamMenu.current?.classList.add("ham-menu");
		hamMenu.current?.classList.remove("ham-menu-visible");
	};

	return isLoaded ? (
		hasPermission ? (
			<main>
				<div
					onClick={handleHamMenuOnClick}
					className="hamburger-menu">
					<i className="fa-solid fa-bars" />
				</div>
				<div
					onClick={handleHamMenuCloseOnClick}
					ref={hamMenu}
					className="ham-menu">
					<RoomParticipantsSM
						participants={pvtParticipants}
						isLoaded={isLoaded}
					/>
				</div>
				<div className="message-participants-section">
					<div className="message-body-only">
						<h1 style={{ padding: "1rem" }}>{room_name}</h1>
						<MessageSection
							dataSet={messageSet}
							messageValue={message}
							submit={handleSubmit}
							change={handleChange}
							isLoaded={isLoaded}
						/>
					</div>
					<RoomParticipants
						participants={pvtParticipants}
						isLoaded={isLoaded}
					/>
				</div>
			</main>
		) : (
			<div className="not-authorized-page">
				<h1>You are not authorized to view this page!</h1>
			</div>
		)
	) : (
		<LoaderApp />
	);
}
