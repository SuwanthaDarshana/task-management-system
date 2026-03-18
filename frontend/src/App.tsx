import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import useTask from "./hooks/useTask";

function App() {
  const { tasks, loading, submitting, createTask, completeTask } = useTask();

  return (
    <>
      {/* Animated background layers */}
      <div className="app-bg" />
      <div className="grid-pattern" />

      {/* Page wrapper — flex column centered */}
      <div className="page-wrapper">

        {/* Hero Header */}
        <header className="w-full text-center animate-fadeInUp" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          {/* Status pill */}
          <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-text-secondary">
              Task Manager
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-10">
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              Stay Organized
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed" style={{ maxWidth: '480px', margin: '24px auto 0' }}>
            Create, track, and complete your daily tasks — all in one beautiful space.
          </p>
        </header>

        {/* Main Content — Two independent cards */}
        <main className="content-container" style={{ paddingTop: '5px', paddingBottom: '40px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">

            {/* Left — Add Task Form (takes 2 cols) */}
            <div className="lg:col-span-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <AddTaskForm onSubmit={createTask} submitting={submitting} />
            </div>

            {/* Right — Task List (takes 3 cols) */}
            <div className="lg:col-span-3 animate-slideInRight" style={{ animationDelay: '0.25s' }}>
              <div className="glass rounded-3xl h-full flex flex-col" style={{ padding: '48px 48px' }}>
                <div className="mb-4">
                  <h2 className="text-text-primary font-bold text-lg flex items-center justify-center">
                    Recent Tasks
                  </h2>

                  <div className="h-3" aria-hidden="true" />

                  <p className="text-text-muted text-xs flex items-center justify-center">
                    Your latest to-do items
                  </p>
                </div>

                {/* Explicit Spacer Between Header and Task List */}
                <div className="h-6" aria-hidden="true" />

                {/* Task List */}
                <div className="flex-1 flex flex-col">
                  <TaskList
                    tasks={tasks}
                    loading={loading}
                    onComplete={completeTask}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center animate-fadeIn" style={{ padding: '40px 0', animationDelay: '0.4s' }}>
          <p className="text-text-muted text-xs tracking-wide">
            Built with <span className="text-accent/70">React</span> + <span className="text-accent/70">Spring Boot</span>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
