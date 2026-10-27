export async function courierApi(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/courier${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json' },
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(10000)])
        : AbortSignal.timeout(10000),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new Error('Could not connect to the courier service. Please try again shortly.');
  }
  const text = await response.text();
  let data = text;
  try { data = text ? JSON.parse(text) : null; } catch { /* Delete returns plain text. */ }
  if (!response.ok) {
    const message = typeof data === 'object' && data ? data.detail || data.message : null;
    throw new Error(message || 'The courier service could not complete this request. Please try again.');
  }
  return data;
}
