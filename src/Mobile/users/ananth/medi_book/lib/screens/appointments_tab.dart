
import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/appointment.dart';
import '../models/time_slot.dart';
import '../services/api_service.dart';

class AppointmentsTab extends StatefulWidget {
  const AppointmentsTab({super.key});

  @override
  State<AppointmentsTab> createState() => _AppointmentsTabState();
}

class _AppointmentsTabState extends State<AppointmentsTab> {
  List<Appointment>? _all;
  List<Appointment> _filtered = [];
  bool _loading = true;
  String? _error;
  String _sortKey = 'Select';

  static const List<String> _sortOptions = [
    'Select',
    'Status',
    'Date: Newest',
    'Date: Oldest',
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await ApiService.fetchMyAppointments();
      if (!mounted) return;
      setState(() {
        _all      = data;
        _filtered = List.from(data);
        _loading  = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error   = e.toString();
        _loading = false;
      });
    }
  }

  // ── date parser for sorting: "Jun 26, 2026" → DateTime ─────────────────────
  static DateTime _parseAptDate(String date) {
    try {
      const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,  'May': 5,  'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
      };
      final parts = date.replaceAll(',', '').split(' ');
      if (parts.length == 3) {
        final m = months[parts[0]] ?? 1;
        final d = int.parse(parts[1]);
        final y = int.parse(parts[2]);
        return DateTime(y, m, d);
      }
    } catch (_) {}
    return DateTime(1970);
  }

  void _applySort(String key) {
    if (_all == null) return;
    setState(() {
      _sortKey  = key;
      _filtered = List.from(_all!);
      switch (key) {
        case 'Status':
          // Upcoming first, then Completed, then Cancelled
          const order = {
            AppointmentStatus.upcoming:   0,
            AppointmentStatus.completed:  1,
            AppointmentStatus.cancelled:  2,
          };
          _filtered.sort((a, b) =>
              (order[a.status] ?? 3).compareTo(order[b.status] ?? 3));
        case 'Date: Newest':
          _filtered.sort((a, b) =>
              _parseAptDate(b.date).compareTo(_parseAptDate(a.date)));
        case 'Date: Oldest':
          _filtered.sort((a, b) =>
              _parseAptDate(a.date).compareTo(_parseAptDate(b.date)));
        default:
          // 'Select' → restore original API order
          break;
      }
    });
  }


  // ── tap: fetch detail and open bottom sheet ─────────────────────────────────
  Future<void> _onCardTap(Appointment apt) async {
    if (apt.appointmentId == 0) return;

    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _AppointmentDetailSheet(
        appointmentId: apt.appointmentId,
        appointment: apt,
        onRefresh: () {},
      ),
    );

    if (result == true && mounted) {
      setState(() { _loading = true; _error = null; });
      _load();
    }
  }

  // ── Edit: fetch detail then open edit sheet directly ─────────────────────────
  Future<void> _onEdit(Appointment apt) async {
    if (apt.appointmentId == 0) return;

    // Check if editable (appointment must be > today)
    final canEdit = _isEditable(apt);
    if (!canEdit) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Text('Appointments can only be edited at least 1 day before the scheduled date.'),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ));
      return;
    }

    // Show loading while fetching detail
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator(color: AppColors.primary)),
    );

    Map<String, dynamic>? detail;
    try {
      detail = await ApiService.fetchAppointmentById(apt.appointmentId);
    } catch (_) {}

    if (!mounted) return;
    Navigator.pop(context); // close loading

    if (detail == null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Text('Could not load appointment details.'),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ));
      return;
    }

    final d = detail;
    final associateId = d['associateId'] as int? ?? apt.associateId;
    final patientId   = ApiService.currentPatient?['patientId'] as int? ?? 0;
    final currentVisitPurpose = d['visitPurpose'] as String? ?? apt.visitPurpose;
    final currentVisitType    = d['visitType']    as String? ?? apt.visitType;
    final currentSlotDate     = _fmtDate(d['slotDate'] as String? ?? '');

    if (!mounted) return;
    final edited = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _EditAppointmentSheet(
        apt:                 apt,
        appointmentId:       apt.appointmentId,
        patientId:           patientId,
        associateId:         associateId,
        currentSlotDate:     currentSlotDate,
        currentVisitPurpose: currentVisitPurpose,
        currentVisitType:    currentVisitType,
      ),
    );

    if (edited == true && mounted) {
      setState(() { _loading = true; _error = null; });
      _load();
    }
  }

  // ── Cancel/Delete from list ───────────────────────────────────────────────────
  Future<void> _onCancel(Appointment apt) async {
    if (apt.appointmentId == 0) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Cancel Appointment',
            style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.textDark)),
        content: const Text(
          'Are you sure you want to cancel this appointment? This action cannot be undone.',
          style: TextStyle(color: AppColors.textGrey),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('No, Keep It', style: TextStyle(color: AppColors.textGrey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Yes, Cancel', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator(color: AppColors.primary)),
    );

    final patientId = ApiService.currentPatient?['patientId'] as int? ?? 0;
    final result = await ApiService.cancelAppointmentById(
      appointmentId: apt.appointmentId,
      patientId: patientId,
    );

    if (!mounted) return;
    Navigator.pop(context); // close loading

    final success = result['success'] == true;
    final message = result['message'] as String? ?? (success ? 'Appointment cancelled.' : 'Cancellation failed.');
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: success ? AppColors.completedGreen : Colors.redAccent,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));

    if (success && mounted) {
      await Future.delayed(const Duration(milliseconds: 600));
      setState(() { _loading = true; _error = null; });
      _load();
    }
  }

  // ── Date helper (same logic as detail sheet) ────────────────────────────────
  String _fmtDate(String raw) {
    try {
      final dp = raw.split(' ').first.split('/');
      if (dp.length == 3) {
        const m = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return '${m[int.parse(dp[0])]} ${int.parse(dp[1])}, ${dp[2]}';
      }
    } catch (_) {}
    return raw;
  }

  /// Whether the appointment can be edited/cancelled.
  /// Rule: the appointment's date (start-of-day) must be MORE THAN 24 hours
  /// from the current moment — i.e. the user still has time to change plans.
  bool _isEditable(Appointment apt) {
    if (apt.status != AppointmentStatus.upcoming) return false;
    try {
      const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,  'May': 5,  'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
      };
      final parts = apt.date.replaceAll(',', '').split(' ');
      if (parts.length == 3) {
        final m = months[parts[0]] ?? 1;
        final d = int.parse(parts[1]);
        final y = int.parse(parts[2]);
        // Use start-of-day for the appointment (midnight on that date)
        final apptDate       = DateTime(y, m, d);
        // The cutoff is exactly 24 hours from right now
        final cutoff         = DateTime.now().add(const Duration(hours: 24));
        // Editable only if the appointment day starts AFTER the 24-h cutoff
        return apptDate.isAfter(cutoff);
      }
    } catch (_) {}
    return false;
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primary));
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
            const SizedBox(height: 12),
            Text(_error!, textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.textGrey)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                setState(() { _loading = true; _error = null; });
                _load();
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              child: const Text('Retry', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
          child: Row(
            children: [
              const Icon(Icons.menu, color: AppColors.textDark, size: 20),
              const SizedBox(width: 8),
              const Text(
                'Upcoming & Past',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${_filtered.length} appointment${_filtered.length == 1 ? '' : 's'}',
                  style: const TextStyle(
                    fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),

        Align(
          alignment: Alignment.centerRight,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.divider),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _sortKey,
                  style: const TextStyle(
                    fontSize: 13, color: AppColors.textDark, fontWeight: FontWeight.w500,
                  ),
                  icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.textGrey, size: 18),
                  items: _sortOptions.map((s) => DropdownMenuItem<String>(
                    value: s, child: Text('Sort by: $s'),
                  )).toList(),
                  onChanged: (v) { if (v != null) _applySort(v); },
                ),
              ),
            ),
          ),
        ),

        Expanded(
          child: RefreshIndicator(
            color: AppColors.primary,
            onRefresh: _load,
            child: _filtered.isEmpty
                ? const _EmptyAppointments()
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                    itemCount: _filtered.length,
                    itemBuilder: (_, i) {
                      final apt      = _filtered[i];
                      // Only show Edit/Cancel if the appointment is upcoming
                      // AND still more than 24 hours away.
                      final canModify = _isEditable(apt);
                      return _AppointmentCard(
                        apt: apt,
                        onTap: () => _onCardTap(apt),
                        onEdit:   canModify ? () => _onEdit(apt)   : null,
                        onCancel: canModify ? () => _onCancel(apt) : null,
                      );
                    },
                  ),
          ),
        ),
      ],
    );
  }
}

