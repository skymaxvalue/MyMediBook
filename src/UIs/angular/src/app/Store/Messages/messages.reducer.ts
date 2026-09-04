import { createReducer, on } from '@ngrx/store';
import * as MessagesAction from './messages.actions';
import { initialMessagetState } from './messages.state';

export const MessagesReducer = createReducer(
    initialMessagetState,



    on(MessagesAction.getMyMessages, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(MessagesAction.getMyMessagesSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        MessagesList: action.MessagesList
    })),

    on(MessagesAction.getMyMessagesFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(MessagesAction.updateMessages, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(MessagesAction.updateMessagesSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        message: action.message
    })),

    on(MessagesAction.updateMessagesFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))


);