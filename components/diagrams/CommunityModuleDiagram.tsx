"use client";

export default function CommunityModuleDiagram() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
      <svg viewBox="0 0 950 550" className="w-full min-w-[850px]">
        <defs>
          <marker
            id="arrowhead-community"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
          </marker>
          <linearGradient id="communityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="socialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="475" y="30" textAnchor="middle" className="fill-white text-xl font-bold">
          Community Module - Детальна архітектура
        </text>

        {/* API Layer */}
        <rect x="50" y="50" width="850" height="85" rx="10" fill="#1e3a5f" stroke="#10b981" strokeWidth="2" />
        <text x="475" y="75" textAnchor="middle" className="fill-emerald-300 text-sm font-semibold">API Layer (api.py) - CommunityRouter</text>
        
        {/* API Endpoints */}
        <rect x="70" y="90" width="100" height="35" rx="5" fill="url(#communityGrad)" />
        <text x="120" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /public</text>
        
        <rect x="180" y="90" width="100" height="35" rx="5" fill="url(#communityGrad)" />
        <text x="230" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /feed</text>
        
        <rect x="290" y="90" width="120" height="35" rx="5" fill="url(#socialGrad)" />
        <text x="350" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">POST /like/{"{id}"}</text>
        
        <rect x="420" y="90" width="120" height="35" rx="5" fill="url(#socialGrad)" />
        <text x="480" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">DELETE /unlike</text>
        
        <rect x="550" y="90" width="115" height="35" rx="5" fill="url(#socialGrad)" />
        <text x="607" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">POST /comment</text>
        
        <rect x="675" y="90" width="100" height="35" rx="5" fill="url(#communityGrad)" />
        <text x="725" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /chains</text>
        
        <rect x="785" y="90" width="100" height="35" rx="5" fill="url(#communityGrad)" />
        <text x="835" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">POST /chain</text>

        {/* Models Section */}
        <text x="475" y="165" textAnchor="middle" className="fill-slate-300 text-sm font-semibold">Models Layer</text>

        {/* Like Model */}
        <rect x="50" y="185" width="200" height="120" rx="10" fill="#1e3a5f" stroke="#ec4899" strokeWidth="2" />
        <text x="150" y="210" textAnchor="middle" className="fill-pink-300 text-sm font-semibold">Like</text>
        <text x="150" y="235" textAnchor="middle" className="fill-slate-300 text-xs">id</text>
        <text x="150" y="253" textAnchor="middle" className="fill-slate-300 text-xs">user_id (FK to User)</text>
        <text x="150" y="271" textAnchor="middle" className="fill-slate-300 text-xs">note_id (FK to Note)</text>
        <text x="150" y="289" textAnchor="middle" className="fill-slate-300 text-xs">created_at</text>

        {/* Comment Model */}
        <rect x="280" y="185" width="200" height="140" rx="10" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="2" />
        <text x="380" y="210" textAnchor="middle" className="fill-amber-300 text-sm font-semibold">Comment</text>
        <text x="380" y="235" textAnchor="middle" className="fill-slate-300 text-xs">id, content</text>
        <text x="380" y="253" textAnchor="middle" className="fill-slate-300 text-xs">user_id (FK to User)</text>
        <text x="380" y="271" textAnchor="middle" className="fill-slate-300 text-xs">note_id (FK to Note)</text>
        <text x="380" y="289" textAnchor="middle" className="fill-slate-300 text-xs">parent_id (FK to Comment)</text>
        <text x="380" y="307" textAnchor="middle" className="fill-slate-300 text-xs">created_at, updated_at</text>

        {/* IdeaChain Model */}
        <rect x="510" y="185" width="200" height="120" rx="10" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="2" />
        <text x="610" y="210" textAnchor="middle" className="fill-purple-300 text-sm font-semibold">IdeaChain</text>
        <text x="610" y="235" textAnchor="middle" className="fill-slate-300 text-xs">id, title, description</text>
        <text x="610" y="253" textAnchor="middle" className="fill-slate-300 text-xs">creator_id (FK to User)</text>
        <text x="610" y="271" textAnchor="middle" className="fill-slate-300 text-xs">is_public</text>
        <text x="610" y="289" textAnchor="middle" className="fill-slate-300 text-xs">created_at</text>

        {/* ChainLink Model */}
        <rect x="740" y="185" width="200" height="140" rx="10" fill="#1e3a5f" stroke="#06b6d4" strokeWidth="2" />
        <text x="840" y="210" textAnchor="middle" className="fill-cyan-300 text-sm font-semibold">ChainLink</text>
        <text x="840" y="235" textAnchor="middle" className="fill-slate-300 text-xs">id, order</text>
        <text x="840" y="253" textAnchor="middle" className="fill-slate-300 text-xs">chain_id (FK to IdeaChain)</text>
        <text x="840" y="271" textAnchor="middle" className="fill-slate-300 text-xs">note_id (FK to Note)</text>
        <text x="840" y="289" textAnchor="middle" className="fill-slate-300 text-xs">added_by_id (FK to User)</text>
        <text x="840" y="307" textAnchor="middle" className="fill-slate-300 text-xs">created_at</text>

        {/* External Dependencies Box */}
        <rect x="50" y="360" width="350" height="100" rx="10" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
        <text x="225" y="385" textAnchor="middle" className="fill-blue-300 text-sm font-semibold">Залежності від інших модулів</text>
        
        <rect x="70" y="400" width="130" height="40" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
        <text x="135" y="425" textAnchor="middle" className="fill-blue-200 text-xs">Users Module</text>
        
        <rect x="220" y="400" width="160" height="40" rx="5" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="1" />
        <text x="300" y="425" textAnchor="middle" className="fill-amber-200 text-xs">Notes Module (Note)</text>

        {/* Features Box */}
        <rect x="430" y="360" width="250" height="100" rx="10" fill="#1e3a5f" stroke="#10b981" strokeWidth="2" />
        <text x="555" y="385" textAnchor="middle" className="fill-emerald-300 text-sm font-semibold">Ключові функції</text>
        <text x="555" y="410" textAnchor="middle" className="fill-slate-300 text-xs">Соціальна взаємодія (лайки)</text>
        <text x="555" y="430" textAnchor="middle" className="fill-slate-300 text-xs">Коментування нотаток</text>
        <text x="555" y="450" textAnchor="middle" className="fill-slate-300 text-xs">Ланцюги ідей для колаборації</text>

        {/* Database */}
        <rect x="710" y="360" width="230" height="100" rx="10" fill="#1e3a5f" stroke="#ef4444" strokeWidth="2" />
        <text x="825" y="385" textAnchor="middle" className="fill-red-300 text-sm font-semibold">Унікальні обмеження</text>
        <text x="825" y="410" textAnchor="middle" className="fill-slate-300 text-xs">Like: unique(user_id, note_id)</text>
        <text x="825" y="430" textAnchor="middle" className="fill-slate-300 text-xs">ChainLink: unique(chain_id, note_id)</text>
        <text x="825" y="450" textAnchor="middle" className="fill-slate-300 text-xs">Comment: self-referential FK</text>

        {/* Database */}
        <ellipse cx="475" cy="510" rx="100" ry="25" fill="#065f46" stroke="#10b981" strokeWidth="2" />
        <text x="475" y="515" textAnchor="middle" className="fill-white text-sm font-medium">PostgreSQL</text>

        {/* Arrows */}
        <line x1="150" y1="305" x2="150" y2="360" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4" />
        <line x1="380" y1="325" x2="300" y2="400" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4" />
        <line x1="610" y1="305" x2="610" y2="340" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="710" y1="250" x2="740" y2="250" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrowhead-community)" />
        <line x1="475" y1="460" x2="475" y2="485" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-community)" />

        {/* Legend */}
        <rect x="50" y="500" width="15" height="15" fill="url(#communityGrad)" />
        <text x="75" y="512" className="fill-slate-300 text-xs">Community API</text>
        
        <rect x="180" y="500" width="15" height="15" fill="url(#socialGrad)" />
        <text x="205" y="512" className="fill-slate-300 text-xs">Social API</text>
        
        <rect x="290" y="500" width="15" height="15" fill="#1e3a5f" stroke="#ec4899" strokeWidth="1" />
        <text x="315" y="512" className="fill-slate-300 text-xs">Like</text>
        
        <rect x="360" y="500" width="15" height="15" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="1" />
        <text x="385" y="512" className="fill-slate-300 text-xs">Comment</text>
        
        <rect x="460" y="500" width="15" height="15" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="1" />
        <text x="485" y="512" className="fill-slate-300 text-xs">IdeaChain</text>
        
        <rect x="560" y="500" width="15" height="15" fill="#1e3a5f" stroke="#06b6d4" strokeWidth="1" />
        <text x="585" y="512" className="fill-slate-300 text-xs">ChainLink</text>
      </svg>
    </div>
  );
}
