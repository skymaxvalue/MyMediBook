// lib/models/message.dart

/// Represents a single message / notification in the patient's inbox.
/// Fields are mapped from GET /api/v1/Message/MessageListById/{id}
class Message {
  final int    messageId;
  final String message;     // notification body text
  final String title;
  final String notifType;   // e.g. 'AppointmentCreated'
  final String doctorName;
  final String doctorRole;
  final String date;        // e.g. '22 Jun 2026'
  final String time;        // e.g. '09:30 AM'
  bool         isRead;      // "False" / "True" from API, stored as bool

  Message({
    required this.messageId,
    required this.message,
    required this.title,
    required this.notifType,
    required this.date,
    required this.time,
    this.doctorName = '',
    this.doctorRole = '',
    this.isRead = false,
  });

  /// Maps the raw API JSON to a [Message].
  /// The API returns `isRead` as a String "True"/"False".
  factory Message.fromApiJson(Map<String, dynamic> j) => Message(
        messageId:  j['messageId']  as int?    ?? 0,
        message:    j['message']    as String? ?? '',
        title:      j['title']      as String? ?? '',
        notifType:  j['notifType']  as String? ?? '',
        date:       j['date']       as String? ?? '',
        time:       j['time']       as String? ?? '',
        doctorName: j['doctorName'] as String? ?? '',
        doctorRole: j['doctorRole'] as String? ?? '',
        isRead:     (j['isRead'] as String? ?? 'false').toLowerCase() == 'true',
      );

  // Keep the old factory alias so any existing call-sites don't break.
  factory Message.fromJson(Map<String, dynamic> j) => Message.fromApiJson(j);
}
