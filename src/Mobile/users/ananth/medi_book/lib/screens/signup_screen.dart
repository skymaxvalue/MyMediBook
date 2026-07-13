

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme.dart';
import '../services/api_service.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;
  bool _isLoading = false;

  final _step1Key = GlobalKey<FormState>();
  final _firstNameCtrl  = TextEditingController();
  final _middleNameCtrl = TextEditingController();
  final _lastNameCtrl   = TextEditingController();
  DateTime? _dob;
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  String? _gender;

  Map<String, dynamic>? _phoneCountry; // holds the selected country map (shape depends on API)
  List<Map<String, dynamic>> _allCountries = [];

  final _step2Key = GlobalKey<FormState>();
  final _addr1Ctrl = TextEditingController();
  final _addr2Ctrl = TextEditingController();
  final _zipCtrl   = TextEditingController();

  // Live location data
  List<Map<String, dynamic>> _states = [];
  List<Map<String, dynamic>> _cities = [];
  Map<String, dynamic>? _selectedCountry;
  Map<String, dynamic>? _selectedState;
  Map<String, dynamic>? _selectedCity;
  bool _loadingStates = false;
  bool _loadingCities = false;

  final _step3Key      = GlobalKey<FormState>();
  final _userIdCtrl    = TextEditingController();
  final _passwordCtrl  = TextEditingController();
  final _rePasswordCtrl = TextEditingController();
  final _answerCtrl    = TextEditingController();
  String? _securityQuestion;
  bool _obscurePass   = true;
  bool _obscureRePass = true;

  final List<Map<String, String>> _securityQuestions = [
    {'value': 'pet',    'label': "What is your pet's name?"},
    {'value': 'school', 'label': 'What was your first school?'},
    {'value': 'city',   'label': 'Which city were you born in?'},
    {'value': 'mother', 'label': "What is your mother's maiden name?"},
    {'value': 'food',   'label': 'What is your favorite food?'},
  ];

  @override
  void initState() {
    super.initState();
    _loadCountries();
  }

  // ──────────────────────────────────────────────────────────────────────
  //  Country / dial-code helpers
  //
  //  The live API's field names for country ISO code and dial code are not
  //  guaranteed to match what we originally assumed ('countryCode',
  //  'phoneCode'). These helpers try several common variants so the screen
  //  keeps working even if the API uses different key names, and they log
  //  a sample so you can see the real shape in the console.
  // ──────────────────────────────────────────────────────────────────────

  String? _countryIsoCode(Map<String, dynamic> c) {
    return c['countryCode'] as String? ??
        c['isoCode'] as String? ??
        c['code'] as String? ??
        c['countryShortCode'] as String?;
  }

  String _countryDialCode(Map<String, dynamic>? c) {
    if (c == null) return '+91';
    final raw = c['phoneCode'] ??
        c['dialCode'] ??
        c['callingCode'] ??
        c['phoneCountryCode'];
    if (raw == null) return '+91';
    final str = raw.toString().trim();
    if (str.isEmpty) return '+91';
    return str.startsWith('+') ? str : '+$str';
  }

  String _countryName(Map<String, dynamic> c) {
    return (c['countryName'] ?? c['name'] ?? c['country'] ?? '').toString();
  }

  /// Strips a leading dial code from the typed phone number, in case it
  /// ended up there (e.g. via paste or autofill), so we never send the
  /// dial code twice (once in phoneCountryCode, once baked into phoneNumber).
  String _sanitizedPhoneNumber() {
    var digits = _phoneCtrl.text.trim();
    final dialDigits = _countryDialCode(_phoneCountry).replaceAll('+', '');
    if (dialDigits.isNotEmpty &&
        digits.startsWith(dialDigits) &&
        digits.length > dialDigits.length) {
      digits = digits.substring(dialDigits.length);
    }
    return digits;
  }

  Future<void> _loadCountries() async {
    final countries = await ApiService.fetchCountries();

    if (countries.isNotEmpty) {
      // TEMP DEBUG: confirms the real field names returned by the API.
      // Remove once you've verified the keys match what the helpers above expect.
      debugPrint('Raw country sample: ${countries.first}');
    } else {
      debugPrint('fetchCountries() returned an empty list.');
    }

    if (mounted) {
      setState(() {
        _allCountries = countries;
        // Default phone country to India, falling back to the first entry.
        _phoneCountry = countries.firstWhere(
          (c) => _countryIsoCode(c) == 'IN',
          orElse: () => countries.isNotEmpty ? countries.first : {},
        );
      });
    }
  }

  Future<void> _onCountrySelected(Map<String, dynamic> country) async {
    setState(() {
      _selectedCountry = country;
      _selectedState = null;
      _selectedCity  = null;
      _states = [];
      _cities = [];
      _loadingStates = true;
    });
    final states = await ApiService.fetchStates(country['countryId'] as int);
    if (mounted) {
      setState(() {
        _states = states;
        _loadingStates = false;
      });
    }
  }

  Future<void> _onStateSelected(Map<String, dynamic> state) async {
    setState(() {
      _selectedState = state;
      _selectedCity  = null;
      _cities = [];
      _loadingCities = true;
    });
    final cities = await ApiService.fetchCities(state['stateId'] as int);
    if (mounted) {
      setState(() {
        _cities = cities;
        _loadingCities = false;
      });
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _firstNameCtrl.dispose();
    _middleNameCtrl.dispose();
    _lastNameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _addr1Ctrl.dispose();
    _addr2Ctrl.dispose();
    _zipCtrl.dispose();
    _userIdCtrl.dispose();
    _passwordCtrl.dispose();
    _rePasswordCtrl.dispose();
    _answerCtrl.dispose();
    super.dispose();
  }

  void _nextStep() {
    final keys = [_step1Key, _step2Key, _step3Key];
    if (keys[_currentStep].currentState?.validate() != true) return;
    if (_currentStep < 2) {
      setState(() => _currentStep++);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _handleSubmit();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      Navigator.pop(context);
    }
  }

  Future<void> _handleSubmit() async {
    setState(() => _isLoading = true);

    final sqId = ApiService.securityQuestionIds[_securityQuestion] ?? 0;

    final patientData = {
      'firstName': _firstNameCtrl.text,
      'middleName': _middleNameCtrl.text,
      'lastName': _lastNameCtrl.text,

      'dateOfBirth': _dob?.toIso8601String(),

      // Use the resilient helpers so the dial code is always correct and
      // never duplicated inside phoneNumber.
      'phoneCountryCode': _countryDialCode(_phoneCountry),
      'phoneNumber': _sanitizedPhoneNumber(),

      'email': _emailCtrl.text,
      'gender': _gender,

      'addressLine1': _addr1Ctrl.text,
      'addressLine2': _addr2Ctrl.text,

      'cityId': _selectedCity?['cityId'] ?? 0,
      'zipCode': _zipCtrl.text,
      'stateId': _selectedState?['stateId'] ?? 0,
      'countryId': _selectedCountry?['countryId'] ?? 0,

      'username': _userIdCtrl.text,
      'password': _passwordCtrl.text,

      'securityQuestionId': sqId,
      'securityAnswer': _answerCtrl.text,
    };

    debugPrint('Submitting patientData: $patientData');

    final result = await ApiService.registerPatient(patientData: patientData);
    setState(() => _isLoading = false);
    if (!mounted) return;

    if (result['success'] == true) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: AppColors.success),
              SizedBox(width: 10),
              Expanded(child: Text('Registration Successful')),
            ],
          ),
          content: const Text('Your account has been created. Please login to continue.'),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.popUntil(context, (r) => r.isFirst),
              child: const Text('Go to Login'),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Registration failed'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600;
    final horizontalPad = isTablet ? 32.0 : 16.0;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              children: [
                _buildTabBar(isTablet),
                Expanded(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.fromLTRB(horizontalPad, 0, horizontalPad, 24),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                        border: Border.all(color: const Color(0xFFDCDCFF)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.06),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: EdgeInsets.fromLTRB(
                        isTablet ? 32 : 20, 28, isTablet ? 32 : 20, 24,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: Text(
                              'PATIENT SELF-REGISTRATION',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: isTablet ? 20 : 17,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.4,
                                color: const Color(0xFF1A1A2E),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          _buildProgressDots(),
                          const SizedBox(height: 24),
                          AnimatedSwitcher(
                            duration: const Duration(milliseconds: 300),
                            child: _buildCurrentStep(key: ValueKey(_currentStep)),
                          ),
                          const SizedBox(height: 28),
                          _buildButtons(),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStep1({Key? key}) {
    return Form(
      key: _step1Key,
      child: Column(
        key: key,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field(label: 'First Name', required: true,
            child: TextFormField(
              controller: _firstNameCtrl,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Enter your first name'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
          ),
          _field(label: 'Middle Name',
            child: TextFormField(
              controller: _middleNameCtrl,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Enter your middle name (optional)'),
            ),
          ),
          _field(label: 'Last Name', required: true,
            child: TextFormField(
              controller: _lastNameCtrl,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Enter your last name'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
          ),
          _field(label: 'Date of Birth', required: true,
            child: GestureDetector(
              onTap: () async {
                final picked = await showDatePicker(
                  context: context,
                  initialDate: DateTime(2000),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );
                if (picked != null) setState(() => _dob = picked);
              },
              child: AbsorbPointer(
                child: TextFormField(
                  decoration: _inputDec(
                    _dob == null
                        ? 'Select your date of birth'
                        : '${_dob!.day.toString().padLeft(2, '0')}/${_dob!.month.toString().padLeft(2, '0')}/${_dob!.year}',
                    suffix: const Icon(Icons.calendar_today, size: 18),
                  ),
                  validator: (_) => _dob == null ? 'Required' : null,
                ),
              ),
            ),
          ),

          _field(label: 'Phone Number', required: true,
            child: TextFormField(
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              decoration: _inputDec(
                'Enter phone number',
                prefix: _allCountries.isEmpty
                    ? const SizedBox(
                        width: 20, height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : GestureDetector(
                        onTap: _showCountryCodePicker,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '${_countryDialCode(_phoneCountry)} ',
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                                color: Color(0xFF333355),
                              ),
                            ),
                            const Icon(Icons.arrow_drop_down, size: 18,
                                color: Color(0xFF888888)),
                            const SizedBox(width: 4),
                            Container(width: 1, height: 20,
                                color: const Color(0xFFDCDCFF)),
                            const SizedBox(width: 4),
                          ],
                        ),
                      ),
              ),
              validator: (v) =>
                  (v == null || v.length < 7) ? 'Valid phone required' : null,
            ),
          ),

          _field(label: 'Email ID', required: true,
            child: TextFormField(
              controller: _emailCtrl,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Enter your email address'),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Required';
                if (!v.contains('@')) return 'Invalid email';
                return null;
              },
            ),
          ),
          _field(label: 'Gender',
            child: DropdownButtonFormField<String>(
              value: _gender,
              decoration: _inputDec('Select gender'),
              isExpanded: true,
              items: ['Male', 'Female', 'Other']
                  .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                  .toList(),
              onChanged: (v) => setState(() => _gender = v),
            ),
          ),
        ],
      ),
    );
  }

  void _showCountryCodePicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        final search = ValueNotifier<String>('');
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.6,
          maxChildSize: 0.9,
          builder: (_, scrollCtrl) => Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            child: Column(
              children: [
                Container(width: 40, height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    )),
                const SizedBox(height: 12),
                const Text('Select Country Code',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                const SizedBox(height: 10),
                TextField(
                  autofocus: true,
                  decoration: _inputDec('Search country...'),
                  onChanged: (v) => search.value = v.toLowerCase(),
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: ValueListenableBuilder<String>(
                    valueListenable: search,
                    builder: (_, q, __) {
                      final filtered = _allCountries.where((c) {
                        final name = _countryName(c).toLowerCase();
                        final dial = _countryDialCode(c);
                        return name.contains(q) || dial.contains(q);
                      }).toList();
                      return ListView.builder(
                        controller: scrollCtrl,
                        itemCount: filtered.length,
                        itemBuilder: (_, i) {
                          final c = filtered[i];
                          final isSelected =
                              _phoneCountry?['countryId'] == c['countryId'];
                          return ListTile(
                            selected: isSelected,
                            selectedTileColor: AppColors.primary.withOpacity(0.08),
                            leading: Text(_countryDialCode(c),
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600, fontSize: 14)),
                            title: Text(_countryName(c)),
                            trailing: isSelected
                                ? Icon(Icons.check, color: AppColors.primary)
                                : null,
                            onTap: () {
                              setState(() => _phoneCountry = c);
                              Navigator.pop(ctx);
                            },
                          );
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStep2({Key? key}) {
    return Form(
      key: _step2Key,
      child: Column(
        key: key,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field(label: 'Address Line 1', required: true,
            child: TextFormField(
              controller: _addr1Ctrl,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('House / Flat No., Street'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
          ),
          _field(label: 'Address Line 2',
            child: TextFormField(
              controller: _addr2Ctrl,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Landmark, Area (optional)'),
            ),
          ),
          _field(label: 'Zip / Pin Code', required: true,
            child: TextFormField(
              controller: _zipCtrl,
              keyboardType: TextInputType.number,
              textInputAction: TextInputAction.next,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              decoration: _inputDec('Enter your zip / pin code'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
          ),

          _field(label: 'Country', required: true,
            child: _allCountries.isEmpty
                ? _loadingDropdown('Loading countries...')
                : DropdownButtonFormField<Map<String, dynamic>>(
                    value: _selectedCountry,
                    decoration: _inputDec('Select country'),
                    isExpanded: true,
                    items: _allCountries.map((c) => DropdownMenuItem(
                      value: c,
                      child: Text(_countryName(c)),
                    )).toList(),
                    onChanged: (v) { if (v != null) _onCountrySelected(v); },
                    validator: (v) => v == null ? 'Required' : null,
                  ),
          ),

          _field(label: 'State / Province',
            child: _loadingStates
                ? _loadingDropdown('Loading states...')
                : DropdownButtonFormField<Map<String, dynamic>>(
                    value: _selectedState,
                    decoration: _inputDec(
                      _selectedCountry == null ? 'Select country first' : 'Select state',
                    ),
                    isExpanded: true,
                    items: _states.map((s) => DropdownMenuItem(
                      value: s,
                      child: Text(s['stateName'] as String),
                    )).toList(),
                    onChanged: _states.isEmpty
                        ? null
                        : (v) { if (v != null) _onStateSelected(v); },
                  ),
          ),

          _field(label: 'City',
            child: _loadingCities
                ? _loadingDropdown('Loading cities...')
                : DropdownButtonFormField<Map<String, dynamic>>(
                    value: _selectedCity,
                    decoration: _inputDec(
                      _selectedState == null ? 'Select state first' : 'Select city',
                    ),
                    isExpanded: true,
                    items: _cities.map((c) => DropdownMenuItem(
                      value: c,
                      child: Text(c['cityName'] as String),
                    )).toList(),
                    onChanged: _cities.isEmpty
                        ? null
                        : (v) => setState(() => _selectedCity = v),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _loadingDropdown(String label) {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F8FF),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFDCDCFF)),
      ),
      child: Row(
        children: [
          const SizedBox(
            width: 16, height: 16,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          const SizedBox(width: 10),
          Text(label, style: const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildStep3({Key? key}) {
    return Form(
      key: _step3Key,
      child: Column(
        key: key,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field(label: 'User ID', required: true,
            child: TextFormField(
              controller: _userIdCtrl,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('e.g. john_doe123'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
          ),
          _field(label: 'Password', required: true,
            child: TextFormField(
              controller: _passwordCtrl,
              obscureText: _obscurePass,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Minimum 6 characters',
                suffix: IconButton(
                  icon: Icon(_obscurePass ? Icons.visibility_off : Icons.visibility,
                      size: 20, color: AppColors.textLight),
                  onPressed: () => setState(() => _obscurePass = !_obscurePass),
                ),
              ),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Required';
                if (v.length < 6) return 'Minimum 6 characters';
                return null;
              },
            ),
          ),
          _field(label: 'Re-enter Password', required: true,
            child: TextFormField(
              controller: _rePasswordCtrl,
              obscureText: _obscureRePass,
              textInputAction: TextInputAction.next,
              decoration: _inputDec('Confirm your password',
                suffix: IconButton(
                  icon: Icon(_obscureRePass ? Icons.visibility_off : Icons.visibility,
                      size: 20, color: AppColors.textLight),
                  onPressed: () => setState(() => _obscureRePass = !_obscureRePass),
                ),
              ),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Required';
                if (v != _passwordCtrl.text) return 'Passwords do not match';
                return null;
              },
            ),
          ),
          _field(label: 'Security Question', required: true,
            child: DropdownButtonFormField<String>(
              value: _securityQuestion,
              decoration: _inputDec('Select a security question'),
              isExpanded: true,
              items: _securityQuestions.map((q) => DropdownMenuItem(
                value: q['value'],
                child: Text(q['label']!, overflow: TextOverflow.ellipsis),
              )).toList(),
              onChanged: (v) => setState(() => _securityQuestion = v),
              validator: (v) => v == null ? 'Required' : null,
            ),
          ),
          _field(label: 'Answer', required: true,
            child: TextFormField(
              controller: _answerCtrl,
              textInputAction: TextInputAction.done,
              decoration: _inputDec('Your answer'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentStep({required Key key}) {
    switch (_currentStep) {
      case 0: return _buildStep1(key: key);
      case 1: return _buildStep2(key: key);
      default: return _buildStep3(key: key);
    }
  }

  Widget _buildProgressDots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(3, (i) {
        final isActive = i == _currentStep;
        final isDone   = i < _currentStep;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: isActive ? 28 : 10,
          height: 10,
          decoration: BoxDecoration(
            color: isDone
                ? AppColors.tabCompleted
                : isActive
                    ? AppColors.primary
                    : const Color(0xFFDDDDEE),
            borderRadius: BorderRadius.circular(5),
          ),
        );
      }),
    );
  }

  Widget _buildTabBar(bool isTablet) {
    final labels     = ['PERSONAL\nINFO', 'ADDRESS', 'CREDENTIALS'];
    final fullLabels = ['PERSONAL INFORMATION', 'ADDRESS', 'CREDENTIALS'];
    return Padding(
      padding: EdgeInsets.fromLTRB(isTablet ? 32 : 16, 16, isTablet ? 32 : 16, 0),
      child: Row(
        children: List.generate(3, (i) {
          Color bg, fg;
          if (i < _currentStep)      { bg = AppColors.tabCompleted; fg = Colors.black87; }
          else if (i == _currentStep){ bg = AppColors.tabActive;    fg = Colors.black87; }
          else                        { bg = const Color(0xFFEEEEEE); fg = const Color(0xFF888888); }
          return Expanded(
            child: Container(
              margin: EdgeInsets.only(right: i < 2 ? 6 : 0),
              padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 4),
              decoration: BoxDecoration(
                color: bg,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14), topRight: Radius.circular(14),
                ),
              ),
              child: Center(
                child: Text(
                  isTablet ? fullLabels[i] : labels[i],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: isTablet ? 12 : 10,
                    color: fg, height: 1.3,
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildButtons() {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton(
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.primary),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(vertical: 15),
            ),
            onPressed: _prevStep,
            child: Text(
              _currentStep == 0 ? 'Cancel' : 'Back',
              style: const TextStyle(
                color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 15,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          flex: 2,
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryDark]),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 15),
              ),
              onPressed: _isLoading ? null : _nextStep,
              child: _isLoading
                  ? const SizedBox(width: 20, height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : Text(
                      _currentStep == 2 ? 'Submit' : 'Save and Next',
                      style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15,
                      ),
                    ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _field({required String label, required Widget child, bool required = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text.rich(TextSpan(children: [
              TextSpan(
                text: label,
                style: const TextStyle(
                  fontSize: 13.5, fontWeight: FontWeight.w600, color: Color(0xFF333355),
                ),
              ),
              if (required)
                const TextSpan(
                  text: ' *',
                  style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w700, fontSize: 14),
                ),
            ])),
          ),
          child,
        ],
      ),
    );
  }

  InputDecoration _inputDec(String hint, {Widget? suffix, Widget? prefix}) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14),
      suffixIcon: suffix,
      prefixIcon: prefix != null
          ? Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              child: prefix,
            )
          : null,
      prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      filled: true,
      fillColor: const Color(0xFFF8F8FF),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Color(0xFFDCDCFF)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Color(0xFFDCDCFF)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: AppColors.primary, width: 1.8),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: AppColors.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: AppColors.error, width: 1.8),
      ),
      errorStyle: const TextStyle(fontSize: 11.5),
    );
  }
}