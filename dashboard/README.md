# AstraX Dashboard

Live visualization of AstraX showing order book, price chart, trade feed, agent performance, and latency telemetry.

## Architecture

```
Browser (React + Canvas)  ←—WebSocket—→  Python server  ←→  C++ Engine
```

## Running

### 1. Start the WebSocket server

```bash
cd exchange-simulator
pip install websockets
PYTHONPATH=build/bindings:. python3 dashboard/server/app.py
```

### 2. Start the frontend

```bash
cd dashboard/frontend
npm install
npm run dev
```

Open http://localhost:3000

### Optional: binary TCP feeder

Stream replay orders through the packed binary protocol into the dashboard server:

```bash
PYTHONPATH=build/bindings:. python3 -m data.tcp_feeder --source path/to/lobster.csv
```

## Features

- **Order Book** — Live best bid/ask with 8-level depth
- **Price Chart** — Canvas-rendered mid-price with gradient fill
- **Trade Feed** — Scrolling list of recent executions
- **Agent Panel** — Real-time PnL, inventory, and fill counts per agent
- **Stats Bar** — Mid price, spread, book depth, total fills
- **Latency Panel** — End-to-end latency snapshot for the live tick stream

<!-- AstraX repo sync -->
