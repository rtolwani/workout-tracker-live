"use client";

import { useState } from "react";
import { Workout, Exercise, Set } from "@/app/page";

interface WorkoutLoggerProps {
  onAddWorkout: (workout: Workout) => void;
}

const WORKOUT_TEMPLATES = [
  "Upper Body",
  "Lower Body",
  "Full Body",
  "Push Day",
  "Pull Day",
  "Leg Day",
  "Chest & Triceps",
  "Back & Biceps",
  "Cardio",
];

const COMMON_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-ups",
  "Dumbbell Press",
  "Lunges",
  "Leg Press",
  "Lat Pulldown",
  "Bicep Curls",
  "Tricep Extensions",
  "Plank",
  "Running",
  "Cycling",
];

export function WorkoutLogger({ onAddWorkout }: WorkoutLoggerProps) {
  const [workoutName, setWorkoutName] = useState("Full Body");
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "e1", name: "Bench Press", sets: [{ reps: 10, weight: 135, unit: "lbs" }] },
  ]);
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      { id: `e${Date.now()}`, name: "", sets: [{ reps: 10, weight: 0, unit: "lbs" }] },
    ]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)));
  };

  const addSet = (exerciseIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex ? { ...ex, sets: [...ex.sets, { reps: 10, weight: 0, unit: "lbs" }] } : ex
      )
    );
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: number | string) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((s, j) => (j === setIndex ? { ...s, [field]: value } : s)),
            }
          : ex
      )
    );
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIndex) } : ex
      )
    );
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const saveWorkout = () => {
    const workout: Workout = {
      id: `w${Date.now()}`,
      date: new Date().toISOString(),
      name: workoutName,
      exercises: exercises.filter((e) => e.name.trim()),
      duration,
      notes,
    };

    onAddWorkout(workout);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setExercises([{ id: `e${Date.now()}`, name: "", sets: [{ reps: 10, weight: 0, unit: "lbs" }] }]);
    setNotes("");
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">📝 Log Your Workout</h2>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
          ✅ Workout saved successfully!
        </div>
      )}

      {/* Workout Name */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm mb-2">Workout Type</label>
        <select
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
        >
          {WORKOUT_TEMPLATES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value="Custom">Custom</option>
        </select>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm mb-2">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Exercises */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-gray-400 text-sm">Exercises</label>
          <button
            onClick={addExercise}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
          >
            + Add Exercise
          </button>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, exIndex) => (
            <div key={exercise.id} className="p-4 rounded-xl bg-gray-900 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => updateExercise(exIndex, "name", e.target.value)}
                  placeholder="Exercise name"
                  list={`exercise-list-${exIndex}`}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
                <datalist id={`exercise-list-${exIndex}`}>
                  {COMMON_EXERCISES.map((ex) => (
                    <option key={ex} value={ex} />
                  ))}
                </datalist>
                {exercises.length > 1 && (
                  <button
                    onClick={() => removeExercise(exIndex)}
                    className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Sets */}
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm w-6">#{setIndex + 1}</span>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exIndex, setIndex, "reps", Number(e.target.value))}
                      placeholder="Reps"
                      className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-gray-500 text-sm">×</span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exIndex, setIndex, "weight", Number(e.target.value))}
                      placeholder="Weight"
                      className="w-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <select
                      value={set.unit}
                      onChange={(e) => updateSet(exIndex, setIndex, "unit", e.target.value)}
                      className="w-16 px-2 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                    {exercise.sets.length > 1 && (
                      <button
                        onClick={() => removeSet(exIndex, setIndex)}
                        className="px-2 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSet(exIndex)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-sm hover:text-white transition-colors"
              >
                + Add Set
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did you feel? Any PRs?"
          rows={3}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveWorkout}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
      >
        💾 Save Workout
      </button>
    </div>
  );
}
