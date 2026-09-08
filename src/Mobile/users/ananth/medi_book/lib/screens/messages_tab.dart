// lib/screens/messages_tab.dart

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/message.dart';
import '../services/api_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
//  Messages Tab
// ─────────────────────────────────────────────────────────────────────────────

class MessagesTab extends StatefulWidget {
  const MessagesTab({super.key});

  @override
  State<MessagesTab> createState() => _MessagesTabState();
}

class _MessagesTabState extends State<MessagesTab>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  List<Message> _all     = [];
  bool          _loading = true;
  String?       _error;
  String        _search  = '';
  int           _page    = 1;
  static const  _perPage = 5;

  // Filter state
  bool _showFilter = false;
  final Set<String> _activeFilters = {};

  /// Human-readable filter labels → maps to notifType values
  static const Map<String, String> _filterLabels = {
    'Medicine Order':        'MedicineReminder',
    'Order Update':          'OrderUpdate',
    'Appointment Created':   'AppointmentCreated',
    'Appointment Reminder':  'AppointmentReminder',
    'Lab Result':            'LabResult',
  };

  final LayerLink _filterLayerLink = LayerLink();
  OverlayEntry?   _filterOverlay;

  @override
  void initState() {
    super.initState()  ;
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() => setState(() {}));
    _load();
  }

  @override
  void dispose() {
    _removeFilterOverlay();
    _tabController.dispose();
    super.dispose();
  }

  // ── data ───────────────────────────────────────────────────────────────────

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final raw = await ApiService.fetchMessages();
      if (!mounted) return;
      final data = raw.map(Message.fromApiJson).toList();
      setState(() {
        _all     = data;
        _loading = false;
        _page    = 1;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  // ── computed lists ─────────────────────────────────────────────────────────

  /// Tab 0 – "All Messages": unread (isRead == false)
  List<Message> get _active   => _all.where((m) => !m.isRead).toList();

  /// Tab 1 – "Archived": read (isRead == true)
  List<Message> get _archived => _all.where((m) =>  m.isRead).toList();

  List<Message> get _currentList =>
      _tabController.index == 0 ? _active : _archived;

  List<Message> get _filtered {
    var list = _currentList;

    if (_search.isNotEmpty) {
      final q = _search.toLowerCase();
      list = list.where((m) =>
        m.title.toLowerCase().contains(q)     ||
        m.message.toLowerCase().contains(q)   ||
        m.notifType.toLowerCase().contains(q) ||
        m.doctorName.toLowerCase().contains(q),
      ).toList();
    }

    if (_activeFilters.isNotEmpty) {
      list = list.where((m) => _activeFilters.contains(m.notifType)).toList();
    }

    return list;
  }

  List<Message> get _paged {
    final end = (_page * _perPage).clamp(0, _filtered.length);
    return _filtered.sublist(0, end);
  }

  int get _totalPages => (_filtered.length / _perPage).ceil().clamp(1, 9999);

  // ── actions ────────────────────────────────────────────────────────────────

  /// Archive = mark as read via API, moves message to Archived tab
  Future<void> _archive(Message msg) async {
    _removeFilterOverlay();
    setState(() { msg.isRead = true; });
    await ApiService.markMessageAsRead(msg.messageId);
    if (!mounted) return;
    _showSnack('Message archived');
  }

  /// Unarchive = optimistic UI only (mark unread locally)
  Future<void> _unarchive(Message msg) async {
    setState(() { msg.isRead = false; });
    _showSnack('Message moved to inbox');
  }

  void _showSnack(String text) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(text),
      duration: const Duration(seconds: 2),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  // ── filter overlay ─────────────────────────────────────────────────────────

  void _toggleFilter() {
    if (_filterOverlay != null) {
      _removeFilterOverlay();
    } else {
      _showFilterOverlay();
    }
    setState(() { _showFilter = !_showFilter; });
  }

  void _showFilterOverlay() {
    _filterOverlay = OverlayEntry(
      builder: (_) => _FilterDropdown(
        layerLink:     _filterLayerLink,
        filterLabels:  _filterLabels,
        activeFilters: _activeFilters,
        onChanged: (notifType, checked) {
          setState(() {
            if (checked) {
              _activeFilters.add(notifType);
            } else {
              _activeFilters.remove(notifType);
            }
            _page = 1;
            // Rebuild overlay to reflect check state
            _filterOverlay?.markNeedsBuild();
          });
        },
        onDismiss: () {
          _removeFilterOverlay();
          setState(() { _showFilter = false; });
        },
      ),
    );
    Overlay.of(context).insert(_filterOverlay!);
  }

  void _removeFilterOverlay() {
    _filterOverlay?.remove();
    _filterOverlay = null;
  }

  // ── build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildHeader(),
        _buildSearchBar(),
        _buildTabs(),
        Expanded(child: _buildBody()),
      ],
    );
  }

  // ── Header ─────────────────────────────────────────────────────────────────
  Widget _buildHeader() {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.mail_outline_rounded,
                color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Messages',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textDark)),
                Text('Track your Messages & Updates',
                    style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textGrey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Search bar + Filter ────────────────────────────────────────────────────
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(14, 4, 14, 0),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 38,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.divider),
              ),
              child: TextField(
                onChanged: (v) => setState(() { _search = v; _page = 1; }),
                style: const TextStyle(fontSize: 13),
                decoration: const InputDecoration(
                  hintText: 'Search by medicine name, etc...',
                  hintStyle: TextStyle(fontSize: 12, color: AppColors.textLight),
                  prefixIcon: Icon(Icons.search, size: 18, color: AppColors.textLight),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Filter button with CompositedTransformTarget for overlay positioning
          CompositedTransformTarget(
            link: _filterLayerLink,
            child: GestureDetector(
              onTap: _toggleFilter,
              child: Container(
                height: 38,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: _showFilter
                      ? AppColors.primary.withOpacity(0.1)
                      : Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: _showFilter ? AppColors.primary : AppColors.divider,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(Icons.filter_list_rounded,
                        size: 16,
                        color: _showFilter
                            ? AppColors.primary
                            : AppColors.textGrey),
                    const SizedBox(width: 4),
                    Text('Filter',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _showFilter
                                ? AppColors.primary
                                : AppColors.textGrey)),
                    const SizedBox(width: 3),
                    Icon(
                      _showFilter
                          ? Icons.keyboard_arrow_up
                          : Icons.keyboard_arrow_down,
                      size: 15,
                      color: _showFilter
                          ? AppColors.primary
                          : AppColors.textGrey,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Tabs ───────────────────────────────────────────────────────────────────
  Widget _buildTabs() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 0),
      child: Row(
        children: [
          _TabChip(
            label: 'All Messages',
            count: _active.length,
            selected: _tabController.index == 0,
            onTap: () {
              _tabController.animateTo(0);
              setState(() { _page = 1; });
            },
          ),
          const SizedBox(width: 8),
          _TabChip(
            label: 'Archived',
            count: _archived.length,
            selected: _tabController.index == 1,
            onTap: () {
              _tabController.animateTo(1);
              setState(() { _page = 1; });
            },
          ),
        ],
      ),
    );
  }

  // ── Body ───────────────────────────────────────────────────────────────────
  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 44, color: Colors.redAccent),
            const SizedBox(height: 12),
            Text(_error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.textGrey, fontSize: 13)),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }

    final items = _paged;
    final total = _filtered.length;

    return ListView(
      padding: const EdgeInsets.fromLTRB(14, 8, 14, 14),
      children: [
        ...items.map((m) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _MessageCard(
                message:    m,
                onArchive:  () => _archive(m),
                onUnarchive: () => _unarchive(m),
              ),
            )),

        if (items.isEmpty)
          _EmptyState(isArchived: _tabController.index == 1),

        if (items.isNotEmpty && _paged.length >= total)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Center(
              child: Text(
                'No more messages to show',
                style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textLight.withOpacity(0.8)),
              ),
            ),
          ),

        if (total > _perPage)
          _Pagination(
            current: _page,
            total:   _totalPages,
            onPrev:  _page > 1
                ? () => setState(() => _page--)
                : null,
            onNext:  _page < _totalPages
                ? () => setState(() => _page++)
                : null,
            onPage:  (p) => setState(() => _page = p),
          ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Filter dropdown overlay
// ─────────────────────────────────────────────────────────────────────────────
class _FilterDropdown extends StatefulWidget {
  final LayerLink                      layerLink;
  final Map<String, String>            filterLabels;
  final Set<String>                    activeFilters;
  final void Function(String, bool)    onChanged;
  final VoidCallback                   onDismiss;

  const _FilterDropdown({
    required this.layerLink,
    required this.filterLabels,
    required this.activeFilters,
    required this.onChanged,
    required this.onDismiss,
  });

  @override
  State<_FilterDropdown> createState() => _FilterDropdownState();
}

class _FilterDropdownState extends State<_FilterDropdown> {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Dismiss tap outside
        Positioned.fill(
          child: GestureDetector(
            onTap: widget.onDismiss,
            behavior: HitTestBehavior.opaque,
            child: const SizedBox.expand(),
          ),
        ),
        // Dropdown panel anchored below the Filter button
        CompositedTransformFollower(
          link: widget.layerLink,
          showWhenUnlinked: false,
          offset: const Offset(0, 42),
          child: Align(
            alignment: Alignment.topRight,
            child: Material(
              elevation: 6,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: 180,
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.divider),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: widget.filterLabels.entries.map((entry) {
                    final label    = entry.key;
                    final notifKey = entry.value;
                    final checked  = widget.activeFilters.contains(notifKey);
                    return InkWell(
                      onTap: () {
                        setState(() {});
                        widget.onChanged(notifKey, !checked);
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 9),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(label,
                                  style: const TextStyle(
                                      fontSize: 12.5,
                                      color: AppColors.textDark)),
                            ),
                            Container(
                              width: 18, height: 18,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: checked
                                      ? AppColors.primary
                                      : AppColors.divider,
                                  width: 1.5,
                                ),
                                color: checked
                                    ? AppColors.primary
                                    : Colors.transparent,
                              ),
                              child: checked
                                  ? const Icon(Icons.check,
                                      size: 11, color: Colors.white)
                                  : null,
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Tab chip
// ─────────────────────────────────────────────────────────────────────────────
class _TabChip extends StatelessWidget {
  final String   label;
  final int      count;
  final bool     selected;
  final VoidCallback onTap;

  const _TabChip({
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: selected
              ? null
              : Border.all(color: AppColors.divider),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label,
                style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: selected ? Colors.white : AppColors.textGrey)),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: selected
                    ? Colors.white.withOpacity(0.25)
                    : AppColors.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '$count',
                style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: selected ? Colors.white : AppColors.primary),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Message card  (plain white – exactly as design)
// ─────────────────────────────────────────────────────────────────────────────
class _MessageCard extends StatelessWidget {
  final Message      message;
  final VoidCallback onArchive;
  final VoidCallback onUnarchive;

  const _MessageCard({
    required this.message,
    required this.onArchive,
    required this.onUnarchive,
  });

  Color get _typeColor {
    switch (message.notifType) {
      case 'MedicineReminder':    return const Color(0xFF6366F1);
      case 'OrderUpdate':         return const Color(0xFF059669);
      case 'LabResult':           return const Color(0xFFDC2626);
      case 'AppointmentCreated':
      case 'AppointmentReminder': return AppColors.primary;
      default:                    return const Color(0xFF0891B2);
    }
  }

  IconData get _typeIcon {
    switch (message.notifType) {
      case 'MedicineReminder':    return Icons.medication_rounded;
      case 'OrderUpdate':         return Icons.local_shipping_rounded;
      case 'LabResult':           return Icons.biotech_rounded;
      case 'AppointmentCreated':
      case 'AppointmentReminder': return Icons.calendar_today_rounded;
      default:                    return Icons.notifications_rounded;
    }
  }

  String get _typeLabel {
    switch (message.notifType) {
      case 'MedicineReminder':    return 'Medicine Reminder';
      case 'OrderUpdate':         return 'Order Update';
      case 'LabResult':           return 'Lab Result';
      case 'AppointmentCreated':  return 'Appointment Created';
      case 'AppointmentReminder': return 'Appointment Reminder';
      default:
        return message.notifType.isNotEmpty ? message.notifType : 'Notification';
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isArchived = message.isRead;
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.divider.withOpacity(0.6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── LEFT: circular icon + date + time ────────────────────────
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 54, height: 54,
                  decoration: BoxDecoration(
                    color: _typeColor.withOpacity(0.10),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_typeIcon, size: 26, color: _typeColor),
                ),
                const SizedBox(height: 8),
                Text(
                  message.date,
                  style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textGrey),
                ),
                Text(
                  message.time,
                  style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.textGrey),
                ),
              ],
            ),

            const SizedBox(width: 14),

            // ── RIGHT: badge + title + body + doctor row ──────────────────
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: _typeColor.withOpacity(0.10),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _typeLabel,
                      style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          color: _typeColor),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Title
                  Text(
                    message.title,
                    style: const TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textDark,
                        height: 1.3),
                  ),
                  const SizedBox(height: 4),

                  // Body
                  Text(
                    message.message,
                    style: const TextStyle(
                        fontSize: 11.5,
                        color: AppColors.textGrey,
                        height: 1.4),
                  ),
                  const SizedBox(height: 12),

                  // Doctor + Archive button
                  Row(
                    children: [
                      // Doctor avatar
                      Container(
                        width: 28, height: 28,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Color(0xFF2B4ECC), Color(0xFF1A3399)],
                          ),
                        ),
                        child: const Icon(Icons.person,
                            color: Colors.white, size: 16),
                      ),
                      const SizedBox(width: 6),

                      // Doctor name + role
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (message.doctorName.isNotEmpty)
                              Text(message.doctorName,
                                  style: const TextStyle(
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textDark)),
                            if (message.doctorRole.isNotEmpty)
                              Text(message.doctorRole,
                                  style: const TextStyle(
                                      fontSize: 10,
                                      color: AppColors.textGrey)),
                          ],
                        ),
                      ),

                      // Archive / Unarchive button
                      GestureDetector(
                        onTap: isArchived ? onUnarchive : onArchive,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                                color: AppColors.primary.withOpacity(0.25)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                isArchived
                                    ? Icons.unarchive_outlined
                                    : Icons.inventory_2_outlined,
                                size: 14,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: 5),
                              Text(
                                isArchived ? 'Unarchive' : 'Archive',
                                style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.primary),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
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

