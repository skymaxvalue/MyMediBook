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
      doctorId: widget.doctor.doctorId, // ← add this
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
            const Text("Doctor's Availabilities",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
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
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Text(widget.doctor.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textDark)),
                  const SizedBox(width: 6),
                  Text(widget.doctor.qualification.toUpperCase(),
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textGrey)),
                ]),
                const SizedBox(height: 3),
                Text(widget.doctor.department, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w600)),
              ]),
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
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(color: AppColors.cardBg, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
      child: Row(children: [
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
  String? _selectedTime;
  bool _showForm = false;

  @override
  void initState() { super.initState(); _loadSlots(); }

  Future<void> _loadSlots() async {
    setState(() { _loading = true; _error = null; });
    try {
      final data = await ApiService.fetchTimeSlots(doctorName: widget.doctor.name, date: widget.slot.date);
      if (!mounted) return;
      setState(() { _timeSlots = data; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_showForm && _selectedTime != null) {
      return BookingFormView(
        doctor: widget.doctor,
        slot: widget.slot,
        selectedTime: _selectedTime!,
        onBack: () => setState(() => _showForm = false),
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
            const Icon(Icons.schedule, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            const Text('Available Appointments',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
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
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Text(widget.doctor.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textDark)),
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
                      child: GridView.builder(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 4, mainAxisSpacing: 10, crossAxisSpacing: 8, childAspectRatio: 2.4,
                        ),
                        itemCount: _timeSlots!.length,
                        itemBuilder: (_, i) {
                          final ts = _timeSlots![i];
                          return _TimeSlotChip(
                            timeSlot: ts,
                            isSelected: ts.time == _selectedTime,
                            onTap: ts.isBooked ? null : () => setState(() => _selectedTime = ts.time),
                          );
                        },
                      ),
                    ),
        ),
        if (!_loading && _error == null)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: Row(children: const [
              _LegendDot(color: AppColors.primary, label: 'Available'),
              SizedBox(width: 16),
              _LegendDot(color: Color(0xFFBDBDBD), label: 'Already Booked'),
            ]),
          ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _selectedTime == null ? null : () => setState(() => _showForm = true),
              icon: const Icon(Icons.calendar_month, size: 18),
              label: const Text('Book Appointment', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                disabledBackgroundColor: AppColors.primary.withOpacity(0.4),
                foregroundColor: Colors.white, disabledForegroundColor: Colors.white70,
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
    final Color bgColor = booked ? const Color(0xFFF5F5F5) : isSelected ? AppColors.primary : AppColors.cardBg;
    final Color borderColor = booked ? const Color(0xFFE0E0E0) : isSelected ? AppColors.primary : AppColors.primary.withOpacity(0.5);
    final Color textColor = booked ? const Color(0xFFBDBDBD) : isSelected ? Colors.white : AppColors.primary;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8), border: Border.all(color: borderColor)),
        alignment: Alignment.center,
        child: Text(timeSlot.time, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: textColor)),
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