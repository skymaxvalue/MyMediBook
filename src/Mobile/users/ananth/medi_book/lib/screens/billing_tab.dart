// lib/screens/billing_tab.dart

import 'package:flutter/material.dart';

import '../app_colors.dart';
import '../models/bill.dart';
import '../services/api_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
//  Billing Tab
// ─────────────────────────────────────────────────────────────────────────────

class BillingTab extends StatefulWidget {
  const BillingTab({super.key});

  @override
  State<BillingTab> createState() => _BillingTabState();
}

class _BillingTabState extends State<BillingTab> {
  List<Bill> _all      = [];
  List<Bill> _filtered = [];
  bool       _loading  = true;
  String?    _error;
  String     _search   = '';
  String     _sortKey  = 'Default';
  int        _page     = 1;
  static const _perPage = 5;

  static const _sortOptions = [
    'Default',
    'Name A-Z',
    'Name Z-A',
    'Newest Visit',
    'Oldest Visit',
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  // ── data ────────────────────────────────────────────────────────────────────

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final raw = await ApiService.fetchBills();
      if (!mounted) return;
      // Bill.fromApiJson parses the nested API shape from GetBillingListByPatientId
      // (Previously used Bill.fromJson for mock data — kept commented in bill.dart)
      final bills = raw.map(Bill.fromApiJson).toList();
      setState(() {
        _all      = bills;
        _filtered = List.from(bills);
        _loading  = false;
        _page     = 1;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  // ── filter / sort ────────────────────────────────────────────────────────────

  void _applyFilter(String query) {
    _search = query;
    final q = query.toLowerCase();
    setState(() {
      _filtered = _all.where((b) =>
        b.patientName.toLowerCase().contains(q) ||
        b.doctorName.toLowerCase().contains(q)  ||
        b.clinicName.toLowerCase().contains(q)  ||
        b.status.toLowerCase().contains(q),
      ).toList();
      _page = 1;
      _applySort(_sortKey, notify: false);
    });
  }

  void _applySort(String key, {bool notify = true}) {
    if (notify) setState(() { _sortKey = key; _page = 1; });
    switch (key) {
      case 'Name A-Z':
        _filtered.sort((a, b) => a.patientName.toLowerCase().compareTo(b.patientName.toLowerCase()));
        break;
      case 'Name Z-A':
        _filtered.sort((a, b) => b.patientName.toLowerCase().compareTo(a.patientName.toLowerCase()));
        break;
      case 'Newest Visit':
        _filtered.sort((a, b) => b.billId.compareTo(a.billId));
        break;
      case 'Oldest Visit':
        _filtered.sort((a, b) => a.billId.compareTo(b.billId));
        break;
    }
  }


  // ── pagination ───────────────────────────────────────────────────────────────

  List<Bill> get _paginated {
    final start = (_page - 1) * _perPage;
    final end   = (start + _perPage).clamp(0, _filtered.length);
    return start >= _filtered.length ? [] : _filtered.sublist(start, end);
  }

  int get _totalPages =>
      (_filtered.length / _perPage).ceil().clamp(1, 9999);

  // ── build ────────────────────────────────────────────────────────────────────

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

                // ── page header ───────────────────────────────────────────────
                const SizedBox(height: 16),
                Row(children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Image.asset(
                        'assets/images/billing-icon.png',
                        width: 26, height: 26,
                        fit: BoxFit.contain,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Billing',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark)),
                      Text('View your bills and payment details',
                          style: TextStyle(
                              fontSize: 11.5,
                              color: AppColors.textGrey)),
                    ],
                  ),
                ]),



                // ── search + sort ─────────────────────────────────────────────
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
                          hintText: 'Search by medicine name, etc...',
                          hintStyle: TextStyle(fontSize: 12.5, color: AppColors.textLight),
                          prefixIcon: Icon(Icons.search, size: 19, color: AppColors.textGrey),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
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
                        _filtered = _all.where((b) {
                          final q = _search.toLowerCase();
                          return q.isEmpty ||
                            b.patientName.toLowerCase().contains(q) ||
                            b.doctorName.toLowerCase().contains(q)  ||
                            b.clinicName.toLowerCase().contains(q)  ||
                            b.status.toLowerCase().contains(q);
                        }).toList();
                        _page = 1;
                      });
                      _applySort(v, notify: false);
                    },
                  ),
                ]),

                const SizedBox(height: 16),

                // ── bill cards ───────────────────────────────────────────────
                if (paginated.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Center(
                      child: Text('No bills found',
                          style: TextStyle(fontSize: 14, color: AppColors.textGrey)),
                    ),
                  )
                else
                  ...paginated.map((b) => _BillCard(bill: b)),

                // ── footer ───────────────────────────────────────────────────
                const SizedBox(height: 4),
                const Center(
                  child: Text('No More bills to show',
                      style: TextStyle(fontSize: 12, color: AppColors.textLight)),
                ),
                const SizedBox(height: 16),
                _Pagination(
                  page:   _page,
                  total:  _totalPages,
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
      constraints: const BoxConstraints(minWidth: 190),
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
                  Icon(
                    selected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                    size: 18,
                    color: selected ? AppColors.primary : AppColors.textGrey,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(opt,
                        style: TextStyle(
                          fontSize: 13,
                          color: selected ? AppColors.primary : AppColors.textDark,
                          fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
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
          Icon(Icons.keyboard_arrow_up, size: 16,
              color: isActive ? AppColors.primary : AppColors.textGrey),
        ]),
      ),
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//  Bill Card
// ─────────────────────────────────────────────────────────────────────────────

class _BillCard extends StatelessWidget {
  final Bill bill;
  const _BillCard({required this.bill});

  Color _statusColor(String s) {
    switch (s.toLowerCase()) {
      case 'paid':    return const Color(0xFF16A34A);
      case 'overdue': return const Color(0xFFDC2626);
      case 'denied':  return const Color(0xFFDC2626);
      case 'closed':  return const Color(0xFF6B7280);
      default:        return const Color(0xFFD97706);
    }
  }

  Color _statusBg(String s) {
    switch (s.toLowerCase()) {
      case 'paid':    return const Color(0xFFDCFCE7);
      case 'overdue': return const Color(0xFFFFEBEB);
      case 'denied':  return const Color(0xFFFFEBEB);
      case 'closed':  return const Color(0xFFF3F4F6);
      default:        return const Color(0xFFFEF3C7);
    }
  }

  IconData _statusIcon(String s) {
    switch (s.toLowerCase()) {
      case 'paid':    return Icons.check_circle_rounded;
      case 'overdue': return Icons.error_rounded;
      case 'denied':  return Icons.cancel_rounded;
      case 'closed':  return Icons.lock_rounded;
      default:        return Icons.timelapse_rounded;
    }
  }

  String _fmtAmt(double v, String currency) {
    final sym = currency == 'USD' ? '\$' : '₹';
    return '$sym${v.toStringAsFixed(0)}';
  }

  @override
  Widget build(BuildContext context) {
    final b       = bill;
    final primary = b.claims.isNotEmpty ? b.claims.first : null;
    final sColor  = _statusColor(b.status);
    final sBg     = _statusBg(b.status);
    final sIcon   = _statusIcon(b.status);
    final balColor = b.remainingBalance == 0
        ? const Color(0xFF16A34A)
        : const Color(0xFFDC2626);
    final cur = b.currencyCode;

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

            // ── top: claim ID + status badge ──────────────────────────────────
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Center(
                    child: Icon(Icons.receipt_long_outlined,
                        size: 22, color: AppColors.primary),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Claim #${b.billId}',
                          style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textDark)),
                      if (primary != null)
                        Text('Appt #${primary.appointmentId}  •  ${b.currencyCode}',
                            style: const TextStyle(
                                fontSize: 11, color: AppColors.textGrey)),
                    ],
                  ),
                ),
                // Status badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                  decoration: BoxDecoration(
                    color: sBg,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    Text(b.status,
                        style: TextStyle(
                            fontSize: 11,
                            color: sColor,
                            fontWeight: FontWeight.w700)),
                    const SizedBox(width: 4),
                    Icon(sIcon, size: 13, color: sColor),
                  ]),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // ── line items summary chips ───────────────────────────────────────
            if (b.lineItems.isNotEmpty) ...[
              Wrap(
                spacing: 6, runSpacing: 4,
                children: b.lineItems.map((li) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0F4FF),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFD4DDFF)),
                  ),
                  child: Text(li.serviceCategory,
                      style: const TextStyle(
                          fontSize: 10.5,
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600)),
                )).toList(),
              ),
              const SizedBox(height: 10),
            ],

            // ── amounts row ───────────────────────────────────────────────────
            Row(children: [
              _AmountCol(label: 'Total Charge',
                  value: _fmtAmt(b.totalCharge, cur)),
              _AmountCol(label: 'Ins. Covered',
                  value: _fmtAmt(b.insuranceCovered, cur)),
              _AmountCol(label: 'Adjustments',
                  value: _fmtAmt(b.adjustments, cur)),
              _AmountCol(label: 'Patient Resp.',
                  value: _fmtAmt(b.patientResponsibility, cur)),
            ]),

            const SizedBox(height: 10),

            // ── dates ─────────────────────────────────────────────────────────
            Row(children: [
              const Icon(Icons.event_outlined, size: 12, color: AppColors.primary),
              const SizedBox(width: 4),
              Text('Service: ${b.visitDate}',
                  style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
              const SizedBox(width: 12),
              const Icon(Icons.today_outlined, size: 12, color: AppColors.primary),
              const SizedBox(width: 4),
              Text('Claim: ${b.orderDate}',
                  style: const TextStyle(fontSize: 11, color: AppColors.textGrey)),
            ]),

            const SizedBox(height: 10),

            // ── remaining balance bar ─────────────────────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF7F9FF),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFE8EEF8)),
              ),
              child: Row(children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Payment Date',
                          style: TextStyle(fontSize: 10, color: AppColors.textGrey)),
                      const SizedBox(height: 2),
                      Text(b.paymentDate.isEmpty ? '—' : b.paymentDate,
                          style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text('Remaining Balance',
                        style: TextStyle(fontSize: 10, color: AppColors.textGrey)),
                    const SizedBox(height: 2),
                    Text(_fmtAmt(b.remainingBalance, cur),
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: balColor)),
                  ],
                ),
              ]),
            ),

            const SizedBox(height: 12),

            // ── View Details button ───────────────────────────────────────────
            OutlinedButton(
              onPressed: () => _showDetails(context),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary, width: 1.5),
                padding: const EdgeInsets.symmetric(vertical: 10),
                minimumSize: const Size(double.infinity, 40),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('View Full Details',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
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

  // ── Billing Details bottom sheet ─────────────────────────────────────────────

  void _showDetails(BuildContext context) {
    final b       = bill;
    final primary = b.claims.isNotEmpty ? b.claims.first : null;
    final sColor  = _statusColor(b.status);
    final balColor = b.remainingBalance == 0
        ? const Color(0xFF16A34A)
        : const Color(0xFFDC2626);
    final cur  = b.currencyCode;
    final sym  = cur == 'USD' ? '\$' : '₹';
    String amt(double v) => '$sym${v.toStringAsFixed(0)}';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.92,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          builder: (_, scrollCtrl) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: ListView(
                controller: scrollCtrl,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                children: [

                  // ── drag handle ──────────────────────────────────────────────
                  const SizedBox(height: 10),
                  Center(
                    child: Container(
                      width: 36, height: 4,
                      decoration: BoxDecoration(
                          color: const Color(0xFFDDDDDD),
                          borderRadius: BorderRadius.circular(2)),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // ── title bar ────────────────────────────────────────────────
                  Row(children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Claim #${b.billId}',
                              style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textDark)),
                          if (primary != null)
                            Text('Appointment #${primary.appointmentId}  •  $cur',
                                style: const TextStyle(
                                    fontSize: 12, color: AppColors.textGrey)),
                        ],
                      ),
                    ),
                    // Status pill
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: _statusBg(b.status),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(b.status,
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: sColor)),
                    ),
                    const SizedBox(width: 10),
                    GestureDetector(
                      onTap: () => Navigator.pop(ctx),
                      child: Container(
                        width: 30, height: 30,
                        decoration: const BoxDecoration(
                            color: Color(0xFFF5F5F5), shape: BoxShape.circle),
                        child: const Icon(Icons.close,
                            size: 17, color: AppColors.textDark),
                      ),
                    ),
                  ]),

                  const SizedBox(height: 20),

                  // ── 1. Claim Info ────────────────────────────────────────────
                  _DetailSectionHeader(
                      icon: Icons.description_outlined, title: 'Claim Info'),
                  _InfoCard(children: [
                    if (primary != null) ...[
                      _InfoRow('Claim ID',        '#${primary.claimId}'),
                      _InfoRow('Appointment ID',  '#${primary.appointmentId}'),
                      _InfoRow('Profile ID',      '#${primary.profileId}'),
                      _InfoRow('Date of Service', _fmtIso(primary.dateOfService)),
                      _InfoRow('Claim Date',      _fmtIso(primary.claimDate)),
                      _InfoRow('Currency',        primary.currencyCode),
                      _InfoRow('Status',          primary.claimStatus,
                          valueColor: sColor),
                    ],
                  ]),

                  const SizedBox(height: 16),

                  // ── 2. Line Items ────────────────────────────────────────────
                  _DetailSectionHeader(
                      icon: Icons.list_alt_outlined,
                      title: 'Line Items (${b.lineItems.length})'),

                  ...b.lineItems.map((li) => _LineItemCard(li: li, sym: sym)),

                  if (b.lineItems.isEmpty)
                    _EmptyNotice('No line items recorded'),

                  const SizedBox(height: 16),

                  // ── 3. Insurance Payments ────────────────────────────────────
                  _DetailSectionHeader(
                      icon: Icons.shield_outlined,
                      title: 'Insurance Payments (${b.insurancePayments.length})'),

                  if (b.insurancePayments.isEmpty)
                    _EmptyNotice('No insurance payments recorded')
                  else
                    _InfoCard(children: [
                      ...b.insurancePayments.map((p) => Column(
                        children: [
                          _InfoRow('Reference',     p.paymentReference),
                          _InfoRow('Paid Amount',   amt(p.paidAmount),
                              valueColor: const Color(0xFF16A34A)),
                          _InfoRow('Payment Date',  _fmtIso(p.paymentDate)),
                          if (p != b.insurancePayments.last)
                            const Divider(
                                height: 16, thickness: 1,
                                color: Color(0xFFE8EEF8)),
                        ],
                      )),
                    ]),

                  const SizedBox(height: 16),

                  // ── 4. Adjustments ───────────────────────────────────────────
                  _DetailSectionHeader(
                      icon: Icons.tune_outlined,
                      title: 'Adjustments (${b.adjustmentList.length})'),

                  if (b.adjustmentList.isEmpty)
                    _EmptyNotice('No adjustments applied')
                  else
                    _InfoCard(children: [
                      ...b.adjustmentList.map((a) => Column(
                        children: [
                          _InfoRow('Code',        a.adjustmentCode),
                          _InfoRow('Description', a.adjustmentDescription),
                          _InfoRow('Amount',      amt(a.adjustmentAmount),
                              valueColor: const Color(0xFF16A34A)),
                          if (a != b.adjustmentList.last)
                            const Divider(
                                height: 16, thickness: 1,
                                color: Color(0xFFE8EEF8)),
                        ],
                      )),
                    ]),

                  const SizedBox(height: 16),

                  // ── 5. Patient Responsibility ────────────────────────────────
                  _DetailSectionHeader(
                      icon: Icons.person_outline,
                      title: 'Patient Responsibility (${b.responsibilityList.length})'),

                  if (b.responsibilityList.isEmpty)
                    _EmptyNotice('No patient responsibility recorded')
                  else
                    _InfoCard(children: [
                      ...b.responsibilityList.map((r) => Column(
                        children: [
                          _InfoRow('Type',   r.type),
                          _InfoRow('Amount', amt(r.amount),
                              valueColor: const Color(0xFFDC2626)),
                          if (r != b.responsibilityList.last)
                            const Divider(
                                height: 16, thickness: 1,
                                color: Color(0xFFE8EEF8)),
                        ],
                      )),
                    ]),

                  const SizedBox(height: 20),

                  // ── 6. Financial Summary ─────────────────────────────────────
                  _DetailSectionHeader(
                      icon: Icons.account_balance_wallet_outlined,
                      title: 'Financial Summary'),
                  Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(children: [
                      _SummaryRow('Total Charge Amount',
                          amt(b.totalCharge), Colors.white70, Colors.white),
                      _SummaryRow('Total Allowed Amount',
                          amt(primary?.totalAllowedAmount ?? 0),
                          Colors.white70, Colors.white),
                      _SummaryRow('Insurance Paid',
                          '-${amt(b.insuranceCovered)}',
                          Colors.white70, const Color(0xFF86EFAC)),
                      _SummaryRow('Adjustments',
                          '-${amt(b.adjustments)}',
                          Colors.white70, const Color(0xFF86EFAC)),
                      const Divider(color: Colors.white24, height: 20),
                      _SummaryRow('Patient Responsibility',
                          amt(b.patientResponsibility),
                          Colors.white70, Colors.white,
                          bold: true),
                      _SummaryRow('Remaining Balance',
                          amt(b.remainingBalance),
                          Colors.white70,
                          b.remainingBalance == 0
                              ? const Color(0xFF86EFAC)
                              : const Color(0xFFFCA5A5),
                          bold: true),
                    ]),
                  ),

                  const SizedBox(height: 20),

                  // ── Download PDF ─────────────────────────────────────────────
                  OutlinedButton.icon(
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
                    label: const Text('Download PDF',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.primary, width: 1.5),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  String _fmtIso(String? iso) {
    if (iso == null || iso.isEmpty) return '—';
    try {
      final dt = DateTime.parse(iso);
      const m = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
      return '${dt.day.toString().padLeft(2,'0')} ${m[dt.month-1]} ${dt.year}';
    } catch (_) { return iso; }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Detail sheet sub-widgets
// ─────────────────────────────────────────────────────────────────────────────

class _DetailSectionHeader extends StatelessWidget {
  final IconData icon;
  final String   title;
  const _DetailSectionHeader({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Row(children: [
      Container(
        width: 30, height: 30,
        decoration: BoxDecoration(
            color: const Color(0xFFEEF2FF),
            borderRadius: BorderRadius.circular(8)),
        child: Icon(icon, color: AppColors.primary, size: 16),
      ),
      const SizedBox(width: 10),
      Text(title,
          style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.primary)),
    ]),
  );
}

class _InfoCard extends StatelessWidget {
  final List<Widget> children;
  const _InfoCard({required this.children});

  @override
  Widget build(BuildContext context) => Container(
    decoration: BoxDecoration(
      color: const Color(0xFFF7F9FF),
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: const Color(0xFFE8EEF8)),
    ),
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    ),
  );
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  const _InfoRow(this.label, this.value, {this.valueColor});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 5),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 140,
          child: Text(label,
              style: const TextStyle(fontSize: 12.5, color: AppColors.textGrey)),
        ),
        Expanded(
          child: Text(value,
              style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                  color: valueColor ?? AppColors.textDark)),
        ),
      ],
    ),
  );
}

