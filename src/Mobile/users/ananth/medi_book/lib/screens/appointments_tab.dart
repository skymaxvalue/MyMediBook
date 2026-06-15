
import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/appointment.dart';
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
      final data = await ApiService.fetchAppointments();
      if (!mounted) return;
      setState(() {
        _all = data;
        _filtered = List.from(data);
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  void _applySort(String key) {
    if (_all == null) return;
    setState(() {
      _sortKey = key;
      _filtered = List.from(_all!);
      if (key == 'Status') {
        _filtered.sort((a, b) => a.status.index.compareTo(b.status.index));
      }
     
    });
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
                setState(() {
                  _loading = true;
                  _error = null;
                });
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
                    fontSize: 12,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
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
                    fontSize: 13,
                    color: AppColors.textDark,
                    fontWeight: FontWeight.w500,
                  ),
                  icon: const Icon(
                    Icons.keyboard_arrow_down,
                    color: AppColors.textGrey,
                    size: 18,
                  ),
                  items: _sortOptions.map((s) {
                    return DropdownMenuItem<String>(
                      value: s,
                      child: Text('Sort by: $s'),
                    );
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) _applySort(v);
                  },
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
                    itemBuilder: (_, i) =>
                        _AppointmentCard(apt: _filtered[i]),
                  ),
          ),
        ),
      ],
    );
  }
}



class _AppointmentCard extends StatelessWidget {
  final Appointment apt;
  const _AppointmentCard({required this.apt});

  @override
  Widget build(BuildContext context) {
    final isCompleted = apt.status == AppointmentStatus.completed;
    final statusLabel = isCompleted ? 'Completed' : 'Upcoming';
    final statusColor = isCompleted ? AppColors.completedGreen : AppColors.upcomingAmber;
    final statusBg    = isCompleted ? AppColors.completedBg    : AppColors.upcomingBg;
    final statusIcon  = isCompleted ? Icons.check_circle_outline : Icons.hourglass_top;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
     
          Row(
            children: [
              const Icon(Icons.favorite_border, size: 15, color: AppColors.primary),
              const SizedBox(width: 8),
              const Text(
                'Visit Purpose  ',
                style: TextStyle(fontSize: 12, color: AppColors.textLight),
              ),
              Text(
                apt.visitPurpose,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textDark,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(statusIcon, size: 13, color: statusColor),
                    const SizedBox(width: 4),
                    Text(
                      statusLabel,
                      style: TextStyle(
                        fontSize: 12,
                        color: statusColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),
          const Divider(height: 1, color: AppColors.divider),
          const SizedBox(height: 8),

          _InfoRow(Icons.person_outline,          'Patient Name', apt.patientName),
          _InfoRow(Icons.calendar_today_outlined,  'Date',         apt.date),
          _InfoRow(Icons.access_time_outlined,     'Time',         apt.time),
          _InfoRow(Icons.medical_services_outlined, 'Dr. Name',    apt.doctorName),
        ],
      ),
    );
  }
}

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
          Text(
            '$label  ',
            style: const TextStyle(fontSize: 12, color: AppColors.textLight),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textDark,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}



class _EmptyAppointments extends StatelessWidget {
  const _EmptyAppointments();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.event_busy,
              size: 64, color: AppColors.primary.withOpacity(0.25)),
          const SizedBox(height: 16),
          const Text(
            'No appointments found',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textGrey,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Book a new appointment below',
            style: TextStyle(fontSize: 13, color: AppColors.textLight),
          ),
        ],
      ),
    );
  }
}