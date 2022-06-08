# Uptime Monitoring API

Uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Table of contents
- [Uptime Monitoring API](#uptime-monitoring-api)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Server Configurations](#server-configurations)
  - [Scripts](#scripts)

---

## Installation
- After cloning the repo open the folder in the terminal and run the following command to install all packages
```
npm i
```
- Rename `.env.example` to `.env` and fill you data
---

## Server Configurations
- The server is running on port `3000`
---

## Scripts
- View the api docs it will be on port ``3001``
```
npm run docs
```

- Build the project from `TypeScript` to `JavaScript` and save it to `/build`
```
npm run build
```

- Starting the final build of the project
```
npm run start
```

- Running the `TypeScript` server in development with `nodemon`
```
npm run dev
```

- Getting linting errors using `eslint`
```
npm run lint
```

- Fixing linting errors using `eslint`
```
npm run lint:fix
```

- Formatting the project using `prettier`
```
npm run format
```

- Building the project and testing the specs on a test database 
```
npm run test
```

  
