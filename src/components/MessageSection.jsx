import React, { useEffect, useRef } from "react";
import "./MessageSection.css";

export default function MessageSection({ dataSet, messageValue, submit, change }) {
	const bottomDiv = useRef(null);

	useEffect(() => {
		bottomDiv.current?.scrollIntoView();
	}, [dataSet]);
	return (
		<div>
			<h2 className="message-length-heading" style={{ textAlign: "left", paddingLeft: "3rem" }}>
				Messages: {dataSet.length}
			</h2>
			<div className="message-container" style={{ overflowY: "auto" }}>
				{dataSet.map((data, index) => {
					const user = localStorage.getItem("user");
					const message_sender = data.message_creator.username;
					return (
						<div
							className="message-body-wrapper"
							key={index}
							style={{
								display: "flex",
								justifyContent: user === message_sender ? "flex-end" : "flex-start",
							}}
						>
							<div className="messages">
								<p style={{ fontWeight: "bold" }}>{data.message_creator.username}</p>
								<p>{data.message_body}</p>
							</div>
						</div>
					);
				})}
				<div ref={bottomDiv} />
			</div>
			<form className="text-submit-form" onSubmit={submit}>
				<textarea onChange={change} placeholder="Type your message here..." value={messageValue} />
				<button className="text-submit-btn" type="submit">
					<i class="fa-solid fa-paper-plane"></i>
				</button>
			</form>
		</div>
	);
}
