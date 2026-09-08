// TODO Implement this library.

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import '../models/time_slot.dart';
import '../services/api_service.dart';
import 'booking_form_view.dart';

class AvailabilityView extends StatefulWidget {
  final Doctor doctor;
  final VoidCallback onBack;
  final VoidCallback onFullComplete;

  const AvailabilityView({super.key, required this.doctor, required this.onBack, required this.onFullComplete});

  @override
  State<AvailabilityView> createState() => _AvailabilityViewState();
}

class _AvailabilityViewState extends State<AvailabilityView> {
  List<DoctorAvailability>? _slots;
  bool _loading = true;
  String? _error;
  DateTime _fromDate = DateTime.now();
  DoctorAvailability? _bookingSlot;

  @override
  void initState() { super.initState(); _loadSlots(); }

  // Future<void> _loadSlots() async {
  //   setState(() { _loading = true; _error = null; });
  //   try {
  //     final data = await ApiService.fetchDoctorAvailability(doctorName: widget.doctor.name);
  //     if (!mounted) return;
  //     setState(() { _slots = data; _loading = false; });
  //   } catch (e) {
  //     if (!mounted) return;
  //     setState(() { _error = e.toString(); _loading = false; });
  //   }
  // }
Future<void> _loadSlots() async {
  setState(() { _loading = true; _error = null; });
  try {
    final data = await ApiService.fetchDoctorAvailability(
      doctorName: widget.doctor.name,
      associateId: widget.doctor.associateId,
    );
    if (!mounted) return;
    setState(() { _slots = data; _loading = false; });
  } catch (e) {
    if (!mounted) return;
    setState(() { _error = e.toString(); _loading = false; });
  }
}
  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fromDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 90)),
      builder: (ctx, child) => Theme(
        data: ThemeData.light().copyWith(colorScheme: const ColorScheme.light(primary: AppColors.primary)),
        child: child!,
      ),
    );
    if (picked != null && picked != _fromDate) {
      setState(() => _fromDate = picked);
      _loadSlots();
    }
  }

  String _formatDate(DateTime d) =>
      '${d.day.toString().padLeft(2, '0')}-${d.month.toString().padLeft(2, '0')}-${d.year}';

  @override
  Widget build(BuildContext context) {
    if (_bookingSlot != null) {
      return _TimeSlotView(
        doctor: widget.doctor,
        slot: _bookingSlot!,
        onBack: () => setState(() => _bookingSlot = null),
        onFullComplete: widget.onFullComplete,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 14, 16, 12),
          child: Row(children: [
            IconButton(
              onPressed: widget.onBack,
              icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
              padding: EdgeInsets.zero, constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.calendar_month_outlined, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            const Expanded(
              child: Text("Doctor's Availabilities",
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textDark),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1),
            ),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.divider),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 2))],
            ),
            child: Row(children: [
              Container(
                width: 52, height: 52,
                decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
                child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Expanded(
                      child: Text(widget.doctor.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textDark), overflow: TextOverflow.ellipsis),
                    ),
                    const SizedBox(width: 6),
                    Text(widget.doctor.qualification.toUpperCase(),
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textGrey)),
                  ]),
                  const SizedBox(height: 3),
                  Text(widget.doctor.department, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w600)),
                ]),
              ),
            ]),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(color: AppColors.cardBg, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
            child: Row(children: [
              const Text('View Availability From:', style: TextStyle(fontSize: 13, color: AppColors.textGrey)),
              const Spacer(),
              GestureDetector(
                onTap: _pickDate,
                child: Row(children: [
                  Text(_formatDate(_fromDate),
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
                  const SizedBox(width: 6),
                  const Icon(Icons.calendar_today, size: 16, color: AppColors.primary),
                ]),
              ),
            ]),
          ),
        ),
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : _error != null
                  ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
                      const SizedBox(height: 12),
                      Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: _loadSlots,
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                          child: const Text('Retry', style: TextStyle(color: Colors.white))),
                    ]))
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                      itemCount: _slots!.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (_, i) => _AvailabilityRow(
                        slot: _slots![i],
                        onBook: (slot) => setState(() => _bookingSlot = slot),
                      ),
                    ),
        ),
        if (!_loading && _error == null)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: const [
              _LegendDot(color: Color(0xFF4CAF50), label: 'Available'),
              SizedBox(width: 16),
              _LegendDot(color: Color(0xFFFF9800), label: 'Limited Slots'),
              SizedBox(width: 16),
              _LegendDot(color: Color(0xFFF44336), label: 'Unavailable'),
            ]),
          ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: widget.onBack,
              icon: const Icon(Icons.arrow_back, size: 18),
              label: const Text('Return to Doctor List', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary, foregroundColor: Colors.white, elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
        ),
      ],
    );
  }
}



