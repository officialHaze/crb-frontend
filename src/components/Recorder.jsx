import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import TypingDots from "./TypingDots";
import "./recorder.css";

const constraint = { audio: true };
const user = localStorage.getItem("user");
const fileReader = new FileReader();
const token = localStorage.getItem("login_bearer");
let mediaRecorder;
let audioLink;

//convert the blob object to base64 string
function handleBlob(blob, setBase64String) {
	fileReader.readAsDataURL(blob);
	fileReader.onloadend = () => {
		const base64 = fileReader.result.split(",")[1];
		setBase64String(base64);
	};
}

export default function Recorder({ messageReceived, setMessageReceived }) {
	const [recordingState, setRecordingState] = useState();
	const [chunks, setChunks] = useState([]);
	const [base64String, setBase64String] = useState("");
	const { pvtRoomId, pvtRoomKey } = useParams();

	//get user permission to use media devices and set the media recorder
	useEffect(() => {
		if (navigator.mediaDevices) {
			const getMediaDevice = async () => {
				try {
					const mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
					mediaRecorder = new MediaRecorder(mediaStream);
				} catch (err) {
					console.log(err);
				}
			};

			getMediaDevice();
		}
	}, []);

	//get the data when recording stops ans set it into chunks
	useEffect(() => {
		if (recordingState === "inactive") {
			mediaRecorder.ondataavailable = e => {
				setChunks(prevObj => {
					return [...prevObj, e.data];
				});
			};
		}
	}, [recordingState]);

	//create a new blob object url after getting the chunk, set the media type, and handleBlob to convert it into base64 string
	useEffect(() => {
		if (chunks.length >= 1) {
			const blob = new Blob(chunks, { type: "audio/mp3; codecs=opus" });
			audioLink = URL.createObjectURL(blob);
			setChunks([]);
			handleBlob(blob, setBase64String);
		}
	}, [chunks, pvtRoomId]);

	//getting the base64 string and sending the file to backend
	useEffect(() => {
		if (base64String.length >= 1) {
			const currentDate = new Date();
			// const client = new W3CWebSocket(
			// 	`ws://127.0.0.1:8000/ws/private-room/${pvtRoomId}/?token=${token}&pvtkey=${pvtRoomKey}`,
			// );

			const client = new W3CWebSocket(
				`wss://chatroombackend-officialhaze.onrender.com/ws/private-room/${pvtRoomId}/?token=${token}&pvtkey=${pvtRoomKey}`,
			);

			client.onopen = () => {
				client.send(
					JSON.stringify({
						type: "audio_data",
						audio_base64_string: base64String,
						username: user,
						created: currentDate,
					}),
				);
			};
		}
	}, [base64String, pvtRoomId, pvtRoomKey]);

	const startRecording = () => {
		mediaRecorder.start();
		console.log(mediaRecorder.state);
		setRecordingState(mediaRecorder.state);
	};

	const stopRecording = () => {
		mediaRecorder.stop();
		console.log(mediaRecorder.state);
		setRecordingState(mediaRecorder.state);
		setMessageReceived(false);
	};

	return (
		<div className="record-btn-container">
			{messageReceived === true ? (
				recordingState !== "recording" ? (
					<i
						className="fa-solid fa-microphone"
						onClick={startRecording}
					/>
				) : (
					<i
						className="fa-regular fa-circle-stop"
						onClick={stopRecording}
						style={{ color: "red" }}
					/>
				)
			) : (
				<TypingDots />
			)}
		</div>
	);
}
