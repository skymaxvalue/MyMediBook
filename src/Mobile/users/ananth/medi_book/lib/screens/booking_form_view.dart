
// booking_form_view.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_colors.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import '../models/saved_patient.dart';
import '../models/saved_card.dart';
import '../models/saved_insurance.dart';
import '../services/api_service.dart';
import 'otp_verification_view.dart';

/// Who are we booking for?
enum _PatientMode { self, existing, newPatient }

class BookingFormView extends StatefulWidget {
  final Doctor doctor;
  final DoctorAvailability slot;
  final String selectedTime;
  final int selectedSlotId;       // slotNumber from API
  final VoidCallback onBack;
  final VoidCallback onFullComplete;

  const BookingFormView({
    super.key,
    required this.doctor,
    required this.slot,
    required this.selectedTime,
    required this.selectedSlotId,
    required this.onBack,
    required this.onFullComplete,
  });

  @override
  State<BookingFormView> createState() => _BookingFormViewState();
}

class _BookingFormViewState extends State<BookingFormView> {
  final _formKey = GlobalKey<FormState>();

  // ── form controllers ──────────────────────────────────────────────────────
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl  = TextEditingController();
  final _dobCtrl       = TextEditingController();
  final _ageCtrl       = TextEditingController();
  final _contactCtrl   = TextEditingController();
  final _emailCtrl     = TextEditingController();
  final _visitPurposeCtrl   = TextEditingController();
  final _insProviderCtrl    = TextEditingController();
  final _insPolicyCtrl      = TextEditingController();
  final _insGroupCtrl       = TextEditingController();
  final _insHolderNameCtrl  = TextEditingController();
  final _insHolderAddrCtrl  = TextEditingController();

  // ── card payment controllers ───────────────────────────────────────────────
  final _cardHolderNameCtrl = TextEditingController();
  final _cardNumberCtrl     = TextEditingController();
  final _cardExpiryCtrl     = TextEditingController();
  final _cardCvvCtrl        = TextEditingController();

  // patient-selector state
  _PatientMode _patientMode     = _PatientMode.self;
  bool _loadingPatients         = true;
  List<SavedPatient> _savedPatients = [];
  SavedPatient? _selectedExisting;

  // "new patient" relation field – now loaded from API
  int? _newPatientRelationTypeId;
  List<Map<String, dynamic>> _relationTypes = [];
  bool _loadingRelationTypes = true;

  // age types from API
  int? _ageTypeId;                        // selected age type ID (e.g. 3 = Years)
  List<Map<String, dynamic>> _ageTypes = [];
  bool _loadingAgeTypes = true;

  // ── card / payment state ───────────────────────────────────────────────────────
  bool _loadingCards          = false;
  List<SavedCard> _savedCards = [];
  SavedCard? _selectedCard;
  bool _useExistingCard       = false;   // true = pick existing, false = enter new
  bool _saveNewCard           = false;   // checkbox to persist new card

  // ── insurance state ───────────────────────────────────────────────────────
  bool _loadingInsurances              = false;
  List<SavedInsurance> _savedInsurances = [];
  SavedInsurance? _selectedInsurance;
  bool _useExistingInsurance           = false;  // true = pick saved, false = enter new
  bool _saveNewInsurance               = false;  // checkbox to persist new insurance

  // rest of form state
  String? _gender;
  bool    _hasInsurance      = false;
  String  _visitType         = '';
  String  _otpChannel        = 'mobile';
  bool    _submitting        = false;


  Map<String, dynamic>? _bookingResponse;

  final List<String> _genderOptions = ['Male', 'Female', 'Other'];
  final List<String> _visitTypes = [
    'Consultation', 'Follow-up', 'Emergency', 'Routine Check-up',
    'Lab / Diagnostics', 'Other',
  ];

  @override
  void initState() {
    super.initState();
    _loadSavedPatients();
    _loadSavedCards();
    _loadSavedInsurances();
    _loadRelationTypes();
    _loadAgeTypes();
  }

  // ── loaders ────────────────────────────────────────────────────────────────
  Future<void> _loadSavedPatients() async {
    final result = await ApiService.fetchPatientProfiles();
    if (!mounted) return;
    setState(() {
      _savedPatients   = result;
      _loadingPatients = false;
    });
    _applyPatientMode(_PatientMode.self);
  }

  Future<void> _loadSavedCards() async {
    setState(() => _loadingCards = true);
    final result = await ApiService.fetchSavedCards();
    if (!mounted) return;
    setState(() {
      // List.from() ensures the local list is mutable so .add() works later
      _savedCards   = List.from(result);
      _loadingCards = false;
      if (_savedCards.isNotEmpty) {
        _useExistingCard = true;
        _selectedCard    = _savedCards.first;
      }
    });
  }

  Future<void> _loadSavedInsurances() async {
    setState(() => _loadingInsurances = true);
    final result = await ApiService.fetchSavedInsurances();
    if (!mounted) return;
    setState(() {
      // List.from() ensures the local list is mutable so .add() works later
      _savedInsurances   = List.from(result);
      _loadingInsurances = false;
      if (_savedInsurances.isNotEmpty) {
        _useExistingInsurance = true;
        _selectedInsurance    = _savedInsurances.first;
        // Pre-fill the text controllers with the first saved insurance
        _fillInsuranceFromSaved(_savedInsurances.first);
      }
    });
  }

  Future<void> _loadRelationTypes() async {
    final result = await ApiService.fetchRelationTypeList();
    if (!mounted) return;
    setState(() {
      // Exclude 'Self' (id=1) and deduplicate by relationTypeId
      final seen = <int>{};
      _relationTypes = result
          .where((r) => r['relationTypeId'] != 1)
          .where((r) => seen.add(r['relationTypeId'] as int))
          .toList();
      _loadingRelationTypes = false;
    });
  }

  Future<void> _loadAgeTypes() async {
    final result = await ApiService.fetchAgeTypeList();
    if (!mounted) return;
    setState(() {
      // Deduplicate by ageTypeId to avoid DropdownButtonFormField assertion
      final seen = <int>{};
      _ageTypes = result
          .where((a) => seen.add(a['ageTypeId'] as int))
          .toList();
      _loadingAgeTypes = false;
      // Default to Years (id=3) if present
      final years = _ageTypes.firstWhere(
        (a) => (a['ageTypeName'] as String).toLowerCase() == 'years',
        orElse: () => _ageTypes.isNotEmpty ? _ageTypes.last : {'ageTypeId': 3},
      );
      final candidate = years['ageTypeId'] as int?;
      // Only set if it actually exists in the deduplicated list
      _ageTypeId = _ageTypes.any((a) => a['ageTypeId'] == candidate)
          ? candidate
          : (_ageTypes.isNotEmpty ? _ageTypes.first['ageTypeId'] as int? : null);
    });
  }

