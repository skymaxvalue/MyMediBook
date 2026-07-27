export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastModule =
    | 'appointment'
    | 'patient'
    | 'doctor'
    | 'payment'
    | 'insurance'
    | 'prescription'
    | 'lab'
    | 'report'
    | 'system';


export interface ToastAction {
    label: string;
    callback?: () => void;
}

export interface Toast {
    id: number;
    title: string;
    message: string;

    type: ToastType;
    module?: ToastModule;

    duration?: number;

    closable?: boolean;

    action?: ToastAction;

    createdAt: Date;
}