// Original arcade-style games, written from scratch for this site.
// Each entry in ARCADE_GAMES exposes start(canvas) and returns a stop()
// function used to clean up when the modal closes.

const ARCADE_GAMES = {};

function fitCanvasToBox(canvas) {
  const ctx = canvas.getContext("2d");
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return { ctx, observer, size: () => canvas.getBoundingClientRect() };
}

function highScore(key, value) {
  const storeKey = "mrdave_arcade_" + key;
  if (value === undefined) return Number(localStorage.getItem(storeKey) || 0);
  const current = Number(localStorage.getItem(storeKey) || 0);
  if (value > current) localStorage.setItem(storeKey, String(value));
  return Math.max(current, value);
}

/* ---------------- Paddle Ball (2-player) ---------------- */
ARCADE_GAMES.pong = {
  start(canvas) {
    const { ctx, observer, size } = fitCanvasToBox(canvas);
    let raf;
    const keys = {};
    const state = {
      leftY: 0.5, rightY: 0.5,
      ballX: 0.5, ballY: 0.5, ballVX: 0.5, ballVY: 0.3,
      leftScore: 0, rightScore: 0
    };
    const PADDLE_H = 0.18, PADDLE_W = 0.015, SPEED = 0.9;

    function resetBall(dir) {
      state.ballX = 0.5; state.ballY = 0.5;
      state.ballVX = 0.5 * dir;
      state.ballVY = (Math.random() * 0.6 - 0.3);
    }
    resetBall(1);

    function onKeyDown(e) {
      keys[e.key] = true;
      if (["ArrowUp", "ArrowDown", "w", "s", "W", "S"].includes(e.key)) e.preventDefault();
    }
    function onKeyUp(e) { keys[e.key] = false; }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const rect = size();
      const w = rect.width, h = rect.height;

      if (keys["w"] || keys["W"]) state.leftY -= SPEED * dt;
      if (keys["s"] || keys["S"]) state.leftY += SPEED * dt;
      if (keys["ArrowUp"]) state.rightY -= SPEED * dt;
      if (keys["ArrowDown"]) state.rightY += SPEED * dt;
      state.leftY = Math.max(PADDLE_H / 2, Math.min(1 - PADDLE_H / 2, state.leftY));
      state.rightY = Math.max(PADDLE_H / 2, Math.min(1 - PADDLE_H / 2, state.rightY));

      state.ballX += state.ballVX * dt;
      state.ballY += state.ballVY * dt;
      if (state.ballY < 0.02 || state.ballY > 0.98) state.ballVY *= -1;

      const ballR = 0.012;
      if (state.ballX < 0.03 + PADDLE_W) {
        if (Math.abs(state.ballY - state.leftY) < PADDLE_H / 2 + ballR) {
          state.ballVX = Math.abs(state.ballVX) * 1.04;
          state.ballVY += (state.ballY - state.leftY) * 0.8;
        } else if (state.ballX < -0.02) {
          state.rightScore++; resetBall(1);
        }
      }
      if (state.ballX > 0.97 - PADDLE_W) {
        if (Math.abs(state.ballY - state.rightY) < PADDLE_H / 2 + ballR) {
          state.ballVX = -Math.abs(state.ballVX) * 1.04;
          state.ballVY += (state.ballY - state.rightY) * 0.8;
        } else if (state.ballX > 1.02) {
          state.leftScore++; resetBall(-1);
        }
      }

      ctx.fillStyle = "#1a1410";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.setLineDash([8, 10]);
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#fdf3df";
      ctx.fillRect(0.03 * w, (state.leftY - PADDLE_H / 2) * h, PADDLE_W * w, PADDLE_H * h);
      ctx.fillRect((0.97 - PADDLE_W) * w, (state.rightY - PADDLE_H / 2) * h, PADDLE_W * w, PADDLE_H * h);
      ctx.beginPath();
      ctx.arc(state.ballX * w, state.ballY * h, ballR * w, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold " + Math.round(h * 0.08) + "px 'Nunito', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(state.leftScore, w * 0.25, h * 0.14);
      ctx.fillText(state.rightScore, w * 0.75, h * 0.14);

      ctx.font = Math.round(h * 0.03) + "px 'Nunito', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("W / S", w * 0.25, h * 0.96);
      ctx.fillText("\u2191 / \u2193", w * 0.75, h * 0.96);

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return function stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      observer.disconnect();
    };
  }
};

