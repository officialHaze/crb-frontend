import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Room from "./pages/Room";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";

export default function App() {
	return (
		<div className="App">
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
			</Routes>
			<Footer />
		</div>
	);
}
