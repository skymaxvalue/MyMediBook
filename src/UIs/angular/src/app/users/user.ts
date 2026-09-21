export interface IUser {
  id: string;
  userName: string | null;
  email: string | null;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: Date | null;
  accessFailedCount: number;
}