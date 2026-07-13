// lib/screens/medicine_orders_tab.dart

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/rx_order.dart';
import '../services/api_service.dart';

class MedicineOrdersTab extends StatefulWidget {
  const MedicineOrdersTab({super.key});

  @override
  State<MedicineOrdersTab> createState() => _MedicineOrdersTabState();
}

class _MedicineOrdersTabState extends State<MedicineOrdersTab> {
  List<RxOrder>      _all        = [];
  List<RxOrder>      _filtered   = [];
  Map<int, String>   _relationMap = {};   // profileId → relation label
  bool               _loading    = true;
  String?            _error;
  String             _search     = '';
  String             _sortKey    = 'Default';
  int                _page       = 1;
  static const       _perPage    = 5;

  static const _sortOptions = [
    'Default',
    'Name A-Z',
    'Name Z-A',
    'Ready Orders',
    'In Transit Orders',
    'Newest Order',
    'Oldest Order',
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      // fetch orders + profile-relation map in parallel
      final results = await Future.wait([
        ApiService.fetchRxOrders(),
        ApiService.fetchProfileRelationMap(),
      ]);
      if (!mounted) return;
      final data   = results[0] as List<RxOrder>;
      final relMap = results[1] as Map<int, String>;
      setState(() {
        _all        = data;
        _relationMap = relMap;
        _filtered   = List.from(data);
        _loading    = false;
        _page       = 1;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });

    }
  }

  void _applyFilter(String query) {
    _search = query;
    final q = query.toLowerCase();
    setState(() {
      _filtered = _all.where((o) =>
        o.rxName.toLowerCase().contains(q)       ||
        o.dosage.toLowerCase().contains(q)       ||
        o.doctorName.toLowerCase().contains(q)   ||
        o.pharmacyName.toLowerCase().contains(q) ||
        o.patientName.toLowerCase().contains(q),
      ).toList();
      _page = 1;
      _applySort(_sortKey, notify: false);
    });
  }

  void _applySort(String key, {bool notify = true}) {
    if (notify) setState(() { _sortKey = key; _page = 1; });
    switch (key) {
      case 'Name A-Z':
        _filtered.sort((a, b) {
          final na = a.rxName.isNotEmpty ? a.rxName : a.patientName;
          final nb = b.rxName.isNotEmpty ? b.rxName : b.patientName;
          return na.toLowerCase().compareTo(nb.toLowerCase());
        });
        break;
      case 'Name Z-A':
        _filtered.sort((a, b) {
          final na = a.rxName.isNotEmpty ? a.rxName : a.patientName;
          final nb = b.rxName.isNotEmpty ? b.rxName : b.patientName;
          return nb.toLowerCase().compareTo(na.toLowerCase());
        });
        break;
      case 'Ready Orders':
        _filtered.sort((a, b) {
          final aR = (a.orderStatus.toLowerCase() == 'ready' ||
                      a.orderStatus.toLowerCase() == 'active') ? 0 : 1;
          final bR = (b.orderStatus.toLowerCase() == 'ready' ||
                      b.orderStatus.toLowerCase() == 'active') ? 0 : 1;
          return aR.compareTo(bR);
        });
        break;
      case 'In Transit Orders':
        _filtered.sort((a, b) {
          final aT = a.orderStatus.toLowerCase() == 'in transit' ? 0 : 1;
          final bT = b.orderStatus.toLowerCase() == 'in transit' ? 0 : 1;
          return aT.compareTo(bT);
        });
        break;
      case 'Newest Order':
        _filtered.sort((a, b) => b.orderId.compareTo(a.orderId));
        break;
      case 'Oldest Order':
        _filtered.sort((a, b) => a.orderId.compareTo(b.orderId));
        break;
    }
  }

  int _countByStatus(String s) =>
      _all.where((o) => o.orderStatus.toLowerCase() == s.toLowerCase()).length;

  List<RxOrder> get _paginated {
    final start = (_page - 1) * _perPage;
    final end   = (start + _perPage).clamp(0, _filtered.length);
    return start >= _filtered.length ? [] : _filtered.sublist(start, end);
  }

  int get _totalPages => (_filtered.length / _perPage).ceil().clamp(1, 9999);

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
          Text(_error!, textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textGrey)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _load,
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Retry', style: TextStyle(color: Colors.white)),
          ),
        ]),
      );
    }

    final paginated = _paginated;

    return Column(
      children: [
        Expanded(
          child: RefreshIndicator(
            color: AppColors.primary,
            onRefresh: _load,
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              children: [

                // ── page header ─────────────────────────────────────────────
                const SizedBox(height: 16),
                Row(children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.medication_outlined,
                        color: AppColors.primary, size: 24),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('My Prescriptions',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800,
                              color: AppColors.textDark)),
                      Text('Track your prescriptions and delivery status',
                          style: TextStyle(fontSize: 11.5, color: AppColors.textGrey)),
                    ],
                  ),
                ]),

                const SizedBox(height: 18),

                // ── summary stats row ──────────────────────────────────────
                Row(children: [
                  _StatCard(
                    icon: Icons.shopping_cart_outlined,
                    iconColor: AppColors.primary,
                    iconBg: const Color(0xFFEEF2FF),
                    count: _all.length,
                    label: 'Total Orders',
                    sub:   'All time orders',
                  ),
                  const SizedBox(width: 10),
                  _StatCard(
                    icon: Icons.check_circle_outline,
                    iconColor: AppColors.completedGreen,
                    iconBg: AppColors.completedBg,
                    count: _countByStatus('Ready') + _countByStatus('Active'),
                    label: 'Ready',
                    sub:   'for Pickup',
                  ),
                  const SizedBox(width: 10),
                  _StatCard(
                    icon: Icons.local_shipping_outlined,
                    iconColor: AppColors.upcomingAmber,
                    iconBg: AppColors.upcomingBg,
                    count: _countByStatus('In Transit'),
                    label: 'In Transit',
                    sub:   'On the way',
                  ),
                ]),

                const SizedBox(height: 18),

                // ── search + sort row ──────────────────────────────────────
                Row(children: [
                  Expanded(
                    child: Container(
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE0E0E0)),
                      ),
                      child: TextField(
                        onChanged: _applyFilter,
                        style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                        decoration: const InputDecoration(
                          hintText: 'Search by medicine name, etc ...',
                          hintStyle: TextStyle(fontSize: 12.5, color: AppColors.textLight),
                          prefixIcon: Icon(Icons.search, size: 19, color: AppColors.textGrey),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ),
                   const SizedBox(width: 10),
                  // ── Sort By button with radio popup ───────────────────────
                  _SortButton(
                    currentSort: _sortKey,
                    options: _sortOptions,
                    onSelect: (v) {
                      setState(() {
                        _sortKey  = v;
                        _filtered = _all.where((o) {
                          final q = _search.toLowerCase();
                          return q.isEmpty ||
                            o.rxName.toLowerCase().contains(q)       ||
                            o.dosage.toLowerCase().contains(q)       ||
                            o.doctorName.toLowerCase().contains(q)   ||
                            o.pharmacyName.toLowerCase().contains(q) ||
                            o.patientName.toLowerCase().contains(q);
                        }).toList();
                        _page = 1;
                      });
                      _applySort(v, notify: false);
                    },
                  ),
                ]),

                const SizedBox(height: 16),

                // ── prescription cards ─────────────────────────────────────
                if (paginated.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Center(
                      child: Text('No prescription orders found',
                          style: TextStyle(fontSize: 14, color: AppColors.textGrey)),
                    ),
                  )
                else
                  ...paginated.map((o) {
                    final rel = _relationMap[o.profileId] ?? '';
                    return _RxCard(order: o, relationLabel: rel);
                  }).toList(),

                // ── no-more + pagination ───────────────────────────────────
                const SizedBox(height: 4),
                const Center(
                  child: Text('No More prescriptions to show',
                      style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                ),
                const SizedBox(height: 16),
                _Pagination(
                  page: _page,
                  total: _totalPages,
                  onPrev: _page > 1 ? () => setState(() => _page--) : null,
                  onNext: _page < _totalPages ? () => setState(() => _page++) : null,
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── Sort Button with radio popup ──────────────────────────────────────────────

class _SortButton extends StatelessWidget {
  final String              currentSort;
  final List<String>        options;
  final ValueChanged<String> onSelect;

  const _SortButton({
    required this.currentSort,
    required this.options,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = currentSort != 'Default';

    return PopupMenuButton<String>(
      onSelected: onSelect,
      color: Colors.white,
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      offset: const Offset(0, 48),
      constraints: const BoxConstraints(minWidth: 200),
      itemBuilder: (_) => options
          .where((o) => o != 'Default')
          .map((opt) {
            final selected = currentSort == opt;
            return PopupMenuItem<String>(
              value: opt,
              height: 44,
              padding: EdgeInsets.zero,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                child: Row(children: [
                  // radio icon
                  Icon(
                    selected
                        ? Icons.radio_button_checked
                        : Icons.radio_button_unchecked,
                    size: 18,
                    color: selected ? AppColors.primary : AppColors.textGrey,
                  ),
                  const SizedBox(width: 10),
                  Text(opt,
                      style: TextStyle(
                        fontSize: 13,
                        color: selected ? AppColors.primary : AppColors.textDark,
                        fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                      )),
                ]),
              ),
            );
          })
          .toList(),
      child: Container(
        height: 44,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isActive ? AppColors.primary : const Color(0xFFE0E0E0),
            width: isActive ? 1.5 : 1,
          ),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.filter_list,
              size: 16,
              color: isActive ? AppColors.primary : AppColors.textGrey),
          const SizedBox(width: 6),
          Text(
            isActive ? currentSort : 'Sort By',
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
              color: isActive ? AppColors.primary : AppColors.textDark,
            ),
          ),
          const SizedBox(width: 4),
          Icon(
            Icons.keyboard_arrow_up,
            size: 16,
            color: isActive ? AppColors.primary : AppColors.textGrey,
          ),
        ]),
      ),
    );
  }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color    iconColor;
  final Color    iconBg;
  final int      count;
  final String   label;
  final String   sub;

  const _StatCard({
    required this.icon,   required this.iconColor, required this.iconBg,
    required this.count,  required this.label,     required this.sub,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.06),
                blurRadius: 8, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 32, height: 32,
              decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
              child: Icon(icon, size: 17, color: iconColor),
            ),
            const SizedBox(height: 8),
            Text('$count',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800,
                    color: iconColor)),
            Text(label,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600,
                    color: AppColors.textDark),
                overflow: TextOverflow.ellipsis),
            Text(sub,
                style: const TextStyle(fontSize: 10, color: AppColors.textGrey),
                overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}

