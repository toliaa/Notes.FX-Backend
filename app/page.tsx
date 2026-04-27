import Navigation from '@/components/ui/Navigation'
import Section from '@/components/ui/Section'
import HighLevelArchitecture from '@/components/diagrams/HighLevelArchitecture'
import ModuleInteraction from '@/components/diagrams/ModuleInteraction'
import ERDiagram from '@/components/diagrams/ERDiagram'
import DataFlowDiagram from '@/components/diagrams/DataFlowDiagram'
import AuthFlowDiagram from '@/components/diagrams/AuthFlowDiagram'
import AIIntegrationDiagram from '@/components/diagrams/AIIntegrationDiagram'

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <main className="lg:ml-64 p-6 lg:p-12 max-w-6xl">
        {/* Header */}
        <header className="mb-12 pt-12 lg:pt-0">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#fafafa] mb-4">
            Архітектура системи Notes.FX
          </h1>
          <p className="text-lg text-[#94a3b8] leading-relaxed max-w-3xl">
            Детальна документація архітектури серверної частини системи управління нотатками 
            Notes.FX Backend, включаючи діаграми взаємодії модулів, потоків даних та інтеграцій.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-sm font-medium">Django 5.1</span>
            <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] rounded-full text-sm font-medium">Django Ninja</span>
            <span className="px-3 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full text-sm font-medium">PostgreSQL</span>
            <span className="px-3 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-full text-sm font-medium">JWT Auth</span>
          </div>
        </header>

        {/* Section: Overview */}
        <Section 
          id="overview" 
          title="1. Огляд системи"
          conclusion="Notes.FX Backend представляє собою сучасний REST API сервер, побудований на Django Ninja з використанням JWT автентифікації. Система забезпечує повний цикл управління нотатками з підтримкою AI-асистента та соціальних функцій спільноти. Архітектура розділена на три основні модулі, що забезпечує модульність та масштабованість системи."
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-[#a1a1aa] leading-relaxed">
              <strong className="text-[#fafafa]">Notes.FX Backend</strong> — це серверна частина системи управління нотатками, 
              розроблена з використанням фреймворку Django та бібліотеки Django Ninja для побудови REST API. 
              Система призначена для створення, організації та спільного використання текстових нотаток з 
              підтримкою штучного інтелекту.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
                <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-[#fafafa] mb-1">Users Module</h4>
                <p className="text-sm text-[#64748b]">Автентифікація, авторизація та управління користувачами через JWT токени</p>
              </div>
              
              <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
                <div className="w-10 h-10 bg-[#22c55e]/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-[#fafafa] mb-1">Notes Module</h4>
                <p className="text-sm text-[#64748b]">CRUD операції з нотатками, категоріями, тегами та AI-асистент</p>
              </div>
              
              <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
                <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-[#fafafa] mb-1">Community Module</h4>
                <p className="text-sm text-[#64748b]">Соціальні функції: лайки, коментарі та ланцюги ідей</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section: High Level Architecture */}
        <Section 
          id="high-level" 
          title="2. Архітектура високого рівня"
          conclusion="Архітектура високого рівня Notes.FX Backend демонструє чітке розділення відповідальностей між шарами системи. Клієнтські запити проходять через CORS та JWT middleware перед обробкою Django Ninja роутером. Три основні модулі (Users, Notes, Community) взаємодіють з PostgreSQL через Django ORM, а модуль Notes додатково інтегрується з зовнішніми AI сервісами для забезпечення інтелектуальних функцій."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Діаграма нижче показує загальну архітектуру системи від клієнтського запиту до бази даних. 
            Система використовує багатошарову архітектуру з чітким розділенням відповідальностей між 
            шаром представлення (API), бізнес-логіки (модулі) та даних (PostgreSQL).
          </p>
          
          <div className="bg-[#141414] p-6 rounded-xl border border-[#27272a]">
            <HighLevelArchitecture />
          </div>
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
              <h4 className="font-semibold text-[#e2e8f0] mb-2">Ключові компоненти:</h4>
              <ul className="text-sm text-[#94a3b8] space-y-1">
                <li>- Django Ninja API Router для маршрутизації запитів</li>
                <li>- JWT Middleware для автентифікації</li>
                <li>- CORS Handler для крос-доменних запитів</li>
                <li>- Django ORM для роботи з базою даних</li>
              </ul>
            </div>
            <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
              <h4 className="font-semibold text-[#e2e8f0] mb-2">Потік даних:</h4>
              <ul className="text-sm text-[#94a3b8] space-y-1">
                <li>1. HTTP запит надходить від клієнта</li>
                <li>2. Middleware обробляє CORS та JWT</li>
                <li>3. Ninja Router направляє до відповідного модуля</li>
                <li>4. Модуль виконує бізнес-логіку та ORM запити</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Section: Module Architecture */}
        <Section 
          id="modules" 
          title="3. Модульна архітектура та взаємодія"
          conclusion="Модульна архітектура Notes.FX забезпечує низьку зв'язність між компонентами системи. Кожен модуль має власні моделі, схеми та API endpoints, але взаємодіє з іншими через Foreign Key зв'язки в базі даних. Users Module є центральним, оскільки всі інші сутності прив'язані до користувача. Notes Module є найбільш функціональним з підтримкою AI та найбільшою кількістю моделей."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Система складається з трьох основних модулів, кожен з яких відповідає за певну функціональну область. 
            Модулі взаємодіють між собою через Foreign Key зв&apos;язки в базі даних та спільні залежності від 
            моделі User.
          </p>
          
          <div className="bg-[#141414] p-6 rounded-xl border border-[#27272a]">
            <ModuleInteraction />
          </div>
          
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#27272a]">
                  <th className="text-left py-3 px-4 text-[#fafafa] font-semibold">Модуль</th>
                  <th className="text-left py-3 px-4 text-[#fafafa] font-semibold">Моделі</th>
                  <th className="text-left py-3 px-4 text-[#fafafa] font-semibold">Залежності</th>
                  <th className="text-left py-3 px-4 text-[#fafafa] font-semibold">Відповідальність</th>
                </tr>
              </thead>
              <tbody className="text-[#94a3b8]">
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-3 px-4 text-[#3b82f6] font-medium">Users</td>
                  <td className="py-3 px-4">User</td>
                  <td className="py-3 px-4">Django Auth</td>
                  <td className="py-3 px-4">Автентифікація, авторизація, профілі</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-3 px-4 text-[#22c55e] font-medium">Notes</td>
                  <td className="py-3 px-4">Note, Category, Tag, Reminder, Attachment</td>
                  <td className="py-3 px-4">Users, AI Services</td>
                  <td className="py-3 px-4">CRUD нотаток, категоризація, AI-асистент</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#f59e0b] font-medium">Community</td>
                  <td className="py-3 px-4">Like, Comment, IdeaChain</td>
                  <td className="py-3 px-4">Users, Notes</td>
                  <td className="py-3 px-4">Соціальні взаємодії, спільноти</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Section: Users Module */}
        <Section 
          id="users-module" 
          title="3.1 Модуль Users (Користувачі)"
          conclusion="Модуль Users є фундаментальним компонентом системи, що забезпечує безпечну автентифікацію через JWT токени. Використання Access та Refresh токенів дозволяє підтримувати сесії користувачів без зберігання стану на сервері. Модуль розширює стандартну модель Django User, додаючи можливість автентифікації через email замість username."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Модуль <strong className="text-[#3b82f6]">Users</strong> відповідає за автентифікацію та авторизацію 
            користувачів у системі. Він використовує JWT (JSON Web Tokens) для безпечної автентифікації без 
            зберігання стану сесії на сервері.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#fafafa] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                Модель User
              </h4>
              <div className="font-mono text-xs bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto">
                <pre className="text-[#94a3b8]">
{`class User(AbstractUser):
    id: UUID (Primary Key)
    email: EmailField (unique)
    username: CharField(150)
    password: CharField(128) # hashed
    first_name: CharField(30)
    last_name: CharField(150)
    date_joined: DateTimeField
    is_active: BooleanField
    last_login: DateTimeField`}
                </pre>
              </div>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#fafafa] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
                API Endpoints
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs font-mono">POST</span>
                  <span className="text-[#94a3b8] font-mono">/api/users/register</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs font-mono">POST</span>
                  <span className="text-[#94a3b8] font-mono">/api/users/login</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs font-mono">POST</span>
                  <span className="text-[#94a3b8] font-mono">/api/users/refresh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs font-mono">GET</span>
                  <span className="text-[#94a3b8] font-mono">/api/users/me</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] rounded text-xs font-mono">PUT</span>
                  <span className="text-[#94a3b8] font-mono">/api/users/me</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-5 bg-[#0f172a] rounded-xl border border-[#334155]">
            <h4 className="font-semibold text-[#e2e8f0] mb-3">JWT Token Structure:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#3b82f6] font-medium mb-1">Access Token</p>
                <p className="text-[#64748b]">Короткоживучий токен (15-30 хв) для автентифікації API запитів. Містить user_id та exp.</p>
              </div>
              <div>
                <p className="text-[#22c55e] font-medium mb-1">Refresh Token</p>
                <p className="text-[#64748b]">Довгоживучий токен (7-30 днів) для оновлення Access Token без повторної автентифікації.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section: Notes Module */}
        <Section 
          id="notes-module" 
          title="3.2 Модуль Notes (Нотатки)"
          conclusion="Модуль Notes є центральним функціональним компонентом системи з найбільшою кількістю моделей та складною бізнес-логікою. Інтеграція з AI сервісами (Gemini, OpenAI, Ollama) надає користувачам інтелектуальні можливості для роботи з нотатками. Система підтримує повний життєвий цикл нотатки: створення, категоризацію, тегування, нагадування та вкладення файлів."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Модуль <strong className="text-[#22c55e]">Notes</strong> є основним функціональним модулем системи, 
            що забезпечує повний цикл роботи з нотатками: створення, редагування, організацію через категорії 
            та теги, а також інтеграцію з AI для інтелектуальної обробки контенту.
          </p>
          
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
              <h5 className="font-semibold text-[#22c55e] mb-3">Note Model</h5>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>user_id: UUID (FK)</p>
                <p>category_id: Integer (FK)</p>
                <p>title: VARCHAR(255)</p>
                <p>content: TEXT</p>
                <p>is_pinned: Boolean</p>
                <p>is_archived: Boolean</p>
                <p>is_public: Boolean</p>
                <p>created_at: DateTime</p>
                <p>updated_at: DateTime</p>
              </div>
            </div>
            
            <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
              <h5 className="font-semibold text-[#22c55e] mb-3">Category Model</h5>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>user_id: UUID (FK)</p>
                <p>name: VARCHAR(100)</p>
                <p>color: VARCHAR(7)</p>
                <p>created_at: DateTime</p>
              </div>
              <h5 className="font-semibold text-[#22c55e] mb-3 mt-4">Tag Model</h5>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>user_id: UUID (FK)</p>
                <p>name: VARCHAR(50)</p>
                <p>color: VARCHAR(7)</p>
              </div>
            </div>
            
            <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
              <h5 className="font-semibold text-[#22c55e] mb-3">Reminder Model</h5>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>note_id: Integer (FK)</p>
                <p>reminder_time: DateTime</p>
                <p>is_sent: Boolean</p>
                <p>repeat_interval: VARCHAR</p>
              </div>
              <h5 className="font-semibold text-[#22c55e] mb-3 mt-4">Attachment Model</h5>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>note_id: Integer (FK)</p>
                <p>file: FileField</p>
                <p>file_name: VARCHAR(255)</p>
                <p>uploaded_at: DateTime</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#141414] rounded-xl border border-[#8b5cf6]/30">
            <h4 className="font-semibold text-[#8b5cf6] mb-4">AI Assistant Features</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="font-medium text-[#c4b5fd] mb-1">Summarize</p>
                <p className="text-xs text-[#64748b]">Автоматичне резюмування вмісту нотаток</p>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="font-medium text-[#c4b5fd] mb-1">Suggest Tags</p>
                <p className="text-xs text-[#64748b]">Пропозиції тегів на основі контенту</p>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="font-medium text-[#c4b5fd] mb-1">Chat Mode</p>
                <p className="text-xs text-[#64748b]">Діалоговий режим для роботи з нотатками</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section: Community Module */}
        <Section 
          id="community-module" 
          title="3.3 Модуль Community (Спільнота)"
          conclusion="Модуль Community розширює функціональність Notes.FX соціальними можливостями, перетворюючи систему з простого менеджера нотаток на платформу для обміну знаннями. Функція IdeaChain дозволяє створювати тематичні колекції пов'язаних нотаток від різних користувачів, стимулюючи колаборативну роботу. Система лайків та коментарів забезпечує зворотний зв'язок та взаємодію між користувачами."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Модуль <strong className="text-[#f59e0b]">Community</strong> додає соціальні функції до системи 
            нотаток, дозволяючи користувачам взаємодіяти між собою через лайки, коментарі та спільні 
            ланцюги ідей (IdeaChains).
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <div className="w-10 h-10 bg-[#ef4444]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#ef4444]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#fafafa] mb-2">Like Model</h4>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>user_id: UUID (FK)</p>
                <p>note_id: Integer (FK)</p>
                <p>created_at: DateTime</p>
              </div>
              <p className="text-xs text-[#94a3b8] mt-3">Унікальний constraint на пару (user, note)</p>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[#fafafa] mb-2">Comment Model</h4>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>user_id: UUID (FK)</p>
                <p>note_id: Integer (FK)</p>
                <p>content: TEXT</p>
                <p>created_at: DateTime</p>
              </div>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="font-semibold text-[#fafafa] mb-2">IdeaChain Model</h4>
              <div className="font-mono text-xs text-[#64748b] space-y-1">
                <p>id: Integer (PK)</p>
                <p>creator_id: UUID (FK)</p>
                <p>title: VARCHAR(255)</p>
                <p>description: TEXT</p>
                <p>is_public: Boolean</p>
                <p>notes: ManyToMany(Note)</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section: ER Diagram */}
        <Section 
          id="er-diagram" 
          title="4. ER-Діаграма бази даних"
          conclusion="ER-діаграма демонструє реляційну структуру бази даних Notes.FX з усіма зв'язками між таблицями. User є центральною сутністю, від якої залежать майже всі інші таблиці. Зв'язок Many-to-Many між Note та Tag реалізований через проміжну таблицю NoteTag. Всі Foreign Key зв'язки забезпечують цілісність даних на рівні бази даних."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            ER-діаграма (Entity-Relationship) відображає структуру бази даних та зв&apos;язки між таблицями. 
            Система використовує PostgreSQL як СУБД з Django ORM для об&apos;єктно-реляційного відображення.
          </p>
          
          <div className="bg-[#141414] p-6 rounded-xl border border-[#27272a]">
            <ERDiagram />
          </div>
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
              <h4 className="font-semibold text-[#e2e8f0] mb-2">Типи зв&apos;язків:</h4>
              <ul className="text-sm text-[#94a3b8] space-y-1">
                <li><span className="text-[#fbbf24]">1:N</span> — User → Notes (один користувач має багато нотаток)</li>
                <li><span className="text-[#fbbf24]">1:N</span> — Note → Reminders (одна нотатка має багато нагадувань)</li>
                <li><span className="text-[#fbbf24]">M:N</span> — Note ↔ Tag (через junction table NoteTag)</li>
                <li><span className="text-[#fbbf24]">1:N</span> — User → Likes (один користувач ставить багато лайків)</li>
              </ul>
            </div>
            <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
              <h4 className="font-semibold text-[#e2e8f0] mb-2">Ключові особливості:</h4>
              <ul className="text-sm text-[#94a3b8] space-y-1">
                <li>- UUID для Primary Key в таблиці User</li>
                <li>- Каскадне видалення для залежних записів</li>
                <li>- Unique constraint для Like (user + note)</li>
                <li>- Індекси на Foreign Key полях</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Section: Data Flow */}
        <Section 
          id="data-flow" 
          title="5. Діаграма потоку даних"
          conclusion="Діаграма потоку даних ілюструє шаровану архітектуру Notes.FX Backend. Кожен шар має чітко визначену відповідальність: External Layer обробляє вхідні запити, API Gateway Layer забезпечує безпеку та маршрутизацію, Business Logic Layer містить бізнес-логіку кожного модуля, а Data Access Layer абстрагує роботу з базою даних через Django ORM."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Діаграма показує як дані проходять через різні шари системи від клієнтського запиту до 
            бази даних та назад. Архітектура слідує принципам чистої архітектури з розділенням на шари.
          </p>
          
          <div className="bg-[#141414] p-6 rounded-xl border border-[#27272a]">
            <DataFlowDiagram />
          </div>
        </Section>

        {/* Section: Auth Flow */}
        <Section 
          id="auth-flow" 
          title="6. JWT Автентифікація"
          conclusion="JWT автентифікація в Notes.FX забезпечує stateless аутентифікацію, що спрощує масштабування системи. Access токен використовується для короткострокової автентифікації API запитів, тоді як Refresh токен дозволяє оновлювати Access токен без повторного введення облікових даних. Захищені endpoints автоматично валідують JWT та отримують user_id для фільтрації даних."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Система використовує JWT (JSON Web Tokens) для автентифікації. Діаграма демонструє повний 
            цикл автентифікації: від реєстрації до захищених запитів з використанням токенів.
          </p>
          
          <div className="bg-[#141414] p-6 rounded-xl border border-[#27272a]">
            <AuthFlowDiagram />
          </div>
          
          <div className="mt-6 p-5 bg-[#0f172a] rounded-xl border border-[#334155]">
            <h4 className="font-semibold text-[#e2e8f0] mb-4">Процес автентифікації:</h4>
            <div className="grid md:grid-cols-5 gap-4 text-center text-sm">
              <div className="p-3 bg-[#1e293b] rounded-lg">
                <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">1</div>
                <p className="text-[#94a3b8]">Реєстрація або Login</p>
              </div>
              <div className="p-3 bg-[#1e293b] rounded-lg">
                <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">2</div>
                <p className="text-[#94a3b8]">Валідація credentials</p>
              </div>
              <div className="p-3 bg-[#1e293b] rounded-lg">
                <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">3</div>
                <p className="text-[#94a3b8]">Генерація JWT</p>
              </div>
              <div className="p-3 bg-[#1e293b] rounded-lg">
                <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">4</div>
                <p className="text-[#94a3b8]">API запит з токеном</p>
              </div>
              <div className="p-3 bg-[#1e293b] rounded-lg">
                <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">5</div>
                <p className="text-[#94a3b8]">Повернення даних</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section: AI Integration */}
        <Section 
          id="ai-integration" 
          title="7. Інтеграція AI сервісів"
          conclusion="AI інтеграція в Notes.FX реалізована з підтримкою багатьох провайдерів: Google Gemini як основний, OpenAI як запасний, та Ollama для локального розгортання. Система автоматично обирає доступний провайдер на основі наявних API ключів. AI функції включають резюмування нотаток, пропозиції тегів, генерацію контенту та діалоговий режим для роботи з нотатками."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            Notes.FX інтегрується з кількома AI провайдерами для забезпечення інтелектуальних функцій 
            обробки нотаток. Система підтримує Google Gemini, OpenAI та локальний Ollama.
          </p>
          
          <div className="bg-[#141414] p-6 rounded-xl border border-[#27272a]">
            <AIIntegrationDiagram />
          </div>
          
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#141414] rounded-lg border border-[#8b5cf6]/30">
              <h5 className="font-semibold text-[#8b5cf6] mb-2">Google Gemini</h5>
              <p className="text-xs text-[#64748b] mb-2">Основний AI провайдер</p>
              <code className="text-xs text-[#94a3b8] bg-[#0a0a0a] px-2 py-1 rounded">GEMINI_API_KEY</code>
            </div>
            <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
              <h5 className="font-semibold text-[#22c55e] mb-2">OpenAI</h5>
              <p className="text-xs text-[#64748b] mb-2">Запасний провайдер</p>
              <code className="text-xs text-[#94a3b8] bg-[#0a0a0a] px-2 py-1 rounded">OPENAI_API_KEY</code>
            </div>
            <div className="p-4 bg-[#141414] rounded-lg border border-[#27272a]">
              <h5 className="font-semibold text-[#f59e0b] mb-2">Ollama</h5>
              <p className="text-xs text-[#64748b] mb-2">Локальний варіант</p>
              <code className="text-xs text-[#94a3b8] bg-[#0a0a0a] px-2 py-1 rounded">OLLAMA_HOST</code>
            </div>
          </div>
        </Section>

        {/* Section: API Endpoints */}
        <Section 
          id="api-endpoints" 
          title="8. API Endpoints"
          conclusion="REST API Notes.FX організований за модульним принципом з окремими роутерами для кожного функціонального блоку. Всі endpoints (окрім register та login) захищені JWT автентифікацією. API використовує стандартні HTTP методи (GET, POST, PUT, DELETE) та повертає JSON відповіді з відповідними HTTP статус-кодами."
        >
          <p className="text-[#a1a1aa] mb-6 leading-relaxed">
            API побудований на Django Ninja та слідує REST принципам. Нижче наведено повний перелік 
            доступних endpoints з розділенням за модулями.
          </p>
          
          <div className="space-y-6">
            {/* Users API */}
            <div className="p-5 bg-[#141414] rounded-xl border border-[#3b82f6]/30">
              <h4 className="font-semibold text-[#3b82f6] mb-4">Users API — /api/users/</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-[#27272a]">
                      <th className="py-2 px-3 text-[#94a3b8]">Method</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Endpoint</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Auth</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#e2e8f0]">
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/register</td>
                      <td className="py-2 px-3 text-[#64748b]">No</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Реєстрація нового користувача</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/login</td>
                      <td className="py-2 px-3 text-[#64748b]">No</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Автентифікація та отримання токенів</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/refresh</td>
                      <td className="py-2 px-3 text-[#64748b]">Refresh</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Оновлення Access токена</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs">GET</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/me</td>
                      <td className="py-2 px-3 text-[#22c55e]">JWT</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Отримання даних поточного користувача</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes API */}
            <div className="p-5 bg-[#141414] rounded-xl border border-[#22c55e]/30">
              <h4 className="font-semibold text-[#22c55e] mb-4">Notes API — /api/notes/</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-[#27272a]">
                      <th className="py-2 px-3 text-[#94a3b8]">Method</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Endpoint</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#e2e8f0]">
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs">GET</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Список всіх нотаток користувача</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Створення нової нотатки</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs">GET</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/categories</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Список категорій</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs">GET</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/tags</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Список тегів</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/ai-assistant</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Запит до AI асистента</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#ef4444]/20 text-[#ef4444] rounded text-xs">DELETE</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/{'{'}<span className="text-[#64748b]">id</span>{'}'}</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Видалення нотатки</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Community API */}
            <div className="p-5 bg-[#141414] rounded-xl border border-[#f59e0b]/30">
              <h4 className="font-semibold text-[#f59e0b] mb-4">Community API — /api/community/</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-[#27272a]">
                      <th className="py-2 px-3 text-[#94a3b8]">Method</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Endpoint</th>
                      <th className="py-2 px-3 text-[#94a3b8]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#e2e8f0]">
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/notes/{'{'}<span className="text-[#64748b]">id</span>{'}'}/like</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Поставити/зняти лайк</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs">GET</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/notes/{'{'}<span className="text-[#64748b]">id</span>{'}'}/comments</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Список коментарів до нотатки</td>
                    </tr>
                    <tr className="border-b border-[#27272a]/50">
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs">POST</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/notes/{'{'}<span className="text-[#64748b]">id</span>{'}'}/comments</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Додати коментар</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-xs">GET</span></td>
                      <td className="py-2 px-3 font-mono text-xs">/idea-chains</td>
                      <td className="py-2 px-3 text-[#94a3b8]">Список ланцюгів ідей</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        {/* Section: Technologies */}
        <Section 
          id="technologies" 
          title="9. Технологічний стек"
          conclusion="Технологічний стек Notes.FX Backend обрано з урахуванням сучасних практик розробки веб-додатків. Django забезпечує надійну основу з вбудованою ORM та системою міграцій. Django Ninja додає швидкий та типізований API з автоматичною документацією. PostgreSQL обрано як надійну реляційну СУБД з підтримкою UUID та JSON типів. Інтеграція з AI сервісами реалізована через офіційні SDK провайдерів."
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#22c55e] mb-3">Backend Framework</h4>
              <ul className="text-sm text-[#94a3b8] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  Django 5.1
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  Django Ninja 1.3
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  Pydantic 2.x
                </li>
              </ul>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#f59e0b] mb-3">Database</h4>
              <ul className="text-sm text-[#94a3b8] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  PostgreSQL 15+
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  Django ORM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  UUID Primary Keys
                </li>
              </ul>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#8b5cf6] mb-3">Authentication</h4>
              <ul className="text-sm text-[#94a3b8] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                  JWT (PyJWT)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                  Custom Auth Backend
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                  bcrypt Hashing
                </li>
              </ul>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#3b82f6] mb-3">AI Services</h4>
              <ul className="text-sm text-[#94a3b8] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                  Google Gemini API
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                  OpenAI API
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                  Ollama (Local)
                </li>
              </ul>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#ef4444] mb-3">Infrastructure</h4>
              <ul className="text-sm text-[#94a3b8] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                  Docker Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                  CORS Middleware
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                  Environment Config
                </li>
              </ul>
            </div>
            
            <div className="p-5 bg-[#141414] rounded-xl border border-[#27272a]">
              <h4 className="font-semibold text-[#06b6d4] mb-3">Documentation</h4>
              <ul className="text-sm text-[#94a3b8] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                  OpenAPI 3.0
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                  Swagger UI
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                  Auto-generated Docs
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#27272a] text-center">
          <p className="text-[#64748b] text-sm">
            Notes.FX Backend Architecture Documentation
          </p>
          <p className="text-[#4b5563] text-xs mt-2">
            Django Ninja REST API
          </p>
        </footer>
      </main>
    </div>
  )
}
