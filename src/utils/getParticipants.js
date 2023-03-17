import axios from "axios";

export async function getParticipants(token, url) {
	try {
		const { data } = await axios({
			method: "GET",
			// url: `${deployedURL}/api/rooms/${room_id}/get-participants/`,
			url: url,
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		console.log(data);
		return data;
	} catch (err) {
		throw err;
	}
}
