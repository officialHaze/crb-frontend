import React, { useEffect, useState } from "react";
import axios from "axios";

async function getAdminUsers() {
	const token = localStorage.getItem("login_bearer");
	const adminArray = [];
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
			if (user.is_admin) {
				adminArray.push(user);
			}
			return "pushed";
		});
		return adminArray;
	} catch (err) {
		console.log(err.message);
	}
}

export default function AdminPanel() {
	const [admins, setAdmins] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const admins = await getAdminUsers();
			setAdmins(admins);
		};
		getData();
	}, []);
	return (
		<div className="registered-users-list-container">
			<div>
				<h1 className="heading">Admin Panel:</h1>
			</div>
			<ul className="user-list">
				{/* {admins.map((admin, i) => {
					let dateJoined = new Date(admin.date_joined);
					dateJoined = dateJoined.toLocaleString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					});
					return (
						<li className="user" key={i}>
							<p>@{admin.username}</p>
							<p>
								<em>Joined on: {dateJoined}</em>
							</p>
						</li>
					);
				})} */}
				<li className="user">
					<p>@moinakdey</p>
					<p>
						<em>Joined on: March 12, 2023</em>
					</p>
				</li>
			</ul>
		</div>
	);
}
