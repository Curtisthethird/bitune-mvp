# BitTune Beta Architecture
Browser/mobile -> Next.js API -> Auth -> Catalog/Media -> Playback telemetry -> Fraud scorer -> PoE receipt -> Artist ledger.
Adapters isolate external infrastructure: ObjectStorage, Mailer, LightningSettlement, ChainAnchor (Stacks), SocialPublisher (Nostr). Local/simulated adapters cost $0 and let the full control flow be tested before credentials or money are connected.
PostgreSQL target schema is in `lib/db/schema.sql`. Merkle roots allow batches of receipt signatures to be anchored later without putting every listen on-chain.
