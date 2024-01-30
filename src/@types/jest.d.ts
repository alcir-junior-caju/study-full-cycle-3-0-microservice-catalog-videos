import { FieldErrors } from "../shared";

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expeted: FieldErrors) => R;
    }
  }
}
