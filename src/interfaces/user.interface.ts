
export type AccountStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: number;
  rut: string;
  name: string;
  email: string;
  stateAccount: AccountStatus;
}

export interface UserCreateRequest {
  rut: string;
  name: string;
  email: string;
}