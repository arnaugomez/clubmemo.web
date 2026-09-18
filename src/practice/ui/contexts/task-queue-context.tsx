"use client";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Queue from "effect/Queue";
import * as Schedule from "effect/Schedule";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { captureError } from "@/src/common/effect/client-runtime";
import {
  createContextHook,
  createNullContext,
} from "@/src/common/ui/utils/context";

enum Status {
  ready,
  running,
  done,
}

export interface Task<T> {
  payload: T;
  fn(payload: T, tasks: Task<unknown>[]): Effect.Effect<void, unknown>;
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

/** A single interruptible worker preserves FIFO writes and one-second retries. */
export function TaskQueueProvider({ children }: PropsWithChildren) {
  const [queue] = useState(() =>
    Effect.runSync(Queue.unbounded<Task<unknown>>()),
  );
  const tasks = useRef<Task<unknown>[]>([]);
  const [hasPendingTasks, setHasPendingTasks] = useState(false);

  useEffect(() => {
    const worker = Effect.runFork(
      Effect.gen(function* () {
        while (true) {
          const task = yield* Queue.take(queue);
          task.status = Status.running;
          yield* Effect.suspend(() =>
            task.fn(task.payload, tasks.current),
          ).pipe(
            Effect.tapError((error) =>
              Effect.sync(() => {
                captureError(error);
                task.onError?.(error);
              }),
            ),
            Effect.retry(Schedule.spaced("1 second")),
          );
          task.status = Status.done;
          setHasPendingTasks(
            tasks.current.some((item) => item.status !== Status.done),
          );
        }
      }),
    );
    return () => {
      Effect.runFork(Fiber.interrupt(worker));
    };
  }, [queue]);

  const addTask = useCallback<TaskQueueContextValue["addTask"]>(
    (payload, fn, onError) => {
      const task: Task<unknown> = {
        payload,
        fn: (_payload, pending) => fn(payload, pending),
        onError,
        status: Status.ready,
      };
      tasks.current.push(task);
      setHasPendingTasks(true);
      Queue.offerUnsafe(queue, task);
    },
    [queue],
  );

  return (
    <TaskQueueContext.Provider
      value={{
        hasPendingTasks,
        addTask,
      }}
    >
      {children}
    </TaskQueueContext.Provider>
  );
}

export const useTaskQueueContext = createContextHook(TaskQueueContext);
