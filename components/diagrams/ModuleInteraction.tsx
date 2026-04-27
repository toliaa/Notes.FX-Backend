'use client'

export default function ModuleInteraction() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 550" className="w-full min-w-[700px]" style={{ maxHeight: '550px' }}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
          </marker>
          <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Title */}
        <text x="400" y="30" textAnchor="middle" fill="#fafafa" fontSize="16" fontWeight="600">Взаємодія модулів Notes.FX</text>

        {/* Users Module - Left */}
        <g>
          <rect x="50" y="180" width="200" height="200" rx="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
          <text x="150" y="210" textAnchor="middle" fill="#3b82f6" fontSize="15" fontWeight="700">USERS MODULE</text>
          
          <rect x="70" y="230" width="160" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="150" y="252" textAnchor="middle" fill="#94a3b8" fontSize="11">User Model</text>
          
          <rect x="70" y="275" width="160" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="150" y="297" textAnchor="middle" fill="#94a3b8" fontSize="11">JWT Authentication</text>
          
          <rect x="70" y="320" width="160" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="150" y="342" textAnchor="middle" fill="#94a3b8" fontSize="11">Token Management</text>
        </g>

        {/* Notes Module - Center */}
        <g>
          <rect x="300" y="60" width="200" height="280" rx="12" fill="#1e293b" stroke="#22c55e" strokeWidth="3" />
          <text x="400" y="90" textAnchor="middle" fill="#22c55e" fontSize="15" fontWeight="700">NOTES MODULE</text>
          
          <rect x="320" y="110" width="160" height="30" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="400" y="130" textAnchor="middle" fill="#94a3b8" fontSize="10">Note Model</text>
          
          <rect x="320" y="150" width="160" height="30" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="400" y="170" textAnchor="middle" fill="#94a3b8" fontSize="10">Category Model</text>
          
          <rect x="320" y="190" width="160" height="30" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="400" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10">Tag Model</text>
          
          <rect x="320" y="230" width="160" height="30" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="400" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10">Reminder Model</text>
          
          <rect x="320" y="270" width="160" height="30" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="400" y="290" textAnchor="middle" fill="#94a3b8" fontSize="10">Attachment Model</text>
          
          <rect x="320" y="310" width="160" height="20" rx="4" fill="#7c3aed" opacity="0.3" stroke="#8b5cf6" />
          <text x="400" y="324" textAnchor="middle" fill="#c4b5fd" fontSize="9">AI Assistant</text>
        </g>

        {/* Community Module - Right */}
        <g>
          <rect x="550" y="180" width="200" height="200" rx="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
          <text x="650" y="210" textAnchor="middle" fill="#f59e0b" fontSize="15" fontWeight="700">COMMUNITY MODULE</text>
          
          <rect x="570" y="230" width="160" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="650" y="252" textAnchor="middle" fill="#94a3b8" fontSize="11">Like Model</text>
          
          <rect x="570" y="275" width="160" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="650" y="297" textAnchor="middle" fill="#94a3b8" fontSize="11">Comment Model</text>
          
          <rect x="570" y="320" width="160" height="35" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="650" y="342" textAnchor="middle" fill="#94a3b8" fontSize="11">IdeaChain Model</text>
        </g>

        {/* Connections from Users to Notes */}
        <path d="M 250 250 Q 275 200 300 175" stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrowBlue)" />
        <text x="265" y="195" fill="#3b82f6" fontSize="9" transform="rotate(-30, 265, 195)">user_id (FK)</text>

        {/* Connections from Users to Community */}
        <path d="M 250 280 Q 400 400 550 280" stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrowBlue)" strokeDasharray="5,3" />
        <text x="400" y="380" textAnchor="middle" fill="#3b82f6" fontSize="9">user_id (FK)</text>

        {/* Connections from Notes to Community */}
        <path d="M 500 200 Q 525 200 550 250" stroke="#22c55e" strokeWidth="2" fill="none" markerEnd="url(#arrowGreen)" />
        <text x="530" y="210" fill="#22c55e" fontSize="9">note_id (FK)</text>

        {/* Database Layer */}
        <g>
          <rect x="200" y="450" width="400" height="70" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="400" y="480" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="600">PostgreSQL Database</text>
          <text x="400" y="500" textAnchor="middle" fill="#64748b" fontSize="10">Django ORM | Migrations | QuerySets</text>
        </g>

        {/* Arrows to Database */}
        <line x1="150" y1="380" x2="250" y2="450" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
        <line x1="400" y1="340" x2="400" y2="450" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        <line x1="650" y1="380" x2="550" y2="450" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowOrange)" />

        {/* Legend */}
        <g>
          <rect x="620" y="60" width="150" height="100" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="695" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Легенда</text>
          
          <line x1="635" y1="95" x2="665" y2="95" stroke="#3b82f6" strokeWidth="2" />
          <text x="675" y="99" fill="#3b82f6" fontSize="9">Users зв&apos;язок</text>
          
          <line x1="635" y1="115" x2="665" y2="115" stroke="#22c55e" strokeWidth="2" />
          <text x="675" y="119" fill="#22c55e" fontSize="9">Notes зв&apos;язок</text>
          
          <line x1="635" y1="135" x2="665" y2="135" stroke="#f59e0b" strokeWidth="2" />
          <text x="675" y="139" fill="#f59e0b" fontSize="9">Community зв&apos;язок</text>
        </g>
      </svg>
    </div>
  )
}
