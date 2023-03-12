import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
			url: `http://localhost:8000/api/rooms/${id}/`,
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
	const [dataSet, setDataSet] = useState([]);
	const [message, setMessage] = useState("");
	const { room_name, id } = useParams();

	useEffect(() => {
		const localToken = hasLocalToken();
		if (localToken) {
			setHasToken(true);
		} else {
			setHasToken(false);
		}
		const getDataFromBackend = async () => {
			try {
				const data = await getMessages(localToken, id);
				setDataSet(data);
			} catch (err) {
				localStorage.removeItem("login_bearer");
				setHasToken(false);
			}
		};
		getDataFromBackend();
	}, [id]);

	const handleChange = (e) => {
		const { value } = e.target;
		setMessage(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("login_bearer");
		try {
			const res = await axios({
				method: "POST",
				url: `http://localhost:8000/api/rooms/${id}/post-message/`,
				data: {
					message_body: message,
				},
				headers: {
					Authorization: `Token ${token}`,
				},
			});
			if (res.status === 200) {
				try {
					const data = await getMessages(token, id);
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
			<h1>{room_name}</h1>
			<h2 style={{ textAlign: "left", paddingLeft: "3rem" }}>Messages: </h2>
			{dataSet.map((data, index) => {
				return (
					<div key={index} style={{ textAlign: "left", padding: "1rem 5rem" }}>
						<p>
							<span style={{ fontWeight: "bold" }}>{data.message_creator.username}</span>:{" "}
							{data.message_body}
						</p>
					</div>
				);
			})}
			<form onSubmit={handleSubmit}>
				<textarea onChange={handleChange} placeholder="Text" value={message} />
				<button type="submit">Send</button>
			</form>
		</div>
	) : (
		<div>
			<a href="/login">please log in to view the content</a>
		</div>
	);
}
