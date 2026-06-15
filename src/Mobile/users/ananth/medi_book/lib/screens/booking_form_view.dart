// TODO Implement this library.import 'package:flutter/material.dart';

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import '../models/saved_patient.dart';
import '../services/api_service.dart';
import 'otp_verification_view.dart';

/// Who are we booking for?
enum _PatientMode { self, existing, newPatient }

class BookingFormView extends StatefulWidget {
  final Doctor doctor;
  final DoctorAvailability slot;
  final String selectedTime;
  final VoidCallback onBack;
  final VoidCallback onFullComplete;

  const BookingFormView({
    super.key,
    required this.doctor, required this.slot, required this.selectedTime,
    required this.onBack, required this.onFullComplete,
  });

  @override
  State<BookingFormView> createState() => _BookingFormViewState();
}

class _BookingFormViewState extends State<BookingFormView> {
  final _formKey = GlobalKey<FormState>();

  // ── form controllers ──────────────────────────────────────────────────────
  final _firstNameCtrl      = TextEditingController();
  final _lastNameCtrl       = TextEditingController();
  final _dobCtrl            = TextEditingController();
  final _ageCtrl            = TextEditingController();
  final _patientAddressCtrl = TextEditingController();
  final _contactCtrl        = TextEditingController();
  final _emailCtrl          = TextEditingController();
  final _visitPurposeCtrl   = TextEditingController();
  final _insProviderCtrl    = TextEditingController();
  final _insPolicyCtrl      = TextEditingController();
  final _insGroupCtrl       = TextEditingController();
  final _insHolderNameCtrl  = TextEditingController();
  final _insHolderAddrCtrl  = TextEditingController();

  // patient-selector state
  _PatientMode _patientMode   = _PatientMode.self;
  bool _loadingPatients       = true;
  List<SavedPatient> _savedPatients = [];
  SavedPatient? _selectedExisting;

