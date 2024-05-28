# How to Setup

## Environment Variables

Create a `.env` file for environment variables

```bash
DATABASE_URL="POSTGRES_DATABASE_URL"
```

## Install Dependencies

```bash
npm install  # If using yarn, `yarn install`
npx prisma generate
npx prisma db push # Build the database if it is not built
```

## How to Run

```bash
npm run dev  # If using yarn, `yarn dev`
```

## How to Build

```bash
npm run build  # If using yarn, `yarn build`
```
