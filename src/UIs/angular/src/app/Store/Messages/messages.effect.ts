import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MessagesAction from './messages.actions';
import { AppoinmentService } from '../../core/Services/appoinment.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LabResultService } from 'src/app/core/Services/lab-result.service';
import { MessagesService } from 'src/app/core/Services/messages.service';

@Injectable()
export class MessagesEffects {

    constructor(
        private actions$: Actions,
        private messageService: MessagesService
    ) { }



    updateMyMessages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MessagesAction.updateMessages), mergeMap((action) =>
                this.messageService.updateMessageToRead(action.messageId, action.isRead).pipe(
                    map((response: any) =>
                        MessagesAction.updateMessagesSuccess({
                            message: response.data
                        })
                    ),

                    catchError((error) =>
                        of(
                            MessagesAction.updateMessagesFailure({
                                error:
                                    error?.message ||
                                    'Getting Relation Data Failed'
                            })
                        )
                    )
                )
            )
        )
    );

    getMyLabResults$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MessagesAction.getMyMessages), mergeMap((action) =>
                this.messageService.GetMyMessages_ByPatientId(action.patientId).pipe(
                    map((response: any) =>
                        MessagesAction.getMyMessagesSuccess({
                            MessagesList: response.data
                        })
                    ),

                    catchError((error) =>
                        of(
                            MessagesAction.getMyMessagesFailure({
                                error:
                                    error?.message ||
                                    'Getting Relation Data Failed'
                            })
                        )
                    )
                )
            )
        )
    );



}