class _LineItemCard extends StatelessWidget {
  final BillLineItem li;
  final String       sym;
  const _LineItemCard({required this.li, required this.sym});

  @override
  Widget build(BuildContext context) {
    // Category colour mapping
    Color catColor;
    switch (li.serviceCategory.toLowerCase()) {
      case 'consultation': catColor = const Color(0xFF4F46E5); break;
      case 'lab':          catColor = const Color(0xFF0891B2); break;
      case 'scan':         catColor = const Color(0xFF7C3AED); break;
      case 'surgery':      catColor = const Color(0xFFDC2626); break;
      case 'pharmacy':     catColor = const Color(0xFF16A34A); break;
      case 'nursing':      catColor = const Color(0xFFD97706); break;
      case 'icu':          catColor = const Color(0xFFB91C1C); break;
      case 'bed':          catColor = const Color(0xFF0369A1); break;
      case 'consumable':   catColor = const Color(0xFF65A30D); break;
      default:             catColor = AppColors.primary;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE8EEF8)),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        children: [
          // ── header row ──────────────────────────────────────────────────────
          Container(
            decoration: BoxDecoration(
              color: catColor.withValues(alpha: 0.08),
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(10)),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: catColor,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(li.serviceCategory,
                    style: const TextStyle(
                        fontSize: 10,
                        color: Colors.white,
                        fontWeight: FontWeight.w700)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(li.serviceDescription,
                    style: const TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis),
              ),
            ]),
          ),
          // ── detail row ──────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(children: [
              // CPT code + units
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('CPT Code',
                        style: TextStyle(fontSize: 10, color: AppColors.textGrey)),
                    Text(li.cptCode,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark)),
                    const SizedBox(height: 2),
                    Text('Units: ${li.units}',
                        style: const TextStyle(
                            fontSize: 11, color: AppColors.textGrey)),
                  ],
                ),
              ),
              // Charge / Allowed / Paid
              _AmtStack(label: 'Charge',  value: '$sym${li.chargeAmount.toStringAsFixed(0)}',  color: AppColors.textDark),
              const SizedBox(width: 6),
              _AmtStack(label: 'Allowed', value: '$sym${li.allowedAmount.toStringAsFixed(0)}', color: const Color(0xFF0891B2)),
              const SizedBox(width: 6),
              _AmtStack(label: 'Paid',    value: '$sym${li.paidAmount.toStringAsFixed(0)}',    color: const Color(0xFF16A34A)),
            ]),
          ),
        ],
      ),
    );
  }
}

