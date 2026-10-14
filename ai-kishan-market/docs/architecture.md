# Architecture

```text
React (Vercel)
    |
    | HTTPS / JSON REST
    v
Spring Boot API (separate Java host)
    |             |              |
    v             v              v
MySQL         Private AWS S3   AI provider
```

## Initial user flows
1. Farmers publish crop listings.
2. Buyers browse crops and submit offers.
3. Farmers review and accept offers.
4. Price advisor compares supplied market observations and estimated transport costs.

## Security principles
- Passwords will be stored only as strong hashes.
- JWT-protected endpoints will enforce user ownership.
- S3 objects will remain private; the backend will issue short-lived presigned URLs if needed.
- AI provider keys, AWS credentials, and database passwords must be configured as environment variables, never committed.
- Price estimates must identify the source and timestamp of market data; sample data must not be presented as live rates.
