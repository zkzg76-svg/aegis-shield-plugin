🛡️ Aegis-RedTeam Shield Plugin

The First Semantic Firewall for Agentic Web3.

Aegis is a lightweight, intent-based security plugin designed for autonomous agents (Eliza, OpenClaw). It intercepts malicious semantic injections and logic hijacks before they hit the blockchain.

🚀 Quick Start

1. Installation

npm install @aegis-redteam/shield-plugin


2. Integration

Add Aegis to your agent's transaction workflow:

import { AegisSkill } from "@aegis-redteam/shield-plugin";

const aegis = new AegisSkill({
    apiKey: "YOUR_AEGIS_API_KEY",
    mode: "ENFORCEMENT"
});

// Inside your transfer action:
await aegis.verifyIntent("Transfer 10 SOL to 0x...", "agent_01");


🧠 Why Aegis?

Sub-650ms Latency: Real-time auditing via our global node matrix.

Failover Resilience: Automatically reroutes if upstream LLM nodes (Gemini/Nvidia) fail.

Semantic Defense: Blocks admin-spoofing and social engineering prompts that traditional filters miss.

📄 License

MIT. Built for the 2026 Agentic Economy.
