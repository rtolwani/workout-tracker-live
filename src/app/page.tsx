"use client";

import { useState, useEffect } from "react";
import { WorkoutLogger } from "@/components/WorkoutLogger";
import { WorkoutHistory } from "@/components/WorkoutHistory";
import { ProgressCharts } from "@/components/ProgressCharts";
import { Stats } from "@/components/Stats";

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  reps: number;
  weight: number;
  unit: "lbs" | "kg";
}

type Tab = "log" | "history" | "progress";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("log");
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("workouts");
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load workouts", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [workout, ...prev]);
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💪</span>
              <div>
                <h1 className="text-white font-bold text-xl">Workout Tracker</h1>
                <p className="text-gray-400 text-xs">Track your gains</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs">Total Workouts</div>
              <div className="text-2xl font-bold text-emerald-400">{workouts.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            <button
              onClick={() => setActiveTab("log")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "log"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              📝 Log Workout
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              📊 History
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "progress"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              📈 Progress
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <Stats workouts={workouts} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "log" && (
            <WorkoutLogger onAddWorkout={addWorkout} />
          )}
          {activeTab === "history" && (
            <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />
          )}
          {activeTab === "progress" && (
            <ProgressCharts workouts={workouts} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          Workout Tracker • Built with Next.js • Data stored locally
        </div>
      </footer>
    </div>
  );
}