class _AvailabilityRow extends StatelessWidget {
  final DoctorAvailability slot;
  final void Function(DoctorAvailability) onBook;

  const _AvailabilityRow({required this.slot, required this.onBook});

  Color get _statusColor {
    switch (slot.status) {
      case 'limited': return const Color(0xFFFF9800);
      case 'unavailable': return const Color(0xFFF44336);
      default: return const Color(0xFF4CAF50);
    }
  }

  Color get _statusBg {
    switch (slot.status) {
      case 'limited': return const Color(0xFFFFF3E0);
      case 'unavailable': return const Color(0xFFFFEBEE);
      default: return const Color(0xFFE8F5E9);
    }
  }

  String get _statusLabel {
    switch (slot.status) {
      case 'limited': return 'Limited Slots';
      case 'unavailable': return 'Unavailable';
      default: return 'Available';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isUnavailable = slot.status == 'unavailable';
    final screenW = MediaQuery.of(context).size.width;
    final isNarrow = screenW < 380;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(color: AppColors.cardBg, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
      child: isNarrow
          // Narrow layout: stack date/time on top, badge + button on bottom row
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Text(slot.date, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
                  const SizedBox(width: 8),
                  Text(slot.dayName, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textGrey, letterSpacing: 0.6)),
                ]),
                const SizedBox(height: 2),
                Row(children: [
                  const Icon(Icons.access_time, size: 11, color: AppColors.textGrey),
                  const SizedBox(width: 3),
                  Text(slot.timeSlot, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
                ]),
                const SizedBox(height: 8),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(color: _statusBg, borderRadius: BorderRadius.circular(20)),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Container(width: 7, height: 7, decoration: BoxDecoration(color: _statusColor, shape: BoxShape.circle)),
                      const SizedBox(width: 5),
                      Text(_statusLabel, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor)),
                    ]),
                  ),
                  isUnavailable
                      ? Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.divider)),
                          child: Row(mainAxisSize: MainAxisSize.min, children: const [
                            Icon(Icons.edit_calendar_outlined, size: 13, color: AppColors.textGrey),
                            SizedBox(width: 4),
                            Text('Unavailable', style: TextStyle(fontSize: 11, color: AppColors.textGrey)),
                          ]),
                        )
                      : OutlinedButton.icon(
                          onPressed: () => onBook(slot),
                          icon: const Icon(Icons.edit_calendar_outlined, size: 13),
                          label: const Text('Book', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.primary,
                            side: const BorderSide(color: AppColors.primary),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                        ),
                ]),
              ],
            )
          // Wide layout: original single-row
          : Row(children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text(slot.date, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
                    const SizedBox(width: 8),
                    Text(slot.dayName, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textGrey, letterSpacing: 0.6)),
                  ]),
                  const SizedBox(height: 4),
                  Row(children: [
                    const Icon(Icons.access_time, size: 11, color: AppColors.textGrey),
                    const SizedBox(width: 3),
                    Text(slot.timeSlot, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
                  ]),
                ]),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(color: _statusBg, borderRadius: BorderRadius.circular(20)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Container(width: 7, height: 7, decoration: BoxDecoration(color: _statusColor, shape: BoxShape.circle)),
                  const SizedBox(width: 5),
                  Text(_statusLabel, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor)),
                ]),
              ),
              const SizedBox(width: 8),
              isUnavailable
                  ? Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.divider)),
                      child: Row(mainAxisSize: MainAxisSize.min, children: const [
                        Icon(Icons.edit_calendar_outlined, size: 13, color: AppColors.textGrey),
                        SizedBox(width: 4),
                        Text('Unavailable', style: TextStyle(fontSize: 11, color: AppColors.textGrey)),
                      ]),
                    )
                  : OutlinedButton.icon(
                      onPressed: () => onBook(slot),
                      icon: const Icon(Icons.edit_calendar_outlined, size: 13),
                      label: const Text('Book', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: const BorderSide(color: AppColors.primary),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    ),
            ]),
    );
  }
}


