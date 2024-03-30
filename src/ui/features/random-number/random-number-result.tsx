import { fetchRandomNumber } from "./fetch-random-number";

export async function RandomNumberResult() {
  const number = await fetchRandomNumber();
  return <p>{number}</p>;
}
