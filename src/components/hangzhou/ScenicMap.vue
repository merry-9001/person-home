<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";


type ScenicPoint = {
  name: string;
  tag: string;
  best: string;
  address: string;
  description: string;
  position: number[];
};

type ScenicMapData = {
  title: string;
  description: string;
  emptyKeyTitle: string;
  emptyKeyText: string;
  center: number[];
  zoom: number;
  points: ScenicPoint[];
};

type AMapLoader = {
  load: (options: {
    key: string;
    version: string;
    plugins?: string[];
  }) => Promise<any>;
};

declare global {
  interface Window {
    AMapLoader?: AMapLoader;
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}

const props = defineProps<{
  map: ScenicMapData;
}>();

const rawAmapKey = import.meta.env.VITE_AMAP_KEY as string | undefined;
const rawAmapSecurityCode = import.meta.env.VITE_AMAP_SECURITY_CODE as
  | string
  | undefined;
const amapKey = getConfiguredEnvValue(rawAmapKey);
const amapSecurityCode = getConfiguredEnvValue(rawAmapSecurityCode);

const mapContainer = ref<HTMLDivElement | null>(null);
const selectedIndex = ref(0);
const loadStatus = ref<
  "idle" | "missing-key" | "missing-security" | "loading" | "ready" | "error"
>("idle");

let amapNamespace: any;
let mapInstance: any;
let infoWindow: any;
let markers: any[] = [];

function getConfiguredEnvValue(value?: string) {
  const normalizedValue = value?.trim();
  if (!normalizedValue || normalizedValue.startsWith("your_")) return undefined;
  return normalizedValue;
}

function loadAmapLoader() {
  if (window.AMapLoader) return Promise.resolve(window.AMapLoader);

  return new Promise<AMapLoader>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-amap-loader="true"]',
    );
    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => {
          if (window.AMapLoader) resolve(window.AMapLoader);
          else reject(new Error("AMapLoader is not available"));
        },
        { once: true },
      );
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://webapi.amap.com/loader.js";
    script.async = true;
    script.dataset.amapLoader = "true";
    script.addEventListener(
      "load",
      () => {
        if (window.AMapLoader) resolve(window.AMapLoader);
        else reject(new Error("AMapLoader is not available"));
      },
      { once: true },
    );
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });
}

function getInfoWindowContent(point: ScenicPoint) {
  return `
    <div class="amap-scenic-popup">
      <strong>${point.name}</strong>
      <span>${point.tag} · ${point.best}</span>
      <p>${point.description}</p>
    </div>
  `;
}

function openInfoWindow(index: number) {
  const point = props.map.points[index];
  if (!point || !mapInstance || !infoWindow) return;

  infoWindow.setContent(getInfoWindowContent(point));
  infoWindow.open(mapInstance, point.position);
}

function selectPoint(index: number) {
  selectedIndex.value = index;
  const point = props.map.points[index];
  if (!point || !mapInstance) return;

  mapInstance.panTo(point.position);
  openInfoWindow(index);
}

async function initMap() {
  if (!amapKey) {
    loadStatus.value = "missing-key";
    return;
  }

  if (!amapSecurityCode) {
    loadStatus.value = "missing-security";
    return;
  }

  await nextTick();
  if (!mapContainer.value) return;

  loadStatus.value = "loading";

  try {
    window._AMapSecurityConfig = {
      securityJsCode: amapSecurityCode,
    };

    const loader = await loadAmapLoader();
    if (!loader) throw new Error("AMapLoader is not available");

    amapNamespace = await loader.load({
      key: amapKey,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar"],
    });

    mapInstance = new amapNamespace.Map(mapContainer.value, {
      center: props.map.center,
      zoom: props.map.zoom,
      resizeEnable: true,
      viewMode: "2D",
      showLabel: true,
      features: ["bg", "road", "building", "point"],
    });

    mapInstance.addControl(new amapNamespace.Scale());
    mapInstance.addControl(
      new amapNamespace.ToolBar({
        position: {
          right: "16px",
          top: "16px",
        },
      }),
    );

    infoWindow = new amapNamespace.InfoWindow({
      closeWhenClickMap: true,
      offset: new amapNamespace.Pixel(0, -32),
    });

    markers = props.map.points.map((point, index) => {
      const marker = new amapNamespace.Marker({
        position: point.position,
        title: point.name,
        anchor: "bottom-center",
        content: `<button class="amap-scenic-marker" type="button">${index + 1}</button>`,
      });

      marker.on("click", () => selectPoint(index));
      return marker;
    });

    mapInstance.add(markers);
    mapInstance.setFitView(markers, false, [48, 48, 48, 48]);
    openInfoWindow(0);
    loadStatus.value = "ready";
  } catch (error) {
    console.error("高德地图加载失败：", error);
    loadStatus.value = "error";
  }
}

