/* eslint-disable no-undef */
// noinspection JSUnresolvedVariable

import { Router } from "itty-router";
import { v4 as uuidV4 } from "uuid";
import { version } from "../package.json";
import {
	formatTemplate,
	injectCorsHeaders,
	jsonResponse,
	transformGitLabEvent,
	validateIdFormat
} from "./utils";

const router = Router();

router.get("/", injectCorsHeaders, async ({ cors, cf }) => {
	return jsonResponse({
		error: false,
		version: "🦊 GitLab Webhook Handler v" + version,
		servedFrom: cf.colo
	}, {
		status: 200,
		headers: cors
	});
});

router.get("/:id", injectCorsHeaders, validateIdFormat, async ({ cors, params }) => {
	let { id } = params;

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	return jsonResponse({
		error: false,
		status: 200,
		handler
	}, {
		status: 200,
		headers: cors
	});
});
router.delete("/:id", injectCorsHeaders, validateIdFormat, async ({ cors, params }) => {
	let { id } = params;

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	await KV.delete(`handler:${id}`);

	return jsonResponse({
		error: false,
		status: 200,
		message: "Handler deleted successfully"
	}, {
		status: 200,
		headers: cors
	});
});

router.patch("/:id/enable", injectCorsHeaders, validateIdFormat, async ({ cors, params }) => {
	let { id } = params;

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	if (handler.enabled) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "Handler is already enabled"
		}, {
			status: 400,
			headers: cors
		});
	}

	handler.enabled = true;

	await KV.put(`handler:${id}`, JSON.stringify(handler));

	return jsonResponse({
		error: false,
		status: 200,
		handler
	}, {
		status: 200,
		headers: cors
	});
});
router.patch("/:id/disable", injectCorsHeaders, validateIdFormat, async ({ cors, params }) => {
	let { id } = params;

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	if (!handler.enabled) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "Handler is already disabled"
		}, {
			status: 400,
			headers: cors
		});
	}

	handler.enabled = false;

	await KV.put(`handler:${id}`, JSON.stringify(handler));

	return jsonResponse({
		error: false,
		status: 200,
		handler
	}, {
		status: 200,
		headers: cors
	});
});
router.patch("/:id/discord", injectCorsHeaders, validateIdFormat, async request => {
	let { id } = request.params;
	let body;

	try {
		body = await request.json();
	} catch (_) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "The request body was malformed"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let { discordUrl } = body;

	if (!discordUrl) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "A Discord webhook URL must be provided"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	if (!discordUrl.startsWith("http://") && !discordUrl.startsWith("https://")) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "Discord webhook URL was invalid"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	handler.discordUrl = discordUrl;

	await KV.put(`handler:${id}`, JSON.stringify(handler));

	return jsonResponse({
		error: false,
		status: 200,
		handler
	}, {
		status: 200,
		headers: request.cors
	});
});
router.patch("/:id/templates", injectCorsHeaders, validateIdFormat, async request => {
	let { id } = request.params;
	let body;

	try {
		body = await request.json();
	} catch (_) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "The request body was malformed"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let { type, template } = body;

	if (!type) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "A template type must be provided"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	if (template)
		handler.templates[type] = template;
	else
		delete handler.templates[type];

	await KV.put(`handler:${id}`, JSON.stringify(handler));

	return jsonResponse({
		error: false,
		status: 200,
		handler
	}, {
		status: 200,
		headers: request.cors
	});
});

