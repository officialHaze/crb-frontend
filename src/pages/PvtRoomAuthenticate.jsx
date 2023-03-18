import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./pvtRoomAuthenticate.css";

export default function PvtRoomAuthenticate() {
	const [hasToken, setHasToken] = useState(false);
	const [token, setToken] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [pvtKeyVal, setPvtKeyVal] = useState("");
	const [authFailed, setAuthFailed] = useState(false);
	const { room_name, room_id } = useParams();
	const authBtn = useRef(null);

	useEffect(() => {
		const hasToken = () => {
			const tokenValue = localStorage.getItem("login_bearer");
			if (tokenValue) {
				setHasToken(true);
				setToken(tokenValue);
			}
		};
		hasToken();
	}, []);

	const handleChange = e => {
		const { value } = e.target;
		setPvtKeyVal(value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (pvtKeyVal) {
			authBtn.current?.setAttribute("disabled", null);
			try {
				const res = await axios({
					method: "GET",
					// url: `http://localhost:8000/api/rooms/private-room/${room_id}/participant/authenticate/`,
					url: `https://chatroombackend-officialhaze.onrender.com/api/rooms/private-room/${room_id}/participant/authenticate/`,
					headers: {
						Authorization: `Token ${token}`,
						"X-PVTKEY": pvtKeyVal,
					},
				});
				console.log(res);
				if (res.status === 200) setIsAuthenticated(true);
				sessionStorage.setItem("p_node_hex_id", pvtKeyVal);
			} catch (err) {
				console.log(err.message);
				setAuthFailed(true);
				authBtn.current?.removeAttribute("disabled", null);
			}
		}
	};

	return hasToken ? (
		!isAuthenticated ? (
			<div className="auth-container">
				<form
					className="pvt-room-authentication-form"
					onSubmit={handleSubmit}>
					<h1>Private Key</h1>
					<input
						placeholder="Enter the private key"
						onChange={handleChange}
						value={pvtKeyVal}
					/>
					<button
						className="authenticate-btn"
						ref={authBtn}
						type="#">
						Authenticate
					</button>
				</form>
				<div className="auth-failure-msg">
					{authFailed && <p>Authentication Failed, please enter a valid key</p>}
				</div>
			</div>
		) : (
			<div className="auth-success-container">
				<h1 className="auth-success-msg">You have been authenticated !</h1>
				<p style={{ padding: "1rem" }}>
					<a
						className="pvt-room-redirect-link"
						href={`/private-room/${room_name}/${pvtKeyVal}/${room_id}`}>
						Clik here,
					</a>
					<span style={{ color: "white" }}> to continue to the room</span>
				</p>
			</div>
		)
	) : (
		<div>login</div>
	);
}
