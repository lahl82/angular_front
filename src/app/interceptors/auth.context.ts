// auth.context.ts
import { HttpContextToken } from '@angular/common/http';
export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);
export const SUPPRESS_SESSION_EXPIRED = new HttpContextToken<boolean>(() => false);
// Puedes usar BYPASS_AUTH en tus solicitudes HTTP para indicar que no 
// deben pasar por el interceptor de autenticación.
