import axios from "axios";
import React, { useState } from "react";

function Register() {
	const [registerCredentials, setRegisterCredentials] = useState({
		email: "",
		username: "",
		password: "",
	});
	const [isRegistered, setIsRegistered] = useState(false);

	const handleChange = (e) => {
		const { id, value } = e.target;
		switch (id) {
			case "email":
				setRegisterCredentials((prevObj) => {
					return {
						...prevObj,
						email: value,
					};
				});
				break;

			case "username":
				setRegisterCredentials((prevObj) => {
					return {
						...prevObj,
						username: value,
					};
				});
				break;

			case "password":
				setRegisterCredentials((prevObj) => {
					return {
						...prevObj,
						password: value,
					};
				});
				break;

			default:
				break;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"https://chatroombackend-officialhaze.onrender.com/api/users/create/",
				registerCredentials
			);
			console.log(res.status);
			localStorage.setItem("user", registerCredentials.username);
			setIsRegistered(true);
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<input
					onChange={handleChange}
					value={registerCredentials.email}
					id="email"
					type="email"
					placeholder="Email"
				/>
				<input
					onChange={handleChange}
					value={registerCredentials.username}
					id="username"
					type="text"
					placeholder="Username"
				/>
				<input
					onChange={handleChange}
					value={registerCredentials.password}
					id="password"
					type="password"
					placeholder="password"
				/>
				<button>Submit</button>
			</form>
			{isRegistered && <a href="/login">Continue to the login page</a>}
		</div>
	);
}

export default Register;
