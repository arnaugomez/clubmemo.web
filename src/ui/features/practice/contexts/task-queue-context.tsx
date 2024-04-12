"use client";
import { waitMilliseconds } from "@/src/core/common/utils/promises";
import { ReactContextNotFoundError } from "@/src/ui/models/context-errors";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

enum Status {
  ready,
  running,
  done,
}

interface Task {
  fn(): Promise<void>;
  onError?: (error: unknown) => void;
  status: Status;
}

interface TaskQueueContextValue {
  hasPendingTasks: boolean;
  addTask: (fn: Task["fn"], onError: Task["onError"]) => void;
}
// Create the context
const TaskQueueContext = createContext<TaskQueueContextValue | null>(null);

// Create the provider component
export function TaskQueueProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const pendingTask = tasks.find((task) => task.status !== Status.done);

  const setStatus = useCallback(
    (taskFn: () => Promise<void>, status: Status) => {
      setTasks((tasks) =>
        tasks.map((t) => (t.fn === taskFn ? { ...t, status } : t)),
      );
    },
    [],
  );

  const runTask = useCallback(
    async (task: Task) => {
      try {
        setStatus(task.fn, Status.running);
        await task.fn();
        setStatus(task.fn, Status.done);
        task.status = Status.done;
        setTasks((tasks) => tasks.concat());
      } catch (error) {
        task.onError?.(error);
        console.error(error);
        await waitMilliseconds(1000);
        setStatus(task.fn, Status.ready);
      }
    },
    [setStatus],
  );

  useEffect(() => {
    if (pendingTask && pendingTask.status === Status.ready) {
      runTask(pendingTask);
    }
  }, [pendingTask, runTask]);

  const addTask: TaskQueueContextValue["addTask"] = (fn, onError) => {
    setTasks((tasks) => tasks.concat({ fn, onError, status: Status.ready }));
  };

  return (
    <TaskQueueContext.Provider
      value={{
        hasPendingTasks: Boolean(pendingTask),
        addTask,
      }}
    >
      {children}
    </TaskQueueContext.Provider>
  );
}

export function useTaskQueueContext() {
  const context = useContext(TaskQueueContext);
  if (!context) throw new ReactContextNotFoundError();
  return context;
}