  // ── patient mode helpers ───────────────────────────────────────────────────
  void _applyPatientMode(_PatientMode mode) {
    setState(() => _patientMode = mode);
    switch (mode) {
      case _PatientMode.self:
        _fillSelf();
        break;
      case _PatientMode.existing:
        if (_selectedExisting != null) _fillFromSaved(_selectedExisting!);
        break;
      case _PatientMode.newPatient:
        _clearFormFields();
        break;
    }
  }

  void _fillSelf() {
    final self = ApiService.mockSelfProfile;
    _firstNameCtrl.text = self['firstName']     ?? '';
    _lastNameCtrl.text  = self['lastName']      ?? '';
    _dobCtrl.text       = self['dateOfBirth']   ?? '';
    _ageCtrl.text       = self['age']           ?? '';
    _contactCtrl.text   = self['contactNumber'] ?? '';
    _emailCtrl.text     = self['emailAddress']  ?? '';
    // Sanitize gender: only use value if it matches one of the dropdown options
    final rawGender = self['gender'] as String?;
    setState(() {
      _gender = (rawGender != null && _genderOptions.contains(rawGender))
          ? rawGender
          : null;
    });
  }

  void _fillFromSaved(SavedPatient p) {
    _firstNameCtrl.text = p.firstName;
    _lastNameCtrl.text  = p.lastName;
    _dobCtrl.text       = p.dateOfBirth;
    _ageCtrl.text       = p.age;
    _contactCtrl.text   = p.contactNumber;
    _emailCtrl.text     = p.emailAddress;
    setState(() {
      _gender  = p.gender.isEmpty ? null : p.gender;
    });
  }

  void _clearFormFields() {
    _firstNameCtrl.clear();
    _lastNameCtrl.clear();
    _dobCtrl.clear();
    _ageCtrl.clear();
    _contactCtrl.clear();
    _emailCtrl.clear();
    setState(() {
      _gender  = null;
    });
  }

  void _fillInsuranceFromSaved(SavedInsurance ins) {
    _insProviderCtrl.text    = ins.providerName;
    _insPolicyCtrl.text      = ins.policyId;
    _insGroupCtrl.text       = ins.groupId;
    _insHolderNameCtrl.text  = ins.primaryHolderName;
    _insHolderAddrCtrl.text  = ins.primaryHolderAddress;
  }

  void _clearInsuranceFields() {
    _insProviderCtrl.clear();
    _insPolicyCtrl.clear();
    _insGroupCtrl.clear();
    _insHolderNameCtrl.clear();
    _insHolderAddrCtrl.clear();
  }

