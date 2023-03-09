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
			url: "http://localhost:8000/api/products/",
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

	return hasToken ? (
		<div>
			{dataSet.map((data, index) => {
				return <div key={index}>{JSON.stringify(data)}</div>;
			})}
		</div>
	) : (
		<div>
			<a href="/login">please log in to view the content</a>
		</div>
	);
}

export default Main;
