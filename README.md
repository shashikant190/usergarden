# User Activity Logger and Dashboard

A system to track daily user activity with an admin dashboard for visualization.

![Demo](public/game-images/Dashboard.jpg?text=Dashboard+Preview)<br>
![Demo](public/game-images/UserActivityDashboard.jpg?text=Dashboard+Preview) 

## Features

- **Daily User Tracking**: Automatically resets count at midnight
- **Persistent Logging**: Stores data in `userLogs.txt` file
- **REST API**: 
  - Increment user count
  - Retrieve historical data
- **Dashboard**:
  - Interactive line chart
  - Data table view
  - Auto-refresh every 5 minutes

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, Chart.js
- **Middleware**: CORS, Express compression

## Prerequisites

- Node.js (v14+)
- npm (v6+)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/shashikant190/usercount-gardencraft.git
cd usercount-gardencraft
```
2. Install dependencies:
```bash
npm install
```
```bash
npm install express cors compression
```
3. Start the server:
```
node server.js
```

<h1>Troubleshooting</h1>
Common issues:

<p>Port in use: Change port number in server.js</p>
<p>Missing dependencies: Run npm install</p>
<p>Empty dashboard: Check server logs and userLogs.txt format</p>
<p>CORS errors: Verify middleware setup in server.js</p>

**Maintained by:** [Shashikant Maurya](https://github.com/shashikant190) & [Suraj Ganeshpure](https://github.com/surajadmin)  
**Report Issues:** [GitHub Issues](https://github.com/shashikant190/usercount-gardencraft/issues)
