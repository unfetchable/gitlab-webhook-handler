import React, { useRef, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { BookOpenIcon } from "@heroicons/react/outline";
import Toast from "../components/Toast";
import Button from "../components/Button";

const Landing = () => {
	const toast = useToast();

	const [tokenInvalid, setTokenInvalid] = useState(false);
	const [tokenDisabled, setTokenDisabled] = useState(false);
	const [discordUrlInvalid, setDiscordUrlInvalid] = useState(false);
	const [discordUrlLoading, setDiscordUrlLoading] = useState(false);

	const discordUrlRef = useRef(null);

	const handleTokenChange = async event => {
		let value = event.target.value;

		if (!/^[0-9a-f]*$/g.test(value)) {
			setTokenInvalid(true);
			return;
		}

		setTokenInvalid(false);

		if (value.length !== 8)
			return;

		try {
			setTokenDisabled(true);

			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${value}`);
			let body = await response.json();

			if (response.ok) {
				toast({
					duration: 10000,
					isClosable: false,
					position: "top",
					render: () => (
						<Toast
							title="Success!"
							description="Redirecting you now..."
							theme="bg-green-600"
						/>
					)
				});

				setTimeout(() => {
					window.location = `/${value}`;
				}, 2000);
			} else {
				toast({
					duration: 4000,
					isClosable: false,
					position: "top",
					render: () => (
						<Toast
							title="Error!"
							description={body.message}
							theme="bg-red-500"
						/>
					)
				});

				setTokenDisabled(false);
			}
		} catch (err) {
			setTokenDisabled(false);

			if (!err.response)
				err.response = { message: "An unknown error occurred" };
			else if (!err.response.message)
				err.response.message = "An unknown error occurred";

			toast({
				duration: 4000,
				isClosable: false,
				position: "top",
				render: () => (
					<Toast
						title="Error!"
						description={err.response.message}
						theme="bg-red-500"
					/>
				)
			});
		}
	};

	const handleDiscordUrlUpdate = () => {
		setDiscordUrlInvalid(false);
	};

	const handleCreateHandler = async () => {
		let value = discordUrlRef.current.value;

		if (!value.startsWith("http://") && !value.startsWith("https://")) {
			setDiscordUrlInvalid(true);
			toast({
				duration: 4000,
				isClosable: false,
				position: "top",
				render: () => (
					<Toast
						title="Error!"
						description="Please enter a valid webhook URL"
						theme="bg-red-500"
					/>
				)
			});
			return;
		}

		try {
			setDiscordUrlLoading(true);

			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					discordUrl: value
				})
			});
			let body = await response.json();

			if (response.ok) {
				toast({
					duration: 10000,
					isClosable: false,
					position: "top",
					render: () => (
						<Toast
							title="Success!"
							description="Redirecting you now..."
							theme="bg-green-600"
						/>
					)
				});

				setTimeout(() => {
					window.location = `/${body.handler.id}`;
				}, 2000);
			} else {
				toast({
					duration: 4000,
					isClosable: false,
					position: "top",
					render: () => (
						<Toast
							title="Error!"
							description={body.message}
							theme="bg-red-500"
						/>
					)
				});
			}

			setDiscordUrlLoading(false);
		} catch (err) {
			setDiscordUrlLoading(false);

			if (!err.response)
				err.response = { message: "An unknown error occurred" };
			else if (!err.response.message)
				err.response.message = "An unknown error occurred";

			toast({
				duration: 4000,
				isClosable: false,
				position: "top",
				render: () => (
					<Toast
						title="Error!"
						description={err.response.message}
						theme="bg-red-500"
					/>
				)
			});
		}
	};

	return (
		<div className="flex items-center justify-center text-white flex-grow flex-col h-full">
			<div className="mb-12">
				<h1 className="font-extrabold text-6xl mb-2">
					🦊
				</h1>
				<h1 className="font-extrabold text-4xl mb-2">
					GitLab Webhook Handler
				</h1>
				<p className="text-lg font-bold mb-4">
					An intermediary for GitLab webhook events to provide rich Discord notifications.
				</p>

				<a href="/docs" target="_blank" className={`
					bg-orange-500 flex items-center justify-center font-bold
					p-2 px-4 hover:bg-orange-600 rounded-lg w-full sm:w-72 mx-auto
				`}>
					<BookOpenIcon className="h-5 w-5 mr-2" />
					View the Documentation
				</a>
			</div>
			<div className="mb-12">
				<p className="text-lg font-bold mb-2">
					Already set up a handler? Enter the token below to view it:
				</p>
				<input
					onChange={handleTokenChange} disabled={tokenDisabled}
					type="password" maxLength="8" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
					className={`border-2 ${tokenInvalid ? "border-red-500" : "border-gray-700"} 
					focus:outline-none font-mono text-center text-lg disabled:cursor-not-allowed transition duration-250 
					focus:border-orange-500 rounded-lg bg-black p-1 px-2 w-full disabled:bg-gray-900`} />
			</div>
			<div className="mb-12">
				<p className="text-lg font-bold mb-2">
					Don't have a handler or need another? Enter a Discord webhook URL below to begin:
				</p>
				<div className="flex flex-wrap gap-2">
					<input
						onChange={handleDiscordUrlUpdate} disabled={discordUrlLoading}
						type="text" placeholder="Discord Webhook URL" ref={discordUrlRef}
						className={`border-2 ${discordUrlInvalid ? "border-red-500" : "border-gray-700"}
						focus:outline-none disabled:bg-gray-900 focus:border-orange-500 rounded-lg transition duration-250 
						bg-black p-1 px-2 w-full sm:w-auto sm:flex-grow disabled:cursor-not-allowed`}
					/>
					<Button
						text="Create"
						iconRight={<ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />}
						loading={discordUrlLoading}
						onClick={handleCreateHandler}
						className={`
							bg-orange-500 flex items-center justify-center disabled:cursor-not-allowed 
							font-bold p-2 px-4 hover:bg-orange-600 rounded-lg w-full sm:w-auto
						`}
					/>
				</div>
			</div>
		</div>
	);
};

export default Landing;
