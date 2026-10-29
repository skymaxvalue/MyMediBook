document.addEventListener('DOMContentLoaded', () => {
  const S = RoomStore, U = RoomUI, $ = id => document.getElementById(id);
  const SIZE = 8;
  const f = { facility: S.OPTS.facility[0], ward: '', type: '', q: '' };
  let page = 1;

  const ICON = {
    view: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
    del: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>'
  };

  const opts = (first, list) => (first ? `<option value="">${first}</option>` : '') + list.map(v => `<option>${U.esc(v)}</option>`).join('');
  $('fltFacility').innerHTML = opts('', S.OPTS.facility);
  $('fltWard').innerHTML = opts('All Wards', S.OPTS.ward);
  $('fltType').innerHTML = opts('All Types', Object.keys(S.TYPES));

  const slug = s => s.toLowerCase();

  function filtered() {
    const q = f.q.trim().toLowerCase();
    return S.all()
      .filter(r => r.facility === f.facility && (!f.ward || r.ward === f.ward) && (!f.type || r.roomType === f.type) &&
        (!q || r.roomNo.toLowerCase().includes(q) || r.roomName.toLowerCase().includes(q)))
      .sort((a, b) => a.roomNo.localeCompare(b.roomNo, undefined, { numeric: true }));
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / SIZE));
    page = Math.min(Math.max(page, 1), pages);
    const start = (page - 1) * SIZE, slice = list.slice(start, start + SIZE);

    $('rmRows').innerHTML = slice.length ? slice.map(r => {
      const label = U.esc(r.roomName);
      const beds = Array.isArray(r.beds) ? r.beds : [];
      const roomStatus = getRoomStatus(r, beds);
      const grouped = values => {
        const counts = values.filter(Boolean).reduce((out, value) => {
          out[value] = (out[value] || 0) + 1;
          return out;
        }, {});
        return Object.entries(counts).map(([value, count]) => ({ value, count }));
      };
      const bedStatuses = grouped(beds.map(b => b.status || 'Available'));
      const cleaningStatuses = grouped(beds.map(b => b.cleaningStatus || (b.status === 'Cleaning' ? 'RequiresCleaning' : 'Clean')));
      const patientStatuses = grouped(beds.map(b => b.patientStatus || (b.status === 'Occupied' ? 'Admitted' : b.status === 'Reserved' ? 'Reserved' : '')));
      const chips = (items, kind) => items.length
        ? items.map(({ value, count }) => `<span class="rm-status rm-status--${slug(value)}" title="${U.esc(value)}"><i aria-hidden="true"></i>${U.esc(value)}${count > 1 ? `<span class="rm-status__count">×${count}</span>` : ''}</span>`).join('<span class="rm-status__separator" aria-hidden="true">, </span>')
        : '<span class="rm-status rm-status--empty">—</span>';
      const statusCell = value => `<span class="rm-status rm-status--${slug(value)}"><i aria-hidden="true"></i>${U.esc(value)}</span>`;
      return `<tr>
        <td data-label="Room No">${U.esc(r.roomNo)}</td>
        <td data-label="Room Name">${label}</td>
        <td data-label="Ward">${U.esc(r.ward)}</td>
        <td data-label="Room Type">${U.esc(r.roomType)}</td>
        <td data-label="Beds" class="cl-num">${beds.length || r.totalBeds || 0}</td>
        <td data-label="Room Status">${statusCell(roomStatus)}</td>
        <td data-label="Bed Status" class="rm-status-cell">${chips(bedStatuses, 'bed')}</td>
        <td data-label="Cleaning Status" class="rm-status-cell">${chips(cleaningStatuses, 'cleaning')}</td>
        <td data-label="Patient Status" class="rm-status-cell">${chips(patientStatuses, 'patient')}</td>
        <td data-label="Actions" class="rm-actions cl-actions-col">
          <button type="button" class="rm-act" data-a="view" data-id="${r.id}" aria-label="View ${label}" title="View">${ICON.view}</button>
          <button type="button" class="rm-act" data-a="edit" data-id="${r.id}" aria-label="Edit ${label}" title="Edit">${ICON.edit}</button>
          <button type="button" class="rm-act rm-act--danger" data-a="del" data-id="${r.id}" aria-label="Delete ${label}" title="Delete">${ICON.del}</button>
        </td></tr>`;
    }).join('') : `<tr><td colspan="10" class="rm-empty"><strong>No rooms match your filters.</strong><br>Try a different ward, room type, or search term, or reset the filters.</td></tr>`;

    $('rmInfo').textContent = list.length ? `Showing ${start + 1} to ${start + slice.length} of ${list.length} records` : 'Showing 0 of 0 records';

    let html = `<button type="button" class="cl-pg" data-p="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;
    for (let p = 1; p <= pages; p++)
      html += `<button type="button" class="cl-pg${p === page ? ' is-current' : ''}" data-p="${p}" ${p === page ? 'aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`;
    html += `<button type="button" class="cl-pg" data-p="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="Next page">›</button>`;
    $('rmPager').innerHTML = html;
  }

  function getRoomStatus(room, beds = Array.isArray(room.beds) ? room.beds : []) {
    if (room.recordStatus === 'Inactive') return 'Inactive';
    if (room.recordStatus === 'Maintenance' || room.roomStatus === 'Maintenance') return 'Maintenance';
    if (!beds.length) return room.roomStatus || 'Available';

    const statuses = beds.map(b => b.status || 'Available');
    const occupied = statuses.filter(status => status === 'Occupied').length;
    const reserved = statuses.filter(status => status === 'Reserved').length;
    const cleaning = statuses.filter(status => status === 'Cleaning').length;
    const unavailable = statuses.filter(status => ['Occupied', 'Reserved', 'Cleaning', 'Maintenance', 'Inactive'].includes(status)).length;

    if (occupied === beds.length) return 'Occupied';
    if (occupied > 0 && occupied < beds.length) return 'Partially Occupied';
    if (reserved === beds.length) return 'Reserved';
    if (cleaning === beds.length || beds.some(b => b.cleaningStatus === 'RequiresCleaning') && unavailable === beds.length) return 'Cleaning';
    if (statuses.every(status => status === 'Maintenance')) return 'Maintenance';
    if (reserved > 0) return 'Partially Reserved';
    if (cleaning > 0) return 'Cleaning';
    return room.roomStatus || 'Available';
  }

  function notice(text, kind = 'ok', href = '', linkText = '') {
    const n = $('rmNotice');
    n.className = `rm-notice rm-notice--${kind}`;
    n.innerHTML = `<span>${U.esc(text)}</span>${href ? ` <a href="${href}">${U.esc(linkText)}</a>` : ''}`;
    n.hidden = false;
  }

  function details(r) {
    const row = (k, v) => `<dt>${k}</dt><dd>${v !== null && v !== undefined && v !== '' ? U.esc(v) : '—'}</dd>`;
    const beds = (r.beds || []).map(b => {
      const bedStatus = b.status || 'Available';
      const cleaningStatus = b.cleaningStatus || (bedStatus === 'Cleaning' ? 'RequiresCleaning' : 'Clean');
      const patientStatus = b.patientStatus || (bedStatus === 'Occupied' ? 'Admitted' : bedStatus === 'Reserved' ? 'Reserved' : '—');
      return `<div class="rm-bed-detail"><strong>${U.esc(b.no || 'Bed')}</strong><span>${U.esc(b.type || '—')}</span><span>Bed: ${U.esc(bedStatus)}</span><span>Cleaning: ${U.esc(cleaningStatus)}</span><span>Patient: ${U.esc(patientStatus || '—')}</span></div>`;
    }).join('');
    const roomStatus = getRoomStatus(r, r.beds || []);
    return `<dl class="rm-dl">
      ${row('Room ID', r.id)}${row('Room Name', r.roomName)}${row('Facility', `${r.facility} · ${r.building} · Floor ${r.floor}`)}
      ${row('Ward', r.ward)}${row('Room Type', r.roomType)}${row('Room Status', roomStatus)}
      ${row('Gender Restriction', r.genderRestriction)}${row('Facilities', (r.facilities || []).join(', '))}
      <dt>Beds and Statuses</dt><dd>${beds || '—'}</dd>
      ${row('Daily Room Charge', U.money(r.dailyCharge))}${row('Tariff', `${r.ratePlan} (${r.billingCategory})`)}
      ${row('Description', r.description)}</dl>`;
  }

  $('rmRows').addEventListener('click', async e => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    const r = S.get(b.dataset.id);
    if (!r) return;
    if (b.dataset.a === 'view') U.dialog({ title: `Room ${r.roomNo}`, html: details(r), ok: 'Close', wide: true });
    if (b.dataset.a === 'edit') location.href = `new-room.html?id=${encodeURIComponent(r.id)}`;
    if (b.dataset.a === 'del') {
      const why = S.deleteBlocker(r);
      if (why) return U.dialog({ title: 'Room cannot be deleted', text: why, ok: 'OK' });
      if (await U.dialog({ title: 'Delete room?', text: `Room ${r.roomNo} (${r.roomName}) and its bed configuration will be permanently removed.`, ok: 'Delete', cancel: 'Cancel', danger: true })) {
        S.remove(r.id);
        notice(`Room ${r.roomNo} was deleted.`);
        render();
      }
    }
  });

  $('rmPager').addEventListener('click', e => {
    const b = e.target.closest('[data-p]');
    if (b && !b.disabled) { page = +b.dataset.p; render(); }
  });

  $('fltFacility').addEventListener('change', e => { f.facility = e.target.value; page = 1; render(); });
  $('fltWard').addEventListener('change', e => { f.ward = e.target.value; page = 1; render(); });
  $('fltType').addEventListener('change', e => { f.type = e.target.value; page = 1; render(); });
  $('rmFilters').addEventListener('submit', e => { e.preventDefault(); f.q = $('fltSearch').value; page = 1; render(); });
  $('fltReset').addEventListener('click', () => {
    f.facility = S.OPTS.facility[0]; f.ward = f.type = f.q = '';
    $('fltFacility').value = f.facility; $('fltWard').value = ''; $('fltType').value = ''; $('fltSearch').value = '';
    page = 1; render();
  });

  // Post-save message and draft banner
  const params = new URLSearchParams(location.search);
  if (params.get('saved')) {
    const r = S.get(params.get('saved'));
    if (r) notice(`Room ${r.roomNo} (${r.id}) was ${params.get('mode') === 'updated' ? 'updated' : 'created'} successfully.`);
    history.replaceState(null, '', location.pathname);
  } else {
    const d = S.draft();
    if (d && d.data) notice(`You have an unsaved room draft${d.data.roomNo ? ` (Room ${d.data.roomNo})` : ''}. It is not listed until you save it.`, 'info', 'new-room.html', 'Resume draft');
  }

  render();
});
