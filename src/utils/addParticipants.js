import axios from "axios";

export async function addParticipants(token, url) {
	try {
		const res = await axios({
			method: "POST",
			// url: `${deployedURL}/api/rooms/${id}/participants/`,
			url: url,
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		console.log(res.status);
		return res.status;
	} catch (err) {
		throw err;
	}
}
