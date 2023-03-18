import React from "react";
import "./loader-container.css";
import { Loader } from "../utils/loader";

export default function LoaderApp() {
	return <div className="loader-container">{new Loader().run()}</div>;
}
