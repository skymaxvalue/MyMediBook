// TODO Implement this library.

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import 'common_widgets.dart';

class BookingSuccessView extends StatelessWidget {
  final Doctor doctor;
  final DoctorAvailability slot;
  final String selectedTime;
  final String patientName;
  final String message;
  final VoidCallback onDone;

  const BookingSuccessView({
    super.key,
    required this.doctor, required this.slot, required this.selectedTime,
    required this.patientName, required this.message, required this.onDone,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
          color: const Color(0xFFE8F5E9),
          child: Row(children: [
            Container(
              width: 32, height: 32,
              decoration: const BoxDecoration(color: Color(0xFF4CAF50), shape: BoxShape.circle),
              child: const Icon(Icons.check, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                "Doctor's Appointment Confirmed!",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF2E7D32)),
                overflow: TextOverflow.ellipsis,
                maxLines: 2,
              ),
            ),
          ]),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
            child: Column(children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.cardBg, borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.divider),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3))],
                ),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  // Left: doctor avatar + constrained info
                  SizedBox(
                    width: 78,
                    child: Column(children: [
                      Container(
                        width: 58, height: 58,
                        decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
                        child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
                      ),
                      const SizedBox(height: 6),
                      Text(doctor.name,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textDark),
                        textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, maxLines: 2),
                      Text(doctor.qualification.toUpperCase(),
                        style: const TextStyle(fontSize: 9, color: AppColors.textGrey),
                        textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, maxLines: 1),
                      Text(doctor.department,
                        style: const TextStyle(fontSize: 9, color: AppColors.primary, fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, maxLines: 1),
                    ]),
                  ),
                  const SizedBox(width: 12),
                  // Middle: summary rows
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    SummaryRow(icon: Icons.person_outline, label: 'Patient Name', value: patientName),
                    const SizedBox(height: 10),
                    SummaryRow(icon: Icons.calendar_today, label: 'Date', value: '${slot.date} (${slot.dayName})'),
                    const SizedBox(height: 10),
                    SummaryRow(icon: Icons.access_time, label: 'Time', value: selectedTime),
                  ])),
                  const SizedBox(width: 8),
                  // Right: decorative icon
                  Icon(Icons.handshake_outlined, size: 46, color: AppColors.primary.withOpacity(0.6)),
                ]),
              ),
              const SizedBox(height: 20),
              _TipCard(
                icon: Icons.tips_and_updates_outlined,
                title: 'Making the most of your visit',
                body: 'Care providers often manage complex schedules to ensure every patient receives the attention they need. To maximize your time with your doctor and ensure a relaxed experience, we recommend the following steps:',
              ),
              const SizedBox(height: 12),
              _TipCard(
                icon: Icons.directions_walk_outlined,
                title: 'Arrive early, stay relaxed',
                body: 'Plan to arrive at the office 10–15 minutes before your scheduled appointment. This allows ample time for your check-in process.',
                bullets: const [
                  'Complete any necessary check-in paperwork.',
                  'Record your vital signs (such as height, weight, and blood pressure).',
                  'Ensure you are ready to see the doctor the moment they become available.',
                ],
              ),
              const SizedBox(height: 12),
              _TipCard(
                icon: Icons.event_note_outlined,
                title: 'Stay organized',
                body: 'To help keep your day running smoothly, we suggest recording your appointment date and time in a personal calendar or digital planner as soon as it is scheduled.',
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFE3F2FD), borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF90CAF9)),
                ),
                child: Row(children: [
                  const Icon(Icons.info_outline, size: 16, color: Color(0xFF1565C0)),
                  const SizedBox(width: 8),
                  const Expanded(child: Text(
                    'A confirmation SMS has been sent to your registered mobile number.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF1565C0)),
                  )),
                ]),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: onDone,
                  icon: const Icon(Icons.arrow_back, size: 18),
                  label: const Text('Back to My Appointments', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary, foregroundColor: Colors.white, elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ]),
          ),
        ),
      ],
    );
  }
}



class BookingFailureView extends StatelessWidget {
  final Doctor doctor;
  final DoctorAvailability slot;
  final String selectedTime;
  final String patientName;
  final String message;
  final VoidCallback onTryAgain;
  final VoidCallback onBack;