/* ---------------- Grow-the-line (Snake-style) ---------------- */
ARCADE_GAMES.snake = {
  start(canvas) {
    const { ctx, observer, size } = fitCanvasToBox(canvas);
    let raf;
    const COLS = 20, ROWS = 15;
    let snake, dir, nextDir, food, score, gameOver, moveTimer;
    const MOVE_INTERVAL = 130;

    function place() {
      snake = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }];
      dir = { x: 1, y: 0 };
      nextDir = dir;
      score = 0;
      gameOver = false;
      moveTimer = 0;
      spawnFood();
    }
    function spawnFood() {
      let cell;
      do {
        cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some(s => s.x === cell.x && s.y === cell.y));
      food = cell;
    }
    place();

    function onKeyDown(e) {
      const map = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
      };
      const wanted = map[e.key];
      if (wanted) {
        e.preventDefault();
        if (wanted.x === -dir.x && wanted.y === -dir.y) return;
        nextDir = wanted;
      } else if (gameOver) {
        place();
      }
    }
    canvas.addEventListener("pointerdown", () => { if (gameOver) place(); });
    window.addEventListener("keydown", onKeyDown);

    let last = performance.now();
    function loop(now) {
      const dt = now - last; last = now;
      const rect = size();
      const w = rect.width, h = rect.height;
      const cell = Math.min(w / COLS, h / ROWS);
      const offX = (w - cell * COLS) / 2, offY = (h - cell * ROWS) / 2;

      if (!gameOver) {
        moveTimer += dt;
        if (moveTimer >= MOVE_INTERVAL) {
          moveTimer = 0;
          dir = nextDir;
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
          if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
              snake.some(s => s.x === head.x && s.y === head.y)) {
            gameOver = true;
            highScore("snake", score);
          } else {
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
              score++;
              spawnFood();
            } else {
              snake.pop();
            }
          }
        }
      }

      ctx.fillStyle = "#1f3d2e";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#f2784b";
      ctx.fillRect(offX + food.x * cell + 2, offY + food.y * cell + 2, cell - 4, cell - 4);
      ctx.fillStyle = "#f7f1de";
      snake.forEach((s, i) => {
        ctx.globalAlpha = i === 0 ? 1 : 0.85;
        ctx.fillRect(offX + s.x * cell + 1, offY + s.y * cell + 1, cell - 2, cell - 2);
      });
      ctx.globalAlpha = 1;

      ctx.font = "bold " + Math.round(h * 0.05) + "px 'Nunito', sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText("Score: " + score, offX, offY - 8 < 20 ? 24 : offY - 10);
      ctx.textAlign = "right";
      ctx.fillText("Best: " + highScore("snake"), w - offX, offY - 8 < 20 ? 24 : offY - 10);

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold " + Math.round(h * 0.07) + "px 'Nunito', sans-serif";
        ctx.fillText("Game Over!", w / 2, h / 2 - 10);
        ctx.font = Math.round(h * 0.04) + "px 'Nunito', sans-serif";
        ctx.fillText("Click or press a key to try again", w / 2, h / 2 + 26);
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return function stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      observer.disconnect();
    };
  }
};

