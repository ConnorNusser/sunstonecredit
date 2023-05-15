# Sunshine Corp

Boilerplate code for Sunshine Corp. (fullstack interview)

## Installation

```
npm run setup
```

OR

```
cd backend && npm i
cd client && npm i
```

## Run both BE and FE

To run both the back end and the front end run

```
npm run dev
```

## Individually

```
cd backend && npm run dev
cd client && npm run dev
```

## Problem 1

Create a new api called `sunshine` in `campaignRoutes` that accepts query parameters `month` and `city` and returns the sunshine percentage of that city for the given month.
If only `month` is provided, the API should return the percentages for the city for all months. If `city` is not provided, the percentages of all cities for the given month should be returned.

`localhost:1234/campaign/sunshine?city=austin&month=november`

For the data, you can use the `/backend/data/us_sunshine.csv` file.

## Problem 2

Provide a method to search for a city or month in the UI in the `Cities.jsx` and display the returned data from the sunshine api.

## Problem 3

Include population, state, longitude, and latitude in the data returned from sunshine api. For the data, use `/backend/data/us-cities-top-1k.csv`
