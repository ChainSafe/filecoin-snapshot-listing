import type { Env } from './buckets';
import { getBucketListingName, getBucketObjects } from './buckets';
import { renderListingPageTemplate, renderSnapshotCardTemplate, renderPaginationTemplate } from './templates';
import { formatFileSize } from './utils';

export async function do_listing_v2(
	env: Env,
	bucket: R2Bucket,
	prefix: string,
	title: string = 'Filecoin Snapshots 14 days Archive',
	limit: number = 20,
	offset: number = 0,
	searchQuery?: string,
) {
	const result = await getBucketObjects(bucket, prefix, false, limit, offset, searchQuery);
	const { objects: listedObjects, totalCount, hasMore } = result;

	// build HTML with Tailwind
	let bodyContent = `
  <div id="snapshotGrid" class="flex flex-col gap-4">
`;

	for (const obj of listedObjects) {
		if (!obj.key.endsWith('.car.zst')) continue;

		const base = `/archive/${getBucketListingName(bucket, env)}/${obj.key}`;
		const fileSize = formatFileSize(obj.size);

		bodyContent += renderSnapshotCardTemplate(obj.key, base, fileSize, obj.uploaded);
	}

	bodyContent += `</div>`;

	// Add pagination controls
	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.ceil(totalCount / limit);
	const hasPrevious = offset > 0;
	const hasNext = hasMore;
	const prevOffset = Math.max(0, offset - limit);
	const nextOffset = offset + limit;

	// Generate page numbers
	const startPage = Math.max(1, currentPage - 2);
	const endPage = Math.min(totalPages, currentPage + 2);
	let pageNumbers = '';

	for (let page = startPage; page <= endPage; page++) {
		const pageOffset = (page - 1) * limit;
		const isCurrentPage = page === currentPage;
		pageNumbers += `
			<button onclick="goToPage(${pageOffset})"
					class="px-4 py-2 ${isCurrentPage ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' : 'bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white'} rounded-xl transition-all duration-300 font-medium">
				${page}
			</button>
		`;
	}

	const paginationHtml = renderPaginationTemplate(
		offset + 1,
		Math.min(offset + limit, totalCount),
		totalCount,
		searchQuery,
		limit,
		hasPrevious,
		prevOffset,
		pageNumbers,
		hasNext,
		nextOffset,
	);

	bodyContent += paginationHtml;

	const html = renderListingPageTemplate(title, bodyContent, searchQuery);

	return new Response(html, {
		headers: {
			'content-type': 'text/html;charset=UTF-8',
		},
	});
}
