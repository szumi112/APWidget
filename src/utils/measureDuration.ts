export const measureDuration = async (
  promise: Promise<any>
): Promise<{ result: any; duration: number }> => {
  const startTime = Date.now();
  const result = await promise;
  const endTime = Date.now();
  const duration = endTime - startTime;
  return { result, duration };
};
