// lib/screens/lab_results_tab.dart

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/lab_result.dart';
import '../services/api_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
//  Lab Results Tab
// ─────────────────────────────────────────────────────────────────────────────

class LabResultsTab extends StatefulWidget {
  const LabResultsTab({super.key});

  @override
  State<LabResultsTab> createState() => _LabResultsTabState();
}

class _LabResultsTabState extends State<LabResultsTab> {
  List<LabResult> _all      = [];
  List<LabResult> _filtered = [];
  bool            _loading  = true;
  String?         _error;
  String          _search   = '';
  String          _sortKey  = 'Default';
  int             _page     = 1;
  static const    _perPage  = 5;

  static const _sortOptions = [
    'Default',
    'Patient Name A-Z',
    'Patient Name Z-A',
    'Latest Report',
    'Oldest Report',
    'Test Name A-Z',
    'Test Name Z-A',
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  // ── data loading ────────────────────────────────────────────────────────────

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final raw = await ApiService.fetchLabResults();
      if (!mounted) return;
      final data = raw.map(LabResult.fromJson).toList();
      setState(() {
        _all      = data;
        _filtered = List.from(data);
        _loading  = false;
        _page     = 1;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  // ── filter / sort ───────────────────────────────────────────────────────────

  void _applyFilter(String query) {
    _search = query;
    final q = query.toLowerCase();
    setState(() {
      _filtered = _all.where((r) =>
        r.patientName.toLowerCase().contains(q)  ||
        r.testName.toLowerCase().contains(q)     ||
        r.testCode.toLowerCase().contains(q)     ||
        r.labName.toLowerCase().contains(q)      ||
        r.resultValue.toLowerCase().contains(q),
      ).toList();
      _page = 1;
      _applySort(_sortKey, notify: false);
    });
  }

  void _applySort(String key, {bool notify = true}) {
    if (notify) setState(() { _sortKey = key; _page = 1; });
    switch (key) {
      case 'Patient Name A-Z':
        _filtered.sort((a, b) =>
            a.patientName.toLowerCase().compareTo(b.patientName.toLowerCase()));
        break;
      case 'Patient Name Z-A':
        _filtered.sort((a, b) =>
            b.patientName.toLowerCase().compareTo(a.patientName.toLowerCase()));
        break;
      case 'Latest Report':
        _filtered.sort((a, b) => b.resultId.compareTo(a.resultId));
        break;
      case 'Oldest Report':
        _filtered.sort((a, b) => a.resultId.compareTo(b.resultId));
        break;
      case 'Test Name A-Z':
        _filtered.sort((a, b) =>
            a.testName.toLowerCase().compareTo(b.testName.toLowerCase()));
        break;
      case 'Test Name Z-A':
        _filtered.sort((a, b) =>
            b.testName.toLowerCase().compareTo(a.testName.toLowerCase()));
        break;
    }
  }

  // ── counts ──────────────────────────────────────────────────────────────────

  int _countByStatus(String s) =>
      _all.where((r) => r.resultStatus.toLowerCase() == s.toLowerCase()).length;

  // ── pagination ──────────────────────────────────────────────────────────────

  List<LabResult> get _paginated {
    final start = (_page - 1) * _perPage;
    final end   = (start + _perPage).clamp(0, _filtered.length);
    return start >= _filtered.length ? [] : _filtered.sublist(start, end);
  }

  int get _totalPages =>
      (_filtered.length / _perPage).ceil().clamp(1, 9999);

  // ── build ───────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: AppColors.primary));
    }

    if (_error != null) {
      return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
          const SizedBox(height: 12),
          Text(_error!,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textGrey)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _load,
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Retry',
                style: TextStyle(color: Colors.white)),
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

                // ── page header ──────────────────────────────────────────────
                const SizedBox(height: 16),
                Row(children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.biotech_outlined,
                        color: AppColors.primary, size: 24),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Lab Results',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark)),
                      Text('Track your lab results and reports',
                          style: TextStyle(
                              fontSize: 11.5,
                              color: AppColors.textGrey)),
                    ],
                  ),
                ]),

                const SizedBox(height: 18),

                // ── summary stats row ────────────────────────────────────────
                Row(children: [
                  _StatCard(
                    icon: Icons.science_outlined,
                    iconColor: AppColors.primary,
                    iconBg: const Color(0xFFEEF2FF),
                    count: _all.length,
                    label: 'Total Tests',
                    sub:   'All reports',
                  ),
                  const SizedBox(width: 10),
                  _StatCard(
                    icon: Icons.warning_amber_rounded,
                    iconColor: const Color(0xFFDC2626),
                    iconBg: const Color(0xFFFFEBEB),
                    count: _countByStatus('Critical') +
                           _countByStatus('Out of Range'),
                    label: 'Critical',
                    sub:   'Needs attention',
                  ),
                  const SizedBox(width: 10),
                  _StatCard(
                    icon: Icons.hourglass_top_outlined,
                    iconColor: AppColors.upcomingAmber,
                    iconBg: AppColors.upcomingBg,
                    count: _countByStatus('Pending'),
                    label: 'Pending',
                    sub:   'Awaiting results',
                  ),
                ]),

                const SizedBox(height: 18),

                // ── search + sort row ────────────────────────────────────────
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
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.textDark),
                        decoration: const InputDecoration(
                          hintText: 'Search by test name, patient, etc ...',
                          hintStyle: TextStyle(
                              fontSize: 12.5, color: AppColors.textLight),
                          prefixIcon: Icon(Icons.search,
                              size: 19, color: AppColors.textGrey),
                          border: InputBorder.none,
                          contentPadding:
                              EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  _SortButton(
                    currentSort: _sortKey,
                    options: _sortOptions,
                    onSelect: (v) {
                      setState(() {
                        _sortKey  = v;
                        _filtered = _all.where((r) {
                          final q = _search.toLowerCase();
                          return q.isEmpty ||
                            r.patientName.toLowerCase().contains(q)  ||
                            r.testName.toLowerCase().contains(q)     ||
                            r.testCode.toLowerCase().contains(q)     ||
                            r.labName.toLowerCase().contains(q)      ||
                            r.resultValue.toLowerCase().contains(q);
                        }).toList();
                        _page = 1;
                      });
                      _applySort(v, notify: false);
                    },
                  ),
                ]),

                const SizedBox(height: 16),

                // ── result cards ─────────────────────────────────────────────
                if (paginated.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Center(
                      child: Text('No lab results found',
                          style: TextStyle(
                              fontSize: 14, color: AppColors.textGrey)),
                    ),
                  )
                else
                  ...paginated.map((r) => _LabResultCard(result: r)),

                // ── no-more label + pagination ───────────────────────────────
                const SizedBox(height: 4),
                const Center(
                  child: Text('No More prescriptions to show',
                      style: TextStyle(
                          fontSize: 12, color: AppColors.textLight)),
                ),
                const SizedBox(height: 16),
                _Pagination(
                  page:   _page,
                  total:  _totalPages,
                  onPrev: _page > 1
                      ? () => setState(() => _page--)
                      : null,
                  onNext: _page < _totalPages
                      ? () => setState(() => _page++)
                      : null,
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

// ─────────────────────────────────────────────────────────────────────────────
//  Sort Button
// ─────────────────────────────────────────────────────────────────────────────

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
      constraints: const BoxConstraints(minWidth: 210),
      itemBuilder: (_) => options
          .where((o) => o != 'Default')
          .map((opt) {
            final selected = currentSort == opt;
            return PopupMenuItem<String>(
              value: opt,
              height: 44,
              padding: EdgeInsets.zero,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 2),
                child: Row(children: [
                  Icon(
                    selected
                        ? Icons.radio_button_checked
                        : Icons.radio_button_unchecked,
                    size: 18,
                    color: selected
                        ? AppColors.primary
                        : AppColors.textGrey,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(opt,
                        style: TextStyle(
                          fontSize: 13,
                          color: selected
                              ? AppColors.primary
                              : AppColors.textDark,
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.w400,
                        )),
                  ),
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
              color:
                  isActive ? AppColors.primary : AppColors.textGrey),
          const SizedBox(width: 6),
          Text(
            isActive ? currentSort : 'Sort By',
            style: TextStyle(
              fontSize: 12.5,
              fontWeight:
                  isActive ? FontWeight.w600 : FontWeight.w500,
              color: isActive
                  ? AppColors.primary
                  : AppColors.textDark,
            ),
          ),
          const SizedBox(width: 4),
          Icon(
            Icons.keyboard_arrow_up,
            size: 16,
            color:
                isActive ? AppColors.primary : AppColors.textGrey,
          ),
        ]),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Stat Card
// ─────────────────────────────────────────────────────────────────────────────

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color    iconColor;
  final Color    iconBg;
  final int      count;
  final String   label;
  final String   sub;

  const _StatCard({
    required this.icon,      required this.iconColor,
    required this.iconBg,    required this.count,
    required this.label,     required this.sub,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding:
            const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 8,
                offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 32, height: 32,
              decoration:
                  BoxDecoration(color: iconBg, shape: BoxShape.circle),
              child: Icon(icon, size: 17, color: iconColor),
            ),
            const SizedBox(height: 8),
            Text('$count',
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: iconColor)),
            Text(label,
                style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark),
                overflow: TextOverflow.ellipsis),
            Text(sub,
                style: const TextStyle(
                    fontSize: 10, color: AppColors.textGrey),
                overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Lab Result Card
// ─────────────────────────────────────────────────────────────────────────────

class _LabResultCard extends StatelessWidget {
  final LabResult result;
  const _LabResultCard({required this.result});

  // ── status helpers ──────────────────────────────────────────────────────────

  Color _statusColor(String s) {
    switch (s.toLowerCase()) {
      case 'critical':     return const Color(0xFFDC2626);
      case 'out of range': return const Color(0xFFEA580C);
      case 'pending':      return const Color(0xFFD97706);
      case 'normal':       return AppColors.completedGreen;
      default:             return AppColors.textGrey;
    }
  }

  Color _statusBg(String s) {
    switch (s.toLowerCase()) {
      case 'critical':     return const Color(0xFFFFEBEB);
      case 'out of range': return const Color(0xFFFFF3E0);
      case 'pending':      return const Color(0xFFFEF3C7);
      case 'normal':       return const Color(0xFFDCFCE7);
      default:             return const Color(0xFFF0F0F0);
    }
  }

  IconData _statusIcon(String s) {
    switch (s.toLowerCase()) {
      case 'critical':     return Icons.error_rounded;
      case 'out of range': return Icons.trending_up;
      case 'pending':      return Icons.hourglass_top_outlined;
      case 'normal':       return Icons.check_circle_outline;
      default:             return Icons.info_outline;
    }
  }

  bool get _showStatusBadge {
    final s = result.resultStatus.toLowerCase();
    return s == 'critical' || s == 'out of range' || s == 'pending';
  }

  @override
  Widget build(BuildContext context) {
    final r       = result;
    final sColor  = _statusColor(r.resultStatus);
    final sBg     = _statusBg(r.resultStatus);
    final sIcon   = _statusIcon(r.resultStatus);
    final showBadge = _showStatusBadge;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.07),
              blurRadius: 10,
              offset: const Offset(0, 3)),
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

                // left: avatar + name
                SizedBox(
                  width: 62,
                  child: Column(
                    children: [
                      const CircleAvatar(
                        radius: 24,
                        backgroundColor: Color(0xFFE8E8E8),
                        child: Icon(Icons.person,
                            size: 26, color: Color(0xFF9E9E9E)),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        r.patientName.split(' ').first,
                        style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark),
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 12),

                // right: test name + badge + date + lab
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      // test name + status badge
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              r.testName,
                              style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textDark),
                            ),
                          ),
                          if (showBadge) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 5),
                              decoration: BoxDecoration(
                                color: sBg,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      r.resultStatus == 'Out of Range'
                                          ? 'Critical\nOut of Range'
                                          : r.resultStatus,
                                      style: TextStyle(
                                          fontSize: 10.5,
                                          color: sColor,
                                          fontWeight: FontWeight.w700,
                                          height: 1.2),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(width: 4),
                                    Icon(sIcon, size: 14, color: sColor),
                                  ]),
                            ),
                          ],
                        ],
                      ),

                      const SizedBox(height: 8),

                      // date + lab name row
                      Row(children: [
                        const Icon(Icons.calendar_today_outlined,
                            size: 13, color: AppColors.primary),
                        const SizedBox(width: 4),
                        Text(r.reportDate,
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textGrey,
                                fontWeight: FontWeight.w500)),
                        const SizedBox(width: 16),
                        const Icon(Icons.business_outlined,
                            size: 13, color: AppColors.primary),
                        const SizedBox(width: 4),
                        Text(r.labName,
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textGrey,
                                fontWeight: FontWeight.w500)),
                      ]),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // ── result value / reference range / test code row ─────────────
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Result Value
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    const Text('Result Value :',
                        style: TextStyle(
                            fontSize: 10, color: AppColors.textGrey)),
                    const SizedBox(height: 2),
                    Text(r.resultValue,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textDark)),
                  ]),
                ),
                // Reference Range
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    const Text('Reference Range :',
                        style: TextStyle(
                            fontSize: 10, color: AppColors.textGrey)),
                    const SizedBox(height: 2),
                    Text(r.referenceRange,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textDark)),
                  ]),
                ),
                // Test Code (only when non-empty)
                if (r.testCode.isNotEmpty)
                  Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      const Text('Test Code :',
                          style: TextStyle(
                              fontSize: 10, color: AppColors.textGrey)),
                      const SizedBox(height: 2),
                      Text(r.testCode,
                          style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textDark)),
                    ]),
                  ),
              ],
            ),

            const SizedBox(height: 12),

            // ── View Details button ────────────────────────────────────────
            OutlinedButton(
              onPressed: () => _showDetails(context),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(
                    color: AppColors.primary, width: 1.5),
                padding: const EdgeInsets.symmetric(vertical: 10),
                minimumSize: const Size(double.infinity, 40),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('View Details',
                      style: TextStyle(
                          fontSize: 12, fontWeight: FontWeight.w600)),
                  SizedBox(width: 6),
                  Icon(Icons.arrow_forward, size: 14),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── View Details bottom sheet ───────────────────────────────────────────────

  void _showDetails(BuildContext context) {
    final r      = result;
    final sColor = _statusColor(r.resultStatus);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Padding(
          // keeps the sheet above the keyboard if ever needed
          padding: EdgeInsets.only(
              bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius:
                  BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [

                // ── drag handle ───────────────────────────────────────────
                const SizedBox(height: 10),
                Center(
                  child: Container(
                    width: 36, height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFDDDDDD),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // ── title bar ─────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Billing Details',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textDark,
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.pop(ctx),
                        child: Container(
                          width: 30, height: 30,
                          decoration: const BoxDecoration(
                            color: Color(0xFFF5F5F5),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.close,
                              size: 17, color: AppColors.textDark),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),
                const Divider(height: 1, thickness: 1,
                    color: Color(0xFFF0F0F0)),

                // ── Lab Reports section header ─────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  child: Row(
                    children: [
                      Container(
                        width: 32, height: 32,
                        decoration: BoxDecoration(
                          color: const Color(0xFFEEF2FF),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.biotech,
                            color: AppColors.primary, size: 18),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Lab Reports',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),

                // ── detail rows ───────────────────────────────────────────
                _BillingRow(
                  label: 'Patient Name',
                  value: r.patientName,
                ),
                _BillingRow(
                  label: 'Visit Date',
                  value: r.reportDate,
                ),
                _BillingRow(
                  label: 'Lab',
                  value: r.labName,
                ),
                if (r.testCode.isNotEmpty)
                  _BillingRow(
                    label: 'Test Code',
                    value: r.testCode,
                  ),
                _BillingRow(
                  label: 'Status',
                  value: r.resultStatus,
                  valueColor: sColor,
                  bold: true,
                ),
                _BillingRow(
                  label: 'Reference Range',
                  value: r.referenceRange,
                ),
                _BillingRow(
                  label: 'Result Value',
                  value: r.resultValue,
                  isLast: true,
                ),

                const SizedBox(height: 20),

                // ── Download PDF button ───────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
                  child: OutlinedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(ctx).showSnackBar(
                        SnackBar(
                          content: const Row(children: [
                            Icon(Icons.download_done_rounded,
                                color: Colors.white, size: 18),
                            SizedBox(width: 10),
                            Text('PDF download will be available soon.',
                                style: TextStyle(fontSize: 13)),
                          ]),
                          backgroundColor: AppColors.primary,
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                          margin: const EdgeInsets.all(12),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                    icon: const Icon(Icons.download_outlined,
                        size: 18, color: AppColors.primary),
                    label: const Text(
                      'Download PDF',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(
                          color: AppColors.primary, width: 1.5),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Billing Row  (table row with full-width divider — matches the screenshot)
// ─────────────────────────────────────────────────────────────────────────────

class _BillingRow extends StatelessWidget {
  final String  label;
  final String  value;
  final Color?  valueColor;
  final bool    bold;
  final bool    isLast;

  const _BillingRow({
    required this.label,
    required this.value,
    this.valueColor,
    this.bold   = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),
        Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: 20, vertical: 13),
          child: Row(
            children: [
              Expanded(
                flex: 4,
                child: Text(
                  label,
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textGrey,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
              Expanded(
                flex: 5,
                child: Text(
                  value,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight:
                        bold ? FontWeight.w700 : FontWeight.w500,
                    color: valueColor ?? AppColors.textDark,
                  ),
                ),
              ),
            ],
          ),
        ),
        if (isLast)
          const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Pagination
// ─────────────────────────────────────────────────────────────────────────────

class _Pagination extends StatelessWidget {
  final int           page;
  final int           total;
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
              color: onPrev != null
                  ? Colors.white
                  : const Color(0xFFF0F0F0),
              borderRadius: BorderRadius.circular(8),
              border:
                  Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: Icon(Icons.chevron_left,
                size: 18,
                color: onPrev != null
                    ? AppColors.textDark
                    : AppColors.textLight),
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
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.white)),
          ),
        ),

        const SizedBox(width: 10),

        // → next
        GestureDetector(
          onTap: onNext,
          child: Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: onNext != null
                  ? Colors.white
                  : const Color(0xFFF0F0F0),
              borderRadius: BorderRadius.circular(8),
              border:
                  Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: Icon(Icons.chevron_right,
                size: 18,
                color: onNext != null
                    ? AppColors.textDark
                    : AppColors.textLight),
          ),
        ),
      ],
    );
  }
}
