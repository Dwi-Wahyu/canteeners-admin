import { ActionError, ActionSuccess } from "@/types/server-action";
export function successResponse<T = void>(
  data?: T,
  message?: string,
): ActionSuccess<T> {
  return { success: true, data, message };
}

export function errorResponse(
  message: string,
  code?: string,
  details?: any,
): ActionError {
  return { success: false, error: { message, code, details } };
}
