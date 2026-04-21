export interface ActionSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
  error?: never; // Memastikan tidak ada properti error
}

export interface ActionError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: string;
  };
  data?: never; // Memastikan tidak ada properti data
  message?: never; // Memastikan tidak ada properti message
}

export type ServerActionReturn<T = void> = ActionSuccess<T> | ActionError;