onMounted(initMap);

onBeforeUnmount(() => {
  infoWindow?.close();
  markers.forEach((marker) => marker?.off?.("click"));
  mapInstance?.destroy();
  markers = [];
  infoWindow = undefined;
  mapInstance = undefined;
  amapNamespace = undefined;
});
</script>

<template>
  <section class="map-section">
    <div class="section-inner">
      <div class="section-header">
        <h2>{{ map.title }}</h2>
        <p>{{ map.description }}</p>
      </div>

      <div class="map-layout">
        <div class="map-shell">
          <div ref="mapContainer" class="map-canvas" />
          <div v-if="loadStatus === 'missing-key'" class="map-state">
            <strong>{{ map.emptyKeyTitle }}</strong>
            <span>{{ map.emptyKeyText }}</span>
          </div>
          <div v-else-if="loadStatus === 'missing-security'" class="map-state">
            <strong>地图安全密钥还没配置</strong>
            <span
              >高德 Web 端 JSAPI 2.0 需要同时填写 Key 和 securityJsCode。</span
            >
          </div>
          <div v-else-if="loadStatus === 'loading'" class="map-state">
            <strong>地图加载中</strong>
            <span>正在把杭州的风景放到地图上。</span>
          </div>
          <div v-else-if="loadStatus === 'error'" class="map-state">
            <strong>地图暂时没有加载成功</strong>
            <span>检查高德 Key、安全密钥和域名白名单后再试。</span>
          </div>
        </div>

        <div class="map-list">
          <button
            v-for="(point, index) in map.points"
            :key="point.name"
            class="map-point"
            :class="{ active: index === selectedIndex }"
            type="button"
            @click="selectPoint(index)"
          >
            <span class="map-point-index">{{ index + 1 }}</span>
            <span class="map-point-content">
              <strong>{{ point.name }}</strong>
              <span>{{ point.tag }} · {{ point.best }}</span>
              <small>{{ point.address }}</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-section {
  padding: 100px 0;
  background:
    linear-gradient(180deg, rgba(6, 182, 212, 0.04), transparent 32%),
    var(--bg-dark);
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.section-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: stretch;
}

.map-shell {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
}

.map-canvas {
  width: 100%;
  height: 100%;
  min-height: 520px;
}

.map-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  text-align: center;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.9)),
    repeating-linear-gradient(
      45deg,
      transparent 0 18px,
      rgba(255, 255, 255, 0.04) 18px 19px
    );
  color: var(--text-primary);
}

.map-state strong {
  font-size: 1.1rem;
}

.map-state span {
  max-width: 360px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.map-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map-point {
  display: flex;
  gap: 14px;
  width: 100%;
  min-height: 76px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.map-point:hover,
.map-point.active {
  border-color: var(--accent);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.map-point-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--gradient-1);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 800;
}

.map-point-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.map-point-content strong {
  color: var(--text-primary);
  font-size: 0.98rem;
  line-height: 1.35;
}

.map-point-content span,
.map-point-content small {
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.5;
}

:global(.amap-scenic-marker) {
  width: 30px;
  height: 30px;
  border: 2px solid #fff;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  line-height: 26px;
  text-align: center;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.35);
  cursor: pointer;
}

:global(.amap-scenic-popup) {
  max-width: 240px;
  color: #0f172a;
}

:global(.amap-scenic-popup strong) {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

:global(.amap-scenic-popup span) {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
}

:global(.amap-scenic-popup p) {
  margin: 0;
  color: #334155;
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .map-layout {
    grid-template-columns: 1fr;
  }

  .map-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .map-section {
    padding: 72px 0;
  }

  .map-shell,
  .map-canvas {
    min-height: 420px;
  }

  .map-list {
    grid-template-columns: 1fr;
  }
}
</style>
