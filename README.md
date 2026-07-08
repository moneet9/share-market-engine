# AstraX

**Author:** moneet

**A high-performance C++ exchange engine.**

AstraX is a high-performance exchange simulator designed for low-latency order matching. It matches buy and sell orders, tracks market prices, streams live market data, and provides a real-time dashboard for visualization.

---

## Features

- Price-time priority matching
- Supports:
  - Limit orders
  - Market orders
  - Iceberg orders
  - Stop orders
  - Pegged orders
- Custom memory allocator for reduced overhead
- Cache-friendly order book layout
- Binary TCP market data feed
- Live dashboard showing:
  - Prices
  - Trades
  - Latency
  - Trading agent activity

---

## Project Structure

```
engine/       C++ matching engine and order book
bindings/     Python bindings
agents/       Example trading agents
data/         Replay data, generators, and TCP feeder
dashboard/    Live web dashboard
tests/        Python test suite
```

---

## Quick Start

### Build the C++ Engine

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

### Run C++ Tests

```bash
ctest --test-dir build --output-on-failure
```

### Run Python Tests

```bash
PYTHONPATH=build/bindings:. python3 -m pytest tests/ -v
```

### Start the Dashboard Backend

```bash
PYTHONPATH=build/bindings:. python3 dashboard/server/app.py
```

### Start the Dashboard Frontend

```bash
cd dashboard/frontend
npm install
npm run dev
```

### Stream Replay Data

```bash
PYTHONPATH=build/bindings:. python3 -m data.tcp_feeder --source path/to/lobster.csv
```

---

## Python Example

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

---

## Project Goals

- Fast order matching
- Low memory usage
- Better cache locality
- Easy benchmarking
- Real-time market visualization