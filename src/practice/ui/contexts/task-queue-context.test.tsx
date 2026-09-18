import { act, render, waitFor } from "@testing-library/react";
import * as Effect from "effect/Effect";
import { describe, expect, it, vi } from "vitest";
import { TaskQueueProvider, useTaskQueueContext } from "./task-queue-context";

vi.mock("@/src/common/effect/client-runtime", () => ({
  captureError: vi.fn(),
}));

function mountQueue() {
  let current!: ReturnType<typeof useTaskQueueContext>;
  function Consumer() {
    current = useTaskQueueContext();
    return null;
  }
  const view = render(
    <TaskQueueProvider>
      <Consumer />
    </TaskQueueProvider>,
  );
  return {
    ...view,
    get queue() {
      return current;
    },
  };
}

describe("practice persistence queue", () => {
  it("retries before starting the next write and clears pending status", async () => {
    const view = mountQueue();
    const events: string[] = [];
    const onError = vi.fn();
    let attempts = 0;
    act(() => {
      view.queue.addTask(
        "first",
        () =>
          Effect.suspend(() => {
            events.push(`first-${++attempts}`);
            return attempts === 1 ? Effect.fail("offline") : Effect.void;
          }),
        onError,
      );
      view.queue.addTask(
        "second",
        (_, tasks) =>
          Effect.sync(() => {
            expect(tasks).toHaveLength(2);
            events.push("second");
          }),
        undefined,
      );
    });
    expect(view.queue.hasPendingTasks).toBe(true);
    await waitFor(() => expect(onError).toHaveBeenCalledWith("offline"));
    expect(events).toEqual(["first-1"]);
    await waitFor(() => expect(view.queue.hasPendingTasks).toBe(false), {
      timeout: 2500,
    });
    expect(events).toEqual(["first-1", "first-2", "second"]);
  });
  it("interrupts a running write and executes its finalizer on unmount", async () => {
    const view = mountQueue();
    const acquired = vi.fn();
    const released = vi.fn();
    act(() =>
      view.queue.addTask(
        null,
        () =>
          Effect.scoped(
            Effect.gen(function* () {
              yield* Effect.acquireRelease(Effect.sync(acquired), () =>
                Effect.sync(released),
              );
              yield* Effect.never;
            }),
          ),
        undefined,
      ),
    );
    await waitFor(() => expect(acquired).toHaveBeenCalledOnce());
    view.unmount();
    await waitFor(() => expect(released).toHaveBeenCalledOnce());
  });
});