  // "new patient" relation field
  String? _newPatientRelation;
  static const List<String> _relationOptions = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Other',
  ];

  //  rest of form state
  String  _ageUnit           = 'years';
  String? _gender;
  bool    _hasInsurance      = false;
  bool    _insuranceExpanded = false;
  String  _visitType         = '';
  String  _otpChannel        = 'mobile';
  bool    _submitting        = false;

  Map<String, dynamic>? _bookingResponse;

  final List<String> _genderOptions = ['Male', 'Female', 'Other'];
  final List<String> _visitTypes = [
    'Consultation', 'Follow-up', 'Emergency', 'Routine Check-up', 'Lab / Diagnostics', 'Other',
  ];

  @override
  void initState() {
    super.initState();
    _loadSavedPatients();
  }

  //  load saved patients + self data
  Future<void> _loadSavedPatients() async {
    final result = await ApiService.fetchSavedPatients();
    if (!mounted) return;
    setState(() {
      _savedPatients = result;
      _loadingPatients = false;
    });
    // Auto-fill "Self" on first load
    _applyPatientMode(_PatientMode.self);
  }

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
    _firstNameCtrl.text       = self['firstName']     ?? '';
    _lastNameCtrl.text        = self['lastName']      ?? '';
    _dobCtrl.text             = self['dateOfBirth']   ?? '';
    _ageCtrl.text             = self['age']           ?? '';
    _patientAddressCtrl.text  = self['address']       ?? '';
    _contactCtrl.text         = self['contactNumber'] ?? '';
    _emailCtrl.text           = self['emailAddress']  ?? '';
    setState(() {
      _gender  = self['gender'];
      _ageUnit = self['ageUnit'] ?? 'years';
    });
  }

  void _fillFromSaved(SavedPatient p) {
    _firstNameCtrl.text       = p.firstName;
    _lastNameCtrl.text        = p.lastName;
    _dobCtrl.text             = p.dateOfBirth;
    _ageCtrl.text             = p.age;
    _patientAddressCtrl.text  = p.address;
    _contactCtrl.text         = p.contactNumber;
    _emailCtrl.text           = p.emailAddress;
    setState(() {
      _gender  = p.gender.isEmpty ? null : p.gender;
      _ageUnit = p.ageUnit;
    });
  }

  void _clearFormFields() {
    _firstNameCtrl.clear();
    _lastNameCtrl.clear();
    _dobCtrl.clear();
    _ageCtrl.clear();
    _patientAddressCtrl.clear();
    _contactCtrl.clear();
    _emailCtrl.clear();
    setState(() {
      _gender  = null;
      _ageUnit = 'years';
    });
  }

  @override
  void dispose() {
    for (final c in [
      _firstNameCtrl, _lastNameCtrl, _dobCtrl, _ageCtrl,
      _patientAddressCtrl, _contactCtrl, _emailCtrl, _visitPurposeCtrl,
      _insProviderCtrl, _insPolicyCtrl, _insGroupCtrl, _insHolderNameCtrl, _insHolderAddrCtrl,
    ]) { c.dispose(); }
    super.dispose();
  }

  Future<void> _pickDob() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000), firstDate: DateTime(1900), lastDate: DateTime.now(),
      builder: (ctx, child) => Theme(
        data: ThemeData.light().copyWith(colorScheme: const ColorScheme.light(primary: AppColors.primary)),
        child: child!,
      ),
    );
    if (picked != null) {
      _dobCtrl.text = '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
    }
  }

  void _clearForm() {
    _formKey.currentState?.reset();
    _clearFormFields();
    setState(() {
      _hasInsurance = false; _insuranceExpanded = false;
      _visitType = ''; _otpChannel = 'mobile';
      _newPatientRelation = null;
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);

    if (_patientMode == _PatientMode.newPatient) {
      final newPatient = SavedPatient(
        id: 'PAT-${DateTime.now().millisecondsSinceEpoch}',
        firstName: _firstNameCtrl.text.trim(),
        lastName: _lastNameCtrl.text.trim(),
        dateOfBirth: _dobCtrl.text.trim(),
        age: _ageCtrl.text.trim(),
        ageUnit: _ageUnit,
        gender: _gender ?? '',
        address: _patientAddressCtrl.text.trim(),
        contactNumber: _contactCtrl.text.trim(),
        emailAddress: _emailCtrl.text.trim(),
        relation: _newPatientRelation ?? 'Other',
      );
      await ApiService.saveNewPatient(newPatient);
    }

    final result = await ApiService.bookAppointment(
      bookingData: {
        'doctorName':  widget.doctor.name,
        'date':        widget.slot.date,
        'dayName':     widget.slot.dayName,
        'time':        widget.selectedTime,
        'department':  widget.doctor.department,
        'firstName':   _firstNameCtrl.text.trim(),
        'lastName':    _lastNameCtrl.text.trim(),
        'dateOfBirth': _dobCtrl.text.trim(),
        'age':         _ageCtrl.text.trim(),
        'ageUnit':     _ageUnit,
        'gender':      _gender ?? '',
        'hasInsurance':                   _hasInsurance,
        'insuranceProviderName':          _insProviderCtrl.text.trim(),
        'insurancePolicyId':              _insPolicyCtrl.text.trim(),
        'insuranceGroupId':               _insGroupCtrl.text.trim(),
        'insurancePrimaryHolderName':     _insHolderNameCtrl.text.trim(),
        'insurancePrimaryHolderAddress':  _insHolderAddrCtrl.text.trim(),
        'patientAddress':  _patientAddressCtrl.text.trim(),
        'contactNumber':   _contactCtrl.text.trim(),
        'emailAddress':    _emailCtrl.text.trim(),
        'visitPurpose':    _visitPurposeCtrl.text.trim(),
        'visitType':       _visitType,
        'otpChannel':      _otpChannel,
        'patientMode':     _patientMode.name,
        'relation':        _patientMode == _PatientMode.newPatient
                               ? (_newPatientRelation ?? 'Other')
                               : _patientMode == _PatientMode.self
                                   ? 'Self'
                                   : (_selectedExisting?.relation ?? ''),
      },
    );

    if (!mounted) return;
    setState(() => _submitting = false);

    if (result['success'] == true) {
      setState(() => _bookingResponse = result);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(result['message'] as String? ?? 'Booking failed.'),
        backgroundColor: Colors.redAccent, behavior: SnackBarBehavior.floating,
      ));
    }
  }

  String get _patientFullName => '${_firstNameCtrl.text.trim()} ${_lastNameCtrl.text.trim()}';



  @override
  Widget build(BuildContext context) {
    if (_bookingResponse != null) {
      return OtpVerificationView(
        doctor: widget.doctor,
        slot: widget.slot,
        selectedTime: widget.selectedTime,
        patientName: _patientFullName,
        maskedContact: _bookingResponse!['maskedContact'] as String? ?? '',
        appointmentId: _bookingResponse!['appointmentId'] as String? ?? '',
        otpChannel: _bookingResponse!['otpChannel'] as String? ?? 'mobile',
        onCancel: () => setState(() => _bookingResponse = null),
        onFullComplete: widget.onFullComplete,
      );
    }

    return Column(
      children: [
     
     
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 14, 16, 0),
          child: Row(children: [
            IconButton(
              onPressed: widget.onBack,
              icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.primary),
              padding: EdgeInsets.zero, constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.person_outline, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            const Text('Patient Information',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textDark)),
          ]),
        ),
   
   
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.06), borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: Row(children: [
              const Icon(Icons.info_outline, size: 14, color: AppColors.primary),
              const SizedBox(width: 8),
              Expanded(child: Text(
                '${widget.doctor.name}  •  ${widget.slot.date}  •  ${widget.selectedTime}',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary),
              )),
            ]),
          ),
        ),
        Expanded(
          child: _loadingPatients
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : Form(
                  key: _formKey,
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 20),
                    children: [


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

                   
                   
                      if (_patientMode == _PatientMode.newPatient) ...[
                        _FormLabel('Relation with Account Holder'),
                        DropdownButtonFormField<String>(
                          value: _newPatientRelation,
                          hint: const Text('Select relation', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                          decoration: _dropdownDeco(),
                          validator: (v) => (v == null || v.isEmpty) ? 'Please select a relation' : null,
                          items: _relationOptions
                              .map((r) => DropdownMenuItem(value: r, child: Text(r, style: const TextStyle(fontSize: 13))))
                              .toList(),
                          onChanged: (v) => setState(() => _newPatientRelation = v),
                          style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                        ),
                        const SizedBox(height: 12),
                      ],

                 
                 
                      _FormLabel('First Name'),
                      _FormField(
                        controller: _firstNameCtrl,
                        hint: 'Enter patient first name',
                        readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Last Name'),
                      _FormField(
                        controller: _lastNameCtrl,
                        hint: 'Enter patient last name',
                        readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Date Of Birth'),
                      TextFormField(
                        controller: _dobCtrl,
                        readOnly: true,
                        onTap: (_patientMode == _PatientMode.self || _patientMode == _PatientMode.existing) ? null : _pickDob,
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                        decoration: _inputDeco(
                          hint: 'dd/mm/yyyy',
                          suffix: const Icon(Icons.calendar_today, size: 16, color: AppColors.primary),
                          readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Age'),
                      Row(children: [
                        Expanded(
                          flex: 2,
                          child: _FormField(
                            controller: _ageCtrl,
                            hint: 'Age',
                            keyboardType: TextInputType.number,
                            readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                          ),
                        ),
                        const SizedBox(width: 12),
                        _RadioOption<String>(label: 'Year(s)', value: 'years', groupValue: _ageUnit, onChanged: _patientMode == _PatientMode.newPatient ? (v) => setState(() => _ageUnit = v!) : null),
                        const SizedBox(width: 8),
                        _RadioOption<String>(label: 'Month(s)', value: 'months', groupValue: _ageUnit, onChanged: _patientMode == _PatientMode.newPatient ? (v) => setState(() => _ageUnit = v!) : null),
                      ]),
                      const SizedBox(height: 12),
                      _FormLabel('Gender'),
                      DropdownButtonFormField<String>(
                        value: _gender,
                        hint: const Text('Select gender', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                        decoration: _dropdownDeco(),
                        items: _genderOptions.map((g) => DropdownMenuItem(value: g, child: Text(g, style: const TextStyle(fontSize: 13)))).toList(),
                        onChanged: (_patientMode == _PatientMode.self || _patientMode == _PatientMode.existing) ? null : (v) => setState(() => _gender = v),
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 12),

               
               
                      _FormLabel('Do you have insurance?'),
                      Row(children: [
                        _RadioOption<bool>(label: 'Yes', value: true, groupValue: _hasInsurance,
                            onChanged: (v) => setState(() { _hasInsurance = v!; if (_hasInsurance) _insuranceExpanded = true; })),
                        const SizedBox(width: 16),
                        _RadioOption<bool>(label: 'No', value: false, groupValue: _hasInsurance,
                            onChanged: (v) => setState(() { _hasInsurance = v!; _insuranceExpanded = false; })),
                      ]),
                      if (_hasInsurance) ...[
                        const SizedBox(height: 10),
                        Container(
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.04), borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                          ),
                          child: Column(children: [
                            InkWell(
                              onTap: () => setState(() => _insuranceExpanded = !_insuranceExpanded),
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                child: Row(children: [
                                  const Icon(Icons.health_and_safety_outlined, size: 16, color: AppColors.primary),
                                  const SizedBox(width: 8),
                                  const Text('Insurance Details', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
                                  const Spacer(),
                                  Icon(_insuranceExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, size: 20, color: AppColors.primary),
                                ]),
                              ),
                            ),
                            if (_insuranceExpanded)
                              Padding(
                                padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
                                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                  _FormLabel('Provider Name'), _FormField(controller: _insProviderCtrl, hint: 'Enter provider name'), const SizedBox(height: 10),
                                  _FormLabel('Insurance Policy ID'), _FormField(controller: _insPolicyCtrl, hint: 'Enter policy ID'), const SizedBox(height: 10),
                                  _FormLabel('Insurance Group ID'), _FormField(controller: _insGroupCtrl, hint: 'Enter group ID'), const SizedBox(height: 10),
                                  _FormLabel('Primary Holder Name'), _FormField(controller: _insHolderNameCtrl, hint: 'Enter primary holder name'), const SizedBox(height: 10),
                                  _FormLabel('Primary Holder Address'), _FormField(controller: _insHolderAddrCtrl, hint: 'Enter primary holder address'),
                                ]),
                              ),
                          ]),
                        ),
                      ],
                      const SizedBox(height: 12),

                      _FormLabel('Patient Address'),
                      _FormField(
                        controller: _patientAddressCtrl,
                        hint: 'Enter patient address',
                        readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Contact Number'),
                      _FormField(
                        controller: _contactCtrl,
                        hint: 'Enter patient contact',
                        keyboardType: TextInputType.phone,
                        readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                        validator: (v) => v!.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Email Address'),
                      _FormField(
                        controller: _emailCtrl,
                        hint: 'Enter patient email address',
                        keyboardType: TextInputType.emailAddress,
                        readOnly: _patientMode == _PatientMode.self || _patientMode == _PatientMode.existing,
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Dr. Visit Purpose'),
                      TextFormField(
                        controller: _visitPurposeCtrl, maxLines: 3,
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                        decoration: _inputDeco(hint: 'Enter visit purpose/details, you may include symptoms'),
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('Type Of Visit'),
                      DropdownButtonFormField<String>(
                        value: _visitType.isEmpty ? null : _visitType,
                        hint: const Text('Choose visit type', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                        decoration: _dropdownDeco(),
                        items: _visitTypes.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 13)))).toList(),
                        onChanged: (v) => setState(() => _visitType = v ?? ''),
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 12),
                      _FormLabel('OTP Verification'),
                      Row(children: [
                        _RadioOption<String>(label: 'Mobile Number', value: 'mobile', groupValue: _otpChannel, onChanged: (v) => setState(() => _otpChannel = v!)),
                        const SizedBox(width: 16),
                        _RadioOption<String>(label: 'Email Address', value: 'email', groupValue: _otpChannel, onChanged: (v) => setState(() => _otpChannel = v!)),
                      ]),
                      const SizedBox(height: 20),
                      Row(children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _submitting ? null : _submit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary, disabledBackgroundColor: AppColors.primary.withOpacity(0.5),
                              foregroundColor: Colors.white, elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: _submitting
                                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Text('Confirm', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _submitting ? null : _clearForm,
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.primary, side: const BorderSide(color: AppColors.primary),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text('Clear', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
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

  InputDecoration _inputDeco({required String hint, Widget? suffix, bool readOnly = false}) => InputDecoration(
    hintText: hint, hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
    suffixIcon: suffix, filled: true,
    fillColor: readOnly ? AppColors.background : AppColors.cardBg,
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
  );

  InputDecoration _dropdownDeco() => InputDecoration(
    filled: true, fillColor: AppColors.cardBg,
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
  );
}




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
        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 3))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
            ),
            child: Row(children: [
              const Icon(Icons.people_alt_outlined, size: 17, color: AppColors.primary),
              const SizedBox(width: 8),
              const Text('Who is this appointment for?',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
            ]),
          ),


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
                onTap: savedPatients.isEmpty ? null : () => onModeChanged(_PatientMode.existing),
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


          if (mode == _PatientMode.self)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFA5D6A7)),
                ),
                child: Row(children: [
                  const Icon(Icons.check_circle, size: 15, color: Color(0xFF388E3C)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Booking as ${ApiService.mockSelfProfile['firstName']} ${ApiService.mockSelfProfile['lastName']} — your details have been pre-filled.',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF2E7D32)),
                    ),
                  ),
                ]),
              ),
            ),


          if (mode == _PatientMode.existing)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Select a saved patient', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
                const SizedBox(height: 6),
                DropdownButtonFormField<SavedPatient>(
                  value: selectedExisting,
                  hint: const Text('Choose patient', style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                  isExpanded: true,
                  decoration: InputDecoration(
                    filled: true, fillColor: AppColors.background,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
                  ),
                  items: savedPatients.map((p) => DropdownMenuItem(
                    value: p,
                    child: Row(children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(p.relation, style: const TextStyle(fontSize: 10, color: AppColors.primary, fontWeight: FontWeight.w600)),
                      ),
                      const SizedBox(width: 8),
                      Text(p.fullName, style: const TextStyle(fontSize: 13, color: AppColors.textDark)),
                    ]),
                  )).toList(),
                  onChanged: (p) { if (p != null) onExistingSelected(p); },
                  style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                ),
                if (selectedExisting != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.primary.withOpacity(0.15)),
                    ),
                    child: Row(children: [
                      const Icon(Icons.check_circle, size: 15, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Expanded(child: Text(
                        '${selectedExisting!.fullName} (${selectedExisting!.relation}) — details filled.',
                        style: const TextStyle(fontSize: 12, color: AppColors.primary),
                      )),
                    ]),
                  ),
                ],
              ]),
            ),


          if (mode == _PatientMode.newPatient)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF8E1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFFFCC80)),
                ),
                child: Row(children: [
                  const Icon(Icons.info_outline, size: 15, color: Color(0xFFE65100)),
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
        ],
      ),
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
    final Color bg     = selected ? AppColors.primary : disabled ? const Color(0xFFF5F5F5) : AppColors.background;
    final Color border = selected ? AppColors.primary : disabled ? const Color(0xFFE0E0E0) : AppColors.divider;
    final Color fg     = selected ? Colors.white : disabled ? const Color(0xFFBDBDBD) : AppColors.textDark;

    return Expanded(
      child: GestureDetector(
        onTap: disabled ? null : onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: bg, borderRadius: BorderRadius.circular(10),
            border: Border.all(color: border),
          ),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, size: 20, color: fg),
            const SizedBox(height: 4),
            Text(label, textAlign: TextAlign.center,
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: fg)),
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
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Text(text, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
    );
  }
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
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      readOnly: readOnly,
      style: TextStyle(fontSize: 13, color: readOnly ? AppColors.textGrey : AppColors.textDark),
      decoration: InputDecoration(
        hintText: hint, hintStyle: const TextStyle(fontSize: 12, color: AppColors.textLight),
        filled: true, fillColor: readOnly ? AppColors.background : AppColors.cardBg,
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.divider)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primary)),
        errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Colors.redAccent)),
        focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Colors.redAccent)),
      ),
    );
  }
}

class _RadioOption<T> extends StatelessWidget {
  final String label;
  final T value;
  final T groupValue;
  final ValueChanged<T?>? onChanged;

  const _RadioOption({required this.label, required this.value, required this.groupValue, this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(mainAxisSize: MainAxisSize.min, children: [
      SizedBox(
        width: 20, height: 20,
        child: Radio<T>(
          value: value, groupValue: groupValue, onChanged: onChanged,
          activeColor: AppColors.primary, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        ),
      ),
      const SizedBox(width: 4),
      Text(label, style: TextStyle(fontSize: 13, color: onChanged == null ? AppColors.textLight : AppColors.textDark)),
    ]);
  }
}