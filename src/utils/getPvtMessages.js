import axios from "axios";

export async function getPvtMessages(token, pvtKey, authUrl, getPvtMsgsUrl) {
	try {
		const res = await axios({
			method: "GET",
			url: authUrl,
			headers: {
				Authorization: `Token ${token}`,
				"X-PVTKEY": pvtKey,
			},
		});
		if (res.status === 200) {
			const { data } = await axios({
				method: "GET",
				url: getPvtMsgsUrl,
				headers: {
					Authorization: `Token ${token}`,
				},
			});
			return data;
		}
	} catch (err) {
		throw err.message;
	}
}
