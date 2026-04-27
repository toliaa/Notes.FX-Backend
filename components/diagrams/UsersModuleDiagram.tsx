"use client";

export default function UsersModuleDiagram() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
      <svg viewBox="0 0 900 500" className="w-full min-w-[800px]">
        <defs>
          <marker
            id="arrowhead-users"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
          </marker>
          <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="450" y="30" textAnchor="middle" className="fill-white text-xl font-bold">
          Users Module - Детальна архітектура
        </text>

        {/* API Layer */}
        <rect x="50" y="60" width="800" height="100" rx="10" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
        <text x="450" y="85" textAnchor="middle" className="fill-blue-300 text-sm font-semibold">API Layer (api.py)</text>
        
        {/* API Endpoints */}
        <rect x="70" y="100" width="120" height="45" rx="5" fill="url(#usersGrad)" />
        <text x="130" y="127" textAnchor="middle" className="fill-white text-xs font-medium">POST /register</text>
        
        <rect x="210" y="100" width="120" height="45" rx="5" fill="url(#usersGrad)" />
        <text x="270" y="127" textAnchor="middle" className="fill-white text-xs font-medium">POST /login</text>
        
        <rect x="350" y="100" width="120" height="45" rx="5" fill="url(#usersGrad)" />
        <text x="410" y="127" textAnchor="middle" className="fill-white text-xs font-medium">POST /token/refresh</text>
        
        <rect x="490" y="100" width="120" height="45" rx="5" fill="url(#usersGrad)" />
        <text x="550" y="127" textAnchor="middle" className="fill-white text-xs font-medium">GET /me</text>
        
        <rect x="630" y="100" width="100" height="45" rx="5" fill="url(#usersGrad)" />
        <text x="680" y="127" textAnchor="middle" className="fill-white text-xs font-medium">PUT /update</text>
        
        <rect x="750" y="100" width="80" height="45" rx="5" fill="url(#usersGrad)" />
        <text x="790" y="127" textAnchor="middle" className="fill-white text-xs font-medium">DELETE</text>

        {/* Authentication Layer */}
        <rect x="200" y="190" width="250" height="80" rx="10" fill="#1e3a5f" stroke="#10b981" strokeWidth="2" />
        <text x="325" y="215" textAnchor="middle" className="fill-emerald-300 text-sm font-semibold">Authentication (authentication.py)</text>
        <text x="325" y="240" textAnchor="middle" className="fill-slate-300 text-xs">JWTAuthentication</text>
        <text x="325" y="258" textAnchor="middle" className="fill-slate-300 text-xs">Token Validation &amp; User Resolution</text>

        {/* Schemas Layer */}
        <rect x="480" y="190" width="250" height="80" rx="10" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="2" />
        <text x="605" y="215" textAnchor="middle" className="fill-amber-300 text-sm font-semibold">Schemas (schemas.py)</text>
        <text x="605" y="240" textAnchor="middle" className="fill-slate-300 text-xs">UserRegistrationSchema</text>
        <text x="605" y="258" textAnchor="middle" className="fill-slate-300 text-xs">UserLoginSchema, TokenSchema</text>

        {/* Model Layer */}
        <rect x="300" y="300" width="300" height="120" rx="10" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="2" />
        <text x="450" y="325" textAnchor="middle" className="fill-purple-300 text-sm font-semibold">User Model (models.py)</text>
        <text x="450" y="350" textAnchor="middle" className="fill-slate-300 text-xs">id, email, username, password_hash</text>
        <text x="450" y="368" textAnchor="middle" className="fill-slate-300 text-xs">first_name, last_name, avatar</text>
        <text x="450" y="386" textAnchor="middle" className="fill-slate-300 text-xs">is_active, is_verified, created_at</text>
        <text x="450" y="404" textAnchor="middle" className="fill-slate-300 text-xs">AbstractUser + Custom Fields</text>

        {/* Database */}
        <ellipse cx="450" cy="470" rx="100" ry="25" fill="#065f46" stroke="#10b981" strokeWidth="2" />
        <text x="450" y="475" textAnchor="middle" className="fill-white text-sm font-medium">PostgreSQL</text>

        {/* Arrows */}
        <line x1="325" y1="160" x2="325" y2="190" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-users)" />
        <line x1="550" y1="160" x2="550" y2="190" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-users)" />
        <line x1="325" y1="270" x2="400" y2="300" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-users)" />
        <line x1="605" y1="270" x2="500" y2="300" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-users)" />
        <line x1="450" y1="420" x2="450" y2="445" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-users)" />

        {/* Legend */}
        <rect x="50" y="440" width="15" height="15" fill="url(#usersGrad)" />
        <text x="75" y="452" className="fill-slate-300 text-xs">API Endpoints</text>
        
        <rect x="170" y="440" width="15" height="15" fill="#1e3a5f" stroke="#10b981" strokeWidth="1" />
        <text x="195" y="452" className="fill-slate-300 text-xs">Auth Layer</text>
        
        <rect x="270" y="440" width="15" height="15" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="1" />
        <text x="295" y="452" className="fill-slate-300 text-xs">Schemas</text>
        
        <rect x="360" y="440" width="15" height="15" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="1" />
        <text x="385" y="452" className="fill-slate-300 text-xs">Model</text>
      </svg>
    </div>
  );
}
