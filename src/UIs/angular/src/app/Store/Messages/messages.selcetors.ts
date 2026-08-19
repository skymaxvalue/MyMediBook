import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from './messages.state';

export const selectMessagesState =
    createFeatureSelector<MessageState>(
        'message'
    );



export const selectMyAllMessagesList = createSelector(
    selectMessagesState,
    state => state.MessagesList
);

export const selectUpdateMessage = createSelector(
    selectMessagesState,
    state => state.message
);
