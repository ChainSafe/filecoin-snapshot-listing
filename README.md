# Filecoin Snapshot listing worker

This worker acts on endpoints at `https://forest-archive.chainsafe.dev/**`
and will list object `latest` prefixes for both chains.

## Environments

The project supports multiple environments for different deployment scenarios:

- **Production** (`--env production`): Main production deployment
- **Preview** (`--env preview`): Preview environment for testing changes

## Local Development

First, login to Cloudflare with `wrangler login`.

### Preview Environment

```bash
npm run preview
# or
wrangler dev --remote --env preview
```

## Deployment

### Production Deployment

```bash
npm run deploy
# or
wrangler deploy --env production
```

### Preview Deployment

```bash
npm run deploy:preview
# or
wrangler deploy --env preview
```

## Environment Configuration

Each environment uses the same R2 buckets but with different worker names and
logging configurations:

- **Production**: `infra-team-filecoin-snapshot-listing` with 10% log sampling
- **Preview**: `filecoin-snapshot-listing-preview` with 100% log sampling

Merging changes to this worker will automatically deploy them to production.
