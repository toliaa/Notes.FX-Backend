'use client'

export default function AIIntegrationDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 850 400" className="w-full min-w-[750px]" style={{ maxHeight: '400px' }}>
        <defs>
          <linearGradient id="aiGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <marker id="aiArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
          </marker>
          <marker id="aiArrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* Title */}
        <text x="425" y="30" textAnchor="middle" fill="#fafafa" fontSize="16" fontWeight="600">AI Assistant Integration Architecture</text>

        {/* User Request */}
        <g>
          <rect x="30" y="100" width="140" height="80" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="100" y="130" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600">Client Request</text>
          <text x="100" y="150" textAnchor="middle" fill="#64748b" fontSize="9">POST /api/notes/</text>
          <text x="100" y="165" textAnchor="middle" fill="#64748b" fontSize="9">ai-assistant</text>
        </g>

        {/* Arrow to API */}
        <line x1="170" y1="140" x2="230" y2="140" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#aiArrowGray)" />

        {/* Notes API */}
        <g>
          <rect x="240" y="80" width="160" height="120" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="320" y="105" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="600">Notes API</text>
          
          <rect x="255" y="115" width="130" height="25" rx="4" fill="#0f172a" stroke="#334155" />
          <text x="320" y="132" textAnchor="middle" fill="#94a3b8" fontSize="9">AIAssistantRouter</text>
          
          <rect x="255" y="150" width="130" height="25" rx="4" fill="#0f172a" stroke="#334155" />
          <text x="320" y="167" textAnchor="middle" fill="#94a3b8" fontSize="9">Context Preparation</text>
          
          <rect x="255" y="180" width="130" height="15" rx="3" fill="#8b5cf6" opacity="0.2" />
          <text x="320" y="191" textAnchor="middle" fill="#c4b5fd" fontSize="8">Provider Selection</text>
        </g>

        {/* Arrow to AI Providers */}
        <line x1="400" y1="140" x2="470" y2="90" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#aiArrow)" />
        <line x1="400" y1="140" x2="470" y2="170" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#aiArrow)" />
        <line x1="400" y1="140" x2="470" y2="250" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#aiArrow)" />

        {/* Google Gemini */}
        <g>
          <rect x="480" y="50" width="150" height="70" rx="8" fill="url(#aiGradPurple)" opacity="0.9" />
          <text x="555" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Google Gemini</text>
          <text x="555" y="95" textAnchor="middle" fill="white" fontSize="9" opacity="0.8">gemini-2.0-flash</text>
          <text x="555" y="110" textAnchor="middle" fill="white" fontSize="8" opacity="0.6">Primary Provider</text>
        </g>

        {/* OpenAI */}
        <g>
          <rect x="480" y="135" width="150" height="70" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
          <text x="555" y="160" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="600">OpenAI</text>
          <text x="555" y="180" textAnchor="middle" fill="#94a3b8" fontSize="9">GPT-4 / GPT-3.5</text>
          <text x="555" y="195" textAnchor="middle" fill="#64748b" fontSize="8">Fallback Provider</text>
        </g>

        {/* Ollama */}
        <g>
          <rect x="480" y="220" width="150" height="70" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
          <text x="555" y="245" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="600">Ollama</text>
          <text x="555" y="265" textAnchor="middle" fill="#94a3b8" fontSize="9">Local LLM</text>
          <text x="555" y="280" textAnchor="middle" fill="#64748b" fontSize="8">Self-hosted Option</text>
        </g>

        {/* Response Flow */}
        <line x1="630" y1="85" x2="700" y2="140" stroke="#22c55e" strokeWidth="2" markerEnd="url(#aiArrowGray)" />
        <line x1="630" y1="170" x2="700" y2="140" stroke="#22c55e" strokeWidth="2" markerEnd="url(#aiArrowGray)" />
        <line x1="630" y1="255" x2="700" y2="140" stroke="#22c55e" strokeWidth="2" markerEnd="url(#aiArrowGray)" />

        {/* Response Processing */}
        <g>
          <rect x="700" y="100" width="130" height="80" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="765" y="125" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="600">Response</text>
          <text x="765" y="145" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="600">Processing</text>
          <text x="765" y="165" textAnchor="middle" fill="#64748b" fontSize="9">Format & Validate</text>
        </g>

        {/* AI Features Box */}
        <g>
          <rect x="240" y="250" width="400" height="130" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <text x="440" y="275" textAnchor="middle" fill="#fafafa" fontSize="12" fontWeight="600">AI Assistant Features</text>
          
          <rect x="260" y="290" width="110" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6" />
          <text x="315" y="308" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="600">Summarize</text>
          <text x="315" y="322" textAnchor="middle" fill="#64748b" fontSize="8">Note content</text>
          
          <rect x="385" y="290" width="110" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6" />
          <text x="440" y="308" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="600">Suggest</text>
          <text x="440" y="322" textAnchor="middle" fill="#64748b" fontSize="8">Tags & Categories</text>
          
          <rect x="510" y="290" width="110" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6" />
          <text x="565" y="308" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="600">Generate</text>
          <text x="565" y="322" textAnchor="middle" fill="#64748b" fontSize="8">Content ideas</text>
          
          <rect x="260" y="340" width="110" height="30" rx="6" fill="#1e293b" stroke="#6366f1" />
          <text x="315" y="360" textAnchor="middle" fill="#a5b4fc" fontSize="9">Chat Mode</text>
          
          <rect x="385" y="340" width="110" height="30" rx="6" fill="#1e293b" stroke="#6366f1" />
          <text x="440" y="360" textAnchor="middle" fill="#a5b4fc" fontSize="9">Q&A About Notes</text>
          
          <rect x="510" y="340" width="110" height="30" rx="6" fill="#1e293b" stroke="#6366f1" />
          <text x="565" y="360" textAnchor="middle" fill="#a5b4fc" fontSize="9">Auto Improve</text>
        </g>

        {/* Arrow from API to Features */}
        <line x1="320" y1="200" x2="320" y2="245" stroke="#64748b" strokeWidth="2" markerEnd="url(#aiArrowGray)" />

        {/* Provider Selection Logic */}
        <g>
          <rect x="30" y="220" width="180" height="100" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="120" y="245" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Provider Selection</text>
          
          <text x="45" y="270" fill="#64748b" fontSize="9">1. Check GEMINI_API_KEY</text>
          <text x="45" y="285" fill="#64748b" fontSize="9">2. Fallback: OPENAI_KEY</text>
          <text x="45" y="300" fill="#64748b" fontSize="9">3. Local: OLLAMA_HOST</text>
          <text x="45" y="315" fill="#64748b" fontSize="9">4. Error if none set</text>
        </g>
      </svg>
    </div>
  )
}
