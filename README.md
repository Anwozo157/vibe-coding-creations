# ✨ Vibe Coding Creations
*Curated & Crafted by Antonio Nwozo*

A portfolio hub of modern, AI-assisted "vibe coding" applications, interactive dashboards, and cloud/network engineering interfaces.

---

## 🚀 Projects Index

| # | Project Name | Tech Stack | Highlights |
| :---: | :--- | :--- | :--- |
| **01** | **[NewConnect Wireless Showcase](./projects/01-newconnect-wireless-showcase)** | React 18, Tailwind CSS, Lucide, Vite | Carrier-grade fixed-wireless & mmWave hardware catalog (Siklu, Ubiquiti, Mimosa) with deep technical specs. |
| **02** | **[AetherVault Command Center](./projects/02-aethervault-command-center)** | React, TypeScript, Framer Motion, Tailwind, Vite | Cybernetic Disaster Recovery HUD with live telemetry tickers, RPO/RTO streaming, and multi-stage failover simulation. |

---

## 📡 01. NewConnect Wireless Showcase
An interactive, high-end dark-mode showcase platform for carrier-grade microwave and millimeter-wave (mmWave) wireless infrastructure.
- **Hardware Catalog:** Siklu EtherHaul 8010 FX (10 Gbps E-Band), Ubiquiti AirFiber 60 XR, Mimosa, and IgniteNet.
- **Deep Technical Specs:** Dynamic modal cards inspecting frequency bands, full-duplex throughput, link budgets, and sub-10-microsecond latency profiles.
- **Run Locally:**
  ```bash
  cd projects/01-newconnect-wireless-showcase
  npm install
  npm run dev
  ```

---

## 🛡️ 02. AetherVault Command Center
A high-tech cybernetic Disaster Recovery simulation HUD and telemetry command center.
- **Live State Machine:** Real-time stream tracking `ACTIVE_SYNC` $\to$ `QUIESCE_AND_SNAPSHOT` $\to$ `HYDRATING_TARGET` $\to$ `DNS_CUTOVER` $\to$ `TARGET_SECURED`.
- **Telemetry Stream:** Live fluctuating RPO (`0.1s - 0.5s`) and estimated RTO countdown.
- **Physics & Motion:** Custom cybernetic radar rings, glowing status badges, and smooth state transitions powered by Framer Motion.
- **Run Locally:**
  ```bash
  cd projects/02-aethervault-command-center
  npm install
  npm run dev
  ```
