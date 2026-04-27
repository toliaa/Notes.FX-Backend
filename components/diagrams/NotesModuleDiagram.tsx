"use client";

export default function NotesModuleDiagram() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
      <svg viewBox="0 0 1000 650" className="w-full min-w-[900px]">
        <defs>
          <marker
            id="arrowhead-notes"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
          </marker>
          <linearGradient id="notesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="500" y="30" textAnchor="middle" className="fill-white text-xl font-bold">
          Notes Module - Детальна архітектура
        </text>

        {/* API Layer */}
        <rect x="30" y="50" width="940" height="90" rx="10" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="2" />
        <text x="500" y="75" textAnchor="middle" className="fill-amber-300 text-sm font-semibold">API Layer (api.py) - NoteRouter</text>
        
        {/* API Endpoints Row 1 */}
        <rect x="50" y="90" width="85" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="92" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /notes</text>
        
        <rect x="145" y="90" width="85" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="187" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">POST /notes</text>
        
        <rect x="240" y="90" width="95" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="287" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /notes/{"{id}"}</text>
        
        <rect x="345" y="90" width="90" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="390" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">PUT /notes/{"{id}"}</text>
        
        <rect x="445" y="90" width="95" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="492" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">DELETE /notes</text>
        
        <rect x="550" y="90" width="95" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="597" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /categories</text>
        
        <rect x="655" y="90" width="85" height="35" rx="5" fill="url(#notesGrad)" />
        <text x="697" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">GET /tags</text>
        
        <rect x="750" y="90" width="95" height="35" rx="5" fill="url(#aiGrad)" />
        <text x="797" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">POST /ai/chat</text>
        
        <rect x="855" y="90" width="100" height="35" rx="5" fill="url(#aiGrad)" />
        <text x="905" y="112" textAnchor="middle" className="fill-white text-[10px] font-medium">POST /ai/suggest</text>

        {/* Models Section */}
        <text x="500" y="170" textAnchor="middle" className="fill-slate-300 text-sm font-semibold">Models Layer</text>
        
        {/* Note Model */}
        <rect x="50" y="190" width="200" height="150" rx="10" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="2" />
        <text x="150" y="215" textAnchor="middle" className="fill-amber-300 text-sm font-semibold">Note</text>
        <text x="150" y="240" textAnchor="middle" className="fill-slate-300 text-xs">id, title, content</text>
        <text x="150" y="258" textAnchor="middle" className="fill-slate-300 text-xs">user_id (FK to User)</text>
        <text x="150" y="276" textAnchor="middle" className="fill-slate-300 text-xs">category_id (FK)</text>
        <text x="150" y="294" textAnchor="middle" className="fill-slate-300 text-xs">is_pinned, is_archived</text>
        <text x="150" y="312" textAnchor="middle" className="fill-slate-300 text-xs">is_public, color</text>
        <text x="150" y="330" textAnchor="middle" className="fill-slate-300 text-xs">created_at, updated_at</text>

        {/* Category Model */}
        <rect x="280" y="190" width="180" height="100" rx="10" fill="#1e3a5f" stroke="#10b981" strokeWidth="2" />
        <text x="370" y="215" textAnchor="middle" className="fill-emerald-300 text-sm font-semibold">Category</text>
        <text x="370" y="240" textAnchor="middle" className="fill-slate-300 text-xs">id, name, color</text>
        <text x="370" y="258" textAnchor="middle" className="fill-slate-300 text-xs">user_id (FK to User)</text>
        <text x="370" y="276" textAnchor="middle" className="fill-slate-300 text-xs">created_at</text>

        {/* Tag Model */}
        <rect x="490" y="190" width="180" height="100" rx="10" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="2" />
        <text x="580" y="215" textAnchor="middle" className="fill-purple-300 text-sm font-semibold">Tag</text>
        <text x="580" y="240" textAnchor="middle" className="fill-slate-300 text-xs">id, name</text>
        <text x="580" y="258" textAnchor="middle" className="fill-slate-300 text-xs">user_id (FK to User)</text>
        <text x="580" y="276" textAnchor="middle" className="fill-slate-300 text-xs">created_at</text>

        {/* NoteTag Model */}
        <rect x="700" y="190" width="150" height="80" rx="10" fill="#1e3a5f" stroke="#ec4899" strokeWidth="2" />
        <text x="775" y="215" textAnchor="middle" className="fill-pink-300 text-sm font-semibold">NoteTag</text>
        <text x="775" y="240" textAnchor="middle" className="fill-slate-300 text-xs">note_id (FK)</text>
        <text x="775" y="258" textAnchor="middle" className="fill-slate-300 text-xs">tag_id (FK)</text>

        {/* Reminder Model */}
        <rect x="50" y="370" width="200" height="110" rx="10" fill="#1e3a5f" stroke="#ef4444" strokeWidth="2" />
        <text x="150" y="395" textAnchor="middle" className="fill-red-300 text-sm font-semibold">Reminder</text>
        <text x="150" y="420" textAnchor="middle" className="fill-slate-300 text-xs">id, note_id (FK)</text>
        <text x="150" y="438" textAnchor="middle" className="fill-slate-300 text-xs">remind_at, is_completed</text>
        <text x="150" y="456" textAnchor="middle" className="fill-slate-300 text-xs">repeat_type, repeat_interval</text>
        <text x="150" y="474" textAnchor="middle" className="fill-slate-300 text-xs">created_at</text>

        {/* Attachment Model */}
        <rect x="280" y="320" width="180" height="100" rx="10" fill="#1e3a5f" stroke="#06b6d4" strokeWidth="2" />
        <text x="370" y="345" textAnchor="middle" className="fill-cyan-300 text-sm font-semibold">Attachment</text>
        <text x="370" y="370" textAnchor="middle" className="fill-slate-300 text-xs">id, note_id (FK)</text>
        <text x="370" y="388" textAnchor="middle" className="fill-slate-300 text-xs">file, file_name</text>
        <text x="370" y="406" textAnchor="middle" className="fill-slate-300 text-xs">file_type, file_size</text>

        {/* AI Services */}
        <rect x="550" y="350" width="400" height="130" rx="10" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="2" />
        <text x="750" y="375" textAnchor="middle" className="fill-purple-300 text-sm font-semibold">AI Services (ai_service.py)</text>
        
        <rect x="570" y="395" width="110" height="35" rx="5" fill="url(#aiGrad)" />
        <text x="625" y="417" textAnchor="middle" className="fill-white text-xs">Gemini</text>
        
        <rect x="695" y="395" width="110" height="35" rx="5" fill="url(#aiGrad)" />
        <text x="750" y="417" textAnchor="middle" className="fill-white text-xs">OpenAI</text>
        
        <rect x="820" y="395" width="110" height="35" rx="5" fill="url(#aiGrad)" />
        <text x="875" y="417" textAnchor="middle" className="fill-white text-xs">Ollama</text>

        <text x="750" y="465" textAnchor="middle" className="fill-slate-300 text-xs">Chat, Summarize, Suggest Tags</text>

        {/* Relationships */}
        <line x1="250" y1="265" x2="280" y2="240" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowhead-notes)" strokeDasharray="4" />
        <line x1="250" y1="265" x2="490" y2="240" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowhead-notes)" strokeDasharray="4" />
        <line x1="670" y1="230" x2="700" y2="230" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowhead-notes)" strokeDasharray="4" />
        <line x1="150" y1="340" x2="150" y2="370" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowhead-notes)" strokeDasharray="4" />
        <line x1="250" y1="315" x2="280" y2="345" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowhead-notes)" strokeDasharray="4" />

        {/* Database */}
        <ellipse cx="150" cy="530" rx="100" ry="25" fill="#065f46" stroke="#10b981" strokeWidth="2" />
        <text x="150" y="535" textAnchor="middle" className="fill-white text-sm font-medium">PostgreSQL</text>

        {/* External APIs */}
        <ellipse cx="750" cy="530" rx="80" ry="25" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" />
        <text x="750" y="535" textAnchor="middle" className="fill-white text-sm font-medium">External AI APIs</text>

        {/* Arrows to DB and External */}
        <line x1="150" y1="480" x2="150" y2="505" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-notes)" />
        <line x1="750" y1="480" x2="750" y2="505" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowhead-notes)" />

        {/* Legend */}
        <rect x="30" y="580" width="15" height="15" fill="url(#notesGrad)" />
        <text x="55" y="592" className="fill-slate-300 text-xs">Notes API</text>
        
        <rect x="130" y="580" width="15" height="15" fill="url(#aiGrad)" />
        <text x="155" y="592" className="fill-slate-300 text-xs">AI Endpoints</text>
        
        <rect x="240" y="580" width="15" height="15" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="1" />
        <text x="265" y="592" className="fill-slate-300 text-xs">Note</text>
        
        <rect x="310" y="580" width="15" height="15" fill="#1e3a5f" stroke="#10b981" strokeWidth="1" />
        <text x="335" y="592" className="fill-slate-300 text-xs">Category</text>
        
        <rect x="400" y="580" width="15" height="15" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="1" />
        <text x="425" y="592" className="fill-slate-300 text-xs">Tag</text>
        
        <rect x="465" y="580" width="15" height="15" fill="#1e3a5f" stroke="#ef4444" strokeWidth="1" />
        <text x="490" y="592" className="fill-slate-300 text-xs">Reminder</text>
        
        <rect x="560" y="580" width="15" height="15" fill="#1e3a5f" stroke="#06b6d4" strokeWidth="1" />
        <text x="585" y="592" className="fill-slate-300 text-xs">Attachment</text>

        <text x="700" y="592" className="fill-slate-400 text-xs">--- FK зв&apos;язок</text>
      </svg>
    </div>
  );
}
