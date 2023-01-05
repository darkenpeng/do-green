// https://github.com/alexreardon/tiny-invariant/blob/master/src/tiny-invariant.ts

export default function invariant(
  condition: any,
  message?: string | Error, // 메세지나 메세지를 반환하는 함수
): asserts condition {
  if (!condition) {
    if (typeof message === 'string') {
      throw new Error(`Invariant failed: ${message}`);
    }
    if (message instanceof Error) {
      throw message;
    }
  }
}
