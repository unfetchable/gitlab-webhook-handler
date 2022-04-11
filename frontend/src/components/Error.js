import React from "react";
import { FireIcon, BanIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

const Error = ({ statusCode, description }) => {
	let icon;
	let heading;
	let desc;

	if (statusCode === 404) {
		icon = <LocationMarkerIcon className="h-20 w-20 text-orange-500" />;
		heading = "404 • Not Found";
		desc = "This page couldn't be found";
	} else if (statusCode === 403 || statusCode === 401) {
		icon = <BanIcon className="h-20 w-20 text-orange-500" />;
		heading = `${statusCode} • Unauthorized`;
		desc = "It looks like you don't have access to this page";
	} else {
		icon = <FireIcon className="h-20 w-20 text-orange-500" />;
		heading = `${statusCode ? statusCode : 500} • Internal Server Error`;
		desc = "Something went wrong when loading this page";
	}

	return (
		<div className="flex items-center justify-center text-white flex-grow flex-col h-full">
			{icon}
			<h1 className="font-extrabold text-4xl mt-3 mb-1">
				{heading}
			</h1>
			<p className="text-lg font-bold mb-5">
				{description ? description : desc}
			</p>
			<Link to="/">
				<a className="bg-orange-500 hover:bg-orange-600 p-2 px-4 rounded-lg font-bold">
					Back to Homepage
				</a>
			</Link>
		</div>
	);
};

export default Error;
