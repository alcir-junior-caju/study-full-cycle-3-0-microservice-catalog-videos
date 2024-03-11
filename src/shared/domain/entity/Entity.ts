import { NotificationPartner } from "../validator";
import { ValueObject } from "../valueObject";

export abstract class Entity {
  notification: NotificationPartner = new NotificationPartner();

  abstract get entityId(): ValueObject;
  abstract toJSON(): any;
}
