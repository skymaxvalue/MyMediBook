
export interface MessageState {
    message: any;
    isLoading: boolean;
    error: string | null;
    relations: any[];
    MessagesList: any[];

}

export const initialMessagetState: MessageState = {
    message: {} as any,
    isLoading: false,
    error: null,
    relations: [],
    MessagesList: [],

};