import { State } from "ts-fsrs";

export enum PracticeCardStateModel {
  learning = "learning",
  new = "new",
  relearning = "relearning",
  review = "review",
}

export class PracticeCardStateTransformer {
  constructor(private readonly domain: PracticeCardStateModel) {}

  toFsrs() {
    switch (this.domain) {
      case PracticeCardStateModel.learning:
        return State.Learning;
      case PracticeCardStateModel.new:
        return State.New;
      case PracticeCardStateModel.relearning:
        return State.Relearning;
      case PracticeCardStateModel.review:
        return State.Review;
    }
  }

  static fromFsrs(fsrsState: State): PracticeCardStateModel {
    switch (fsrsState) {
      case State.Learning:
        return PracticeCardStateModel.learning;
      case State.New:
        return PracticeCardStateModel.new;
      case State.Relearning:
        return PracticeCardStateModel.relearning;
      case State.Review:
        return PracticeCardStateModel.review;
    }
  }
}
