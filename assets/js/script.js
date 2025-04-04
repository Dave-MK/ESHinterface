const API_KEY = "GK-xmWQAWSHFxxoixMQNq8WfjRs";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {
	const queryString = `${API_URL}?api_key=${API_KEY}`;
	const response = await fetch(queryString);
	const data = await response.json();

	if (response.ok) {
		displayStatus(data);
	} else {
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