"use client";

import { Workout } from "@/app/page";

interface WorkoutHistoryProps {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

export function WorkoutHistory({ workouts, onDelete }: WorkoutHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (workouts.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center">
        <span className="text-6xl mb-4 block">📝</span>
        <h3 className="text-xl font-bold text-white mb-2">No workouts yet</h3>
        <p className="text-gray-400">Log your first workout to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">📊 Workout History</h2>
        <span className="text-gray-400 text-sm">{workouts.length} workouts</span>
      </div>

      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  {workout.duration} min
                </span>
              </div>
              <div className="text-gray-400 text-sm">{formatDate(workout.date)}</div>
            </div>
            <button
              onClick={() => onDelete(workout.id)}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
            >
              🗑️ Delete
            </button>
          </div>

          {/* Exercises */}
          <div className="space-y-3 mb-4">
            {workout.exercises.map((exercise) => (
              <div key={exercise.id} className="p-3 rounded-xl bg-gray-900/50 border border-gray-700">
                <div className="font-semibold text-white mb-2">{exercise.name}</div>
                <div className="flex flex-wrap gap-2">
                  {exercise.sets.map((set, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm"
                    >
                      {set.reps} × {set.weight}{set.unit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {workout.notes && (
            <div className="pt-4 border-t border-gray-700">
              <div className="text-gray-400 text-sm italic">"{workout.notes}"</div>
            </div>
          )}

          {/* Volume */}
          <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              Total Sets: <span className="text-white font-medium">{exerciseCount(workout)}</span>
            </span>
            <span className="text-gray-400">
              Volume: <span className="text-emerald-400 font-medium">{calculateVolume(workout).toLocaleString()} lbs</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function exerciseCount(workout: Workout): number {
  return workout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
}

function calculateVolume(workout: Workout): number {
  return workout.exercises.reduce((eSum, e) => 
    eSum + e.sets.reduce((sSum, s) => sSum + (s.reps * s.weight), 0), 0
  );
}
