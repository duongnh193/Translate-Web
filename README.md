# translate-be

Spring Boot REST API for translation workflow. Features:

- JWT-based auth with register/login endpoints.
- `/api/translate` builds prompts, validates length and stores history.
- `/api/presets` exposes reusable prompt snippets stored in MySQL.
- `/api/history` returns last 20 translations for authenticated users.

## Getting started

1. Copy `.env.example` or export variables:

```bash
export DB_USERNAME=root
export DB_PASSWORD=secret
export JWT_SECRET=change-me
export GEMINI_API_KEY=your-key
```

2. Update `spring.datasource.url` inside `src/main/resources/application.yml` if your MySQL host differs. The schema script will create the `translater` database and tables:

```bash
mysql -u$DB_USERNAME -p$DB_PASSWORD < database/schema.sql
```

3. Build & run:

```bash
mvn spring-boot:run
```

Spring Boot is configured to execute `database/schema.sql` on every startup, so tables remain in sync. API docs are described in `be workflow`. Use Bearer token from `/api/auth/login` for `/api/history`.
