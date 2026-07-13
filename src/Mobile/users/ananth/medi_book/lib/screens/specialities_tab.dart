
import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/doctor.dart';
import '../services/api_service.dart';
import 'availability_view.dart';

class SpecialitiesTab extends StatefulWidget {
  const SpecialitiesTab({super.key});

  @override
  State<SpecialitiesTab> createState() => _SpecialitiesTabState();
}

class _SpecialitiesTabState extends State<SpecialitiesTab> {
  Map<String, List<Doctor>>? _all;
  Map<String, List<Doctor>> _filtered = {};
  bool _loading = true;
  String? _error;
  final TextEditingController _searchCtrl = TextEditingController();

  Doctor? _selectedDoctor;

  @override
  void initState() {
    super.initState();
    _load();
    _searchCtrl.addListener(_onSearch);
  }

  @override
  void dispose() {
    _searchCtrl.removeListener(_onSearch);
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final data = await ApiService.fetchDoctorsBySpecialty();
      if (!mounted) return;
      setState(() {
        _all = data;
        _filtered = Map.from(data);
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

  void _onSearch() {
    final q = _searchCtrl.text.trim().toLowerCase();
    if (_all == null) return;
    if (q.isEmpty) {
      setState(() => _filtered = Map.from(_all!));
      return;
    }
    final result = <String, List<Doctor>>{};
    _all!.forEach((specialty, doctors) {
      final matched = doctors.where((d) {
        return d.name.toLowerCase().contains(q) ||
            d.qualification.toLowerCase().contains(q) ||
            d.department.toLowerCase().contains(q) ||
            specialty.toLowerCase().contains(q);
      }).toList();
      if (matched.isNotEmpty) result[specialty] = matched;
    });
    setState(() => _filtered = result);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.primary));
    }
    if (_error != null) {
      return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
          const SizedBox(height: 12),
          Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () { setState(() { _loading = true; _error = null; }); _load(); },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Retry', style: TextStyle(color: Colors.white)),
          ),
        ]),
      );
    }

    if (_selectedDoctor != null) {
      return AvailabilityView(
        doctor: _selectedDoctor!,
        onBack: () => setState(() => _selectedDoctor = null),
        onFullComplete: () => setState(() => _selectedDoctor = null),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
          child: Row(children: const [
            Icon(Icons.medical_services_outlined, color: AppColors.primary, size: 20),
            SizedBox(width: 8),
            Text('Our Specialities', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Row(children: [
            Expanded(
              child: Container(
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.cardBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.divider),
                ),
                child: TextField(
                  controller: _searchCtrl,
                  style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                  decoration: InputDecoration(
                    hintText: 'Search by Doctor Name, Speciality, or Symptoms...',
                    hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                    suffixIcon: _searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.close, size: 16, color: AppColors.textGrey),
                            onPressed: () => _searchCtrl.clear(),
                          )
                        : null,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            SizedBox(
              height: 44,
              child: ElevatedButton.icon(
                onPressed: _onSearch,
                icon: const Icon(Icons.search, size: 16),
                label: const Text('Search', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                ),
              ),
            ),
          ]),
        ),
        Expanded(
          child: _filtered.isEmpty
              ? const _EmptySearch()
              : RefreshIndicator(
                  color: AppColors.primary,
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
                    children: _filtered.entries.map((entry) {
                      return _SpecialtyGroup(
                        specialty: entry.key,
                        doctors: entry.value,
                        onDoctorTap: (d) => setState(() => _selectedDoctor = d),
                      );
                    }).toList(),
                  ),
                ),
        ),
      ],
    );
  }
}



class _SpecialtyGroup extends StatelessWidget {
  final String specialty;
  final List<Doctor> doctors;
  final void Function(Doctor) onDoctorTap;

  const _SpecialtyGroup({required this.specialty, required this.doctors, required this.onDoctorTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 4, bottom: 10),
          child: Row(children: [
            Text(specialty, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.primary)),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
              decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.08), borderRadius: BorderRadius.circular(12)),
              child: Text('${doctors.length} Doctor${doctors.length > 1 ? 's' : ''}',
                  style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600)),
            ),
          ]),
        ),
        ...doctors.map((d) => _DoctorCard(doctor: d, onTap: onDoctorTap)),
        const SizedBox(height: 8),
      ],
    );
  }
}



class _DoctorCard extends StatelessWidget {
  final Doctor doctor;
  final void Function(Doctor) onTap;
  const _DoctorCard({required this.doctor, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3))],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 56, height: 56,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.divider),
            ),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: const [
              Icon(Icons.person, color: AppColors.textGrey, size: 26),
              Text('Doctor\nImage', textAlign: TextAlign.center, style: TextStyle(fontSize: 7, color: AppColors.textLight)),
            ]),
          ),
          const SizedBox(width: 10),
          // Middle section: name, qualification, department
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  doctor.name,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
                const SizedBox(height: 4),
                IntrinsicWidth(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      doctor.qualification.toUpperCase(),
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.primary, letterSpacing: 0.3),
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  doctor.department,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textGrey),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // Right section: visiting hours badge + time + chevron
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.upcomingBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Visiting Hours',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.upcomingAmber),
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.access_time, size: 10, color: AppColors.textGrey),
                  const SizedBox(width: 2),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 110),
                    child: Text(
                      doctor.visitingHours,
                      style: const TextStyle(fontSize: 10, color: AppColors.textGrey),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              GestureDetector(
                onTap: () => onTap(doctor),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.divider),
                  ),
                  child: const Icon(Icons.chevron_right, size: 14, color: AppColors.primary),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}



class _EmptySearch extends StatelessWidget {
  const _EmptySearch();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(Icons.search_off, size: 64, color: AppColors.primary.withOpacity(0.25)),
        const SizedBox(height: 16),
        const Text('No doctors found', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textGrey)),
        const SizedBox(height: 8),
        const Text('Try a different name or specialty', style: TextStyle(fontSize: 13, color: AppColors.textLight)),
      ]),
    );
  }
}