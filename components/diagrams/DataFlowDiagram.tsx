'use client'

export default function DataFlowDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 380" className="w-full min-w-[800px]" style={{ maxHeight: '380px' }}>
        <defs>
          <marker id="flowArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
          </marker>
          <marker id="flowArrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Title */}
        <text x="450" y="30" textAnchor="middle" fill="#fafafa" fontSize="16" fontWeight="600">Data Flow Diagram</text>

        {/* Layer 1: External */}
        <rect x="30" y="55" width="840" height="55" rx="0" fill="#3b82f6" opacity="0.1" />
        <text x="60" y="75" fill="#3b82f6" fontSize="10" fontWeight="600">EXTERNAL LAYER</text>

        {/* Client */}
        <g>
          <rect x="50" y="65" width="100" height="35" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="100" y="87" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="600">Client</text>
        </g>

        {/* HTTPS Arrow */}
        <line x1="150" y1="82" x2="210" y2="82" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#flowArrowBlue)" />
        <text x="180" y="75" textAnchor="middle" fill="#64748b" fontSize="8">HTTPS</text>

        {/* Layer 2: API Gateway */}
        <rect x="30" y="115" width="840" height="70" rx="0" fill="#22c55e" opacity="0.1" />
        <text x="60" y="135" fill="#22c55e" fontSize="10" fontWeight="600">API GATEWAY LAYER</text>

        {/* CORS */}
        <g>
          <rect x="220" y="65" width="80" height="35" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="260" y="87" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600">CORS</text>
        </g>

        {/* Arrow */}
        <line x1="300" y1="82" x2="350" y2="82" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrowBlue)" />

        {/* Rate Limiter */}
        <g>
          <rect x="360" y="65" width="100" height="35" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="410" y="87" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600">Rate Limiter</text>
        </g>

        {/* Arrow */}
        <line x1="460" y1="82" x2="510" y2="82" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrowBlue)" />

        {/* JWT Auth */}
        <g>
          <rect x="520" y="65" width="110" height="35" rx="6" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
          <text x="575" y="87" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="600">JWT Auth</text>
        </g>

        {/* Arrow down */}
        <line x1="575" y1="100" x2="575" y2="125" stroke="#22c55e" strokeWidth="2" markerEnd="url(#flowArrow)" />

        {/* Ninja Router */}
        <g>
          <rect x="480" y="130" width="190" height="45" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="575" y="150" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="600">Django Ninja Router</text>
          <text x="575" y="168" textAnchor="middle" fill="#64748b" fontSize="9">/api/users | /api/notes | /api/community</text>
        </g>

        {/* Arrows to modules */}
        <line x1="480" y1="155" x2="360" y2="155" stroke="#64748b" strokeWidth="1.5" />
        <line x1="360" y1="155" x2="360" y2="200" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#flowArrowBlue)" />
        
        <line x1="575" y1="175" x2="575" y2="200" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#flowArrowBlue)" />
        
        <line x1="670" y1="155" x2="790" y2="155" stroke="#64748b" strokeWidth="1.5" />
        <line x1="790" y1="155" x2="790" y2="200" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#flowArrowBlue)" />

        {/* Layer 3: Business Logic */}
        <rect x="30" y="190" width="840" height="80" rx="0" fill="#f59e0b" opacity="0.1" />
        <text x="60" y="210" fill="#f59e0b" fontSize="10" fontWeight="600">BUSINESS LOGIC LAYER</text>

        {/* Users API */}
        <g>
          <rect x="280" y="205" width="160" height="55" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="360" y="228" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="600">Users API</text>
          <text x="360" y="248" textAnchor="middle" fill="#64748b" fontSize="8">Schemas | Validators | Handlers</text>
        </g>

        {/* Notes API */}
        <g>
          <rect x="495" y="205" width="160" height="55" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="575" y="228" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="600">Notes API</text>
          <text x="575" y="248" textAnchor="middle" fill="#64748b" fontSize="8">Schemas | Validators | Handlers</text>
        </g>

        {/* Community API */}
        <g>
          <rect x="710" y="205" width="160" height="55" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="790" y="228" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600">Community API</text>
          <text x="790" y="248" textAnchor="middle" fill="#64748b" fontSize="8">Schemas | Validators | Handlers</text>
        </g>

        {/* Arrows to ORM */}
        <line x1="360" y1="260" x2="360" y2="290" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#flowArrowBlue)" />
        <line x1="575" y1="260" x2="575" y2="290" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#flowArrowBlue)" />
        <line x1="790" y1="260" x2="790" y2="290" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#flowArrowBlue)" />

        {/* Layer 4: Data Access */}
        <rect x="30" y="280" width="840" height="90" rx="0" fill="#8b5cf6" opacity="0.1" />
        <text x="60" y="300" fill="#8b5cf6" fontSize="10" fontWeight="600">DATA ACCESS LAYER</text>

        {/* Django ORM */}
        <g>
          <rect x="400" y="295" width="350" height="35" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
          <text x="575" y="318" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="600">Django ORM (Models | QuerySets | Migrations)</text>
        </g>

        {/* Arrow to DB */}
        <line x1="575" y1="330" x2="575" y2="355" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#flowArrowBlue)" />

        {/* Database */}
        <g>
          <rect x="450" y="340" width="250" height="30" rx="8" fill="#f59e0b" opacity="0.9" />
          <text x="575" y="360" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">PostgreSQL Database</text>
        </g>

        {/* AI Service - External */}
        <g>
          <rect x="50" y="125" width="120" height="50" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
          <text x="110" y="147" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="600">AI Services</text>
          <text x="110" y="165" textAnchor="middle" fill="#64748b" fontSize="8">Gemini/OpenAI/Ollama</text>
        </g>

        {/* Arrow from Notes to AI */}
        <line x1="495" y1="232" x2="175" y2="150" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,2" />

        {/* Legend */}
        <g>
          <rect x="50" y="220" width="180" height="80" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="140" y="240" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Data Flow Legend</text>
          
          <line x1="65" y1="258" x2="90" y2="258" stroke="#3b82f6" strokeWidth="2" />
          <text x="100" y="262" fill="#64748b" fontSize="8">Request flow</text>
          
          <line x1="65" y1="278" x2="90" y2="278" stroke="#22c55e" strokeWidth="2" />
          <text x="100" y="282" fill="#64748b" fontSize="8">Response flow</text>
          
          <line x1="65" y1="298" x2="90" y2="298" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4,2" />
          <text x="100" y="302" fill="#64748b" fontSize="8">External integration</text>
        </g>
      </svg>
    </div>
  )
}
