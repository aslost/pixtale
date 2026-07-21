class BizError extends Error {
  code: number;

  constructor(message: string, code: number = 501) {
    super(message);
    this.code = code;
    this.name = 'BizError';
  }
}

export default BizError;