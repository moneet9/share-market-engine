import React, { useState, useEffect, useRef, useCallback } from 'react'
import OrderBook from './components/OrderBook'
import TradeFeed from './components/TradeFeed'
import AgentPanel from './components/AgentPanel'
import LatencyPanel from './components/LatencyPanel'
import PriceChart from './components/PriceChart'
import Stats from './components/Stats'

export default function App() {
  const [connected, setConnected] = useState(false)
  const [book, setBook] = useState(null)
  const [agents, setAgents] = useState([])
  const [fills, setFills] = useState([])
  const [priceHistory, setPriceHistory] = useState([])
  const [latency, setLatency] = useState(null)
  const [step, setStep] = useState(0)
  const wsRef = useRef(null)

  const connect = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8765')
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => {
      setConnected(false)
      setTimeout(connect, 2000)
    }
    ws.onerror = () => ws.close()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'tick') {
        setBook(data.book)
        setAgents(data.agents)
        setStep(data.step)

        if (data.fills.length > 0) {
          setFills(prev => [...data.fills, ...prev].slice(0, 100))
        }

        if (data.book.mid) {
          setPriceHistory(prev => {
            const next = [...prev, { time: data.step, value: data.book.mid / 10000 }]
            return next.slice(-500)
          })
        }

        if (data.latency) {
          setLatency(data.latency)
        }
      }
    }
  }, [])

  useEffect(() => {
    connect()
    return () => wsRef.current?.close()
  }, [connect])

  const latestMid = book?.mid ? (book.mid / 10000).toFixed(4) : '—'
  const latestSpread = book?.spread ?? '—'
  const latencyLabel = latency ?? '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      <header style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '16px',
        padding: '20px 22px',
        background: 'linear-gradient(135deg, rgba(22, 31, 56, 0.96), rgba(9, 16, 31, 0.92))',
        borderRadius: '18px',
        border: '1px solid var(--border)',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.28)',
        backdropFilter: 'blur(14px)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 10px',
              borderRadius: '999px',
              background: 'rgba(34, 211, 238, 0.12)',
              color: 'var(--cyan)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              AstraX
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              High-performance C++ exchange engine
            </span>
          </div>

          <h1 style={{ fontSize: '30px', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em' }}>
            Price-time priority matching with low-latency telemetry.
          </h1>

          <p style={{ maxWidth: '64ch', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Live market activity, agent behavior, and latency are rendered in a single glassy control surface designed to feel like a production trading system.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '10px', alignContent: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
            <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>MID</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{latestMid}</div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>SPREAD</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{latestSpread}</div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>LATENCY</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{latencyLabel}</div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>STATUS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: connected ? 'var(--green)' : 'var(--red)',
                  boxShadow: `0 0 0 6px ${connected ? 'rgba(52, 211, 153, 0.12)' : 'rgba(251, 113, 133, 0.12)'}`,
                }} />
                {connected ? 'Live' : 'Reconnecting'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step {step.toLocaleString()}
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Latency', 'Orders/sec', 'Cache misses', 'CPU usage', 'Memory usage'].map((label) => (
                <span key={label} style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  background: 'rgba(96, 165, 250, 0.1)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(96, 165, 250, 0.16)',
                  fontSize: '11px',
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
      </header>

      <Stats book={book} step={step} fillCount={fills.length} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: '16px',
        minHeight: '400px',
      }}>
        <OrderBook book={book} />
        <PriceChart data={priceHistory} />
        <TradeFeed fills={fills} />
      </div>

      <AgentPanel agents={agents} />

      <LatencyPanel latency={latency} />
    </div>
  )
}

// AstraX repo sync
