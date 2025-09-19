// @ts-expect-error importing .txt files is not supported by TypeScript
import listingHtml from 'templates/listing.html.txt';
// @ts-expect-error importing .txt files is not supported by TypeScript
import homeHtml from 'templates/home.html.txt';
// @ts-expect-error importing .txt files is not supported by TypeScript
import cardHtml from 'templates/card.html.txt';
// @ts-expect-error importing .txt files is not supported by TypeScript
import paginationHtml from 'templates/pagination.html.txt';

export function renderListingPageTemplate(title: string, bodyContent: string, searchQuery?: string): string {
	return listingHtml
		.replaceAll('{{title}}', title)
		.replace('{{bodyContent}}', bodyContent)
		.replace('{{searchValue}}', searchQuery || '');
}

export function renderSnapshotCardTemplate(key: string, base: string, fileSize: string, uploaded: Date): string {
	return cardHtml
		.replaceAll('{{key}}', key)
		.replaceAll('{{base}}', base)
		.replaceAll('{{fileSize}}', fileSize)
		.replaceAll('{{uploaded}}', uploaded.toLocaleString('en-US', { timeZone: 'UTC', hour12: false }));
}

export function renderSnapshotsHomePage(): string {
	return homeHtml;
}

export function renderPaginationTemplate(
	startItem: number,
	endItem: number,
	totalCount: number,
	searchQuery?: string,
	limit: number = 20,
	hasPrevious: boolean = false,
	previousOffset: number = 0,
	pageNumbers: string = '',
	hasNext: boolean = false,
	nextOffset: number = 0,
): string {
	const searchInfo = searchQuery ? ` (filtered by "${searchQuery}")` : '';

	const limit10Selected = limit === 10 ? 'selected' : '';
	const limit20Selected = limit === 20 ? 'selected' : '';
	const limit50Selected = limit === 50 ? 'selected' : '';
	const limit100Selected = limit === 100 ? 'selected' : '';

	const previousButton = hasPrevious
		? `<button onclick="goToPage(${previousOffset})" class="px-4 py-2 bg-gray-800/50 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white transition-all duration-300 flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
			</svg>
			Previous
		</button>`
		: '';

	const nextButton = hasNext
		? `<button onclick="goToPage(${nextOffset})" class="px-4 py-2 bg-gray-800/50 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white transition-all duration-300 flex items-center gap-2">
			Next
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
			</svg>
		</button>`
		: '';

	return paginationHtml
		.replace('{{startItem}}', startItem.toString())
		.replace('{{endItem}}', endItem.toString())
		.replace('{{totalCount}}', totalCount.toString())
		.replace('{{searchInfo}}', searchInfo)
		.replace('{{limit10Selected}}', limit10Selected)
		.replace('{{limit20Selected}}', limit20Selected)
		.replace('{{limit50Selected}}', limit50Selected)
		.replace('{{limit100Selected}}', limit100Selected)
		.replace('{{previousButton}}', previousButton)
		.replace('{{pageNumbers}}', pageNumbers)
		.replace('{{nextButton}}', nextButton);
}
