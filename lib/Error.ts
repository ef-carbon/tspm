export interface IOptions { }

export abstract class TspmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TspmError';
  }
}

export default TspmError;
