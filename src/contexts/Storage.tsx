import React, { createContext, FC, useState, useEffect } from "react";

export interface Workout {
  date: Date;
  exercise: string;
  weight?: number;
  weightUnit?: "kg" | "lbs";
  reps?: number;
  distance?: number;
  distanceUnit?: "km" | "mi";
  seconds?: number;
}

type WorkoutRecords = Array<Workout>;

interface StorageContextProps {
  workouts: WorkoutRecords;
  setWorkouts: (workoutData: WorkoutRecords) => void;
}

export const StorageContext = createContext<StorageContextProps>({
  workouts: [],
  setWorkouts: () => {}
});

const StorageProvider: FC = props => {
  const [workouts, setWorkouts] = useState<WorkoutRecords>([]);

  // try to load existing data from localStorage
  useEffect(() => {
    const localData = localStorage.getItem("strong-charts");
    if (localData) {
      try {
        const parsedWorkouts: WorkoutRecords = JSON.parse(
          localData,
          (key, value) => {
            return key === "date" ? new Date(value) : value;
          }
        );
        setWorkouts(parsedWorkouts);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // when we get new data imported and set, we also want to store it in localStorage
  const handleSetWorkouts = (workoutData: WorkoutRecords): void => {
    localStorage.setItem("strong-charts", JSON.stringify(workoutData));
    setWorkouts(workoutData);
  };

  const value = {
    workouts,
    setWorkouts: handleSetWorkouts
  };
  return <StorageContext.Provider value={value} {...props} />;
};

export default StorageProvider;
