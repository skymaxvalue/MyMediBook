import { createAction, props } from '@ngrx/store';
import { LabResultModel } from 'src/app/core/Models/lab-result.model';


export const getMyMessages = createAction(
    '[message] get ',
    props<{ patientId: number }>()

);

export const getMyMessagesSuccess = createAction(
    '[message] get  Success',
    props<{ MessagesList: any }>()
);

export const getMyMessagesFailure = createAction(
    '[message ] get  Failure',
    props<{ error: string }>()
);
export const updateMessages = createAction(
    '[message] update ',
    props<{ messageId: number, isRead: boolean }>()

);

export const updateMessagesSuccess = createAction(
    '[message] update  Success',
    props<{ message: any }>()
);

export const updateMessagesFailure = createAction(
    '[message ] update  Failure',
    props<{ error: string }>()
);
