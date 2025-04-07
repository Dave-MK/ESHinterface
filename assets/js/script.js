const API_KEY = "GK-xmWQAWSHFxxoixMQNq8WfjRs";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
	let optArray = [];

	for (let entry of form.entries()) {
		if (entry[0] === "options") {
			optArray.push(entry[1]);
		}
	}
	form.delete("options");
	form.append("options", optArray.join());
	return form;
}

async function getStatus(e) {
	const queryString = `${API_URL}?api_key=${API_KEY}`;
	const response = await fetch(queryString);
	const data = await response.json();

	if (response.ok) {
		displayStatus(data);
	} else {
		displayException(data);
		throw new Error(data.error);
	}
}

function displayStatus(data) {
	const modalHeader = document.getElementById("resultsModalTitle");
	const modalBody = document.getElementById("results-content");

	modalHeader.innerText = "API Key Status";
	modalBody.innerHTML = `<div class="modal-body">Your key is valid until <p>${data.expiry}.</p></div>`;

	resultsModal.show();
}

async function postForm(e) {
	const form = processOptions(new FormData(document.getElementById("checksform")));

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Authorization": API_KEY,
		},
		body: form,
	})

	const data = await response.json();

	if (response.ok) {
		displayErrors(data);
	} else {
		displayException(data);
		throw new Error(data.error);
	}
}

function displayErrors(data) {
	let heading = `JSHint Results for ${data.file}`;

	if (data.total_errors === 0) {
		results = `<div class="no_errors">No errors found!</div>`;
	} else {
		results = `<div>Total Errors found: <span class="error_count">${data.total_errors}</span></div>`;
		for (let error of data.error_list) {
			results += `<div>At line <span class="line">${error.line}</span>, `;
			results += `column <span class="column">${error.col}</span></div>`;
			results += `<div class="error">${error.error}</div>`;
		}
	}
	document.getElementById("resultsModalTitle").innerText = heading;
	document.getElementById("results-content").innerHTML = results;

	resultsModal.show();
}

function displayException(data) {
	let heading = `An Exception Occurred`;
	result = `<div>The API returned status code: ${data.status_code}</div>`;
	result += `<div>Error Number: <strong>${data.error_no}</strong></div>`;
	result += `<div>Error Text: <strong>${data.error}</strong></div>`;

	document.getElementById("resultsModalTitle").innerText = heading;
	document.getElementById("results-content").innerHTML = result;

	resultsModal.show();
}