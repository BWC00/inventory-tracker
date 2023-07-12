# inventory-tracker

Streamlined inventory management and barcode-based counting system REST API with automated pricing calculations and insightful analytics, built with [TypeScript](https://www.typescriptlang.org/) and [Express](https://expressjs.com/).

## Packages

List of main node modules used in this app:

- [acl](https://www.npmjs.com/package/acl) checking permissions based on user roles
- [express](https://www.npmjs.com/package/express) running server
- [pg](https://www.npmjs.com/package/pg) for running database queries
- [nodemailer](https://www.npmjs.com/package/nodemailer) sends email notifications to users
- [passport](https://www.npmjs.com/package/passport) checks authentication based on jwt
- [redis](https://www.npmjs.com/package/redis) used for caching, faster data retrieval
- [node-schedule](https://www.npmjs.com/package/node-schedule) used for repetition scheduling (executing countexecutions periodically based on a schedule represented by a cron expression)

## Features

- Component-based architecture
- ACL (access control list)
- Caching (Redis)
- DB seeding
- Mailing
- Postgresql
- Testing

## Folder structure

### Directory: src

```shell
inventory-tracker
├── api
│   ├── components
│   ├── middleware
│   ├── routes.ts
│   └── server.ts
├── config
├── services
├── test
└── app.ts
```
- `src/api` everything needed for the REST API
  - `src/api/components` component routers, controllers, models, tests and more
  - `src/api/middleware` API middleware
- `src/config` global configuration files
- `src/services` services for sending mails, caching, authentication and more
- `src/test` test factory

### Directory: src/api
```shell
inventory-tracker
├── api
│   ├── components
│   ├── middleware
│   ├── routes.ts
│   └── server.ts
```
This directory includes all REST-API related files like components, the Express server instance and more.

### Directory: src/api/components
```shell
inventory-tracker
├── api
│   ├── components
│   │   ├── auth
│   │   ├── user
│   │   ├── user-invitation
│   │   ├── user-role
│   │   ├── helper.ts
│   │   └── index.ts
```
Here we have the heart of our component based Node API. Each component has its own routes, controller, model, repository, policies, tests and templates.

### Directory: src/api/components/user (one of the components)
```shell
inventory-tracker
├── api
│   ├── components
│   │   ├── user
│   │   │   ├── controller.ts
│   │   │   ├── model.ts
│   │   │   ├── policy.json
│   │   │   ├── repository.ts
│   │   │   ├── routes.ts
│   │   │   └── user.spec.ts
```
As you can see a component consists of the files I just mentioned before. Most of them represents a single class that is exported. Of course, you can add here more component specific stuff.

Since I have multiple components and their classes have the same structure most of the time, I also created interfaces and generic/parameterized abstract classes that are implemented in the components to ensure code resuseability. This helps me to keep the components’ structure straight.

### Directory: src/api/middleware
```shell
inventory-tracker
├── api
│   ├── middleware
│   │   ├── compression.ts
│   │   └── logging.ts
```
This folder includes all the API’s global middlewares like compression, request logging etc.

### File: src/api/routes.ts
```shell
inventory-tracker
├── api
│   ├── routes.ts
```
Here we register all component and middleware routes. Those ones are used from the server class later on.

### File: src/api/server.ts
```shell
inventory-tracker
├── api
│   ├── server.ts
```
Here we declare everything required for the Express.js server:

- import middlware
- import routes
- error handling

Later on, we can import the server class for unit tests as well.

### Directory: src/config
```shell
inventory-tracker
├── config
│   ├── globals.ts
│   ├── logger.ts
│   └── policy.ts
```
This directory includes the API’s configuration files. This could be for example:

- global variables
- logger config
- ACL permissions
- SMTP config
- DB config

### Directory: src/services
```shell
inventory-tracker
├── services
│   ├── auth
│   │   ├── strategies
│   │   │   ├── base.ts
│   │   │   └── jwt.ts
│   │   └── index.ts
│   ├── mail.ts
│   ├── redis.ts
│   └── utility.ts
```
This directory contains global services we might need for for example authorization, sending mails, caching, or helper methods for password hashing, etc..

### File: src/app.ts
```shell
inventory-tracker
└───src
    │   app.ts
```
This is the startup file of our application. It initializes the database connection, redis client and starts the express server.

## Setup

### Native

Requirements:

- [Postgresql](https://www.mysql.com/de/)
- [Node.js](https://nodejs.org/en/)
- [Redis](https://redis.io/)

Installation:

1. Run `npm install`
2. Rename `.env.example` to `.env` and enter environment variables
3. Run `npm run seed` to create database tables, seed roles and admin account (make sure the database exists first)
3. Run `npm run build` to compile the TS code
4. Run `npm run start` to start the application

You can reach the server at [http://localhost:3000/api/v1/](http://localhost:3000/api/v1).

### Docker

Requirements:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Installation:

1. Rename `.env.docker.example` to `.env.docker` and enter environment variables
2. Run `docker-compose up` to start the Docker containers

You can reach the server at [http://localhost:3000/api/v1/](http://localhost:3000/api/v1).

### Building

During the build process the following tasks are executed:

- Compiling TS into JS
- Merging component `policy.json` files into a single one in `dist/output/policies.combined.json`

The two tasks are executed using Gulp as you can see in `gulpfile.js`.

### Database seeding

In in `db` you'll find a 2 SQL scripts `db/tables` and `db/seed` that are used for creating the tables and seeding the database with admin account data. This is automatically done for you when running `npm run seed`. (admin account gets printed in the console)

If you want to seed the database from a Docker container you must connect to it before: `docker exec -it inventory-counter bash`.

## Tools

### ACL

This application uses [acl](https://www.npmjs.com/package/acl) for permission management. Each component in `src/api/components` has its own `policy.json` which includes permissions for each role.

During the build process all these `policy.json` files get merged into a single one using a Gulp task as described more above.

### MailHog

[MailHog](https://github.com/mailhog/MailHog) is an email testing tool for developers. You can use it as SMTP server to simulate the process of sending mails. In the application, it is used to notify users of the start/end event of a countexecution.