class _AmtStack extends StatelessWidget {
  final String label;
  final String value;
  final Color  color;
  const _AmtStack({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      Text(label,
          style: const TextStyle(fontSize: 9.5, color: AppColors.textGrey)),
      Text(value,
          style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: color)),
    ],
  );
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final Color  labelColor;
  final Color  valueColor;
  final bool   bold;
  const _SummaryRow(this.label, this.value, this.labelColor, this.valueColor,
      {this.bold = false});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(children: [
      Expanded(
        child: Text(label,
            style: TextStyle(
                fontSize: bold ? 13 : 12,
                color: labelColor,
                fontWeight: bold ? FontWeight.w700 : FontWeight.w400)),
      ),
      Text(value,
          style: TextStyle(
              fontSize: bold ? 14 : 13,
              fontWeight: bold ? FontWeight.w800 : FontWeight.w600,
              color: valueColor)),
    ]),
  );
}

class _EmptyNotice extends StatelessWidget {
  final String message;
  const _EmptyNotice(this.message);

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: const Color(0xFFF7F9FF),
      borderRadius: BorderRadius.circular(10),
      border: Border.all(color: const Color(0xFFE8EEF8)),
    ),
    child: Row(children: [
      const Icon(Icons.info_outline, size: 16, color: AppColors.textLight),
      const SizedBox(width: 8),
      Text(message,
          style: const TextStyle(fontSize: 12.5, color: AppColors.textGrey)),
    ]),
  );
}



// ─────────────────────────────────────────────────────────────────────────────
//  Amount Column (compact label + value, used in bill card)
// ─────────────────────────────────────────────────────────────────────────────

class _AmountCol extends StatelessWidget {
  final String label;
  final String value;
  const _AmountCol({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: const TextStyle(fontSize: 9, color: AppColors.textGrey),
              maxLines: 1, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 2),
          Text(value,
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark),
              maxLines: 1, overflow: TextOverflow.ellipsis),
        ],
      ),
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
        GestureDetector(
          onTap: onPrev,
          child: Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: onPrev != null ? Colors.white : const Color(0xFFF0F0F0),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: Icon(Icons.chevron_left,
                size: 18,
                color: onPrev != null ? AppColors.textDark : AppColors.textLight),
          ),
        ),
        const SizedBox(width: 10),
        Container(
          width: 32, height: 32,
          decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(8)),
          child: Center(
            child: Text('$page',
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.white)),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: onNext,
          child: Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: onNext != null ? Colors.white : const Color(0xFFF0F0F0),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: Icon(Icons.chevron_right,
                size: 18,
                color: onNext != null ? AppColors.textDark : AppColors.textLight),
          ),
        ),
      ],
    );
  }
}