  @override
  void dispose() {
    for (final c in [
      _firstNameCtrl, _lastNameCtrl, _dobCtrl, _ageCtrl,
      _contactCtrl, _emailCtrl, _visitPurposeCtrl,
      _insProviderCtrl, _insPolicyCtrl, _insGroupCtrl,
      _insHolderNameCtrl, _insHolderAddrCtrl,
      _cardHolderNameCtrl, _cardNumberCtrl, _cardExpiryCtrl, _cardCvvCtrl,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickDob() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (ctx, child) => Theme(
        data: ThemeData.light().copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      _dobCtrl.text =
          '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
    }
  }

  void _clearForm() {
    _formKey.currentState?.reset();
    _clearFormFields();
    _clearInsuranceFields();
    _cardHolderNameCtrl.clear();
    _cardNumberCtrl.clear();
    _cardExpiryCtrl.clear();
    _cardCvvCtrl.clear();
    setState(() {
      _hasInsurance      = false;
      _visitType         = '';
      _otpChannel        = 'mobile';
      _newPatientRelationTypeId = null;
      _selectedCard      = _savedCards.isNotEmpty ? _savedCards.first : null;
      _useExistingCard   = _savedCards.isNotEmpty;
      _saveNewCard       = false;
      _selectedInsurance      = _savedInsurances.isNotEmpty ? _savedInsurances.first : null;
      _useExistingInsurance   = _savedInsurances.isNotEmpty;
      _saveNewInsurance       = false;
    });
    // Re-fill if a saved insurance is selected
    if (_savedInsurances.isNotEmpty) {
      _fillInsuranceFromSaved(_savedInsurances.first);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);

    // ── save new insurance if user opted in ─────────────────────────────────
    if (_hasInsurance && !_useExistingInsurance && _saveNewInsurance) {
      final newIns = SavedInsurance(
        id:                   'INS-${DateTime.now().millisecondsSinceEpoch}',
        providerName:         _insProviderCtrl.text.trim(),
        policyId:             _insPolicyCtrl.text.trim(),
        groupId:              _insGroupCtrl.text.trim(),
        primaryHolderName:    _insHolderNameCtrl.text.trim(),
        primaryHolderAddress: _insHolderAddrCtrl.text.trim(),
      );
      await ApiService.saveNewInsurance(newIns);
      if (mounted) {
        setState(() {
          _savedInsurances.add(newIns);
          _selectedInsurance    = newIns;
          _useExistingInsurance = true;
        });
      }
    }

    // ── save new card if user opted in ────────────────────────────────────
    if (!_hasInsurance && !_useExistingCard && _saveNewCard) {
      final rawNumber = _cardNumberCtrl.text.replaceAll(' ', '');
      final newCard = SavedCard(
        id:         'CARD-${DateTime.now().millisecondsSinceEpoch}',
        holderName: _cardHolderNameCtrl.text.trim(),
        cardNumber: rawNumber,
        expiry:     _cardExpiryCtrl.text.trim(),
        cvv:        _cardCvvCtrl.text.trim(),
        cardType:   _detectCardType(_cardNumberCtrl.text),
      );
      await ApiService.saveNewCard(newCard);
      if (mounted) {
        setState(() {
          _savedCards.add(newCard);
          _selectedCard    = newCard;
          _useExistingCard = true;
        });
      }
    }

    // ── card info ─────────────────────────────────────────────────────────
    String cardNumber     = '';
    String cardHolderName = '';
    String cardExpiry     = '';
    String cardCvv        = '';

    if (!_hasInsurance) {
      if (_useExistingCard && _selectedCard != null) {
        cardNumber     = _selectedCard!.cardNumber;
        cardHolderName = _selectedCard!.holderName;
        cardExpiry     = _selectedCard!.expiry;
        cardCvv        = _selectedCard!.cvv;
      } else {
        cardNumber     = _cardNumberCtrl.text.replaceAll(' ', '');
        cardHolderName = _cardHolderNameCtrl.text.trim();
        cardExpiry     = _cardExpiryCtrl.text.trim();
        cardCvv        = _cardCvvCtrl.text.trim();
      }
    }

    // ── Collect all booking data to pass to OTP screen ────────────────────
    // The actual appointment will be created AFTER OTP verification succeeds.
    final pendingBookingData = <String, dynamic>{
      'doctorName':  widget.doctor.name,
      'associateId': widget.doctor.associateId,
      'associateRole': widget.doctor.associateRole,
      'slotId':      widget.selectedSlotId,
      'date':        widget.slot.date,
      'dayName':     widget.slot.dayName,
      'time':        widget.selectedTime,
      'department':  widget.doctor.department,
      'firstName':   _firstNameCtrl.text.trim(),
      'lastName':    _lastNameCtrl.text.trim(),
      'dateOfBirth': _dobCtrl.text.trim(),
      'age':         _ageCtrl.text.trim(),
      'ageTypeId':   _ageTypeId,
      'gender':      _gender ?? '',
      'hasInsurance':                  _hasInsurance,
      'insuranceProviderName':         _insProviderCtrl.text.trim(),
      'insurancePolicyId':             _insPolicyCtrl.text.trim(),
      'insuranceGroupId':              _insGroupCtrl.text.trim(),
      'insurancePrimaryHolderName':    _insHolderNameCtrl.text.trim(),
      'insurancePrimaryHolderAddress': _insHolderAddrCtrl.text.trim(),
      'contactNumber':   _contactCtrl.text.trim(),
      'emailAddress':    _emailCtrl.text.trim(),
      'visitPurpose':    _visitPurposeCtrl.text.trim(),
      'visitType':       _visitType,
      'otpChannel':      _otpChannel,
      'profileId': _patientMode == _PatientMode.self
          ? ApiService.currentProfileId
          : _patientMode == _PatientMode.existing
              ? (_selectedExisting?.profileId ?? 0)
              : 0,
      'relatonTypeId': _patientMode == _PatientMode.self
          ? 1
          : _patientMode == _PatientMode.existing
              ? (_selectedExisting?.relationTypeId ?? 1)
              : (_newPatientRelationTypeId ?? 0),
      'cardHolderName': cardHolderName,
      'cardExpiry':     cardExpiry,
      'cardRawNumber':  cardNumber,
      'cardCvv':        cardCvv,
    };

    // ── Send OTP to user's contact before showing the OTP screen ─────────
    final contact = _contactCtrl.text.trim();
    final otpRes = await ApiService.sendBookingOtp(
      contact: contact,
      channel: _otpChannel,
    );

    if (!mounted) return;
    setState(() => _submitting = false);

    if (otpRes['success'] == true) {
      // Store pending data — appointment is created only after OTP is verified
      setState(() => _bookingResponse = {
        ...otpRes,
        'pendingBookingData': pendingBookingData,
        'maskedContact': contact.length >= 4
            ? (_otpChannel == 'email'
                ? '${contact.substring(0, 3)}***@${contact.split('@').last}'
                : '+91 ••••• ${contact.substring(contact.length - 4)}')
            : contact,
        'otpChannel': _otpChannel,
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(otpRes['message'] as String? ?? 'Failed to send OTP. Please try again.'),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
      ));
    }
  }

  // ── card-type detector ─────────────────────────────────────────────────────
  String _detectCardType(String number) {
    final n = number.replaceAll(' ', '');
    if (n.startsWith('4')) return 'Visa';
    if (n.startsWith('5')) return 'Mastercard';
    if (n.startsWith('3')) return 'Amex';
    if (n.startsWith('6')) return 'RuPay';
    return 'Card';
  }

  String get _patientFullName =>
      '${_firstNameCtrl.text.trim()} ${_lastNameCtrl.text.trim()}';

  // ── build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    if (_bookingResponse != null) {
      return OtpVerificationView(
        doctor:        widget.doctor,
        slot:          widget.slot,
        selectedTime:  widget.selectedTime,
        patientName:   _patientFullName,
        maskedContact: _bookingResponse!['maskedContact'] as String? ?? '',
        otpChannel:    _bookingResponse!['otpChannel']    as String? ?? 'mobile',
        bookingData:   _bookingResponse!['pendingBookingData'] as Map<String, dynamic>? ?? {},
        onCancel:      () => setState(() => _bookingResponse = null),
        onFullComplete: widget.onFullComplete,
      );
    }

    return Column(
      children: [
        // ── header ─────────────────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 14, 16, 0),
          child: Row(children: [
            IconButton(
              onPressed: widget.onBack,
              icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.person_outline, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                'Patient Information',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textDark),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ),
          ]),
        ),

        // ── appointment summary chip ────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.06),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: Row(children: [
              const Icon(Icons.info_outline, size: 14, color: AppColors.primary),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  '${widget.doctor.name}  •  ${widget.slot.date}  •  ${widget.selectedTime}',
                  style: const TextStyle(
                    fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.primary,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                ),
              ),
            ]),
          ),
        ),

        // ── scrollable form ─────────────────────────────────────────────────
        Expanded(
          child: _loadingPatients
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : Form(
                  key: _formKey,
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 20),
                    children: [
                      // ── patient selector ──────────────────────────────────
                      _PatientSelectorCard(
                        mode: _patientMode,
                        savedPatients: _savedPatients,
                        selectedExisting: _selectedExisting,
                        onModeChanged: _applyPatientMode,
                        onExistingSelected: (p) {
                          setState(() => _selectedExisting = p);
                          _fillFromSaved(p);
                        },
                      ),
                      const SizedBox(height: 16),

                      // ── relation (new patient) ─────────────────────────────
                      if (_patientMode == _PatientMode.newPatient) ...[
                        _FormLabel('Relation with Account Holder'),
                        _loadingRelationTypes
                          ? const Center(
                              child: SizedBox(
                                height: 40,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: AppColors.primary),
                              ),
                            )
                          : DropdownButtonFormField<int>(
                              value: _newPatientRelationTypeId,
                              hint: const Text('Select relation',
                                  style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                              decoration: _dropdownDeco(),
                              validator: (v) =>
                                  (v == null) ? 'Please select a relation' : null,
                              items: _relationTypes
                                  .map((r) => DropdownMenuItem<int>(
                                        value: r['relationTypeId'] as int,
                                        child: Text(
                                          r['relationTypeName'] as String,
                                          style: const TextStyle(fontSize: 13),
                                        ),
                                      ))
                                  .toList(),
                              onChanged: (v) =>
                                  setState(() => _newPatientRelationTypeId = v),
                              style: const TextStyle(
                                  fontSize: 13, color: AppColors.textDark),
                            ),
                        const SizedBox(height: 12),
                      ],

                      // ── personal fields ────────────────────────────────────
                      _FormLabel('First Name'),
                      _FormField(
                        controller: _firstNameCtrl,
                        hint: 'Enter patient first name',
                        readOnly: _patientMode == _PatientMode.self ||
                            _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Last Name'),
                      _FormField(
                        controller: _lastNameCtrl,
                        hint: 'Enter patient last name',
                        readOnly: _patientMode == _PatientMode.self ||
                            _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Date Of Birth'),
                      TextFormField(
                        controller: _dobCtrl,
                        readOnly: true,
                        onTap: (_patientMode == _PatientMode.self ||
                                _patientMode == _PatientMode.existing)
                            ? null
                            : _pickDob,
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                        decoration: _inputDeco(
                          hint: 'dd/mm/yyyy',
                          suffix: const Icon(Icons.calendar_today, size: 16, color: AppColors.primary),
                          readOnly: _patientMode == _PatientMode.self ||
                              _patientMode == _PatientMode.existing,
                        ),
                      ),
                      const SizedBox(height: 12),
                      // ── age ────────────────────────────────────────────────
                      _FormLabel('Age'),
                      Row(children: [
                        Expanded(
                          flex: 2,
                          child: _FormField(
                            controller: _ageCtrl,
                            hint: 'Age',
                            keyboardType: TextInputType.number,
                            readOnly: _patientMode == _PatientMode.self ||
                                _patientMode == _PatientMode.existing,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 3,
                          child: _loadingAgeTypes
                            ? const SizedBox(
                                height: 40,
                                child: Center(
                                  child: SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: AppColors.primary),
                                  ),
                                ),
                              )
                            : DropdownButtonFormField<int>(
                                value: _ageTypeId,
                                isExpanded: true,
                                decoration: _dropdownDeco(),
                                items: _ageTypes
                                    .map((a) => DropdownMenuItem<int>(
                                          value: a['ageTypeId'] as int,
                                          child: Text(
                                            a['ageTypeName'] as String,
                                            style:
                                                const TextStyle(fontSize: 13),
                                          ),
                                        ))
                                    .toList(),
                                onChanged: (_patientMode == _PatientMode.self ||
                                        _patientMode == _PatientMode.existing)
                                    ? null
                                    : (v) => setState(() => _ageTypeId = v),
                                style: const TextStyle(
                                    fontSize: 13, color: AppColors.textDark),
                              ),
                        ),
                      ]),
                      const SizedBox(height: 12),
                      _FormLabel('Gender'),
                      DropdownButtonFormField<String>(
                        value: _gender,
                        hint: const Text('Select gender',
                            style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                        decoration: _dropdownDeco(),
                        items: _genderOptions
                            .map((g) => DropdownMenuItem(
                                  value: g,
                                  child: Text(g, style: const TextStyle(fontSize: 13)),
                                ))
                            .toList(),
                        onChanged: (_patientMode == _PatientMode.self ||
                                _patientMode == _PatientMode.existing)
                            ? null
                            : (v) => setState(() => _gender = v),
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 12),

                      // ── insurance toggle ───────────────────────────────────
                      _FormLabel('Do you have insurance?'),
                      Row(children: [
                        _RadioOption<bool>(
                          label: 'Yes',
                          value: true,
                          groupValue: _hasInsurance,
                          onChanged: (v) => setState(() {
                            _hasInsurance      = v!;
                          }),
                        ),
                        const SizedBox(width: 16),
                        _RadioOption<bool>(
                          label: 'No',
                          value: false,
                          groupValue: _hasInsurance,
                          onChanged: (v) => setState(() {
                            _hasInsurance      = v!;
                          }),
                        ),
                      ]),

                      // ── insurance details (new _InsuranceCard widget) ──────
                      if (_hasInsurance) ...[
                        const SizedBox(height: 10),
                        _InsuranceCard(
                          savedInsurances:           _savedInsurances,
                          selectedInsurance:         _selectedInsurance,
                          useExistingInsurance:      _useExistingInsurance,
                          saveNewInsurance:          _saveNewInsurance,
                          loadingInsurances:         _loadingInsurances,
                          providerCtrl:              _insProviderCtrl,
                          policyCtrl:                _insPolicyCtrl,
                          groupCtrl:                 _insGroupCtrl,
                          holderNameCtrl:            _insHolderNameCtrl,
                          holderAddrCtrl:            _insHolderAddrCtrl,
                          onToggleMode: (useExisting) => setState(() {
                            _useExistingInsurance = useExisting;
                            if (!useExisting) _clearInsuranceFields();
                          }),
                          onInsuranceSelected: (ins) => setState(() {
                            _selectedInsurance = ins;
                            _fillInsuranceFromSaved(ins);
                          }),
                          onSaveNewInsuranceChanged: (v) =>
                              setState(() => _saveNewInsurance = v),
                        ),
                      ],

                      // ── payment / card section (insurance = No) ────────────
                      if (!_hasInsurance) ...[
                        const SizedBox(height: 12),
                        _PaymentCard(
                          savedCards:      _savedCards,
                          selectedCard:    _selectedCard,
                          useExistingCard: _useExistingCard,
                          saveNewCard:     _saveNewCard,
                          loadingCards:    _loadingCards,
                          holderNameCtrl:  _cardHolderNameCtrl,
                          numberCtrl:      _cardNumberCtrl,
                          expiryCtrl:      _cardExpiryCtrl,
                          cvvCtrl:         _cardCvvCtrl,
                          onToggleMode: (useExisting) =>
                              setState(() => _useExistingCard = useExisting),
                          onCardSelected: (card) =>
                              setState(() => _selectedCard = card),
                          onSaveNewCardChanged: (v) =>
                              setState(() => _saveNewCard = v),
                        ),
                      ],

                      const SizedBox(height: 12),

                      // ── contact fields ─────────────────────────────────────
                      _FormLabel('Contact Number'),
                      _FormField(
                        controller: _contactCtrl,
                        hint: 'Enter patient contact',
                        keyboardType: TextInputType.phone,
                        readOnly: _patientMode == _PatientMode.self ||
                            _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Email Address'),
                      _FormField(
                        controller: _emailCtrl,
                        hint: 'Enter patient email address',
                        keyboardType: TextInputType.emailAddress,
                        readOnly: _patientMode == _PatientMode.self ||
                            _patientMode == _PatientMode.existing,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Dr. Visit Purpose'),
                      TextFormField(
                        controller: _visitPurposeCtrl,
                        maxLines: 3,
                        style:
                            const TextStyle(fontSize: 13, color: AppColors.textDark),
                        decoration: _inputDeco(
                            hint:
                                'Enter visit purpose/details, you may include symptoms'),
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Type Of Visit'),
                      DropdownButtonFormField<String>(
                        value: _visitType.isEmpty ? null : _visitType,
                        hint: const Text('Choose visit type',
                            style: TextStyle(
                                fontSize: 12, color: AppColors.textLight)),
                        decoration: _dropdownDeco(),
                        items: _visitTypes
                            .map((t) => DropdownMenuItem(
                                  value: t,
                                  child: Text(t,
                                      style: const TextStyle(fontSize: 13)),
                                ))
                            .toList(),
                        onChanged: (v) => setState(() => _visitType = v ?? ''),
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('OTP Verification'),
                      LayoutBuilder(
                        builder: (context, constraints) {
                          final isNarrow = constraints.maxWidth < 300;
                          final children = [
                            _RadioOption<String>(
                              label: 'Mobile Number',
                              value: 'mobile',
                              groupValue: _otpChannel,
                              onChanged: (v) => setState(() => _otpChannel = v!),
                            ),
                            SizedBox(width: isNarrow ? 0 : 16, height: isNarrow ? 4 : 0),
                            _RadioOption<String>(
                              label: 'Email Address',
                              value: 'email',
                              groupValue: _otpChannel,
                              onChanged: (v) => setState(() => _otpChannel = v!),
                            ),
                          ];
                          return isNarrow
                              ? Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: children,
                                )
                              : Row(children: children);
                        },
                      ),
                      const SizedBox(height: 20),

                      // ── action buttons ─────────────────────────────────────
                      Row(children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _submitting ? null : _submit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              disabledBackgroundColor:
                                  AppColors.primary.withOpacity(0.5),
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10)),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: _submitting
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white),
                                  )
                                : const Text('Confirm',
                                    style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 14)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _submitting ? null : _clearForm,
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.primary,
                              side: const BorderSide(color: AppColors.primary),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10)),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text('Clear',
                                style: TextStyle(
                                    fontWeight: FontWeight.w700, fontSize: 14)),
                          ),
                        ),
                      ]),
                    ],
                  ),
                ),
        ),
      ],
    );
  }

  // ── decoration helpers ─────────────────────────────────────────────────────
  InputDecoration _inputDeco(
          {required String hint, Widget? suffix, bool readOnly = false}) =>
      InputDecoration(
        hintText: hint,
        hintStyle:
            const TextStyle(fontSize: 12, color: AppColors.textLight),
        suffixIcon: suffix,
        filled: true,
        fillColor: readOnly ? AppColors.background : AppColors.cardBg,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.divider)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.divider)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.primary)),
      );

  InputDecoration _dropdownDeco() => InputDecoration(
        filled: true,
        fillColor: AppColors.cardBg,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.divider)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.divider)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.primary)),
      );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  _InsuranceCard  –  shown when insurance = Yes
