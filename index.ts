/**
 * 🛡️ Intentia Shield SDK (V2.0)
 * Usage:
 * const shield = new IntentiaSkill({ apiKey: "INT-XXXX-XXXX" });
 * const decision = await shield.audit("Transfer 10 SOL");
 */

export interface IntentiaVerdict {
    status: "PASS" | "BLOCKED";
    node_id: string;
    reason: string;
    latency_ms?: number;
}

export class IntentiaSkill {
    private apiKey: string;
    private endpoint: string;

    constructor(config: { apiKey: string, endpoint?: string }) {
        // 强制检查 Key 格式
        if (!config.apiKey.startsWith("INT-")) {
            console.warn("⚠️ Warning: Provided key does not follow Intentia naming convention (INT-...).");
        }
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint || "https://aegis-api-server.onrender.com/v1/audit";
    }

    /**
     * Audit Agent Intent
     */
    async audit(prompt: string): Promise<IntentiaVerdict> {
        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}` 
                },
                body: JSON.stringify({ intent: prompt, agent_id: "sdk_client_v2" })
            });

            if (!response.ok) throw new Error(`Intentia API Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            // Fail-Safe: 默认拦截
            return {
                status: "BLOCKED",
                node_id: "INTENTIA-SDK-FAILSAFE",
                reason: "Audit link interrupted. Transaction suspended for safety."
            };
        }
    }
}
