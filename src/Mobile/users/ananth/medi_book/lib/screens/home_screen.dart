
import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../services/api_service.dart';
// Hospital type is defined inside api_service.dart and is used by the switch dialog.
import 'appointments_tab.dart';
import 'specialities_tab.dart';
import 'medicine_orders_tab.dart';
import 'lab_results_tab.dart';
import 'billing_tab.dart';
import 'login_screen.dart';
import 'messages_tab.dart';

// ─────────────────────────────────────────────────────────────────────────────
//  Nav-tab definition (bottom bar)
// ─────────────────────────────────────────────────────────────────────────────
class _NavTab {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  const _NavTab(this.icon, this.activeIcon, this.label);
}

const List<_NavTab> _navTabs = [
  _NavTab(Icons.calendar_today_outlined, Icons.calendar_today, 'Appointments'),
  _NavTab(Icons.local_hospital_outlined, Icons.local_hospital, 'Specialities'),
  _NavTab(Icons.medication_outlined, Icons.medication, 'Prescriptions'),
  _NavTab(Icons.biotech_outlined, Icons.biotech, 'Lab Results'),
  _NavTab(Icons.receipt_long_outlined, Icons.receipt_long, 'Billing'),
];

// ─────────────────────────────────────────────────────────────────────────────
//  HomeScreen
// ─────────────────────────────────────────────────────────────────────────────
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 0;

  // Initialized directly so it's always set before build() is ever called.
  Hospital _currentHospital = ApiService.currentHospital;

  @override
  void initState() {
    super.initState();
    _pages = [
      const AppointmentsTab(),
      const SpecialitiesTab(),
      const MedicineOrdersTab(),
      const LabResultsTab(),
      const BillingTab(),
      const MessagesTab(),
    ];
    // Fetch real org list to populate hospital logo in the header
    _syncHospitalLogo();
    // Wire up auto-logout: navigate to LoginScreen when the JWT expires
    ApiService.onTokenExpired = _handleTokenExpired;
  }

  @override
  void dispose() {
    // Clear the callback to avoid calling setState after dispose
    if (ApiService.onTokenExpired == _handleTokenExpired) {
      ApiService.onTokenExpired = null;
    }
    super.dispose();
  }

  void _handleTokenExpired() {
    if (!mounted) return;
    ApiService.clearSession();
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (r) => false,
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Your session has expired. Please log in again.'),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  /// Fetches the organisation list and enriches [_currentHospital] with its
  /// logo image URL. Never changes which hospital is active.
  Future<void> _syncHospitalLogo() async {
    try {
      final hospitals = await ApiService.fetchHospitals();
      if (!mounted || hospitals.isEmpty) return;

      // Match by real ID (set correctly from login's activeHospitalId)
      final activeId = ApiService.currentHospital.id;
      Hospital? matched;
      for (final h in hospitals) {
        if (h.id == activeId) {
          matched = h;
          break;
        }
      }

      if (matched == null) return; // Don't override if no match

      // Only enrich: preserve the same id/name, just add the imageUrl
      final enriched = Hospital(
        id:        matched.id,
        name:      ApiService.currentHospital.name.isNotEmpty
                       ? ApiService.currentHospital.name
                       : matched.name,
        location:  matched.location,
        imageUrl:  matched.imageUrl,
        logoPath:  matched.logoPath,
      );
      ApiService.currentHospital = enriched;
      if (mounted) setState(() => _currentHospital = enriched);
    } catch (_) {
      // Ignore: header will fall back to hospital.png
    }
  }


  void _onHospitalSwitch(Hospital h) {
    setState(() => _currentHospital = h);
  }

  // ── helpers ──────────────────────────────────────────────────────────────
  String _formattedDate() {
    final now = DateTime.now();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const days = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday', 'Sunday'
    ];
    return '${months[now.month - 1]} ${now.day}${_suffix(now.day)} '
        '${now.year} | ${days[now.weekday - 1]}';
  }

  String _suffix(int d) {
    if (d >= 11 && d <= 13) return 'th';
    switch (d % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  }

  String get _patientFirstName {
    final p = ApiService.currentPatient;
    final name = (p?['firstName'] as String? ?? '').trim();
    return name.isNotEmpty ? name : 'User';
  }

  String get _patientFullName {
    final p = ApiService.currentPatient;
    if (p == null) return 'User Name';
    final name = '${p['firstName'] ?? ''} ${p['lastName'] ?? ''}'.trim();
    return name.isNotEmpty ? name : 'User Name';
  }

  String get _patientInitials {
    final p = ApiService.currentPatient;
    final first = (p?['firstName'] as String? ?? '').trim();
    final last  = (p?['lastName']  as String? ?? '').trim();
    final fi = first.isNotEmpty ? first[0].toUpperCase() : '';
    final li = last.isNotEmpty  ? last[0].toUpperCase()  : '';
    return '$fi$li'.isNotEmpty ? '$fi$li' : 'U';
  }

  // Pre-built and cached — never recreated on setState, which would cause
  // Duplicate GlobalKeys when a dialog/sheet route is still open over the old instance.
  late final List<Widget> _pages;

  Widget _buildContent() => _pages[_selectedIndex.clamp(0, _pages.length - 1)];


  // ── Profile bottom sheet ─────────────────────────────────────────────────
  void _showProfileSheet() {
    final p = ApiService.currentPatient;
    final profile = ApiService.selfProfile;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _ProfileSheet(
        fullName:   _patientFullName,
        initials:   _patientInitials,
        email:      profile['emailAddress'] ?? '',
        phone:      profile['contactNumber'] ?? '',
        gender:     profile['gender'] ?? '',
        dob:        profile['dateOfBirth'] ?? '',
        address:    profile['address'] ?? '',
        username:   p?['username'] as String? ?? '',
      ),
    );
  }

  // ── Navigate to Messages tab on notification icon tap ────────────────────
  void _goToMessages() {
    setState(() => _selectedIndex = 5);
  }

  // ── Hospital switch dialog ───────────────────────────────────────────────
  void _showHospitalSwitchDialog() {
    showDialog(
      context: context,
      barrierColor: Colors.black54,
      builder: (_) => _HospitalSwitchDialog(
        currentHospitalId: _currentHospital.id,
        onSwitch: _onHospitalSwitch,
      ),
    );
  }

  // ── Settings bottom sheet ────────────────────────────────────────────────
  void _showSettingsSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _SettingsSheet(
        onTabSelect: (i) {
          Navigator.pop(ctx);
          setState(() => _selectedIndex = i);
        },
        selectedIndex: _selectedIndex,
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final blueHeight = constraints.maxHeight * 0.16; // blue block only
            return Column(
              children: [
                // ── Blue gradient header (16% of screen) ─────────────────
                SizedBox(
                  height: blueHeight,
                  child: ClipRect(child: _buildBlueHeader(blueHeight)),
                ),
                // ── Muted sub-header strip (activity + date) ─────────────
                _buildSubStrip(),
                // ── Tab content (gets all space above the nav bar) ────────
                Expanded(
                  child: _buildContent(),
                ),
                // ── Bottom nav bar (always below content, never overlapping) ─
                _buildBottomNav(),

              ],
            );
          },
        ),
      ),
    );
  }

  // ── Blue gradient header block ──────────────────────────────────────────────
  Widget _buildBlueHeader(double h) {
    final vPad = (h * 0.08).clamp(6.0, 14.0);
    final hFont = (h * 0.22).clamp(13.0, 20.0);

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Color(0xFF2B59D2),
      ),
      padding: EdgeInsets.fromLTRB(14, vPad, 12, vPad),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Row 1: brand (logo image)  |  icons ──────────────────────
          Row(
            children: [
              // SkyMaxValue logo image
              Image.asset(
                'assets/images/skylogo2.png',
                width: 22,
                height: 22,
                fit: BoxFit.contain,
              ),
              const SizedBox(width: 7),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('SkyMaxValue',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.2)),
                    Text('Technology Solutions',
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 7.5)),
                  ],
                ),
              ),
              _TopBarIcon(
                icon: Icons.notifications_outlined,
                badge: true,
                onTap: _goToMessages,
              ),
              const SizedBox(width: 4),
              GestureDetector(
                onTap: _showProfileSheet,
                child: Container(
                  width: 26, height: 26,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF4A90D9),
                  ),
                  child: const Icon(Icons.person, color: Colors.white, size: 16),
                ),
              ),
              const SizedBox(width: 4),
              _TopBarIcon(
                icon: Icons.settings_outlined,
                onTap: _showSettingsSheet,
              ),
            ],
          ),

          SizedBox(height: (h * 0.06).clamp(4.0, 10.0)),

              // ── Row 2: Hospital logo + name  |  Switch button ───────────
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Hospital logo image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: _currentHospital.imageUrl.isNotEmpty
                        ? Image.network(
                            _currentHospital.imageUrl,
                            width: 36,
                            height: 36,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Image.asset(
                              'assets/images/hospital.png',
                              width: 36,
                              height: 36,
                              fit: BoxFit.cover,
                            ),
                          )
                        : Image.asset(
                            'assets/images/hospital.png',
                            width: 36,
                            height: 36,
                            fit: BoxFit.cover,
                          ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _currentHospital.name.toUpperCase(),
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: (hFont - 1.5).clamp(11.0, 18.5),
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.3,
                            height: 1.15,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Switch button
                  GestureDetector(
                    onTap: _showHospitalSwitchDialog,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.18),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: Colors.white.withOpacity(0.4), width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.sync_rounded,
                              color: Colors.white, size: 13),
                          const SizedBox(width: 4),
                          const Text(
                            'Switch',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
    );
  }

  // ── Sub-strip: Patient Activity Center + date (below blue, blue text) ─────
  Widget _buildSubStrip() {
    final screenW = MediaQuery.of(context).size.width;
    final isNarrow = screenW < 360;
    return Container(
      color: AppColors.background,
      padding: EdgeInsets.symmetric(horizontal: isNarrow ? 10 : 14, vertical: 5),
      child: Row(
        children: [
          Icon(Icons.directions_walk,
              color: AppColors.primary, size: 11),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              'Patient Activity Center',
              style: TextStyle(
                fontSize: isNarrow ? 9.5 : 10.5,
                color: AppColors.primary,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (!isNarrow) ...[
            const Spacer(),
            Text(
              _formattedDate(),
              style: TextStyle(
                fontSize: 10,
                color: AppColors.primary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ── floating curved bottom nav ────────────────────────────────────────────
  Widget _buildBottomNav() {
    final screenW = MediaQuery.of(context).size.width;
    final isNarrow = screenW < 360;
    final navHeight = isNarrow ? 56.0 : 64.0;
    final iconSize = isNarrow ? 18.0 : 21.0;
    final labelSize = isNarrow ? 8.0 : 9.0;
    final hPad = isNarrow ? 6.0 : 12.0;
    final vPad = isNarrow ? 6.0 : 10.0;

    return Padding(
      padding: EdgeInsets.fromLTRB(hPad, 0, hPad, vPad),
      child: Container(
        height: navHeight,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.13),
              blurRadius: 20,
              spreadRadius: 0,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 6,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Row(
            children: List.generate(_navTabs.length, (i) {
              final tab      = _navTabs[i];
              final selected = i == _selectedIndex;
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedIndex = i),
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    color: Colors.transparent,
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Active top indicator dot
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          curve: Curves.easeOutCubic,
                          width:  selected ? 18 : 0,
                          height: selected ? 3  : 0,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        SizedBox(height: selected ? 3 : 6),
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 200),
                          child: Icon(
                            selected ? tab.activeIcon : tab.icon,
                            key: ValueKey('${i}_$selected'),
                            size: iconSize,
                            color: selected
                                ? AppColors.primary
                                : const Color(0xFFB0B8C8),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          tab.label,
                          style: TextStyle(
                            fontSize: labelSize,
                            fontWeight: selected
                                ? FontWeight.w700
                                : FontWeight.w500,
                            color: selected
                                ? AppColors.primary
                                : const Color(0xFFB0B8C8),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Plain top-bar icon button (no bounding box — just bare icon + optional dot)
// ─────────────────────────────────────────────────────────────────────────────
class _TopBarIcon extends StatelessWidget {
  final IconData icon;
  final bool badge;
  final VoidCallback onTap;

  const _TopBarIcon({
    required this.icon,
    required this.onTap,
    this.badge = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 32, height: 32,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 22),
            if (badge)
              Positioned(
                right: 3, top: 3,
                child: Container(
                  width: 7, height: 7,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF5A623),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Profile bottom sheet
// ─────────────────────────────────────────────────────────────────────────────
class _ProfileSheet extends StatelessWidget {
  final String fullName;
  final String initials;
  final String email;
  final String phone;
  final String gender;
  final String dob;
  final String address;
  final String username;

  const _ProfileSheet({
    required this.fullName,
    required this.initials,
    required this.email,
    required this.phone,
    required this.gender,
    required this.dob,
    required this.address,
    required this.username,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        left: 20, right: 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          const SizedBox(height: 12),
          Container(
            width: 40, height: 4,
            decoration: BoxDecoration(
              color: const Color(0xFFE5E7EB),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),

          // Avatar + name
          Container(
            width: 72, height: 72,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [Color(0xFF2B4ECC), Color(0xFF1A3399)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Center(
              child: Text(initials,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w800)),
            ),
          ),
          const SizedBox(height: 12),
          Text(fullName,
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark)),
          if (username.isNotEmpty) ...[
            const SizedBox(height: 3),
            Text('@$username',
                style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textGrey)),
          ],
          const SizedBox(height: 4),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('Patient',
                style: TextStyle(
                    fontSize: 11,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 20),
          const Divider(height: 1, color: Color(0xFFF3F4F6)),
          const SizedBox(height: 16),

          // Info rows
          if (email.isNotEmpty)
            _InfoRow(Icons.email_outlined, 'Email', email),
          if (phone.isNotEmpty)
            _InfoRow(Icons.phone_outlined, 'Phone', phone),
          if (gender.isNotEmpty)
            _InfoRow(Icons.person_outline, 'Gender', gender),
          if (dob.isNotEmpty)
            _InfoRow(Icons.cake_outlined, 'Date of Birth', dob),
          if (address.isNotEmpty)
            _InfoRow(Icons.location_on_outlined, 'Address', address),

          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                backgroundColor: const Color(0xFFF4F6FB),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text('Close',
                  style: TextStyle(
                      color: AppColors.textGrey,
                      fontWeight: FontWeight.w600)),
            ),
          ),
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
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34, height: 34,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(9),
            ),
            child: Icon(icon, size: 16, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        fontSize: 10.5,
                        color: AppColors.textLight,
                        fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text(value,
                    style: const TextStyle(
                        fontSize: 13.5,
                        color: AppColors.textDark,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//  Settings bottom sheet  (menu + logout)
// ─────────────────────────────────────────────────────────────────────────────
class _SettingsItem {
  final IconData icon;
  final String label;
  final String? subtitle;
  final int? tabIndex;          // null means it's a special action
  const _SettingsItem(this.icon, this.label,
      {this.subtitle, this.tabIndex});
}

const _settingsItems = <_SettingsItem>[
  _SettingsItem(Icons.calendar_today_outlined, 'My Appointments',
      subtitle: 'View & manage bookings', tabIndex: 0),
  _SettingsItem(Icons.local_hospital_outlined, 'Specialities',
      subtitle: 'Find doctors by specialty', tabIndex: 1),
  _SettingsItem(Icons.medication_outlined, 'Prescriptions',
      subtitle: 'Track your medicine orders', tabIndex: 2),
  _SettingsItem(Icons.biotech_outlined, 'Lab Results',
      subtitle: 'View diagnostic reports', tabIndex: 3),
  _SettingsItem(Icons.receipt_long_outlined, 'Billing',
      subtitle: 'Payment history & invoices', tabIndex: 4),
  _SettingsItem(Icons.chat_bubble_outline, 'Messages',
      subtitle: 'Track your Messages & Updates', tabIndex: 5),
  _SettingsItem(Icons.help_outline, 'Help & Support',
      subtitle: 'FAQs and contact us'),
  _SettingsItem(Icons.info_outline, 'About',
      subtitle: 'App version & info'),
];

class _SettingsSheet extends StatelessWidget {
  final void Function(int) onTabSelect;
  final int selectedIndex;

  const _SettingsSheet({
    required this.onTabSelect,
    required this.selectedIndex,
  });

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      minChildSize:     0.5,
      maxChildSize:     0.92,
      builder: (_, scrollCtrl) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Handle + header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
              child: Column(
                children: [
                  Center(
                    child: Container(
                      width: 40, height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE5E7EB),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.menu_rounded,
                            color: AppColors.primary, size: 20),
                      ),
                      const SizedBox(width: 12),
                      const Text('Menu',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Divider(height: 1, color: Color(0xFFF3F4F6)),
                ],
              ),
            ),

            // Menu list
            Expanded(
              child: ListView.separated(
                controller: scrollCtrl,
                padding: const EdgeInsets.symmetric(
                    vertical: 8, horizontal: 12),
                itemCount: _settingsItems.length,
                separatorBuilder: (_, __) =>
                    const SizedBox(height: 4),
                itemBuilder: (_, i) {
                  final item = _settingsItems[i];
                  final isActive = item.tabIndex != null &&
                      item.tabIndex == selectedIndex;
                  final isComingSoon = item.tabIndex == null;
                  return _SettingsTile(
                    item:        item,
                    isActive:    isActive,
                    isComingSoon: isComingSoon,
                    onTap: item.tabIndex != null
                        ? () => onTabSelect(item.tabIndex!)
                        : null,
                  );
                },
              ),
            ),

            // Logout
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: Divider(height: 1, color: Color(0xFFF3F4F6)),
            ),
            Padding(
              padding: EdgeInsets.only(
                left: 12, right: 12, top: 8,
                bottom: MediaQuery.of(context).padding.bottom + 16,
              ),
              child: Builder(builder: (ctx) {
                return ListTile(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  tileColor: const Color(0xFFFFF1F1),
                  leading: Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: Colors.redAccent.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.logout_rounded,
                        size: 18, color: Colors.redAccent),
                  ),
                  title: const Text('Logout',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Colors.redAccent)),
                  subtitle: const Text('Sign out of your account',
                      style: TextStyle(
                          fontSize: 11, color: Color(0xFFEF9898))),
                  trailing: const Icon(Icons.arrow_forward_ios,
                      size: 14, color: Colors.redAccent),
                  onTap: () => Navigator.pushAndRemoveUntil(
                    ctx,
                    MaterialPageRoute(
                        builder: (_) => const LoginScreen()),
                    (r) => false,
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final _SettingsItem item;
  final bool isActive;
  final bool isComingSoon;
  final VoidCallback? onTap;

  const _SettingsTile({
    required this.item,
    required this.isActive,
    required this.isComingSoon,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14)),
      tileColor: isActive
          ? AppColors.primary.withOpacity(0.07)
          : Colors.transparent,
      leading: Container(
        padding: const EdgeInsets.all(7),
        decoration: BoxDecoration(
          color: isActive
              ? AppColors.primary.withOpacity(0.15)
              : const Color(0xFFF4F6FB),
          borderRadius: BorderRadius.circular(9),
        ),
        child: Icon(item.icon,
            size: 18,
            color: isActive ? AppColors.primary : AppColors.textGrey),
      ),
      title: Text(item.label,
          style: TextStyle(
              fontSize: 13.5,
              fontWeight:
                  isActive ? FontWeight.w700 : FontWeight.w500,
              color: isActive
                  ? AppColors.primary
                  : AppColors.textDark)),
      subtitle: item.subtitle != null
          ? Text(item.subtitle!,
              style: const TextStyle(
                  fontSize: 11, color: AppColors.textLight))
          : null,
      trailing: isComingSoon
          ? Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('Soon',
                  style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFD97706))))
          : Icon(
              Icons.arrow_forward_ios,
              size: 13,
              color: isActive
                  ? AppColors.primary
                  : AppColors.textLight),
      onTap: onTap,
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Placeholder for coming-soon sections
// ─────────────────────────────────────────────────────────────────────────────
class _PlaceholderContent extends StatelessWidget {
  final _NavTab tab;
  const _PlaceholderContent({required this.tab});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 90, height: 90,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              shape: BoxShape.circle,
            ),
            child: Icon(tab.activeIcon,
                size: 44,
                color: AppColors.primary.withOpacity(0.35)),
          ),
          const SizedBox(height: 18),
          Text(tab.label,
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textGrey)),
          const SizedBox(height: 8),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF3C7),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('Coming Soon',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFD97706))),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hospital Switch Dialog
// ─────────────────────────────────────────────────────────────────────────────
class _HospitalSwitchDialog extends StatefulWidget {
  final String currentHospitalId;
  final void Function(Hospital) onSwitch;

  const _HospitalSwitchDialog({
    required this.currentHospitalId,
    required this.onSwitch,
  });

  @override
  State<_HospitalSwitchDialog> createState() => _HospitalSwitchDialogState();
}

class _HospitalSwitchDialogState extends State<_HospitalSwitchDialog> {
  List<Hospital> _all = [];
  List<Hospital> _filtered = [];
  String _query = '';
  String _selectedId = '';
  bool _loading = true;   // initial fetch
  bool _switching = false;
  final TextEditingController _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _selectedId = widget.currentHospitalId;
    _fetchHospitals();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _fetchHospitals() async {
    final list = await ApiService.fetchHospitals();
    if (!mounted) return;
    setState(() {
      _all      = list;
      _filtered = list;
      _loading  = false;
    });
  }

  void _onSearch(String q) {
    setState(() {
      _query    = q.toLowerCase();
      _filtered = _query.isEmpty
          ? _all
          : _all
              .where((h) =>
                  h.name.toLowerCase().contains(_query) ||
                  h.location.toLowerCase().contains(_query))
              .toList();
    });
  }

  Future<void> _doSwitch() async {
    final hospital = _all.firstWhere((h) => h.id == _selectedId,
        orElse: () => _all.first);
    if (hospital.id == widget.currentHospitalId) {
      Navigator.pop(context);
      return;
    }
    setState(() => _switching = true);
    final result = await ApiService.switchHospital(hospital);
    if (!mounted) return;

    // ── Not enrolled → offer to enroll ─────────────────────────────────────
    if (result['notEnrolled'] == true) {
      setState(() => _switching = false);
      final enroll = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFEEF2FF),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.info_outline,
                    color: Color(0xFF2B59D2), size: 20),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Text('Not Enrolled',
                    style: TextStyle(
                        fontSize: 17, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          content: RichText(
            text: TextSpan(
              style: const TextStyle(
                  fontSize: 13.5, color: Color(0xFF374151), height: 1.5),
              children: [
                const TextSpan(
                    text: 'You are not enrolled in '),
                TextSpan(
                    text: hospital.name,
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                const TextSpan(
                    text: '.\n\nWould you like to enroll and switch to this hospital?'),
              ],
            ),
          ),
          // ── Inline button row (same line, no wrapping) ──────────────────
          actionsPadding: EdgeInsets.zero,
          actions: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
              child: Row(
                children: [
                  // Keep Current – green filled
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(ctx, false),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF16A34A),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        elevation: 0,
                      ),
                      child: const Text('Keep Current',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 13)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  // Enroll & Switch – blue filled
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(ctx, true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2B59D2),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        elevation: 0,
                      ),
                      child: const Text('Enroll & Switch',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );

      if (enroll != true || !mounted) return;

      // Enroll then switch
      setState(() => _switching = true);
      final enrollResult =
          await ApiService.enrollAndSwitchHospital(hospital);
      if (!mounted) return;
      setState(() => _switching = false);

      if (enrollResult['success'] == true) {
        widget.onSwitch(hospital);
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                'Enrolled in & switched to ${hospital.name}'),
            backgroundColor: const Color(0xFF2B59D2),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 3),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(enrollResult['message'] as String? ??
                'Enrollment failed. Please try again.'),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 3),
          ),
        );
      }
      return;
    }

    // ── Normal result handling ───────────────────────────────────────────────
    setState(() => _switching = false);
    if (result['success'] == true) {
      widget.onSwitch(hospital);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Switched to ${hospital.name}'),
          backgroundColor: const Color(0xFF2B59D2),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12)),
          duration: const Duration(seconds: 2),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] as String? ??
              'Switch failed. Please try again.'),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12)),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.18),
              blurRadius: 40,
              spreadRadius: 0,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ─ Header ────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(22, 22, 16, 0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Select Hospital',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1D2E),
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Choose a hospital to view information and manage appointments',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 32, height: 32,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.close,
                          color: Colors.white, size: 17),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ─ Search bar ──────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                controller: _searchCtrl,
                onChanged: _onSearch,
                decoration: InputDecoration(
                  hintText: 'Search hospital name, city, or location...',
                  hintStyle: const TextStyle(
                      fontSize: 13, color: Color(0xFF9CA3AF)),
                  prefixIcon: const Icon(Icons.search,
                      color: Color(0xFF9CA3AF), size: 20),
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  contentPadding: const EdgeInsets.symmetric(
                      vertical: 12, horizontal: 16),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide:
                        const BorderSide(color: Color(0xFFE5E7EB), width: 1),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide:
                        const BorderSide(color: Color(0xFFE5E7EB), width: 1),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide:
                        const BorderSide(color: Color(0xFF2B59D2), width: 1.5),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),

            // ─ Hospital list ─────────────────────────────────────────
            ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.42,
              ),
              child: _loading
                  ? const Padding(
                      padding: EdgeInsets.all(32),
                      child: Center(
                        child: CircularProgressIndicator(
                          color: Color(0xFF2B59D2),
                          strokeWidth: 2.5,
                        ),
                      ),
                    )
                  : _filtered.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.all(32),
                          child: Center(
                            child: Text('No hospitals found',
                                style: TextStyle(
                                    fontSize: 14, color: Color(0xFF9CA3AF))),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          itemCount: _filtered.length,
                          itemBuilder: (_, i) {
                            final h        = _filtered[i];
                            final selected = h.id == _selectedId;
                            final isCurrent =
                                h.id == widget.currentHospitalId;
                            return GestureDetector(
                              onTap: () =>
                                  setState(() => _selectedId = h.id),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 180),
                                margin:
                                    const EdgeInsets.symmetric(vertical: 4),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 10),
                                decoration: BoxDecoration(
                                  color: selected
                                      ? const Color(0xFFEEF2FF)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(
                                    color: selected
                                        ? const Color(0xFF2B59D2)
                                            .withOpacity(0.35)
                                        : const Color(0xFFF3F4F6),
                                    width: selected ? 1.5 : 1,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    // Hospital thumbnail
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: h.imageUrl.isNotEmpty
                                          ? Image.network(
                                              h.imageUrl,
                                              width: 54,
                                              height: 54,
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) =>
                                                  _HospitalPlaceholderIcon(),
                                            )
                                          : _HospitalPlaceholderIcon(),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            h.name,
                                            style: TextStyle(
                                              fontSize: 13.5,
                                              fontWeight: FontWeight.w700,
                                              color: selected
                                                  ? const Color(0xFF1A1D2E)
                                                  : const Color(0xFF1A1D2E),
                                            ),
                                          ),
                                          const SizedBox(height: 3),
                                          Row(
                                            children: [
                                              const Icon(
                                                  Icons.location_on_outlined,
                                                  size: 12,
                                                  color: Color(0xFF9CA3AF)),
                                              const SizedBox(width: 3),
                                              Flexible(
                                                child: Text(
                                                  h.location,
                                                  style: const TextStyle(
                                                      fontSize: 11.5,
                                                      color:
                                                          Color(0xFF6B7280)),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.end,
                                      children: [
                                        if (isCurrent)
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color:
                                                  const Color(0xFF2B59D2),
                                              borderRadius:
                                                  BorderRadius.circular(20),
                                            ),
                                            child: const Text(
                                              'Current',
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ),
                                        if (isCurrent)
                                          const SizedBox(height: 4),
                                        // Radio circle
                                        Container(
                                          width: 22,
                                          height: 22,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            border: Border.all(
                                              color: selected
                                                  ? const Color(0xFF2B59D2)
                                                  : const Color(0xFFD1D5DB),
                                              width: 2,
                                            ),
                                            color: selected
                                                ? const Color(0xFF2B59D2)
                                                : Colors.white,
                                          ),
                                          child: selected
                                              ? const Icon(
                                                  Icons.check,
                                                  size: 13,
                                                  color: Colors.white,
                                                )
                                              : null,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
            ),

            const SizedBox(height: 16),

            // ─ Action buttons ────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
              child: Row(
                children: [
                  // Cancel
                  Expanded(
                    child: OutlinedButton(
                      onPressed:
                          _switching ? null : () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding:
                            const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(
                            color: Color(0xFFE5E7EB), width: 1.5),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF374151),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Switch Hospital
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: _switching || _loading ? null : _doSwitch,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2B59D2),
                        disabledBackgroundColor:
                            const Color(0xFF2B59D2).withOpacity(0.5),
                        padding:
                            const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      child: _switching
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Switch Hospital',
                              style: TextStyle(
                                fontSize: 14,
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

// Placeholder icon shown when network image fails or is empty
class _HospitalPlaceholderIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 54,
      height: 54,
      color: const Color(0xFFEEF2FF),
      child: const Icon(Icons.local_hospital,
          color: Color(0xFF2B59D2), size: 26),
    );
  }
}