// ── Prescription Card ─────────────────────────────────────────────────────────

class _RxCard extends StatelessWidget {
  final RxOrder order;
  final String  relationLabel; // e.g. "Self", "Spouse", "Child"
  const _RxCard({required this.order, this.relationLabel = ''});

  Color _statusColor(String s) {
    switch (s.toLowerCase()) {
      case 'active':     return AppColors.completedGreen;
      case 'ready':      return AppColors.completedGreen;
      case 'completed':  return AppColors.primary;
      case 'cancelled':  return Colors.redAccent;
      case 'in transit': return AppColors.upcomingAmber;
      default:           return AppColors.upcomingAmber;
    }
  }

  Color _statusBg(String s) {
    switch (s.toLowerCase()) {
      case 'active':
      case 'ready':      return const Color(0xFFDCFCE7);
      case 'completed':  return const Color(0xFFEEF2FF);
      case 'cancelled':  return const Color(0xFFFFEBEE);
      case 'in transit': return const Color(0xFFFEF3C7);
      default:           return const Color(0xFFFEF3C7);
    }
  }

  String _statusLabel(String s) {
    if (s.toLowerCase() == 'active') return 'Ready';
    return s;
  }

  /// Returns one chip entry (icon, label) per dose-time based on frequency text.
  List<({IconData icon, String label})> _dosageChips() {
    final dose = order.dosage.isNotEmpty ? order.dosage : '1 dose';
    final freq  = order.frequency.toLowerCase();

    // Detect numeric count from frequency string
    int count = 1;
    if (freq.contains('once')  || freq.contains('1 time'))  count = 1;
    if (freq.contains('twice') || freq.contains('2 time'))  count = 2;
    if (freq.contains('three') || freq.contains('3 time'))  count = 3;
    if (freq.contains('four')  || freq.contains('4 time'))  count = 4;
    if (freq.contains('five')  || freq.contains('5 time'))  count = 5;

    const times = [
      (icon: Icons.wb_sunny_outlined,      label: 'Morning'),
      (icon: Icons.wb_twilight,            label: 'Noon'),
      (icon: Icons.wb_sunny,               label: 'Evening'),
      (icon: Icons.nights_stay_outlined,   label: 'Night'),
      (icon: Icons.bedtime_outlined,       label: 'Bedtime'),
    ];

    // Build chips: one per time slot up to count
    return times.take(count).map((t) => (
      icon:  t.icon,
      label: '$dose · ${t.label}',
    )).toList();
  }