/* ---------------- Brick Breaker ---------------- */
ARCADE_GAMES.breakout = {
  start(canvas) {
    const { ctx, observer, size } = fitCanvasToBox(canvas);
    let raf;
    const ROWS = 5, COLS = 9;
    const ROW_COLORS = ["#8f1d2b", "#ef8a1d", "#f7a923", "#7c8f4f", "#4a6fa5"];
    let bricks, paddleX, ballX, ballY, ballVX, ballVY, score, lives, gameOver, win;

    function place() {
      bricks = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) bricks.push({ r, c, alive: true });
      }
      paddleX = 0.5;
      ballX = 0.5; ballY = 0.85; ballVX = 0.35; ballVY = -0.55;
      score = 0; lives = 3; gameOver = false; win = false;
    }
    place();

    function onKeyDown(e) {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      if (gameOver && e.key) place();
    }
    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      paddleX = Math.max(0.06, Math.min(0.94, (e.clientX - rect.left) / rect.width));
    }
    function onPointerDown() { if (gameOver) place(); }
    const keys = {};
    function onKeyDownTrack(e) { keys[e.key] = true; }
    function onKeyUpTrack(e) { keys[e.key] = false; }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onKeyDownTrack);
    window.addEventListener("keyup", onKeyUpTrack);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);

    let last = performance.now();
    const PADDLE_W = 0.16, PADDLE_H = 0.025, BALL_R = 0.013;
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const rect = size();
      const w = rect.width, h = rect.height;

      if (!gameOver) {
        if (keys["ArrowLeft"]) paddleX -= 0.9 * dt;
        if (keys["ArrowRight"]) paddleX += 0.9 * dt;
        paddleX = Math.max(PADDLE_W / 2, Math.min(1 - PADDLE_W / 2, paddleX));

        ballX += ballVX * dt;
        ballY += ballVY * dt;
        if (ballX < BALL_R || ballX > 1 - BALL_R) ballVX *= -1;
        if (ballY < BALL_R) ballVY *= -1;

        if (ballY > 0.9 - PADDLE_H && ballY < 0.93 &&
            Math.abs(ballX - paddleX) < PADDLE_W / 2 + BALL_R) {
          ballVY = -Math.abs(ballVY) * 1.02;
          ballVX += (ballX - paddleX) * 0.6;
        } else if (ballY > 1) {
          lives--;
          if (lives <= 0) { gameOver = true; highScore("breakout", score); }
          else { ballX = 0.5; ballY = 0.85; ballVX = 0.35; ballVY = -0.55; }
        }

        const brickW = 1 / COLS, brickH = 0.05;
        const brickTop = 0.08;
        bricks.forEach(b => {
          if (!b.alive) return;
          const bx = b.c * brickW, by = brickTop + b.r * brickH;
          if (ballX > bx && ballX < bx + brickW && ballY > by && ballY < by + brickH) {
            b.alive = false;
            ballVY *= -1;
            score += 10;
          }
        });
        if (bricks.every(b => !b.alive)) { win = true; gameOver = true; highScore("breakout", score); }
      }

      ctx.fillStyle = "#241a10";
      ctx.fillRect(0, 0, w, h);

      const brickW = w / COLS, brickH = 0.05 * h, brickTop = 0.08 * h;
      bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = ROW_COLORS[b.r % ROW_COLORS.length];
        ctx.fillRect(b.c * brickW + 2, brickTop + b.r * brickH + 2, brickW - 4, brickH - 4);
      });

      ctx.fillStyle = "#fdf3df";
      ctx.fillRect((paddleX - PADDLE_W / 2) * w, 0.9 * h, PADDLE_W * w, PADDLE_H * h);
      ctx.beginPath();
      ctx.arc(ballX * w, ballY * h, BALL_R * w, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold " + Math.round(h * 0.045) + "px 'Nunito', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Score: " + score, 10, h * 0.045);
      ctx.textAlign = "right";
      ctx.fillText("Lives: " + Math.max(0, lives), w - 10, h * 0.045);
      ctx.textAlign = "center";
      ctx.fillText("Best: " + highScore("breakout"), w / 2, h * 0.045);

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold " + Math.round(h * 0.07) + "px 'Nunito', sans-serif";
        ctx.fillText(win ? "You Cleared It!" : "Game Over!", w / 2, h / 2 - 10);
        ctx.font = Math.round(h * 0.04) + "px 'Nunito', sans-serif";
        ctx.fillText("Click or press a key to try again", w / 2, h / 2 + 26);
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return function stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keydown", onKeyDownTrack);
      window.removeEventListener("keyup", onKeyUpTrack);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      observer.disconnect();
    };
  }
};
