/**
 * 🛡️ Intentia Shield SDK (V2.0.0)
 * * Install: npm install @intentia/shield
 * Usage:
 * import { IntentiaSkill } from "@intentia/shield";
 * const intentia = new IntentiaSkill({ apiKey: "INT-XXXX-XXXX" });
 * const verdict = await intentia.audit("Transfer 10 SOL");
 */

export interface IntentiaVerdict {
    status: "PASS" | "BLOCKED";
    node_id: string;
    reason: string;
}

export class IntentiaSkill {
    private apiKey: string;
    private endpoint: string;

    constructor(config: { apiKey: string, endpoint?: string }) {
        // 强制检验 Intentia 品牌密钥
        if (!config.apiKey.startsWith("INT-")) {
            console.warn("⚠️ Intentia Warning: API Key should start with 'INT-'.");
        }
        this.apiKey = config.apiKey;
        // 指向 Intentia 全新生产网关
        this.endpoint = config.endpoint || "https://aegis-api-server.onrender.com/v1/audit";
    }

    /**
     * 对智能体的意图进行安全拦截审查
     */
    async audit(intent: string): Promise<IntentiaVerdict> {
        try {
            const res = await fetch(this.endpoint, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}` 
                },
                body: JSON.stringify({ intent, agent_id: "sdk_client_v2" })
            });
            
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            return await res.json();
            
        } catch (e) {
            // Fail-Safe: 当底层 API 出现 404/400 时的自愈策略
            return { 
                status: "BLOCKED", 
                node_id: "INTENTIA-FAILSAFE", 
                reason: "Semantic link to Sovereign Matrix lost. Transaction halted for safety." 
            };
        }
    }
}