// ═══════════════════════════════════════════════════════════════════════════════

class _InsuranceCard extends StatelessWidget {
  final List<SavedInsurance> savedInsurances;
  final SavedInsurance? selectedInsurance;
  final bool useExistingInsurance;
  final bool saveNewInsurance;
  final bool loadingInsurances;
  final TextEditingController providerCtrl;
  final TextEditingController policyCtrl;
  final TextEditingController groupCtrl;
  final TextEditingController holderNameCtrl;
  final TextEditingController holderAddrCtrl;
  final void Function(bool) onToggleMode;
  final void Function(SavedInsurance) onInsuranceSelected;
  final void Function(bool) onSaveNewInsuranceChanged;

  const _InsuranceCard({
    required this.savedInsurances,
    required this.selectedInsurance,
    required this.useExistingInsurance,
    required this.saveNewInsurance,
    required this.loadingInsurances,
    required this.providerCtrl,
    required this.policyCtrl,
    required this.groupCtrl,
    required this.holderNameCtrl,
    required this.holderAddrCtrl,
    required this.onToggleMode,
    required this.onInsuranceSelected,
    required this.onSaveNewInsuranceChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primary.withOpacity(0.25)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── header ─────────────────────────────────────────────────────────
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(14)),
            ),
            child: Row(children: [
              const Icon(Icons.health_and_safety_outlined,
                  size: 17, color: AppColors.primary),
              const SizedBox(width: 8),
              const Text(
                'Insurance Details',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary),
              ),
            ]),
          ),

          const SizedBox(height: 10),

          // ── mode toggle tabs ───────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(children: [
              _CardModeTab(
                icon: Icons.shield_outlined,
                label: 'Saved Insurance',
                selected: useExistingInsurance,
                disabled: loadingInsurances || savedInsurances.isEmpty,
                onTap: (loadingInsurances || savedInsurances.isEmpty)
                    ? null
                    : () => onToggleMode(true),
              ),
              const SizedBox(width: 8),
              _CardModeTab(
                icon: Icons.add_circle_outline,
                label: 'New Insurance',
                selected: !useExistingInsurance,
                onTap: () => onToggleMode(false),
              ),
            ]),
          ),

          const SizedBox(height: 10),

          // ── loading spinner ────────────────────────────────────────────────
          if (loadingInsurances)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 14),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 18),
                decoration: BoxDecoration(
                  color: const Color(0xFFF7F9FF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE8EEF8)),
                ),
                child: const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 22, height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: AppColors.primary,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Loading saved insurances…',
                        style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textGrey),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // ── existing insurance picker ──────────────────────────────────────
          if (!loadingInsurances && useExistingInsurance && savedInsurances.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Select a saved insurance',
                      style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textDark)),
                  const SizedBox(height: 6),
                  ...savedInsurances.map((ins) => _SavedInsuranceTile(
                        insurance: ins,
                        selected: selectedInsurance == ins,
                        onTap: () => onInsuranceSelected(ins),
                      )),
                ],
              ),
            ),

          // ── new insurance form ─────────────────────────────────────────────
          if (!useExistingInsurance)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SmallLabel('Provider Name'),
                  _CardField(
                    controller: providerCtrl,
                    hint: 'e.g. Star Health Insurance',
                    validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                  ),
                  const SizedBox(height: 10),
                  _SmallLabel('Insurance Policy ID'),
                  _CardField(
                    controller: policyCtrl,
                    hint: 'Enter policy ID',
                    validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                  ),
                  const SizedBox(height: 10),
                  _SmallLabel('Insurance Group ID'),
                  _CardField(
                    controller: groupCtrl,
                    hint: 'Enter group ID',
                  ),
                  const SizedBox(height: 10),
                  _SmallLabel('Primary Holder Name'),
                  _CardField(
                    controller: holderNameCtrl,
                    hint: 'Name of the primary policy holder',
                    validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                  ),
                  const SizedBox(height: 10),
                  _SmallLabel('Primary Holder Address'),
                  _CardField(
                    controller: holderAddrCtrl,
                    hint: 'Primary holder address',
                  ),
                  const SizedBox(height: 8),

                  // Save insurance checkbox
                  GestureDetector(
                    onTap: () => onSaveNewInsuranceChanged(!saveNewInsurance),
                    child: Row(children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: Checkbox(
                          value: saveNewInsurance,
                          onChanged: (v) =>
                              onSaveNewInsuranceChanged(v ?? false),
                          activeColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4)),
                          side: const BorderSide(
                              color: AppColors.divider, width: 1.5),
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Save insurance for future bookings',
                        style: TextStyle(
                            fontSize: 12, color: AppColors.textDark),
                      ),
                    ]),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

