import { Briefcase, FileText, Search, TrendingUp } from "lucide-react";

const stats = [
  { name: "Active Hunts", value: "3", icon: Search },
  { name: "Jobs Found", value: "42", icon: Briefcase },
  { name: "Tailored CVs", value: "12", icon: FileText },
  { name: "Avg. Match Score", value: "78%", icon: TrendingUp },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Malik</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Here's what's happening with your job search.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                <stat.icon className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold">Recent Hunts</h2>
          <div className="mt-4 space-y-4">
            {/* Placeholder for recent hunts */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800">
                <div>
                  <p className="font-medium">Software Engineer</p>
                  <p className="text-sm text-zinc-500">Colombo, Sri Lanka • 2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 dark:text-green-400">12 new jobs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold">Master CV</h2>
          <div className="mt-4">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Malik_Resume_2026.pdf</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Master Version</p>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Update Master CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
