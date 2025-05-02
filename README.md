# Weather dashboard

Experimenting with using `aider` as part of the workflow for setting up a simple weather dashboard app, using OpenWeatherMap.

View the deployed version [here](https://nextjs-weather-app-azure.vercel.app/).

## Setup (development mode)

- To get an `OPENWEATHERMAP_API_KEY`, please [sign up](https://home.openweathermap.org/users/sign_up) to OpenWeatherMap, and grab an API key from there.

- Then:

```sh
    cp .env.{example,local}
    # update .env.local with your OPENWEATHERMAP_API_KEY

    npm ci
    npm run dev
```

## Run the tests

    npm test
