/**
 * 🛡️ Aegis-RedTeam: 智能体语义防火墙插件 (NPM Entry)
 * 适用于: Eliza, OpenClaw, 以及所有基于 Node.js 的智能体框架
 */

export interface AegisConfig {
    apiKey: string;
    endpoint?: string;
    mode?: 'ENFORCEMENT' | 'MONITOR';
}

export class AegisSkill {
    private apiKey: string;
    private endpoint: string;
    private mode: string;

    constructor(config: AegisConfig) {
        this.apiKey = config.apiKey;
        // 默认连接到你在 Render 部署的 Python 后端地址
        this.endpoint = config.endpoint || "https://aegis-api-server.onrender.com/v1/audit";
        this.mode = config.mode || 'ENFORCEMENT';
    }

    /**
     * 核心拦截函数：在交易签名之前自动触发审计
     * @param intent 智能体当前的意图描述（对话上下文）
     * @param agentId 智能体的唯一标识
     */
    async verifyIntent(intent: string, agentId: string = "default_agent"): Promise<boolean> {
        console.log(`🛡️ [Aegis] 正在审计智能体意图: "${intent.substring(0, 50)}..."`);

        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    intent: intent,
                    agent_id: agentId
                })
            });

            if (!response.ok) {
                throw new Error("Aegis API 响应异常");
            }

            const result = await response.json();

            if (result.status === "BLOCKED") {
                console.error(`🚨 [Aegis 拦截]: 发现风险！原因: ${result.reason}`);
                
                // 强制模式下直接抛出错误，中断后续转账代码运行
                if (this.mode === 'ENFORCEMENT') {
                    throw new Error(`SECURITY_VIOLATION: ${result.reason}`);
                }
                return false;
            }

            console.log("✅ [Aegis 通过]: 意图审计安全。");
            return true;

        } catch (error) {
            // Fail-Safe 机制：如果云端大脑掉线，保守起见拦截大额操作
            console.warn("⚠️ Aegis 审计连接超时或失败，启动 Fail-Safe 策略。");
            if (this.mode === 'ENFORCEMENT') {
                throw new Error("AEGIS_OFFLINE: 为了资产安全，已自动挂起高危操作。");
            }
            return false;
        }
    }
}

export default AegisSkill;