  const BookingFailureView({
    super.key,
    required this.doctor, required this.slot, required this.selectedTime,
    required this.patientName, required this.message,
    required this.onTryAgain, required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
          color: const Color(0xFFFFEBEE),
          child: Row(children: [
            Container(
              width: 32, height: 32,
              decoration: const BoxDecoration(color: Color(0xFFF44336), shape: BoxShape.circle),
              child: const Icon(Icons.close, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                "Doctor's Appointment Confirmation Failed",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFFB71C1C)),
                overflow: TextOverflow.ellipsis,
                maxLines: 2,
              ),
            ),
          ]),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
            child: Column(children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.cardBg, borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.divider),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 3))],
                ),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  // Left: doctor avatar + constrained info
                  SizedBox(
                    width: 78,
                    child: Column(children: [
                      Container(
                        width: 58, height: 58,
                        decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.divider)),
                        child: const Icon(Icons.person, color: AppColors.textGrey, size: 28),
                      ),
                      const SizedBox(height: 6),
                      Text(doctor.name,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textDark),
                        textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, maxLines: 2),
                      Text(doctor.qualification.toUpperCase(),
                        style: const TextStyle(fontSize: 9, color: AppColors.textGrey),
                        textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, maxLines: 1),
                      Text(doctor.department,
                        style: const TextStyle(fontSize: 9, color: AppColors.primary, fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, maxLines: 1),
                    ]),
                  ),
                  const SizedBox(width: 12),
                  // Middle: summary rows
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    SummaryRow(icon: Icons.person_outline, label: 'Patient Name', value: patientName),
                    const SizedBox(height: 10),
                    SummaryRow(icon: Icons.calendar_today, label: 'Date', value: '${slot.date} (${slot.dayName})'),
                    const SizedBox(height: 10),
                    SummaryRow(icon: Icons.access_time, label: 'Time', value: selectedTime),
                  ])),
                  const SizedBox(width: 8),
                  // Right: decorative error icon
                  Stack(alignment: Alignment.bottomRight, children: [
                    Icon(Icons.lock_outline, size: 46, color: Colors.grey.withOpacity(0.5)),
                    const Icon(Icons.error, size: 20, color: Color(0xFFF44336)),
                  ]),
                ]),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFEBEE), borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFEF9A9A)),
                ),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Icon(Icons.error_outline, size: 20, color: Color(0xFFF44336)),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('OTP verification incomplete.', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFB71C1C))),
                    const SizedBox(height: 4),
                    Text(message, style: const TextStyle(fontSize: 12, color: Color(0xFFC62828), height: 1.5)),
                  ])),
                ]),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFE3F2FD), borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF90CAF9)),
                ),
                child: Row(children: [
                  const Icon(Icons.info_outline, size: 16, color: Color(0xFF1565C0)),
                  const SizedBox(width: 8),
                  const Expanded(child: Text(
                    'For assistance, please contact our support team.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF1565C0)),
                  )),
                ]),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: onTryAgain,
                  icon: const Icon(Icons.refresh, size: 18),
                  label: const Text('Try Again', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary, foregroundColor: Colors.white, elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: onBack,
                  icon: const Icon(Icons.arrow_back, size: 18),
                  label: const Text('Back to My Appointments', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.textDark,
                    side: const BorderSide(color: AppColors.divider),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ]),
          ),
        ),
      ],
    );
  }
}


class _TipCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String body;
  final List<String>? bullets;

  const _TipCard({required this.icon, required this.title, required this.body, this.bullets});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, size: 22, color: AppColors.primary),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textDark)),
          const SizedBox(height: 6),
          Text(body, style: const TextStyle(fontSize: 12, color: AppColors.textGrey, height: 1.5)),
          if (bullets != null) ...[
            const SizedBox(height: 6),
            ...bullets!.asMap().entries.map((e) => Padding(
              padding: const EdgeInsets.only(top: 3),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${e.key + 1}. ', style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
                Expanded(child: Text(e.value, style: const TextStyle(fontSize: 12, color: AppColors.textGrey, height: 1.4))),
              ]),
            )),
          ],
        ])),
      ]),
    );
  }
}