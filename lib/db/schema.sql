-- PostgreSQL target schema. The app can keep running locally before a paid/hosted DB is connected.
create table users(id uuid primary key,email text unique not null,password_hash text not null,role text not null check(role in('artist','listener','admin')),email_verified_at timestamptz,created_at timestamptz default now());
create table artists(id uuid primary key references users(id),display_name text not null,bio text default '');
create table tracks(id uuid primary key,artist_id uuid references artists(id),title text not null,genre text,audio_key text not null,artwork_key text,rights_attested_at timestamptz not null,created_at timestamptz default now());
create table playback_sessions(id uuid primary key,listener_id uuid references users(id),track_id uuid references tracks(id),started_at timestamptz default now(),qualified_at timestamptz,claimed_at timestamptz);
create table playback_events(id bigserial primary key,session_id uuid references playback_sessions(id),position_seconds integer not null,playing boolean not null,visible boolean not null,created_at timestamptz default now());
create table poe_receipts(id uuid primary key,session_id uuid unique references playback_sessions(id),track_id uuid references tracks(id),artist_id uuid references artists(id),verified_seconds integer not null,sats bigint not null,signature text not null,created_at timestamptz default now());
create table ledger_entries(id uuid primary key,artist_id uuid references artists(id),receipt_id uuid unique references poe_receipts(id),amount_sats bigint not null,status text not null,created_at timestamptz default now());
create table likes(listener_id uuid references users(id),track_id uuid references tracks(id),primary key(listener_id,track_id));
create table moderation_reports(id uuid primary key,reporter_id uuid references users(id),track_id uuid references tracks(id),reason text not null,status text default 'open',created_at timestamptz default now());
create index playback_events_session_idx on playback_events(session_id,created_at);
create index tracks_artist_idx on tracks(artist_id,created_at desc);
