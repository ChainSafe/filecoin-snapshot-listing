// eslint-disable-next-line @typescript-eslint/no-unused-vars
function performSearch() {
	const query = document.getElementById('searchBox').value;
	const url = new URL(window.location);

	if (query.trim()) {
		url.searchParams.set('search', query);
	} else {
		url.searchParams.delete('search');
	}

	// Reset to first page when searching
	url.searchParams.set('offset', '0');

	window.location.href = url.toString();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function goToPage(offset) {
	const url = new URL(window.location);
	url.searchParams.set('offset', offset);
	// Preserve search parameter
	window.location.href = url.toString();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeLimit(newLimit) {
	const url = new URL(window.location);
	url.searchParams.set('limit', newLimit);
	url.searchParams.set('offset', '0'); // Reset to first page
	// Preserve search parameter
	window.location.href = url.toString();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function revealSha(button) {
	const card = button.closest('.snapshot-card');
	const pre = card.querySelector('.sha256-content');
	const isHidden = pre.classList.contains('hidden');
	if (isHidden) {
		const errMessage = 'Snapshot is not validated yet';
		try {
			let resp = await fetch(button.dataset.sha256Url);
			if (!resp.ok) {
				// Try again with an old format
				resp = await fetch(button.dataset.sha256Url.replace('.zst', ''));
			}
			let sha256sum = await resp.text();
			pre.textContent = resp.ok ? sha256sum.split(' ')[0] : errMessage;
		} catch {
			pre.textContent = errMessage;
		}
		pre.classList.remove('hidden');
	} else {
		pre.classList.add('hidden');
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function revealMeta(button) {
	const card = button.closest('.snapshot-card');
	const pre = card.querySelector('.meta-content');
	const isHidden = pre.classList.contains('hidden');
	const errMessage = 'Metadata is not available in this version';
	if (isHidden) {
		try {
			const resp = await fetch(button.dataset.metaUrl);
			const json = await resp.json();
			pre.textContent = resp.ok ? JSON.stringify(json['Snapshot'], null, 2) : errMessage;
		} catch {
			pre.textContent = errMessage;
		}
		pre.classList.remove('hidden');
	} else {
		pre.classList.add('hidden');
	}
}
