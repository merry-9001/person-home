<script setup lang="ts">
import { ref, computed } from 'vue'

const prizes = [
  { label: '🎉 一等奖', color: '#6366f1', chance: 0.02 },
  { label: '🎊 二等奖', color: '#8b5cf6', chance: 0.05 },
  { label: '🎁 三等奖', color: '#06b6d4', chance: 0.1 },
  { label: '🧧 红包 ¥10', color: '#f43f5e', chance: 0.15 },
  { label: '☕ 咖啡券', color: '#f59e0b', chance: 0.2 },
  { label: '🍀 谢谢参与', color: '#64748b', chance: 0.48 },
]

const segAngle = computed(() => 360 / prizes.length)
const spinning = ref(false)
const rotation = ref(0)
const result = ref<string | null>(null)
const history = ref<string[]>([])

function pickPrize(): number {
  const r = Math.random()
  let acc = 0
  for (let i = 0; i < prizes.length; i++) {
    acc += prizes[i]!.chance
    if (r <= acc) return i
  }
  return prizes.length - 1
}

function spin() {
  if (spinning.value) return
  spinning.value = true
  result.value = null

  const idx = pickPrize()
  const targetAngle = segAngle.value * idx + segAngle.value / 2
  const spins = 5 + Math.floor(Math.random() * 3)
  rotation.value += spins * 360 + (360 - targetAngle) - (rotation.value % 360)

  setTimeout(() => {
    spinning.value = false
    const won = prizes[idx]!
    result.value = won.label
    history.value.unshift(won.label)
    if (history.value.length > 10) history.value.pop()
  }, 4200)
}

function pathForSegment(i: number, total: number, r: number): string {
  const startAngle = (i * 360) / total - 90
  const endAngle = ((i + 1) * 360) / total - 90
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180
  const x1 = r + r * Math.cos(startRad)
  const y1 = r + r * Math.sin(startRad)
  const x2 = r + r * Math.cos(endRad)
  const y2 = r + r * Math.sin(endRad)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M${r},${r} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
}

function textTransform(i: number, total: number, r: number): string {
  const midAngle = ((i + 0.5) * 360) / total - 90
  const rad = (midAngle * Math.PI) / 180
  const tx = r + r * 0.6 * Math.cos(rad)
  const ty = r + r * 0.6 * Math.sin(rad)
  return `translate(${tx}, ${ty}) rotate(${midAngle + 90})`
}
</script>

<template>
  <div class="lottery-game">
    <h2 class="game-title">🎰 幸运大转盘</h2>
    <p class="game-desc">点击下方按钮转动转盘，试试你的运气！</p>

    <div class="wheel-area">
      <div class="wheel-container">
        <div class="pointer">▼</div>
        <svg
          class="wheel"
          viewBox="0 0 300 300"
          :style="{ transform: `rotate(${rotation}deg)` }"
        >
          <g v-for="(prize, i) in prizes" :key="i">
            <path
              :d="pathForSegment(i, prizes.length, 150)"
              :fill="prize.color"
              stroke="#1e293b"
              stroke-width="2"
            />
            <text
              :transform="textTransform(i, prizes.length, 150)"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="#fff"
              font-size="12"
              font-weight="600"
            >
              {{ prize.label }}
            </text>
          </g>
          <circle cx="150" cy="150" r="28" fill="#1e293b" stroke="#6366f1" stroke-width="3" />
          <text x="150" y="153" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="11" font-weight="700">GO</text>
        </svg>
      </div>

      <button class="spin-btn" :disabled="spinning" @click="spin">
        <span v-if="spinning" class="spin-text">转动中...</span>
        <span v-else>🎲 开始抽奖</span>
      </button>
    </div>

    <Transition name="result-pop">
      <div v-if="result" class="result-card">
        <span class="result-label">恭喜你获得</span>
        <span class="result-prize">{{ result }}</span>
      </div>
    </Transition>

    <div v-if="history.length" class="history">
      <h3>抽奖记录</h3>
      <ul>
        <li v-for="(h, i) in history" :key="i">{{ h }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.lottery-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.game-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.wheel-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.pointer {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  color: var(--primary);
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.5));
}

.wheel {
  width: 100%;
  height: 100%;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

.spin-btn {
  padding: 14px 40px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  background: var(--gradient-1);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5);
}

.spin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 48px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.result-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.result-prize {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-pop-enter-active {
  animation: popIn 0.4s ease;
}

.result-pop-leave-active {
  animation: popIn 0.3s ease reverse;
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.7) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.history {
  width: 100%;
  max-width: 300px;
}

.history h3 {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 600;
}

.history ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history li {
  padding: 8px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
