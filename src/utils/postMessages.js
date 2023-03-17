import axios from "axios";

export async function postMessages(token, url, message) {
	try {
		const res = await axios({
			method: "POST",
			// url: `${deployedURL}/api/rooms/${id}/post-message/`,
			url: url,
			data: {
				message_body: message,
			},
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		return res.status;
	} catch (err) {
		console.log(err.message);
		throw err;
	}
}
