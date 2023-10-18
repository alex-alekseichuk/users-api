export class PaginationRequest {
  public readonly limit?: number;
  public readonly offset?: number;

  public static from(query: Record<string, string>) {
    return {
      offset: query.offset ? Number(query.offset) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
    }
  }
}
