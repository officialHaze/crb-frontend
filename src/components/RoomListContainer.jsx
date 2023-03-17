import React from "react";
import axios from "axios";
import { getData } from "../utils/getRooms";

export default function RoomListContainer({ dataSet, setDataSet }) {
	const liveUrl = "https://chatroombackend-officialhaze.onrender.com/api/rooms/";
	return (
		<div className="rooms-container">
			{dataSet.length === 0 ? (
				<h2 style={{ color: "grey", fontWeight: "normal", opacity: "0.4" }}>
					No chat rooms to display !
				</h2>
			) : (
				dataSet.map((data, index) => {
					const user = localStorage.getItem("user");
					return (
						<div
							className="rooms"
							key={data.room_id}
							style={{ textAlign: "left" }}>
							<div>
								<p>@{data.host.username}</p>
								<h1>
									<a
										href={
											!data.private_key
												? `/room/${data.room_name}/${data.room_id}`
												: `/${data.room_name}/${data.room_id}/authenticate`
										}>
										{data.room_name}
									</a>
								</h1>
							</div>
							{data.host.username === user && (
								<div className="room-cards-del-pvtKey-section">
									<div>
										{!data.private_key && (
											<button
												className="room-delete-btn"
												type="#"
												onClick={async () => {
													const token =
														localStorage.getItem("login_bearer");
													try {
														const res = await axios({
															method: "DELETE",
															url: `https://chatroombackend-officialhaze.onrender.com/api/rooms/${data.room_id}/delete/`,
															// url: `http://localhost:8000/api/rooms/${data.room_id}/delete/`,
															headers: {
																Authorization: `Token ${token}`,
															},
														});
														if (
															res.status >= 200 ||
															res.status <= 300
														) {
															const data = await getData(
																token,
																liveUrl,
															);
															setDataSet(data);
														}
													} catch (err) {
														console.log(err.message);
													}
												}}>
												<i className="fa-solid fa-trash"></i>
											</button>
										)}
									</div>
									{data.private_key && (
										<p
											style={{
												fontSize: "0.9rem",
												padding: "0",
												lineHeight: 2,
											}}>
											<span className="pvt-key">{data.private_key}</span>
											<br></br>
											<span className="pvt-key-info">
												This key is only visibe to the host.<br></br>
												It can be shared with others and is<br></br>
												required to enter the private room.
											</span>
										</p>
									)}
								</div>
							)}
						</div>
					);
				})
			)}
		</div>
	);
}
