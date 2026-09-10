export class NativeTask {
  public id: string;
  public title: string;
  public description?: string | null;
  public done: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public ownerId: string;
}
