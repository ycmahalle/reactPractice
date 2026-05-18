import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const GRID_SIZE = 20
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const DEFAULT_SPEED_MS = 180
const SPEED_RANGE = { min: 80, max: 260, step: 20 }

const getRandomFood = (snake) => {
  const occupied = new Set(snake.map((segment) => `${segment.x}-${segment.y}`))
  const available = []

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x}-${y}`
      if (!occupied.has(key)) {
        available.push({ x, y })
      }
    }
  }

  if (available.length === 0) {
    return null
  }

  return available[Math.floor(Math.random() * available.length)]
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState(() => getRandomFood(INITIAL_SNAKE))
  const [isRunning, setIsRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)

  const directionRef = useRef(direction)
  const foodRef = useRef(food)
  const hasSavedScore = useRef(false)

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem('snakeLeaderboard')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    foodRef.current = food
  }, [food])

  const resetGame = useCallback((startRunning = false) => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(getRandomFood(INITIAL_SNAKE))
    setScore(0)
    setIsGameOver(false)
    setIsRunning(startRunning)
    setSpeedMs(DEFAULT_SPEED_MS)
    hasSavedScore.current = false
  }, [])

  useEffect(() => {
    if (isGameOver && score > 0 && !hasSavedScore.current) {
      hasSavedScore.current = true
      setLeaderboard((prev) => {
        const newEntry = { score, date: new Date().toISOString() }
        const nextLeaderboard = [...prev, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
        localStorage.setItem('snakeLeaderboard', JSON.stringify(nextLeaderboard))
        return nextLeaderboard
      })
    }
  }, [isGameOver, score])

  const changeDirection = useCallback((nextDirection) => {
    const current = directionRef.current
    const isOpposite =
      nextDirection.x === -current.x && nextDirection.y === -current.y

    if (isOpposite) {
      return
    }

    setDirection(nextDirection)
  }, [])

  const handleDirectionalInput = useCallback(
    (nextDirection) => {
      changeDirection(nextDirection)
      if (!isRunning && !isGameOver) {
        setIsRunning(true)
      }
    },
    [changeDirection, isGameOver, isRunning],
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        if (isGameOver) {
          resetGame(true)
        } else {
          setIsRunning((prev) => !prev)
        }
        return
      }

      const key = event.key.toLowerCase()
      const nextDirection = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      }[key]

      if (!nextDirection) {
        return
      }

      handleDirectionalInput(nextDirection)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDirectionalInput, isGameOver, isRunning, resetGame])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = window.setInterval(() => {
      setSnake((currentSnake) => {
        const { x: dx, y: dy } = directionRef.current
        const head = currentSnake[0]
        const newHead = { x: head.x + dx, y: head.y + dy }

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE

        const hitSelf = currentSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y,
        )

        if (hitWall || hitSelf) {
          setIsRunning(false)
          setIsGameOver(true)
          return currentSnake
        }

        const nextSnake = [newHead, ...currentSnake]
        const currentFood = foodRef.current
        const ateFood =
          currentFood &&
          newHead.x === currentFood.x &&
          newHead.y === currentFood.y

        if (ateFood) {
          setScore((prev) => prev + 1)
          const nextFood = getRandomFood(nextSnake)
          if (!nextFood) {
            setIsRunning(false)
            setIsGameOver(true)
            return nextSnake
          }
          setFood(nextFood)
        } else {
          nextSnake.pop()
        }

        return nextSnake
      })
    }, speedMs)

    return () => window.clearInterval(interval)
  }, [isRunning, speedMs])

  const snakeCells = useMemo(() => {
    const cellMap = new Map()
    snake.forEach((segment, index) => {
      cellMap.set(`${segment.x}-${segment.y}`, index === 0 ? 'head' : 'body')
    })
    return cellMap
  }, [snake])

  const cells = []
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x}-${y}`
      const snakeType = snakeCells.get(key)
      const isFood = food && food.x === x && food.y === y
      const classes = ['cell']

      if (snakeType === 'head') {
        classes.push('cell--head')
      } else if (snakeType === 'body') {
        classes.push('cell--snake')
      }

      if (isFood) {
        classes.push('cell--food')
      }

      cells.push(<div key={key} className={classes.join(' ')} />)
    }
  }

  return (
    <div className="app">
      <header className="game-header">
        <div>
          <h1>Snake</h1>
          <p className="subtitle">Classic arcade movement with modern polish.</p>
        </div>
        <div className="scoreboard">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
      </header>

      <section className="game-area">
        <div className={`board ${isGameOver ? 'board--gameover' : ''}`}>
          {cells}
        </div>
        <div className="touch-controls" aria-label="Touch controls">
          <button
            type="button"
            className="control-button control-button--up"
            onClick={() => handleDirectionalInput({ x: 0, y: -1 })}
            onTouchStart={() => handleDirectionalInput({ x: 0, y: -1 })}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="control-button control-button--left"
            onClick={() => handleDirectionalInput({ x: -1, y: 0 })}
            onTouchStart={() => handleDirectionalInput({ x: -1, y: 0 })}
            aria-label="Move left"
          >
            ←
          </button>
          <button
            type="button"
            className="control-button control-button--down"
            onClick={() => handleDirectionalInput({ x: 0, y: 1 })}
            onTouchStart={() => handleDirectionalInput({ x: 0, y: 1 })}
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            className="control-button control-button--right"
            onClick={() => handleDirectionalInput({ x: 1, y: 0 })}
            onTouchStart={() => handleDirectionalInput({ x: 1, y: 0 })}
            aria-label="Move right"
          >
            →
          </button>
        </div>
        <aside className="panel">
          <div className="panel-section">
            <h2>Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p>No high scores yet.</p>
            ) : (
              <ol className="leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <li key={index}>
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <strong>{entry.score}</strong>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="panel-section">
            <h2>Status</h2>
            <p className={isGameOver ? 'status status--danger' : 'status'}>
              {isGameOver
                ? 'Game over. Press Space or Restart.'
                : isRunning
                  ? 'Running'
                  : 'Paused'}
            </p>
          </div>
          <div className="panel-section">
            <h2>Controls</h2>
            <ul>
              <li>Arrow keys or WASD to move</li>
              <li>Space to pause/resume</li>
              <li>Restart to reset the board</li>
              <li>On mobile use the arrow pad</li>
            </ul>
          </div>
          <div className="panel-section">
            <h2>Speed</h2>
            <div className="speed-control">
              <input
                type="range"
                min={SPEED_RANGE.min}
                max={SPEED_RANGE.max}
                step={SPEED_RANGE.step}
                value={speedMs}
                onChange={(event) => setSpeedMs(Number(event.target.value))}
              />
              <span>{speedMs} ms</span>
            </div>
          </div>
          <div className="panel-section">
            <button
              type="button"
              className="primary"
              onClick={() => setIsRunning((prev) => !prev)}
              disabled={isGameOver}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button type="button" onClick={() => resetGame(false)}>
              Restart
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default App
