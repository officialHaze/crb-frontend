import React, { useEffect, useRef } from "react";
import LoaderApp from "../components/Loader";
import Recorder from "../components/Recorder";
import "./MessageSection.css";

const getPostedTime = genericTime => {
	const currentDate = new Date(genericTime);

	let currentTime = currentDate.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
	});
	return currentTime;
};

export default function MessageSection({
	dataSet,
	messageValue,
	submit,
	change,
	isLoaded,
	messageReceived,
	setMessageReceived,
}) {
	const bottomDiv = useRef(null);

	useEffect(() => {
		bottomDiv.current?.scrollIntoView();
	}, [dataSet]);

	const handleKeyDown = e => {
		if (e.which === 13 && !e.shiftKey) {
			e.preventDefault();
			submit(e);
		}
	};

	return (
		<div className="message-container-wrapper">
			{isLoaded ? (
				<div
					className="message-container"
					style={{ overflowY: "auto" }}>
					{dataSet.map((data, index) => {
						const user = localStorage.getItem("user");
						const message_sender = data.message_creator.username;
						const postTime = data.created ? data.created : data.recorded;
						const postedTime = getPostedTime(postTime);
						return (
							<div
								className="message-body-wrapper"
								key={index}
								style={{
									display: "flex",
									justifyContent:
										user === message_sender ? "flex-end" : "flex-start",
								}}>
								<div className="messages">
									<p style={{ fontWeight: "bold" }}>
										{data.message_creator.username}
									</p>
									{data.message_body && <p>{data.message_body}</p>}
									{data.voice_clip && (
										<audio controls>
											<source
												src={data.voice_clip}
												type="audio/mp3"
											/>
										</audio>
									)}
									<div className="posted-time">
										<p>{postedTime}</p>
									</div>
								</div>
							</div>
						);
					})}
					<div ref={bottomDiv} />
				</div>
			) : (
				<LoaderApp />
			)}
			<form
				className="text-submit-form"
				onSubmit={submit}>
				<textarea
					onChange={change}
					placeholder="Type here..."
					value={messageValue}
					onKeyDown={handleKeyDown}
				/>
				<button
					className="text-submit-btn"
					type="submit">
					<i className="fa-solid fa-paper-plane"></i>
				</button>
				<Recorder
					messageReceived={messageReceived}
					setMessageReceived={setMessageReceived}
				/>
			</form>
		</div>
	);
}
