import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Landing from "./pages/Landing";
import Handler from "./pages/Handler";
import Error from "./components/Error";

const App = () => {
	return (
		<div className="p-6 sm:p-3 select-none text-center min-h-screen font-lg flex-col flex justify-between">
			<Router>
				<Switch>
					<Route path="/:handlerId([0-9a-f]{8})">
						<Handler />
					</Route>
					<Route exact path="/">
						<Landing />
					</Route>
					<Route>
						<Error statusCode={404} />
					</Route>
				</Switch>
			</Router>
			<div className="font-bold text-white pb-8">
				An open-source project by{" "}
				<a
					className="text-orange-500 hover:text-orange-600"
					href="https://xela.tech"
					target="_blank"
					rel="noreferrer"
				>
					Alex Gokhale
				</a>
				{" "}&bull;{" "}
				<a
					className="text-orange-500 hover:text-orange-600"
					href="https://gitlab.com/honour/gitlab-webhook-handler"
					target="_blank" rel="noreferrer"
				>
					View the Source
				</a>
			</div>
		</div>
	);
};

export default App;
