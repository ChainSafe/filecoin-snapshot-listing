import { type Env, getBucketListingObj, getBucketObjects } from './buckets';
import { do_listing_v2 } from './listings';
import { fetch_file } from './files';
import { renderSnapshotsHomePage } from './templates';

function handleListingWithPagination(env: Env, bucket: R2Bucket, prefix: string, title: string, url: URL) {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const searchQuery = url.searchParams.get('search') || undefined;

	// Validate parameters
	const validLimit = Math.min(Math.max(limit, 1), 100); // Between 1 and 100
	const validOffset = Math.max(offset, 0); // Non-negative

	return do_listing_v2(env, bucket, prefix, title, validLimit, validOffset, searchQuery);
}

// noinspection JSUnusedGlobalSymbols
export default {
	async fetch(request: Request, env: Env) {
		switch (request.method) {
			case 'HEAD':
			case 'GET': {
				const url = new URL(request.url);
				const { pathname } = url;

				if (pathname.startsWith('/archive/')) {
					const [, , bucketType, ...filePathParts] = pathname.split('/');
					const filePath = filePathParts.join('/');
					const bucket = getBucketListingObj(bucketType, env);
					return fetch_file(bucket, filePath, request); // Pass the request object here
				}

				if (pathname.startsWith('/latest/')) {
					const [, chain] = pathname.split('/');
					const bucket = env.SNAPSHOT_ARCHIVE;
					const result = await getBucketObjects(bucket, `${chain}/latest/`, true);

					return fetch_file(bucket, result.objects[0].key, request);
				}

				if (pathname.startsWith('/latest-v1/')) {
					const [, chain] = pathname.split('/');
					const bucket = env.SNAPSHOT_ARCHIVE_V2;
					const result = await getBucketObjects(bucket, `${chain}/latest-v1/`, true);

					return fetch_file(bucket, result.objects[0].key, request);
				}

				if (pathname.startsWith('/latest-v2/')) {
					const [, chain] = pathname.split('/');
					const bucket = env.SNAPSHOT_ARCHIVE_V2;
					const result = await getBucketObjects(bucket, `${chain}/latest-v2/`, true);

					return fetch_file(bucket, result.objects[0].key, request);
				}

				switch (pathname) {
					case '/': {
						return new Response(renderSnapshotsHomePage(), { headers: { 'content-type': 'text/html' } });
					}
					case '/list':
					case '/list/': {
						return new Response(renderSnapshotsHomePage(), { headers: { 'content-type': 'text/html' } });
					}

					case '/list/calibnet/latest-v2':
						return handleListingWithPagination(
							env,
							env.SNAPSHOT_ARCHIVE_V2,
							'calibnet/latest-v2',
							'Calibnet Latest Snapshots (F3) (last 14 days)',
							url,
						);
					case '/list/calibnet/latest-v1':
						return handleListingWithPagination(
							env,
							env.SNAPSHOT_ARCHIVE_V2,
							'calibnet/latest-v1',
							'Calibnet Legacy Snapshots (last 14 days)',
							url,
						);
					case '/list/calibnet/diff':
						return handleListingWithPagination(env, env.FOREST_ARCHIVE, 'calibnet/diff', 'Calibnet Diff Snapshots Archive', url);
					case '/list/calibnet/lite':
						return handleListingWithPagination(env, env.FOREST_ARCHIVE, 'calibnet/lite', 'Calibnet Lite Snapshots Archive', url);

					case '/list/mainnet/latest-v2':
						return handleListingWithPagination(
							env,
							env.SNAPSHOT_ARCHIVE_V2,
							'mainnet/latest-v2',
							'Mainnet Latest Snapshots (F3) (last 14 days)',
							url,
						);
					case '/list/mainnet/latest-v1':
						return handleListingWithPagination(
							env,
							env.SNAPSHOT_ARCHIVE_V2,
							'mainnet/latest-v1',
							'Mainnet Legacy Snapshots (last 14 days)',
							url,
						);
					case '/list/mainnet/diff':
						return handleListingWithPagination(env, env.FOREST_ARCHIVE, 'mainnet/diff', 'Mainnet Diff Snapshots Archive', url);
					case '/list/mainnet/lite':
						return handleListingWithPagination(env, env.FOREST_ARCHIVE, 'mainnet/lite', 'Mainnet Lite Snapshots Archive', url);
					default:
						return env.ASSETS.fetch(request);
				}
			}
			default: {
				return new Response('Method not allowed', {
					status: 405,
					headers: {
						Allow: 'GET, HEAD',
					},
				});
			}
		}
	},
};