  @override
  Widget build(BuildContext context) {
    final o          = order;
    final sColor     = _statusColor(o.orderStatus);
    final sBg        = _statusBg(o.orderStatus);
    final sLabel     = _statusLabel(o.orderStatus);
    final medName    = o.drugName.isNotEmpty ? o.drugName : 'Prescription';
    final isCancelled = o.orderStatus.toLowerCase() == 'cancelled';
    final rel        = relationLabel;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.07),
              blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // ── top row: avatar | content ──────────────────────────────────
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                // left: avatar + name + relation
                SizedBox(
                  width: 62,
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: const Color(0xFFE8E8E8),
                        child: const Icon(Icons.person,
                            size: 26, color: Color(0xFF9E9E9E)),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        o.patientName.split(' ').first,
                        style: const TextStyle(fontSize: 11,
                            fontWeight: FontWeight.w600, color: AppColors.textDark),
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (rel.isNotEmpty) ...[  
                        const SizedBox(height: 3),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.10),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            rel,
                            style: const TextStyle(
                                fontSize: 9.5,
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(width: 12),

                // right: medicine + status + chips
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      // medicine name + status badge
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: RichText(
                              text: TextSpan(children: [
                                TextSpan(
                                  text: medName,
                                  style: const TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.w700,
                                    color: AppColors.textDark,
                                  ),
                                ),
                                TextSpan(
                                  text: o.dosage.isNotEmpty ? '  ${o.dosage}' : '',
                                  style: const TextStyle(
                                    fontSize: 12, fontWeight: FontWeight.w400,
                                    color: AppColors.textGrey,
                                  ),
                                ),
                              ]),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: sBg,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(mainAxisSize: MainAxisSize.min, children: [
                              Text(sLabel,
                                  style: TextStyle(fontSize: 12,
                                      color: sColor, fontWeight: FontWeight.w700)),
                              const SizedBox(width: 4),
                              Icon(
                                sLabel.toLowerCase() == 'ready'
                                    ? Icons.check_circle
                                    : sLabel.toLowerCase() == 'in transit'
                                        ? Icons.local_shipping_outlined
                                        : Icons.info_outline,
                                size: 14, color: sColor,
                              ),
                            ]),
                          ),
                        ],
                      ),

                      const SizedBox(height: 10),

                      // dosage chips row
                      Wrap(spacing: 8, runSpacing: 6,
                        children: _dosageChips()
                            .map((c) => _DosageChip(icon: c.icon, label: c.label))
                            .toList(),
                      ),

                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // ── order date / prescribed by / pharmacy ──────────────────────
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Order Date — use createdDate (orderDate is often null)
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Order Date :',
                        style: TextStyle(fontSize: 10, color: AppColors.textGrey)),
                    const SizedBox(height: 2),
                    Text(
                      _formatDate(o.createdDate),
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _isNullDate(o.createdDate)
                            ? AppColors.textLight
                            : AppColors.textDark,
                        fontStyle: _isNullDate(o.createdDate)
                            ? FontStyle.italic
                            : FontStyle.normal,
                      ),
                    ),
                  ]),
                ),
                // Prescribed By
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Prescribed By :',
                        style: TextStyle(fontSize: 10, color: AppColors.textGrey)),
                    const SizedBox(height: 2),
                    Text(o.doctorName,
                        style: const TextStyle(fontSize: 12,
                            fontWeight: FontWeight.w600, color: AppColors.textDark),
                        overflow: TextOverflow.ellipsis),
                  ]),
                ),
                // Pharmacy
                Expanded(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.location_on_outlined,
                          size: 14, color: AppColors.primary),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(o.pharmacyName,
                              style: const TextStyle(fontSize: 11,
                                  fontWeight: FontWeight.w600, color: AppColors.textDark),
                              overflow: TextOverflow.ellipsis),
                          const Text('Pharmacy',
                              style: TextStyle(fontSize: 10, color: AppColors.textGrey)),
                        ]),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // ── action buttons ─────────────────────────────────────────────
            Row(
              children: [
                if (!isCancelled) ...[
                  Expanded(
                    flex: 4,
                    child: OutlinedButton.icon(
                      onPressed: () => _showRefillSheet(context),
                      icon: const Icon(Icons.refresh, size: 15),
                      label: const Text('Request Refill',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: const BorderSide(color: AppColors.primary, width: 1.5),
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30)),
                      ).copyWith(
                        foregroundColor: WidgetStateProperty.all(Colors.white),
                        backgroundColor: WidgetStateProperty.all(AppColors.primary),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  flex: 5,
                  child: OutlinedButton(
                    onPressed: () => _showDetails(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.primary, width: 1.5),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Text('View Details',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        SizedBox(width: 6),
                        Icon(Icons.arrow_forward, size: 14),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ── Request Refill bottom sheet ─────────────────────────────────────
  void _showRefillSheet(BuildContext context) {
    final o        = order;
    final medName  = o.drugName.isNotEmpty ? o.drugName : 'Prescription';
    final dosage   = o.dosage.isNotEmpty   ? o.dosage   : '';
    final medLabel = dosage.isNotEmpty ? '$medName $dosage' : medName;
    final patient  = o.patientName.isNotEmpty ? o.patientName : 'Patient';
    final doctor   = o.doctorName.isNotEmpty  ? o.doctorName  : '—';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _RefillSheet(
        medicineName: medLabel,
        patientName:  patient,
        doctorName:   doctor,
      ),
    );
  }

  // ── View Details bottom sheet ────────────────────────────────────────────
  void _showDetails(BuildContext context) {
    final o       = order;
    final sColor  = _statusColor(o.orderStatus);
    final sBg     = _statusBg(o.orderStatus);
    final sLabel  = _statusLabel(o.orderStatus);
    final medName = o.drugName.isNotEmpty ? o.drugName : 'Prescription #${o.orderId}';
    final rel     = relationLabel;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.88,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, ctrl) => Container(
          decoration: const BoxDecoration(
            color: Color(0xFFF4F6FB),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              // handle
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40, height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0E0E0),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // header
              Padding(
                padding: const EdgeInsets.fromLTRB(18, 4, 18, 0),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.medication_outlined,
                          color: AppColors.primary, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(medName,
                              style: const TextStyle(fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textDark)),
                          Row(children: [
                            Text('Order #${o.orderId}',
                                style: const TextStyle(
                                    fontSize: 11, color: AppColors.textGrey)),
                            if (rel.isNotEmpty) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 7, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.10),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(rel,
                                    style: const TextStyle(
                                        fontSize: 10,
                                        color: AppColors.primary,
                                        fontWeight: FontWeight.w700)),
                              ),
                            ],
                          ]),
                        ],
                      ),
                    ),
                    // status badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(
                          color: sBg, borderRadius: BorderRadius.circular(20)),
                      child: Text(sLabel,
                          style: TextStyle(fontSize: 12,
                              color: sColor, fontWeight: FontWeight.w700)),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () => Navigator.pop(_),
                      child: const Icon(Icons.close,
                          color: AppColors.textGrey, size: 20),
                    ),
                  ],
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                child: Divider(color: Color(0xFFE5E7EB)),
              ),
              // scrollable body
              Expanded(
                child: ListView(
                  controller: ctrl,
                  padding: const EdgeInsets.fromLTRB(18, 0, 18, 40),
                  children: [

                    // ── Dosage Schedule ──────────────────────────────────────
                    _DetailSection(
                      icon:  Icons.schedule_outlined,
                      title: 'Dosage Schedule',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Wrap(spacing: 8, runSpacing: 8,
                            children: _dosageChips()
                                .map((c) => _DosageChip(icon: c.icon,
                                        label: c.label))
                                .toList(),
                          ),
                          const SizedBox(height: 10),
                          _DRow('Dosage',    o.dosage),
                          _DRow('Frequency', o.frequency),
                          if (o.durationDays > 0)
                            _DRow('Duration', '${o.durationDays} days'),
                          if (!_isNullDate(o.expiryDate))
                            _DRow('Expiry Date', _formatDate(o.expiryDate)),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    // ── Prescription Info ────────────────────────────────────
                    _DetailSection(
                      icon:  Icons.receipt_long_outlined,
                      title: 'Prescription Info',
                      child: Column(
                        children: [
                          _DRow('Drug Name',  o.drugName.isNotEmpty
                              ? o.drugName : 'Not specified'),
                          _DRow('Order ID',   '#${o.orderId}'),
                          _DRow('Order Date', _formatDate(o.createdDate),
                              valueColor: _isNullDate(o.createdDate)
                                  ? AppColors.textLight : null,
                              italic: _isNullDate(o.createdDate)),
                          _DRow('Status',     o.orderStatus),
                          if (!_isNullDate(o.updatedDate))
                            _DRow('Updated',  _formatDate(o.updatedDate)),
                          if (o.cancelReason != null &&
                              (o.cancelReason).isNotEmpty)
                            _DRow('Cancel Reason', o.cancelReason,
                                valueColor: Colors.redAccent),
                          if (!_isNullDate(o.cancelledDate))
                            _DRow('Cancelled On', _formatDate(o.cancelledDate),
                                valueColor: Colors.redAccent),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    // ── Patient ──────────────────────────────────────────────
                    _DetailSection(
                      icon:  Icons.people_outline,
                      title: 'Patient',
                      child: Column(
                        children: [
                          _DRow('Patient Name', o.patientName),
                          _DRow('Patient ID',   '#${o.patientId}'),
                          if (rel.isNotEmpty)
                            _DRow('Relation',   rel),
                          if (o.gender.isNotEmpty)
                            _DRow('Gender',     o.gender),
                          if (!_isNullDate(o.dateOfBirth))
                            _DRow('Date of Birth', _formatDate(o.dateOfBirth)),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    // ── Doctor ───────────────────────────────────────────────
                    _DetailSection(
                      icon:  Icons.person_outline,
                      title: 'Prescribed By',
                      child: Column(
                        children: [
                          _DRow('Doctor',       o.doctorName),
                          _DRow('Associate ID', '#${o.associateId}'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    // ── Pharmacy ─────────────────────────────────────────────
                    _DetailSection(
                      icon:  Icons.local_pharmacy_outlined,
                      title: 'Pharmacy',
                      child: Column(
                        children: [
                          _DRow('Pharmacy Name',   o.pharmacyName),
                          if (o.pharmacistName.isNotEmpty)
                            _DRow('Pharmacist',    o.pharmacistName),
                          if (o.pharmacyMobile.isNotEmpty)
                            _DRow('Phone',         o.pharmacyMobile),
                          if (o.pharmacyAddress.isNotEmpty)
                            _DRow('Address',       o.pharmacyAddress),
                          _DRow('Pharmacy ID',     '#${o.pharmacyId}'),
                        ],
                      ),
                    ),

                    // ── Instructions ─────────────────────────────────────────
                    const SizedBox(height: 12),
                    _DetailSection(
                      icon:  Icons.info_outline,
                      title: 'Instructions',
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: o.instructions.isNotEmpty
                              ? AppColors.primary.withOpacity(0.05)
                              : const Color(0xFFF9F9F9),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: o.instructions.isNotEmpty
                                ? AppColors.primary.withOpacity(0.15)
                                : const Color(0xFFE5E7EB),
                          ),
                        ),
                        child: Text(
                          o.instructions.isNotEmpty
                              ? o.instructions
                              : 'No instructions provided.',
                          style: TextStyle(
                            fontSize: 13,
                            color: o.instructions.isNotEmpty
                                ? AppColors.textDark
                                : AppColors.textLight,
                            height: 1.6,
                            fontStyle: o.instructions.isNotEmpty
                                ? FontStyle.normal
                                : FontStyle.italic,
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
      ),
    );
  }

  bool _isNullDate(String raw) =>
      raw.isEmpty || raw.startsWith('0001');

  String _formatDate(String raw) {
    if (_isNullDate(raw)) return 'Not Available';
    try {
      final datePart = raw.split('T').first.split(' ').first;
      final parts = datePart.contains('/')
          ? datePart.split('/')
          : datePart.split('-');
      if (parts.length == 3) {
        const months = ['','Jan','Feb','Mar','Apr','May','Jun',
                        'Jul','Aug','Sep','Oct','Nov','Dec'];
        if (datePart.contains('/')) {
          final m = int.tryParse(parts[0]) ?? 0;
          final d = int.tryParse(parts[1]) ?? 0;
          final y = parts[2];
          return '${d.toString().padLeft(2,'0')} ${months[m]} $y';
        } else {
          final m = int.tryParse(parts[1]) ?? 0;
          final d = int.tryParse(parts[2]) ?? 0;
          final y = parts[0];
          return '${d.toString().padLeft(2,'0')} ${months[m]} $y';
        }
      }
    } catch (_) {}
    return raw;
  }
}

// ── Detail Section (used in View Details bottom sheet) ──────────────────────

class _DetailSection extends StatelessWidget {
  final IconData icon;
  final String   title;
  final Widget   child;
  const _DetailSection({required this.icon, required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04),
              blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.07),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
            ),
            child: Row(children: [
              Icon(icon, size: 15, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(title,
                  style: const TextStyle(fontSize: 13,
                      fontWeight: FontWeight.w700, color: AppColors.primary)),
            ]),
          ),
          Padding(padding: const EdgeInsets.fromLTRB(14, 10, 14, 14), child: child),
        ],
      ),
    );
  }
}

// ── Detail Row (label + value) ────────────────────────────────────────────

class _DRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  final bool   italic;
  const _DRow(this.label, this.value, {this.valueColor, this.italic = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(label,
                style: const TextStyle(fontSize: 12, color: AppColors.textGrey)),
          ),
          const Text('  ·  ', style: TextStyle(color: AppColors.divider)),
          Expanded(
            child: Text(value.isNotEmpty ? value : '—',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: valueColor ?? AppColors.textDark,
                  fontStyle: italic ? FontStyle.italic : FontStyle.normal,
                )),
          ),
        ],
      ),
    );
  }
}

// ── Dosage Chip ───────────────────────────────────────────────────────────────

class _DosageChip extends StatelessWidget {
  final IconData icon;
  final String   label;
  const _DosageChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFBFDBFE)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 13, color: const Color(0xFF3B82F6)),
        const SizedBox(width: 5),
        Text(label,
            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w500,
                color: Color(0xFF1D4ED8))),
      ]),
    );
  }
}

