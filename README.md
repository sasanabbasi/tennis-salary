# Tennis Service

A NestJS application for calculating tennis player salaries based on match data.

## Features

- REST API for retrieving player salary information
- Configurable bonus/penalty factors for different tennis events
- Unit tests with high coverage
- Containerized for easy deployment

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Docker (optional, for containerized runs)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/tennis-service.git
   cd tennis-service
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the application in development mode

   ```bash
   npm run start:dev
   ```

4. Access the API at `http://localhost:8000`

### Running Tests

Run unit tests:

```bash
npm run test
```

Generate test coverage:

```bash
npm run test:cov
```

### Using Docker

Build and run with Docker:

```bash
docker build -t tennis-service .
docker run -p 8000:8000 tennis-service
```

Or use Docker Compose:

```bash
docker-compose up -d
```

## API Endpoints

- `GET /salary/player/:playerId` - Get salary information for a specific player

## CI/CD Pipeline

This project uses GitHub Actions for CI/CD:

- Runs on push to main/master/develop branches and PRs
- Lints code
- Runs tests with coverage
- Builds the application
- Builds and pushes Docker image (on main/master branches)

## Configuration

Configuration is stored in `config/default.yml`:

```yaml
bonus:
  participate_in_match: 500
  won_sets: 750
  won_match: 2500
  won_game: 200
  ace: 100
penalty:
  double_faults: -100
  racket_damage: -500
server:
  port: 8000
```

## License

[MIT License](LICENSE)
