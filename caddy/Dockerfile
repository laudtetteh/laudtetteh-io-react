# Custom Caddy binary with the Cloudflare DNS provider plugin.
#
# Production DNS stays proxied (orange-cloud) through Cloudflare — a deliberate choice,
# see issue #76. That rules out the standard HTTP-01 ACME challenge entirely, because
# Cloudflare's edge terminates :80/:443 before Let's Encrypt can ever reach this origin.
# The DNS-01 challenge sidesteps it: Caddy proves domain ownership by creating a TXT
# record via the Cloudflare API instead of serving a file over HTTP. Stock
# caddy:2-alpine ships no DNS provider plugins, hence this xcaddy build.
FROM caddy:2-builder-alpine AS build
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM caddy:2-alpine
COPY --from=build /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
