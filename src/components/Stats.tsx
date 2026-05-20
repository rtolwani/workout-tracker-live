"use client";

import { Workout } from "@/app/page";

interface StatsProps {
  workouts: Workout[];
}

export function Stats({ workouts }: StatsProps) {
  // Calculate stats
  const totalWorkouts = workouts.length;
  
  const totalSets = workouts.reduce((sum, w) => 
    sum + w.exercises.reduce((eSum, e) => eSum + e.sets.length, 0), 0
  );
  
  const totalVolume = workouts.reduce((sum, w) => 
    sum + w.exercises.reduce((eSum, e) => 
      eSum + e.sets.reduce((sSum, s) => sSum + (s.reps * s.weight), 0), 0
    ), 0
  );

  const thisWeek = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo;
  }).length;

  const statCards = [
    { label: "Total Workouts", value: totalWorkouts, icon: "💪", color: "from-emerald-500/20 to-emerald-600/20", border: "emerald-500/30", text: "emerald-400" },
    { label: "This Week", value: thisWeek, icon: "📅", color: "from-blue-500/20 to-blue-600/20", border: "blue-500/30", text: "blue-400" },
    { label: "Total Sets", value: totalSets, icon: "🏋️", color: "from-purple-500/20 to-purple-600/20", border: "purple-500/30", text: "purple-400" },
    { label: "Volume (lbs)", value: totalVolume.toLocaleString(), icon: "📊", color: "from-orange-500/20 to-orange-600/20", border: "orange-500/30", text: "orange-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} border border-${stat.border} backdrop-blur`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-gray-400 text-xs">{stat.label}</div>
          </div>
          <div className={`text-2xl font-bold text-${stat.text}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