// ─────────────────────────────────────────────────────────────────────────────
//  Delete confirmation dialog  (kept for potential future use)
// ─────────────────────────────────────────────────────────────────────────────
class _DeleteConfirmDialog extends StatelessWidget {
  const _DeleteConfirmDialog();

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.mail_rounded,
                  size: 30, color: AppColors.primary),
            ),
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.topRight,
              child: GestureDetector(
                onTap: () => Navigator.pop(context, false),
                child: const Icon(Icons.close,
                    size: 20, color: AppColors.textLight),
              ),
            ),
            const Text(
              'Permanently Delete this Message?',
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark),
            ),
            const SizedBox(height: 8),
            const Text(
              "You won't be able to see this message again.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12.5, color: AppColors.textGrey),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      side: const BorderSide(color: AppColors.divider),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () => Navigator.pop(context, false),
                    child: const Text('Cancel',
                        style: TextStyle(
                            color: AppColors.textGrey,
                            fontWeight: FontWeight.w700)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    onPressed: () => Navigator.pop(context, true),
                    child: const Text('Yes, Delete',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  final bool isArchived;
  const _EmptyState({required this.isArchived});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 70, height: 70,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isArchived
                  ? Icons.archive_outlined
                  : Icons.mail_outline_rounded,
              size: 34,
              color: AppColors.primary.withOpacity(0.35),
            ),
          ),
          const SizedBox(height: 14),
          Text(
            isArchived ? 'No archived messages' : 'No messages yet',
            style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textGrey),
          ),
          const SizedBox(height: 6),
          Text(
            isArchived
                ? 'Messages you archive will appear here'
                : 'You have no messages at the moment',
            style: const TextStyle(
                fontSize: 11.5,
                color: AppColors.textLight),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Pagination
// ─────────────────────────────────────────────────────────────────────────────
class _Pagination extends StatelessWidget {
  final int       current;
  final int       total;
  final VoidCallback? onPrev;
  final VoidCallback? onNext;
  final void Function(int) onPage;

  const _Pagination({
    required this.current,
    required this.total,
    this.onPrev,
    this.onNext,
    required this.onPage,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _NavArrow(
            icon: Icons.chevron_left,
            enabled: onPrev != null,
            onTap: onPrev ?? () {},
          ),
          const SizedBox(width: 6),
          ...List.generate(total, (i) {
            final page     = i + 1;
            final selected = page == current;
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 3),
              child: GestureDetector(
                onTap: () => onPage(page),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  width: 30, height: 30,
                  decoration: BoxDecoration(
                    color: selected ? AppColors.primary : Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: selected
                          ? AppColors.primary
                          : AppColors.divider,
                    ),
                  ),
                  child: Center(
                    child: Text('$page',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: selected
                                ? Colors.white
                                : AppColors.textGrey)),
                  ),
                ),
              ),
            );
          }),
          const SizedBox(width: 6),
          _NavArrow(
            icon: Icons.chevron_right,
            enabled: onNext != null,
            onTap: onNext ?? () {},
          ),
        ],
      ),
    );
  }
}

class _NavArrow extends StatelessWidget {
  final IconData     icon;
  final bool         enabled;
  final VoidCallback onTap;
  const _NavArrow({required this.icon, required this.enabled, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 30, height: 30,
        decoration: BoxDecoration(
          color: enabled ? Colors.white : const Color(0xFFF4F6FB),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.divider),
        ),
        child: Icon(icon,
            size: 18,
            color: enabled ? AppColors.textDark : AppColors.textLight),
      ),
    );
  }
}