// ── saved insurance tile ────────────────────────────────────────────────────────
class _SavedInsuranceTile extends StatelessWidget {
  final SavedInsurance insurance;
  final bool selected;
  final VoidCallback onTap;

  const _SavedInsuranceTile({
    required this.insurance,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withOpacity(0.07)
              : AppColors.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.divider,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Row(children: [
          // provider badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(5),
            ),
            child: const Icon(Icons.shield_outlined,
                size: 14, color: AppColors.primary),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(insurance.providerName,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark)),
                const SizedBox(height: 2),
                Text(
                    'Policy: ${insurance.policyId}  •  Holder: ${insurance.primaryHolderName}',
                    style: const TextStyle(
                        fontSize: 11, color: AppColors.textLight)),
              ],
            ),
          ),
          if (selected)
            const Icon(Icons.check_circle, size: 18, color: AppColors.primary),
        ]),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  _PaymentCard  –  shown when insurance = No
// ═══════════════════════════════════════════════════════════════════════════════

class _PaymentCard extends StatelessWidget {
  final List<SavedCard> savedCards;
  final SavedCard? selectedCard;
  final bool useExistingCard;
  final bool saveNewCard;
  final bool loadingCards;
  final TextEditingController holderNameCtrl;
  final TextEditingController numberCtrl;
  final TextEditingController expiryCtrl;
  final TextEditingController cvvCtrl;
  final void Function(bool) onToggleMode;
  final void Function(SavedCard) onCardSelected;
  final void Function(bool) onSaveNewCardChanged;

