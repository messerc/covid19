# State of COVID-19

![Site](https://i.imgur.com/FSHxqDm.gif)

## Tech used
- `react` / bootstrapped with [`create-react-app`](https://github.com/facebook/create-react-app).
- [`recharts`](https://recharts.org/) for charting
- [`recoil`](https://recoiljs.org/) for state management
- [`styled-components`](https://styled-components.com/) for styling

## Overview / Tech Explanation

I haven't worked with data visualizations too much in a couple of years, so it was refreshing and fun to have a focused challenge around that.
My approach was generally to keep the exercise timeboxed, but also try some new stuff out. That's why I chose a mix of tech I'm comfortable with (react, recharts) along with 
some brand new experimental stuff (recoil).

Recharts is a data viz library built on top of d3 and exposes a series of composable React components. I've worked with a handful of libs in the past and found Recharts to be the easiest / 
best performing charts to work with (for React specifically). I could've opted for d3 but for just basic line and pie charts, it made sense for this exercise.

Recoil is a brand new "experimental" state management library from Facebook. I'm not the type of person to use additional tech before it's needed, but in this case, I was interested in 
trying Recoil and this was a good use case for it. It's a very lightweight solution to sharing state across the app and performing any series of transformations (deriving) from that state. The reason this state management solution was built was essentially for internal dashboard-type applications, so it felt natural.
However, I did end up paying a cost in using such an experimental library. There will be a few errors popping up into the console on initial load, and 
that issue is being [tracked here](https://github.com/facebookexperimental/Recoil/issues/12). It doesn't seem to cause any noticeable harm to the app for now. I also wanted to deploy this application, but I ran into [deployment issues](https://github.com/facebookexperimental/Recoil/issues/122), as did most everyone else. No regrets, it was still fun to try out.

I picked styled components because it's just what I'm familiar with at work, styling was a lower priority for this exercise.

## Thoughts / Approach

As the prompt called for, I wanted to keep the application simple. No outside components other than the charts themselves.

In terms of the data, I was going to have the CSVs local but decided it's more interesting if we're referring to the live gists, which will update each day. I spent some time just getting a sense of the data and
then dove in. In hindsight, I might've spent a little more time thinking about how I could've molded the data. There is some slightly funky code in `reducer.js` - but I think it landed in a reasonable place given the time. A lot of this time was spent learning how to use `recoil` and trying to find reasonable levels of abstraction.

In terms of improvements I wanted to do but felt I had put in enough time: 
- I'd add more high-level information / aggregate-type info
- persist filter state in the URL
- test coverage for `reducer.js` 

I noticed there was a "Bonus" section but I hope this is enough to start, happy to add onto it if we think that's helpful. 

I hope you enjoy playing around in the application, thank you!

-------------------------------

## Running this project

Clone down the repo, `yarn` / `npm install` -> `npm start` / `yarn start` -> open [http://localhost:3000](http://localhost:3000)

Runs the app in the development mode.<br />

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
