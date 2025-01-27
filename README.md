
## Description

Futures-data-tool backend Repo


## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment
```bash
# when database changes, run this command to generate new migrations
$ pnpm run db:generate

# push the migrations to the database
$ pnpm run db:push

# deploy the app on vercel
$ vercel --prod
```

## License

Nest is [MIT licensed](LICENSE).
