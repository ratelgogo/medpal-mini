// ===== MedPal App - Main Application =====

const App = {
  init() {
    Store.subscribe(() => this.render());
    this.render();
  },

  render() {
    const { currentRoute, routeParams } = Store.state;
    const app = document.getElementById('app');
    const remoteBookingRoutes = ['patients', 'patient-new', 'hospitals', 'companions', 'companion-detail', 'order-confirm', 'order-success'];
    const remoteMedpalRoutes = ['referral', 'companion-list'];
    const remoteMedpalHeaders = {
      referral: { kicker: 'MEDPAL · REWARDS', subtitle: '好友首单完成，奖励自动到账' },
      'companion-list': { kicker: 'MEDPAL · COMPANIONS', subtitle: '杭州已认证专业陪诊师' },
    };
    const remoteBookingSubtitles = {
      patients: '为家人安排一次安心陪诊',
      'patient-new': '先完善就诊人基础信息',
      hospitals: '选择服务医院与院区',
      companions: '先选日期、时间与服务时长',
      'companion-detail': '查看陪诊师服务信息',
      'order-confirm': '确认本次陪诊服务内容',
      'order-success': '陪诊师已锁定，订单进入待服务',
    };

    let screenHTML = '';
    let showTabBar = false;
    let navTitle = '';
    let showBack = false;
    let showHome = false;

    // Determine if this is a tab route
    const tabRoutes = ['home', 'orders', 'profile'];
    const isTab = tabRoutes.includes(currentRoute);
    showTabBar = isTab;

    // Route mapping
    switch (currentRoute) {
      case 'home':
        screenHTML = Screens.home();
        showTabBar = true;
        break;
      case 'orders':
        screenHTML = Screens.orders();
        showTabBar = true;
        break;
      case 'records':
        screenHTML = Screens.records(false);
        navTitle = '健康档案';
        showBack = true;
        break;
      case 'profile':
        screenHTML = Screens.profile();
        showTabBar = true;
        break;
      case 'services':
        screenHTML = Screens.services();
        navTitle = '服务目录';
        showBack = true;
        break;
      case 'patients':
        screenHTML = Screens.patients();
        navTitle = '就诊人管理';
        showBack = true;
        showHome = true;
        break;
      case 'patient-new':
        screenHTML = Screens.patientNew();
        navTitle = '新建就诊人';
        showBack = true;
        break;
      case 'hospitals':
        screenHTML = Screens.hospitals();
        navTitle = '选择医院';
        showBack = true;
        break;
      case 'companions':
        screenHTML = Screens.companions();
        navTitle = '选择预约时间';
        showBack = true;
        break;
      case 'companion-list':
        screenHTML = Screens.companionList();
        navTitle = '全部陪诊师';
        showBack = true;
        break;
      case 'companion-detail':
        screenHTML = Screens.companionDetail(routeParams.id);
        navTitle = '陪诊师详情';
        showBack = true;
        break;
      case 'order-confirm':
        screenHTML = Screens.orderConfirm();
        navTitle = '确认订单';
        showBack = true;
        break;
      case 'order-success':
        screenHTML = Screens.orderSuccess();
        navTitle = '预约成功';
        showBack = false;
        showHome = true;
        break;
      case 'order-detail':
        screenHTML = Screens.orderDetail(routeParams.id);
        navTitle = '订单详情';
        showBack = true;
        break;
      case 'order-service':
        screenHTML = Screens.orderService(routeParams.id);
        navTitle = '服务进行中';
        showBack = true;
        break;
      case 'health-records':
        screenHTML = Screens.records();
        navTitle = '健康档案';
        showBack = true;
        showHome = true;
        break;
      case 'record-detail':
        screenHTML = Screens.recordDetail(routeParams.id);
        navTitle = '就医记录详情';
        showBack = true;
        break;
      case 'referral':
        screenHTML = Screens.referral();
        navTitle = '邀请有礼';
        showBack = true;
        break;
      case 'visit-code':
        screenHTML = Screens.visitCode(routeParams.id);
        navTitle = '就诊码';
        showBack = true;
        break;
      default:
        screenHTML = Screens.home();
        showTabBar = true;
    }

    // Build full HTML
    let html = `
      <div class="phone-frame">
        <div class="wx-status-bar">
          <span class="time">${this.getTime()}</span>
        </div>
    `;

    if (showTabBar) {
      // Tab routes: wrap screen in a flex container
      html += `<div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">`;
      html += screenHTML;
      html += `</div>`;
      html += this.renderTabBar(currentRoute);
    } else if (remoteBookingRoutes.includes(currentRoute)) {
      html += `
        <div class="remote-booking-shell">
          <header class="remote-booking-header">
            <button class="remote-booking-back" onclick="App.back()" aria-label="返回">${window.lucide ? '<i data-lucide="chevron-left"></i>' : '‹'}</button>
            <div><p>MEDPAL · BOOKING</p><h1>${navTitle}</h1><span>${remoteBookingSubtitles[currentRoute] || ''}</span></div>
          </header>
          <main class="remote-booking-content screen-enter">${screenHTML}</main>
        </div>
      `;
    } else if (remoteMedpalRoutes.includes(currentRoute)) {
      const medpalHeader = remoteMedpalHeaders[currentRoute];
      html += `
        <div class="remote-booking-shell remote-referral-shell">
          <header class="remote-booking-header remote-referral-header">
            <button class="remote-booking-back" onclick="App.back()" aria-label="返回">${window.lucide ? '<i data-lucide="chevron-left"></i>' : '‹'}</button>
            <div><p>${medpalHeader.kicker}</p><h1>${navTitle}</h1><span>${medpalHeader.subtitle}</span></div>
          </header>
          <main class="remote-booking-content ${currentRoute === 'companion-list' ? 'remote-companion-list-content' : 'remote-referral-content'} screen-enter">${screenHTML}</main>
        </div>
      `;
    } else {
      html += `
        <div class="wx-nav-bar">
          ${showBack ? '<div class="back-btn" onclick="App.back()">‹</div>' : ''}
          ${showHome ? '<div class="back-btn" onclick="App.goHome()"><i data-lucide="house"></i></div>' : ''}
          <span class="title">${navTitle}</span>
        </div>
        <div class="wx-content screen-enter">
          ${screenHTML}
        </div>
      `;
    }

    html += `
      <div class="wx-toast" id="toast"></div>
      <div class="wx-modal-mask" id="modalMask"></div>
      </div>
    `;

    app.innerHTML = html;
    this.bindEvents();
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  },

  // ===== Time display =====
  getTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  },

  // ===== Tab Bar =====
  renderTabBar(currentRoute) {
    const tabs = [
      { id: 'home', icon: 'house', label: '首页' },
      { id: 'orders', icon: 'calendar-days', label: '订单' },
      { id: 'profile', icon: 'user-round', label: '我的' },
    ];
    let html = `<div class="wx-tab-bar">`;
    for (const tab of tabs) {
      html += `
        <div class="wx-tab-item ${currentRoute === tab.id ? 'active' : ''}" onclick="App.switchTab('${tab.id}')">
          <span class="tab-icon"><i data-lucide="${tab.icon}"></i></span>
          <span>${tab.label}</span>
        </div>
      `;
    }
    html += `</div>`;
    return html;
  },

  // ===== Navigation helpers =====
  navigate(route, params = {}) {
    Store.navigate(route, params);
  },

  back() {
    Store.goBack();
  },

  goHome() {
    Store.switchTab('home');
  },

  switchTab(tab) {
    Store.switchTab(tab);
  },

  // ===== Toast =====
  showToast(msg, duration = 2000) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), duration);
    }
  },

  // ===== Modal =====
  showModal({ title, body, confirmText, cancelText, onConfirm }) {
    const mask = document.getElementById('modalMask');
    if (!mask) return;

    mask.innerHTML = `
      <div class="wx-modal">
        <div class="modal-title">${title}</div>
        <div class="modal-body">${body}</div>
        <div class="modal-actions">
          <button class="modal-btn" onclick="App.closeModal()">${cancelText || '取消'}</button>
          <button class="modal-btn" id="modalConfirmBtn">${confirmText || '确定'}</button>
        </div>
      </div>
    `;
    mask.classList.add('show');

    const confirmBtn = document.getElementById('modalConfirmBtn');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        App.closeModal();
        if (onConfirm) onConfirm();
      };
    }
  },

  closeModal() {
    const mask = document.getElementById('modalMask');
    if (mask) mask.classList.remove('show');
  },

  // ===== Event binding =====
  bindEvents() {
    // Any global event bindings can go here
  },
};

// ===== Screen Renderers =====
const Screens = {};

