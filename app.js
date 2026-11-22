// ==========================================
// VANGUARD BARBERSHOP & GROOMING - APP LOGIC
// ==========================================

// --- State Management ---
let bookingState = {
  currentStep: 1,
  selectedServices: [], // Array of service IDs
  selectedBarber: 'any',
  selectedDate: '',
  selectedTime: '',
  customerName: '',
  customerPhone: '',
  customerNotes: ''
};

let currentFaceShape = 'oval';
let selectedStarRating = 5;
let appReviews = [];

// Sound feedback using Web Audio API (zero external assets needed)
function playSound(type = 'click') {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    // AudioContext might be restricted until user gesture, safely ignore
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-dark-850 border-emerald-500/50 text-emerald-300' : 
                  type === 'error' ? 'bg-dark-850 border-rose-500/50 text-rose-300' : 
                  'bg-dark-850 border-gold-500/50 text-gold-300';
  
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';

  toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs sm:text-sm font-medium ${bgColor}`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease-out';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Helper: Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// ==========================================
// STORE STATUS & DYNAMIC TIME
// ==========================================
function updateStoreStatus() {
  const badge = document.getElementById('store-status-badge');
  if (!badge) return;

  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0: Sunday, 5: Friday

  let isOpen = false;
  let statusText = '';

  if (day === 0 || day === 6) {
    // Weekend: 08:30 - 22:00
    isOpen = (hour >= 8 && hour < 22);
    statusText = isOpen ? 'Buka Sekarang • Tutup 22:00 WIB' : 'Sedang Tutup • Buka Besok 08:30 WIB';
  } else {
    // Weekday: 09:00 - 21:00
    isOpen = (hour >= 9 && hour < 21);
    statusText = isOpen ? 'Buka Sekarang • Tutup 21:00 WIB' : 'Sedang Tutup • Buka Jam 09:00 WIB';
  }

  if (isOpen) {
    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span>${statusText}</span>`;
  } else {
    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30";
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>${statusText}</span>`;
  }
}

// ==========================================
// RENDER SERVICES
// ==========================================
function renderServices(filter = 'all') {
  const container = document.getElementById('services-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === filter);

  container.innerHTML = filtered.map(s => `
    <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative group border border-slate-800/80 hover:border-gold-500/40">
      ${s.badge ? `
        <span class="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30">
          ${s.badge}
        </span>
      ` : ''}

      <div>
        <div class="flex items-baseline justify-between mb-2">
          <span class="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-gold-500"></i> ${s.duration} Menit
          </span>
        </div>

        <h3 class="text-xl font-bold text-white group-hover:text-gold-400 transition-colors">${s.name}</h3>
        <p class="text-xs text-slate-300 mt-1 line-clamp-2">${s.subtitle}</p>

        <div class="my-5 border-t border-slate-800 pt-4">
          <ul class="space-y-2 text-xs text-slate-300">
            ${s.features.map(f => `
              <li class="flex items-center gap-2">
                <i data-lucide="check" class="w-3.5 h-3.5 text-gold-400 flex-shrink-0"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Investasi Gaya</span>
          <span class="text-lg font-bold text-gold-400">${formatRupiah(s.price)}</span>
        </div>
        <button onclick="bookDirectService('${s.id}')" class="px-4 py-2 rounded-xl bg-dark-800 hover:bg-gold-500 hover:text-dark-950 text-gold-400 border border-gold-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
          <span>Pilih</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function filterServices(category) {
  playSound('click');
  const buttons = document.querySelectorAll('#services-tabs button');
  buttons.forEach(btn => {
    btn.classList.remove('bg-gold-500', 'text-dark-950', 'active');
    btn.classList.add('bg-dark-800', 'text-slate-300');
  });

  const activeBtn = event.currentTarget;
  activeBtn.classList.remove('bg-dark-800', 'text-slate-300');
  activeBtn.classList.add('bg-gold-500', 'text-dark-950', 'active');

  renderServices(category);
}

// ==========================================
// RENDER BARBERS
// ==========================================
function renderBarbers() {
  const container = document.getElementById('barbers-grid');
  if (!container) return;

  container.innerHTML = BARBERS_DATA.map(b => `
    <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 group hover:border-gold-500/50 flex flex-col justify-between">
      <div class="relative h-64 overflow-hidden">
        <img src="${b.image}" alt="${b.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent"></div>
        
        <div class="absolute top-3 right-3 glass-panel px-2.5 py-1 rounded-full text-xs font-bold text-gold-400 border border-gold-500/30 flex items-center gap-1">
          <i data-lucide="star" class="w-3.5 h-3.5 fill-gold-400"></i> ${b.rating}
        </div>

        <div class="absolute bottom-3 left-3 right-3">
          <span class="text-[11px] font-semibold text-gold-400 tracking-wider uppercase">${b.experience}</span>
          <h4 class="text-lg font-bold text-white">${b.name}</h4>
          <p class="text-xs text-slate-300">${b.title}</p>
        </div>
      </div>

      <div class="p-5 space-y-4">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Spesialisasi:</span>
          <p class="text-xs font-semibold text-slate-200 mt-0.5">${b.specialty}</p>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed italic">"${b.bio}"</p>

        <button onclick="bookWithSpecificBarber('${b.id}')" class="w-full py-2.5 rounded-xl bg-dark-800 hover:bg-gold-500 hover:text-dark-950 text-gold-400 font-bold text-xs border border-gold-500/30 transition-all flex items-center justify-center gap-2">
          <i data-lucide="calendar" class="w-3.5 h-3.5"></i> Pilih Capster Ini
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// ==========================================
// RENDER LOOKBOOK & FILTER
// ==========================================
function renderLookbook(filter = 'all') {
  const container = document.getElementById('lookbook-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? LOOKBOOK_DATA 
    : LOOKBOOK_DATA.filter(lb => lb.tag === filter);

  container.innerHTML = filtered.map(lb => `
    <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 group hover:border-gold-500/40">
      <div class="relative h-64 overflow-hidden">
        <img src="${lb.image}" alt="${lb.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent"></div>
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-dark-900/80 text-gold-400 border border-gold-500/30">
          ${lb.category}
        </span>
      </div>

      <div class="p-5 space-y-3">
        <div>
          <h4 class="text-base font-bold text-white group-hover:text-gold-400 transition-colors">${lb.name}</h4>
          <p class="text-xs text-slate-300 mt-1">${lb.desc}</p>
        </div>

        <div class="pt-2 flex items-center justify-between text-xs">
          <span class="text-slate-400">Cocok untuk: <strong class="text-gold-400 font-semibold">${lb.suitableFor}</strong></span>
          <button onclick="bookWithLookbookNote('${lb.name}')" class="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1">
            Mau Model Ini &rarr;
          </button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function filterLookbook(tag) {
  playSound('click');
  const buttons = document.querySelectorAll('#lookbook-filter-tabs button');
  buttons.forEach(btn => {
    btn.classList.remove('bg-gold-500', 'text-dark-950', 'active');
    btn.classList.add('bg-dark-800', 'text-slate-300');
  });

  const activeBtn = event.currentTarget;
  activeBtn.classList.remove('bg-dark-800', 'text-slate-300');
  activeBtn.classList.add('bg-gold-500', 'text-dark-950', 'active');

  renderLookbook(tag);
}

// ==========================================
// FACE SHAPE RECOMMENDER
// ==========================================
function selectFaceShape(shapeKey) {
  playSound('click');
  currentFaceShape = shapeKey;
  const data = FACE_SHAPE_RECOMMENDATIONS[shapeKey];
  if (!data) return;

  // Update UI buttons
  const buttons = document.querySelectorAll('#face-buttons-container button');
  buttons.forEach(btn => {
    btn.classList.remove('border-gold-500', 'bg-gold-500/10', 'text-gold-400');
    btn.classList.add('border-slate-700', 'bg-dark-800', 'text-slate-300');
    const icon = btn.querySelector('svg, i');
    if (icon) icon.remove();
  });

  const activeBtn = event.currentTarget;
  activeBtn.classList.remove('border-slate-700', 'bg-dark-800', 'text-slate-300');
  activeBtn.classList.add('border-gold-500', 'bg-gold-500/10', 'text-gold-400');
  
  const checkIcon = document.createElement('i');
  checkIcon.setAttribute('data-lucide', 'check');
  checkIcon.className = 'w-4 h-4';
  activeBtn.appendChild(checkIcon);

  // Update Result Card
  document.getElementById('face-res-title').textContent = data.title;
  document.getElementById('face-res-desc').textContent = data.desc;
  document.getElementById('face-res-avoid').textContent = data.avoid;

  const recsContainer = document.getElementById('face-res-recs');
  recsContainer.innerHTML = data.recs.map(r => `
    <span class="px-3 py-1.5 rounded-lg bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
      ✂️ ${r}
    </span>
  `).join('');

  lucide.createIcons();
}

function bookWithStyleNote() {
  const data = FACE_SHAPE_RECOMMENDATIONS[currentFaceShape];
  const note = `Rekomendasi Wajah ${data.title}: ${data.recs.join(', ')}`;
  bookingState.customerNotes = note;
  openBookingModal();
  showToast(`Referensi style ${data.title} otomatis ditambahkan ke catatan booking!`, 'info');
}

function bookWithLookbookNote(styleName) {
  bookingState.customerNotes = `Saya ingin referensi model: ${styleName}`;
  openBookingModal();
  showToast(`Model "${styleName}" otomatis tersimpan di catatan booking!`, 'info');
}

// ==========================================
// REVIEWS / TESTIMONIALS
// ==========================================
function loadReviews() {
  const saved = localStorage.getItem('vanguard_reviews');
  if (saved) {
    try {
      appReviews = JSON.parse(saved);
    } catch (e) {
      appReviews = INITIAL_REVIEWS;
    }
  } else {
    appReviews = INITIAL_REVIEWS;
  }
  renderReviews();
}

function renderReviews() {
  const container = document.getElementById('reviews-grid');
  if (!container) return;

  container.innerHTML = appReviews.map(r => `
    <div class="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 text-gold-400">
            ${'★'.repeat(r.rating)}
          </div>
          <span class="text-[11px] text-slate-500">${r.date}</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed italic">"${r.comment}"</p>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div>
          <h5 class="text-sm font-bold text-white">${r.name}</h5>
          <span class="text-[11px] text-gold-400 font-medium">${r.service}</span>
        </div>
        ${r.verified ? `
          <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
            <i data-lucide="check" class="w-3 h-3"></i> Terverifikasi
          </span>
        ` : ''}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function openAddReviewModal() {
  playSound('click');
  document.getElementById('add-review-modal').classList.remove('hidden');
}

function closeAddReviewModal() {
  document.getElementById('add-review-modal').classList.add('hidden');
}

function setStarRating(num) {
  playSound('click');
  selectedStarRating = num;
  const buttons = document.querySelectorAll('.star-btn');
  buttons.forEach((btn, idx) => {
    btn.style.opacity = idx < num ? '1' : '0.25';
  });

  const texts = [
    '1 Bintang (Kurang Puas)',
    '2 Bintang (Cukup)',
    '3 Bintang (Standar)',
    '4 Bintang (Puas)',
    '5 Bintang (Puas Banget / Sangat Rekomen)'
  ];
  document.getElementById('star-rating-text').textContent = texts[num - 1];
}

function submitReview(event) {
  event.preventDefault();
  playSound('success');

  const name = document.getElementById('rev-user-name').value.trim();
  const service = document.getElementById('rev-service-name').value;
  const comment = document.getElementById('rev-comment').value.trim();

  if (!name || !comment) return;

  const newRev = {
    id: 'rev-' + Date.now(),
    name,
    service,
    rating: selectedStarRating,
    comment,
    date: 'Baru saja',
    verified: true
  };

  appReviews.unshift(newRev);
  localStorage.setItem('vanguard_reviews', JSON.stringify(appReviews));
  renderReviews();
  closeAddReviewModal();
  showToast('Terima kasih! Ulasan kamu telah berhasil diterbitkan.', 'success');

  document.getElementById('rev-user-name').value = '';
  document.getElementById('rev-comment').value = '';
}

// ==========================================
// INTERACTIVE BOOKING SYSTEM
// ==========================================
function openBookingModal() {
  playSound('click');
  document.getElementById('booking-modal').classList.remove('hidden');
  initBookingModal();
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.add('hidden');
}

function initBookingModal() {
  // Populate Services in Step 1
  const srvList = document.getElementById('booking-services-list');
  srvList.innerHTML = SERVICES_DATA.map(s => {
    const isSelected = bookingState.selectedServices.includes(s.id);
    return `
      <div onclick="toggleBookingService('${s.id}')" id="srv-card-${s.id}" class="service-select-card p-3 rounded-xl border ${isSelected ? 'selected' : 'border-slate-800'} bg-dark-900 cursor-pointer flex items-center justify-between hover:border-gold-500/50 transition-all">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center font-bold text-xs">
            <i data-lucide="scissors" class="w-4 h-4"></i>
          </div>
          <div>
            <h5 class="text-xs sm:text-sm font-bold text-white">${s.name}</h5>
            <span class="text-[11px] text-slate-400">${s.duration} Menit • ${formatRupiah(s.price)}</span>
          </div>
        </div>
        <div class="checkbox-indicator w-5 h-5 rounded border ${isSelected ? 'bg-gold-500 border-gold-500 text-dark-950' : 'border-slate-700'} flex items-center justify-center text-xs">
          ${isSelected ? '✓' : ''}
        </div>
      </div>
    `;
  }).join('');

  // Populate Barbers in Step 2
  const barberList = document.getElementById('booking-barbers-list');
  barberList.innerHTML = BARBERS_DATA.map(b => {
    const isSelected = bookingState.selectedBarber === b.id;
    return `
      <div onclick="selectBarberForBooking('${b.id}')" id="barber-opt-${b.id}" class="barber-select-card p-3 rounded-xl border ${isSelected ? 'selected' : 'border-slate-800'} bg-dark-900 cursor-pointer flex items-center gap-3 hover:border-gold-500/50 transition-all">
        <img src="${b.image}" class="w-10 h-10 rounded-full object-cover border border-gold-500/40">
        <div>
          <h5 class="text-xs sm:text-sm font-bold text-white">${b.name}</h5>
          <p class="text-[11px] text-slate-400">${b.title}</p>
        </div>
      </div>
    `;
  }).join('');

  // Init Date & Time Slots
  initDateAndTime();

  // If customer notes already set (e.g. from face shape or lookbook)
  if (bookingState.customerNotes) {
    const notesInput = document.getElementById('cust-notes');
    if (notesInput) notesInput.value = bookingState.customerNotes;
  }

  updateBookingTotal();
  goToStep(bookingState.currentStep || 1);
  lucide.createIcons();
}

function toggleBookingService(serviceId) {
  playSound('click');
  const index = bookingState.selectedServices.indexOf(serviceId);
  if (index > -1) {
    bookingState.selectedServices.splice(index, 1);
  } else {
    bookingState.selectedServices.push(serviceId);
  }

  // Update card UI
  const card = document.getElementById(`srv-card-${serviceId}`);
  if (card) {
    const isSelected = bookingState.selectedServices.includes(serviceId);
    card.classList.toggle('selected', isSelected);
    const indicator = card.querySelector('.checkbox-indicator');
    if (indicator) {
      if (isSelected) {
        indicator.className = 'checkbox-indicator w-5 h-5 rounded bg-gold-500 border-gold-500 text-dark-950 flex items-center justify-center text-xs font-bold';
        indicator.textContent = '✓';
      } else {
        indicator.className = 'checkbox-indicator w-5 h-5 rounded border border-slate-700 flex items-center justify-center text-xs';
        indicator.textContent = '';
      }
    }
  }

  updateBookingTotal();
}

function updateBookingTotal() {
  const selected = SERVICES_DATA.filter(s => bookingState.selectedServices.includes(s.id));
  const totalDuration = selected.reduce((acc, curr) => acc + curr.duration, 0);
  const totalPrice = selected.reduce((acc, curr) => acc + curr.price, 0);

  document.getElementById('booking-selected-count').textContent = selected.length;
  document.getElementById('booking-selected-duration').textContent = `${totalDuration} Menit`;
  document.getElementById('booking-selected-total').textContent = formatRupiah(totalPrice);

  const nextBtn = document.getElementById('btn-next-step-1');
  if (selected.length === 0) {
    nextBtn.classList.add('opacity-50', 'pointer-events-none');
  } else {
    nextBtn.classList.remove('opacity-50', 'pointer-events-none');
  }
}

function bookDirectService(serviceId) {
  bookingState.selectedServices = [serviceId];
  openBookingModal();
  goToStep(2); // langsung arahkan ke pilih capster
}

function bookWithSpecificBarber(barberId) {
  bookingState.selectedBarber = barberId;
  openBookingModal();
  // Ensure default haircut is selected if nothing selected
  if (bookingState.selectedServices.length === 0) {
    bookingState.selectedServices = ['srv-1'];
  }
  goToStep(3); // langsung arahkan ke pilih jadwal
}

function selectBarberForBooking(barberId) {
  playSound('click');
  bookingState.selectedBarber = barberId;

  // reset all
  document.querySelectorAll('.barber-select-card').forEach(el => {
    el.classList.remove('selected', 'border-gold-500');
    el.classList.add('border-slate-800');
  });

  const selectedEl = document.getElementById(barberId === 'any' ? 'barber-opt-any' : `barber-opt-${barberId}`);
  if (selectedEl) {
    selectedEl.classList.add('selected', 'border-gold-500');
    selectedEl.classList.remove('border-slate-800');
  }
}

function initDateAndTime() {
  const dateInput = document.getElementById('booking-date-input');
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  dateInput.min = minDate;
  if (!bookingState.selectedDate) {
    bookingState.selectedDate = minDate;
  }
  dateInput.value = bookingState.selectedDate;

  dateInput.addEventListener('change', (e) => {
    bookingState.selectedDate = e.target.value;
    renderTimeSlots();
  });

  renderTimeSlots();
}

function renderTimeSlots() {
  const container = document.getElementById('time-slots-container');
  if (!container) return;

  const slots = [
    '09:30', '10:15', '11:00', '11:45',
    '13:15', '14:00', '14:45', '15:30',
    '16:15', '17:00', '18:00', '18:45',
    '19:30', '20:15'
  ];

  // Default select first available slot
  if (!bookingState.selectedTime) {
    bookingState.selectedTime = slots[1];
  }

  container.innerHTML = slots.map((t, idx) => {
    const isBooked = (idx === 3 || idx === 7); // For realism: mock some booked slots
    const isSelected = bookingState.selectedTime === t;

    return `
      <button 
        type="button"
        onclick="${isBooked ? '' : `selectTimeSlot('${t}')`}"
        ${isBooked ? 'disabled' : ''}
        class="time-slot-btn py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center
        ${isBooked ? 'bg-dark-950 text-slate-600 border-slate-900 cursor-not-allowed line-through' : 
          isSelected ? 'active' : 'bg-dark-900 text-slate-300 border-slate-700 hover:border-gold-500'}">
        ${t} WIB
      </button>
    `;
  }).join('');
}

function selectTimeSlot(slot) {
  playSound('click');
  bookingState.selectedTime = slot;
  renderTimeSlots();
}

function goToStep(step) {
  playSound('click');
  bookingState.currentStep = step;

  // Hide all steps
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`booking-step-${i}`);
    if (stepEl) stepEl.classList.add('hidden');

    const bar = document.getElementById(`step-bar-${i}`);
    const label = document.getElementById(`step-label-${i}`);
    if (bar && label) {
      if (i <= step) {
        bar.className = 'flex-1 h-1.5 rounded-full bg-gold-500';
        label.className = 'text-gold-400 font-bold';
      } else {
        bar.className = 'flex-1 h-1.5 rounded-full bg-slate-800';
        label.className = 'text-slate-500 font-medium';
      }
    }
  }

  const successEl = document.getElementById('booking-step-success');
  if (successEl) successEl.classList.add('hidden');

  // Show active step
  const activeStepEl = document.getElementById(`booking-step-${step}`);
  if (activeStepEl) activeStepEl.classList.remove('hidden');

  // Update summary in step 4
  if (step === 4) {
    updateSummaryView();
  }
}

function updateSummaryView() {
  const selectedSrvs = SERVICES_DATA.filter(s => bookingState.selectedServices.includes(s.id));
  const srvNames = selectedSrvs.map(s => s.name).join(', ') || 'Belum dipilih';
  const totalPrice = selectedSrvs.reduce((acc, curr) => acc + curr.price, 0);

  let barberName = 'Bebas / Siapa Saja yang Siap';
  if (bookingState.selectedBarber !== 'any') {
    const b = BARBERS_DATA.find(x => x.id === bookingState.selectedBarber);
    if (b) barberName = b.name;
  }

  document.getElementById('summary-services').textContent = srvNames;
  document.getElementById('summary-barber').textContent = barberName;
  document.getElementById('summary-schedule').textContent = `${bookingState.selectedDate} • ${bookingState.selectedTime} WIB`;
  document.getElementById('summary-total').textContent = formatRupiah(totalPrice);
}

function submitBooking() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const notes = document.getElementById('cust-notes').value.trim();

  if (!name || !phone) {
    showToast('Mohon lengkapi nama lengkap dan nomor WhatsApp kamu.', 'error');
    return;
  }

  playSound('success');

  bookingState.customerName = name;
  bookingState.customerPhone = phone;
  bookingState.customerNotes = notes;

  const bookingCode = '#VNG-' + Math.floor(10000 + Math.random() * 90000);
  const selectedSrvs = SERVICES_DATA.filter(s => bookingState.selectedServices.includes(s.id));
  const srvNames = selectedSrvs.map(s => s.name).join(', ');
  const totalPrice = selectedSrvs.reduce((acc, curr) => acc + curr.price, 0);

  let barberName = 'Capster Terbaik Tersedia';
  if (bookingState.selectedBarber !== 'any') {
    const b = BARBERS_DATA.find(x => x.id === bookingState.selectedBarber);
    if (b) barberName = b.name;
  }

  const newBooking = {
    code: bookingCode,
    name,
    phone,
    services: srvNames,
    barber: barberName,
    date: bookingState.selectedDate,
    time: bookingState.selectedTime,
    notes,
    totalPrice,
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage
  saveUserBooking(newBooking);

  // Update success UI
  document.getElementById('booking-step-4').classList.add('hidden');
  document.getElementById('booking-step-success').classList.remove('hidden');
  document.getElementById('success-booking-code').textContent = bookingCode;

  // Format WhatsApp Link
  const waMessage = `Halo Vanguard Barbershop! Saya ingin konfirmasi booking online:%0A%0A` +
    `*Kode Booking:* ${bookingCode}%0A` +
    `*Nama:* ${name}%0A` +
    `*No. WhatsApp:* ${phone}%0A` +
    `*Layanan:* ${srvNames}%0A` +
    `*Capster:* ${barberName}%0A` +
    `*Jadwal:* ${bookingState.selectedDate} jam ${bookingState.selectedTime} WIB%0A` +
    (notes ? `*Catatan Style:* ${notes}%0A` : '') +
    `*Total:* ${formatRupiah(totalPrice)}%0A%0A` +
    `Mohon konfirmasi ketersediaannya. Terima kasih!`;

  const waUrl = `https://wa.me/6281298765432?text=${waMessage}`;
  document.getElementById('success-wa-link').href = waUrl;

  showToast('Booking berhasil disimpan! Cek status di tab Booking Saya.', 'success');
  updateBookingsBadge();
}

function saveUserBooking(booking) {
  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem('vanguard_user_bookings') || '[]');
  } catch (e) {
    existing = [];
  }
  existing.unshift(booking);
  localStorage.setItem('vanguard_user_bookings', JSON.stringify(existing));
}

function updateBookingsBadge() {
  const badge = document.getElementById('user-bookings-count');
  if (!badge) return;
  try {
    const bookings = JSON.parse(localStorage.getItem('vanguard_user_bookings') || '[]');
    badge.textContent = bookings.length;
  } catch (e) {
    badge.textContent = '0';
  }
}

// ==========================================
// MY BOOKINGS MODAL
// ==========================================
function openMyBookingsModal() {
  playSound('click');
  document.getElementById('my-bookings-modal').classList.remove('hidden');
  renderMyBookingsList();
}

function closeMyBookingsModal() {
  document.getElementById('my-bookings-modal').classList.add('hidden');
}

function renderMyBookingsList() {
  const container = document.getElementById('my-bookings-list');
  if (!container) return;

  let bookings = [];
  try {
    bookings = JSON.parse(localStorage.getItem('vanguard_user_bookings') || '[]');
  } catch (e) {
    bookings = [];
  }

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 space-y-3">
        <i data-lucide="ticket-x" class="w-10 h-10 mx-auto text-slate-600"></i>
        <p class="text-xs sm:text-sm">Belum ada reservasi aktif yang tersimpan.</p>
        <button onclick="closeMyBookingsModal(); openBookingModal();" class="px-4 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs">
          Buat Booking Pertama
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = bookings.map((b, index) => `
    <div class="p-4 rounded-xl bg-dark-900 border border-slate-800 space-y-2 relative group hover:border-gold-500/40 transition-all">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono font-bold text-gold-400">${b.code}</span>
        <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
          Terkonfirmasi
        </span>
      </div>

      <div class="space-y-1 text-xs text-slate-300">
        <p><strong class="text-white">${b.name}</strong> • ${b.services}</p>
        <p class="text-slate-400">Capster: <span class="text-white">${b.barber}</span></p>
        <p class="text-slate-400">Jadwal: <span class="text-gold-400 font-semibold">${b.date} • ${b.time} WIB</span></p>
        ${b.notes ? `<p class="text-slate-400 italic">"${b.notes}"</p>` : ''}
      </div>

      <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="font-bold text-gold-400">${formatRupiah(b.totalPrice)}</span>
        <button onclick="cancelBooking(${index})" class="text-[11px] text-rose-400 hover:text-rose-300 underline">
          Batalkan Tiket
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function cancelBooking(index) {
  if (confirm('Apakah Anda yakin ingin membatalkan jadwal reservasi ini?')) {
    playSound('click');
    let bookings = JSON.parse(localStorage.getItem('vanguard_user_bookings') || '[]');
    bookings.splice(index, 1);
    localStorage.setItem('vanguard_user_bookings', JSON.stringify(bookings));
    renderMyBookingsList();
    updateBookingsBadge();
    showToast('Reservasi telah berhasil dibatalkan.', 'info');
  }
}

// Mobile Menu Drawer Toggle
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
  }
}

// ==========================================
// INIT APP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderServices('all');
  renderBarbers();
  renderLookbook('all');
  selectFaceShape('oval');
  loadReviews();
  updateStoreStatus();
  updateBookingsBadge();

  // Set periodic store status check
  setInterval(updateStoreStatus, 60000);
});
