import { NotificationPartner } from './NotificationPattern';

export type FieldErrors =
  | {
      [field: string]: string[];
    }
  | string;

export interface ValidatorFieldsInterface {
  validate(
    notification: NotificationPartner,
    data: any,
    fields: string[],
  ): boolean;
}