// ── Appointment Card (tappable) ───────────────────────────────────────────────

class _AppointmentCard extends StatelessWidget {
  final Appointment apt;
  final VoidCallback onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onCancel;
  const _AppointmentCard({
    required this.apt,
    required this.onTap,
    this.onEdit,
    this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    final isCompleted  = apt.status == AppointmentStatus.completed;
    final isCancelled  = apt.status == AppointmentStatus.cancelled;
    final isUpcoming   = apt.status == AppointmentStatus.upcoming;
    final statusLabel  = apt.appointmentStatus.isNotEmpty ? apt.appointmentStatus
        : (isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : 'Upcoming');
    final statusColor  = isCompleted
        ? AppColors.completedGreen
        : isCancelled ? Colors.redAccent : AppColors.upcomingAmber;
    final statusBg     = isCompleted
        ? AppColors.completedBg
        : isCancelled ? const Color(0xFFFFEBEE) : AppColors.upcomingBg;
    final statusIcon   = isCompleted
        ? Icons.check_circle_outline
        : isCancelled ? Icons.cancel_outlined : Icons.hourglass_top;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3)),
          ],
        ),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.favorite_border, size: 15, color: AppColors.primary),
                const SizedBox(width: 8),
                const Text('Visit Purpose  ', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                Expanded(
                  child: Text(apt.visitPurpose,
                      style: const TextStyle(fontSize: 12, color: AppColors.textDark, fontWeight: FontWeight.w600),
                      overflow: TextOverflow.ellipsis),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(statusIcon, size: 13, color: statusColor),
                      const SizedBox(width: 4),
                      Text(statusLabel, style: TextStyle(fontSize: 12, color: statusColor, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 8),
            const Divider(height: 1, color: AppColors.divider),
            const SizedBox(height: 8),

            _InfoRow(Icons.person_outline,           'Patient',    apt.patientName),
            _InfoRow(Icons.calendar_today_outlined,  'Date',       apt.date),
            _InfoRow(Icons.access_time_outlined,     'Time',       apt.time),
            _InfoRow(Icons.medical_services_outlined,'Doctor',     apt.doctorName),
            if (apt.speciality.isNotEmpty)
              _InfoRow(Icons.local_hospital_outlined,'Speciality', apt.speciality),
            if (apt.visitType.isNotEmpty)
              _InfoRow(Icons.assignment_outlined,    'Visit Type', apt.visitType),
            if (apt.relationTypeName.isNotEmpty)
              _InfoRow(Icons.people_outline,         'For',        apt.relationTypeName),

            // ── Inline action buttons for upcoming appointments ────────────────
            if (isUpcoming && (onEdit != null || onCancel != null)) ...[
              const SizedBox(height: 10),
              const Divider(height: 1, color: AppColors.divider),
              const SizedBox(height: 10),
              Row(
                children: [
                  if (onEdit != null)
                    Expanded(
                      child: GestureDetector(
                        onTap: () { onEdit!(); },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 9),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.edit_outlined, size: 15, color: AppColors.primary),
                              const SizedBox(width: 6),
                              Text('Edit',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.primary,
                                  )),
                            ],
                          ),
                        ),
                      ),
                    ),
                  if (onEdit != null && onCancel != null)
                    const SizedBox(width: 10),
                  if (onCancel != null)
                    Expanded(
                      child: GestureDetector(
                        onTap: () { onCancel!(); },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 9),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFEBEE),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.redAccent.withOpacity(0.25)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.cancel_outlined, size: 15, color: Colors.redAccent),
                              const SizedBox(width: 6),
                              const Text('Cancel',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.redAccent,
                                  )),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ] else ...[
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text('Tap to view details',
                      style: TextStyle(fontSize: 11, color: AppColors.primary.withOpacity(0.7))),
                  const SizedBox(width: 4),
                  Icon(Icons.chevron_right, size: 15, color: AppColors.primary.withOpacity(0.7)),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ── Detail Bottom Sheet ───────────────────────────────────────────────────────

class _AppointmentDetailSheet extends StatefulWidget {
  final int appointmentId;
  final Appointment appointment;
  final VoidCallback onRefresh;
  const _AppointmentDetailSheet({
    required this.appointmentId,
    required this.appointment,
    required this.onRefresh,
  });

  @override
  State<_AppointmentDetailSheet> createState() => _AppointmentDetailSheetState();
}

class _AppointmentDetailSheetState extends State<_AppointmentDetailSheet> {
  Map<String, dynamic>? _detail;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    final data = await ApiService.fetchAppointmentById(widget.appointmentId);
    if (!mounted) return;
    setState(() {
      _detail  = data;
      _loading = false;
      if (data == null) _error = 'Could not load appointment details.';
    });
  }

  // format "MM/dd/yyyy HH:mm:ss" → "Mon dd, yyyy"
  String _fmtDate(String raw) {
    try {
      final dp = raw.split(' ').first.split('/');
      if (dp.length == 3) {
        const m = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return '${m[int.parse(dp[0])]} ${int.parse(dp[1])}, ${dp[2]}';
      }
    } catch (_) {}
    return raw;
  }


  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.88,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (_, scrollCtrl) => Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // handle bar
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: AppColors.divider,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.event_note, color: AppColors.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Appointment Details',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textDark)),
                      Text('ID #${widget.appointmentId}',
                          style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
                    ]),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: AppColors.textGrey, size: 20),
                  ),
                ],
              ),
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Divider(color: AppColors.divider),
            ),

            // body
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                  : _error != null
                      ? Center(child: Text(_error!, style: const TextStyle(color: AppColors.textGrey)))
                      : _buildBody(scrollCtrl),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(ScrollController ctrl) {
    final d   = _detail!;
    final doc = d['doctorProfile'] as Map<String, dynamic>? ?? {};

    // status
    final statusStr   = d['appointmentStatus'] as String? ?? '';
    final isCompleted = statusStr.toLowerCase() == 'completed';
    final isCancelled = statusStr.toLowerCase() == 'cancelled';
    final statusColor = isCompleted
        ? AppColors.completedGreen
        : isCancelled ? Colors.redAccent : AppColors.upcomingAmber;
    final statusBg    = isCompleted
        ? AppColors.completedBg
        : isCancelled ? const Color(0xFFFFEBEE) : AppColors.upcomingBg;

    return ListView(
      controller: ctrl,
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 40),
      children: [

        // ── status badge ─────────────────────────────────────────────────────
        Center(
          child: Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(30)),
            child: Text(statusStr,
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: statusColor)),
          ),
        ),

        // (Edit / Cancel actions are now on the appointment list cards)

        // ── Doctor Card ───────────────────────────────────────────────────────
        _SectionCard(
          icon: Icons.medical_services_outlined,
          title: 'Doctor',
          children: [
            _DetailRow('Name',       doc['name']       as String? ?? '—'),
            _DetailRow('Degree',     doc['degree']     as String? ?? '—'),
            _DetailRow('Department', doc['department'] as String? ?? '—'),
            _DetailRow('Hours',
                '${doc['fromTime'] ?? ''} – ${doc['toTime'] ?? ''}'.trim()),
          ],
        ),

        const SizedBox(height: 14),

        // ── Slot Card ─────────────────────────────────────────────────────────
        _SectionCard(
          icon: Icons.calendar_month_outlined,
          title: 'Appointment Slot',
          children: [
            _DetailRow('Date',       _fmtDate(d['slotDate'] as String? ?? '')),
            _DetailRow('Day',        d['slotDay']       as String? ?? '—'),
            _DetailRow('Start Time', d['slotStartTime'] as String? ?? '—'),
            _DetailRow('End Time',   d['slotEndTime']   as String? ?? '—'),
          ],
        ),

        const SizedBox(height: 14),

        // ── Patient Card ──────────────────────────────────────────────────────
        _SectionCard(
          icon: Icons.person_outline,
          title: 'Patient',
          children: [
            _DetailRow('Name',        d['patientName']  as String? ?? '—'),
            _DetailRow('Date of Birth', _fmtDate(d['dateOfBirth'] as String? ?? '')),
            _DetailRow('Gender',      d['gender']       as String? ?? '—'),
            if ((d['relationType'] as String?) != null)
              _DetailRow('Relation',  d['relationType'] as String),
          ],
        ),

        const SizedBox(height: 14),

        // ── Visit Card ────────────────────────────────────────────────────────
        _SectionCard(
          icon: Icons.assignment_outlined,
          title: 'Visit Details',
          children: [
            _DetailRow('Purpose',    d['visitPurpose'] as String? ?? '—'),
            _DetailRow('Visit Type', d['visitType']    as String? ?? '—'),
            _DetailRow('OTP Method', d['otpMethod']    as String? ?? '—'),
            _DetailRow('Booked On',  _fmtDate(d['createdDate'] as String? ?? '')),
          ],
        ),
      ],
    );
  }
}

