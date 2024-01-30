import { FieldErrors, ValidatorError, ValidatorFields } from "../../validator";

type Expected = | {
  validator: ValidatorFields<any>;
  data: any;
} | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as ValidatorError;
        return assertContainsErrorsMessages(error.error, received)
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }
    }
  }
});

function assertContainsErrorsMessages(expected: FieldErrors, received: FieldErrors) {
  const isMatch = expect.objectContaining(expected).asymmetricMatch(received);

  return isMatch
    ? isValid()
    : {
      pass: false,
      message: () => `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`,
    }
}

function isValid() {
  return { pass: true, message: () => "" };
}
