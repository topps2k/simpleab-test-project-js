# SimpleAB Demo Project

This project demonstrates the usage of SimpleAB for A/B testing with a simple web application. It showcases how to implement server-side treatment assignment, client-side rendering, and metric tracking.

## Features

- Server-side treatment assignment
- Dynamic button text based on treatment
- Client-side metric tracking (clicks and latency)
- 50ms delay simulation for T1 treatment

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the project files.
2. Navigate to the project directory in your terminal.
3. Run the following command to install the required dependencies:

```
npm install
```

## Running the Demo

To start the demo application, run the following command in the project directory:

```
npm start
```

This will start the server, and you should see a message indicating that the server is running at http://localhost:3000.

Open your web browser and visit http://localhost:3000 to view the demo.

## How it Works

1. When you visit the page, the server assigns a random user ID and determines the treatment (Control, T1, T2, or T3) for the button.
2. The button text is set based on the assigned treatment:
   - Control: "Click me"
   - T1: "Click me - A"
   - T2: "Click me - B"
   - T3: "Click me - C"
3. When you click the button:
   - A click event is recorded and sent to the server
   - For T1 treatment, a 50ms delay is simulated before processing the click
   - A random revenue amount is generated and recorded
   - The latency of the click operation is measured and logged in the browser console

## Files

- `index.js`: The main server file that handles treatment assignment and metric tracking
- `public/index.html`: The client-side HTML file that renders the button and handles user interactions
- `package.json`: Project configuration and dependencies

## Customization

You can modify the `experimentId` in `index.js` to test different experiment configurations. Make sure to update the SimpleAB SDK initialization with your own API key and endpoint if you're using a different SimpleAB account.

## Troubleshooting

If you encounter any issues while running the demo, please ensure that:

1. All dependencies are correctly installed (`npm install`)
2. The correct Node.js version is being used (v12 or higher)
3. No other application is running on port 3000

If problems persist, check the server console for any error messages that may provide more information about the issue.