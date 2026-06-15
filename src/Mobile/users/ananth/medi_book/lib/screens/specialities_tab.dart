
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:medi_book/models/availability.dart';

// import '../app_colors.dart';
// import '../models/doctor.dart';
// import '../models/time_slot.dart';
// import '../services/api_service.dart';



// class SpecialitiesTab extends StatefulWidget {
//   const SpecialitiesTab({super.key});

//   @override
//   State<SpecialitiesTab> createState() => _SpecialitiesTabState();
// }

// class _SpecialitiesTabState extends State<SpecialitiesTab> {
//   Map<String, List<Doctor>>? _all;
//   Map<String, List<Doctor>> _filtered = {};
//   bool _loading = true;
//   String? _error;
//   final TextEditingController _searchCtrl = TextEditingController();

//   Doctor? _selectedDoctor;

//   @override
//   void initState() {
//     super.initState();
//     _load();
//     _searchCtrl.addListener(_onSearch);
//   }

//   @override
//   void dispose() {
//     _searchCtrl.removeListener(_onSearch);
//     _searchCtrl.dispose();
//     super.dispose();
//   }

//   Future<void> _load() async {
//     try {
//       final data = await ApiService.fetchDoctorsBySpecialty();
//       if (!mounted) return;
//       setState(() {
//         _all = data;
//         _filtered = Map.from(data);
//         _loading = false;
//       });
//     } catch (e) {
//       if (!mounted) return;
//       setState(() {
//         _error = e.toString();
//         _loading = false;
//       });
//     }
//   }

//   void _onSearch() {
//     final q = _searchCtrl.text.trim().toLowerCase();
//     if (_all == null) return;
//     if (q.isEmpty) {
//       setState(() => _filtered = Map.from(_all!));
//       return;
//     }
//     final result = <String, List<Doctor>>{};
//     _all!.forEach((specialty, doctors) {
//       final matched = doctors.where((d) {
//         return d.name.toLowerCase().contains(q) ||
//             d.qualification.toLowerCase().contains(q) ||
//             d.department.toLowerCase().contains(q) ||
//             specialty.toLowerCase().contains(q);
//       }).toList();
//       if (matched.isNotEmpty) result[specialty] = matched;
//     });
//     setState(() => _filtered = result);
//   }

//   @override
//   Widget build(BuildContext context) {
//     if (_loading) {
//       return const Center(child: CircularProgressIndicator(color: AppColors.primary));
//     }
//     if (_error != null) {
//       return Center(
//         child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
//           const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
//           const SizedBox(height: 12),
//           Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
//           const SizedBox(height: 16),
//           ElevatedButton(
//             onPressed: () { setState(() { _loading = true; _error = null; }); _load(); },
//             style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
//             child: const Text('Retry', style: TextStyle(color: Colors.white)),
//           ),
//         ]),
//       );
//     }

//     if (_selectedDoctor != null) {
//       return _AvailabilityView(
//         doctor: _selectedDoctor!,
//         onBack: () => setState(() => _selectedDoctor = null),
//         onFullComplete: () => setState(() => _selectedDoctor = null),
//       );
//     }

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
//           child: Row(children: const [
//             Icon(Icons.medical_services_outlined, color: AppColors.primary, size: 20),
//             SizedBox(width: 8),
//             Text('Our Specialities', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//           ]),
//         ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
//           child: Row(children: [
//             Expanded(
//               child: Container(
//                 height: 44,
//                 decoration: BoxDecoration(
//                   color: AppColors.cardBg,
//                   borderRadius: BorderRadius.circular(10),
//                   border: Border.all(color: AppColors.divider),
//                 ),
//                 child: TextField(
//                   controller: _searchCtrl,
//                   style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                   decoration: InputDecoration(
//                     hintText: 'Search by Doctor Name, Speciality, or Symptoms...',
//                     hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
//                     border: InputBorder.none,
//                     contentPadding: const EdgeInsets.symmetric(horizontal: 12),
//                     suffixIcon: _searchCtrl.text.isNotEmpty
//                         ? IconButton(
//                             icon: const Icon(Icons.close, size: 16, color: AppColors.textGrey),
//                             onPressed: () => _searchCtrl.clear(),
//                           )
//                         : null,
//                   ),
//                 ),
//               ),
//             ),
//             const SizedBox(width: 8),
//             SizedBox(
//               height: 44,
//               child: ElevatedButton.icon(
//                 onPressed: _onSearch,
//                 icon: const Icon(Icons.search, size: 16),
//                 label: const Text('Search', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: AppColors.primary,
//                   foregroundColor: Colors.white,
//                   elevation: 0,
//                   shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
//                   padding: const EdgeInsets.symmetric(horizontal: 14),
//                 ),
//               ),
//             ),
//           ]),
//         ),
//         Expanded(
//           child: _filtered.isEmpty
//               ? const _EmptySearch()
//               : RefreshIndicator(
//                   color: AppColors.primary,
//                   onRefresh: _load,
//                   child: ListView(
//                     padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
//                     children: _filtered.entries.map((entry) {
//                       return _SpecialtyGroup(
//                         specialty: entry.key,
//                         doctors: entry.value,
//                         onDoctorTap: (d) => setState(() => _selectedDoctor = d),
//                       );
//                     }).toList(),
//                   ),
//                 ),
//         ),
//       ],
//     );
//   }
// }



// class _SpecialtyGroup extends StatelessWidget {
//   final String specialty;
//   final List<Doctor> doctors;
//   final void Function(Doctor) onDoctorTap;

