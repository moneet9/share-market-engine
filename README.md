# AstraX

Author: moneet

> A high-performance C++ exchange engine.

AstraX is a fast exchange simulator. It matches buy and sell orders, tracks prices, and shows live market data in a dashboard.

## What It Does

- Matches orders using price-time priority
- Supports limit, market, iceberg, stop, and pegged orders
- Uses custom memory allocation to reduce overhead
- Uses a cache-friendly order book layout
- Streams market data through a binary TCP feed
- Shows live prices, trades, latency, and agent activity in the dashboard

## Main Parts

- `engine/` - C++ matching engine and order book
- `bindings/` - Python bindings for the engine
- `agents/` - Simple trading agents
- `data/` - Replay data, generators, and TCP feeder
- `dashboard/` - Live web dashboard
- `tests/` - Python tests

## Quick Start

```bash
# Build the C++ code
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build

# Run tests
ctest --test-dir build --output-on-failure

# Run Python tests
PYTHONPATH=build/bindings:. python3 -m pytest tests/ -v

# Start the dashboard server
PYTHONPATH=build/bindings:. python3 dashboard/server/app.py

# Start the frontend
cd dashboard/frontend && npm install && npm run dev

# Send replay data over TCP
PYTHONPATH=build/bindings:. python3 -m data.tcp_feeder --source path/to/lobster.csv
```

## Simple Example

```python
import exchange_simulator as ex

engine = ex.MatchingEngine()
order = ex.Order()
order.id = 1
order.side = ex.Side.Buy
order.price = 10000
order.quantity = 10
order.type = ex.OrderType.Limit
order.tif = ex.TimeInForce.GTC
order.timestamp = 1

engine.submit(order)
```

## Project Goals

- Fast matching
- Lower memory use
- Better cache locality
- Easier benchmarking
- Clear live visualization

## License

MIT

<!-- AstraX repo sync -->
