# Answers

> What libraries did you add to the frontend? What are they used for?

**Tailwind CSS (First time using it)**

I used it for quickly developing the ui.

**Axios**

I used it for HTTP calls.

**React Feather**

I used it for adding icons to the ui.

**React Hook form (First time using it)**

I used it for quickly developing forms without spending too much time for adding states for all the inputs etc.

**React Query**

I used it as a data-fetching library for faster development

**React Router**

I used it for routing.

> What's the command to start the application locally?

You can run the entire app with docker locally.

On root directory

```bash
docker-compose up -d
```

### Running seperately

## Backend

On backend directory

### Installing the dependencies

```bash
yarn
```

### Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

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

> How long did you spend on the coding project? What would you add to your solution if you had more time? If you didn't spend much time on the coding project, then use this as an opportunity to explain what you would add.

I spent 24 hours to finish the project. I would add more tests to frontend and pagination for the backend.

> What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

I think, timer promises api that comes with NodeJS V16 is great.

I didn't use this new feature on my code. Down below i have a snippet that shows how to use the new feature. It could be pretty handy on my next projects.

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
