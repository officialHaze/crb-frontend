import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Room from "./pages/Room";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import PrivateRoomsDashboard from "./pages/PrivateRoomsDashboard";
import PvtRoomAuthenticate from "./pages/PvtRoomAuthenticate";
import PrivateRoom from "./pages/PrivateRoom";
import BetaVersionAlert from "./components/BetaVersionAlert";

export default function App() {
	return (
		<div className="App">
			<BetaVersionAlert />
			<Routes>
				<Route
					path="/"
					element={<Dashboard />}
				/>
				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/register"
					element={<Register />}
				/>
				<Route
					path="/room/:room_name/:id"
					element={<Room />}
				/>
				<Route
					path="/private-rooms/dashboard"
					element={<PrivateRoomsDashboard />}
				/>
				<Route
					path="/:room_name/:room_id/authenticate"
					element={<PvtRoomAuthenticate />}
				/>
				<Route
					path="/private-room/:room_name/:pvtRoomKey/:pvtRoomId"
					element={<PrivateRoom />}
				/>
			</Routes>
			<Footer />
		</div>
	);
}
