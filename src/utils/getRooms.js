import axios from "axios";

export async function getData(token, url) {
	try {
		const { data } = await axios({
			method: "GET",
			url: url,
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		if (data.length === 0) {
			return data;
		}
		if (data[0].user) {
			localStorage.setItem("user", data[0].user);
		}
		return data.reverse();
	} catch (err) {
		throw err.message;
	}
}
