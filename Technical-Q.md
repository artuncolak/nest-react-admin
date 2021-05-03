# Answers

> What libraries did you add to the frontend? What are they used for?

**Tailwind CSS (First time using it)**

I used it for quickly develop the ui.

**Axios**

I used it for HTTP calls.

**React Feather**

I used it for add icons to the ui.

**React Hook form (First time using it)**

I used it for quickly develop forms without spending too much time for adding states for all the inputs etc.

**React Query**

I used it as a data fetching library for faster development

**React Router**

I used it for routing.

> What's the command to start the application locally?

You can deploy the entire app using docker compose.

On root directory

```bash
docker-compose up -d
```

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

> How long did you spend on the coding project? What would you add to your solution if you had more time? If you didn't spend much time on the coding project, then use this as an opportunity to explain what you would add.

I spent 18 hours to finish the project.

I would add
1. Unit Tests and e2e tests for the frontend
2. Pagination
3. Sorting
4. Creating custom roles


> What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

I think, timer promises api that comes with NodeJS V16 is great.

I didn't use this new feature on this project. Down below i have a snippet that shows how to use the new feature. It could be pretty handy on my next projects.

```javascript
// Old
function demoOld() {
  setTimeout(() => {
    console.log("Timer expired.");
  }, 5000);
}

// New
import { setTimeout } from "timers/promises";

async function demoNew() {
  await setTimeout(5000);
  console.log("Timer expired.");
}
```

> How would you track down a performance issue in production? Have you ever had to do this?

I would monitor the application with tools like PM2 and Retrace and i would do HTTP performance testing with tools like Artillery. After all the monitoring and testing is over. I would take the required actions based on the results.

No, I never had to do that.
