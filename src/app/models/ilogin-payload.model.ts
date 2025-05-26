// src/app/models/ilogin-payload.model.ts
import { IUser } from './iuser.model';

export interface ILoginPayload {
  user: IUser;
}
