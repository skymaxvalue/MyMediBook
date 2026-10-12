/* Room Master – data store (namespaced localStorage) and shared UI helpers.
   Swap the functions in RoomStore for API calls if a backend becomes available. */
const RoomStore = (() => {
  const KEY = 'hhRoomMaster_v1';
  const DRAFT = 'hhRoomMasterDraft_v1';

  const TYPES = {
    'Standard':     { min: 3, max: 6, def: 4, beds: '3 - 6 Beds', desc: 'Shared accommodation with basic amenities' },
    'Semi-Private': { min: 2, max: 2, def: 2, beds: '2 Beds',     desc: 'Shared room with privacy features' },
    'Private':      { min: 1, max: 1, def: 1, beds: '1 Bed',      desc: 'Single occupancy with enhanced privacy' },
    'Suite':        { min: 1, max: 1, def: 1, beds: '1 Bed',      desc: 'Executive room with premium amenities' }
  };

  const FAC_DEFAULTS = {
    'Standard':     ['Attached Bathroom', 'Nurse Call System', 'Oxygen Outlet'],
    'Semi-Private': ['Attached Bathroom', 'Air Conditioning', 'Television', 'Nurse Call System', 'Oxygen Outlet'],
    'Private':      ['Attached Bathroom', 'Air Conditioning', 'Television', 'Refrigerator', 'Nurse Call System', 'Oxygen Outlet', 'Wi-Fi', 'Visitor Chairs'],
    'Suite':        ['Attached Bathroom', 'Air Conditioning', 'Television', 'Refrigerator', 'Nurse Call System', 'Oxygen Outlet', 'Wi-Fi', 'Work Desk', 'Visitor Chairs', 'Sofa / Visitor Seating', 'Storage Cabinet']
  };

  const OPTS = {
    facility: ['Main Hospital'],
    building: ['A - Main Block', 'B - East Wing'],
    floor: ['Ground', '1', '2', '3', '4', '5', '6'],
    ward: ['General', 'Medical', 'Surgical', 'VIP'],
    recordStatus: ['Active', 'Inactive'],
    genderRestriction: ['Any', 'Male', 'Female'],
    layout: ['Standard', 'L-Shaped', 'Corner', 'Split'],
    orientation: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'],
    windowView: ['Garden', 'City', 'Courtyard', 'Corridor', 'No window'],
    facilities: ['Attached Bathroom', 'Air Conditioning', 'Television', 'Refrigerator', 'Nurse Call System', 'Oxygen Outlet', 'Wi-Fi', 'Work Desk', 'Visitor Chairs', 'Sofa / Visitor Seating', 'Storage Cabinet', 'Wheelchair Accessible'],
    bedType: ['Standard Bed', 'Electric Bed', 'ICU Bed', 'Pediatric Bed', 'Bariatric Bed'],
    bedStatus: ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved'],
    bedAmenities: ['Bedside Table', 'Reading Light', 'IV Stand', 'Call Bell', 'Oxygen Outlet', 'Monitor Port', 'Side Rails', 'Patient Locker', 'Overbed Table', 'Wheelchair Access', 'Power Outlet', 'Other (Specify)'],
    patientCategory: ['General', 'Adult', 'Pediatric', 'Maternity', 'Geriatric', 'Post-operative'],
    infection: ['Standard precautions', 'Contact precautions', 'Droplet precautions', 'Airborne precautions'],
    oxygen: ['Wall outlet', 'Portable cylinder on request', 'Not available'],
    emergencyEquipment: ['In room', 'Nearby (nursing station)', 'Not available'],
    accessibility: ['Grab Rails', 'Wide Doorway', 'Accessible Washroom', 'Hearing Loop', 'Non-slip Flooring'],
    billingCategory: ['Standard', 'Semi-Private', 'Private', 'Suite'],
    ratePlan: ['Standard Tariff', 'Insurance Tariff', 'Corporate Tariff', 'Government Scheme']
  };

  const PRIORITY = ['Occupied', 'Reserved', 'Cleaning', 'Maintenance', 'Available'];
  const derive = beds => PRIORITY.find(s => (beds || []).some(b => b.status === s)) || 'Available';
  const displayStatus = r => (r.recordStatus === 'Inactive' ? 'Inactive' : r.status);

  function seed() {
    const rows = [
      ['101', 'Private 101', 'General', 'Private', 'Available', '1'],
      ['102', 'Private 102', 'General', 'Private', 'Occupied', '1'],
      ['201', 'Semi-Private 201', 'Medical', 'Semi-Private', 'Available', '2'],
      ['202', 'Semi-Private 202', 'Medical', 'Semi-Private', 'Cleaning', '2'],
      ['301', 'Standard 301', 'Surgical', 'Standard', 'Available', '3'],
      ['302', 'Standard 302', 'Surgical', 'Standard', 'Maintenance', '3'],
      ['401', 'Suite 401', 'VIP', 'Suite', 'Available', '4'],
      ['402', 'Suite 402', 'VIP', 'Suite', 'Reserved', '4']
    ];
    const charge = { 'Standard': 1500, 'Semi-Private': 3000, 'Private': 5000, 'Suite': 12000 };
    return rows.map(([no, name, ward, type, status, floor], i) => {
      const n = TYPES[type].def;
      return {
        id: `RM-2026-${String(i + 1).padStart(3, '0')}`,
        roomNo: no, roomName: name, facility: 'Main Hospital', building: 'A - Main Block', floor, ward,
        roomType: type, recordStatus: 'Active', genderRestriction: 'Any', description: '',
        layout: 'Standard', roomSize: '', orientation: '', windowView: '', doors: 1, attachedBathroom: 'Yes',
        facilities: FAC_DEFAULTS[type].slice(),
        totalBeds: n, bedType: 'Standard Bed', bedPrefix: 'B', startFrom: 1, autoNumber: true,
        beds: Array.from({ length: n }, (_, k) => ({ no: `${no}-B${k + 1}`, type: 'Standard Bed', status, remarks: '' })),
        bedAmenities: ['Bedside Table', 'Call Bell'], bedAmenityOther: '',
        patientCategory: 'General', infection: 'Standard precautions', isolation: 'No', negativePressure: 'No',
        oxygen: 'Wall outlet', emergencyEquipment: 'Nearby (nursing station)', accessibility: [], clinicalNotes: '',
        billingCategory: type, dailyCharge: charge[type], ratePlan: 'Standard Tariff',
        effectiveFrom: '2026-01-01', effectiveTo: '', additionalCharges: '', billingNotes: '', status
      };
    });
  }

  let memory = null;
  function all() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
      const data = seed();
      localStorage.setItem(KEY, JSON.stringify(data));
      return data;
    } catch (_) { return memory || (memory = seed()); }
  }
  function persist(list) {
    memory = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) {}
  }
  const get = id => all().find(r => r.id === id) || null;

  function duplicate(d, exceptId) {
    const no = String(d.roomNo || '').trim().toLowerCase();
    return all().some(r => r.id !== exceptId && r.facility === d.facility && r.building === d.building && r.roomNo.trim().toLowerCase() === no);
  }

  function nextId() {
    const max = all().reduce((m, r) => Math.max(m, parseInt(String(r.id).split('-').pop(), 10) || 0), 0);
    return `RM-${new Date().getFullYear()}-${String(max + 1).padStart(3, '0')}`;
  }

  function save(room) {
    if (duplicate(room, room.id)) throw new Error('Room number already exists in this facility and building.');
    const r = {
      ...room,
      roomNo: String(room.roomNo).trim(), roomName: String(room.roomName).trim(),
      roomSize: room.roomSize === '' ? '' : Number(room.roomSize),
      totalBeds: Number(room.totalBeds), doors: Number(room.doors), startFrom: Number(room.startFrom),
      dailyCharge: Number(room.dailyCharge),
      additionalCharges: room.additionalCharges === '' ? '' : Number(room.additionalCharges)
    };
    const list = all();
    if (!r.id) { r.id = nextId(); list.push(r); }
    else { const i = list.findIndex(x => x.id === r.id); i < 0 ? list.push(r) : (list[i] = r); }
    persist(list);
    return r;
  }

  function deleteBlocker(r) {
    if (r.status === 'Occupied' || (r.beds || []).some(b => b.status === 'Occupied'))
      return 'This room has occupied beds. Discharge or transfer the patients before deleting it.';
    if (r.status === 'Reserved' || (r.beds || []).some(b => b.status === 'Reserved'))
      return 'This room has an active reservation. Cancel the reservation before deleting it.';
    return '';
  }
  const remove = id => persist(all().filter(r => r.id !== id));

  const draft = () => { try { return JSON.parse(localStorage.getItem(DRAFT)); } catch (_) { return null; } };
  const setDraft = v => { try { localStorage.setItem(DRAFT, JSON.stringify(v)); } catch (_) {} };
  const clearDraft = () => { try { localStorage.removeItem(DRAFT); } catch (_) {} };

  return { TYPES, FAC_DEFAULTS, OPTS, all, get, save, remove, duplicate, derive, displayStatus, deleteBlocker, draft, setDraft, clearDraft };
})();

