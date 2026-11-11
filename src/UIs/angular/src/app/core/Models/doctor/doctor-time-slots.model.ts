export interface IDoctorTimeSlotModel {
  associateId: number;
  slotId: number;
  slotDate: string;
  workingDays: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
}
