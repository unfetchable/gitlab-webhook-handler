import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Error from "../components/Error";
import {
	CheckIcon,
	ClipboardCopyIcon,
	CogIcon, DatabaseIcon,
	FingerPrintIcon,
	PaperAirplaneIcon,
	TrashIcon, XIcon
} from "@heroicons/react/solid";
import {
	Dialog,
	Transition
} from "@headlessui/react";
import Button from "../components/Button";
import { useToast } from "@chakra-ui/toast";
import Toast from "../components/Toast";
import { ShieldExclamationIcon } from "@heroicons/react/solid";
import Select from "../components/Select";
import { types } from "../types";

const Handler = () => {
	const { handlerId } = useParams();
	const toast = useToast();

	const discordUrlRef = useRef(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [handler, setHandler] = useState(null);

	const [testLoading, setTestLoading] = useState(false);
	const [toggleLoading, setToggleLoading] = useState(false);
	const [discordUrlLoading, setDiscordUrlLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [templateLoading, setTemplateLoading] = useState(false);

	const [selectedType, setSelectedType] = useState(types[0]);
	const [cursorPosition, setCursorPosition] = useState(0);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [copyIcon, setCopyIcon] = useState(<ClipboardCopyIcon className="h-5 w-5 mr-2 inline-block" />);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);

				let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${handlerId}`);
				let body = await response.json();

				if (response.ok)
					setHandler(body.handler);
				else
					setError(response.status);

				setLoading(false);
			} catch (_) {
				setError(500);
				setLoading(false);
			}
		})();
	}, [handlerId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center text-white flex-grow flex-col h-full">
				<svg className="animate-spin h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path
						className="opacity-75" fill="currentColor"
						d={`
							M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962
							7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z
						`}
					/>
				</svg>
			</div>
		);
	}

	if (error) {
		if (error === 404) {
			return (
				<Error
					statusCode={404}
					description="A handler could not be found with the token provided"
				/>
			);
		}

		return (
			<Error statusCode={error} />
		);
	}

	const handleTestHandler = async () => {
		try {
			setTestLoading(true);

			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${handlerId}/test`, {
				method: "POST"
			});
			let body = await response.json();

			if (response.ok) {
				toast({
					duration: 2500,
					isClosable: true,
					position: "top",
					render: () => (
						<Toast
							title="Success!"
							description="Webhook test completed successfully"
							theme="bg-green-600"
						/>
					)
				});
			} else {
				toast({
					duration: 5000,
					isClosable: true,
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

			setTestLoading(false);
		} catch (err) {
			setTestLoading(false);

			if (!err.response)
				err.response = { message: "An unknown error occurred" };
			else if (!err.response.message)
				err.response.message = "An unknown error occurred";

			toast({
				duration: 5000,
				isClosable: true,
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

	const handleToggleHandler = async () => {
		try {
			setToggleLoading(true);

			let status = handler.enabled ? "disable" : "enable";
			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${handlerId}/${status}`, {
				method: "PATCH"
			});
			let body = await response.json();

			if (response.ok) {
				toast({
					duration: 2500,
					isClosable: true,
					position: "top",
					render: () => (
						<Toast
							title="Success!"
							description={`Handler ${status}d successfully`}
							theme="bg-green-600"
						/>
					)
				});

				setHandler(body.handler);
			} else {
				toast({
					duration: 5000,
					isClosable: true,
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

			setToggleLoading(false);
		} catch (err) {
			setToggleLoading(false);

			if (!err.response)
				err.response = { message: "An unknown error occurred" };
			else if (!err.response.message)
				err.response.message = "An unknown error occurred";

			toast({
				duration: 5000,
				isClosable: true,
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

	const handleUpdateDiscordUrl = async () => {
		let value = discordUrlRef.current.value;

		if (value === handler.discordUrl) {
			toast({
				duration: 5000,
				isClosable: true,
				position: "top",
				render: () => (
					<Toast
						title="Error!"
						description="Please enter a new Discord Webhook URL to update"
						theme="bg-red-500"
					/>
				)
			});

			return;
		}

		if (!value.startsWith("http://") && !value.startsWith("https://")) {
			toast({
				duration: 5000,
				isClosable: true,
				position: "top",
				render: () => (
					<Toast
						title="Error!"
						description="Please enter a valid Discord Webhook URL"
						theme="bg-red-500"
					/>
				)
			});

			return;
		}

		try {
			setDiscordUrlLoading(true);

			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${handlerId}/discord`, {
				method: "PATCH",
				body: JSON.stringify({
					discordUrl: discordUrlRef.current.value
				})
			});
			let body = await response.json();

			if (response.ok) {
				toast({
					duration: 2500,
					isClosable: true,
					position: "top",
					render: () => (
						<Toast
							title="Success!"
							description="Discord Webhook URL updated successfully"
							theme="bg-green-600"
						/>
					)
				});

				setHandler(body.handler);
			} else {
				toast({
					duration: 5000,
					isClosable: true,
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
				duration: 5000,
				isClosable: true,
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

	const handleDeleteHandler = async () => {
		try {
			setDeleteLoading(true);

			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${handlerId}`, {
				method: "DELETE"
			});

			if (response.ok)
				window.location = "/";
			else {
				let body = await response.json();

				toast({
					duration: 5000,
					isClosable: true,
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

			setDeleteLoading(false);
			setDeleteModalOpen(false);
		} catch (err) {
			setDeleteLoading(false);
			setDeleteModalOpen(false);

			if (!err.response)
				err.response = { message: "An unknown error occurred" };
			else if (!err.response.message)
				err.response.message = "An unknown error occurred";

			toast({
				duration: 5000,
				isClosable: true,
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

	const handleUpdateTemplate = async event => {
		let value = event.target.value;

		setHandler({
			...handler,
			templates: {
				...handler.templates,
				[selectedType.value]: value
			}
		});
	};

	const handleSaveTemplate = async () => {
		try {
			setTemplateLoading(true);

			let response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${handler.id}/templates`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					type: selectedType.value,
					template: handler.templates[selectedType.value]
				})
			});

			let body = await response.json();

			if (response.ok) {
				toast({
					duration: 2500,
					isClosable: false,
					position: "top",
					render: () => (
						<Toast
							title="Success!"
							description={`${selectedType.name} template updated`}
							theme="bg-green-600"
						/>
					)
				});
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

			setTemplateLoading(false);
		} catch (err) {
			setTemplateLoading(false);

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

	const handleCopyEventUrl = async () => {
		try {
			await navigator.clipboard.writeText(`${process.env.REACT_APP_BASE_API_URL}/${handler.id}/event`);
			setCopyIcon(<CheckIcon className="h-5 w-5 mr-2 inline-block" />);
		} catch (_) {
			setCopyIcon(<XIcon className="h-5 w-5 mr-2 inline-block" />);
		}

		setTimeout(() => {
			setCopyIcon(<ClipboardCopyIcon className="h-5 w-5 mr-2 inline-block" />);
		}, 2500);
	};

	const handleCursorUpdate = async event => {
		setCursorPosition(event.target.selectionStart);
	};

	const handlePlaceholderClick = async event => {
		let value = event.target.getAttribute("data-value");
		let template = handler.templates[selectedType.value];

		if (!template)
			template = "";

		let start = template.substr(0, cursorPosition);
		let end = template.substr(cursorPosition);

		setHandler({
			...handler,
			templates: {
				...handler.templates,
				[selectedType.value]: start + `{{${value}}}` + end
			}
		});

		setCursorPosition(cursorPosition + 4 + value.length);
	};

	const formatPlaceholders = (object, group = "", prefix = "", depth = 0) => {
		if (!object)
			return <></>;

		return (
			<>
				{Object.keys(object).map(key => {
					if (key === "_") {
						return (
							<>
								{depth !== 0 && (
									<p
										className="uppercase font-sm my-1 -mx-1 p-1 px-2 font-bold text-orange-500"
										dangerouslySetInnerHTML={{ __html: "&nbsp;&nbsp;&nbsp;&nbsp;".repeat((depth - 1) * 2) + group }}
									/>
								)}
								{object[key].map(elem => (
									<p
										onClick={handlePlaceholderClick}
										data-value={`${prefix ? prefix + "." : ""}${elem}`}
										className="p-2 rounded-md hover:bg-gray-900 cursor-pointer transition duration-250"
										dangerouslySetInnerHTML={{
											__html: `${depth !== 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;".repeat((depth - 1) * 2) : ""}${elem}`
										}}
									/>
								))}
							</>
						);
					}

					return formatPlaceholders(object[key], key, `${prefix ? prefix + "." : ""}${key}`, depth + 1);
				})}
			</>
		);
	};

	return (
		<div className="flex items-center text-white flex-grow flex-col">
			<div className="mb-12 mt-12">
				<h1 className="font-extrabold text-6xl mb-2">
					🦊
				</h1>
				<h1 className="font-extrabold text-4xl mb-2">
					GitLab Webhook Handler
				</h1>
				<p className="text-lg font-bold">
					An intermediary for GitLab webhook events to provide rich Discord notifications.
				</p>
			</div>

			<div className="mb-12 w-full max-w-6xl">
				<div className="flex justify-between flex-wrap gap-4 mb-4">
					<div className="flex gap-2 items-center">
						<h3 className="font-extrabold select-text text-xl p-1 px-2 rounded-lg bg-gray-800 bg-opacity-75">
							<span className="filter blur-sm hover:blur-none transition duration-250">
								{handler.id}
							</span>
						</h3>
						<p className={`${handler.enabled ? "bg-green-600" : "bg-red-500"} text-sm font-bold uppercase rounded-lg p-2 px-3`}>
							{handler.enabled ? "Enabled" : "Disabled"}
						</p>
					</div>
					<div className="flex gap-2 flex-wrap">
						<Button
							text="Copy Event URL"
							iconLeft={copyIcon}
							onClick={handleCopyEventUrl}
							className={`
								bg-orange-500 flex items-center justify-center disabled:cursor-not-allowed
								font-bold p-2 px-4 hover:bg-orange-600 rounded-lg w-full sm:w-auto
							`}
						/>
						<Button
							text="Send Test Notification"
							iconLeft={<PaperAirplaneIcon className="h-5 w-5 mr-2 inline-block" />}
							loading={testLoading}
							onClick={handleTestHandler}
							className={`
								bg-orange-500 flex items-center justify-center disabled:cursor-not-allowed
								font-bold p-2 px-4 hover:bg-orange-600 rounded-lg w-full sm:w-auto
							`}
						/>
						<Button
							text={handler.enabled ? "Disable" : "Enable"}
							iconLeft={<FingerPrintIcon className="h-5 w-5 mr-2 inline-block" />}
							loading={toggleLoading}
							onClick={handleToggleHandler}
							className={`
								bg-orange-500 flex items-center justify-center disabled:cursor-not-allowed
								font-bold p-2 px-4 hover:bg-orange-600 rounded-lg w-full sm:w-auto
							`}
						/>
						<Button
							text="Delete Handler"
							iconLeft={<TrashIcon className="h-5 w-5 mr-2 inline-block" />}
							onClick={() => setDeleteModalOpen(true)}
							className={`
								bg-red-500 flex items-center justify-center disabled:cursor-not-allowed
								font-bold p-2 px-4 hover:bg-red-600 rounded-lg w-full sm:w-auto
							`}
						/>
					</div>
				</div>

				<div className="w-full flex gap-2 items-center bg-purple-500 p-2 px-3 rounded-lg mb-4">
					<ShieldExclamationIcon className="w-6 h-6 text-white flex-shrink-0" />
					<p className="font-bold text-left">
						Make sure to keep your handler token secure.
						Anyone with this token can modify your handler.
					</p>
				</div>

				<div className="flex flex-wrap gap-2 w-full sm:w-auto">
					<input
						type="text" placeholder="Discord Webhook URL"
						defaultValue={handler.discordUrl}
						ref={discordUrlRef} className={`
							focus:outline-none disabled:bg-gray-900 focus:border-orange-500 rounded-lg border-2
							bg-black p-1 px-2 w-full sm:w-auto sm:flex-grow disabled:cursor-not-allowed border-gray-700
							transition duration-250
						`}
					/>
					<Button
						text="Update Discord Webhook URL" loading={discordUrlLoading}
						iconLeft={<CogIcon className="h-5 w-5 mr-2 inline-block" />}
						onClick={handleUpdateDiscordUrl} className={`
							bg-orange-500 flex items-center justify-center disabled:cursor-not-allowed
							font-bold p-2 px-4 hover:bg-orange-600 rounded-lg w-full sm:w-auto
						`}
					/>
				</div>
			</div>

			<div className="mb-12 w-full max-w-6xl">
				<h4 className="text-xl font-bold text-left">
					Event Settings
				</h4>
				<p className="mb-4 italic text-sm text-left">
					Need help setting up templates? Click{" "}
					<a href="/docs" target="_blank" className="font-bold text-orange-500">
						here
					</a>
					{" "}for more information.
				</p>

				<div className="grid grid-cols-3 grid-flow-col gap-4">
					<div className="w-full">
						<Select
							items={types}
							label="Event Type"
							selectedItem={selectedType}
							setSelectedItem={(type) => {
								setSelectedType(type);
								setCursorPosition(handler.templates[type.value]
									? handler.templates[type.value].length
									: 0
								);
							}}
						/>

						<Button
							text="Save Changes" loading={templateLoading}
							onClick={handleSaveTemplate}
							iconLeft={<DatabaseIcon className="h-5 w-5 mr-2 inline-block" />}
							className={`
								bg-orange-500 flex items-center justify-center disabled:cursor-not-allowed
								font-bold p-2 px-4 mt-4 hover:bg-orange-600 rounded-lg w-full
							`}
						/>

						<div className="rounded-lg mt-4 bg-black border-2 border-gray-700">
							<div className="p-1 border-b-2 border-gray-700">
								<p className="font-bold">Placeholders</p>
							</div>
							<div className="text-left max-h-96 p-1 leading-tight text-sm overflow-y-auto">
								{formatPlaceholders(selectedType.placeholders)}
							</div>
						</div>
					</div>
					<div className="col-span-2 w-full">
						<textarea
							className={`
								p-3 w-full font-mono resize-none h-full rounded-lg text-sm transition duration-250
								bg-black focus:outline-none border-2 border-gray-700 focus:border-orange-500
							`}
							onChange={handleUpdateTemplate}
							onKeyUp={handleCursorUpdate}
							onClick={handleCursorUpdate}
							onInput={handleCursorUpdate}
							spellCheck={false}
							value={handler.templates[selectedType.value]
								? handler.templates[selectedType.value]
								: ""
							}
							placeholder="Enter your template here..."
						/>
					</div>
				</div>
			</div>

			<Transition appear show={deleteModalOpen} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto select-none" onClose={() => setDeleteModalOpen(false)}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="bg-black opacity-0"
							enterTo="bg-black opacity-50"
							entered="bg-black opacity-50"
							leave="ease-in duration-200"
							leaveFrom="bg-black opacity-50"
							leaveTo="bg-black opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0" />
						</Transition.Child>
						<span className="inline-block h-screen align-middle" aria-hidden="true">
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div className={`
								inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle
								transition-all transform bg-gray-900 shadow-xl rounded-2xl
							`}>
								<Dialog.Title as="h3" className="text-lg font-bold text-white">
									Delete Handler
								</Dialog.Title>
								<div className="mt-2">
									<p className="font-medium text-gray-100 mb-4">
										Are you sure? This action cannot be undone.
									</p>

									<div className="flex flex-wrap gap-2">
										<Button
											text="Delete Handler"
											onClick={handleDeleteHandler} loading={deleteLoading}
											iconLeft={<TrashIcon className="h-5 w-5 mr-2 inline-block flex-shrink-0" />}
											className={`
												bg-red-500 flex items-center justify-center disabled:cursor-not-allowed
												font-bold p-2 px-4 hover:bg-red-600 rounded-lg w-full sm:w-auto text-white
											`}
										/>
										<Button
											text="Cancel"
											onClick={() => setDeleteModalOpen(false)}
											className={`
												bg-gray-700 flex items-center justify-center disabled:cursor-not-allowed
												font-bold p-2 px-4 hover:bg-gray-600 rounded-lg w-full sm:w-auto text-white
											`}
										/>
									</div>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default Handler;
