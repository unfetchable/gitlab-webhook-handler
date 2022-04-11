import React from "react";
import { InformationCircleIcon } from "@heroicons/react/solid";

const Toast = ({ theme, title, description }) => {
	return (
		<div className={`w-full select-none max-w-6xl flex mt-1 flex-row gap-3 
			items-center ${theme} rounded-lg p-2 px-4 text-white`}
		>
			<InformationCircleIcon className="h-6 w-6" />
			<div>
				<h3 className="font-bold">
					{title}
				</h3>
				<p className="text-sm">
					{description}
				</p>
			</div>
		</div>
	);
};

export default Toast;
