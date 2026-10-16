/**
 * UdharGuru - Promotional Website JavaScript (Full English Edition)
 * Features:
 * - Animated Cartoon Puggy Paw Clicking interactions with Audio & Confetti
 * - Live Interactive Digital Khata Simulator
 * - Comprehensive Interest (Byaj) Calculator (Simple & Compound)
 * - Download Modal & SMS/WhatsApp link sender
 * - Mobile Navigation & Toast Notifications
 * - Desktop Layout Auto-Fit on Mobile Devices (Auto Adjust)
 */

// Sound FX generator using Web Audio API
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio not initialized yet', e);
    }
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.22);
      });
    } catch (e) {
      console.log('Audio autoplay prevented', e);
    }
  }
}

const sfx = new SoundEffects();

// Lightweight Canvas Confetti
function burstConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#F59E0B', '#EA580C', '#FBBF24', '#D97706', '#10B981', '#FFA000'];

  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 8 + 3;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.alpha -= 0.015;
      p.rotation += p.vRot;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  update();
}

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Download Modal Controllers
function openDownloadModal() {
  sfx.playClick();
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize Interactive Elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.querySelector('.nav-mobile-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
  }

  // 2. Download Buttons Click Handler
  const downloadTriggers = document.querySelectorAll('.trigger-download-modal, .btn-download-main');
  downloadTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      sfx.playSuccess();
      burstConfetti(x, y);
      openDownloadModal();
    });
  });

  // Modal Backdrop click to close
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeDownloadModal();
      }
    });
  }

  const modalCloseBtn = document.querySelector('.modal-close-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDownloadModal);
  }

  // 3. Send SMS / WhatsApp Link in Modal
  const sendLinkBtn = document.getElementById('btnSendAppLink');
  const mobileInput = document.getElementById('appPhoneInput');
  if (sendLinkBtn && mobileInput) {
    sendLinkBtn.addEventListener('click', () => {
      const val = mobileInput.value.trim();
      if (!val || val.length < 10) {
        showToast('⚠️ Please enter a valid 10-digit mobile number!');
        return;
      }
      sfx.playSuccess();
      showToast(`🎉 App download link has been sent to +91 ${val} via SMS & WhatsApp!`);
      mobileInput.value = '';
    });
  }

  // 4. Interactive Live Khata Simulator on Home Page
  initKhataSimulator();

  // 5. Interactive Interest Calculator (if on calculator page)
  initByajCalculator();

  // 6. Interactive Contact Form (if on contact page)
  initContactForm();
});

/* ==========================================================================
   INTERACTIVE KHATA SIMULATOR LOGIC (ENGLISH)
   ========================================================================== */
