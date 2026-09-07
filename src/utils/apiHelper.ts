export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Robust fetch wrapper that gracefully handles non-JSON responses, timeouts, and errors.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    
    let parsedData: any = null;
    if (contentType.includes('application/json')) {
      parsedData = await response.json();
    } else {
      const text = await response.text();
      try {
        parsedData = JSON.parse(text);
      } catch {
        parsedData = { message: text };
      }
    }

    if (!response.ok) {
      const errorMsg =
        (parsedData && (parsedData.error || parsedData.message)) ||
        `HTTP sorğusu xətası: status ${response.status}`;
      return {
        ok: false,
        status: response.status,
        data: parsedData,
        error: errorMsg,
        message: errorMsg,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: parsedData as T,
    };
  } catch (err: any) {
    const message = err?.message || 'Şəbəkə xətası baş verdi.';
    return {
      ok: false,
      status: 0,
      error: message,
      message,
    };
  }
}
