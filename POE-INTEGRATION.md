# Cryptographic PoE integration

The protocol implementation is complete and provider-free.

On the track listening page, import:

`import PoeInspector from "@/components/PoeInspector";`

Ensure the audio element has `id="bitune-audio"` and render:

`<PoeInspector contentId={track.id} />`

The browser creates an ephemeral P-256 ECDSA key pair. The private key is non-exportable and remains inside Web Crypto. Every ~5 seconds the client signs a heartbeat containing content/session IDs, sequence, playback position/rate, volume, visibility, playing state, timestamp, and nonce.

The server derives the decentralized listener ID from the public key, verifies the signature and identity, prevents nonce replay, enforces sequence/monotonic progression, checks client/server clock skew, active playback, volume, visibility, playback rate and timing continuity, and only then credits verified seconds.

This is still an alpha: the session/nonces are in-memory, so production requires persistent transactional storage. Browser telemetry is evidence, not proof of a physical human; stronger liveness/device attestation can be layered on later.
