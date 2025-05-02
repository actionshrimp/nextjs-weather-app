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

## Thoughts

- I used `aider` for scaffolding things out - primarily for setting up Next.js and Jest boilerplate, and then reworked the API handler by hand to simplify and add support for min/max temperature.
- I added tests for the api, and an example test for one of the UI components.
- I figured it was simpler to return all available data via the API, and keep the logic around 'show more days' on the client side only, as the amount of data coming back from OpenWeatherMap's free API is fairly small. If there was more data being shuffled around or including the additional days in the initial request was more expensive somehow, then it might make sense to load the additional data via API when the client explicitly asked for it.
- Thoughts on the UX of the app:
  - The current search is persisted in the URL so users can share dashboard links easily for a specific city
  - I added a refresh button and the timestamp the page loaded out to give an indication of freshness for the current weather.
