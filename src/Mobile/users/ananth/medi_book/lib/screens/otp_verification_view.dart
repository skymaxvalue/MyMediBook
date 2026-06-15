// TODO Implement this library.
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_colors.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import '../services/api_service.dart';
import 'booking_result_views.dart';
import 'common_widgets.dart';

class OtpVerificationView extends StatefulWidget {
  final Doctor doctor;
  final DoctorAvailability slot;
  final String selectedTime;
  final String patientName;
  final String maskedContact;
  final String appointmentId;
  final String otpChannel;
  final VoidCallback onCancel;
  final VoidCallback onFullComplete;

  const OtpVerificationView({
    super.key,
    required this.doctor, required this.slot, required this.selectedTime,
    required this.patientName, required this.maskedContact, required this.appointmentId,
    required this.otpChannel, required this.onCancel, required this.onFullComplete,
  });

  @override
  State<OtpVerificationView> createState() => _OtpVerificationViewState();
}

class _OtpVerificationViewState extends State<OtpVerificationView> {
  final List<TextEditingController> _otpCtrls = List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  bool _verifying = false;
  bool _resending = false;
  int _resendCountdown = 30;
  late final _countdownTimer = Stream.periodic(const Duration(seconds: 1), (i) => i).take(30);

  bool? _result;
  String _resultMessage = '';

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  void _startCountdown() {
    setState(() => _resendCountdown = 30);
    _countdownTimer.listen((_) {
      if (!mounted) return;
      setState(() => _resendCountdown--);
    });
  }

  @override
  void dispose() {
    for (final c in _otpCtrls) c.dispose();
    for (final f in _focusNodes) f.dispose();
    super.dispose();
  }

  String get _otp => _otpCtrls.map((c) => c.text).join();

  void _onOtpChanged(int index, String value) {
    if (value.length == 1 && index < 3) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    setState(() {});
  }

  Future<void> _verify() async {
    if (_otp.length < 4) return;
    setState(() => _verifying = true);

    final res = await ApiService.verifyBookingOtp(
      appointmentId: widget.appointmentId,
      otp: _otp,
    );

    if (!mounted) return;
    setState(() {
      _verifying = false;
      _result = res['success'] as bool? ?? false;
      _resultMessage = res['message'] as String? ?? '';
    });
  }

  Future<void> _resend() async {
    if (_resendCountdown > 0) return;
    setState(() => _resending = true);
    await ApiService.resendBookingOtp(appointmentId: widget.appointmentId);
    if (!mounted) return;
    setState(() => _resending = false);
    _startCountdown();
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
      content: Text('OTP resent successfully'),
      backgroundColor: AppColors.primary, behavior: SnackBarBehavior.floating,
    ));
  }

  @override
  Widget build(BuildContext context) {
    if (_result != null) {
      return _result!
          ? BookingSuccessView(
              doctor: widget.doctor,
              slot: widget.slot,
              selectedTime: widget.selectedTime,
              patientName: widget.patientName,
              message: _resultMessage,
              onDone: widget.onFullComplete,
            )
          : BookingFailureView(
              doctor: widget.doctor,
              slot: widget.slot,
              selectedTime: widget.selectedTime,
              patientName: widget.patientName,
              message: _resultMessage,
              onTryAgain: () => setState(() {
                _result = null;
                for (final c in _otpCtrls) c.clear();
                _focusNodes[0].requestFocus();
              }),
              onBack: widget.onFullComplete,
            );
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 14, 16, 0),
          child: Row(children: [
            IconButton(
              onPressed: widget.onCancel,
              icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
              padding: EdgeInsets.zero, constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.verified_user_outlined, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            const Text('OTP Verification', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
          ]),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
            child: Column(children: [
              Container(
                width: 80, height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08), shape: BoxShape.circle,
                  border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                ),
                child: const Icon(Icons.mark_email_unread_outlined, size: 38, color: AppColors.primary),
              ),
              const SizedBox(height: 20),
              const Text('OTP Verification', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textDark)),
              const SizedBox(height: 8),
              Text(
                'OTP sent to\n${widget.maskedContact}',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14, color: AppColors.textGrey, height: 1.5),
              ),
              const SizedBox(height: 6),
              Text(
                'Please enter the 4-digit OTP sent to your ${widget.otpChannel == 'email' ? 'email address' : 'mobile number'} to confirm your appointment.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, color: AppColors.textLight, height: 1.5),
              ),
              const SizedBox(height: 28),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (i) {
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    width: 56, height: 60,
                    decoration: BoxDecoration(
                      color: AppColors.cardBg,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _otpCtrls[i].text.isNotEmpty ? AppColors.primary : AppColors.divider,
                        width: _otpCtrls[i].text.isNotEmpty ? 2 : 1,
                      ),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 2))],
                    ),
                    child: TextField(
                      controller: _otpCtrls[i],
                      focusNode: _focusNodes[i],
                      maxLength: 1,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.primary),
                      decoration: const InputDecoration(counterText: '', border: InputBorder.none),
                      onChanged: (v) => _onOtpChanged(i, v),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 20),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Text("Didn't receive OTP? ", style: TextStyle(fontSize: 13, color: AppColors.textGrey)),
                _resendCountdown > 0
                    ? Text('Resend OTP (${_resendCountdown}s)',
                        style: const TextStyle(fontSize: 13, color: AppColors.textLight))
                    : GestureDetector(
                        onTap: _resending ? null : _resend,
                        child: Text(
                          _resending ? 'Resending...' : 'Resend OTP',
                          style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w700),
                        ),
                      ),
              ]),
              const SizedBox(height: 28),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.cardBg, borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.divider),
                ),
                child: Column(children: [
                  SummaryRow(icon: Icons.medical_services_outlined, label: 'Appointment With', value: widget.doctor.name),
                  const SizedBox(height: 10),
                  SummaryRow(
                    icon: Icons.calendar_today,
                    label: 'Date & Time',
                    value: '${widget.slot.date} – ${widget.selectedTime}',
                  ),
                  const SizedBox(height: 10),
                  SummaryRow(icon: Icons.local_hospital_outlined, label: 'Department', value: widget.doctor.department),
                ]),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F4FF), borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.primary.withOpacity(0.15)),
                ),
                child: Row(children: [
                  const Icon(Icons.shield_outlined, size: 16, color: AppColors.primary),
                  const SizedBox(width: 8),
                  const Expanded(child: Text(
                    'For your security, do not share the OTP with anyone.',
                    style: TextStyle(fontSize: 11, color: AppColors.textGrey),
                  )),
                ]),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: (_otp.length < 4 || _verifying) ? null : _verify,
                  icon: _verifying
                      ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.verified_outlined, size: 18),
                  label: Text(
                    _verifying ? 'Verifying...' : 'Verify & Book Appointment',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                  ),
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
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: _verifying ? null : widget.onCancel,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.textGrey,
                    side: const BorderSide(color: AppColors.divider),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Cancel', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                ),
              ),
            ]),
          ),
        ),
      ],
    );
  }
}