  const _PaymentCard({
    required this.savedCards,
    required this.selectedCard,
    required this.useExistingCard,
    required this.saveNewCard,
    required this.loadingCards,
    required this.holderNameCtrl,
    required this.numberCtrl,
    required this.expiryCtrl,
    required this.cvvCtrl,
    required this.onToggleMode,
    required this.onCardSelected,
    required this.onSaveNewCardChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primary.withOpacity(0.25)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── header ────────────────────────────────────────────────────────
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(14)),
            ),
            child: Row(children: [
              const Icon(Icons.credit_card_outlined,
                  size: 17, color: AppColors.primary),
              const SizedBox(width: 8),
              const Text(
                'Payment Details',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary),
              ),
            ]),
          ),

          // ── "No amount deducted" banner ────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFE8F5E9),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFA5D6A7)),
              ),
              child: Row(children: [
                const Icon(Icons.lock_outline,
                    size: 14, color: Color(0xFF388E3C)),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'No amount will be deducted. Card details are used only for identity verification.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF2E7D32)),
                  ),
                ),
              ]),
            ),
          ),

          const SizedBox(height: 10),

          // ── mode toggle tabs ───────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(children: [
              _CardModeTab(
                icon: Icons.account_balance_wallet_outlined,
                label: 'Saved Card',
                selected: useExistingCard,
                disabled: loadingCards || savedCards.isEmpty,
                onTap: (loadingCards || savedCards.isEmpty)
                    ? null
                    : () => onToggleMode(true),
              ),
              const SizedBox(width: 8),
              _CardModeTab(
                icon: Icons.add_card_outlined,
                label: 'New Card',
                selected: !useExistingCard,
                onTap: () => onToggleMode(false),
              ),
            ]),
          ),

          const SizedBox(height: 10),

          // ── loading spinner ────────────────────────────────────────────────
          if (loadingCards)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 14),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 18),
                decoration: BoxDecoration(
                  color: const Color(0xFFF7F9FF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE8EEF8)),
                ),
                child: const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 22, height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          color: AppColors.primary,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Loading saved cards…',
                        style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textGrey),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // ── existing card picker ───────────────────────────────────────────
          if (!loadingCards && useExistingCard && savedCards.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Select a saved card',
                      style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textDark)),
                  const SizedBox(height: 6),
                  ...savedCards.map((card) => _SavedCardTile(
                        card: card,
                        selected: selectedCard == card,
                        onTap: () => onCardSelected(card),
                      )),
                ],
              ),
            ),

          // ── new card form ──────────────────────────────────────────────────
          if (!useExistingCard)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Card holder name
                  _SmallLabel('Card Holder Name'),
                  _CardField(
                    controller: holderNameCtrl,
                    hint: 'Name on card',
                    validator: (v) =>
                        v!.trim().isEmpty ? 'Required' : null,
                  ),
                  const SizedBox(height: 10),

                  // Card number
                  _SmallLabel('Card Number'),
                  TextFormField(
                    controller: numberCtrl,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      _CardNumberFormatter(),
                    ],
                    maxLength: 19, // 16 digits + 3 spaces
                    style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textDark,
                        letterSpacing: 2),
                    decoration: _cardDeco(
                      hint: '0000  0000  0000  0000',
                      suffix: Padding(
                        padding: const EdgeInsets.all(10),
                        child: _CardTypeIcon(number: numberCtrl.text),
                      ),
                      counterText: '',
                    ),
                    validator: (v) {
                      final raw = v!.replaceAll(' ', '');
                      if (raw.length < 13) return 'Enter a valid card number';
                      return null;
                    },
                  ),
                  const SizedBox(height: 10),

                  // Expiry + CVV
                  Row(children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _SmallLabel('Expiry Date'),
                          TextFormField(
                            controller: expiryCtrl,
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                              _ExpiryFormatter(),
                            ],
                            maxLength: 5,
                            style: const TextStyle(
                                fontSize: 13, color: AppColors.textDark),
                            decoration: _cardDeco(
                                hint: 'MM/YY', counterText: ''),
                            validator: (v) {
                              if (v == null || v.length < 5)
                                return 'Enter MM/YY';
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _SmallLabel('CVV'),
                          TextFormField(
                            controller: cvvCtrl,
                            keyboardType: TextInputType.number,
                            obscureText: true,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                            ],
                            maxLength: 4,
                            style: const TextStyle(
                                fontSize: 13, color: AppColors.textDark),
                            decoration:
                                _cardDeco(hint: '•••', counterText: ''),
                            validator: (v) {
                              if (v == null || v.length < 3)
                                return 'Enter CVV';
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ]),

                  const SizedBox(height: 8),

                  // Save card checkbox
                  GestureDetector(
                    onTap: () => onSaveNewCardChanged(!saveNewCard),
                    child: Row(children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: Checkbox(
                          value: saveNewCard,
                          onChanged: (v) =>
                              onSaveNewCardChanged(v ?? false),
                          activeColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4)),
                          side: const BorderSide(
                              color: AppColors.divider, width: 1.5),
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Save card for future bookings',
                        style: TextStyle(
                            fontSize: 12, color: AppColors.textDark),
                      ),
                    ]),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  static InputDecoration _cardDeco(
          {required String hint,
          Widget? suffix,
          String? counterText}) =>
      InputDecoration(
        hintText: hint,
        hintStyle:
            const TextStyle(fontSize: 12, color: AppColors.textLight),
        suffixIcon: suffix,
        counterText: counterText,
        filled: true,
        fillColor: AppColors.cardBg,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.divider)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.divider)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.primary)),
        errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.redAccent)),
        focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.redAccent)),
      );
}

