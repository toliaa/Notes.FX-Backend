'use client'

export default function AuthFlowDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 450" className="w-full min-w-[800px]" style={{ maxHeight: '450px' }}>
        <defs>
          <marker id="authArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
          </marker>
          <marker id="authArrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="authArrowGray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* Title */}
        <text x="450" y="30" textAnchor="middle" fill="#fafafa" fontSize="16" fontWeight="600">JWT Authentication Flow</text>

        {/* Client */}
        <g>
          <rect x="50" y="80" width="120" height="300" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="110" y="105" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="600">Client</text>
          <text x="110" y="125" textAnchor="middle" fill="#64748b" fontSize="10">(Frontend)</text>
        </g>

        {/* Backend API */}
        <g>
          <rect x="300" y="80" width="160" height="300" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="380" y="105" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="600">Backend API</text>
          <text x="380" y="125" textAnchor="middle" fill="#64748b" fontSize="10">(Django Ninja)</text>
        </g>

        {/* Database */}
        <g>
          <rect x="600" y="80" width="120" height="300" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="660" y="105" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="600">Database</text>
          <text x="660" y="125" textAnchor="middle" fill="#64748b" fontSize="10">(PostgreSQL)</text>
        </g>

        {/* JWT Token Store */}
        <g>
          <rect x="780" y="180" width="100" height="80" rx="8" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
          <text x="830" y="210" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="600">JWT</text>
          <text x="830" y="230" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="600">Token</text>
          <text x="830" y="250" textAnchor="middle" fill="#64748b" fontSize="9">Access + Refresh</text>
        </g>

        {/* Step 1: Registration */}
        <g>
          <circle cx="30" cy="160" r="15" fill="#3b82f6" />
          <text x="30" y="165" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">1</text>
        </g>
        <line x1="170" y1="160" x2="295" y2="160" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#authArrowBlue)" />
        <text x="230" y="150" textAnchor="middle" fill="#3b82f6" fontSize="9">POST /api/users/register</text>
        <text x="230" y="170" textAnchor="middle" fill="#64748b" fontSize="8">{'{email, password, username}'}</text>

        {/* Step 1b: Save to DB */}
        <line x1="460" y1="160" x2="595" y2="160" stroke="#22c55e" strokeWidth="2" markerEnd="url(#authArrow)" />
        <text x="530" y="150" textAnchor="middle" fill="#22c55e" fontSize="9">CREATE User</text>
        <text x="530" y="170" textAnchor="middle" fill="#64748b" fontSize="8">hash(password)</text>

        {/* Step 2: Login Request */}
        <g>
          <circle cx="30" cy="220" r="15" fill="#3b82f6" />
          <text x="30" y="225" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">2</text>
        </g>
        <line x1="170" y1="220" x2="295" y2="220" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#authArrowBlue)" />
        <text x="230" y="210" textAnchor="middle" fill="#3b82f6" fontSize="9">POST /api/users/login</text>
        <text x="230" y="230" textAnchor="middle" fill="#64748b" fontSize="8">{'{email, password}'}</text>

        {/* Step 2b: Verify credentials */}
        <line x1="460" y1="220" x2="595" y2="220" stroke="#22c55e" strokeWidth="2" markerEnd="url(#authArrow)" />
        <text x="530" y="210" textAnchor="middle" fill="#22c55e" fontSize="9">SELECT User</text>
        <text x="530" y="230" textAnchor="middle" fill="#64748b" fontSize="8">verify password</text>

        {/* Step 2c: Generate JWT */}
        <line x1="460" y1="220" x2="775" y2="220" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#authArrowBlue)" />
        <text x="620" y="195" textAnchor="middle" fill="#8b5cf6" fontSize="8">Generate JWT tokens</text>

        {/* Step 3: Return tokens */}
        <g>
          <circle cx="30" cy="280" r="15" fill="#22c55e" />
          <text x="30" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">3</text>
        </g>
        <line x1="295" y1="280" x2="175" y2="280" stroke="#22c55e" strokeWidth="2" markerEnd="url(#authArrow)" />
        <text x="230" y="270" textAnchor="middle" fill="#22c55e" fontSize="9">200 OK</text>
        <text x="230" y="292" textAnchor="middle" fill="#64748b" fontSize="8">{'{access_token, refresh_token}'}</text>

        {/* Step 4: Protected Request */}
        <g>
          <circle cx="30" cy="340" r="15" fill="#3b82f6" />
          <text x="30" y="345" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">4</text>
        </g>
        <line x1="170" y1="340" x2="295" y2="340" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#authArrowBlue)" />
        <text x="230" y="330" textAnchor="middle" fill="#3b82f6" fontSize="9">GET /api/notes</text>
        <text x="230" y="352" textAnchor="middle" fill="#64748b" fontSize="8">Authorization: Bearer {'{token}'}</text>

        {/* Step 4b: Validate JWT */}
        <rect x="320" y="325" width="120" height="30" rx="4" fill="#0f172a" stroke="#8b5cf6" />
        <text x="380" y="345" textAnchor="middle" fill="#c4b5fd" fontSize="9">JWT Validation</text>

        {/* Step 4c: Fetch data */}
        <line x1="460" y1="340" x2="595" y2="340" stroke="#22c55e" strokeWidth="2" markerEnd="url(#authArrow)" />
        <text x="530" y="330" textAnchor="middle" fill="#22c55e" fontSize="9">SELECT Notes</text>
        <text x="530" y="352" textAnchor="middle" fill="#64748b" fontSize="8">WHERE user_id = jwt.user</text>

        {/* Step 5: Return data */}
        <g>
          <circle cx="30" cy="400" r="15" fill="#22c55e" />
          <text x="30" y="405" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">5</text>
        </g>
        <line x1="295" y1="400" x2="175" y2="400" stroke="#22c55e" strokeWidth="2" markerEnd="url(#authArrow)" />
        <text x="230" y="390" textAnchor="middle" fill="#22c55e" fontSize="9">200 OK</text>
        <text x="230" y="412" textAnchor="middle" fill="#64748b" fontSize="8">{'{notes: [...]}'}</text>

        {/* Legend */}
        <g>
          <rect x="750" y="320" width="130" height="100" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="815" y="340" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Легенда</text>
          
          <line x1="765" y1="355" x2="790" y2="355" stroke="#3b82f6" strokeWidth="2" />
          <text x="800" y="359" fill="#3b82f6" fontSize="8">Request</text>
          
          <line x1="765" y1="375" x2="790" y2="375" stroke="#22c55e" strokeWidth="2" />
          <text x="800" y="379" fill="#22c55e" fontSize="8">Response</text>
          
          <line x1="765" y1="395" x2="790" y2="395" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,3" />
          <text x="800" y="399" fill="#8b5cf6" fontSize="8">JWT Flow</text>
        </g>
      </svg>
    </div>
  )
}
