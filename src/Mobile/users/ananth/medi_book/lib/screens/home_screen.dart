
import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../services/api_service.dart';
import 'appointments_tab.dart';
import 'specialities_tab.dart';
import 'medicine_orders_tab.dart';
import 'lab_results_tab.dart';
import 'login_screen.dart';

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

  Widget _buildContent() {
    switch (_selectedIndex) {
      case 0: return const AppointmentsTab();
      case 1: return const SpecialitiesTab();
      case 2: return const MedicineOrdersTab();
      case 3: return const LabResultsTab();
      default:
        return _PlaceholderContent(tab: _navTabs[_selectedIndex]);
    }
  }

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

  // ── Notification bottom sheet ────────────────────────────────────────────
  void _showNotificationsSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _NotificationsSheet(),
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
        gradient: LinearGradient(
          colors: [Color(0xFF1E3A8A), Color(0xFF2B4ECC), Color(0xFF3B82F6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      padding: EdgeInsets.fromLTRB(14, vPad, 12, vPad),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Row 1: brand  |  icons ──────────────────────────────────
          Row(
            children: [
              Container(
                width: 26, height: 26,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: Colors.white.withOpacity(0.3), width: 1),
                ),
                child: const Icon(Icons.medical_services_rounded,
                    color: Colors.white, size: 14),
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
                            fontSize: 10.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.2)),
                    Text('Technology Solutions',
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 8.5)),
                  ],
                ),
              ),
              _TopBarIcon(
                icon: Icons.notifications_outlined,
                badge: true,
                onTap: _showNotificationsSheet,
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

          // ── Row 2: Hospital name ────────────────────────────────────
          Text(
            'HEALTH HEAVEN',
            style: TextStyle(
              color: Colors.white,
              fontSize: hFont,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.3,
              height: 1.1,
            ),
          ),
          Text(
            'MEDICAL CENTER',
            style: TextStyle(
              color: Colors.white,
              fontSize: hFont,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.3,
              height: 1.1,
            ),
          ),
        ],
      ),
    );
  }

  // ── Sub-strip: Patient Activity Center + date (below blue, blue text) ─────
  Widget _buildSubStrip() {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
      child: Row(
        children: [
          Icon(Icons.directions_walk,
              color: AppColors.primary, size: 11),
          const SizedBox(width: 4),
          Text(
            'Patient Activity Center',
            style: TextStyle(
              fontSize: 10.5,
              color: AppColors.primary,
              fontWeight: FontWeight.w500,
            ),
          ),
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
      ),
    );
  }

  // ── floating curved bottom nav ────────────────────────────────────────────
  Widget _buildBottomNav() {
    return Padding(
      // Side margins so the card never touches screen edges
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 10),
      child: Container(
        height: 64,
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
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Active top indicator dot
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          curve: Curves.easeOutCubic,
                          width:  selected ? 20 : 0,
                          height: selected ? 3  : 0,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        SizedBox(height: selected ? 4 : 7),
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 200),
                          child: Icon(
                            selected ? tab.activeIcon : tab.icon,
                            key: ValueKey('${i}_$selected'),
                            size: 21,
                            color: selected
                                ? AppColors.primary
                                : const Color(0xFFB0B8C8),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          tab.label,
                          style: TextStyle(
                            fontSize: 9,
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
//  Notifications bottom sheet  (Coming Soon)
// ─────────────────────────────────────────────────────────────────────────────
class _NotificationsSheet extends StatelessWidget {
  const _NotificationsSheet();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Title row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.notifications_active_outlined,
                    color: AppColors.primary, size: 22),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Notifications',
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textDark)),
                    Text('Stay updated with your health',
                        style: TextStyle(
                            fontSize: 11, color: AppColors.textGrey)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text('Soon',
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFFD97706))),
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Illustration
          Container(
            width: 80, height: 80,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.06),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.notifications_none_rounded,
                size: 40, color: AppColors.primary.withOpacity(0.4)),
          ),
          const SizedBox(height: 16),
          const Text('No notifications yet',
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark)),
          const SizedBox(height: 6),
          const Text(
            'Appointment reminders, prescription\nalerts & health tips — coming soon!',
            textAlign: TextAlign.center,
            style:
                TextStyle(fontSize: 12.5, color: AppColors.textGrey, height: 1.5),
          ),
          const SizedBox(height: 28),
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
      subtitle: 'Chat with care team'),
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