// ── Edit Appointment Bottom Sheet ─────────────────────────────────────────────

class _EditAppointmentSheet extends StatefulWidget {
  final Appointment apt;
  final int appointmentId;
  final int patientId;
  final int associateId;
  final String currentSlotDate;
  final String currentVisitPurpose;
  final String currentVisitType;

  const _EditAppointmentSheet({
    required this.apt,
    required this.appointmentId,
    required this.patientId,
    required this.associateId,
    required this.currentSlotDate,
    required this.currentVisitPurpose,
    required this.currentVisitType,
  });

  @override
  State<_EditAppointmentSheet> createState() => _EditAppointmentSheetState();
}

class _EditAppointmentSheetState extends State<_EditAppointmentSheet> {
  // ── slot selection state ──────────────────────────────────────────────────
  List<String> _availableDates = [];    // date strings from availability
  String? _selectedDate;
  List<TimeSlot> _timeSlots = [];
  TimeSlot? _selectedSlot;
  bool _loadingDates = true;
  bool _loadingSlots = false;
  String? _datesError;

  // ── form fields ────────────────────────────────────────────────────────────
  late final TextEditingController _purposeCtrl;
  late final TextEditingController _reasonCtrl;
  String _visitType = '';
  bool _saving = false;

  static const List<String> _visitTypes = [
    'In-Person', 'Teleconsultation', 'Home Visit',
  ];

