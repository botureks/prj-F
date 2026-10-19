export class StorageResponseDto {
  constructor(
    public statusCode: number,
    public data: any = undefined,
    public message: string = 'Success'
  ) {}
}