// ----- Home Screen -----
Screens.home = function() {
  const { userInfo } = Store.state;
  const referral = Store.state.referralInfo;
  const nextOrder = Store.state.orders.find(o => ['waiting', 'in-service', 'abnormal'].includes(o.status));
  const nextCompanion = nextOrder ? Store.getCompanion(nextOrder.companionId) : null;
  return `
    <div class="medpal-home">
      <section class="home-hero">
        <div class="home-topbar">
          <div class="brand-lockup">
            <div class="brand-mark"><i data-lucide="heart-pulse"></i></div>
            <div>
              <div class="brand-name">MedPal</div>
              <div class="brand-meta"><i data-lucide="map-pin"></i> 杭州 · 专业陪诊</div>
            </div>
          </div>
          <button class="icon-button light" aria-label="通知" onclick="App.showToast('暂无新的服务提醒')"><i data-lucide="bell"></i></button>
        </div>
        <div class="home-greeting">早上好，${userInfo.name}</div>
        <div class="home-hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">TRUSTED CARE, CLOSER TO HOME</div>
            <h1>可信的陪诊，<br><span>让家人安心就医</span></h1>
            <p>从挂号、候诊到检查取药，专业陪诊师全程在身边。</p>
            <button class="hero-cta" onclick="App.navigate('services')">开始预约 <i data-lucide="arrow-up-right"></i></button>
          </div>
          <div class="hero-portrait-wrap">
            <img class="hero-portrait" src="assets/companion-hero.png" alt="专业陪诊师头像">
            <div class="hero-trust"><i data-lucide="badge-check"></i><span>实名认证<br><b>平台审核</b></span></div>
          </div>
        </div>
      </section>

      <div class="home-content">
        <section class="section-block next-appointment-section">
          <div class="section-heading"><div><span class="section-kicker">UP NEXT</span><h2>下一次预约</h2></div><button class="text-link" onclick="App.switchTab('orders')">全部订单 <i data-lucide="chevron-right"></i></button></div>
          ${nextOrder ? `
            <div class="appointment-card" onclick="App.navigate('order-detail', { id: '${nextOrder.id}' })">
              <div class="appointment-date"><span>${new Date(nextOrder.serviceDate).getMonth() + 1}月</span><strong>${new Date(nextOrder.serviceDate).getDate()}</strong><small>${nextOrder.serviceDate.slice(0, 4)}</small></div>
              <div class="appointment-main"><div class="status-line"><span class="status-dot"></span>${ORDER_STATUS_MAP[nextOrder.status].text}</div><h3>${nextOrder.patientName} · ${nextOrder.hospitalName.split(' - ')[0]}</h3><p><i data-lucide="clock-3"></i>${nextOrder.serviceTime} · ${nextCompanion?.name || nextOrder.companionName} 陪诊师</p></div>
              <div class="round-arrow"><i data-lucide="arrow-up-right"></i></div>
            </div>
          ` : `<div class="empty-next"><div><h3>还没有待就诊安排</h3><p>选择一位陪诊师，为家人提前安排安心</p></div><button class="mini-cta" onclick="App.navigate('services')">找陪诊师</button></div>`}
        </section>

        <section class="section-block">
          <div class="section-heading"><div><span class="section-kicker">CARE SERVICES</span><h2>你可以这样开始</h2></div></div>
          <div class="quick-grid">
            <button class="quick-card quick-card-primary" onclick="App.navigate('services')"><span class="quick-icon"><i data-lucide="hand-heart"></i></span><span><b>预约陪诊</b><small>专业陪诊服务</small></span><i class="quick-arrow" data-lucide="arrow-up-right"></i></button>
            <button class="quick-card" onclick="App.navigate('patients')"><span class="quick-icon"><i data-lucide="users-round"></i></span><span><b>就诊人</b><small>${Store.state.patients.length} 位家人</small></span><i class="quick-arrow" data-lucide="arrow-up-right"></i></button>
            <button class="quick-card" onclick="App.switchTab('records')"><span class="quick-icon"><i data-lucide="notebook-tabs"></i></span><span><b>就医记录</b><small>查看服务总结</small></span><i class="quick-arrow" data-lucide="arrow-up-right"></i></button>
            <button class="quick-card" onclick="App.navigate('referral')"><span class="quick-icon"><i data-lucide="gift"></i></span><span><b>邀请有礼</b><small>奖励 ¥${MOCK_DATA.referral.rewardAmount}</small></span><i class="quick-arrow" data-lucide="arrow-up-right"></i></button>
          </div>
        </section>

        <section class="section-block service-section">
          <div class="section-heading"><div><span class="section-kicker">SERVICE MENU</span><h2>服务目录</h2></div><span class="service-city"><i data-lucide="map-pin"></i> 杭州</span></div>
          <div class="service-list">
            ${SERVICE_CATALOG.map((s, index) => `
              <button class="service-row ${s.available ? '' : 'is-disabled'}" onclick="${s.available ? `App.navigate('services')` : `App.showToast('敬请期待，即将开放')`}">
                <span class="service-icon service-icon-${index + 1}"><i data-lucide="${['stethoscope','heart-handshake','file-text','pill'][index] || 'circle'}"></i></span>
                <span class="service-copy"><b>${s.name}</b><small>${s.desc}</small></span>
                <span class="service-state ${s.available ? 'available' : ''}">${s.available ? '可预约' : '敬请期待'}</span><i class="row-arrow" data-lucide="chevron-right"></i>
              </button>
            `).join('')}
          </div>
        </section>

        <section class="section-block companion-section">
          <div class="section-heading"><div><span class="section-kicker">MEET YOUR COMPANION</span><h2>推荐陪诊师</h2></div><button class="text-link" onclick="App.navigate('companion-list')">查看全部 <i data-lucide="chevron-right"></i></button></div>
          <div class="companion-rail">${MOCK_DATA.companions.slice(0, 3).map(c => `
            <button class="companion-card" onclick="App.navigate('companion-detail', { id: '${c.id}' })">
              <div class="companion-avatar"><img src="assets/companion-hero.png" alt="${c.name}头像"></div><div class="companion-info"><b>${c.name}</b><small>${c.serviceTags[1] || '专业陪诊'}</small><span><i data-lucide="badge-check"></i> 已认证</span></div><i class="companion-next" data-lucide="arrow-up-right"></i>
            </button>`).join('')}</div>
        </section>

        <div class="home-bottom-space"></div>
      </div>
    </div>
  `;
};

Screens.homeActiveOrders = function() {
  const activeOrders = Store.state.orders.filter(o =>
    ['waiting', 'in-service', 'abnormal'].includes(o.status)
  );

  if (activeOrders.length === 0) return '';

  return `
    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">进行中的订单</div>
        ${activeOrders.map(o => {
          const statusInfo = ORDER_STATUS_MAP[o.status];
          return `
            <div class="wx-list-item" style="margin: 0 -16px; border-radius: 0;" onclick="App.navigate('order-detail', { id: '${o.id}' })">
              <div class="item-content">
                <div class="item-title">${o.patientName} · ${o.hospitalName}</div>
                <div class="item-desc">${o.serviceDate} ${o.serviceTime} · ${o.companionName}</div>
              </div>
              <span class="wx-tag ${statusInfo.color}">${statusInfo.text}</span>
              <span class="arrow">›</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

// ----- Orders Screen -----
Screens.orders = function() {
  const orders = Store.state.orders;
  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'waiting', label: '待服务' },
    { id: 'in-service', label: '服务中' },
    { id: 'completed', label: '已完成' },
  ];
  const activeTab = Store.state.routeParams.tab || 'all';

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  return `
    <div class="wx-nav-bar">
      <span class="title" style="font-size:15px; font-weight: 600;">我的订单</span>
    </div>
    <!-- Filter Tabs -->
    <div style="display: flex; background: #fff; border-bottom: 0.5px solid var(--wx-border); padding: 0 4px; flex-shrink: 0;">
      ${tabs.map(t => `
        <div onclick="App.navigate('orders', { tab: '${t.id}' })"
             style="flex:1; text-align:center; padding: 12px 0; font-size:13px; cursor:pointer; position: relative; color: ${activeTab === t.id ? 'var(--wx-green)' : 'var(--wx-text-secondary)'}; font-weight: ${activeTab === t.id ? '600' : '400'};">
          ${t.label}
          ${activeTab === t.id ? '<div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:24px; height:2px; background:var(--wx-green); border-radius:1px;"></div>' : ''}
        </div>
      `).join('')}
    </div>

    <div class="wx-content screen-enter" style="flex: 1;">
      ${filteredOrders.length === 0
        ? `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">暂无订单</div></div>`
        : filteredOrders.map(o => Screens.orderCard(o)).join('')
      }
    </div>
  `;
};

Screens.orderCard = function(o) {
  const statusInfo = ORDER_STATUS_MAP[o.status];
  const companion = Store.getCompanion(o.companionId);
  return `
    <div class="wx-card" onclick="App.navigate('order-detail', { id: '${o.id}' })" style="cursor: pointer;">
      <div class="wx-card-block">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size:11px; color: var(--wx-text-tertiary);">${o.id}</span>
          <span class="wx-tag ${statusInfo.color}">${statusInfo.icon} ${statusInfo.text}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div class="wx-avatar sm">${companion?.avatar || '?'}</div>
          <div style="flex:1;">
            <div style="font-size:14px; font-weight: 500;">${o.companionName} 陪诊师</div>
            <div style="font-size:12px; color: var(--wx-text-secondary);">${o.patientName} · ${o.hospitalName}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 0.5px solid var(--wx-border);">
          <div>
            <div style="font-size:11px; color: var(--wx-text-tertiary);">服务时间</div>
            <div style="font-size:13px; font-weight: 500;">${o.serviceDate} ${o.serviceTime}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size:11px; color: var(--wx-text-tertiary);">服务时长 / 金额</div>
            <div style="font-size:13px; font-weight: 500;">${o.hours}小时 / ¥${o.totalAmount}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ----- Profile Screen -----
Screens.profile = function() {
  const { userInfo, referralInfo } = Store.state;
  return `
    <div class="wx-nav-bar">
      <span class="title" style="font-size:15px; font-weight: 600;">我的</span>
    </div>
    <div class="wx-content screen-enter" style="flex:1;">
      <!-- User Info -->
      <div style="background: linear-gradient(135deg, #07c160, #06ad56); padding: 24px 16px; color: #fff; text-align: center;">
        <div class="wx-avatar lg" style="background: rgba(255,255,255,0.2); color: #fff; margin: 0 auto 12px;">${userInfo.avatar}</div>
        <div style="font-size:16px; font-weight: 600;">${userInfo.name}</div>
        <div style="font-size:12px; opacity: 0.8; margin-top: 4px;">${userInfo.phone}</div>
      </div>

      <!-- Reward Balance -->
      <div class="wx-card" onclick="App.navigate('referral')" style="cursor: pointer;">
        <div class="wx-card-block" style="display: flex; align-items: center; gap: 16px;">
          <div style="font-size:28px;">💰</div>
          <div style="flex:1;">
            <div style="font-size:12px; color: var(--wx-text-secondary);">奖励余额</div>
            <div style="font-size:18px; font-weight: 700; color: var(--wx-orange);">¥${referralInfo.rewardBalance}</div>
          </div>
          <div style="font-size:12px; color: var(--wx-green); font-weight: 500;">提现 ›</div>
        </div>
      </div>

      <!-- Menu List -->
      <div class="wx-list">
        <div class="wx-list-item" onclick="App.navigate('patients')">
          <div style="font-size:18px; width: 24px; text-align: center;">👥</div>
          <div class="item-content"><div class="item-title">就诊人管理</div></div>
          <span class="item-desc">${Store.state.patients.length}人</span>
          <span class="arrow">›</span>
        </div>
        <div class="wx-list-item" onclick="App.navigate('records')">
          <div style="font-size:18px; width: 24px; text-align: center;">📋</div>
          <div class="item-content"><div class="item-title">就医记录</div></div>
          <span class="item-desc">${Store.state.medicalRecords.length}条</span>
          <span class="arrow">›</span>
        </div>
        <div class="wx-list-item" onclick="App.navigate('referral')">
          <div style="font-size:18px; width: 24px; text-align: center;">🎁</div>
          <div class="item-content"><div class="item-title">邀请有礼</div></div>
          <span class="item-desc">已邀请${referralInfo.invitedCount}人</span>
          <span class="arrow">›</span>
        </div>
        <div class="wx-list-item" onclick="App.showToast('客服电话: 400-888-8888')">
          <div style="font-size:18px; width: 24px; text-align: center;">🎧</div>
          <div class="item-content"><div class="item-title">联系平台</div></div>
          <span class="arrow">›</span>
        </div>
        <div class="wx-list-item" onclick="App.showToast('设置功能开发中')">
          <div style="font-size:18px; width: 24px; text-align: center;">⚙️</div>
          <div class="item-content"><div class="item-title">设置</div></div>
          <span class="arrow">›</span>
        </div>
      </div>
      <div style="height: 20px;"></div>
    </div>
  `;
};

