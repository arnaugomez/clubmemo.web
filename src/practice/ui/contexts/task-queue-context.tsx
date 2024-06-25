"use client";
import { clientLocator } from "@/src/common/di/client-locator";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import {
  createContextHook,
  createNullContext,
} from "@/src/common/ui/utils/context";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useState } from "react";

/**
 * The status of a task.
 */
enum Status {
  /**
   * The task waiting to be executed.
   */
  ready,
  /**
   * The task is being executed.
   */
  running,
  /**
   * The task has already finished.
   */
  done,
}

/**
 * A Task is a function that runs in the background. Its execution
 * is delayed until the previous task in the list has finished running.
 */
export interface Task<T> {
  /**
   * The argument of the task function
   */
  payload: T;
  /**
   * The function to be executed
   * @param payload The argument of the task function
   * @param tasks The list of other tasks that are currently in the queue
   */
  fn(payload: T, tasks: Task<unknown>[]): Promise<void>;
  /**
   * Is run when an error is thrown inside the task function
   */
  onError?: (error: unknown) => void;
  /**
   * The current status of the task. Whether it is waiting to be run, running,
   * or already finished.
   */
  status: Status;
}

/**
 * The status and actions of the task queue
 */
interface TaskQueueContextValue {
  /**
   * Whether there are still tasks that are waiting to be run
   */
  hasPendingTasks: boolean;
  /**
   * Adds a task to the queue. The task will be run when all the previous tasks
   * have finished.
   */
  addTask: <T>(
    payload: T,
    fn: Task<T>["fn"],
    onError: Task<T>["onError"],
  ) => void;
}
const TaskQueueContext = createNullContext<TaskQueueContextValue>();

/**
 * Manages the state of a task queue. The task queue is a list of tasks that
 * are executed one after the other.
 *
 * The tasks are executed in the order they are added to the queue. When the function
 * of a task throws an error, an error callback is executed and, after that, the task
 * is retried after a delay of 1 second.
 */
export function TaskQueueProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task<unknown>[]>([]);

  /**
   * The first task in the list that is not done yet.
   * This task could be in status `ready` or `running`.
   */
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
      } catch (e) {
        clientLocator.ErrorTrackingService().captureError(e);
        // Run the error manager callback
        task.onError?.(e);
        // Wait for 1 second before retrying the task
        await waitMilliseconds(1000);
        // Retry task
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
