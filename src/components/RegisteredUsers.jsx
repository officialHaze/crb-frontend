import React, { useEffect, useState } from "react";
import "./registered-users.css";
import axios from "axios";

async function getRegisteredUsers() {
	const token = localStorage.getItem("login_bearer");
	const usersArray = [];
	try {
		const { data } = await axios({
			method: "GET",
			url: "https://chatroombackend-officialhaze.onrender.com/api/users/registered-users/",
			// url: "http://localhost:8000/api/users/registered-users/",
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		if (data.length === 0) {
			return data;
		}
		data.map(user => {
			if (!user.is_admin) {
				usersArray.push(user);
			}
			return "pushed";
		});
		return usersArray;
	} catch (err) {
		console.log(err.message);
	}
}

export default function RegisteredUsers() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const users = await getRegisteredUsers();
			setUsers(users);
		};
		getData();
	}, []);

	return (
		<div className="registered-users-list-container">
			<div>
				<h1 className="heading">Registered Users:</h1>
			</div>
			<ul className="user-list">
				{users.map((user, i) => {
					let dateJoined = new Date(user.date_joined);
					dateJoined = dateJoined.toLocaleString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					});
					return (
						<li
							className="user"
							key={i}>
							<p>@{user.username}</p>
							<p>
								<em>Joined on: {dateJoined}</em>
							</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
