# BitTune Free-Build Beta Plan

## Implemented locally with no paid services
- Artist signup/login/logout with hashed passwords and HTTP-only session cookies.
- Protected artist dashboard.
- Audio and artwork uploads to local storage with type/size validation.
- Rights attestation before publishing.
- Public track listening pages using uploaded audio.
- 60-second Proof-of-Engagement qualification.
- Duplicate session claim protection.
- Signed HMAC PoE receipts.
- Simulated sat ledger and artist analytics.
- Public Discover catalog.
- Artist profile route/scaffold.
- Automated PoE unit tests and strict TypeScript configuration.

## Built interfaces / next connection points (still $0 to code)
- PostgreSQL repository adapter to replace JSON storage.
- Object-storage adapter to replace /public/uploads.
- Email verification/password-reset provider adapter.
- Lightning settlement adapter (must remain disabled until funded/tested/audited).
- Stacks batch-anchor adapter.
- Nostr identity/event adapter.
- Fraud/rate-limit adapter and server-side playback heartbeat design.

## Requires external infrastructure or human review before public production
- Durable hosted database and object storage.
- Production email delivery/domain configuration.
- Real Lightning liquidity/funds and secure node/provider credentials.
- Production secrets/key management.
- Malware/media scanning and transcoding workers.
- Independent security review, payment review, music-rights/DMCA/privacy/legal review.
- Load testing against the actual deployment environment.

## Safety rule
Real BTC settlement is intentionally disabled. Never put seed phrases or private keys in source code or chat.
