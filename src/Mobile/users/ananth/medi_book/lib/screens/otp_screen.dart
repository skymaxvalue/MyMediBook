
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'reset_password_screen.dart';


enum OtpFlowType { login, forgotPassword }

class OtpScreen extends StatefulWidget {
  
  final String? contactInfo;


  final OtpFlowType flowType;

  const OtpScreen({
    super.key,
    this.contactInfo,
    this.flowType = OtpFlowType.login,
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _controllers =
      List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  bool _isLoading = false;
  int _secondsLeft = 59;
  Timer? _timer;
  bool _canResend = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    setState(() {
      _secondsLeft = 59;
      _canResend = false;
    });
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsLeft == 0) {
        timer.cancel();
        setState(() => _canResend = true);
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  @override
  void dispose() {
    for (final c in _controllers) c.dispose();
    for (final f in _focusNodes) f.dispose();
    _timer?.cancel();
    super.dispose();
  }

  String get _otp => _controllers.map((c) => c.text).join();

  void _onOtpDigitChanged(int index, String value) {
    if (value.length == 1 && index < 3) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    setState(() {});
  }

  Future<void> _handleVerify() async {
    if (_otp.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the 4-digit OTP'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    final result = widget.flowType == OtpFlowType.forgotPassword
        ? await ApiService.verifyForgotPasswordOtp(otp: _otp)
        : await ApiService.verifyOtp(otp: _otp);

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (result['success'] == true) {
      if (widget.flowType == OtpFlowType.forgotPassword) {
    
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const ResetPasswordScreen()),
        );
      } else {
  
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (route) => false,
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Invalid OTP'),
          backgroundColor: AppColors.error,
        ),
      );
      for (final c in _controllers) c.clear();
      _focusNodes[0].requestFocus();
    }
  }

  Future<void> _handleResend() async {
    if (!_canResend) return;

    final result = widget.flowType == OtpFlowType.forgotPassword
        ? await ApiService.resendForgotPasswordOtp(
            emailOrPhone: widget.contactInfo ?? '',
          )
        : await ApiService.resendOtp();

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(result['message'] ?? 'OTP resent')),
    );
    _startTimer();
  }

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    final screenW = mq.size.width;
    final screenH = mq.size.height;

    final cardPadH = screenW < 360 ? 16.0 : 24.0;
    final cardPadV = screenH < 640 ? 20.0 : (screenH < 750 ? 28.0 : 36.0);

    final cardInnerW = screenW - 32 - (cardPadH * 2);
    final rawBox = (cardInnerW - (3 * 12)) / 4;
    final boxSize = rawBox.clamp(42.0, 64.0);
    final boxFontSize = (boxSize * 0.38).clamp(15.0, 22.0);

    final titleSize = screenW < 360 ? 19.0 : 22.0;
    final subSize = screenW < 360 ? 11.5 : 13.0;
    final btnSize = screenW < 360 ? 14.0 : 15.5;
    final timerSize = screenW < 360 ? 11.0 : 12.0;

    final gapLg = screenH < 640 ? 14.0 : (screenH < 750 ? 18.0 : 24.0);
    final gapMd = screenH < 640 ? 10.0 : 14.0;
    final gapSm = screenH < 640 ? 8.0 : 12.0;
    final btnH = screenH < 640 ? 44.0 : 48.0;

    // Subtitle: show contact info if in forgot-password flow
    final subtitle = widget.flowType == OtpFlowType.forgotPassword &&
            widget.contactInfo != null &&
            widget.contactInfo!.isNotEmpty
        ? 'Please enter the OTP sent to\n${widget.contactInfo}'
        : 'Please enter the OTP sent to your registered\nmobile number / e-mail account.';

    return Scaffold(
      backgroundColor: AppColors.background,
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: gapLg),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Container(
                width: double.infinity,
                padding: EdgeInsets.symmetric(
                  horizontal: cardPadH,
                  vertical: cardPadV,
                ),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFDCDCFF)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.06),
                      blurRadius: 20,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    
                    Text(
                      'OTP VERIFICATION',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: titleSize,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5,
                      ),
                    ),
                    SizedBox(height: gapSm),

                    Text(
                      subtitle,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppColors.textGrey,
                        fontSize: subSize,
                        height: 1.5,
                      ),
                    ),
                    SizedBox(height: gapLg),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        4,
                        (i) => _buildOtpBox(i, boxSize, boxFontSize),
                      ),
                    ),
                    SizedBox(height: gapMd),

                    screenW < 340
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _timerWidget(timerSize),
                              const SizedBox(height: 4),
                              _resendWidget(timerSize),
                            ],
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _timerWidget(timerSize),
                              _resendWidget(timerSize),
                            ],
                          ),

                    SizedBox(height: gapLg),

                    SizedBox(
                      width: double.infinity,
                      height: btnH,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primary, AppColors.primaryDark],
                          ),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          onPressed: _isLoading ? null : _handleVerify,
                          child: _isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  'Verify',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: btnSize,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                        ),
                      ),
                    ),
                    SizedBox(height: gapSm),

                    SizedBox(
                      width: double.infinity,
                      height: btnH,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.primary),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          foregroundColor: AppColors.primary,
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: Text(
                          'Cancel',
                          style: TextStyle(fontSize: btnSize),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _timerWidget(double fontSize) => Text(
        'Remaining: ${_secondsLeft.toString().padLeft(2, '0')}s',
        style: TextStyle(fontSize: fontSize, color: AppColors.textGrey),
      );

  Widget _resendWidget(double fontSize) => GestureDetector(
        onTap: _canResend ? _handleResend : null,
        child: Text.rich(
          TextSpan(
            children: [
              TextSpan(
                text: "Didn't get it? ",
                style: TextStyle(fontSize: fontSize, color: AppColors.textGrey),
              ),
              TextSpan(
                text: 'Resend',
                style: TextStyle(
                  fontSize: fontSize,
                  color: _canResend ? AppColors.primary : AppColors.textLight,
                  decoration: TextDecoration.underline,
                ),
              ),
            ],
          ),
        ),
      );

  Widget _buildOtpBox(int index, double size, double fontSize) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 6),
      width: size,
      height: size,
      child: TextFormField(
        controller: _controllers[index],
        focusNode: _focusNodes[index],
        textAlign: TextAlign.center,
        keyboardType: TextInputType.number,
        maxLength: 1,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600),
        decoration: InputDecoration(
          counterText: '',
          contentPadding: EdgeInsets.zero,
          filled: true,
          fillColor: AppColors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
          ),
        ),
        onChanged: (value) => _onOtpDigitChanged(index, value),
      ),
    );
  }
}