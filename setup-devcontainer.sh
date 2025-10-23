#!/bin/bash

# Setup script for SvelteKit + Postgres Dev Container
# Run this in your project root directory: bash setup-devcontainer.sh

echo "🚀 Setting up dev container files..."

# Create .devcontainer directory
mkdir -p .devcontainer

# Create devcontainer.json
cat > .devcontainer/devcontainer.json << 'EOF'
{
  "name": "SvelteKit + Postgres",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/app",
  "customizations": {
    "vscode": {
      "extensions": [
        "svelte.svelte-vscode",
        "bradlc.vscode-tailwindcss",
        "dbaeumer.vscode-eslint",
        "oven.bun-vscode",
        "ms-azuretools.vscode-docker"
      ],
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash",
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        }
      }
    }
  },
  "forwardPorts": [5173, 5432],
  "postCreateCommand": "bun install",
  "remoteUser": "bun"
}
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-BASH", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/myapp
      NODE_ENV: development
    depends_on:
      postgres:
        condition: service_healthy
    command: bun run dev

volumes:
  postgres_data:
EOF

# Create Dockerfile.dev
cat > Dockerfile.dev << 'EOF'
FROM oven/bun:latest

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# Copy application code
COPY . .

# Expose SvelteKit port
EXPOSE 5173

CMD ["bun", "run", "dev", "--host"]
EOF

# Create .dockerignore
cat > .dockerignore << 'EOF'
node_modules
.git
.gitignore
.env
.env.*
!.env.example
.vscode
.idea
*.log
npm-debug.log*
.DS_Store
dist
build
.svelte-kit
coverage
*.md
!README.md
EOF

# Create .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/myapp

# Application
NODE_ENV=development
PORT=5173

# Auth (generate secure secrets for production)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
EOF

# Create scripts directory
mkdir -p scripts

# Create reset-db.ts
cat > scripts/reset-db.ts << 'EOF'
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1, // Single connection for migration script
});

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  try {
    // Drop and recreate schema
    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    
    // Create tables
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    // Create indexes
    await sql`CREATE INDEX idx_sessions_user_id ON sessions(user_id)`;
    await sql`CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)`;
    
    console.log('✅ Tables created');
    
    // Seed data
    await sql`
      INSERT INTO users (email, password_hash) VALUES
        ('dev@example.com', '$2a$10$placeholder_hash_1'),
        ('admin@example.com', '$2a$10$placeholder_hash_2')
    `;
    
    console.log('✅ Seed data inserted');
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

resetDatabase();
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "myapp",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "bun run db:reset && vite dev --host",
    "db:reset": "bun run scripts/reset-db.ts",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@types/node": "^20.0.0",
    "svelte": "^5.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "postgres": "^3.4.4",
    "zod": "^3.23.0"
  }
}
EOF

# Create README.md
cat > README.md << 'EOF'
# SvelteKit + Postgres Dev Container

This project uses Docker dev containers for a consistent development environment.

## Tech Stack

- **Runtime**: Bun (latest)
- **Database**: PostgreSQL 17
- **Framework**: SvelteKit
- **Database Client**: postgres.js with template literals
- **Validation**: Zod
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- VS Code with Dev Containers extension (optional but recommended)

### Option 1: Using VS Code Dev Containers (Recommended)

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container" (or use Command Palette: "Dev Containers: Reopen in Container")
3. Wait for the container to build and start
4. The database will be automatically reset and seeded on startup

### Option 2: Using Docker Compose Directly

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Start the services:
   ```bash
   docker-compose up
   ```

3. The app will be available at http://localhost:5173

## Database Management

### Reset Database (drops all data and recreates schema)

```bash
bun run db:reset
```

This script:
- Drops and recreates the public schema
- Creates all tables
- Seeds initial development data

### Manual Database Access

```bash
docker-compose exec postgres psql -U postgres -d myapp
```

## Project Structure

```
.
├── .devcontainer/
│   └── devcontainer.json    # VS Code dev container config
├── scripts/
│   └── reset-db.ts          # Database reset and seed script
├── docker-compose.yml        # Docker services definition
├── Dockerfile.dev           # Development container image
└── .dockerignore            # Files to exclude from Docker build
```

## Development Workflow

1. Make changes to `scripts/reset-db.ts` to modify schema
2. Run `bun run db:reset` to apply changes
3. Development data is ephemeral - feel free to reset anytime

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret for JWT signing (change in production!)
- `JWT_EXPIRES_IN`: JWT token expiration time

## Notes

- The database volume persists between container restarts
- To completely wipe data: `docker-compose down -v`
- Hot module replacement works through Docker volumes
- Node modules are cached in a Docker volume for faster rebuilds
EOF

echo ""
echo "✅ Dev container setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env: cp .env.example .env"
echo "2. Open in VS Code and click 'Reopen in Container'"
echo "   OR"
echo "   Run: docker-compose up"
echo ""
setup-devcontainer.sh
Displaying setup-devcontainer.sh.