'use client'

export default function ERDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 1000 700" className="w-full min-w-[900px]" style={{ maxHeight: '700px' }}>
        <defs>
          <marker id="erArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
          <marker id="oneMarker" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <line x1="5" y1="0" x2="5" y2="10" stroke="#64748b" strokeWidth="2" />
          </marker>
          <marker id="manyMarker" markerWidth="12" markerHeight="10" refX="6" refY="5" orient="auto">
            <line x1="0" y1="0" x2="6" y2="5" stroke="#64748b" strokeWidth="2" />
            <line x1="0" y1="10" x2="6" y2="5" stroke="#64748b" strokeWidth="2" />
            <line x1="6" y1="0" x2="6" y2="10" stroke="#64748b" strokeWidth="2" />
          </marker>
        </defs>

        {/* Title */}
        <text x="500" y="30" textAnchor="middle" fill="#fafafa" fontSize="16" fontWeight="600">ER-Діаграма бази даних Notes.FX</text>

        {/* User Table */}
        <g>
          <rect x="30" y="60" width="200" height="200" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <rect x="30" y="60" width="200" height="35" rx="8" fill="#3b82f6" />
          <text x="130" y="83" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">User</text>
          
          <text x="45" y="110" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="70" y="110" fill="#e2e8f0" fontSize="10">id: UUID</text>
          
          <text x="45" y="130" fill="#94a3b8" fontSize="10">email: VARCHAR(255)</text>
          <text x="45" y="150" fill="#94a3b8" fontSize="10">username: VARCHAR(150)</text>
          <text x="45" y="170" fill="#94a3b8" fontSize="10">password: VARCHAR(128)</text>
          <text x="45" y="190" fill="#94a3b8" fontSize="10">first_name: VARCHAR(30)</text>
          <text x="45" y="210" fill="#94a3b8" fontSize="10">last_name: VARCHAR(150)</text>
          <text x="45" y="230" fill="#94a3b8" fontSize="10">date_joined: DATETIME</text>
          <text x="45" y="250" fill="#94a3b8" fontSize="10">is_active: BOOLEAN</text>
        </g>

        {/* Category Table */}
        <g>
          <rect x="280" y="60" width="180" height="140" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="280" y="60" width="180" height="35" rx="8" fill="#22c55e" />
          <text x="370" y="83" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Category</text>
          
          <text x="295" y="110" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="320" y="110" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="295" y="130" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="320" y="130" fill="#60a5fa" fontSize="10">user_id: UUID</text>
          
          <text x="295" y="150" fill="#94a3b8" fontSize="10">name: VARCHAR(100)</text>
          <text x="295" y="170" fill="#94a3b8" fontSize="10">color: VARCHAR(7)</text>
          <text x="295" y="190" fill="#94a3b8" fontSize="10">created_at: DATETIME</text>
        </g>

        {/* Note Table */}
        <g>
          <rect x="510" y="60" width="200" height="240" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="510" y="60" width="200" height="35" rx="8" fill="#22c55e" />
          <text x="610" y="83" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Note</text>
          
          <text x="525" y="110" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="550" y="110" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="525" y="130" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="550" y="130" fill="#60a5fa" fontSize="10">user_id: UUID</text>
          
          <text x="525" y="150" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="550" y="150" fill="#60a5fa" fontSize="10">category_id: INTEGER</text>
          
          <text x="525" y="170" fill="#94a3b8" fontSize="10">title: VARCHAR(255)</text>
          <text x="525" y="190" fill="#94a3b8" fontSize="10">content: TEXT</text>
          <text x="525" y="210" fill="#94a3b8" fontSize="10">is_pinned: BOOLEAN</text>
          <text x="525" y="230" fill="#94a3b8" fontSize="10">is_archived: BOOLEAN</text>
          <text x="525" y="250" fill="#94a3b8" fontSize="10">is_public: BOOLEAN</text>
          <text x="525" y="270" fill="#94a3b8" fontSize="10">created_at: DATETIME</text>
          <text x="525" y="290" fill="#94a3b8" fontSize="10">updated_at: DATETIME</text>
        </g>

        {/* Tag Table */}
        <g>
          <rect x="760" y="60" width="180" height="120" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="760" y="60" width="180" height="35" rx="8" fill="#22c55e" />
          <text x="850" y="83" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Tag</text>
          
          <text x="775" y="110" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="800" y="110" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="775" y="130" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="800" y="130" fill="#60a5fa" fontSize="10">user_id: UUID</text>
          
          <text x="775" y="150" fill="#94a3b8" fontSize="10">name: VARCHAR(50)</text>
          <text x="775" y="170" fill="#94a3b8" fontSize="10">color: VARCHAR(7)</text>
        </g>

        {/* NoteTag (Junction Table) */}
        <g>
          <rect x="760" y="220" width="180" height="80" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
          <rect x="760" y="220" width="180" height="35" rx="8" fill="#6366f1" />
          <text x="850" y="243" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">NoteTag (M:M)</text>
          
          <text x="775" y="270" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="800" y="270" fill="#60a5fa" fontSize="10">note_id: INTEGER</text>
          
          <text x="775" y="290" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="800" y="290" fill="#60a5fa" fontSize="10">tag_id: INTEGER</text>
        </g>

        {/* Reminder Table */}
        <g>
          <rect x="280" y="240" width="180" height="140" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="280" y="240" width="180" height="35" rx="8" fill="#22c55e" />
          <text x="370" y="263" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Reminder</text>
          
          <text x="295" y="290" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="320" y="290" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="295" y="310" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="320" y="310" fill="#60a5fa" fontSize="10">note_id: INTEGER</text>
          
          <text x="295" y="330" fill="#94a3b8" fontSize="10">reminder_time: DATETIME</text>
          <text x="295" y="350" fill="#94a3b8" fontSize="10">is_sent: BOOLEAN</text>
          <text x="295" y="370" fill="#94a3b8" fontSize="10">repeat_interval: VARCHAR</text>
        </g>

        {/* Attachment Table */}
        <g>
          <rect x="510" y="340" width="200" height="140" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="510" y="340" width="200" height="35" rx="8" fill="#22c55e" />
          <text x="610" y="363" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Attachment</text>
          
          <text x="525" y="390" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="550" y="390" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="525" y="410" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="550" y="410" fill="#60a5fa" fontSize="10">note_id: INTEGER</text>
          
          <text x="525" y="430" fill="#94a3b8" fontSize="10">file: VARCHAR(PATH)</text>
          <text x="525" y="450" fill="#94a3b8" fontSize="10">file_name: VARCHAR(255)</text>
          <text x="525" y="470" fill="#94a3b8" fontSize="10">uploaded_at: DATETIME</text>
        </g>

        {/* Like Table */}
        <g>
          <rect x="30" y="420" width="180" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <rect x="30" y="420" width="180" height="35" rx="8" fill="#f59e0b" />
          <text x="120" y="443" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Like</text>
          
          <text x="45" y="470" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="70" y="470" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="45" y="490" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="70" y="490" fill="#60a5fa" fontSize="10">user_id: UUID</text>
          
          <text x="45" y="510" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="70" y="510" fill="#60a5fa" fontSize="10">note_id: INTEGER</text>
          
          <text x="45" y="530" fill="#94a3b8" fontSize="10">created_at: DATETIME</text>
        </g>

        {/* Comment Table */}
        <g>
          <rect x="30" y="560" width="180" height="130" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <rect x="30" y="560" width="180" height="35" rx="8" fill="#f59e0b" />
          <text x="120" y="583" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Comment</text>
          
          <text x="45" y="610" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="70" y="610" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="45" y="630" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="70" y="630" fill="#60a5fa" fontSize="10">user_id: UUID</text>
          
          <text x="45" y="650" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="70" y="650" fill="#60a5fa" fontSize="10">note_id: INTEGER</text>
          
          <text x="45" y="670" fill="#94a3b8" fontSize="10">content: TEXT</text>
          <text x="45" y="685" fill="#94a3b8" fontSize="10">created_at: DATETIME</text>
        </g>

        {/* IdeaChain Table */}
        <g>
          <rect x="280" y="420" width="180" height="140" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <rect x="280" y="420" width="180" height="35" rx="8" fill="#f59e0b" />
          <text x="370" y="443" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">IdeaChain</text>
          
          <text x="295" y="470" fill="#fbbf24" fontSize="10" fontWeight="600">PK</text>
          <text x="320" y="470" fill="#e2e8f0" fontSize="10">id: INTEGER</text>
          
          <text x="295" y="490" fill="#60a5fa" fontSize="10" fontWeight="600">FK</text>
          <text x="320" y="490" fill="#60a5fa" fontSize="10">creator_id: UUID</text>
          
          <text x="295" y="510" fill="#94a3b8" fontSize="10">title: VARCHAR(255)</text>
          <text x="295" y="530" fill="#94a3b8" fontSize="10">description: TEXT</text>
          <text x="295" y="550" fill="#94a3b8" fontSize="10">is_public: BOOLEAN</text>
        </g>

        {/* Relationships - Lines */}
        {/* User -> Category (1:N) */}
        <line x1="230" y1="130" x2="280" y2="130" stroke="#64748b" strokeWidth="1.5" />
        <text x="255" y="122" fill="#64748b" fontSize="8">1:N</text>

        {/* User -> Note (1:N) */}
        <line x1="230" y1="160" x2="510" y2="130" stroke="#64748b" strokeWidth="1.5" />
        <text x="350" y="130" fill="#64748b" fontSize="8">1:N</text>

        {/* Category -> Note (1:N) */}
        <line x1="460" y1="130" x2="510" y2="150" stroke="#64748b" strokeWidth="1.5" />
        <text x="475" y="135" fill="#64748b" fontSize="8">1:N</text>

        {/* Note -> Tag (M:N via NoteTag) */}
        <line x1="710" y1="150" x2="760" y2="130" stroke="#64748b" strokeWidth="1.5" />
        <line x1="710" y1="200" x2="760" y2="260" stroke="#64748b" strokeWidth="1.5" />
        <text x="730" y="180" fill="#64748b" fontSize="8">M:N</text>

        {/* Note -> Reminder (1:N) */}
        <line x1="510" y1="250" x2="460" y2="310" stroke="#64748b" strokeWidth="1.5" />
        <text x="475" y="270" fill="#64748b" fontSize="8">1:N</text>

        {/* Note -> Attachment (1:N) */}
        <line x1="610" y1="300" x2="610" y2="340" stroke="#64748b" strokeWidth="1.5" />
        <text x="625" y="320" fill="#64748b" fontSize="8">1:N</text>

        {/* User -> Like (1:N) */}
        <line x1="130" y1="260" x2="120" y2="420" stroke="#64748b" strokeWidth="1.5" />
        
        {/* Note -> Like (1:N) */}
        <line x1="510" y1="250" x2="210" y2="480" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
        
        {/* User -> Comment (1:N) */}
        <line x1="100" y1="260" x2="100" y2="560" stroke="#64748b" strokeWidth="1.5" />
        
        {/* Note -> Comment (1:N) */}
        <line x1="510" y1="280" x2="210" y2="620" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />

        {/* Legend */}
        <g>
          <rect x="760" y="350" width="180" height="120" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="850" y="375" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Легенда</text>
          
          <rect x="775" y="390" width="12" height="12" fill="#fbbf24" rx="2" />
          <text x="795" y="400" fill="#fbbf24" fontSize="9">PK - Primary Key</text>
          
          <rect x="775" y="410" width="12" height="12" fill="#60a5fa" rx="2" />
          <text x="795" y="420" fill="#60a5fa" fontSize="9">FK - Foreign Key</text>
          
          <line x1="775" y1="440" x2="800" y2="440" stroke="#64748b" strokeWidth="2" />
          <text x="810" y="444" fill="#64748b" fontSize="9">1:N зв&apos;язок</text>
          
          <line x1="775" y1="460" x2="800" y2="460" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
          <text x="810" y="464" fill="#64748b" fontSize="9">Зв&apos;язок через FK</text>
        </g>
      </svg>
    </div>
  )
}
