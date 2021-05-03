# Admin Panel Project

# Assumptions

- User can have only 1 role.
- 3 Roles: Admin, Editor, User (Authorizations of roles are described down below)
- There are 3 data types. Users, Courses and Contents.
- Courses can have multiple contents.

**Admin**

| Table    | Read | Write | Update | Delete |
| -------- | ---- | ----- | ------ | ------ |
| Users    | ✓    | ✓     | ✓      | ✓      |
| Courses  | ✓    | ✓     | ✓      | ✓      |
| Contents | ✓    | ✓     | ✓      | ✓      |

**Editor**

| Table    | Read   | Write | Update | Delete |
| -------- | ------ | ----- | ------ | ------ |
| Users    | itself |       | itself |        |
| Courses  | ✓      | ✓     | ✓      |        |
| Contents | ✓      | ✓     | ✓      |        |

**User**

| Table    | Read   | Write | Update | Delete |
| -------- | ------ | ----- | ------ | ------ |
| Users    | itself |       | itself |        |
| Courses  | ✓      |       |        |        |
| Contents | ✓      |       |        |        |

# Tech Stack

1. **Backend**: NestJS
2. **Frontend**: React
3. **Database**: PostgreSQL
4. **Testing**: Jest for unit testing. Postman for e2e testing.

# Features

- Swagger Documentation
- JWT authentication with refresh & access token
- Role based authorization
- Data filtering
- Fully responsive design

# Authentication

Application generates 2 tokens on login. Access token and refresh token. Access token has a lifetime of 15 minutes and the refresh token has a lifetime of 1 year.

# First Login

On the first run, application inserts a new admin to the database.

- **username**: admin
- **password**: admin123

# How to setup

## **Deploy with Docker**

You can run the entire app using docker compose.

On root directory

```bash
docker-compose up -d
```

Application will be deployed on http://localhost:3000

Swagger Docs on http://localhost:3000/api/docs

## **Running locally**

## Backend

First you have to postgresql installed on your computer.

Edit the database properties on the backend/.env file.

On backend directory

### Installing the dependencies

```bash
yarn
```

### Running the app

```bash
$ yarn start
```

Backend will be started on http://localhost:5000

Swagger Docs on http://localhost:5000/api/docs

## Frontend

On frontend directory

### Installing the dependencies

```bash
yarn
```

### Running the app

```bash
$ yarn start
```

Frontend will be started on http://localhost:3000

# Testing

**Unit testing**

On backend directory

```bash
yarn test
```

**e2e api testing**

First start the backend locally.

On backend directory

Install the dependencies

```bash
yarn
```

Start the backend locally.

```bash
yarn start
```

Start the test

Test will login as **username:** admin, **password:** admin123 and create users with usernames test and test2. If you change username and password of admin or if you add users with username test and test2. Tests will fail.

```bash
yarn test:e2e
```