  @override
  void initState() {
    super.initState();
    _purposeCtrl = TextEditingController(text: widget.currentVisitPurpose);
    _reasonCtrl  = TextEditingController();
    // Normalise visitType to match one of our options
    _visitType = _visitTypes.contains(widget.currentVisitType)
        ? widget.currentVisitType
        : _visitTypes.first;
    _loadAvailability();
  }

  @override
  void dispose() {
    _purposeCtrl.dispose();
    _reasonCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadAvailability() async {
    setState(() { _loadingDates = true; _datesError = null; });
    try {
      final avail = await ApiService.fetchDoctorAvailability(
        doctorName: '',
        associateId: widget.associateId,
      );
      if (!mounted) return;
      // Only show future dates (today + 1 day at minimum)
      final today = DateTime.now();
      final todayOnly = DateTime(today.year, today.month, today.day);

      final futureDates = avail
          .where((a) => a.status != 'unavailable')
          .map((a) => a.date)
          .where((dateStr) {
            try {
              const months = {
                'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,  'May': 5,  'Jun': 6,
                'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
              };
              final parts = dateStr.replaceAll(',', '').split(' ');
              if (parts.length == 3) {
                final m = months[parts[0]] ?? 1;
                final d = int.parse(parts[1]);
                final y = int.parse(parts[2]);
                return DateTime(y, m, d).isAfter(todayOnly);
              }
            } catch (_) {}
            return false;
          })
          .toList();

      setState(() {
        _availableDates = futureDates;
        _loadingDates   = false;
        if (futureDates.isEmpty) {
          _datesError = 'No available slots found for this doctor.';
        }
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loadingDates = false;
        _datesError   = 'Failed to load available dates.';
      });
    }
  }

  Future<void> _loadSlots(String dateStr) async {
    setState(() {
      _loadingSlots = true;
      _timeSlots    = [];
      _selectedSlot = null;
    });
    try {
      final slots = await ApiService.fetchTimeSlotsForDate(
        associateId: widget.associateId,
        dateStr: dateStr,
      );
      if (!mounted) return;
      setState(() {
        _timeSlots    = slots;
        _loadingSlots = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loadingSlots = false; });
    }
  }

  Future<void> _save() async {
    if (_selectedSlot == null) {
      _showSnack('Please select a time slot.', success: false);
      return;
    }
    if (_purposeCtrl.text.trim().isEmpty) {
      _showSnack('Visit purpose cannot be empty.', success: false);
      return;
    }

    setState(() => _saving = true);

    final result = await ApiService.updateAppointmentDetail(
      appointmentId:    widget.appointmentId,
      patientId:        widget.patientId,
      associateId:      widget.associateId,
      slotId:           _selectedSlot!.slotId,
      visitPurpose:     _purposeCtrl.text.trim(),
      visitType:        _visitType,
      rescheduleReason: _reasonCtrl.text.trim(),
    );

    if (!mounted) return;
    setState(() => _saving = false);

    if (result['success'] == true) {
      _showSnack(result['message'] as String? ?? 'Appointment updated!', success: true);
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) Navigator.pop(context, true);
    } else {
      _showSnack(result['message'] as String? ?? 'Update failed.', success: false);
    }
  }