// ── Pagination ────────────────────────────────────────────────────────────────

class _Pagination extends StatelessWidget {
  final int page;
  final int total;
  final VoidCallback? onPrev;
  final VoidCallback? onNext;

  const _Pagination({
    required this.page,   required this.total,
    required this.onPrev, required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // ← prev
        GestureDetector(
          onTap: onPrev,
          child: Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: onPrev != null ? Colors.white : const Color(0xFFF0F0F0),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: Icon(Icons.chevron_left, size: 18,
                color: onPrev != null ? AppColors.textDark : AppColors.textLight),
          ),
        ),
        const SizedBox(width: 10),

        // page number bubble
        Container(
          width: 32, height: 32,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(
            child: Text('$page',
                style: const TextStyle(fontSize: 13,
                    fontWeight: FontWeight.w700, color: Colors.white)),
          ),
        ),

        const SizedBox(width: 10),

        // → next
        GestureDetector(
          onTap: onNext,
          child: Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: onNext != null ? Colors.white : const Color(0xFFF0F0F0),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: Icon(Icons.chevron_right, size: 18,
                color: onNext != null ? AppColors.textDark : AppColors.textLight),
          ),
        ),
      ],
    );
  }
}

// ── Request Prescription Refill bottom sheet ──────────────────────────────────

