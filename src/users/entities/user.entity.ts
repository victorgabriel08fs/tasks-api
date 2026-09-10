export class User {
  public sub: string;
  public name: string;
  public email: string;
  public isAdmin: boolean;
}
export class NativeUser {
  public id: string;
  public name: string;
  public email: string;
  public isAdmin: boolean;
  public createdAt: Date;
  public updatedAt: Date;
}
