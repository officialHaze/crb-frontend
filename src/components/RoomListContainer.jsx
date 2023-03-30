import React from "react";
import axios from "axios";
import { getData } from "../utils/getRooms";

export default function RoomListContainer({ dataSet, setDataSet, setIsLoaded }) {
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
							key={data.room_id}
							style={{ textAlign: "left" }}>
							<div className="rooms">
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
														setIsLoaded(false);
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
																	// liveUrl,
																	"https://chatroombackend-officialhaze.onrender.com/api/rooms/",
																);
																setDataSet(data);
															}
														} catch (err) {
															console.log(err.message);
														}
														setIsLoaded(true);
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
											</p>
										)}
									</div>
								)}
							</div>
							{data.private_key && (
								<p
									style={{
										textAlign: "center",
										padding: "0.5rem",
										color: "white",
										opacity: "0.5",
										fontSize: "0.9rem",
									}}>
									<em>
										* Private key is only visible to the host & is required to
										enter the private room
									</em>
								</p>
							)}
						</div>
					);
				})
			)}
		</div>
	);
}
