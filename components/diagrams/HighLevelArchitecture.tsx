'use client'

export default function HighLevelArchitecture() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 500" className="w-full min-w-[800px]" style={{ maxHeight: '500px' }}>
        <defs>
          <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* Client Layer */}
        <g>
          <rect x="50" y="30" width="180" height="80" rx="8" fill="url(#clientGrad)" opacity="0.9" />
          <text x="140" y="60" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Frontend Client</text>
          <text x="140" y="80" textAnchor="middle" fill="white" fontSize="11" opacity="0.8">React / Mobile App</text>
          <text x="140" y="95" textAnchor="middle" fill="white" fontSize="10" opacity="0.7">HTTP/HTTPS Requests</text>
        </g>

        {/* Arrow from Client to Middleware */}
        <line x1="230" y1="70" x2="310" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="270" y="60" textAnchor="middle" fill="#a1a1aa" fontSize="10">REST API</text>

        {/* Middleware Layer */}
        <g>
          <rect x="320" y="20" width="260" height="100" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <text x="450" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">Django Middleware</text>
          
          <rect x="335" y="55" width="100" height="28" rx="4" fill="#334155" />
          <text x="385" y="74" textAnchor="middle" fill="#94a3b8" fontSize="10">CORS Handler</text>
          
          <rect x="445" y="55" width="120" height="28" rx="4" fill="#334155" />
          <text x="505" y="74" textAnchor="middle" fill="#94a3b8" fontSize="10">JWT Authentication</text>
          
          <rect x="390" y="88" width="120" height="24" rx="4" fill="#334155" />
          <text x="450" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10">Request Validation</text>
        </g>

        {/* Arrow from Middleware to Ninja API */}
        <line x1="450" y1="120" x2="450" y2="160" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Ninja API Router */}
        <g>
          <rect x="320" y="170" width="260" height="60" rx="8" fill="url(#serverGrad)" opacity="0.9" />
          <text x="450" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Django Ninja API Router</text>
          <text x="450" y="215" textAnchor="middle" fill="white" fontSize="11" opacity="0.8">/api/users | /api/notes | /api/community</text>
        </g>

        {/* Arrows to Modules */}
        <line x1="370" y1="230" x2="150" y2="290" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="450" y1="230" x2="450" y2="290" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="530" y1="230" x2="750" y2="290" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Users Module */}
        <g>
          <rect x="50" y="300" width="200" height="90" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="150" y="325" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="600">Users Module</text>
          <text x="150" y="345" textAnchor="middle" fill="#94a3b8" fontSize="10">Authentication & Authorization</text>
          <text x="150" y="360" textAnchor="middle" fill="#64748b" fontSize="9">JWT Token Management</text>
          <text x="150" y="375" textAnchor="middle" fill="#64748b" fontSize="9">User CRUD Operations</text>
        </g>

        {/* Notes Module */}
        <g>
          <rect x="350" y="300" width="200" height="90" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="450" y="325" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="600">Notes Module</text>
          <text x="450" y="345" textAnchor="middle" fill="#94a3b8" fontSize="10">Notes, Categories, Tags</text>
          <text x="450" y="360" textAnchor="middle" fill="#64748b" fontSize="9">Reminders & Attachments</text>
          <text x="450" y="375" textAnchor="middle" fill="#64748b" fontSize="9">AI Assistant Integration</text>
        </g>

        {/* Community Module */}
        <g>
          <rect x="650" y="300" width="200" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="750" y="325" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="600">Community Module</text>
          <text x="750" y="345" textAnchor="middle" fill="#94a3b8" fontSize="10">Social Features</text>
          <text x="750" y="360" textAnchor="middle" fill="#64748b" fontSize="9">Likes & Comments</text>
          <text x="750" y="375" textAnchor="middle" fill="#64748b" fontSize="9">Idea Chains</text>
        </g>

        {/* Arrows to Database */}
        <line x1="150" y1="390" x2="300" y2="450" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="450" y1="390" x2="450" y2="440" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="750" y1="390" x2="600" y2="450" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Database */}
        <g>
          <rect x="300" y="440" width="300" height="50" rx="8" fill="url(#dbGrad)" opacity="0.9" />
          <text x="450" y="465" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">PostgreSQL Database</text>
          <text x="450" y="482" textAnchor="middle" fill="white" fontSize="10" opacity="0.8">Django ORM Models</text>
        </g>

        {/* AI Services */}
        <g>
          <rect x="700" y="170" width="150" height="60" rx="8" fill="url(#aiGrad)" opacity="0.9" />
          <text x="775" y="195" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">AI Services</text>
          <text x="775" y="212" textAnchor="middle" fill="white" fontSize="9" opacity="0.8">Gemini / OpenAI / Ollama</text>
        </g>

        {/* Arrow from Notes to AI */}
        <line x1="550" y1="345" x2="700" y2="200" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
      </svg>
    </div>
  )
}
