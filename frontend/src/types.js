export const types = [
	{
		name: "Push",
		value: "push",
		placeholders: {
			_: ["eventName", "ref", "totalCommitsCount", "commits"],
			sha: {
				_: ["before", "after", "checkout"]
			},
			user: {
				_: ["id", "name", "username", "email", "avatar"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Tag Push",
		value: "tag_push",
		placeholders: {
			_: ["eventName", "ref", "totalCommitsCount", "commits", "message"],
			sha: {
				_: ["before", "after", "checkout"]
			},
			user: {
				_: ["id", "name", "username", "email", "avatar"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Issue",
		value: "issues",
		placeholders: {
			_: [
				"eventName", "title", "description", "createdDate", "updatedDate", "closedDate",
				"dueDate", "id", "state", "severity", "url", "assignees", "labels"
			],
			user: {
				_: ["id", "name", "username", "avatar", "email"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Confidential Issue",
		value: "confidential_issues",
		placeholders: {
			_: [
				"eventName", "title", "description", "createdDate", "updatedDate", "closedDate",
				"dueDate", "id", "state", "severity", "url", "assignees", "labels"
			],
			user: {
				_: ["id", "name", "username", "avatar", "email"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Comment",
		value: "note",
		placeholders: {
			_: ["eventName", "createdDate", "updatedDate", "resolvedDate", "note", "noteableType", "url"],
			user: {
				_: ["id", "name", "username", "avatar", "email"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Confidential Comment",
		value: "confidential_note",
		placeholders: {
			_: ["eventName", "createdDate", "updatedDate", "resolvedDate", "note", "noteableType", "url"],
			user: {
				_: ["id", "name", "username", "avatar", "email"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Merge Request",
		value: "merge_requests",
		placeholders: {
			_: [
				"eventName", "title", "description", "createdDate", "updatedDate", "id", "state",
				"workInProgress", "mergeStatus", "sourceBranch", "targetBranch", "url", "assignees", "labels"
			],
			user: {
				_: ["id", "name", "username", "avatar", "email"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Job",
		value: "job",
		placeholders: {
			_: ["ref", "tag", "stage", "name", "status", "duration", "queueDuration", "createdAt", "startedAt", "finishedAt"],
			sha: {
				_: ["before", "after"]
			},
			urls: {
				_: ["pipeline", "job"]
			},
			user: {
				_: ["id", "name", "username", "email", "avatar"]
			},
			project: {
				_: ["id", "name", "description"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			},
			runner: {
				_: ["id", "description", "type", "active", "shared", "tags"]
			}
		}
	},
	{
		name: "Pipeline",
		value: "pipeline",
		placeholders: {
			_: [
				"id", "ref", "tag", "source", "status", "detailedStatus",
				"stages", "createdAt", "finishedAt", "duration", "queueDuration"
			],
			sha: {
				_: ["before", "after"]
			},
			user: {
				_: ["id", "name", "username", "email", "avatar"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			},
			commit: {
				_: ["id", "title", "message", "timestamp", "url"],
				author: {
					_: ["name", "email"]
				}
			}
		}
	},
	{
		name: "Wiki Page",
		value: "wiki_page",
		placeholders: {
			_: ["slug", "title", "format", "content", "action"],
			urls: {
				_: ["page", "diff"]
			},
			user: {
				_: ["id", "name", "username", "email", "avatar"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			},
			wiki: {
				_: ["defaultBranch"],
				urls: {
					_: ["web", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Feature Flag",
		value: "feature_flag",
		placeholders: {
			_: ["id", "name", "description", "active"],
			user: {
				_: ["id", "name", "username", "email", "avatar"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			}
		}
	},
	{
		name: "Release",
		value: "release",
		placeholders: {
			_: ["id", "description", "name", "tag", "url", "action", "createdAt", "releasedAt"],
			assets: {
				_: ["count", "links", "sources"]
			},
			project: {
				_: ["id", "name", "description", "avatar", "namespace", "defaultBranch"],
				urls: {
					_: ["repository", "gitSsh", "gitHttp"]
				}
			},
			commit: {
				_: ["id", "title", "message", "timestamp", "url"],
				author: {
					_: ["name", "email"]
				}
			}
		}
	},
	{
		name: "Commits (Push)",
		value: "push.commits",
		type: "array",
		placeholders: {
			_: ["id", "message", "title", "timestamp", "url"],
			author: {
				_: ["name", "email"]
			},
			files: {
				_: ["added", "modified", "removed"]
			}
		}
	},
	{
		name: "Commits (Tag Push)",
		value: "tag_push.commits",
		type: "array",
		placeholders: {
			_: ["id", "message", "title", "timestamp", "url"],
			author: {
				_: ["name", "email"]
			},
			files: {
				_: ["added", "modified", "removed"]
			}
		}
	},
	{
		name: "Added Files (Commit) (Push)",
		value: "push.commits.files.added",
		type: "array",
		placeholders: {
			_: ["value"]
		}
	},
	{
		name: "Added Files (Commit) (Tag Push)",
		value: "tag_push.commits.files.added",
		type: "array",
		placeholders: {
			_: ["value"]
		}
	},
	{
		name: "Modified Files (Commit) (Push)",
		value: "push.commits.files.modified",
		type: "array",
		placeholders: {
			_: ["value"]
		}
	},
	{
		name: "Modified Files (Commit) (Tag Push)",
		value: "tag_push.commits.files.modified",
		type: "array",
		placeholders: {
			_: ["value"]
		}
	},
	{
		name: "Removed Files (Commit) (Push)",
		value: "push.commits.files.removed",
		type: "array",
		placeholders: {
			_: ["value"]
		}
	},
	{
		name: "Removed Files (Commit) (Tag Push)",
		value: "tag_push.commits.files.removed",
		type: "array",
		placeholders: {
			_: ["value"]
		}
	},
	{
		name: "Assignees (Issue)",
		value: "issue.assignees",
		type: "array",
		placeholders: {
			_: ["id", "name", "username", "email", "avatar"]
		}
	},
	{
		name: "Labels (Issue)",
		value: "issue.labels",
		type: "array",
		placeholders: {
			_: ["title", "colour"]
		}
	},
	{
		name: "Assignees (Confidential Issue)",
		value: "confidential_issue.assignees",
		type: "array",
		placeholders: {
			_: ["id", "name", "username", "email", "avatar"]
		}
	},
	{
		name: "Labels (Confidential Issue)",
		value: "confidential_issue.labels",
		type: "array",
		placeholders: {
			_: ["title", "colour"]
		}
	},
	{
		name: "Assignees (Merge Request)",
		value: "merge_request.assignees",
		type: "array",
		placeholders: {
			_: ["id", "name", "username", "email", "avatar"]
		}
	},
	{
		name: "Labels (Merge Request)",
		value: "merge_request.labels",
		type: "array",
		placeholders: {
			_: ["title", "colour"]
		}
	},
	{
		name: "Asset Links (Release)",
		value: "release.assets.links",
		type: "array",
		placeholders: {
			_: ["id", "external", "type", "name", "url"]
		}
	},
	{
		name: "Sources (Release)",
		value: "release.assets.sources",
		type: "array",
		placeholders: {
			_: ["format", "url"]
		}
	}
];