class _TimeSlotView extends StatefulWidget {
  final Doctor doctor;
  final DoctorAvailability slot;
  final VoidCallback onBack;
  final VoidCallback onFullComplete;

  const _TimeSlotView({required this.doctor, required this.slot, required this.onBack, required this.onFullComplete});

  @override
  State<_TimeSlotView> createState() => _TimeSlotViewState();
}

class _TimeSlotViewState extends State<_TimeSlotView> {
  List<TimeSlot>? _timeSlots;
  bool _loading = true;
  String? _error;
  TimeSlot? _selectedSlot;   // the full TimeSlot object (carries slotId)
  bool _showForm = false;

  @override
  void initState() { super.initState(); _loadSlots(); }

  Future<void> _loadSlots() async {
    setState(() { _loading = true; _error = null; });
    try {
      final associateId = widget.doctor.associateId;
      List<TimeSlot> data;
      if (associateId != null) {
        data = await ApiService.fetchTimeSlotsForDate(
          associateId: associateId,
          dateStr: widget.slot.date,
        );
      } else {
        data = await ApiService.fetchTimeSlotsForDate(
          associateId: 0,
          dateStr: widget.slot.date,
        );
      }

      // ── Filter past slots when the selected date is today ──────────────────
      final now   = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);

      // slot.date is "Jul 31, 2026" — parse using the same month-name map
      final slotDate = _parseDisplayDate(widget.slot.date);

      if (slotDate != null &&
          slotDate.year  == today.year  &&
          slotDate.month == today.month &&
          slotDate.day   == today.day) {
        // It's today — keep only slots whose start time is after now
        data = data.where((ts) => _slotIsAfterNow(ts.time, now)).toList();
        debugPrint('[TimeslotFilter] today detected, kept ${data.length} future slots');
      }
      // ──────────────────────────────────────────────────────────────────────

      if (!mounted) return;
      setState(() { _timeSlots = data; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  /// Parses "Jul 31, 2026" → DateTime, returns null on failure.
  DateTime? _parseDisplayDate(String s) {
    try {
      const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,  'May': 5,  'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
      };
      final clean = s.replaceAll(',', '').trim(); // "Jul 31 2026"
      final parts = clean.split(RegExp(r'\s+'));   // ["Jul", "31", "2026"]
      if (parts.length == 3) {
        final m = months[parts[0]];
        final d = int.tryParse(parts[1]);
        final y = int.tryParse(parts[2]);
        if (m != null && d != null && y != null) {
          return DateTime(y, m, d);
        }
      }
    } catch (_) {}
    return null;
  }

  /// Returns true when the slot's start time ("10:00 AM") is strictly after [now].
  bool _slotIsAfterNow(String timeStr, DateTime now) {
    try {
      final upper    = timeStr.trim().toUpperCase();  // "10:00 AM"
      final isPm     = upper.contains('PM');
      final isAm     = upper.contains('AM');
      final timePart = upper
          .replaceAll('AM', '')
          .replaceAll('PM', '')
          .trim();           // "10:00"
      final hm   = timePart.split(':');
      int   hour = int.parse(hm[0]);
      final min  = int.parse(hm[1]);

      if (isPm && hour != 12) hour += 12;
      if (isAm && hour == 12) hour  = 0;  // 12:xx AM → 0:xx

      final slotTime = DateTime(now.year, now.month, now.day, hour, min);
      return slotTime.isAfter(now);
    } catch (_) {
      return true; // on any parse failure, keep the slot
    }
  }


  @override
  Widget build(BuildContext context) {
    if (_showForm && _selectedSlot != null) {
      return BookingFormView(
        doctor: widget.doctor,
        slot: widget.slot,
        selectedTime: _selectedSlot!.label,
        selectedSlotId: _selectedSlot!.slotId,
        onBack: () => setState(() => _showForm = false),
        onFullComplete: widget.onFullComplete,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── header ──────────────────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 14, 16, 12),
          child: Row(children: [
            IconButton(
              onPressed: widget.onBack,
              icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
              padding: EdgeInsets.zero, constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.schedule, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            const Expanded(
              child: Text('Available Appointments',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textDark),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1),
            ),
          ]),
        ),
        // ── doctor card ─────────────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.divider),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 2))],
            ),
            child: Row(children: [
              Container(
                width: 52, height: 52,
                decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
                child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Flexible(child: Text(widget.doctor.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textDark), overflow: TextOverflow.ellipsis)),
                  const SizedBox(width: 6),
                  Text(widget.doctor.qualification.toUpperCase(),
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textGrey)),
                ]),
                const SizedBox(height: 3),
                Text(widget.doctor.department, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w600)),
              ])),
            ]),
          ),
        ),
        // ── selected date banner ─────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.06), borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: Row(children: [
              const Icon(Icons.calendar_today, size: 15, color: AppColors.primary),
              const SizedBox(width: 8),
              Text('${widget.slot.date}  •  ${widget.slot.dayName}',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
            ]),
          ),
        ),
        // ── time-slot grid (takes all remaining space, scrollable) ──────────
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : _error != null
                  ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
                      const SizedBox(height: 12),
                      Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: _loadSlots,
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                          child: const Text('Retry', style: TextStyle(color: Colors.white))),
                    ]))
                  : Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          final w = constraints.maxWidth;
                          // Adaptive columns based on available width
                          final cols = w < 280 ? 2
                              : w < 340 ? 3
                              : w < 400 ? 4
                              : w < 600 ? 5
                              : 6;
                          // Aspect ratio: shorter on very narrow screens
                          final aspectRatio = w < 280 ? 2.0
                              : w < 340 ? 2.2
                              : 2.4;
                          return GridView.builder(
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: cols,
                              mainAxisSpacing: 10,
                              crossAxisSpacing: 8,
                              childAspectRatio: aspectRatio,
                            ),
                            itemCount: _timeSlots!.length,
                            itemBuilder: (_, i) {
                              final ts = _timeSlots![i];
                              return _TimeSlotChip(
                                timeSlot: ts,
                                isSelected: _selectedSlot != null &&
                                  _selectedSlot!.slotId == ts.slotId &&
                                  _selectedSlot!.time == ts.time,
                                onTap: ts.isBooked ? null : () => setState(() => _selectedSlot = ts),
                              );
                            },
                          );
                        },
                      ),
                    ),
        ),
        // ── legend – always visible below the grid ──────────────────────────
        if (!_loading && _error == null)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
            child: Row(children: const [
              _LegendDot(color: AppColors.primary, label: 'Available'),
              SizedBox(width: 16),
              _LegendDot(color: Color(0xFFBDBDBD), label: 'Already Booked'),
            ]),
          ),
        // ── Book Appointment button – always visible at the bottom ──────────
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _selectedSlot == null ? null : () => setState(() => _showForm = true),
              icon: const Icon(Icons.calendar_month, size: 18),
              label: const Text('Book Appointment', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                disabledBackgroundColor: AppColors.primary.withOpacity(0.4),
                foregroundColor: Colors.white,
                disabledForegroundColor: Colors.white70,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),

        ),
      ],
    );
  }
}



class _TimeSlotChip extends StatelessWidget {
  final TimeSlot timeSlot;
  final bool isSelected;
  final VoidCallback? onTap;

  const _TimeSlotChip({required this.timeSlot, required this.isSelected, this.onTap});

  @override
  Widget build(BuildContext context) {
    final booked = timeSlot.isBooked;
    final Color bgColor     = booked ? const Color(0xFFF5F5F5) : isSelected ? AppColors.primary : AppColors.cardBg;
    final Color borderColor = booked ? const Color(0xFFE0E0E0) : isSelected ? AppColors.primary : AppColors.primary.withOpacity(0.5);
    final Color textColor   = booked ? const Color(0xFFBDBDBD) : isSelected ? Colors.white : AppColors.primary;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8), border: Border.all(color: borderColor)),
        alignment: Alignment.center,
        child: Text(
          timeSlot.label,   // shows "09:00 AM – 09:30 AM"
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: textColor),
        ),
      ),
    );
  }
}



class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;
  const _LegendDot({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(mainAxisSize: MainAxisSize.min, children: [
      Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 5),
      Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
    ]);
  }
}