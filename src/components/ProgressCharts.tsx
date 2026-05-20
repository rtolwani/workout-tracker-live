"use client";

import { Workout } from "@/app/page";
import { useMemo } from "react";

interface ProgressChartsProps {
  workouts: Workout[];
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  const exerciseStats = useMemo(() => {
    const stats: Record<string, { dates: string[]; maxWeights: number[]; volumes: number[] }> = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      workout.exercises.forEach((exercise) => {
        if (!exercise.name.trim()) return;
        
        if (!stats[exercise.name]) {
          stats[exercise.name] = { dates: [], maxWeights: [], volumes: [] };
        }
        
        const maxWeight = Math.max(...exercise.sets.map((s) => s.weight));
        const volume = exercise.sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);
        
        stats[exercise.name].dates.push(date);
        stats[exercise.name].maxWeights.push(maxWeight);
        stats[exercise.name].volumes.push(volume);
      });
    });

    return stats;
  }, [workouts]);

  const topExercises = Object.entries(exerciseStats)
    .map(([name, data]) => ({
      name,
      maxWeight: Math.max(...data.maxWeights),
      totalVolume: data.volumes.reduce((sum, v) => sum + v, 0),
      workoutCount: data.dates.length,
    }))
    .sort((a, b) => b.workoutCount - a.workoutCount)
    .slice(0, 5);

  if (workouts.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center">
        <span className="text-6xl mb-4 block">📈</span>
        <h3 className="text-xl font-bold text-white mb-2">No data yet</h3>
        <p className="text-gray-400">Log workouts to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Exercises */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">🏆 Top Exercises</h3>
        <div className="space-y-3">
          {topExercises.map((ex, idx) => (
            <div key={ex.name} className="flex items-center gap-4 p-3 rounded-xl bg-gray-900/50 border border-gray-700">
              <span className="text-2xl font-bold text-emerald-400 w-8">#{idx + 1}</span>
              <div className="flex-1">
                <div className="text-white font-semibold">{ex.name}</div>
                <div className="text-gray-400 text-sm">
                  {ex.workoutCount} workouts • Max: {ex.maxWeight} lbs • Total: {ex.totalVolume.toLocaleString()} lbs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Charts for Each Exercise */}
      {Object.entries(exerciseStats).slice(0, 5).map(([exercise, data]) => (
        <div key={exercise} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">{exercise}</h3>
          
          {/* Weight Progress Bar Chart */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-2">Max Weight Progress</div>
            <div className="flex items-end gap-2 h-32">
              {data.maxWeights.map((weight, idx) => {
                const maxWeight = Math.max(...data.maxWeights);
                const height = maxWeight > 0 ? (weight / maxWeight) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-gray-500 text-xs">{weight}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volume Progress */}
          <div>
            <div className="text-gray-400 text-sm mb-2">Volume Progress</div>
            <div className="flex items-end gap-2 h-32">
              {data.volumes.map((volume, idx) => {
                const maxVolume = Math.max(...data.volumes);
                const height = maxVolume > 0 ? (volume / maxVolume) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-gray-500 text-xs">{(volume / 1000).toFixed(1)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
