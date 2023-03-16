import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
	const [login_credentials, set_login_credentials] = useState({
		user_email: "",
		user_password: "",
	});
	const [hasToken, setHasToken] = useState(false);

	useEffect(() => {
		const auth_token = localStorage.getItem("login_bearer");
		if (!auth_token) {
			setHasToken(false);
		} else {
			setHasToken(true);
		}
	}, []);

	const handleChange = e => {
		const { id, value } = e.target;
		switch (id) {
			case "email":
				set_login_credentials(prevObj => {
					return {
						...prevObj,
						user_email: value,
					};
				});
				break;

			case "password":
				set_login_credentials(prevObj => {
					return {
						...prevObj,
						user_password: value,
					};
				});
				break;

			default:
				break;
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const { user_email, user_password } = login_credentials;
		const { data } = await axios.post(
			"https://chatroombackend-officialhaze.onrender.com/api/auth/",
			// "http://localhost:8000/api/auth/",
			{
				username: user_email,
				password: user_password,
			},
		);
		const auth_token = data.token;
		localStorage.setItem("login_bearer", auth_token);
		setHasToken(true);
	};

	return !hasToken ? (
		<div className="login-container">
			<h1 style={{ color: "white" }}>Login</h1>
			<form
				className="login-form"
				onSubmit={handleSubmit}>
				<input
					value={login_credentials.user_email}
					onChange={handleChange}
					type="email"
					placeholder="Email"
					id="email"
				/>
				<input
					value={login_credentials.user_password}
					onChange={handleChange}
					type="password"
					placeholder="Password"
					id="password"
				/>
				<button
					type="#"
					className="login-btn">
					Login
				</button>
				<p className="sign-up-alert">
					Not registered yet? <a href="/register">Signup here</a>
				</p>
			</form>
			{/* {hasToken && <a href="/">Continue to main page!</a>} */}
		</div>
	) : (
		<div className="logged-in-container">
			<h1>You are logged in!</h1>
			<p>
				<a href="/">Click here to continue to Dashboard !</a>
			</p>
		</div>
	);
}
