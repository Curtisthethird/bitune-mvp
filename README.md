# BitTune Artist Alpha

Working founder alpha with artist signup/login, password hashing, cookie sessions, artist dashboard, audio/artwork upload, rights attestation, catalog pages, real browser audio playback, 60-second Proof of Engagement, replay protection, signed receipts, and persistent simulated-sat artist balances.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000 and create an artist account.

## Important production boundary
This is a functional alpha, not yet a safe public-money production system. Local JSON/file persistence is intentionally used so the entire vertical slice runs without external credentials. Before public deployment replace it with managed Postgres/object storage, add email verification/recovery, rate limiting, malware scanning/transcoding, CSRF protections, server-authoritative playback telemetry/fraud scoring, observability/backups, and independently review the security/payment path. Real BTC/Lightning settlement remains disabled.