// ----- Services Screen -----
Screens.services = function() {
  return `
    <div class="wx-card" style="margin-top: 16px;">
      <div class="wx-card-block">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="font-size:28px;">🏥</div>
          <div>
            <div style="font-size:16px; font-weight: 600;">专业陪诊服务</div>
            <div style="font-size:12px; color: var(--wx-text-secondary);">挂号·候诊·检查·取药全程陪同</div>
          </div>
        </div>
        <div style="background: var(--wx-green-light); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size:12px; color: var(--wx-green); font-weight: 500;">✓ 已开放预约</div>
          <div style="font-size:11px; color: var(--wx-text-secondary); margin-top: 4px;">城市：杭州 · 按小时计费 · 最低1小时</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 0.5px solid var(--wx-border);">
          <span style="font-size:13px; color: var(--wx-text-secondary);">小时单价</span>
          <span style="font-size:18px; font-weight: 700; color: var(--wx-green);">¥${MOCK_DATA.pricing.hourlyRate}/小时</span>
        </div>
      </div>
    </div>

    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">服务流程</div>
        ${MOCK_DATA.sopStages.map((s, i) => `
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--wx-green-light); display: flex; align-items: center; justify-content: center; font-size:14px; flex-shrink: 0;">
              ${s.icon}
            </div>
            <div style="flex: 1;">
              <div style="font-size:13px; font-weight: 500;">${i+1}. ${s.name}</div>
              <div style="font-size:11px; color: var(--wx-text-secondary);">${s.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Start Order Button -->
    <div style="padding: 16px;">
      <button class="wx-btn primary block lg" onclick="App.startNewOrder()">
        立即预约
      </button>
    </div>
  `;
};

// Start new order flow
App.startNewOrder = function() {
  Store.resetDraftOrder();
  // Check if there are patients
  if (Store.state.patients.length === 0) {
    App.navigate('patient-new');
  } else {
    App.navigate('patients');
  }
};

// ----- Patients Screen -----
Screens.patients = function() {
  const patients = Store.state.patients;
  return `
    <div class="remote-booking-intro">
      <p>BOOKING · STEP 1 OF 4</p>
      <h2>为谁安排这次陪诊？</h2>
      <span>选择就诊人后，我们会根据登记信息完成预约资格校验。</span>
    </div>

    <section class="remote-booking-section">
      <div class="remote-booking-section-heading"><h2>我的就诊人</h2><span>${patients.length} 位家人</span></div>
      <div class="remote-patient-choice-list">
        ${patients.map(p => `
          <button class="remote-patient-choice" onclick="App.selectPatient('${p.id}')">
            <span class="remote-booking-avatar"><img src="assets/${p.gender === '男' ? 'avatar-default-male.png' : 'avatar-default-female.png'}" alt="${p.name}默认头像"></span>
            <span class="remote-patient-choice-copy"><strong>${p.name}<small>${p.relationship || '家人'}</small></strong><span>${p.gender} · ${p.age}岁 · ${p.mentalHistory === 'none' ? '精神病史：无' : p.mentalHistory === 'unknown' ? '精神病史：不清楚' : '精神病史：有'}</span></span>
            <em>${p.hasHealthRecord ? '有档案' : '待完善'}</em><i data-lucide="chevron-right"></i>
          </button>
        `).join('')}
      </div>
    </section>

    <button class="remote-booking-add" onclick="App.navigate('patient-new')"><span>＋</span><strong>新建就诊人</strong><i data-lucide="arrow-up-right"></i></button>

    <div class="remote-booking-note"><strong>${window.lucide ? '<i data-lucide="shield-check"></i>' : '✓'} 就诊人信息仅用于本次预约</strong><p>年龄和特定精神疾病史用于预约资格校验，不形成诊断或风险评级。</p></div>
  `;
};

// Select patient for order
App.selectPatient = function(patientId) {
  const patient = Store.getPatient(patientId);
  const eligibility = Store.checkEligibility(patient);

  if (!eligibility.pass) {
    App.showModal({
      title: '预约资格校验',
      body: eligibility.reason,
      confirmText: '知道了',
      cancelText: '返回',
      onConfirm: null,
    });
    return;
  }

  Store.updateDraftOrder({ patientId });
  App.navigate('hospitals');
};

// ----- Patient New Screen -----
Screens.patientNew = function() {
  return `
    <div class="remote-form-intro">
      <p>BOOKING · PROFILE</p>
      <h2>完善就诊人信息</h2>
      <span>信息仅用于本次陪诊预约和服务范围判断。</span>
    </div>

    <section class="remote-form-card">
      <div class="remote-form-field">
        <label for="patientName">姓名</label>
        <input type="text" class="remote-form-input" id="patientName" placeholder="请输入就诊人姓名" />
      </div>
      <div class="remote-form-field">
        <label for="patientAge">年龄（周岁）</label>
        <input type="number" class="remote-form-input" id="patientAge" placeholder="请输入年龄" min="0" max="120" />
      </div>
      <button class="remote-form-select" onclick="App.showGenderPicker()"><span><small>性别</small><strong id="genderValue">请选择</strong></span><i data-lucide="chevron-right"></i></button>
      <button class="remote-form-select" onclick="App.showRelationshipPicker()"><span><small>与您的关系</small><strong id="relationshipValue">请选择</strong></span><i data-lucide="chevron-right"></i></button>
      <button class="remote-form-select" onclick="App.showMentalHistoryPicker()"><span><small>特定精神疾病史</small><strong id="mentalHistoryValue">请选择</strong></span><i data-lucide="chevron-right"></i></button>
    </section>

    <section id="mentalDetailsSection" class="remote-form-card remote-mental-details" style="display: none;">
      <div class="remote-form-section-title"><h3>选择疾病类型</h3><span>至少一项</span></div>
      <div class="remote-mental-options">
        ${MOCK_DATA.mentalIllnessOptions.map(m => `
          <button class="remote-mental-option" onclick="App.toggleMentalIllness('${m}')"><span>${m}</span><strong id="mental_${m}">○</strong></button>
        `).join('')}
      </div>
      <div class="remote-form-field remote-form-textarea-field">
        <label for="mentalDetailsText">补充说明（选填）</label>
        <textarea class="remote-form-textarea" id="mentalDetailsText" placeholder="如需补充具体情况请填写"></textarea>
      </div>
    </section>

    <div class="remote-booking-note remote-form-warning"><strong><i data-lucide="shield-alert"></i> 信息使用说明</strong><p>以上信息仅用于当前服务范围判断，不形成诊断或风险评级。年龄超过80周岁或命中特定精神疾病项时暂不支持预约。</p></div>
    <button class="remote-form-submit" onclick="App.savePatient()">保存并继续 ${window.lucide ? '<i data-lucide="arrow-right"></i>' : '→'}</button>
  `;
};

// Patient form state
App.patientForm = {
  gender: null,
  relationship: null,
  mentalHistory: null,
  mentalDetails: [],
};

App.showGenderPicker = function() {
  App.showModal({
    title: '选择性别',
    body: '',
    confirmText: null,
    cancelText: '关闭',
    onConfirm: null,
  });
  // Override modal with custom picker
  const mask = document.getElementById('modalMask');
  mask.innerHTML = `
    <div class="wx-modal">
      <div class="modal-title">选择性别</div>
      <div style="padding: 0 0 16px;">
        <div class="wx-select-row" onclick="App.selectGender('男')"><span class="label">男</span><span>›</span></div>
        <div class="wx-select-row" onclick="App.selectGender('女')"><span class="label">女</span><span>›</span></div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn" onclick="App.closeModal()">关闭</button>
      </div>
    </div>
  `;
};

App.selectGender = function(gender) {
  App.patientForm.gender = gender;
  document.getElementById('genderValue').textContent = gender;
  document.getElementById('genderValue').classList.add('filled');
  App.closeModal();
};

App.showRelationshipPicker = function() {
  const mask = document.getElementById('modalMask');
  mask.classList.add('show');
  const options = ['本人', '母亲', '父亲', '配偶', '子女', '其他亲属', '朋友'];
  mask.innerHTML = `
    <div class="wx-modal">
      <div class="modal-title">选择关系</div>
      <div style="max-height: 300px; overflow-y: auto;">
        ${options.map(r => `
          <div class="wx-select-row" onclick="App.selectRelationship('${r}')"><span class="label">${r}</span><span>›</span></div>
        `).join('')}
      </div>
      <div class="modal-actions">
        <button class="modal-btn" onclick="App.closeModal()">关闭</button>
      </div>
    </div>
  `;
};

App.selectRelationship = function(rel) {
  App.patientForm.relationship = rel;
  document.getElementById('relationshipValue').textContent = rel;
  document.getElementById('relationshipValue').classList.add('filled');
  App.closeModal();
};

App.showMentalHistoryPicker = function() {
  const mask = document.getElementById('modalMask');
  mask.classList.add('show');
  mask.innerHTML = `
    <div class="wx-modal">
      <div class="modal-title">特定精神疾病史</div>
      <div>
        <div class="wx-select-row" onclick="App.selectMentalHistory('none')"><span class="label">无</span><span>›</span></div>
        <div class="wx-select-row" onclick="App.selectMentalHistory('unknown')"><span class="label">不清楚</span><span>›</span></div>
        <div class="wx-select-row" onclick="App.selectMentalHistory('has')"><span class="label">有</span><span>›</span></div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn" onclick="App.closeModal()">关闭</button>
      </div>
    </div>
  `;
};

App.selectMentalHistory = function(val) {
  App.patientForm.mentalHistory = val;
  App.patientForm.mentalDetails = [];

  const labels = { none: '无', unknown: '不清楚', has: '有' };
  document.getElementById('mentalHistoryValue').textContent = labels[val];
  document.getElementById('mentalHistoryValue').classList.add('filled');

  const detailsSection = document.getElementById('mentalDetailsSection');
  detailsSection.style.display = val === 'has' ? 'block' : 'none';

  // Reset mental illness selections
  if (val !== 'has') {
    MOCK_DATA.mentalIllnessOptions.forEach(m => {
      const el = document.getElementById(`mental_${m}`);
      if (el) {
        el.textContent = '○';
        el.closest('.remote-mental-option')?.classList.remove('selected');
      }
    });
    const text = document.getElementById('mentalDetailsText');
    if (text) text.value = '';
  }

  App.closeModal();
};

App.toggleMentalIllness = function(illness) {
  const idx = App.patientForm.mentalDetails.indexOf(illness);
  const value = document.getElementById(`mental_${illness}`);
  const option = value?.closest('.remote-mental-option');
  if (idx > -1) {
    App.patientForm.mentalDetails.splice(idx, 1);
    if (value) value.textContent = '○';
    option?.classList.remove('selected');
  } else {
    App.patientForm.mentalDetails.push(illness);
    if (value) value.textContent = '●';
    option?.classList.add('selected');
  }
};

App.savePatient = function() {
  const name = document.getElementById('patientName').value.trim();
  const age = parseInt(document.getElementById('patientAge').value);

  if (!name) { App.showToast('请输入姓名'); return; }
  if (!App.patientForm.gender) { App.showToast('请选择性别'); return; }
  if (!age || age < 0) { App.showToast('请输入有效年龄'); return; }
  if (!App.patientForm.relationship) { App.showToast('请选择关系'); return; }
  if (!App.patientForm.mentalHistory) { App.showToast('请选择精神疾病史'); return; }
  if (App.patientForm.mentalHistory === 'has' && App.patientForm.mentalDetails.length === 0) {
    App.showToast('请至少选择一项精神疾病类型'); return;
  }

  const patient = Store.addPatient({
    name,
    gender: App.patientForm.gender,
    age,
    ageConfirmDate: new Date().toISOString().slice(0, 10),
    relationship: App.patientForm.relationship,
    mentalHistory: App.patientForm.mentalHistory,
    mentalDetails: [...App.patientForm.mentalDetails],
    mentalDetailsText: document.getElementById('mentalDetailsText')?.value || '',
  });

  // Check eligibility
  const eligibility = Store.checkEligibility(patient);

  if (!eligibility.pass) {
    App.showModal({
      title: '预约资格校验未通过',
      body: eligibility.reason,
      confirmText: '知道了',
      onConfirm: () => App.back(),
    });
    return;
  }

  App.showToast('就诊人创建成功');
  setTimeout(() => {
    Store.updateDraftOrder({ patientId: patient.id });
    App.navigate('hospitals');
  }, 1000);
};

// ----- Hospitals Screen -----
Screens.hospitals = function() {
  return `
    <div class="remote-booking-intro">
      <p>BOOKING · STEP 2 OF 4</p>
      <h2>选择医院与院区</h2>
      <span>目前提供杭州院内陪诊服务，请选择本次就诊地点。</span>
    </div>

    <section class="remote-booking-location-card">
      <span class="remote-booking-location-icon"><i data-lucide="map-pin"></i></span>
      <div><small>服务城市</small><strong>杭州</strong><p>一期固定服务城市，更多城市敬请期待</p></div>
      <em>可预约</em>
    </section>

    <section class="remote-booking-section remote-hospital-section">
      <div class="remote-booking-section-heading"><h2>医院列表</h2><span>${MOCK_DATA.hospitals.length} 家医院</span></div>
      <div class="remote-hospital-list">
        ${MOCK_DATA.hospitals.map(h => `
          <article class="remote-hospital-card">
            <div class="remote-hospital-heading"><span class="remote-hospital-icon"><i data-lucide="building-2"></i></span><h3>${h.name}</h3></div>
            <div class="remote-campus-list">
              ${h.campuses.map(c => `
                <button class="remote-campus-choice" onclick="App.selectHospital('${h.id}', '${c.id}')"><span><strong>${c.name}</strong><small>${c.address}</small></span><i data-lucide="chevron-right"></i></button>
              `).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <div class="remote-booking-note"><strong><i data-lucide="info"></i> 医院信息由平台统一维护</strong><p>一期仅支持从后台配置的医院与院区中选择，不支持自由录入。</p></div>
  `;
};

App.selectHospital = function(hospitalId, campusId) {
  Store.updateDraftOrder({ hospitalId, campusId });
  App.navigate('companions');
};

// ----- Companions Screen -----
Screens.companions = function() {
  const draft = Store.state.draftOrder;
  const companions = Store.getCompanionsForHospital(draft.hospitalId);
  const hospital = Store.getHospital(draft.hospitalId);
  const campus = hospital?.campuses.find(c => c.id === draft.campusId);
  const sourceDates = [...new Set(companions.flatMap(c => c.availableSlots.map(slot => slot.date)))].sort();
  const bookingStartDate = sourceDates[0] || formatBookingDate(new Date());
  const dates = Array.from({ length: 15 }, (_, index) => {
    const value = new Date(`${bookingStartDate}T00:00:00`);
    value.setDate(value.getDate() + index);
    return formatBookingDate(value);
  });
  const selectedDate = dates.includes(draft.serviceDate) ? draft.serviceDate : dates[0] || null;
  const dateSlots = companions.flatMap(c => bookingSlotTimesForDate(c, selectedDate, bookingStartDate));
  const times = [...new Set(dateSlots.map(bookingHourFromRange).filter(Boolean))]
    .filter(time => companions.some(c => bookingCompanionCanCover(c, selectedDate, time, 2, bookingStartDate)))
    .sort((a, b) => bookingTimeToMinutes(a) - bookingTimeToMinutes(b));
  const selectedTime = draft.serviceDate === selectedDate && times.includes(draft.serviceTime) ? draft.serviceTime : null;
  const availableCompanions = selectedTime
    ? companions.filter(c => bookingCompanionCanCover(c, selectedDate, selectedTime, draft.hours, bookingStartDate))
    : [];

  return `
    <div class="remote-booking-intro">
      <p>BOOKING · STEP 3 OF 4</p>
      <h2>先选日期和时间</h2>
      <span>确定就诊安排后，我们会为你筛选当时有时间的陪诊师。</span>
    </div>

    <section class="remote-booking-context"><span class="remote-booking-context-icon"><i data-lucide="map-pin"></i></span><div><small>本次就诊地点</small><strong>${hospital?.name || '杭州医院'} · ${campus?.name || '院区'}</strong></div><i data-lucide="check-circle-2"></i></section>

    <section class="remote-booking-section remote-date-time-section">
      <div class="remote-booking-section-heading"><h2>选择日期</h2><span>未来 15 天</span></div>
      ${dates.length ? `<div class="remote-booking-date-rail">${dates.map(date => {
        const value = new Date(`${date}T00:00:00`);
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return `<button class="remote-booking-date ${date === selectedDate ? 'selected' : ''}" onclick="App.selectBookingDate('${date}')"><span>${weekdays[value.getDay()]}</span><b>${value.getDate()}</b><small>${value.getMonth() + 1}月</small></button>`;
      }).join('')}</div>` : '<div class="remote-booking-empty"><span>📅</span><strong>暂无可预约日期</strong><p>当前院区暂未发布可约时段，请联系平台</p></div>'}
    </section>

    ${selectedDate && dates.length ? `
      <section class="remote-booking-section remote-time-selection-section">
        <div class="remote-booking-section-heading"><h2>选择时间点</h2><span>${times.length} 个可选整点</span></div>
        <div class="remote-time-grid remote-booking-time-grid">${times.map(time => `<button class="remote-time-option ${time === selectedTime ? 'selected' : ''}" onclick="App.selectBookingTime('${selectedDate}', '${time}')">${time === selectedTime ? '✓ ' : ''}${time}</button>`).join('')}</div>
        ${times.length === 0 ? '<div class="remote-no-slot">这一天暂时没有可选时间，请换一个日期。</div>' : ''}
      </section>
    ` : ''}

    ${selectedTime ? `
      <section class="remote-duration-card">
        <div class="remote-duration-heading"><div><h2>选择服务时长</h2><span>按小时计费</span></div><strong>${draft.hours} 小时</strong></div>
        <div class="remote-duration-stepper"><button ${draft.hours <= 2 ? 'disabled' : ''} onclick="App.adjustBookingHours(-1)" aria-label="减少一小时">−</button><b>${draft.hours}</b><button onclick="App.adjustBookingHours(1)" aria-label="增加一小时">＋</button></div>
        <p>最低 2 小时，可按 1 小时增加</p>
      </section>
    ` : ''}

    ${selectedTime ? `
      <section class="remote-booking-section remote-available-companions-section">
        <div class="remote-booking-section-heading"><h2>可用陪诊师</h2><span>${availableCompanions.length} 位可选</span></div>
        <div class="remote-companion-booking-list">
          ${availableCompanions.length
            ? availableCompanions.map(c => Screens.availableCompanionCard(c, draft)).join('')
            : `<div class="remote-booking-empty"><span>🕒</span><strong>当前时段暂无可用陪诊师</strong><p>可以更换时间点，或联系平台协助安排。</p><button class="remote-full-action" onclick="App.showToast('请联系平台：400-888-8888')">联系平台</button></div>`}
        </div>
      </section>
    ` : '<div class="remote-booking-next-hint"><i data-lucide="arrow-down"></i><span>选择时间后，将展示可用陪诊师</span></div>'}

    <div class="remote-booking-note"><strong><i data-lucide="shield-check"></i> 可约信息实时匹配</strong><p>陪诊师会根据医院、日期、时间点和服务时长动态筛选，支付前仍可返回修改。</p></div>
  `;
};

function bookingTimeToMinutes(range) {
  const start = String(range || '').split('-')[0] || '';
  const [hours, minutes] = start.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function bookingHourFromRange(range) {
  const start = bookingTimeToMinutes(range);
  if (!Number.isFinite(start) || String(range || '').split('-').length < 2) return null;
  return `${String(Math.floor(start / 60)).padStart(2, '0')}:00`;
}

function formatBookingDate(date) {
  const value = date instanceof Date ? date : new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

function bookingSlotTimesForDate(companion, date, anchorDate) {
  if (!companion || !date) return [];
  const directSlot = (companion.availableSlots || []).find(slot => slot.date === date);
  if (directSlot) return directSlot.times || [];

  // Mock data only includes a few dates. Repeat each陪诊师的 existing schedule pattern
  // for the remaining preview days until the real排班接口 is connected.
  const slots = companion.availableSlots || [];
  if (!slots.length) return [];
  const anchor = new Date(`${anchorDate}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);
  const dayOffset = Math.max(0, Math.round((target - anchor) / 86400000));
  return slots[dayOffset % slots.length]?.times || [];
}

function bookingTimeRange(range) {
  const [startValue, endValue] = String(range || '').split('-');
  const toMinutes = (value) => {
    const [hours, minutes] = String(value || '').split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };
  return { start: toMinutes(startValue), end: toMinutes(endValue) };
}

function bookingCompanionCanCover(companion, date, selectedTime, hours, anchorDate) {
  const ranges = bookingSlotTimesForDate(companion, date, anchorDate || date)
    .map(bookingTimeRange)
    .filter(range => range.end > range.start)
    .sort((a, b) => a.start - b.start);
  const selectedStart = bookingTimeToMinutes(selectedTime);
  const selected = ranges.find(range => range.start <= selectedStart && range.end > selectedStart);
  if (!selected || selectedStart % 60 !== 0) return false;

  const targetEnd = selectedStart + Math.max(2, Number(hours) || 2) * 60;
  let coveredUntil = selected.end;
  while (coveredUntil < targetEnd) {
    const next = ranges.filter(range => range.start <= coveredUntil && range.end > coveredUntil).sort((a, b) => b.end - a.end)[0];
    if (!next || next.end <= coveredUntil) return false;
    coveredUntil = next.end;
  }
  return true;
}

App.selectBookingDate = function(date) {
  Store.updateDraftOrder({ serviceDate: date, serviceTime: null, companionId: null });
};

App.selectBookingTime = function(date, time) {
  Store.updateDraftOrder({ serviceDate: date, serviceTime: time, companionId: null });
};

App.adjustBookingHours = function(delta) {
  const draft = Store.state.draftOrder;
  const hours = Math.max(2, (Number(draft.hours) || 2) + delta);
  Store.updateDraftOrder({ hours, companionId: null });
};

App.selectAvailableCompanion = function(event, companionId) {
  event?.stopPropagation();
  Store.updateDraftOrder({ companionId });
  App.navigate('order-confirm');
};

Screens.availableCompanionCard = function(c, draft) {
  return `
    <article class="remote-available-companion-card">
      <button class="remote-doctor-hero" onclick="App.navigate('companion-detail', { id: '${c.id}' })">
        <span class="remote-doctor-avatar"><img src="assets/${c.gender === '男' ? 'avatar-default-male.png' : 'avatar-default-female.png'}" alt="${c.name}默认头像"></span>
        <span class="remote-doctor-copy"><strong>${c.name}</strong><small>${c.gender} · ${c.age}岁 · 专业陪诊</small><em>✓ 已认证执业信息</em></span>
        <i data-lucide="chevron-right"></i>
      </button>
      <p class="remote-doctor-intro">${c.intro}</p>
      <div class="remote-available-companion-meta"><div><span>本次时段</span><strong>${draft.serviceTime}</strong></div><div><span>服务价格</span><strong>¥${MOCK_DATA.pricing.hourlyRate * draft.hours}</strong></div></div>
      <button class="remote-choose-companion" onclick="App.selectAvailableCompanion(event, '${c.id}')">选择这位陪诊师 <i data-lucide="arrow-right"></i></button>
    </article>
  `;
};

// 保留旧入口兼容陪诊师详情页的时段点击行为。
App.selectCompanionSlot = function(event, companionId, date, time) {
  event?.stopPropagation();
  App.selectBookingTime(date, bookingHourFromRange(time) || time);
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${month}月${day}日 ${weekdays[d.getDay()]}`;
}

// ----- All Companions Screen -----
Screens.companionList = function() {
  const metaById = {
    c1: { years: 3, orders: 1268, rating: '4.9' },
    c2: { years: 5, orders: 742, rating: '4.8' },
    c3: { years: 2, orders: 516, rating: '4.8' },
    c4: { years: 4, orders: 936, rating: '4.9' },
  };

  return `
    <div class="remote-all-companions-page">
      <div class="remote-all-companions-intro">
        <p>MEET YOUR COMPANIONS</p>
        <h2>选择适合你的陪诊师</h2>
        <span>每位陪诊师均已完成实名认证和平台审核，服务前可先查看档案。</span>
      </div>

      <section class="remote-all-companions-summary"><span class="remote-all-companions-summary-icon"><i data-lucide="users-round"></i></span><div><strong>${MOCK_DATA.companions.length} 位认证陪诊师</strong><small>杭州 · 专业陪诊服务</small></div><em>可预约</em></section>

      <div class="remote-all-companions-list">
        ${MOCK_DATA.companions.map(c => {
          const meta = metaById[c.id] || { years: 3, orders: 500, rating: '4.8' };
          return `
            <article class="remote-all-companion-card">
              <div class="remote-all-companion-head">
                <span class="remote-all-companion-avatar"><img src="assets/${c.gender === '男' ? 'avatar-default-male.png' : 'avatar-default-female.png'}" alt="${c.name}默认头像"></span>
                <div class="remote-all-companion-copy"><div class="remote-all-companion-name-row"><h3>${c.name}</h3><span class="remote-all-companion-rating"><i data-lucide="star"></i>${meta.rating}</span></div><p>${c.gender} · ${c.age}岁 · 已认证</p></div>
              </div>
              <div class="remote-all-companion-stats"><span><strong>从业 ${meta.years} 年</strong><small>陪诊经验</small></span><span><strong>${meta.orders} 单</strong><small>已服务</small></span><span><strong>杭州</strong><small>服务范围</small></span></div>
              <p class="remote-all-companion-intro">${c.intro}</p>
              <div class="remote-all-companion-tags">${c.serviceTags.map(tag => `<span>${tag}</span>`).join('')}</div>
              <div class="remote-all-companion-footer"><button class="remote-all-companion-detail" onclick="App.navigate('companion-detail', { id: '${c.id}' })">查看档案 <i data-lucide="chevron-right"></i></button><button class="remote-all-companion-cta" onclick="App.startNewOrder()">立即预约</button></div>
            </article>
          `;
        }).join('')}
      </div>

      <p class="remote-all-companions-note"><i data-lucide="shield-check"></i>支付前可以返回修改陪诊师，支付成功后所选服务时段将被锁定。</p>
    </div>
  `;
};

// ----- Companion Detail Screen -----
Screens.companionDetail = function(id) {
  const c = Store.getCompanion(id);
  if (!c) return '<div class="empty-state"><div class="empty-text">陪诊师不存在</div></div>';

  return `
    <div class="remote-companion-detail-page">
      <section class="remote-companion-profile">
        <div class="remote-companion-profile-top">
          <span class="remote-companion-profile-avatar"><img src="assets/${c.gender === '男' ? 'avatar-default-male.png' : 'avatar-default-female.png'}" alt="${c.name}默认头像"></span>
          <div class="remote-companion-profile-copy"><p>MEDPAL · 专业陪诊</p><h2>${c.name}</h2><span>${c.gender} · ${c.age}岁 · 杭州服务范围</span></div>
          <span class="remote-companion-profile-badge"><i data-lucide="badge-check"></i>已认证</span>
        </div>
        <div class="remote-companion-profile-stats"><span><strong>已认证</strong><small>实名认证</small></span><span><strong>专业陪诊</strong><small>服务类型</small></span><span><strong>杭州</strong><small>服务范围</small></span></div>
      </section>

      <section class="remote-companion-detail-card">
        <div class="remote-companion-detail-section-heading"><h2>服务标签</h2><span>${c.serviceTags.length + 2} 项</span></div>
        <div class="remote-companion-tags"><span><i data-lucide="badge-check"></i>实名认证</span><span><i data-lucide="shield-check"></i>后台审核通过</span>${c.serviceTags.map(tag => `<span>${tag}</span>`).join('')}</div>
      </section>

      <section class="remote-companion-detail-card">
        <div class="remote-companion-detail-section-heading"><h2>关于陪诊师</h2></div>
        <p class="remote-companion-introduction">${c.intro}</p>
      </section>

      <section class="remote-companion-detail-card remote-companion-availability-card">
        <div class="remote-companion-detail-section-heading"><div><h2>可预约时间</h2><span>请选择一个整点开始服务</span></div><i data-lucide="calendar-days"></i></div>
        <div class="remote-companion-availability-list">
          ${c.availableSlots.map(slot => `
            <div class="remote-companion-availability-day">
              <div class="remote-companion-day-label"><strong>${formatDate(slot.date)}</strong><small>可预约</small></div>
              <div class="remote-companion-detail-time-grid">${slot.times.map(t => `<button class="remote-companion-detail-time" onclick="App.selectCompanionSlotDirect('${c.id}', '${slot.date}', '${t}')">${bookingHourFromRange(t) || t}</button>`).join('')}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <div class="remote-companion-detail-note"><i data-lucide="info"></i><span>选择时间后会返回确认页，你还可以继续调整服务时长和支付方式。</span></div>
    </div>
  `;
};

App.selectCompanionSlotDirect = function(companionId, date, time) {
  Store.updateDraftOrder({
    companionId,
    serviceDate: date,
    serviceTime: bookingHourFromRange(time) || time,
  });
  App.navigate('order-confirm');
};

// ----- Order Confirm Screen -----
Screens.orderConfirm = function() {
  const draft = Store.state.draftOrder;
  const patient = Store.getPatient(draft.patientId);
  const hospital = Store.getHospital(draft.hospitalId);
  const campus = hospital?.campuses.find(c => c.id === draft.campusId);
  const companion = Store.getCompanion(draft.companionId);

  if (!patient || !campus || !companion || !draft.serviceDate) {
    return '<div class="empty-state"><div class="empty-text">订单信息不完整，请重新选择</div><button class="wx-btn outline" style="margin-top:12px;" onclick="App.goHome()">返回首页</button></div>';
  }

  const pricing = MOCK_DATA.pricing;
  const baseAmount = pricing.hourlyRate * draft.hours;
  const couponAmount = Store.state.referralInfo.couponAvailable ? Store.state.referralInfo.couponAmount : 0;
  const totalAmount = Math.max(0, baseAmount - couponAmount);
  const paymentMethod = draft.paymentMethod || 'wechat';
  const balance = Number(Store.state.userInfo.balance || 0);
  const balanceCanPay = balance >= totalAmount;

  return `
    <div class="remote-confirm-page">
      <div class="remote-booking-intro remote-confirm-intro">
        <p>BOOKING · STEP 4 OF 4</p>
        <h2>确认预约信息</h2>
        <span>请确认本次就诊安排。支付后，陪诊师和预约时间将被锁定。</span>
      </div>

      <section class="remote-confirm-card remote-confirm-patient-card">
        <div class="remote-confirm-card-heading">
          <div class="remote-confirm-heading-icon"><i data-lucide="user-round"></i></div>
          <div><small>本次就诊人</small><strong>${patient.name} <em>${patient.relationship}</em></strong><span>${patient.gender} · ${patient.age}岁</span></div>
          <span class="remote-confirm-badge"><i data-lucide="badge-check"></i>资格通过</span>
        </div>
      </section>

      <section class="remote-confirm-card">
        <div class="remote-confirm-section-heading"><h2>预约安排</h2><span>已选择</span></div>
        <div class="remote-confirm-schedule">
          <div class="remote-confirm-schedule-row remote-confirm-schedule-hospital">
            <span class="remote-confirm-row-icon"><i data-lucide="map-pin"></i></span>
            <div><small>就诊医院</small><strong>${hospital.name}</strong><span>${campus.name}</span></div>
          </div>
          <div class="remote-confirm-schedule-grid">
            <div class="remote-confirm-schedule-row"><span class="remote-confirm-row-icon"><i data-lucide="calendar-days"></i></span><div><small>服务日期</small><strong>${formatDate(draft.serviceDate)}</strong></div></div>
            <div class="remote-confirm-schedule-row"><span class="remote-confirm-row-icon"><i data-lucide="clock-3"></i></span><div><small>服务时间</small><strong>${draft.serviceTime}</strong></div></div>
          </div>
          <div class="remote-confirm-schedule-row"><span class="remote-confirm-row-icon"><i data-lucide="heart-handshake"></i></span><div><small>陪诊师</small><strong>${companion.name}</strong><span>${companion.gender} · 专业陪诊</span></div></div>
        </div>
      </section>

      <section class="remote-confirm-card remote-confirm-hours-card">
        <div class="remote-confirm-section-heading"><div><h2>服务时长</h2><span>按小时计费，可按 1 小时增加</span></div><strong>${draft.hours} 小时</strong></div>
        <div class="remote-confirm-stepper"><button class="remote-confirm-stepper-button" ${draft.hours <= 2 ? 'disabled' : ''} onclick="App.adjustHours(-1)" aria-label="减少一小时"><i data-lucide="minus"></i></button><b>${draft.hours}</b><button class="remote-confirm-stepper-button" onclick="App.adjustHours(1)" aria-label="增加一小时"><i data-lucide="plus"></i></button></div>
        <p>最低购买 2 小时，服务中可续时</p>
      </section>

      <section class="remote-confirm-card remote-confirm-note-card">
        <div class="remote-confirm-section-heading"><h2>服务备注</h2><span>选填</span></div>
        <label class="remote-confirm-field-label" for="serviceNote">告诉陪诊师需要特别留意的事项</label>
        <textarea class="remote-confirm-textarea" id="serviceNote" placeholder="如：既往病史、过敏史、轮椅需求等" onchange="Store.updateDraftOrder({ serviceNote: this.value })">${draft.serviceNote}</textarea>
      </section>

      <section class="remote-confirm-card remote-confirm-cost-card">
        <div class="remote-confirm-section-heading"><h2>费用明细</h2><span>支付前可核对</span></div>
        <div class="remote-confirm-cost-row"><span>服务金额</span><strong>¥${pricing.hourlyRate} × ${draft.hours} 小时</strong><b>¥${baseAmount}</b></div>
        ${couponAmount > 0 ? `<div class="remote-confirm-cost-row"><span>首单优惠券</span><strong class="remote-confirm-discount">已优惠</strong><b class="remote-confirm-discount">-¥${couponAmount}</b></div>` : ''}
        <div class="remote-confirm-total"><span>应付金额</span><strong>¥${totalAmount}</strong></div>
      </section>

      <section class="remote-confirm-card remote-payment-card">
        <div class="remote-confirm-section-heading"><h2>支付方式</h2><span>请选择一种方式</span></div>
        <div class="remote-payment-method-list">
          <button class="remote-payment-method ${paymentMethod === 'balance' && balanceCanPay ? 'selected' : ''} ${!balanceCanPay ? 'disabled' : ''}" ${!balanceCanPay ? 'disabled' : ''} onclick="App.selectPaymentMethod('balance')">
            <span class="remote-payment-method-icon"><i data-lucide="wallet-cards"></i></span>
            <span class="remote-payment-method-copy"><strong>余额支付</strong><small>账户余额 ¥${balance.toFixed(2)}${balanceCanPay ? '' : ' · 余额不足'}</small></span>
            <span class="remote-payment-radio" aria-hidden="true"><i></i></span>
          </button>
          <button class="remote-payment-method ${paymentMethod === 'wechat' ? 'selected' : ''}" onclick="App.selectPaymentMethod('wechat')">
            <span class="remote-payment-method-icon wechat"><i data-lucide="message-circle"></i></span>
            <span class="remote-payment-method-copy"><strong>微信支付</strong><small>使用微信安全支付</small></span>
            <span class="remote-payment-radio" aria-hidden="true"><i></i></span>
          </button>
        </div>
      </section>

      <div class="remote-confirm-assurance"><i data-lucide="shield-check"></i><span>支付成功后将锁定陪诊师和预约时间，生成 4 位就诊码，订单直接进入待服务。</span></div>

      <div class="remote-confirm-footer">
        <div><span>合计</span><strong>¥${totalAmount}</strong></div>
        <button class="remote-confirm-submit" onclick="App.processPayment()">立即支付 <i data-lucide="arrow-right"></i></button>
      </div>
    </div>
  `;
};

App.selectPaymentMethod = function(method) {
  if (method === 'balance') {
    const pricing = MOCK_DATA.pricing;
    const draft = Store.state.draftOrder;
    const couponAmount = Store.state.referralInfo.couponAvailable ? Store.state.referralInfo.couponAmount : 0;
    const totalAmount = Math.max(0, pricing.hourlyRate * draft.hours - couponAmount);
    const balance = Number(Store.state.userInfo.balance || 0);
    if (balance < totalAmount) {
      App.showToast('账户余额不足，请选择微信支付');
      return;
    }
  }
  Store.updateDraftOrder({ paymentMethod: method === 'balance' ? 'balance' : 'wechat' });
};

App.adjustHours = function(delta) {
  const draft = Store.state.draftOrder;
  const newHours = Math.max(2, draft.hours + delta);
  Store.updateDraftOrder({ hours: newHours });
};

App.processPayment = function() {
  const draft = Store.state.draftOrder;
  if (draft.paymentMethod === 'balance') {
    const pricing = MOCK_DATA.pricing;
    const couponAmount = Store.state.referralInfo.couponAvailable ? Store.state.referralInfo.couponAmount : 0;
    const totalAmount = Math.max(0, pricing.hourlyRate * draft.hours - couponAmount);
    if (Number(Store.state.userInfo.balance || 0) < totalAmount) {
      App.showToast('账户余额不足，请选择微信支付');
      return;
    }
  }
  const order = Store.createOrder();
  App.navigate('order-success', { id: order.id });
};

// ----- Order Success Screen -----
Screens.orderSuccess = function() {
  const params = Store.state.routeParams;
  const order = Store.state.orders.find(o => o.id === params.id) || Store.state.orders[0];
  const paymentLabel = order.paymentMethod === 'balance' ? '余额支付' : '微信支付';

  return `
    <div class="remote-success-page">
      <section class="remote-success-hero">
        <div class="remote-success-mark"><i data-lucide="check"></i></div>
        <p>BOOKING COMPLETE</p>
        <h2>预约成功</h2>
        <span>陪诊师已锁定，订单进入待服务</span>
      </section>

      <section class="remote-success-code-card">
        <div class="remote-success-section-heading"><div><h2>就诊码</h2><span>仅您和陪诊师可查看</span></div><i data-lucide="shield-check"></i></div>
        <div class="remote-success-code-grid">${String(order.visitCode).padStart(4, '0').split('').map(digit => `<b>${digit}</b>`).join('')}</div>
        <p>请提前告知就诊人，到院后向陪诊师出示</p>
        <button class="remote-success-copy" onclick="App.copyText('${order.visitCode}')"><i data-lucide="copy"></i>复制就诊码</button>
      </section>

      <section class="remote-success-summary-card">
        <div class="remote-success-section-heading"><h2>预约详情</h2><span>订单已生成</span></div>
        <div class="remote-success-summary-row"><span class="remote-success-row-icon"><i data-lucide="user-round"></i></span><div><small>就诊人</small><strong>${order.patientName}</strong></div></div>
        <div class="remote-success-summary-row"><span class="remote-success-row-icon"><i data-lucide="map-pin"></i></span><div><small>就诊医院</small><strong>${order.hospitalName}</strong></div></div>
        <div class="remote-success-summary-grid">
          <div class="remote-success-summary-row"><span class="remote-success-row-icon"><i data-lucide="calendar-days"></i></span><div><small>服务时间</small><strong>${formatDate(order.serviceDate)} ${order.serviceTime}</strong></div></div>
          <div class="remote-success-summary-row"><span class="remote-success-row-icon"><i data-lucide="heart-handshake"></i></span><div><small>陪诊师</small><strong>${order.companionName}</strong></div></div>
        </div>
        <div class="remote-success-summary-row"><span class="remote-success-row-icon"><i data-lucide="wallet-cards"></i></span><div><small>支付方式</small><strong>${paymentLabel} · ¥${order.totalAmount}</strong></div></div>
      </section>

      <div class="remote-success-actions"><button class="remote-success-secondary" onclick="App.goHome()">返回首页</button><button class="remote-success-primary" onclick="App.navigate('order-detail', { id: '${order.id}' })">查看订单 <i data-lucide="arrow-right"></i></button></div>
      <div class="remote-success-note"><i data-lucide="phone-call"></i><span>陪诊师将在 30 分钟内联系您，请保持电话畅通并提前准备就诊资料。</span></div>
    </div>
  `;
};

App.copyText = function(text) {
  navigator.clipboard?.writeText(text);
  App.showToast('已复制');
};

// ----- Order Detail Screen -----
Screens.orderDetail = function(id) {
  const order = Store.getOrder(id);
  if (!order) return '<div class="empty-state"><div class="empty-text">订单不存在</div></div>';

  const statusInfo = ORDER_STATUS_MAP[order.status];
  const companion = Store.getCompanion(order.companionId);

  return `
    <!-- Status Card -->
    <div class="wx-status-card" style="background: ${statusInfo.color === 'gray' ? 'linear-gradient(135deg, #888, #666)' : statusInfo.color === 'red' ? 'linear-gradient(135deg, #fa5151, #d94141)' : 'linear-gradient(135deg, #07c160, #06ad56)'};">
      <div class="status-icon">${statusInfo.icon}</div>
      <div class="status-text">${statusInfo.text}</div>
      <div class="status-desc">${getStatusDesc(order)}</div>
    </div>

    <!-- Visit Code (if waiting) -->
    ${order.status === 'waiting' ? `
      <div class="visit-code-box" onclick="App.navigate('visit-code', { id: '${order.id}' })" style="cursor: pointer;">
        <div class="code-label">🔐 就诊码（点击查看）</div>
        <div class="code-display">${order.visitCode}</div>
        <div class="code-hint">到院后向陪诊师出示</div>
      </div>
    ` : ''}

    <!-- SOP Progress -->
    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">服务进度</div>
        <div class="stage-progress">
          ${MOCK_DATA.sopStages.map((s, i) => {
            const stage = order.stages[s.id];
            return `
              <div class="stage-progress-item ${stage.status}">
                <div class="stage-dot">${stage.status === 'done' ? '✓' : i + 1}</div>
                <div class="stage-label">${s.name}</div>
                ${i < MOCK_DATA.sopStages.length - 1 ? '<div class="stage-progress-line"></div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
        <div style="margin-top: 16px; padding-top: 12px; border-top: 0.5px solid var(--wx-border);">
          <div style="font-size:13px; font-weight: 500; margin-bottom: 8px;">当前阶段：${MOCK_DATA.sopStages.find(s => s.id === order.currentStage)?.name || '已完成'}</div>
          <div style="font-size:11px; color: var(--wx-text-secondary);">${MOCK_DATA.sopStages.find(s => s.id === order.currentStage)?.desc || '服务已结束'}</div>
        </div>
      </div>
    </div>

    <!-- Companion Info -->
    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">陪诊师</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="wx-avatar lg">${companion?.avatar || '?'}</div>
          <div style="flex:1;">
            <div style="font-size:14px; font-weight: 600;">${order.companionName}</div>
            <div style="font-size:12px; color: var(--wx-text-secondary); margin-top: 2px;">${companion?.gender || ''} · ${companion?.serviceTags?.join(' · ') || ''}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Info -->
    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">服务信息</div>
        <div class="wx-select-row" style="padding: 6px 0;">
          <span class="label text-secondary">就诊人</span>
          <span class="value filled">${order.patientName}</span>
        </div>
        <div class="wx-select-row" style="padding: 6px 0;">
          <span class="label text-secondary">医院</span>
          <span class="value filled">${order.hospitalName}</span>
        </div>
        <div class="wx-select-row" style="padding: 6px 0;">
          <span class="label text-secondary">日期/时间</span>
          <span class="value filled">${formatDate(order.serviceDate)} ${order.serviceTime}</span>
        </div>
        <div class="wx-select-row" style="padding: 6px 0;">
          <span class="label text-secondary">服务时长</span>
          <span class="value filled">${order.hours}小时</span>
        </div>
        ${order.serviceNote ? `
          <div class="wx-select-row" style="padding: 6px 0; align-items: flex-start;">
            <span class="label text-secondary" style="flex-shrink: 0;">服务备注</span>
            <span class="value filled" style="text-align: right;">${order.serviceNote}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Price Info -->
    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">费用信息</div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size:13px;">
          <span class="text-secondary">小时单价</span>
          <span>¥${order.hourlyRate}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size:13px;">
          <span class="text-secondary">购买时长</span>
          <span>${order.hours}小时</span>
        </div>
        ${order.couponAmount > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size:13px;">
            <span class="text-secondary">优惠券</span>
            <span class="text-orange">-¥${order.couponAmount}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size:14px; font-weight: 600; border-top: 0.5px solid var(--wx-border); margin-top: 4px;">
          <span>实付金额</span>
          <span class="text-green">¥${order.totalAmount}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="padding: 12px 16px; display: flex; gap: 12px;">
      ${order.status === 'waiting' ? `
        <button class="wx-btn outline block" onclick="App.contactPlatform()">联系平台</button>
        <button class="wx-btn danger block" onclick="App.cancelOrderConfirm('${order.id}')">取消订单</button>
      ` : ''}
      ${order.status === 'in-service' ? `
        <button class="wx-btn secondary block" onclick="App.contactPlatform()">联系平台</button>
        <button class="wx-btn primary block" onclick="App.navigate('order-service', { id: '${order.id}' })">查看服务进度</button>
      ` : ''}
      ${order.status === 'completed' ? `
        <button class="wx-btn secondary block" onclick="App.navigate('records')">查看就医记录</button>
        <button class="wx-btn primary block" onclick="App.showToast('评价功能开发中')">评价陪诊师</button>
      ` : ''}
    </div>

    <div style="padding: 0 16px 16px;">
      <div style="font-size:11px; color: var(--wx-text-tertiary); text-align: center;">
        订单号：${order.id}<br>
        创建时间：${order.createdAt}
      </div>
    </div>
  `;
};

function getStatusDesc(order) {
  switch (order.status) {
    case 'waiting':
      return '陪诊师将在30分钟内联系您';
    case 'in-service':
      return '陪诊师正在提供陪诊服务';
    case 'completed':
      return '服务已完成，可查看就医记录';
    case 'cancelled':
      return '订单已取消';
    case 'abnormal':
      return '平台正在处理中，请保持电话畅通';
    default:
      return '';
  }
}

App.contactPlatform = function() {
  App.showToast('客服电话：400-888-8888');
};

App.cancelOrderConfirm = function(orderId) {
  App.showModal({
    title: '取消订单',
    body: '就诊日当天取消将扣除订单支付金额的20%作为违约金。取消后将自动返还已使用优惠券。确定要取消吗？',
    confirmText: '确认取消',
    cancelText: '再想想',
    onConfirm: () => {
      Store.cancelOrder(orderId);
      App.showToast('订单已取消');
    },
  });
};

// ----- Order Service Screen (In-Service) -----
Screens.orderService = function(id) {
  const order = Store.getOrder(id);
  if (!order) return '<div class="empty-state"><div class="empty-text">订单不存在</div></div>';

  return `
    <!-- Live Status -->
    <div class="wx-status-card">
      <div class="status-icon">🏃</div>
      <div class="status-text">服务进行中</div>
      <div class="status-desc">当前阶段：${MOCK_DATA.sopStages.find(s => s.id === order.currentStage)?.name || ''}</div>
    </div>

    <!-- Stage Timeline -->
    <div class="wx-card">
      <div class="wx-card-block">
        <div class="wx-card-title">SOP 履约进度</div>
        <div class="wx-timeline">
          ${MOCK_DATA.sopStages.map(s => {
            const stage = order.stages[s.id];
            return `
              <div class="wx-timeline-item ${stage.status}">
                <div class="timeline-title">${s.icon} ${s.name}</div>
                <div class="timeline-desc">${s.desc}</div>
                ${stage.time ? `<div class="timeline-time">${stage.time}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Purchased Hours & Extend -->
    <div class="wx-card">
      <div class="wx-card-block">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <div style="font-size:12px; color: var(--wx-text-secondary);">已购服务时长</div>
            <div style="font-size:20px; font-weight: 700; color: var(--wx-green);">${order.hours} 小时</div>
          </div>
          <button class="wx-btn primary" onclick="App.showExtendModal('${order.id}')">+ 续时</button>
        </div>
        <div style="font-size:11px; color: var(--wx-text-tertiary);">单价 ¥${order.hourlyRate}/小时 · 续时按整小时购买</div>
      </div>
    </div>

    <!-- Service Note -->
    ${order.serviceNote ? `
      <div class="wx-card">
        <div class="wx-card-block">
          <div class="wx-card-title">服务备注</div>
          <div style="font-size:13px; color: var(--wx-text-secondary); line-height: 1.6;">${order.serviceNote}</div>
        </div>
      </div>
    ` : ''}

    <!-- Quick Actions -->
    <div class="wx-list">
      <div class="wx-list-item" onclick="App.showToast('陪诊师电话：请联系平台转接')">
        <div style="font-size:18px; width: 24px; text-align: center;">📞</div>
        <div class="item-content"><div class="item-title">联系陪诊师</div></div>
        <span class="arrow">›</span>
      </div>
      <div class="wx-list-item" onclick="App.contactPlatform()">
        <div style="font-size:18px; width: 24px; text-align: center;">🎧</div>
        <div class="item-content"><div class="item-title">联系平台</div></div>
        <span class="arrow">›</span>
      </div>
      <div class="wx-list-item" onclick="App.showToast('暂停服务需联系平台处理')">
        <div style="font-size:18px; width: 24px; text-align: center;">⏸️</div>
        <div class="item-content"><div class="item-title">暂停服务</div></div>
        <span class="arrow">›</span>
      </div>
    </div>

    <!-- Demo Controls -->
    <div class="wx-card" style="background: #fff8e6; border: 1px dashed var(--wx-orange);">
      <div class="wx-card-block">
        <div style="font-size:12px; color: var(--wx-orange); font-weight: 600; margin-bottom: 8px;">🎬 原型演示控制</div>
        <div style="font-size:11px; color: var(--wx-text-secondary); margin-bottom: 12px;">模拟陪诊师推进到下一服务阶段</div>
        <button class="wx-btn outline block" onclick="App.simulateNextStage('${order.id}')">模拟推进到下一阶段 →</button>
      </div>
    </div>

    <div style="height: 20px;"></div>
  `;
};

App.showExtendModal = function(orderId) {
  const order = Store.getOrder(orderId);
  if (!order) return;
  const pricing = MOCK_DATA.pricing;

  App._extendHours = 1;

  const mask = document.getElementById('modalMask');
  mask.classList.add('show');
  mask.innerHTML = `
    <div class="wx-modal">
      <div class="modal-title">续时购买</div>
      <div class="modal-body">
        <div style="padding: 16px 0;">
          <div style="font-size:12px; color: var(--wx-text-secondary); margin-bottom: 12px;">当前已购 ${order.hours} 小时，增加：</div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
            <button class="wx-btn secondary" style="padding: 8px 20px; font-size:18px;" onclick="App._adjustExtend(-1)">−</button>
            <span id="extendHoursDisplay" style="font-size:20px; font-weight: 700; min-width: 30px;">1</span>
            <button class="wx-btn secondary" style="padding: 8px 20px; font-size:18px;" onclick="App._adjustExtend(1)">+</button>
          </div>
          <div style="font-size:12px; color: var(--wx-text-secondary); margin-top: 12px; text-align: center;">
            需支付：<span style="font-size:16px; font-weight: 600; color: var(--wx-green);">¥${pricing.hourlyRate}</span> (¥${pricing.hourlyRate}/小时)
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn" onclick="App.closeModal()">取消</button>
        <button class="modal-btn" onclick="App._confirmExtend('${orderId}')">确认续时</button>
      </div>
    </div>
  `;
};

App._adjustExtend = function(delta) {
  App._extendHours = Math.max(1, App._extendHours + delta);
  const display = document.getElementById('extendHoursDisplay');
  if (display) display.textContent = App._extendHours;
  // Update price
  const pricing = MOCK_DATA.pricing;
  const priceEl = display?.parentElement?.parentElement?.querySelector('span[style*="font-size:16px"]');
  if (priceEl) priceEl.textContent = `¥${pricing.hourlyRate * App._extendHours}`;
};

App._confirmExtend = function(orderId) {
  App.closeModal();
  App.showToast('续时支付中...');
  setTimeout(() => {
    Store.extendOrderHours(orderId, App._extendHours);
    App.showToast('续时成功！');
  }, 1200);
};

App.simulateNextStage = function(orderId) {
  Store.advanceOrderStage(orderId);
  const order = Store.getOrder(orderId);
  if (order) {
    const stageName = MOCK_DATA.sopStages.find(s => s.id === order.currentStage)?.name;
    App.showToast(`已推进到：${stageName}`);

    // If completed, show a modal
    if (order.status === 'completed') {
      setTimeout(() => {
        App.showModal({
          title: '服务完成',
          body: '陪诊师已提交服务总结，系统已生成只读就医记录。您可以在"就医记录"中查看完整的本次就医信息。',
          confirmText: '查看就医记录',
          cancelText: '关闭',
          onConfirm: () => App.navigate('records'),
        });
      }, 500);
    }
  }
};

// ----- Visit Code Screen -----
Screens.visitCode = function(id) {
  const order = Store.getOrder(id);
  if (!order) return '<div class="empty-state"><div class="empty-text">订单不存在</div></div>';

  return `
    <div style="padding: 40px 16px; text-align: center;">
      <div style="font-size:42px; margin-bottom: 16px;">🔐</div>
      <div style="font-size:14px; font-weight: 600; margin-bottom: 4px;">就诊码</div>
      <div style="font-size:12px; color: var(--wx-text-secondary); margin-bottom: 24px;">仅当前用户可查看，请提前告知就诊人</div>
    </div>

    <div class="visit-code-box" style="margin: 0 12px;">
      <div class="code-display">${order.visitCode}</div>
      <div class="code-hint">4位数字就诊码 · 到院后向陪诊师出示</div>
      <button class="wx-btn primary" style="margin-top: 16px;" onclick="App.copyText('${order.visitCode}')">复制就诊码</button>
    </div>

    <div class="wx-card">
      <div class="wx-card-block">
        <div style="font-size:12px; color: var(--wx-text-secondary); line-height: 1.8;">
          <div style="font-weight: 600; color: var(--wx-text-primary); margin-bottom: 8px;">就诊码使用说明</div>
          1. 支付成功后系统自动生成4位就诊码<br>
          2. 仅当前用户可在小程序中查看<br>
          3. 陪诊师、运营和售后不能在系统中查看<br>
          4. 如就诊人非当前用户，请提前告知就诊人<br>
          5. 到院后由就诊人向陪诊师出示就诊码<br>
          6. 验证通过后服务正式开始<br>
          7. 陪诊师可通过小程序联系您口述就诊码<br>
          8. 认证成功后就诊码不可重用
        </div>
      </div>
    </div>

    <div style="padding: 16px;">
      <button class="wx-btn secondary block" onclick="App.navigate('order-detail', { id: '${order.id}' })">返回订单详情</button>
    </div>
  `;
};

// ----- Medical Records Screen -----
Screens.records = function(withHeader = false) {
  const records = Store.state.medicalRecords;

  return `
    ${withHeader ? '<div class="tab-page-heading"><div><span class="section-kicker">HEALTH TIMELINE</span><h1>就医记录</h1></div><button class="icon-button" onclick="App.showToast(\'记录仅对当前账号可见\')"><i data-lucide="shield-check"></i></button></div>' : ''}
    ${records.length === 0
      ? `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">暂无就医记录</div><div style="font-size:11px; color: var(--wx-text-tertiary); margin-top: 8px;">服务完成后将自动生成</div></div>`
      : records.map(r => Screens.recordCard(r)).join('')
    }

    <div class="wx-card">
      <div class="wx-card-block">
        <div style="font-size:12px; color: var(--wx-text-secondary); line-height: 1.6;">
          <div style="font-weight: 600; color: var(--wx-text-primary); margin-bottom: 4px;">📋 就医记录说明</div>
          · 就医记录由陪诊师在服务过程中记录<br>
          · 服务结束并提交服务总结后生成只读记录<br>
          · 包含就诊概况、医生信息、复述确认、检查记录、药品核对、凭证和服务补充<br>
          · 第一期不提供用户纠错入口<br>
          · 记录长期保存，不可删除
        </div>
      </div>
    </div>
  `;
};

Screens.recordCard = function(r) {
  const sections = [
    { key: 'visitOverview', label: '就诊概况', icon: '🏥', required: true },
    { key: 'doctorInfo', label: '医生信息', icon: '👨‍⚕️', required: false },
    { key: 'repeatConfirm', label: '复述确认', icon: '✅', required: false },
    { key: 'examRecords', label: '检查记录', icon: '🔬', required: false },
    { key: 'medicationCheck', label: '药品核对', icon: '💊', required: false },
    { key: 'voucherRecords', label: '凭证记录', icon: '📄', required: false },
    { key: 'serviceSupplement', label: '服务补充', icon: '📝', required: false },
  ];

  return `
    <div class="wx-card" onclick="App.navigate('record-detail', { id: '${r.id}' })" style="cursor: pointer;">
      <div class="wx-card-block">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <div style="font-size:14px; font-weight: 600;">${r.hospitalName}</div>
            <div style="font-size:12px; color: var(--wx-text-secondary); margin-top: 2px;">${formatDate(r.date)} · 陪诊师：${r.companionName}</div>
          </div>
          <span class="wx-tag green">已完成</span>
        </div>
        <div style="font-size:12px; color: var(--wx-text-secondary); line-height: 1.6; margin-bottom: 12px;">
          ${r.sections.visitOverview.content}
        </div>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${sections.map(s => `
            <span class="wx-tag ${r.sections[s.key].filled ? 'green' : 'gray'}">${s.icon} ${s.label}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

// Record Detail (reuse records screen logic via inline)
Screens.recordDetail = function(id) {
  const record = Store.state.medicalRecords.find(r => r.id === id);
  if (!record) return '<div class="empty-state"><div class="empty-text">记录不存在</div></div>';

  const sections = [
    { key: 'visitOverview', label: '就诊概况', icon: '🏥', required: true },
    { key: 'doctorInfo', label: '医生信息', icon: '👨‍⚕️', required: false },
    { key: 'repeatConfirm', label: '复述确认', icon: '✅', required: false },
    { key: 'examRecords', label: '检查记录', icon: '🔬', required: false },
    { key: 'medicationCheck', label: '药品核对', icon: '💊', required: false },
    { key: 'voucherRecords', label: '凭证记录', icon: '📄', required: false },
    { key: 'serviceSupplement', label: '服务补充', icon: '📝', required: false },
  ];

  return `
    <div class="wx-card" style="margin-top: 16px;">
      <div class="wx-card-block">
        <div style="font-size:16px; font-weight: 600; margin-bottom: 4px;">${record.hospitalName}</div>
        <div style="font-size:12px; color: var(--wx-text-secondary);">${formatDate(record.date)} · 陪诊师：${record.companionName}</div>
      </div>
    </div>

    ${sections.map(s => {
      const section = record.sections[s.key];
      return `
        <div class="wx-card">
          <div class="wx-card-block">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-size:16px;">${s.icon}</span>
              <span style="font-size:14px; font-weight: 600;">${s.label}</span>
              ${s.required
                ? '<span class="wx-tag red">必填</span>'
                : '<span class="wx-tag gray">选填</span>'
              }
              ${section.filled
                ? '<span class="wx-tag green">已填</span>'
                : '<span class="wx-tag gray">未填</span>'
              }
            </div>
            ${section.filled
              ? `<div style="font-size:13px; color: var(--wx-text-primary); line-height: 1.6;">${section.content}</div>`
              : '<div style="font-size:12px; color: var(--wx-text-tertiary);">本项未填写</div>'
            }
          </div>
        </div>
      `;
    }).join('')}

    <div class="wx-card">
      <div class="wx-card-block">
        <div style="font-size:12px; color: var(--wx-text-secondary); line-height: 1.6;">
          📋 就医记录为只读查看，第一期不提供纠错入口。如有疑问请联系平台。
        </div>
      </div>
    </div>

    <div style="padding: 16px;">
      <button class="wx-btn secondary block" onclick="App.navigate('records')">返回记录列表</button>
    </div>
  `;
};

// ----- Referral Screen -----
Screens.referral = function() {
  const r = Store.state.referralInfo;

  return `
    <div class="remote-referral-page">
      <section class="remote-referral-hero">
        <div class="remote-referral-hero-copy">
          <p>MEMBER REWARDS</p>
          <h2>邀请好友，双方都有礼</h2>
          <span>好友完成首单，您获 ¥${r.rewardAmount} 现金奖励<br>TA 获 ¥${r.couponAmount} 首单优惠券</span>
        </div>
        <div class="remote-referral-gift"><i data-lucide="gift"></i></div>
        <div class="remote-referral-metrics"><span><strong>¥${r.rewardBalance}</strong><small>当前奖励余额</small></span><span><strong>${r.invitedCount}</strong><small>已邀请好友</small></span><span><strong>${r.completedCount}</strong><small>已完成首单</small></span></div>
      </section>

      <section class="remote-referral-card remote-referral-code-card">
        <div class="remote-referral-section-heading"><div><p>YOUR INVITE</p><h2>我的专属邀请</h2></div><i data-lucide="link-2"></i></div>
        <div class="remote-referral-code-row"><div><small>邀请码</small><strong>${r.inviteCode}</strong></div><button onclick="App.copyText('${r.inviteCode}')">复制邀请码</button></div>
        <div class="remote-referral-link-row"><small>邀请链接</small><span>${r.inviteLink}</span></div>
        <div class="remote-referral-actions"><button class="remote-referral-primary" onclick="App.copyText('${r.inviteLink}')"><i data-lucide="copy"></i>复制链接</button><button class="remote-referral-secondary" onclick="App.showToast('已生成分享卡片')"><i data-lucide="send"></i>分享给好友</button></div>
      </section>

      <section class="remote-referral-card remote-referral-history-card">
        <div class="remote-referral-section-heading"><div><p>REWARD HISTORY</p><h2>奖励记录</h2></div><span>${r.rewardHistory.length} 条</span></div>
        ${r.rewardHistory.length === 0
          ? '<div class="remote-referral-empty"><i data-lucide="receipt-text"></i><span>暂无奖励记录</span></div>'
          : `<div class="remote-referral-history-list">${r.rewardHistory.map(h => `
            <div class="remote-referral-history-row"><span class="remote-referral-history-icon"><i data-lucide="wallet-cards"></i></span><div><strong>${h.desc}</strong><small>${h.date} · ${h.status}</small></div><b>+¥${h.amount}</b></div>
          `).join('')}</div>`
        }
      </section>

      <section class="remote-referral-card remote-referral-rules-card">
        <div class="remote-referral-section-heading"><div><p>HOW IT WORKS</p><h2>活动规则</h2></div><i data-lucide="circle-help"></i></div>
        <ol class="remote-referral-rules"><li>生成专属邀请链接并分享给好友</li><li>好友通过有效链接绑定邀请关系</li><li>好友完成首单后，双方奖励自动到账</li><li>同账号自邀、重复绑定不产生权益</li></ol>
      </section>

      <button class="remote-referral-withdraw" onclick="App.showToast('提现功能开发中')"><span><i data-lucide="wallet-cards"></i><strong>提现到微信零钱</strong><small>可提现余额 ¥${r.rewardBalance}</small></span><i data-lucide="chevron-right"></i></button>
      <p class="remote-referral-note"><i data-lucide="shield-check"></i>奖励将在好友首单完成后自动发放，具体到账时间以平台审核为准。</p>
    </div>
  `;
};

// Initialize
document.addEventListener('DOMContentLoaded', () => App.init());