router.post("/:id/event", injectCorsHeaders, validateIdFormat, async request => {
	let { id } = request.params;

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: request.cors
		});
	}

	if (!handler.enabled) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "Handler is disabled"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let body;

	try {
		body = await request.json();
	} catch (_) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "The request body was malformed"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let result = transformGitLabEvent(body);

	if (!result) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "Unrecognised event type"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let discordBody = formatTemplate(handler.templates, result, result.eventName);

	try {
		let response = await fetch(handler.discordUrl, {
			method: "POST",
			body: JSON.stringify(JSON.parse(discordBody)),
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (response.ok) {
			return jsonResponse({
				error: false,
				status: 200,
				message: "Event forwarded to Discord successfully!"
			}, {
				status: 200,
				headers: request.cors
			});
		}

		if (response.status === 530) {
			return jsonResponse({
				error: false,
				status: 400,
				message: "The provided Discord webhook URL could not be resolved"
			}, {
				status: 400,
				headers: request.cors
			});
		}

		let responseBody = await response.text();

		return jsonResponse({
			error: false,
			status: 400,
			message: `Request to Discord failed with status code: ${response.status}`,
			body: responseBody
		}, {
			status: 400,
			headers: request.cors
		});
	} catch (_) {
		return jsonResponse({
			error: false,
			status: 400,
			message: "An error occurred whilst sending the event to Discord"
		}, {
			status: 400,
			headers: request.cors
		});
	}
});
router.post("/:id/test", injectCorsHeaders, validateIdFormat, async ({ cors, params }) => {
	let { id } = params;

	let handler = await KV.get(`handler:${id}`, { type: "json" });

	if (!handler) {
		return jsonResponse({
			error: true,
			status: 404,
			message: "A handler could not be found with the token provided"
		}, {
			status: 404,
			headers: cors
		});
	}

	try {
		let response = await fetch(handler.discordUrl, {
			method: "POST",
			body: JSON.stringify({
				embeds: [
					{
						title: "GitLab Webhook Handler - Test Request",
						description: "If you're seeing this, your handler is setup successfully!",
						color: 16552998
					}
				]
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (response.ok) {
			return jsonResponse({
				error: false,
				status: 200,
				message: "Test request sent successfully"
			}, {
				status: 200,
				headers: cors
			});
		}

		if (response.status === 530) {
			return jsonResponse({
				error: false,
				status: 400,
				message: "The provided Discord webhook URL could not be resolved"
			}, {
				status: 400,
				headers: cors
			});
		}

		return jsonResponse({
			error: false,
			status: 400,
			message: `Test request failed with status code: ${response.status}`
		}, {
			status: 400,
			headers: cors
		});
	} catch (_) {
		return jsonResponse({
			error: false,
			status: 400,
			message: "An error occurred whilst sending the test request"
		}, {
			status: 400,
			headers: cors
		});
	}
});

router.post("/create", injectCorsHeaders, async request => {
	let body;

	try {
		body = await request.json();
	} catch (_) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "The request body was malformed"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let { discordUrl } = body;

	if (!discordUrl) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "A Discord webhook URL must be provided"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	if (!discordUrl.startsWith("http://") && !discordUrl.startsWith("https://")) {
		return jsonResponse({
			error: true,
			status: 400,
			message: "Discord webhook URL was invalid"
		}, {
			status: 400,
			headers: request.cors
		});
	}

	let uuid = uuidV4();
	let id = uuid.substr(0, 8);

	let handler = {
		id,
		templates: {},
		discordUrl,
		enabled: true,
		created: new Date().getTime()
	};

	await KV.put(`handler:${id}`, JSON.stringify(handler));

	return jsonResponse({
		error: false,
		status: 200,
		handler
	}, {
		status: 200,
		headers: request.cors
	});
});

router.options("*", injectCorsHeaders, async ({ cors }) => {
	return new Response(null, {
		status: 200,
		headers: cors
	});
});
router.all("*", injectCorsHeaders, async ({ cors }) => {
	return jsonResponse({
		error: true,
		code: 404,
		message: "Not Found"
	}, {
		status: 404,
		headers: cors
	});
});

addEventListener("fetch", event => {
	event.respondWith(router.handle(event.request).catch(((err) => {
		let payload = {
			error: true,
			code: 500,
			message: "Internal Server Error"
		};

		if (ENV === "dev")
			payload.stack = err.stack;

		console.log(err.stack);

		return jsonResponse(payload, {
			status: 500,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
			}
		});
	})));
});