  void _showSnack(String msg, {required bool success}) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: success ? AppColors.completedGreen : Colors.redAccent,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.92,
      minChildSize: 0.5,
      maxChildSize: 0.97,
      builder: (_, ctrl) => Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // handle
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 6),
              width: 40, height: 4,
              decoration: BoxDecoration(color: AppColors.divider, borderRadius: BorderRadius.circular(2)),
            ),
            // header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.edit_calendar, color: AppColors.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Edit Appointment',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textDark)),
                      const Text('Select a new slot & update details',
                          style: TextStyle(fontSize: 12, color: AppColors.textGrey)),
                    ]),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: AppColors.textGrey, size: 20),
                  ),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Divider(color: AppColors.divider),
            ),

            Expanded(
              child: _loadingDates
                  ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                  : _datesError != null
                      ? Center(child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Text(_datesError!, textAlign: TextAlign.center,
                              style: const TextStyle(color: AppColors.textGrey)),
                        ))
                      : ListView(
                          controller: ctrl,
                          padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
                          children: [

                            // ── Appointment Info Summary ──────────────────────
                            Container(
                              margin: const EdgeInsets.only(bottom: 14),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: AppColors.primary.withOpacity(0.15)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.info_outline, size: 14, color: AppColors.primary),
                                      const SizedBox(width: 6),
                                      const Text(
                                        'Current Appointment Details',
                                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  _InfoRow(Icons.person_outline,            'Patient',    widget.apt.patientName),
                                  const SizedBox(height: 6),
                                  _InfoRow(Icons.medical_services_outlined, 'Doctor',     widget.apt.doctorName),
                                  const SizedBox(height: 6),
                                  _InfoRow(Icons.local_hospital_outlined,   'Department', widget.apt.speciality.isNotEmpty ? widget.apt.speciality : widget.apt.visitType),
                                  const SizedBox(height: 6),
                                  _InfoRow(Icons.calendar_today_outlined,   'Date',       widget.apt.date),
                                  const SizedBox(height: 6),
                                  _InfoRow(Icons.access_time_outlined,      'Time',       widget.apt.time),
                                ],
                              ),
                            ),

                            // ── Select Date ──────────────────────────────────
                            _SectionCard(
                              icon: Icons.calendar_today_outlined,
                              title: 'Select Date',
                              children: [
                                SizedBox(
                                  height: 48,
                                  child: ListView.separated(
                                    scrollDirection: Axis.horizontal,
                                    itemCount: _availableDates.length,
                                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                                    itemBuilder: (_, i) {
                                      final date = _availableDates[i];
                                      final selected = date == _selectedDate;
                                      return GestureDetector(
                                        onTap: () {
                                          setState(() { _selectedDate = date; });
                                          _loadSlots(date);
                                        },
                                        child: AnimatedContainer(
                                          duration: const Duration(milliseconds: 200),
                                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                          decoration: BoxDecoration(
                                            color: selected ? AppColors.primary : AppColors.cardBg,
                                            borderRadius: BorderRadius.circular(10),
                                            border: Border.all(
                                              color: selected ? AppColors.primary : AppColors.divider,
                                            ),
                                          ),
                                          child: Text(
                                            date,
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                              color: selected ? Colors.white : AppColors.textDark,
                                            ),
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 14),

                            // ── Select Time Slot ─────────────────────────────
                            _SectionCard(
                              icon: Icons.access_time_outlined,
                              title: 'Select Time Slot',
                              children: [
                                if (_selectedDate == null)
                                  const Text('Please select a date first.',
                                      style: TextStyle(fontSize: 12, color: AppColors.textGrey))
                                else if (_loadingSlots)
                                  const Padding(
                                    padding: EdgeInsets.symmetric(vertical: 12),
                                    child: Center(child: CircularProgressIndicator(
                                        color: AppColors.primary, strokeWidth: 2)),
                                  )
                                else if (_timeSlots.isEmpty)
                                  const Text('No slots available for this date.',
                                      style: TextStyle(fontSize: 12, color: AppColors.textGrey))
                                else
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: _timeSlots.map((slot) {
                                      final isBooked   = slot.isBooked;
                                      final isSelected = _selectedSlot?.slotId == slot.slotId;
                                      return GestureDetector(
                                        onTap: isBooked
                                            ? null
                                            : () => setState(() => _selectedSlot = slot),
                                        child: AnimatedContainer(
                                          duration: const Duration(milliseconds: 180),
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 12, vertical: 8),
                                          decoration: BoxDecoration(
                                            color: isBooked
                                                ? AppColors.divider
                                                : isSelected
                                                    ? AppColors.primary
                                                    : AppColors.cardBg,
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(
                                              color: isBooked
                                                  ? AppColors.divider
                                                  : isSelected
                                                      ? AppColors.primary
                                                      : AppColors.divider,
                                            ),
                                          ),
                                          child: Text(
                                            slot.label,
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                              color: isBooked
                                                  ? AppColors.textLight
                                                  : isSelected
                                                      ? Colors.white
                                                      : AppColors.textDark,
                                            ),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                              ],
                            ),

                            const SizedBox(height: 14),

                            // ── Visit Details ─────────────────────────────────
                            _SectionCard(
                              icon: Icons.assignment_outlined,
                              title: 'Visit Details',
                              children: [
                                // Visit Purpose
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text('Visit Purpose',
                                      style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
                                ),
                                TextField(
                                  controller: _purposeCtrl,
                                  style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                                  decoration: InputDecoration(
                                    hintText: 'e.g. Follow-up, ENT, General',
                                    hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(color: AppColors.divider),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(color: AppColors.divider),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(color: AppColors.primary),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                // Visit Type
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text('Visit Type',
                                      style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: AppColors.divider),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<String>(
                                      value: _visitType,
                                      isExpanded: true,
                                      style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                                      icon: const Icon(Icons.keyboard_arrow_down,
                                          color: AppColors.textGrey, size: 18),
                                      items: _visitTypes
                                          .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                                          .toList(),
                                      onChanged: (v) {
                                        if (v != null) setState(() => _visitType = v);
                                      },
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                // Reschedule Reason
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text('Reschedule Reason',
                                      style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
                                ),
                                TextField(
                                  controller: _reasonCtrl,
                                  maxLines: 3,
                                  style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                                  decoration: InputDecoration(
                                    hintText: 'e.g. Schedule conflict, Doctor unavailable...',
                                    hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(color: AppColors.divider),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(color: AppColors.divider),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(color: AppColors.primary),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 24),

                            // ── Save Button ───────────────────────────────────
                            SizedBox(
                              width: double.infinity,
                              height: 52,
                              child: ElevatedButton(
                                onPressed: _saving ? null : _save,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14)),
                                  elevation: 2,
                                ),
                                child: _saving
                                    ? const SizedBox(
                                        width: 22, height: 22,
                                        child: CircularProgressIndicator(
                                            color: Colors.white, strokeWidth: 2.5),
                                      )
                                    : const Text(
                                        'Save Changes',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          color: Colors.white,
                                        ),
                                      ),
                              ),
                            ),
                          ],
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Reusable section card ─────────────────────────────────────────────────────

class _SectionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final List<Widget> children;
  const _SectionCard({required this.icon, required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // section header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
            ),
            child: Row(
              children: [
                Icon(icon, size: 16, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(title,
                    style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: children,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Detail row inside a section card ─────────────────────────────────────────

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  const _DetailRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(label,
                style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
          ),
          const Text('  ·  ', style: TextStyle(color: AppColors.divider)),
          Expanded(
            child: Text(value,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
          ),
        ],
      ),
    );
  }
}

// ── Info row on the card ──────────────────────────────────────────────────────

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoRow(this.icon, this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 15, color: AppColors.primary),
          const SizedBox(width: 8),
          Text('$label  ', style: const TextStyle(fontSize: 12, color: AppColors.textLight)),
          Expanded(
            child: Text(value,
                style: const TextStyle(fontSize: 12, color: AppColors.textDark, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}

// ── Empty state ───────────────────────────────────────────────────────────────

class _EmptyAppointments extends StatelessWidget {
  const _EmptyAppointments();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.event_busy, size: 64, color: AppColors.primary.withOpacity(0.25)),
          const SizedBox(height: 16),
          const Text('No appointments found',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textGrey)),
          const SizedBox(height: 8),
          const Text('Book a new appointment below',
              style: TextStyle(fontSize: 13, color: AppColors.textLight)),
        ],
      ),
    );
  }
}