export interface UseCase {
  exec(...params: unknown[]): Promise<unknown>;
}