const RoomUI = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(v) || 0);

  /* Promise-based modal. Resolves true (OK) / false (cancel, Esc, backdrop). */
  function dialog({ title, text = '', html = '', ok = 'OK', cancel = '', danger = false, wide = false }) {
    return new Promise(resolve => {
      const prev = document.activeElement;
      const wrap = document.createElement('div');
      wrap.className = 'rm-modal';
      wrap.innerHTML = `<div class="rm-modal__card${wide ? ' rm-modal__card--wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="rmDlgTitle">
        <h3 id="rmDlgTitle">${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}${html}
        <div class="rm-modal__actions">${cancel ? `<button type="button" class="rm-btn rm-btn--ghost" data-r="0">${esc(cancel)}</button>` : ''}
        <button type="button" class="rm-btn ${danger ? 'rm-btn--danger' : 'rm-btn--primary'}" data-r="1">${esc(ok)}</button></div></div>`;
      document.body.appendChild(wrap);
      const done = v => { document.removeEventListener('keydown', key); wrap.remove(); prev && prev.focus && prev.focus(); resolve(v); };
      const key = e => {
        if (e.key === 'Escape') done(false);
        if (e.key === 'Tab') {
          const f = [...wrap.querySelectorAll('button')];
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', key);
      wrap.addEventListener('click', e => { if (e.target === wrap) done(false); const b = e.target.closest('[data-r]'); if (b) done(b.dataset.r === '1'); });
      wrap.querySelector('[data-r="1"]').focus();
    });
  }
  return { esc, money, dialog };
})();
