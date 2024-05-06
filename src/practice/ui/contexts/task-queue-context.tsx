"use client";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import {
  createContextHook,
  createNullContext,
} from "@/src/common/ui/utils/context";
import type { PropsWithChildren} from "react";
import { useCallback, useEffect, useState } from "react";

enum Status {
  ready,
  running,
  done,
}

export interface Task<T> {
  payload: T;
  fn(payload: T, tasks: Task<unknown>[]): Promise<void>;
  onError?: (error: unknown) => void;
  status: Status;
}

interface TaskQueueContextValue {
  hasPendingTasks: boolean;
  addTask: <T>(
    payload: T,
    fn: Task<T>["fn"],
    onError: Task<T>["onError"],
  ) => void;
}
const TaskQueueContext = createNullContext<TaskQueueContextValue>();

export function TaskQueueProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task<unknown>[]>([]);

  const pendingTask = tasks.find((task) => task.status !== Status.done);

  const setStatus = useCallback(function <T>(
    taskFn: Task<T>["fn"],
    status: Status,
  ) {
    setTasks((tasks) =>
      tasks.map((t) => (t.fn === taskFn ? { ...t, status } : t)),
    );
  }, []);

  useEffect(() => {
    async function runTask<T>(task: Task<T>) {
      try {
        setStatus(task.fn, Status.running);
        await task.fn(task.payload, tasks);
        setStatus(task.fn, Status.done);
        task.status = Status.done;
      } catch (error) {
        task.onError?.(error);
        console.error(error);
        await waitMilliseconds(1000);
        setStatus(task.fn, Status.ready);
      }
    }

    if (pendingTask && pendingTask.status === Status.ready) {
      runTask(pendingTask);
    }
  }, [pendingTask, setStatus, tasks]);

  const addTask: TaskQueueContextValue["addTask"] = (payload, fn, onError) => {
    setTasks((tasks) =>
      tasks.concat({ payload, fn, onError, status: Status.ready }),
    );
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

export const useTaskQueueContext = createContextHook(TaskQueueContext);
