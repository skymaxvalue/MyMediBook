import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    toasts = signal<Toast[]>([]);

    private id = 0;

    show(
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string
    ) {

        const toast: Toast = {
            id: ++this.id,
            type,
            title,
            message
        };

        this.toasts.update(x => [...x, toast]);

        setTimeout(() => {
            this.remove(toast.id);
        }, 4000);

    }

    remove(id: number) {
        this.toasts.update(x => x.filter(y => y.id !== id));
    }

    success(title: string, message: string) {
        this.show('success', title, message);
    }

    error(title: string, message: string) {
        this.show('error', title, message);
    }

    warning(title: string, message: string) {
        this.show('warning', title, message);
    }

    info(title: string, message: string) {
        this.show('info', title, message);
    }

}