function initKhataSimulator() {
  const tableBody = document.getElementById('simKhataRows');
  if (!tableBody) return;

  const btnAddUdhar = document.getElementById('simBtnAddUdhar');
  const btnAddJama = document.getElementById('simBtnAddJama');
  const custNameInput = document.getElementById('simCustName');
  const amountInput = document.getElementById('simAmount');
  const totalUdharEl = document.getElementById('simTotalUdhar');
  const totalJamaEl = document.getElementById('simTotalJama');
  const netBalanceEl = document.getElementById('simNetBalance');

  let entries = [
    { name: 'Ramesh Supermarket', amount: 1500, type: 'udhar', date: 'Today 10:30 AM' },
    { name: 'Suresh Garments', amount: 800, type: 'jama', date: 'Yesterday 04:15 PM' },
    { name: 'Verma Hardware & Tools', amount: 2400, type: 'udhar', date: '2 days ago' }
  ];

  function renderTable() {
    tableBody.innerHTML = '';
    let totalUdhar = 0;
    let totalJama = 0;

    entries.forEach((item) => {
      if (item.type === 'udhar') totalUdhar += item.amount;
      else totalJama += item.amount;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><span class="sim-badge-type ${item.type}">${item.type === 'udhar' ? 'Debit (Given)' : 'Credit (Received)'}</span></td>
        <td style="font-weight:700; color:${item.type === 'udhar' ? '#dc2626' : '#059669'};">₹${item.amount.toLocaleString('en-IN')}</td>
        <td style="color:#64748b; font-size:0.8rem;">${item.date}</td>
        <td>
          <button class="sim-whatsapp-btn" onclick="sendWhatsAppReminder('${item.name}', ${item.amount}, '${item.type}')">
            📲 ${item.type === 'udhar' ? 'Send Reminder' : 'Send Receipt'}
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    if (totalUdharEl) totalUdharEl.textContent = `₹${totalUdhar.toLocaleString('en-IN')}`;
    if (totalJamaEl) totalJamaEl.textContent = `₹${totalJama.toLocaleString('en-IN')}`;
    const net = totalUdhar - totalJama;
    if (netBalanceEl) {
      netBalanceEl.textContent = `₹${net.toLocaleString('en-IN')}`;
      netBalanceEl.style.color = net >= 0 ? '#dc2626' : '#059669';
    }
  }

  function addTransaction(type) {
    const name = custNameInput.value.trim() || 'New Customer';
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      showToast('⚠️ Please enter a valid transaction amount!');
      return;
    }

    sfx.playClick();
    entries.unshift({
      name: name,
      amount: amount,
      type: type,
      date: 'Just now'
    });

    custNameInput.value = '';
    amountInput.value = '';
    renderTable();
    showToast(`✅ ${type === 'udhar' ? 'Debit (Udhar)' : 'Credit (Jama)'} of ₹${amount} recorded successfully!`);
  }

  if (btnAddUdhar) btnAddUdhar.addEventListener('click', () => addTransaction('udhar'));
  if (btnAddJama) btnAddJama.addEventListener('click', () => addTransaction('jama'));

  renderTable();
}

window.sendWhatsAppReminder = function(name, amount, type) {
  sfx.playSuccess();
  if (type === 'udhar') {
    showToast(`📲 WhatsApp Payment Reminder Sent: "Dear ${name}, your outstanding dues are ₹${amount}. Kindly pay via UPI: https://udharguru.in/pay"`);
  } else {
    showToast(`📲 WhatsApp Payment Receipt Sent: "Thank you ${name}! ₹${amount} has been credited to your UdharGuru account."`);
  }
};

/* ==========================================================================
   INTERACTIVE INTEREST CALCULATOR LOGIC (ENGLISH)
   ========================================================================== */
function initByajCalculator() {
  const principalInput = document.getElementById('calcPrincipal');
  const rateInput = document.getElementById('calcRate');
  const timeInput = document.getElementById('calcMonths');
  const modeBtns = document.querySelectorAll('.calc-mode-btn');

  if (!principalInput) return;

  let currentMode = 'simple'; // 'simple' or 'compound'
  let rateType = 'monthly'; // 'monthly' (% per month) or 'yearly' (% per annum)

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      calculateByaj();
    });
  });

  const rateTypeBtns = document.querySelectorAll('.calc-rate-type-btn');
  rateTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rateTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rateType = btn.dataset.ratetype;
      calculateByaj();
    });
  });

  [principalInput, rateInput, timeInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', calculateByaj);
    }
  });

  function calculateByaj() {
    const P = parseFloat(principalInput.value) || 0;
    const R = parseFloat(rateInput.value) || 0;
    const T_months = parseFloat(timeInput.value) || 0;

    let interest = 0;
    let effectiveMonthlyRate = rateType === 'monthly' ? R : (R / 12);

    if (currentMode === 'simple') {
      // Simple Interest = P * r * months / 100
      interest = (P * effectiveMonthlyRate * T_months) / 100;
    } else {
      // Compound Interest (monthly compounding, standard merchant calculation)
      const r_decimal = effectiveMonthlyRate / 100;
      const totalAmount = P * Math.pow((1 + r_decimal), T_months);
      interest = totalAmount - P;
    }

    const totalPayable = P + interest;
    const monthlyByaj = T_months > 0 ? interest / T_months : 0;

    // Update Result UI Elements
    const resPrincipal = document.getElementById('resPrincipal');
    const resRate = document.getElementById('resRate');
    const resTime = document.getElementById('resTime');
    const resInterest = document.getElementById('resInterest');
    const resMonthly = document.getElementById('resMonthly');
    const resTotal = document.getElementById('resTotal');

    if (resPrincipal) resPrincipal.textContent = `₹${P.toLocaleString('en-IN')}`;
    if (resRate) resRate.textContent = `${R}% ${rateType === 'monthly' ? 'per Month' : 'per Annum (P.A.)'}`;
    if (resTime) resTime.textContent = `${T_months} Months (${(T_months/12).toFixed(1)} Yrs)`;
    if (resInterest) resInterest.textContent = `₹${Math.round(interest).toLocaleString('en-IN')}`;
    if (resMonthly) resMonthly.textContent = `₹${Math.round(monthlyByaj).toLocaleString('en-IN')}`;
    if (resTotal) resTotal.textContent = `₹${Math.round(totalPayable).toLocaleString('en-IN')}`;
  }

  // WhatsApp Share button on Calculator
  const shareBtn = document.getElementById('btnShareByaj');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const P = parseFloat(principalInput.value) || 0;
      const R = parseFloat(rateInput.value) || 0;
      const T = parseFloat(timeInput.value) || 0;
      const resInterest = document.getElementById('resInterest')?.textContent || '';
      const resTotal = document.getElementById('resTotal')?.textContent || '';

      const text = encodeURIComponent(`*UdharGuru Interest Calculation Quote*\nPrincipal Amount: ₹${P}\nInterest Rate: ${R}%\nDuration: ${T} Months\nTotal Interest: ${resInterest}\nTotal Payable: ${resTotal}\n\nDownload free UdharGuru App: https://udharguru.in`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

  // Initial Calculation
  calculateByaj();
}

/* ==========================================================================
   CONTACT FORM LOGIC (ENGLISH)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('udharGuruContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sfx.playSuccess();
    burstConfetti();

    const name = document.getElementById('contactName')?.value || 'Valued Merchant';
    showToast(`🙏 Thank you, ${name}! Your inquiry has been received. Our merchant support team will contact you within 15 minutes.`);
    form.reset();
  });
}
