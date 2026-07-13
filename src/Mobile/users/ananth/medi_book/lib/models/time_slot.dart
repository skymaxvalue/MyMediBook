
class TimeSlot {
  final int slotId;       // slotNumber from API — used as slotId when booking
  final String time;      // startTime  e.g. "09:00 AM"
  final String endTime;   // endTime    e.g. "09:30 AM"
  final bool isBooked;

  const TimeSlot({
    required this.slotId,
    required this.time,
    required this.endTime,
    required this.isBooked,
  });

  factory TimeSlot.fromJson(Map<String, dynamic> json) {
    return TimeSlot(
      slotId:   json['slotId']   as int?    ?? json['slotNumber'] as int? ?? 0,
      time:     json['time']     as String? ?? json['startTime']  as String? ?? '',
      endTime:  json['endTime']  as String? ?? '',
      isBooked: json['isBooked'] as bool?   ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'slotId':   slotId,
    'time':     time,
    'endTime':  endTime,
    'isBooked': isBooked,
  };

  /// Display label e.g. "09:00 AM – 09:30 AM"
  String get label => endTime.isNotEmpty ? '$time – $endTime' : time;
}