//   const _SpecialtyGroup({required this.specialty, required this.doctors, required this.onDoctorTap});

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Padding(
//           padding: const EdgeInsets.only(top: 4, bottom: 10),
//           child: Row(children: [
//             Text(specialty, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.primary)),
//             const Spacer(),
//             Container(
//               padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
//               decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.08), borderRadius: BorderRadius.circular(12)),
//               child: Text('${doctors.length} Doctor${doctors.length > 1 ? 's' : ''}',
//                   style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600)),
//             ),
//           ]),
//         ),
//         ...doctors.map((d) => _DoctorCard(doctor: d, onTap: onDoctorTap)),
//         const SizedBox(height: 8),
//       ],
//     );
//   }
// }



// class _DoctorCard extends StatelessWidget {
//   final Doctor doctor;
//   final void Function(Doctor) onTap;
//   const _DoctorCard({required this.doctor, required this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 10),
//       padding: const EdgeInsets.all(12),
//       decoration: BoxDecoration(
//         color: AppColors.cardBg,
//         borderRadius: BorderRadius.circular(14),
//         boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3))],
//       ),
//       child: Row(
//         crossAxisAlignment: CrossAxisAlignment.center,
//         children: [
//           Container(
//             width: 58, height: 58,
//             decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//             child: Column(mainAxisAlignment: MainAxisAlignment.center, children: const [
//               Icon(Icons.person, color: AppColors.textGrey, size: 28),
//               Text('Doctor\nImage', textAlign: TextAlign.center, style: TextStyle(fontSize: 7, color: AppColors.textLight)),
//             ]),
//           ),
//           const SizedBox(width: 12),
//           Expanded(
//             child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//               Text(doctor.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//               const SizedBox(height: 5),
//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
//                 decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.08), borderRadius: BorderRadius.circular(4)),
//                 child: Text(doctor.qualification.toUpperCase(),
//                     style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary, letterSpacing: 0.4)),
//               ),
//               const SizedBox(height: 5),
//               Text(doctor.department, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textGrey)),
//             ]),
//           ),
//           Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
//             Container(
//               padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
//               decoration: BoxDecoration(color: AppColors.upcomingBg, borderRadius: BorderRadius.circular(12)),
//               child: const Text('Visiting Hours', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.upcomingAmber)),
//             ),
//             const SizedBox(height: 5),
//             Row(mainAxisSize: MainAxisSize.min, children: [
//               const Icon(Icons.access_time, size: 11, color: AppColors.textGrey),
//               const SizedBox(width: 3),
//               Text(doctor.visitingHours, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
//             ]),
//             const SizedBox(height: 8),
//             GestureDetector(
//               onTap: () => onTap(doctor),
//               child: Container(
//                 padding: const EdgeInsets.all(4),
//                 decoration: BoxDecoration(color: AppColors.background, shape: BoxShape.circle, border: Border.all(color: AppColors.divider)),
//                 child: const Icon(Icons.chevron_right, size: 16, color: AppColors.primary),
//               ),
//             ),
//           ]),
//         ],
//       ),
//     );
//   }
// }



// class _AvailabilityView extends StatefulWidget {
//   final Doctor doctor;
//   final VoidCallback onBack;
//   final VoidCallback onFullComplete;

//   const _AvailabilityView({required this.doctor, required this.onBack, required this.onFullComplete});

//   @override
//   State<_AvailabilityView> createState() => _AvailabilityViewState();
// }

// class _AvailabilityViewState extends State<_AvailabilityView> {
//   List<DoctorAvailability>? _slots;
//   bool _loading = true;
//   String? _error;
//   DateTime _fromDate = DateTime.now();
//   DoctorAvailability? _bookingSlot;

//   @override
//   void initState() { super.initState(); _loadSlots(); }

//   // Future<void> _loadSlots() async {
//   //   setState(() { _loading = true; _error = null; });
//   //   try {
//   //     final data = await ApiService.fetchDoctorAvailability(doctorName: widget.doctor.name);
//   //     if (!mounted) return;
//   //     setState(() { _slots = data; _loading = false; });
//   //   } catch (e) {
//   //     if (!mounted) return;
//   //     setState(() { _error = e.toString(); _loading = false; });
//   //   }
//   // }
// Future<void> _loadSlots() async {
//   setState(() { _loading = true; _error = null; });
//   try {
//     final data = await ApiService.fetchDoctorAvailability(
//       doctorName: widget.doctor.name,
//       doctorId: widget.doctor.doctorId, // ← add this
//     );
//     if (!mounted) return;
//     setState(() { _slots = data; _loading = false; });
//   } catch (e) {
//     if (!mounted) return;
//     setState(() { _error = e.toString(); _loading = false; });
//   }
// }
//   Future<void> _pickDate() async {
//     final picked = await showDatePicker(
//       context: context,
//       initialDate: _fromDate,
//       firstDate: DateTime.now(),
//       lastDate: DateTime.now().add(const Duration(days: 90)),
//       builder: (ctx, child) => Theme(
//         data: ThemeData.light().copyWith(colorScheme: const ColorScheme.light(primary: AppColors.primary)),
//         child: child!,
//       ),
//     );
//     if (picked != null && picked != _fromDate) {
//       setState(() => _fromDate = picked);
//       _loadSlots();
//     }
//   }

//   String _formatDate(DateTime d) =>
//       '${d.day.toString().padLeft(2, '0')}-${d.month.toString().padLeft(2, '0')}-${d.year}';

//   @override
//   Widget build(BuildContext context) {
//     if (_bookingSlot != null) {
//       return _TimeSlotView(
//         doctor: widget.doctor,
//         slot: _bookingSlot!,
//         onBack: () => setState(() => _bookingSlot = null),
//         onFullComplete: widget.onFullComplete,
//       );
//     }

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(8, 14, 16, 12),
//           child: Row(children: [
//             IconButton(
//               onPressed: widget.onBack,
//               icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
//               padding: EdgeInsets.zero, constraints: const BoxConstraints(),
//             ),
//             const SizedBox(width: 4),
//             const Icon(Icons.calendar_month_outlined, color: AppColors.primary, size: 20),
//             const SizedBox(width: 8),
//             const Text("Doctor's Availabilities",
//                 style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//           ]),
//         ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
//           child: Container(
//             padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
//             decoration: BoxDecoration(
//               color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
//               border: Border.all(color: AppColors.divider),
//               boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 2))],
//             ),
//             child: Row(children: [
//               Container(
//                 width: 52, height: 52,
//                 decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//                 child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
//               ),
//               const SizedBox(width: 12),
//               Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                 Row(children: [
//                   Text(widget.doctor.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//                   const SizedBox(width: 6),
//                   Text(widget.doctor.qualification.toUpperCase(),
//                       style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textGrey)),
//                 ]),
//                 const SizedBox(height: 3),
//                 Text(widget.doctor.department, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w600)),
//               ]),
//             ]),
//           ),
//         ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
//           child: Container(
//             padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
//             decoration: BoxDecoration(color: AppColors.cardBg, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//             child: Row(children: [
//               const Text('View Availability From:', style: TextStyle(fontSize: 13, color: AppColors.textGrey)),
//               const Spacer(),
//               GestureDetector(
//                 onTap: _pickDate,
//                 child: Row(children: [
//                   Text(_formatDate(_fromDate),
//                       style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//                   const SizedBox(width: 6),
//                   const Icon(Icons.calendar_today, size: 16, color: AppColors.primary),
//                 ]),
//               ),
//             ]),
//           ),
//         ),
//         Expanded(
//           child: _loading
//               ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
//               : _error != null
//                   ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
//                       const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
//                       const SizedBox(height: 12),
//                       Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
//                       const SizedBox(height: 16),
//                       ElevatedButton(onPressed: _loadSlots,
//                           style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
//                           child: const Text('Retry', style: TextStyle(color: Colors.white))),
//                     ]))
//                   : ListView.separated(
//                       padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
//                       itemCount: _slots!.length,
//                       separatorBuilder: (_, __) => const SizedBox(height: 10),
//                       itemBuilder: (_, i) => _AvailabilityRow(
//                         slot: _slots![i],
//                         onBook: (slot) => setState(() => _bookingSlot = slot),
//                       ),
//                     ),
//         ),
//         if (!_loading && _error == null)
//           Padding(
//             padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
//             child: Row(mainAxisAlignment: MainAxisAlignment.center, children: const [
//               _LegendDot(color: Color(0xFF4CAF50), label: 'Available'),
//               SizedBox(width: 16),
//               _LegendDot(color: Color(0xFFFF9800), label: 'Limited Slots'),
//               SizedBox(width: 16),
//               _LegendDot(color: Color(0xFFF44336), label: 'Unavailable'),
//             ]),
//           ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
//           child: SizedBox(
//             width: double.infinity,
//             child: ElevatedButton.icon(
//               onPressed: widget.onBack,
//               icon: const Icon(Icons.arrow_back, size: 18),
//               label: const Text('Return to Doctor List', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: AppColors.primary, foregroundColor: Colors.white, elevation: 0,
//                 shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                 padding: const EdgeInsets.symmetric(vertical: 14),
//               ),
//             ),
//           ),
//         ),
//       ],
//     );
//   }
// }



// class _AvailabilityRow extends StatelessWidget {
//   final DoctorAvailability slot;
//   final void Function(DoctorAvailability) onBook;

//   const _AvailabilityRow({required this.slot, required this.onBook});

//   Color get _statusColor {
//     switch (slot.status) {
//       case 'limited': return const Color(0xFFFF9800);
//       case 'unavailable': return const Color(0xFFF44336);
//       default: return const Color(0xFF4CAF50);
//     }
//   }

//   Color get _statusBg {
//     switch (slot.status) {
//       case 'limited': return const Color(0xFFFFF3E0);
//       case 'unavailable': return const Color(0xFFFFEBEE);
//       default: return const Color(0xFFE8F5E9);
//     }
//   }

//   String get _statusLabel {
//     switch (slot.status) {
//       case 'limited': return 'Limited Slots';
//       case 'unavailable': return 'Unavailable';
//       default: return 'Available';
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     final isUnavailable = slot.status == 'unavailable';
//     return Container(
//       padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
//       decoration: BoxDecoration(color: AppColors.cardBg, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//       child: Row(children: [
//         Expanded(
//           child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//             Row(children: [
//               Text(slot.date, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//               const SizedBox(width: 8),
//               Text(slot.dayName, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textGrey, letterSpacing: 0.6)),
//             ]),
//             const SizedBox(height: 4),
//             Row(children: [
//               const Icon(Icons.access_time, size: 11, color: AppColors.textGrey),
//               const SizedBox(width: 3),
//               Text(slot.timeSlot, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
//             ]),
//           ]),
//         ),
//         Container(
//           padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
//           decoration: BoxDecoration(color: _statusBg, borderRadius: BorderRadius.circular(20)),
//           child: Row(mainAxisSize: MainAxisSize.min, children: [
//             Container(width: 7, height: 7, decoration: BoxDecoration(color: _statusColor, shape: BoxShape.circle)),
//             const SizedBox(width: 5),
//             Text(_statusLabel, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor)),
//           ]),
//         ),
//         const SizedBox(width: 8),
//         isUnavailable
//             ? Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
//                 decoration: BoxDecoration(color: const Color(0xFFF5F5F5), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.divider)),
//                 child: Row(mainAxisSize: MainAxisSize.min, children: const [
//                   Icon(Icons.edit_calendar_outlined, size: 13, color: AppColors.textGrey),
//                   SizedBox(width: 4),
//                   Text('Unavailable', style: TextStyle(fontSize: 11, color: AppColors.textGrey)),
//                 ]),
//               )
//             : OutlinedButton.icon(
//                 onPressed: () => onBook(slot),
//                 icon: const Icon(Icons.edit_calendar_outlined, size: 13),
//                 label: const Text('Book', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
//                 style: OutlinedButton.styleFrom(
//                   foregroundColor: AppColors.primary,
//                   side: const BorderSide(color: AppColors.primary),
//                   shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
//                   padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//                   minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap,
//                 ),
//               ),
//       ]),
//     );
//   }
// }


// class _TimeSlotView extends StatefulWidget {
//   final Doctor doctor;
//   final DoctorAvailability slot;
//   final VoidCallback onBack;
//   final VoidCallback onFullComplete;

//   const _TimeSlotView({required this.doctor, required this.slot, required this.onBack, required this.onFullComplete});

//   @override
//   State<_TimeSlotView> createState() => _TimeSlotViewState();
// }

// class _TimeSlotViewState extends State<_TimeSlotView> {
//   List<TimeSlot>? _timeSlots;
//   bool _loading = true;
//   String? _error;
//   String? _selectedTime;
//   bool _showForm = false;

//   @override
//   void initState() { super.initState(); _loadSlots(); }

//   Future<void> _loadSlots() async {
//     setState(() { _loading = true; _error = null; });
//     try {
//       final data = await ApiService.fetchTimeSlots(doctorName: widget.doctor.name, date: widget.slot.date);
//       if (!mounted) return;
//       setState(() { _timeSlots = data; _loading = false; });
//     } catch (e) {
//       if (!mounted) return;
//       setState(() { _error = e.toString(); _loading = false; });
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     if (_showForm && _selectedTime != null) {
//       return _BookingFormView(
//         doctor: widget.doctor,
//         slot: widget.slot,
//         selectedTime: _selectedTime!,
//         onBack: () => setState(() => _showForm = false),
//         onFullComplete: widget.onFullComplete,
//       );
//     }

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(8, 14, 16, 12),
//           child: Row(children: [
//             IconButton(
//               onPressed: widget.onBack,
//               icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
//               padding: EdgeInsets.zero, constraints: const BoxConstraints(),
//             ),
//             const SizedBox(width: 4),
//             const Icon(Icons.schedule, color: AppColors.primary, size: 20),
//             const SizedBox(width: 8),
//             const Text('Available Appointments',
//                 style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//           ]),
//         ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
//           child: Container(
//             padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
//             decoration: BoxDecoration(
//               color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
//               border: Border.all(color: AppColors.divider),
//               boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 2))],
//             ),
//             child: Row(children: [
//               Container(
//                 width: 52, height: 52,
//                 decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//                 child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
//               ),
//               const SizedBox(width: 12),
//               Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                 Row(children: [
//                   Text(widget.doctor.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//                   const SizedBox(width: 6),
//                   Text(widget.doctor.qualification.toUpperCase(),
//                       style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textGrey)),
//                 ]),
//                 const SizedBox(height: 3),
//                 Text(widget.doctor.department, style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w600)),
//               ])),
//             ]),
//           ),
//         ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
//           child: Container(
//             padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
//             decoration: BoxDecoration(
//               color: AppColors.primary.withOpacity(0.06), borderRadius: BorderRadius.circular(10),
//               border: Border.all(color: AppColors.primary.withOpacity(0.2)),
//             ),
//             child: Row(children: [
//               const Icon(Icons.calendar_today, size: 15, color: AppColors.primary),
//               const SizedBox(width: 8),
//               Text('${widget.slot.date}  •  ${widget.slot.dayName}',
//                   style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
//             ]),
//           ),
//         ),
//         Expanded(
//           child: _loading
//               ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
//               : _error != null
//                   ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
//                       const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
//                       const SizedBox(height: 12),
//                       Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
//                       const SizedBox(height: 16),
//                       ElevatedButton(onPressed: _loadSlots,
//                           style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
//                           child: const Text('Retry', style: TextStyle(color: Colors.white))),
//                     ]))
//                   : Padding(
//                       padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
//                       child: GridView.builder(
//                         gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
//                           crossAxisCount: 4, mainAxisSpacing: 10, crossAxisSpacing: 8, childAspectRatio: 2.4,
//                         ),
//                         itemCount: _timeSlots!.length,
//                         itemBuilder: (_, i) {
//                           final ts = _timeSlots![i];
//                           return _TimeSlotChip(
//                             timeSlot: ts,
//                             isSelected: ts.time == _selectedTime,
//                             onTap: ts.isBooked ? null : () => setState(() => _selectedTime = ts.time),
//                           );
//                         },
//                       ),
//                     ),
//         ),
//         if (!_loading && _error == null)
//           Padding(
//             padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
//             child: Row(children: const [
//               _LegendDot(color: AppColors.primary, label: 'Available'),
//               SizedBox(width: 16),
//               _LegendDot(color: Color(0xFFBDBDBD), label: 'Already Booked'),
//             ]),
//           ),
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
//           child: SizedBox(
//             width: double.infinity,
//             child: ElevatedButton.icon(
//               onPressed: _selectedTime == null ? null : () => setState(() => _showForm = true),
//               icon: const Icon(Icons.calendar_month, size: 18),
//               label: const Text('Book Appointment', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: AppColors.primary,
//                 disabledBackgroundColor: AppColors.primary.withOpacity(0.4),
//                 foregroundColor: Colors.white, disabledForegroundColor: Colors.white70,
//                 elevation: 0,
//                 shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                 padding: const EdgeInsets.symmetric(vertical: 14),
//               ),
//             ),
//           ),
//         ),
//       ],
//     );
//   }
// }



// class _TimeSlotChip extends StatelessWidget {
//   final TimeSlot timeSlot;
//   final bool isSelected;
//   final VoidCallback? onTap;

//   const _TimeSlotChip({required this.timeSlot, required this.isSelected, this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     final booked = timeSlot.isBooked;
//     final Color bgColor = booked ? const Color(0xFFF5F5F5) : isSelected ? AppColors.primary : AppColors.cardBg;
//     final Color borderColor = booked ? const Color(0xFFE0E0E0) : isSelected ? AppColors.primary : AppColors.primary.withOpacity(0.5);
//     final Color textColor = booked ? const Color(0xFFBDBDBD) : isSelected ? Colors.white : AppColors.primary;

//     return GestureDetector(
//       onTap: onTap,
//       child: AnimatedContainer(
//         duration: const Duration(milliseconds: 180),
//         decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8), border: Border.all(color: borderColor)),
//         alignment: Alignment.center,
//         child: Text(timeSlot.time, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: textColor)),
//       ),
//     );
//   }
// }



// class SavedPatient {
//   final String id;
//   final String firstName;
//   final String lastName;
//   final String dateOfBirth;
//   final String age;
//   final String ageUnit;
//   final String gender;
//   final String address;
//   final String contactNumber;
//   final String emailAddress;
//   final String relation; // e.g. "Self", "Spouse", "Child", "Parent", "Other"

//   const SavedPatient({
//     required this.id,
//     required this.firstName,
//     required this.lastName,
//     required this.dateOfBirth,
//     required this.age,
//     required this.ageUnit,
//     required this.gender,
//     required this.address,
//     required this.contactNumber,
//     required this.emailAddress,
//     required this.relation,
//   });

//   String get fullName => '$firstName $lastName'.trim();

//   Map<String, dynamic> toJson() => {
//         'id': id,
//         'firstName': firstName,
//         'lastName': lastName,
//         'dateOfBirth': dateOfBirth,
//         'age': age,
//         'ageUnit': ageUnit,
//         'gender': gender,
//         'address': address,
//         'contactNumber': contactNumber,
//         'emailAddress': emailAddress,
//         'relation': relation,
//       };

//   factory SavedPatient.fromJson(Map<String, dynamic> json) => SavedPatient(
//         id: json['id'] as String,
//         firstName: json['firstName'] as String,
//         lastName: json['lastName'] as String,
//         dateOfBirth: json['dateOfBirth'] as String,
//         age: json['age'] as String,
//         ageUnit: json['ageUnit'] as String,
//         gender: json['gender'] as String,
//         address: json['address'] as String,
//         contactNumber: json['contactNumber'] as String,
//         emailAddress: json['emailAddress'] as String,
//         relation: json['relation'] as String,
//       );
// }



// /// Who are we booking for?
// enum _PatientMode { self, existing, newPatient }

// class _BookingFormView extends StatefulWidget {
//   final Doctor doctor;
//   final DoctorAvailability slot;
//   final String selectedTime;
//   final VoidCallback onBack;
//   final VoidCallback onFullComplete;

//   const _BookingFormView({
//     required this.doctor, required this.slot, required this.selectedTime,
//     required this.onBack, required this.onFullComplete,
//   });

//   @override
//   State<_BookingFormView> createState() => _BookingFormViewState();
// }

// class _BookingFormViewState extends State<_BookingFormView> {
//   final _formKey = GlobalKey<FormState>();

//   // ── form controllers ──────────────────────────────────────────────────────
//   final _firstNameCtrl      = TextEditingController();
//   final _lastNameCtrl       = TextEditingController();
//   final _dobCtrl            = TextEditingController();
//   final _ageCtrl            = TextEditingController();
//   final _patientAddressCtrl = TextEditingController();
//   final _contactCtrl        = TextEditingController();
//   final _emailCtrl          = TextEditingController();
//   final _visitPurposeCtrl   = TextEditingController();
//   final _insProviderCtrl    = TextEditingController();
//   final _insPolicyCtrl      = TextEditingController();
//   final _insGroupCtrl       = TextEditingController();
//   final _insHolderNameCtrl  = TextEditingController();
//   final _insHolderAddrCtrl  = TextEditingController();

//   // patient-selector state
//   _PatientMode _patientMode   = _PatientMode.self;
//   bool _loadingPatients       = true;
//   List<SavedPatient> _savedPatients = [];
//   SavedPatient? _selectedExisting;

//   // "new patient" relation field
//   String? _newPatientRelation;
//   static const List<String> _relationOptions = [
//     'Spouse', 'Child', 'Parent', 'Sibling', 'Other',
//   ];

//   //  rest of form state
//   String  _ageUnit           = 'years';
//   String? _gender;
//   bool    _hasInsurance      = false;
//   bool    _insuranceExpanded = false;
//   String  _visitType         = '';
//   String  _otpChannel        = 'mobile';
//   bool    _submitting        = false;

//   Map<String, dynamic>? _bookingResponse;

//   final List<String> _genderOptions = ['Male', 'Female', 'Other'];
//   final List<String> _visitTypes = [
//     'Consultation', 'Follow-up', 'Emergency', 'Routine Check-up', 'Lab / Diagnostics', 'Other',
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _loadSavedPatients();
//   }

//   //  load saved patients + self data
//   Future<void> _loadSavedPatients() async {
//     final result = await ApiService.fetchSavedPatients();
//     if (!mounted) return;
//     setState(() {
//       _savedPatients = result;
//       _loadingPatients = false;
//     });
//     // Auto-fill "Self" on first load
//     _applyPatientMode(_PatientMode.self);
//   }

//   void _applyPatientMode(_PatientMode mode) {
//     setState(() => _patientMode = mode);
//     switch (mode) {
//       case _PatientMode.self:
//         _fillSelf();
//         break;
//       case _PatientMode.existing:
//         if (_selectedExisting != null) _fillFromSaved(_selectedExisting!);
//         break;
//       case _PatientMode.newPatient:
//         _clearFormFields();
//         break;
//     }
//   }

//   void _fillSelf() {
//     final self = ApiService.mockSelfProfile;
//     _firstNameCtrl.text       = self['firstName']     ?? '';
//     _lastNameCtrl.text        = self['lastName']      ?? '';
//     _dobCtrl.text             = self['dateOfBirth']   ?? '';
//     _ageCtrl.text             = self['age']           ?? '';
//     _patientAddressCtrl.text  = self['address']       ?? '';
//     _contactCtrl.text         = self['contactNumber'] ?? '';
//     _emailCtrl.text           = self['emailAddress']  ?? '';
//     setState(() {
//       _gender  = self['gender'];
//       _ageUnit = self['ageUnit'] ?? 'years';
//     });
//   }

//   void _fillFromSaved(SavedPatient p) {
//     _firstNameCtrl.text       = p.firstName;
//     _lastNameCtrl.text        = p.lastName;
//     _dobCtrl.text             = p.dateOfBirth;
//     _ageCtrl.text             = p.age;
//     _patientAddressCtrl.text  = p.address;
//     _contactCtrl.text         = p.contactNumber;
//     _emailCtrl.text           = p.emailAddress;
//     setState(() {
//       _gender  = p.gender.isEmpty ? null : p.gender;
//       _ageUnit = p.ageUnit;
//     });
//   }

//   void _clearFormFields() {
//     _firstNameCtrl.clear();
//     _lastNameCtrl.clear();
//     _dobCtrl.clear();
//     _ageCtrl.clear();
//     _patientAddressCtrl.clear();
//     _contactCtrl.clear();
//     _emailCtrl.clear();
//     setState(() {
//       _gender  = null;
//       _ageUnit = 'years';
//     });
//   }

//   @override
//   void dispose() {
//     for (final c in [
//       _firstNameCtrl, _lastNameCtrl, _dobCtrl, _ageCtrl,
//       _patientAddressCtrl, _contactCtrl, _emailCtrl, _visitPurposeCtrl,
//       _insProviderCtrl, _insPolicyCtrl, _insGroupCtrl, _insHolderNameCtrl, _insHolderAddrCtrl,
//     ]) { c.dispose(); }
//     super.dispose();
//   }

//   Future<void> _pickDob() async {
//     final picked = await showDatePicker(
//       context: context,
//       initialDate: DateTime(2000), firstDate: DateTime(1900), lastDate: DateTime.now(),
//       builder: (ctx, child) => Theme(
//         data: ThemeData.light().copyWith(colorScheme: const ColorScheme.light(primary: AppColors.primary)),
//         child: child!,
//       ),
//     );
//     if (picked != null) {
//       _dobCtrl.text = '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
//     }
//   }

//   void _clearForm() {
//     _formKey.currentState?.reset();
//     _clearFormFields();
//     setState(() {
//       _hasInsurance = false; _insuranceExpanded = false;
//       _visitType = ''; _otpChannel = 'mobile';
//       _newPatientRelation = null;
//     });
//   }

//   Future<void> _submit() async {
//     if (!_formKey.currentState!.validate()) return;
//     setState(() => _submitting = true);

//     if (_patientMode == _PatientMode.newPatient) {
//       final newPatient = SavedPatient(
//         id: 'PAT-${DateTime.now().millisecondsSinceEpoch}',
//         firstName: _firstNameCtrl.text.trim(),
//         lastName: _lastNameCtrl.text.trim(),
//         dateOfBirth: _dobCtrl.text.trim(),
//         age: _ageCtrl.text.trim(),
//         ageUnit: _ageUnit,
//         gender: _gender ?? '',
//         address: _patientAddressCtrl.text.trim(),
//         contactNumber: _contactCtrl.text.trim(),
//         emailAddress: _emailCtrl.text.trim(),
//         relation: _newPatientRelation ?? 'Other',
//       );
//       await ApiService.saveNewPatient(newPatient);
//     }

//     final result = await ApiService.bookAppointment(
//       bookingData: {
//         'doctorName':  widget.doctor.name,
//         'date':        widget.slot.date,
//         'dayName':     widget.slot.dayName,
//         'time':        widget.selectedTime,
//         'department':  widget.doctor.department,
//         'firstName':   _firstNameCtrl.text.trim(),
//         'lastName':    _lastNameCtrl.text.trim(),
//         'dateOfBirth': _dobCtrl.text.trim(),
//         'age':         _ageCtrl.text.trim(),
//         'ageUnit':     _ageUnit,
//         'gender':      _gender ?? '',
//         'hasInsurance':                   _hasInsurance,
//         'insuranceProviderName':          _insProviderCtrl.text.trim(),
//         'insurancePolicyId':              _insPolicyCtrl.text.trim(),
//         'insuranceGroupId':               _insGroupCtrl.text.trim(),
//         'insurancePrimaryHolderName':     _insHolderNameCtrl.text.trim(),
//         'insurancePrimaryHolderAddress':  _insHolderAddrCtrl.text.trim(),
//         'patientAddress':  _patientAddressCtrl.text.trim(),
//         'contactNumber':   _contactCtrl.text.trim(),
//         'emailAddress':    _emailCtrl.text.trim(),
//         'visitPurpose':    _visitPurposeCtrl.text.trim(),
//         'visitType':       _visitType,
//         'otpChannel':      _otpChannel,
//         'patientMode':     _patientMode.name,
//         'relation':        _patientMode == _PatientMode.newPatient
//                                ? (_newPatientRelation ?? 'Other')
//                                : _patientMode == _PatientMode.self
//                                    ? 'Self'
//                                    : (_selectedExisting?.relation ?? ''),
//       },
//     );

//     if (!mounted) return;
//     setState(() => _submitting = false);

//     if (result['success'] == true) {
//       setState(() => _bookingResponse = result);
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//         content: Text(result['message'] as String? ?? 'Booking failed.'),
//         backgroundColor: Colors.redAccent, behavior: SnackBarBehavior.floating,
//       ));
//     }
//   }

//   String get _patientFullName => '${_firstNameCtrl.text.trim()} ${_lastNameCtrl.text.trim()}';



//   @override
//   Widget build(BuildContext context) {
//     if (_bookingResponse != null) {
//       return _OtpVerificationView(
//         doctor: widget.doctor,
//         slot: widget.slot,
//         selectedTime: widget.selectedTime,
//         patientName: _patientFullName,
//         maskedContact: _bookingResponse!['maskedContact'] as String? ?? '',
//         appointmentId: _bookingResponse!['appointmentId'] as String? ?? '',
//         otpChannel: _bookingResponse!['otpChannel'] as String? ?? 'mobile',
//         onCancel: () => setState(() => _bookingResponse = null),
//         onFullComplete: widget.onFullComplete,
//       );
//     }

//     return Column(
//       children: [
     
     
//         Padding(
//           padding: const EdgeInsets.fromLTRB(8, 14, 16, 0),
//           child: Row(children: [
//             IconButton(
//               onPressed: widget.onBack,
//               icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
//               padding: EdgeInsets.zero, constraints: const BoxConstraints(),
//             ),
//             const SizedBox(width: 4),
//             const Icon(Icons.person_outline, color: AppColors.primary, size: 20),
//             const SizedBox(width: 8),
//             const Text('Patient Information',
//                 style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//           ]),
//         ),
   
   
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
//           child: Container(
//             padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
//             decoration: BoxDecoration(
//               color: AppColors.primary.withOpacity(0.06), borderRadius: BorderRadius.circular(10),
//               border: Border.all(color: AppColors.primary.withOpacity(0.2)),
//             ),
//             child: Row(children: [
//               const Icon(Icons.info_outline, size: 14, color: AppColors.primary),
//               const SizedBox(width: 8),
//               Expanded(child: Text(
//                 '${widget.doctor.name}  •  ${widget.slot.date}  •  ${widget.selectedTime}',
//                 style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary),
//               )),
//             ]),
//           ),
//         ),
//         Expanded(
//           child: _loadingPatients
//               ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
//               : Form(
//                   key: _formKey,
//                   child: ListView(
//                     padding: const EdgeInsets.fromLTRB(16, 4, 16, 20),
//                     children: [


//                       _PatientSelectorCard(
//                         mode: _patientMode,
//                         savedPatients: _savedPatients,
//                         selectedExisting: _selectedExisting,
//                         onModeChanged: _applyPatientMode,
//                         onExistingSelected: (p) {
//                           setState(() => _selectedExisting = p);
//                           _fillFromSaved(p);
//                         },
//                       ),
//                       const SizedBox(height: 16),

                   
                   
//                       if (_patientMode == _PatientMode.newPatient) ...[
//                         _FormLabel('Relation with Account Holder'),
//                         DropdownButtonFormField<String>(
//                           value: _newPatientRelation,
//                           hint: const Text('Select relation', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
//                           decoration: _dropdownDeco(),
//                           validator: (v) => (v == null || v.isEmpty) ? 'Please select a relation' : null,
//                           items: _relationOptions
//                               .map((r) => DropdownMenuItem(value: r, child: Text(r, style: const TextStyle(fontSize: 13))))
//                               .toList(),
//                           onChanged: (v) => setState(() => _newPatientRelation = v),
//                           style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                         ),
//                         const SizedBox(height: 12),
//                       ],

                 
                 
//                       _FormLabel('First Name'),
//                       _FormField(
//                         controller: _firstNameCtrl,
//                         hint: 'Enter patient first name',
//                         readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                         validator: (v) => v!.trim().isEmpty ? 'Required' : null,
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Last Name'),
//                       _FormField(
//                         controller: _lastNameCtrl,
//                         hint: 'Enter patient last name',
//                         readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                         validator: (v) => v!.trim().isEmpty ? 'Required' : null,
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Date Of Birth'),
//                       TextFormField(
//                         controller: _dobCtrl,
//                         readOnly: true,
//                         onTap: (_patientMode == _PatientMode.self || _patientMode == _PatientMode.existing) ? null : _pickDob,
//                         style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                         decoration: _inputDeco(
//                           hint: 'dd/mm/yyyy',
//                           suffix: const Icon(Icons.calendar_today, size: 16, color: AppColors.primary),
//                           readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                         ),
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Age'),
//                       Row(children: [
//                         Expanded(
//                           flex: 2,
//                           child: _FormField(
//                             controller: _ageCtrl,
//                             hint: 'Age',
//                             keyboardType: TextInputType.number,
//                             readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                           ),
//                         ),
//                         const SizedBox(width: 12),
//                         _RadioOption<String>(label: 'Year(s)', value: 'years', groupValue: _ageUnit, onChanged: _patientMode == _PatientMode.newPatient ? (v) => setState(() => _ageUnit = v!) : null),
//                         const SizedBox(width: 8),
//                         _RadioOption<String>(label: 'Month(s)', value: 'months', groupValue: _ageUnit, onChanged: _patientMode == _PatientMode.newPatient ? (v) => setState(() => _ageUnit = v!) : null),
//                       ]),
//                       const SizedBox(height: 12),
//                       _FormLabel('Gender'),
//                       DropdownButtonFormField<String>(
//                         value: _gender,
//                         hint: const Text('Select gender', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
//                         decoration: _dropdownDeco(),
//                         items: _genderOptions.map((g) => DropdownMenuItem(value: g, child: Text(g, style: const TextStyle(fontSize: 13)))).toList(),
//                         onChanged: (_patientMode == _PatientMode.self || _patientMode == _PatientMode.existing) ? null : (v) => setState(() => _gender = v),
//                         style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                       ),
//                       const SizedBox(height: 12),

               
               
//                       _FormLabel('Do you have insurance?'),
//                       Row(children: [
//                         _RadioOption<bool>(label: 'Yes', value: true, groupValue: _hasInsurance,
//                             onChanged: (v) => setState(() { _hasInsurance = v!; if (_hasInsurance) _insuranceExpanded = true; })),
//                         const SizedBox(width: 16),
//                         _RadioOption<bool>(label: 'No', value: false, groupValue: _hasInsurance,
//                             onChanged: (v) => setState(() { _hasInsurance = v!; _insuranceExpanded = false; })),
//                       ]),
//                       if (_hasInsurance) ...[
//                         const SizedBox(height: 10),
//                         Container(
//                           decoration: BoxDecoration(
//                             color: AppColors.primary.withOpacity(0.04), borderRadius: BorderRadius.circular(10),
//                             border: Border.all(color: AppColors.primary.withOpacity(0.2)),
//                           ),
//                           child: Column(children: [
//                             InkWell(
//                               onTap: () => setState(() => _insuranceExpanded = !_insuranceExpanded),
//                               borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
//                               child: Padding(
//                                 padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
//                                 child: Row(children: [
//                                   const Icon(Icons.health_and_safety_outlined, size: 16, color: AppColors.primary),
//                                   const SizedBox(width: 8),
//                                   const Text('Insurance Details', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
//                                   const Spacer(),
//                                   Icon(_insuranceExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, size: 20, color: AppColors.primary),
//                                 ]),
//                               ),
//                             ),
//                             if (_insuranceExpanded)
//                               Padding(
//                                 padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
//                                 child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                                   _FormLabel('Provider Name'), _FormField(controller: _insProviderCtrl, hint: 'Enter provider name'), const SizedBox(height: 10),
//                                   _FormLabel('Insurance Policy ID'), _FormField(controller: _insPolicyCtrl, hint: 'Enter policy ID'), const SizedBox(height: 10),
//                                   _FormLabel('Insurance Group ID'), _FormField(controller: _insGroupCtrl, hint: 'Enter group ID'), const SizedBox(height: 10),
//                                   _FormLabel('Primary Holder Name'), _FormField(controller: _insHolderNameCtrl, hint: 'Enter primary holder name'), const SizedBox(height: 10),
//                                   _FormLabel('Primary Holder Address'), _FormField(controller: _insHolderAddrCtrl, hint: 'Enter primary holder address'),
//                                 ]),
//                               ),
//                           ]),
//                         ),
//                       ],
//                       const SizedBox(height: 12),

//                       _FormLabel('Patient Address'),
//                       _FormField(
//                         controller: _patientAddressCtrl,
//                         hint: 'Enter patient address',
//                         readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                         validator: (v) => v!.trim().isEmpty ? 'Required' : null,
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Contact Number'),
//                       _FormField(
//                         controller: _contactCtrl,
//                         hint: 'Enter patient contact',
//                         keyboardType: TextInputType.phone,
//                         readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                         validator: (v) => v!.trim().isEmpty ? 'Required' : null,
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Email Address'),
//                       _FormField(
//                         controller: _emailCtrl,
//                         hint: 'Enter patient email address',
//                         keyboardType: TextInputType.emailAddress,
//                         readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Dr. Visit Purpose'),
//                       TextFormField(
//                         controller: _visitPurposeCtrl, maxLines: 3,
//                         style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                         decoration: _inputDeco(hint: 'Enter visit purpose/details, you may include symptoms'),
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('Type Of Visit'),
//                       DropdownButtonFormField<String>(
//                         value: _visitType.isEmpty ? null : _visitType,
//                         hint: const Text('Choose visit type', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
//                         decoration: _dropdownDeco(),
//                         items: _visitTypes.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 13)))).toList(),
//                         onChanged: (v) => setState(() => _visitType = v ?? ''),
//                         style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                       ),
//                       const SizedBox(height: 12),
//                       _FormLabel('OTP Verification'),
//                       Row(children: [
//                         _RadioOption<String>(label: 'Mobile Number', value: 'mobile', groupValue: _otpChannel, onChanged: (v) => setState(() => _otpChannel = v!)),
//                         const SizedBox(width: 16),
//                         _RadioOption<String>(label: 'Email Address', value: 'email', groupValue: _otpChannel, onChanged: (v) => setState(() => _otpChannel = v!)),
//                       ]),
//                       const SizedBox(height: 20),
//                       Row(children: [
//                         Expanded(
//                           child: ElevatedButton(
//                             onPressed: _submitting ? null : _submit,
//                             style: ElevatedButton.styleFrom(
//                               backgroundColor: AppColors.primary, disabledBackgroundColor: AppColors.primary.withOpacity(0.5),
//                               foregroundColor: Colors.white, elevation: 0,
//                               shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
//                               padding: const EdgeInsets.symmetric(vertical: 14),
//                             ),
//                             child: _submitting
//                                 ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
//                                 : const Text('Confirm', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
//                           ),
//                         ),
//                         const SizedBox(width: 12),
//                         Expanded(
//                           child: OutlinedButton(
//                             onPressed: _submitting ? null : _clearForm,
//                             style: OutlinedButton.styleFrom(
//                               foregroundColor: AppColors.primary, side: const BorderSide(color: AppColors.primary),
//                               shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
//                               padding: const EdgeInsets.symmetric(vertical: 14),
//                             ),
//                             child: const Text('Clear', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
//                           ),
//                         ),
//                       ]),
//                     ],
//                   ),
//                 ),
//         ),
//       ],
//     );
//   }

//   InputDecoration _inputDeco({required String hint, Widget? suffix, bool readOnly = false}) => InputDecoration(
//     hintText: hint, hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
//     suffixIcon: suffix, filled: true,
//     fillColor: readOnly ? AppColors.background : AppColors.cardBg,
//     contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
//     border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//     enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//     focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
//   );

//   InputDecoration _dropdownDeco() => InputDecoration(
//     filled: true, fillColor: AppColors.cardBg,
//     contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
//     border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//     enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//     focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
//   );
// }




// class _PatientSelectorCard extends StatelessWidget {
//   final _PatientMode mode;
//   final List<SavedPatient> savedPatients;
//   final SavedPatient? selectedExisting;
//   final void Function(_PatientMode) onModeChanged;
//   final void Function(SavedPatient) onExistingSelected;

//   const _PatientSelectorCard({
//     required this.mode,
//     required this.savedPatients,
//     required this.selectedExisting,
//     required this.onModeChanged,
//     required this.onExistingSelected,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       decoration: BoxDecoration(
//         color: AppColors.cardBg,
//         borderRadius: BorderRadius.circular(14),
//         border: Border.all(color: AppColors.primary.withOpacity(0.25)),
//         boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 3))],
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [

//           Container(
//             padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
//             decoration: BoxDecoration(
//               color: AppColors.primary.withOpacity(0.07),
//               borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
//             ),
//             child: Row(children: [
//               const Icon(Icons.people_alt_outlined, size: 17, color: AppColors.primary),
//               const SizedBox(width: 8),
//               const Text('Who is this appointment for?',
//                   style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
//             ]),
//           ),


//           Padding(
//             padding: const EdgeInsets.all(12),
//             child: Row(children: [
//               _ModeTile(
//                 icon: Icons.person,
//                 label: 'Self',
//                 selected: mode == _PatientMode.self,
//                 onTap: () => onModeChanged(_PatientMode.self),
//               ),
//               const SizedBox(width: 8),
//               _ModeTile(
//                 icon: Icons.group,
//                 label: 'Saved Patient',
//                 selected: mode == _PatientMode.existing,
//                 onTap: savedPatients.isEmpty ? null : () => onModeChanged(_PatientMode.existing),
//                 disabled: savedPatients.isEmpty,
//               ),
//               const SizedBox(width: 8),
//               _ModeTile(
//                 icon: Icons.person_add_alt_1,
//                 label: 'New Patient',
//                 selected: mode == _PatientMode.newPatient,
//                 onTap: () => onModeChanged(_PatientMode.newPatient),
//               ),
//             ]),
//           ),


//           if (mode == _PatientMode.self)
//             Padding(
//               padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
//               child: Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFE8F5E9),
//                   borderRadius: BorderRadius.circular(8),
//                   border: Border.all(color: const Color(0xFFA5D6A7)),
//                 ),
//                 child: Row(children: [
//                   const Icon(Icons.check_circle, size: 15, color: Color(0xFF388E3C)),
//                   const SizedBox(width: 8),
//                   Expanded(
//                     child: Text(
//                       'Booking as ${ApiService.mockSelfProfile['firstName']} ${ApiService.mockSelfProfile['lastName']} — your details have been pre-filled.',
//                       style: const TextStyle(fontSize: 12, color: Color(0xFF2E7D32)),
//                     ),
//                   ),
//                 ]),
//               ),
//             ),


//           if (mode == _PatientMode.existing)
//             Padding(
//               padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
//               child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                 const Text('Select a saved patient', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
//                 const SizedBox(height: 6),
//                 DropdownButtonFormField<SavedPatient>(
//                   value: selectedExisting,
//                   hint: const Text('Choose patient', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
//                   isExpanded: true,
//                   decoration: InputDecoration(
//                     filled: true, fillColor: AppColors.background,
//                     contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
//                     border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//                     enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//                     focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
//                   ),
//                   items: savedPatients.map((p) => DropdownMenuItem(
//                     value: p,
//                     child: Row(children: [
//                       Container(
//                         padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
//                         decoration: BoxDecoration(
//                           color: AppColors.primary.withOpacity(0.1),
//                           borderRadius: BorderRadius.circular(4),
//                         ),
//                         child: Text(p.relation, style: const TextStyle(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.w600)),
//                       ),
//                       const SizedBox(width: 8),
//                       Text(p.fullName, style: const TextStyle(fontSize: 13, color: AppColors.textDark)),
//                     ]),
//                   )).toList(),
//                   onChanged: (p) { if (p != null) onExistingSelected(p); },
//                   style: const TextStyle(fontSize: 13, color: AppColors.textDark),
//                 ),
//                 if (selectedExisting != null) ...[
//                   const SizedBox(height: 8),
//                   Container(
//                     padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//                     decoration: BoxDecoration(
//                       color: AppColors.primary.withOpacity(0.05),
//                       borderRadius: BorderRadius.circular(8),
//                       border: Border.all(color: AppColors.primary.withOpacity(0.15)),
//                     ),
//                     child: Row(children: [
//                       const Icon(Icons.check_circle, size: 15, color: AppColors.primary),
//                       const SizedBox(width: 8),
//                       Expanded(child: Text(
//                         '${selectedExisting!.fullName} (${selectedExisting!.relation}) — details filled.',
//                         style: const TextStyle(fontSize: 12, color: AppColors.primary),
//                       )),
//                     ]),
//                   ),
//                 ],
//               ]),
//             ),


//           if (mode == _PatientMode.newPatient)
//             Padding(
//               padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
//               child: Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFFFF8E1),
//                   borderRadius: BorderRadius.circular(8),
//                   border: Border.all(color: const Color(0xFFFFCC80)),
//                 ),
//                 child: Row(children: [
//                   const Icon(Icons.info_outline, size: 15, color: Color(0xFFE65100)),
//                   const SizedBox(width: 8),
//                   const Expanded(
//                     child: Text(
//                       'This patient will be saved for future bookings.',
//                       style: TextStyle(fontSize: 12, color: Color(0xFFE65100)),
//                     ),
//                   ),
//                 ]),
//               ),
//             ),
//         ],
//       ),
//     );
//   }
// }




// class _ModeTile extends StatelessWidget {
//   final IconData icon;
//   final String label;
//   final bool selected;
//   final VoidCallback? onTap;
//   final bool disabled;

//   const _ModeTile({
//     required this.icon,
//     required this.label,
//     required this.selected,
//     this.onTap,
//     this.disabled = false,
//   });

//   @override
//   Widget build(BuildContext context) {
//     final Color bg     = selected ? AppColors.primary : disabled ? const Color(0xFFF5F5F5) : AppColors.background;
//     final Color border = selected ? AppColors.primary : disabled ? const Color(0xFFE0E0E0) : AppColors.divider;
//     final Color fg     = selected ? Colors.white : disabled ? const Color(0xFFBDBDBD) : AppColors.textDark;

//     return Expanded(
//       child: GestureDetector(
//         onTap: disabled ? null : onTap,
//         child: AnimatedContainer(
//           duration: const Duration(milliseconds: 180),
//           padding: const EdgeInsets.symmetric(vertical: 10),
//           decoration: BoxDecoration(
//             color: bg, borderRadius: BorderRadius.circular(10),
//             border: Border.all(color: border),
//           ),
//           child: Column(mainAxisSize: MainAxisSize.min, children: [
//             Icon(icon, size: 20, color: fg),
//             const SizedBox(height: 4),
//             Text(label, textAlign: TextAlign.center,
//                 style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: fg)),
//           ]),
//         ),
//       ),
//     );
//   }
// }



// class _OtpVerificationView extends StatefulWidget {
//   final Doctor doctor;
//   final DoctorAvailability slot;
//   final String selectedTime;
//   final String patientName;
//   final String maskedContact;
//   final String appointmentId;
//   final String otpChannel;
//   final VoidCallback onCancel;
//   final VoidCallback onFullComplete;

//   const _OtpVerificationView({
//     required this.doctor, required this.slot, required this.selectedTime,
//     required this.patientName, required this.maskedContact, required this.appointmentId,
//     required this.otpChannel, required this.onCancel, required this.onFullComplete,
//   });

//   @override
//   State<_OtpVerificationView> createState() => _OtpVerificationViewState();
// }

// class _OtpVerificationViewState extends State<_OtpVerificationView> {
//   final List<TextEditingController> _otpCtrls = List.generate(4, (_) => TextEditingController());
//   final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

//   bool _verifying = false;
//   bool _resending = false;
//   int _resendCountdown = 30;
//   late final _countdownTimer = Stream.periodic(const Duration(seconds: 1), (i) => i).take(30);

//   bool? _result;
//   String _resultMessage = '';

//   @override
//   void initState() {
//     super.initState();
//     _startCountdown();
//   }

//   void _startCountdown() {
//     setState(() => _resendCountdown = 30);
//     _countdownTimer.listen((_) {
//       if (!mounted) return;
//       setState(() => _resendCountdown--);
//     });
//   }

//   @override
//   void dispose() {
//     for (final c in _otpCtrls) c.dispose();
//     for (final f in _focusNodes) f.dispose();
//     super.dispose();
//   }

//   String get _otp => _otpCtrls.map((c) => c.text).join();

//   void _onOtpChanged(int index, String value) {
//     if (value.length == 1 && index < 3) {
//       _focusNodes[index + 1].requestFocus();
//     } else if (value.isEmpty && index > 0) {
//       _focusNodes[index - 1].requestFocus();
//     }
//     setState(() {});
//   }

//   Future<void> _verify() async {
//     if (_otp.length < 4) return;
//     setState(() => _verifying = true);

//     final res = await ApiService.verifyBookingOtp(
//       appointmentId: widget.appointmentId,
//       otp: _otp,
//     );

//     if (!mounted) return;
//     setState(() {
//       _verifying = false;
//       _result = res['success'] as bool? ?? false;
//       _resultMessage = res['message'] as String? ?? '';
//     });
//   }

//   Future<void> _resend() async {
//     if (_resendCountdown > 0) return;
//     setState(() => _resending = true);
//     await ApiService.resendBookingOtp(appointmentId: widget.appointmentId);
//     if (!mounted) return;
//     setState(() => _resending = false);
//     _startCountdown();
//     ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
//       content: Text('OTP resent successfully'),
//       backgroundColor: AppColors.primary, behavior: SnackBarBehavior.floating,
//     ));
//   }

//   @override
//   Widget build(BuildContext context) {
//     if (_result != null) {
//       return _result!
//           ? _BookingSuccessView(
//               doctor: widget.doctor,
//               slot: widget.slot,
//               selectedTime: widget.selectedTime,
//               patientName: widget.patientName,
//               message: _resultMessage,
//               onDone: widget.onFullComplete,
//             )
//           : _BookingFailureView(
//               doctor: widget.doctor,
//               slot: widget.slot,
//               selectedTime: widget.selectedTime,
//               patientName: widget.patientName,
//               message: _resultMessage,
//               onTryAgain: () => setState(() {
//                 _result = null;
//                 for (final c in _otpCtrls) c.clear();
//                 _focusNodes[0].requestFocus();
//               }),
//               onBack: widget.onFullComplete,
//             );
//     }

//     return Column(
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(8, 14, 16, 0),
//           child: Row(children: [
//             IconButton(
//               onPressed: widget.onCancel,
//               icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
//               padding: EdgeInsets.zero, constraints: const BoxConstraints(),
//             ),
//             const SizedBox(width: 4),
//             const Icon(Icons.verified_user_outlined, color: AppColors.primary, size: 20),
//             const SizedBox(width: 8),
//             const Text('OTP Verification', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//           ]),
//         ),
//         Expanded(
//           child: SingleChildScrollView(
//             padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
//             child: Column(children: [
//               Container(
//                 width: 80, height: 80,
//                 decoration: BoxDecoration(
//                   color: AppColors.primary.withOpacity(0.08), shape: BoxShape.circle,
//                   border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
//                 ),
//                 child: const Icon(Icons.mark_email_unread_outlined, size: 38, color: AppColors.primary),
//               ),
//               const SizedBox(height: 20),
//               const Text('OTP Verification', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textDark)),
//               const SizedBox(height: 8),
//               Text(
//                 'OTP sent to\n${widget.maskedContact}',
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(fontSize: 14, color: AppColors.textGrey, height: 1.5),
//               ),
//               const SizedBox(height: 6),
//               Text(
//                 'Please enter the 4-digit OTP sent to your ${widget.otpChannel == 'email' ? 'email address' : 'mobile number'} to confirm your appointment.',
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(fontSize: 12, color: AppColors.textLight, height: 1.5),
//               ),
//               const SizedBox(height: 28),
//               Row(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: List.generate(4, (i) {
//                   return Container(
//                     margin: const EdgeInsets.symmetric(horizontal: 8),
//                     width: 56, height: 60,
//                     decoration: BoxDecoration(
//                       color: AppColors.cardBg,
//                       borderRadius: BorderRadius.circular(12),
//                       border: Border.all(
//                         color: _otpCtrls[i].text.isNotEmpty ? AppColors.primary : AppColors.divider,
//                         width: _otpCtrls[i].text.isNotEmpty ? 2 : 1,
//                       ),
//                       boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 2))],
//                     ),
//                     child: TextField(
//                       controller: _otpCtrls[i],
//                       focusNode: _focusNodes[i],
//                       maxLength: 1,
//                       keyboardType: TextInputType.number,
//                       textAlign: TextAlign.center,
//                       inputFormatters: [FilteringTextInputFormatter.digitsOnly],
//                       style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.primary),
//                       decoration: const InputDecoration(counterText: '', border: InputBorder.none),
//                       onChanged: (v) => _onOtpChanged(i, v),
//                     ),
//                   );
//                 }),
//               ),
//               const SizedBox(height: 20),
//               Row(mainAxisAlignment: MainAxisAlignment.center, children: [
//                 const Text("Didn't receive OTP? ", style: TextStyle(fontSize: 13, color: AppColors.textGrey)),
//                 _resendCountdown > 0
//                     ? Text('Resend OTP (${_resendCountdown}s)',
//                         style: const TextStyle(fontSize: 13, color: AppColors.textLight))
//                     : GestureDetector(
//                         onTap: _resending ? null : _resend,
//                         child: Text(
//                           _resending ? 'Resending...' : 'Resend OTP',
//                           style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w700),
//                         ),
//                       ),
//               ]),
//               const SizedBox(height: 28),
//               Container(
//                 padding: const EdgeInsets.all(14),
//                 decoration: BoxDecoration(
//                   color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
//                   border: Border.all(color: AppColors.divider),
//                 ),
//                 child: Column(children: [
//                   _SummaryRow(icon: Icons.medical_services_outlined, label: 'Appointment With', value: widget.doctor.name),
//                   const SizedBox(height: 10),
//                   _SummaryRow(
//                     icon: Icons.calendar_today,
//                     label: 'Date & Time',
//                     value: '${widget.slot.date} – ${widget.selectedTime}',
//                   ),
//                   const SizedBox(height: 10),
//                   _SummaryRow(icon: Icons.local_hospital_outlined, label: 'Department', value: widget.doctor.department),
//                 ]),
//               ),
//               const SizedBox(height: 16),
//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFF0F4FF), borderRadius: BorderRadius.circular(10),
//                   border: Border.all(color: AppColors.primary.withOpacity(0.15)),
//                 ),
//                 child: Row(children: [
//                   const Icon(Icons.shield_outlined, size: 16, color: AppColors.primary),
//                   const SizedBox(width: 8),
//                   const Expanded(child: Text(
//                     'For your security, do not share the OTP with anyone.',
//                     style: TextStyle(fontSize: 11, color: AppColors.textGrey),
//                   )),
//                 ]),
//               ),
//               const SizedBox(height: 24),
//               SizedBox(
//                 width: double.infinity,
//                 child: ElevatedButton.icon(
//                   onPressed: (_otp.length < 4 || _verifying) ? null : _verify,
//                   icon: _verifying
//                       ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
//                       : const Icon(Icons.verified_outlined, size: 18),
//                   label: Text(
//                     _verifying ? 'Verifying...' : 'Verify & Book Appointment',
//                     style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
//                   ),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primary,
//                     disabledBackgroundColor: AppColors.primary.withOpacity(0.4),
//                     foregroundColor: Colors.white, disabledForegroundColor: Colors.white70,
//                     elevation: 0,
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                     padding: const EdgeInsets.symmetric(vertical: 14),
//                   ),
//                 ),
//               ),
//               const SizedBox(height: 12),
//               SizedBox(
//                 width: double.infinity,
//                 child: OutlinedButton(
//                   onPressed: _verifying ? null : widget.onCancel,
//                   style: OutlinedButton.styleFrom(
//                     foregroundColor: AppColors.textGrey,
//                     side: const BorderSide(color: AppColors.divider),
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                     padding: const EdgeInsets.symmetric(vertical: 14),
//                   ),
//                   child: const Text('Cancel', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
//                 ),
//               ),
//             ]),
//           ),
//         ),
//       ],
//     );
//   }
// }



// class _BookingSuccessView extends StatelessWidget {
//   final Doctor doctor;
//   final DoctorAvailability slot;
//   final String selectedTime;
//   final String patientName;
//   final String message;
//   final VoidCallback onDone;

//   const _BookingSuccessView({
//     required this.doctor, required this.slot, required this.selectedTime,
//     required this.patientName, required this.message, required this.onDone,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Container(
//           width: double.infinity,
//           padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
//           color: const Color(0xFFE8F5E9),
//           child: Row(children: [
//             Container(
//               width: 32, height: 32,
//               decoration: const BoxDecoration(color: Color(0xFF4CAF50), shape: BoxShape.circle),
//               child: const Icon(Icons.check, color: Colors.white, size: 18),
//             ),
//             const SizedBox(width: 12),
//             const Text("Doctor's Appointment Confirmed!",
//                 style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF2E7D32))),
//           ]),
//         ),
//         Expanded(
//           child: SingleChildScrollView(
//             padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
//             child: Column(children: [
//               Container(
//                 padding: const EdgeInsets.all(14),
//                 decoration: BoxDecoration(
//                   color: AppColors.cardBg, borderRadius: BorderRadius.circular(14),
//                   border: Border.all(color: AppColors.divider),
//                   boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3))],
//                 ),
//                 child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                   Column(children: [
//                     Container(
//                       width: 60, height: 60,
//                       decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//                       child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
//                     ),
//                     const SizedBox(height: 6),
//                     Text(doctor.name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//                     Text(doctor.qualification.toUpperCase(), style: const TextStyle(fontSize: 10, color: AppColors.textGrey)),
//                     Text(doctor.department, style: const TextStyle(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.w600)),
//                   ]),
//                   const SizedBox(width: 16),
//                   Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                     _SummaryRow(icon: Icons.person_outline, label: 'Patient Name', value: patientName),
//                     const SizedBox(height: 10),
//                     _SummaryRow(icon: Icons.calendar_today, label: 'Date', value: '${slot.date} (${slot.dayName})'),
//                     const SizedBox(height: 10),
//                     _SummaryRow(icon: Icons.access_time, label: 'Time', value: selectedTime),
//                   ])),
//                   const SizedBox(width: 8),
//                   Icon(Icons.handshake_outlined, size: 56, color: AppColors.primary.withOpacity(0.6)),
//                 ]),
//               ),
//               const SizedBox(height: 20),
//               _TipCard(
//                 icon: Icons.tips_and_updates_outlined,
//                 title: 'Making the most of your visit',
//                 body: 'Care providers often manage complex schedules to ensure every patient receives the attention they need. To maximize your time with your doctor and ensure a relaxed experience, we recommend the following steps:',
//               ),
//               const SizedBox(height: 12),
//               _TipCard(
//                 icon: Icons.directions_walk_outlined,
//                 title: 'Arrive early, stay relaxed',
//                 body: 'Plan to arrive at the office 10–15 minutes before your scheduled appointment. This allows ample time for your check-in process.',
//                 bullets: const [
//                   'Complete any necessary check-in paperwork.',
//                   'Record your vital signs (such as height, weight, and blood pressure).',
//                   'Ensure you are ready to see the doctor the moment they become available.',
//                 ],
//               ),
//               const SizedBox(height: 12),
//               _TipCard(
//                 icon: Icons.event_note_outlined,
//                 title: 'Stay organized',
//                 body: 'To help keep your day running smoothly, we suggest recording your appointment date and time in a personal calendar or digital planner as soon as it is scheduled.',
//               ),
//               const SizedBox(height: 16),
//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFE3F2FD), borderRadius: BorderRadius.circular(10),
//                   border: Border.all(color: const Color(0xFF90CAF9)),
//                 ),
//                 child: Row(children: [
//                   const Icon(Icons.info_outline, size: 16, color: Color(0xFF1565C0)),
//                   const SizedBox(width: 8),
//                   const Expanded(child: Text(
//                     'A confirmation SMS has been sent to your registered mobile number.',
//                     style: TextStyle(fontSize: 12, color: Color(0xFF1565C0)),
//                   )),
//                 ]),
//               ),
//               const SizedBox(height: 24),
//               SizedBox(
//                 width: double.infinity,
//                 child: ElevatedButton.icon(
//                   onPressed: onDone,
//                   icon: const Icon(Icons.arrow_back, size: 18),
//                   label: const Text('Back to My Appointments', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primary, foregroundColor: Colors.white, elevation: 0,
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                     padding: const EdgeInsets.symmetric(vertical: 14),
//                   ),
//                 ),
//               ),
//             ]),
//           ),
//         ),
//       ],
//     );
//   }
// }



// class _BookingFailureView extends StatelessWidget {
//   final Doctor doctor;
//   final DoctorAvailability slot;
//   final String selectedTime;
//   final String patientName;
//   final String message;
//   final VoidCallback onTryAgain;
//   final VoidCallback onBack;

//   const _BookingFailureView({
//     required this.doctor, required this.slot, required this.selectedTime,
//     required this.patientName, required this.message,
//     required this.onTryAgain, required this.onBack,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Container(
//           width: double.infinity,
//           padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
//           color: const Color(0xFFFFEBEE),
//           child: Row(children: [
//             Container(
//               width: 32, height: 32,
//               decoration: const BoxDecoration(color: Color(0xFFF44336), shape: BoxShape.circle),
//               child: const Icon(Icons.close, color: Colors.white, size: 18),
//             ),
//             const SizedBox(width: 12),
//             const Expanded(child: Text("Doctor's Appointment Confirmation Failed",
//                 style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFFB71C1C)))),
//           ]),
//         ),
//         Expanded(
//           child: SingleChildScrollView(
//             padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
//             child: Column(children: [
//               Container(
//                 padding: const EdgeInsets.all(14),
//                 decoration: BoxDecoration(
//                   color: AppColors.cardBg, borderRadius: BorderRadius.circular(14),
//                   border: Border.all(color: AppColors.divider),
//                   boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3))],
//                 ),
//                 child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                   Column(children: [
//                     Container(
//                       width: 60, height: 60,
//                       decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
//                       child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
//                     ),
//                     const SizedBox(height: 6),
//                     Text(doctor.name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//                     Text(doctor.qualification.toUpperCase(), style: const TextStyle(fontSize: 10, color: AppColors.textGrey)),
//                     Text(doctor.department, style: const TextStyle(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.w600)),
//                   ]),
//                   const SizedBox(width: 16),
//                   Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                     _SummaryRow(icon: Icons.person_outline, label: 'Patient Name', value: patientName),
//                     const SizedBox(height: 10),
//                     _SummaryRow(icon: Icons.calendar_today, label: 'Date', value: '${slot.date} (${slot.dayName})'),
//                     const SizedBox(height: 10),
//                     _SummaryRow(icon: Icons.access_time, label: 'Time', value: selectedTime),
//                   ])),
//                   const SizedBox(width: 8),
//                   Stack(alignment: Alignment.bottomRight, children: [
//                     Icon(Icons.lock_outline, size: 52, color: Colors.grey.withOpacity(0.5)),
//                     const Icon(Icons.error, size: 22, color: Color(0xFFF44336)),
//                   ]),
//                 ]),
//               ),
//               const SizedBox(height: 16),
//               Container(
//                 padding: const EdgeInsets.all(14),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFFFEBEE), borderRadius: BorderRadius.circular(12),
//                   border: Border.all(color: const Color(0xFFEF9A9A)),
//                 ),
//                 child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                   const Icon(Icons.error_outline, size: 20, color: Color(0xFFF44336)),
//                   const SizedBox(width: 10),
//                   Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                     const Text('OTP verification incomplete.', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFB71C1C))),
//                     const SizedBox(height: 4),
//                     Text(message, style: const TextStyle(fontSize: 12, color: Color(0xFFC62828), height: 1.5)),
//                   ])),
//                 ]),
//               ),
//               const SizedBox(height: 12),
//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFE3F2FD), borderRadius: BorderRadius.circular(10),
//                   border: Border.all(color: const Color(0xFF90CAF9)),
//                 ),
//                 child: Row(children: [
//                   const Icon(Icons.info_outline, size: 16, color: Color(0xFF1565C0)),
//                   const SizedBox(width: 8),
//                   const Expanded(child: Text(
//                     'For assistance, please contact our support team.',
//                     style: TextStyle(fontSize: 12, color: Color(0xFF1565C0)),
//                   )),
//                 ]),
//               ),
//               const SizedBox(height: 32),
//               SizedBox(
//                 width: double.infinity,
//                 child: ElevatedButton.icon(
//                   onPressed: onTryAgain,
//                   icon: const Icon(Icons.refresh, size: 18),
//                   label: const Text('Try Again', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primary, foregroundColor: Colors.white, elevation: 0,
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                     padding: const EdgeInsets.symmetric(vertical: 14),
//                   ),
//                 ),
//               ),
//               const SizedBox(height: 12),
//               SizedBox(
//                 width: double.infinity,
//                 child: OutlinedButton.icon(
//                   onPressed: onBack,
//                   icon: const Icon(Icons.arrow_back, size: 18),
//                   label: const Text('Back to My Appointments', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
//                   style: OutlinedButton.styleFrom(
//                     foregroundColor: AppColors.textDark,
//                     side: const BorderSide(color: AppColors.divider),
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                     padding: const EdgeInsets.symmetric(vertical: 14),
//                   ),
//                 ),
//               ),
//             ]),
//           ),
//         ),
//       ],
//     );
//   }
// }


// class _SummaryRow extends StatelessWidget {
//   final IconData icon;
//   final String label;
//   final String value;

//   const _SummaryRow({required this.icon, required this.label, required this.value});

//   @override
//   Widget build(BuildContext context) {
//     return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
//       Icon(icon, size: 14, color: AppColors.textGrey),
//       const SizedBox(width: 8),
//       Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//         Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
//         const SizedBox(height: 2),
//         Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//       ]),
//     ]);
//   }
// }

// class _TipCard extends StatelessWidget {
//   final IconData icon;
//   final String title;
//   final String body;
//   final List<String>? bullets;

//   const _TipCard({required this.icon, required this.title, required this.body, this.bullets});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.all(14),
//       decoration: BoxDecoration(
//         color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
//         border: Border.all(color: AppColors.divider),
//       ),
//       child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
//         Icon(icon, size: 22, color: AppColors.primary),
//         const SizedBox(width: 12),
//         Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//           Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
//           const SizedBox(height: 6),
//           Text(body, style: const TextStyle(fontSize: 12, color: AppColors.textGrey, height: 1.5)),
//           if (bullets != null) ...[
//             const SizedBox(height: 6),
//             ...bullets!.asMap().entries.map((e) => Padding(
//               padding: const EdgeInsets.only(top: 3),
//               child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
//                 Text('${e.key + 1}. ', style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
//                 Expanded(child: Text(e.value, style: const TextStyle(fontSize: 12, color: AppColors.textGrey, height: 1.4))),
//               ]),
//             )),
//           ],
//         ])),
//       ]),
//     );
//   }
// }


// class _FormLabel extends StatelessWidget {
//   final String text;
//   const _FormLabel(this.text);

//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.only(bottom: 4),
//       child: Text(text, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
//     );
//   }
// }

// class _FormField extends StatelessWidget {
//   final TextEditingController controller;
//   final String hint;
//   final TextInputType? keyboardType;
//   final String? Function(String?)? validator;
//   final bool readOnly;

//   const _FormField({
//     required this.controller,
//     required this.hint,
//     this.keyboardType,
//     this.validator,
//     this.readOnly = false,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return TextFormField(
//       controller: controller,
//       keyboardType: keyboardType,
//       validator: validator,
//       readOnly: readOnly,
//       style: TextStyle(fontSize: 13, color: readOnly ? AppColors.textGrey : AppColors.textDark),
//       decoration: InputDecoration(
//         hintText: hint, hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
//         filled: true, fillColor: readOnly ? AppColors.background : AppColors.cardBg,
//         contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
//         border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//         enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
//         focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
//         errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Colors.redAccent)),
//         focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Colors.redAccent)),
//       ),
//     );
//   }
// }

// class _RadioOption<T> extends StatelessWidget {
//   final String label;
//   final T value;
//   final T groupValue;
//   final ValueChanged<T?>? onChanged;

//   const _RadioOption({required this.label, required this.value, required this.groupValue, this.onChanged});

//   @override
//   Widget build(BuildContext context) {
//     return Row(mainAxisSize: MainAxisSize.min, children: [
//       SizedBox(
//         width: 20, height: 20,
//         child: Radio<T>(
//           value: value, groupValue: groupValue, onChanged: onChanged,
//           activeColor: AppColors.primary, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
//         ),
//       ),
//       const SizedBox(width: 4),
//       Text(label, style: TextStyle(fontSize: 13, color: onChanged == null ? AppColors.textLight : AppColors.textDark)),
//     ]);
//   }
// }




// class _LegendDot extends StatelessWidget {
//   final Color color;
//   final String label;
//   const _LegendDot({required this.color, required this.label});

//   @override
//   Widget build(BuildContext context) {
//     return Row(mainAxisSize: MainAxisSize.min, children: [
//       Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
//       const SizedBox(width: 5),
//       Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
//     ]);
//   }
// }

// class _EmptySearch extends StatelessWidget {
//   const _EmptySearch();

//   @override
//   Widget build(BuildContext context) {
//     return Center(
//       child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
//         Icon(Icons.search_off, size: 64, color: AppColors.primary.withOpacity(0.25)),
//         const SizedBox(height: 16),
//         const Text('No doctors found', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textGrey)),
//         const SizedBox(height: 8),
//         const Text('Try a different name or specialty', style: TextStyle(fontSize: 13, color: AppColors.textLight)),
//       ]),
//     );
//   }
// }

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
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 58, height: 58,
            decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: const [
              Icon(Icons.person, color: AppColors.textGrey, size: 28),
              Text('Doctor\nImage', textAlign: TextAlign.center, style: TextStyle(fontSize: 7, color: AppColors.textLight)),
            ]),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(doctor.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
              const SizedBox(height: 5),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.08), borderRadius: BorderRadius.circular(4)),
                child: Text(doctor.qualification.toUpperCase(),
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary, letterSpacing: 0.4)),
              ),
              const SizedBox(height: 5),
              Text(doctor.department, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textGrey)),
            ]),
          ),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(color: AppColors.upcomingBg, borderRadius: BorderRadius.circular(12)),
              child: const Text('Visiting Hours', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.upcomingAmber)),
            ),
            const SizedBox(height: 5),
            Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.access_time, size: 11, color: AppColors.textGrey),
              const SizedBox(width: 3),
              Text(doctor.visitingHours, style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
            ]),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () => onTap(doctor),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(color: AppColors.background, shape: BoxShape.circle, border: Border.all(color: AppColors.divider)),
                child: const Icon(Icons.chevron_right, size: 16, color: AppColors.primary),
              ),
            ),
          ]),
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