"use client";
import { randomNumberAction } from "./random-number-action";

export function RandomNumberSection() {
  return (
    <>
      <button
        onClick={async function () {
          await randomNumberAction();
        }}
      >
        Click me
      </button>
      <a href="/">Go to home</a>
    </>
  );
}