class _RefillSheet extends StatefulWidget {
  final String medicineName;
  final String patientName;
  final String doctorName;

  const _RefillSheet({
    required this.medicineName,
    required this.patientName,
    required this.doctorName,
  });

  @override
  State<_RefillSheet> createState() => _RefillSheetState();
}

class _RefillSheetState extends State<_RefillSheet> {
  bool _sending = false;

  Future<void> _send() async {
    setState(() => _sending = true);
    // Simulate API call — replace with real API when available
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(children: const [
          Icon(Icons.check_circle, color: Colors.white, size: 18),
          SizedBox(width: 10),
          Text('Refill request sent! Pharmacy will review it shortly.',
              style: TextStyle(fontSize: 12.5)),
        ]),
        backgroundColor: AppColors.completedGreen,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(12),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 20, right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 28,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          const SizedBox(height: 12),
          Center(
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Close button row
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  width: 30, height: 30,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.close, size: 16,
                      color: AppColors.textGrey),
                ),
              ),
            ],
          ),

          // Icon
          Container(
            width: 64, height: 64,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.10),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.add_box_outlined,
                size: 32, color: AppColors.primary),
          ),
          const SizedBox(height: 14),

          // Title
          const Text(
            'Request Prescription Refill',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'You are about to send a refill request for',
            style: TextStyle(fontSize: 12.5, color: AppColors.textGrey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 18),

          // Info card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FB),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Column(
              children: [
                _RefillRow(label: 'Medicine', value: widget.medicineName,
                    valueColor: AppColors.primary, valueBold: true),
                const SizedBox(height: 10),
                _RefillRow(label: 'Patient',  value: widget.patientName),
                const SizedBox(height: 10),
                _RefillRow(label: 'Doctor',   value: widget.doctorName),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Info notice
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              color: const Color(0xFFEEF2FF),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline,
                    size: 16, color: AppColors.primary.withOpacity(0.75)),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    "The pharmacy will review your request and you'll get notified once approved.",
                    style: TextStyle(fontSize: 12, color: AppColors.textGrey, height: 1.45),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Buttons
          Row(
            children: [
              // Cancel
              Expanded(
                child: OutlinedButton(
                  onPressed: _sending ? null : () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary, width: 1.5),
                    foregroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30)),
                  ),
                  child: const Text('Cancel',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(width: 12),
              // Send Request
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _sending ? null : _send,
                  icon: _sending
                      ? const SizedBox(
                          width: 16, height: 16,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.send_outlined, size: 16),
                  label: Text(_sending ? 'Sending…' : 'Send Request',
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w600)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RefillRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  final bool valueBold;

  const _RefillRow({
    required this.label,
    required this.value,
    this.valueColor,
    this.valueBold = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        SizedBox(
          width: 80,
          child: Text(label,
              style: const TextStyle(
                  fontSize: 13, color: AppColors.textGrey)),
        ),
        Expanded(
          child: Text(
            value.isNotEmpty ? value : '—',
            style: TextStyle(
              fontSize: 13,
              fontWeight: valueBold ? FontWeight.w700 : FontWeight.w600,
              color: valueColor ?? AppColors.textDark,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