// ── card-mode tab (Saved / New) ────────────────────────────────────────────────
class _CardModeTab extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final bool disabled;
  final VoidCallback? onTap;

  const _CardModeTab({
    required this.icon,
    required this.label,
    required this.selected,
    this.disabled = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color bg     = selected  ? AppColors.primary
                       : disabled  ? const Color(0xFFF5F5F5)
                       : AppColors.background;
    final Color border = selected  ? AppColors.primary
                       : disabled  ? const Color(0xFFE0E0E0)
                       : AppColors.divider;
    final Color fg     = selected  ? Colors.white
                       : disabled  ? const Color(0xFFBDBDBD)
                       : AppColors.textDark;

    return Expanded(
      child: GestureDetector(
        onTap: disabled ? null : onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(vertical: 9),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: border),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 16, color: fg),
              const SizedBox(width: 6),
              Text(label,
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: fg)),
            ],
          ),
        ),
      ),
    );
  }
}

// ── saved card tile ────────────────────────────────────────────────────────────
class _SavedCardTile extends StatelessWidget {
  final SavedCard card;
  final bool selected;
  final VoidCallback onTap;

  const _SavedCardTile({
    required this.card,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withOpacity(0.07)
              : AppColors.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.divider,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Row(children: [
          // card-type badge
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(5),
            ),
            child: Text(
              card.cardType,
              style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(card.holderName,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark)),
                const SizedBox(height: 2),
                Text('**** **** **** ${card.last4}  •  Exp: ${card.expiry}',
                    style: const TextStyle(
                        fontSize: 11, color: AppColors.textLight)),
              ],
            ),
          ),
          if (selected)
            const Icon(Icons.check_circle,
                size: 18, color: AppColors.primary),
        ]),
      ),
    );
  }
}

// ── tiny helpers ───────────────────────────────────────────────────────────────
class _SmallLabel extends StatelessWidget {
  final String text;
  const _SmallLabel(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Text(text,
            style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark)),
      );
}

class _CardField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final String? Function(String?)? validator;
  const _CardField(
      {required this.controller, required this.hint, this.validator});
  @override
  Widget build(BuildContext context) => TextFormField(
        controller: controller,
        validator: validator,
        style:
            const TextStyle(fontSize: 13, color: AppColors.textDark),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle:
              const TextStyle(fontSize: 12, color: AppColors.textLight),
          filled: true,
          fillColor: AppColors.cardBg,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.divider)),
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.divider)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary)),
          errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.redAccent)),
          focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.redAccent)),
        ),
      );
}

class _CardTypeIcon extends StatelessWidget {
  final String number;
  const _CardTypeIcon({required this.number});
  @override
  Widget build(BuildContext context) {
    final n = number.replaceAll(' ', '');
    IconData icon = Icons.credit_card;
    Color color   = AppColors.textLight;
    if (n.startsWith('4')) { icon = Icons.credit_card; color = const Color(0xFF1A1F71); }
    else if (n.startsWith('5')) { icon = Icons.credit_card; color = const Color(0xFFEB001B); }
    else if (n.startsWith('6')) { icon = Icons.credit_card; color = const Color(0xFF10893E); }
    return Icon(icon, size: 20, color: color);
  }
}

