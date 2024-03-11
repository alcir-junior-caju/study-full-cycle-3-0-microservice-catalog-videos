import { validateSync } from "class-validator";
import { ValidatorFieldsInterface } from "./ValidatorFieldsInterface";
import { NotificationPartner } from "./NotificationPattern";

export abstract class ValidatorFields implements ValidatorFieldsInterface {
  validate(notification: NotificationPartner, data: any, fields: string[]): boolean {
    const errors = validateSync(data, { groups: fields });
    if (errors.length) {
      for (const error of errors) {
        const field = error.property;
        Object.values(error.constraints!).forEach((message) => {
          notification.addError(message, field);
        })
      }
    }
    return !errors.length;
  }
}
