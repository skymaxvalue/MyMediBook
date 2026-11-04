export interface IStatusMaster {
  statusId: number;
  statusKey: string;
  statusValue: string;
}

export interface IStatusCategory {
  category: string;
  statuses: IStatusMaster[];
}