// ── input formatters ───────────────────────────────────────────────────────────
class _CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    final text = newValue.text.replaceAll(' ', '');
    final buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      if (i > 0 && i % 4 == 0) buffer.write(' ');
      buffer.write(text[i]);
    }
    final formatted = buffer.toString();
    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class _ExpiryFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    var text = newValue.text;
    if (text.length == 2 && !text.contains('/') && oldValue.text.length == 1) {
      text = '$text/';
    }
    return newValue.copyWith(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Existing widgets (unchanged from original)
// ═══════════════════════════════════════════════════════════════════════════════

class _PatientSelectorCard extends StatelessWidget {
  final _PatientMode mode;
  final List<SavedPatient> savedPatients;
  final SavedPatient? selectedExisting;
  final void Function(_PatientMode) onModeChanged;
  final void Function(SavedPatient) onExistingSelected;

  const _PatientSelectorCard({
    required this.mode,
    required this.savedPatients,
    required this.selectedExisting,
    required this.onModeChanged,
    required this.onExistingSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primary.withOpacity(0.25)),
        boxShadow: [
          BoxShadow(
              color: AppColors.primary.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 3)),
        ],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.07),
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(14)),
          ),
          child: Row(children: [
            const Icon(Icons.people_alt_outlined,
                size: 17, color: AppColors.primary),
            const SizedBox(width: 8),
            const Text('Who is this appointment for?',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary)),
          ]),
        ),

        // mode tiles
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(children: [
            _ModeTile(
              icon: Icons.person,
              label: 'Self',
              selected: mode == _PatientMode.self,
              onTap: () => onModeChanged(_PatientMode.self),
            ),
            const SizedBox(width: 8),
            _ModeTile(
              icon: Icons.group,
              label: 'Saved Patient',
              selected: mode == _PatientMode.existing,
              onTap: savedPatients.isEmpty
                  ? null
                  : () => onModeChanged(_PatientMode.existing),
              disabled: savedPatients.isEmpty,
            ),
            const SizedBox(width: 8),
            _ModeTile(
              icon: Icons.person_add_alt_1,
              label: 'New Patient',
              selected: mode == _PatientMode.newPatient,
              onTap: () => onModeChanged(_PatientMode.newPatient),
            ),
          ]),
        ),

        // self badge
        if (mode == _PatientMode.self)
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFE8F5E9),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFA5D6A7)),
              ),
              child: Row(children: [
                const Icon(Icons.check_circle,
                    size: 15, color: Color(0xFF388E3C)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Booking as ${ApiService.mockSelfProfile['firstName']} '
                    '${ApiService.mockSelfProfile['lastName']} — your details have been pre-filled.',
                    style: const TextStyle(
                        fontSize: 12, color: Color(0xFF2E7D32)),
                  ),
                ),
              ]),
            ),
          ),

        // existing patient dropdown
        if (mode == _PatientMode.existing)
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Select a saved patient',
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark)),
              const SizedBox(height: 6),
              DropdownButtonFormField<SavedPatient>(
                value: selectedExisting,
                hint: const Text('Choose patient',
                    style: TextStyle(
                        fontSize: 12, color: AppColors.textLight)),
                isExpanded: true,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AppColors.background,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.divider)),
                  enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.divider)),
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.primary)),
                ),
                items: savedPatients
                    .map((p) => DropdownMenuItem(
                          value: p,
                          child: Row(children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(p.relation,
                                  style: const TextStyle(
                                      fontSize: 10,
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w600)),
                            ),
                            const SizedBox(width: 8),
                            Text(p.fullName,
                                style: const TextStyle(
                                    fontSize: 13,
                                    color: AppColors.textDark)),
                          ]),
                        ))
                    .toList(),
                onChanged: (p) {
                  if (p != null) onExistingSelected(p);
                },
                style: const TextStyle(
                    fontSize: 13, color: AppColors.textDark),
              ),
              if (selectedExisting != null) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                        color: AppColors.primary.withOpacity(0.15)),
                  ),
                  child: Row(children: [
                    const Icon(Icons.check_circle,
                        size: 15, color: AppColors.primary),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '${selectedExisting!.fullName} (${selectedExisting!.relation}) — details filled.',
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.primary),
                      ),
                    ),
                  ]),
                ),
              ],
            ]),
          ),

        // new patient badge
        if (mode == _PatientMode.newPatient)
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF8E1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFFFCC80)),
              ),
              child: Row(children: [
                const Icon(Icons.info_outline,
                    size: 15, color: Color(0xFFE65100)),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'This patient will be saved for future bookings.',
                    style: TextStyle(fontSize: 12, color: Color(0xFFE65100)),
                  ),
                ),
              ]),
            ),
          ),
      ]),
    );
  }
}

class _ModeTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  final bool disabled;

  const _ModeTile({
    required this.icon,
    required this.label,
    required this.selected,
    this.onTap,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final Color bg     = selected ? AppColors.primary
                       : disabled ? const Color(0xFFF5F5F5)
                       : AppColors.background;
    final Color border = selected ? AppColors.primary
                       : disabled ? const Color(0xFFE0E0E0)
                       : AppColors.divider;
    final Color fg     = selected ? Colors.white
                       : disabled ? const Color(0xFFBDBDBD)
                       : AppColors.textDark;

    final screenW = MediaQuery.of(context).size.width;
    final isNarrow = screenW < 360;

    // Shorten label on very narrow phones
    String displayLabel = label;
    if (isNarrow) {
      if (label == 'Saved Patient') displayLabel = 'Saved';
      if (label == 'New Patient') displayLabel = 'New';
    }

    return Expanded(
      child: GestureDetector(
        onTap: disabled ? null : onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: EdgeInsets.symmetric(vertical: isNarrow ? 8 : 10),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: border),
          ),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, size: isNarrow ? 18 : 20, color: fg),
            SizedBox(height: isNarrow ? 3 : 4),
            Text(displayLabel,
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: isNarrow ? 10 : 11,
                    fontWeight: FontWeight.w700,
                    color: fg)),
          ]),
        ),
      ),
    );
  }
}

class _FormLabel extends StatelessWidget {
  final String text;
  const _FormLabel(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Text(text,
            style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark)),
      );
}

class _FormField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final bool readOnly;

  const _FormField({
    required this.controller,
    required this.hint,
    this.keyboardType,
    this.validator,
    this.readOnly = false,
  });

  @override
  Widget build(BuildContext context) => TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        validator: validator,
        readOnly: readOnly,
        style: TextStyle(
            fontSize: 13,
            color: readOnly ? AppColors.textGrey : AppColors.textDark),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle:
              const TextStyle(fontSize: 12, color: AppColors.textLight),
          filled: true,
          fillColor: readOnly ? AppColors.background : AppColors.cardBg,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.divider)),
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.divider)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary)),
          errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.redAccent)),
          focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.redAccent)),
        ),
      );
}

class _RadioOption<T> extends StatelessWidget {
  final String label;
  final T value;
  final T groupValue;
  final ValueChanged<T?>? onChanged;

  const _RadioOption({
    required this.label,
    required this.value,
    required this.groupValue,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) =>
      Row(mainAxisSize: MainAxisSize.min, children: [
        SizedBox(
          width: 20,
          height: 20,
          child: Radio<T>(
            value: value,
            groupValue: groupValue,
            onChanged: onChanged,
            activeColor: AppColors.primary,
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
        ),
        const SizedBox(width: 4),
        Text(label,
            style: TextStyle(
                fontSize: 13,
                color: onChanged == null
                    ? AppColors.textLight
                    : AppColors.textDark)),
      ]);
}