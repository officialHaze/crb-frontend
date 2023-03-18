import React, { useEffect, useRef } from "react";
import LoaderApp from "../components/Loader";
import "./MessageSection.css";

const getPostedTime = genericTime => {
	const currentDate = new Date(genericTime);

	let currentTime = currentDate.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
	});
	return currentTime;
};

export default function MessageSection({ dataSet, messageValue, submit, change, isLoaded }) {
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
			{/* <h2
				className="message-length-heading"
				style={{ paddingLeft: "3rem" }}>
				Messages: {dataSet.length}
			</h2> */}
			{isLoaded ? (
				<div
					className="message-container"
					style={{ overflowY: "auto" }}>
					{dataSet.map((data, index) => {
						const user = localStorage.getItem("user");
						const message_sender = data.message_creator.username;
						const postedTime = getPostedTime(data.created);
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
									<p>{data.message_body}</p>
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
					placeholder="Type your message here..."
					value={messageValue}
					onKeyDown={handleKeyDown}
				/>
				<button
					className="text-submit-btn"
					type="submit">
					<i className="fa-solid fa-paper-plane"></i>
				</button>
			</form>
		</div>
	);
}
