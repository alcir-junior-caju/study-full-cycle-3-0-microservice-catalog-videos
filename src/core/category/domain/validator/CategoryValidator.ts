import { MaxLength } from "class-validator";
import { CategoryEntity } from "../entity";
import { NotificationPartner, ValidatorFields } from "../../../shared";

export class CategoryValidator extends ValidatorFields {
  validate(notification: NotificationPartner, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ["name"];
    return super.validate(notification, new CategoryRules(data), newFields);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}

class CategoryRules {
  @MaxLength(255, { groups: ["name"] })
  name: string;

  constructor({ name, description, isActive }: CategoryEntity) {
    Object.assign(this, { name, description, isActive });
  }
}
