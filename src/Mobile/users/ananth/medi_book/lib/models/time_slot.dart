
class TimeSlot {
  final String time;
  final bool isBooked;

  const TimeSlot({required this.time, required this.isBooked});

  factory TimeSlot.fromJson(Map<String, dynamic> json) {
    return TimeSlot(
      time: json['time'] as String,
      isBooked: json['isBooked'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {'time': time, 'isBooked': isBooked};
}