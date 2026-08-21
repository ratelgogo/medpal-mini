// ===== Remote Lovable parity layer =====
// The remote Lovable project is the source of truth for page content and flows.
// The local-only exception is the floating, enlarged active TabBar rendered by app.js.

const DEFAULT_AVATARS = {
  male: 'assets/avatar-default-male.png',
  female: 'assets/avatar-default-female.png',
};

const RemoteParity = {
  image(src = 'assets/companion-hero.png', alt = '') {
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  },

  icon(name, className = '') {
    return `<i data-lucide="${name}"${className ? ` class="${className}"` : ''}></i>`;
  },

  statusLabel(status) {
    return (ORDER_STATUS_MAP[status] || { text: status }).text;
  },

  avatarForGender(gender) {
    return gender === '男' ? DEFAULT_AVATARS.male : DEFAULT_AVATARS.female;
  },

  currentOrder() {
    return Store.state.orders.find((o) => ['waiting', 'in-service', 'abnormal'].includes(o.status))
      || Store.state.orders[0];
  },

  orderDate(order) {
    const date = order?.serviceDate ? new Date(order.serviceDate) : new Date('2026-08-22');
    return {
      month: `${date.getMonth() + 1}月`,
      day: date.getDate(),
      year: date.getFullYear(),
    };
  },

  renderHero(order) {
    const user = Store.state.userInfo;
    const patient = order?.patientName || '陈建国';
    return `
      <header class="remote-hero">
        <div class="remote-hero-top">
          <div class="remote-user">
            <span class="remote-user-avatar">${this.image(DEFAULT_AVATARS.female, '默认女性头像')}</span>
            <div>
              <p>早上好，${user.name === '张明' ? '陈小雨' : user.name}</p>
              <strong>今天为父亲 ${patient} 安排陪诊</strong>
            </div>
          </div>
          <button class="remote-icon-button" aria-label="消息通知" onclick="App.navigate('messages')">
            ${this.icon('bell')}
            <span class="remote-notice-dot"></span>
          </button>
        </div>
        <div class="remote-hero-copy">
          <p class="remote-overline">MEDPAL · TRUSTED CARE</p>
          <h1>可信的就医陪伴</h1>
          <p>异地也能安心。杭州三甲医院全程陪诊，实时同步就诊进展与医嘱。</p>
          <div class="remote-pills">
            <span>实名陪诊师</span><span>全程可追溯</span>
          </div>
        </div>
      </header>
    `;
  },

  renderUpcoming(order) {
    if (!order) {
      return `<section class="remote-card remote-empty-card"><div><strong>还没有待就诊安排</strong><p>选择一位陪诊师，为家人提前安排安心</p></div><button class="remote-primary-mini" onclick="App.navigate('services')">找陪诊师</button></section>`;
    }
    const date = order.serviceDate ? new Date(`${order.serviceDate}T00:00:00`) : new Date();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const dateLabel = `${date.getMonth() + 1}月${date.getDate()}日 周${weekdays[date.getDay()]}`;
    const hospital = MOCK_DATA.hospitals.find((item) => item.id === order.hospitalId);
    const hospitalName = hospital?.name || order.hospitalName.split(' - ')[0];
    const campusName = order.hospitalName.split(' - ')[1] || hospital?.campuses?.[0]?.name || '';
    const startTime = String(order.serviceTime || '').split('-')[0];
    const companion = Store.getCompanion(order.companionId);
    const companionName = companion?.name || order.companionName;
    return `
      <section class="remote-card remote-appointment-card" onclick="App.navigate('order-detail', { id: '${order.id}' })">
        <div class="remote-appointment-info">
          <div class="remote-appointment-copy">
            <h3>${hospitalName}</h3>
            <p class="remote-appointment-location">${this.icon('map-pin')}<span>${campusName} · 就诊人 ${order.patientName}</span></p>
            <p class="remote-appointment-time">${this.icon('clock-3')}<strong>${dateLabel} ${startTime} 起 ${order.hours} 小时</strong></p>
          </div>
          <div class="remote-appointment-companion">
            <span class="remote-appointment-avatar">${this.image(this.avatarForGender(companion?.gender), `${companionName}默认头像`)}</span>
            <strong>${companionName}</strong>
          </div>
        </div>
      </section>
    `;
  },

  renderServices() {
    const icons = ['stethoscope', 'bed-double', 'file-text', 'pill'];
    return `
      <section class="remote-section">
        <div class="remote-section-heading"><div><p>CARE SERVICES</p><h2>服务目录</h2></div><span class="remote-city">${this.icon('map-pin')} 杭州</span></div>
        <div class="remote-service-list">
          ${SERVICE_CATALOG.map((service, index) => `
            <button class="remote-service-row ${service.available ? '' : 'disabled'}" onclick="${service.available ? "App.navigate('services')" : "App.showToast('敬请期待，即将开放')"}">
              <span class="remote-service-icon remote-service-icon-${index + 1}">${this.icon(icons[index])}</span>
              <span class="remote-service-copy"><strong>${service.name}</strong><small>${service.desc}</small></span>
              <span class="remote-service-state ${service.available ? 'available' : ''}">${service.available ? '可预约' : '敬请期待'}</span>
              ${this.icon('chevron-right', 'remote-row-arrow')}
            </button>
          `).join('')}
        </div>
      </section>
    `;
  },

  renderCompanions() {
    const people = MOCK_DATA.companions.slice(0, 3);
    const remoteMeta = [
      { years: 5, orders: 1268, rating: '4.9', price: 68 },
      { years: 3, orders: 742, rating: '4.8', price: 62 },
      { years: 8, orders: 2103, rating: '5.0', price: 88 },
    ];
    return `
      <section class="remote-section">
    <div class="remote-section-heading remote-companion-section-heading"><div><h2>推荐陪诊师</h2></div><button class="remote-text-link" onclick="App.navigate('companion-list')">查看全部 ${this.icon('chevron-right')}</button></div>
        <div class="remote-companion-rail">
          ${people.map((person, index) => {
            const meta = remoteMeta[index] || remoteMeta[0];
            return `
              <article class="remote-companion-card ${index === 0 ? 'featured' : ''}" onclick="if (!event.target.closest('.remote-companion-cta')) App.navigate('companion-detail', { id: '${person.id}' })">
                <div class="remote-companion-card-head">
                  <span class="remote-companion-avatar">${this.image(this.avatarForGender(person.gender), `${person.name}默认头像`)}</span>
              <span class="remote-companion-card-main">
                <span class="remote-companion-name-row"><strong>${person.name}</strong><span class="remote-companion-rating">${this.icon('star', 'rating-star')} ${meta.rating}</span></span>
                <small>从业 ${meta.years} 年 · 已服务 ${meta.orders} 单</small>
              </span>
                </div>
                <p class="remote-companion-intro">${person.intro}</p>
                <div class="remote-companion-card-footer"><span class="remote-companion-price">¥${meta.price}<small>/小时</small></span><button type="button" class="remote-companion-cta" onclick="event.stopPropagation(); App.startNewOrder()">立即预约</button></div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;
  },

  home() {
    const order = this.currentOrder();
    return `
      <div class="remote-scroll remote-home">
        ${this.renderHero(order)}
        <main class="remote-home-content">
          <section class="remote-section remote-upcoming-section">
            <div class="remote-section-heading"><div><p>UP NEXT</p><h2>下一次预约</h2></div><button class="remote-text-link" onclick="App.switchTab('orders')">全部订单 ${this.icon('chevron-right')}</button></div>
            ${this.renderUpcoming(order)}
          </section>
          ${this.renderServices()}
          ${this.renderCompanions()}
          <section class="remote-invite-card"><span>${this.icon('gift')}</span><div><strong>邀请有礼</strong><p>好友首单完成，双方各得 20 元陪诊券</p></div><button onclick="App.navigate('referral')">去邀请</button></section>
          <div class="remote-bottom-space"></div>
        </main>
      </div>
    `;
  },

  topBar(title, subtitle) {
    return `<header class="remote-page-header"><h1>${title}</h1><p>${subtitle}</p></header>`;
  },

  orders() {
    const current = Store.state.orders.map((o) => ({
      id: o.id, hospital: o.hospitalName.split(' - ')[0], campus: o.hospitalName.split(' - ')[1] || '', date: `${o.serviceDate} ${o.serviceTime}`, status: this.statusLabel(o.status), patient: o.patientName, escort: o.companionName, amount: o.totalAmount, hours: o.hours, live: true,
    }));
    const history = [
      { id: 'MP20260812093', hospital: '浙江省人民医院', campus: '朝晖院区', date: '2026-08-12 09:30', status: '已完成', patient: '陈建国', escort: '吴慧敏', amount: 264, hours: 3, live: false },
      { id: 'MP20260726081', hospital: '杭州市第一人民医院', campus: '城站院区', date: '2026-07-26 08:30', status: '已完成', patient: '王秀兰', escort: '李静', amount: 204, hours: 3, live: false },
      { id: 'MP20260619074', hospital: '浙江大学医学院附属第二医院', campus: '滨江院区', date: '2026-06-19 13:30', status: '已取消', patient: '陈建国', escort: '周浩', amount: 0, hours: 2, live: false },
    ];
    const all = [...current, ...history];
    return `
      <div class="remote-scroll remote-list-page">
        ${this.topBar('我的订单', '陪诊订单全流程可追溯')}
        <main class="remote-page-content">
          <div class="remote-filter-row"><button class="active">全部</button><button>待服务</button><button>已完成</button></div>
          <div class="remote-order-list">
            ${all.map((order) => `
              <button class="remote-order-card" onclick="${order.live ? `App.navigate('order-detail', { id: '${order.id}' })` : "App.showToast('历史订单归档中，如需凭证请联系平台客服')"}">
                <div class="remote-order-top"><span>${this.icon('stethoscope')} 专业陪诊</span><em class="${order.status === '已完成' || order.status === '已取消' ? 'muted' : ''}">${order.status}</em></div>
                <h3>${order.hospital} · ${order.campus}</h3>
                <p>${order.date} · ${order.hours} 小时 · 就诊人 ${order.patient} · 陪诊师 ${order.escort}</p>
                <div class="remote-order-bottom"><strong>¥${order.amount}</strong><span>查看详情 ${this.icon('chevron-right')}</span></div>
              </button>
            `).join('')}
          </div>
        </main>
      </div>
    `;
  },

  records(showHeader = false) {
    const records = [
      { date: '2026-08-12', hospital: '浙江省人民医院 · 心内科', doctor: '赵医生', summary: '复查心超，心功能稳定，继续原方案服药。', items: ['心脏超声', '心电图', '血压监测'], escort: '吴慧敏', report: true },
      { date: '2026-07-26', hospital: '杭州市第一人民医院 · 内分泌科', doctor: '孙医生', summary: '糖化血红蛋白 6.8%，饮食建议已由陪诊师记录并转达家属。', items: ['糖化血红蛋白', '空腹血糖'], escort: '李静', report: true },
      { date: '2026-06-05', hospital: '浙江大学医学院附属第一医院 · 全科', doctor: '钱医生', summary: '年度体检随访，建议三个月后复查血脂。', items: ['血常规', '血脂四项'], escort: '李静', report: false },
    ];
    return `
      <div class="remote-scroll remote-list-page">
        ${showHeader ? this.topBar('健康档案', '每次陪诊结束后自动生成，家属同步可见') : ''}
        <main class="remote-page-content">
          <section class="remote-patient-summary"><span class="remote-user-avatar">${this.image(DEFAULT_AVATARS.male, '陈建国默认头像')}</span><div><strong>陈建国 · 父亲</strong><p>近 12 个月就诊 ${records.length} 次 · 常去 心内科</p></div><button onclick="App.showToast('已导出就医记录 PDF（模拟）')">导出</button></section>
          <div class="remote-record-heading"><p>HEALTH TIMELINE</p><h2>健康档案时间线</h2></div>
          <div class="remote-timeline">
            ${records.map((record, index) => `
              <article class="remote-record-row"><div class="remote-timeline-dot"><span></span>${index < records.length - 1 ? '<i></i>' : ''}</div><div class="remote-record-card"><div class="remote-record-top"><h3>${record.hospital}</h3><time>${record.date}</time></div><p class="remote-record-meta">${record.doctor} · 陪诊师 ${record.escort}</p><p class="remote-record-summary">${record.summary}</p><div class="remote-record-tags">${record.items.map((item) => `<span>${item}</span>`).join('')}</div><button onclick="App.showToast('${record.report ? '报告已打开（模拟预览）' : '本次就诊无检查报告'}')">${this.icon('file-text')} ${record.report ? '查看检查报告' : '无报告'} ${this.icon('chevron-right')}</button></div></article>
            `).join('')}
          </div>
        </main>
      </div>
    `;
  },

  profile() {
    const patients = Store.state.patients;
    return `
      <div class="remote-scroll remote-list-page">
        <main class="remote-page-content remote-profile-content">
          <section class="remote-profile-card"><div class="remote-profile-head"><span class="remote-profile-icon">${this.image(DEFAULT_AVATARS.female, '默认女性头像')}</span><div><strong>陈小雨</strong><p>深圳 · 为杭州家人预约陪诊</p></div><em>已实名</em></div><div class="remote-profile-stats"><span><strong>¥268.5</strong><small>账户余额</small></span><span><strong>3</strong><small>优惠券</small></span><span><strong>¥60</strong><small>邀请奖励</small></span></div></section>
          <section class="remote-profile-section"><div class="remote-section-heading"><h2>就诊人管理</h2><button onclick="App.showToast('新增就诊人需完成实名认证（模拟）')">添加</button></div><div class="remote-patient-list">${patients.map((p) => `<div class="remote-patient-row"><span class="remote-small-avatar">${this.image(this.avatarForGender(p.gender), `${p.name}默认头像`)}</span><div><strong>${p.name} · ${p.relationship || p.relation}</strong><p>${p.gender} ${p.age}岁 · ${p.idMasked || '身份信息已保护'}</p></div>${p.age > 80 ? '<em>需人工评估</em>' : ''}</div>`).join('')}</div></section>
          <section class="remote-menu-card">
            <button onclick="App.navigate('records')">${this.icon('file-heart')}<strong>健康档案</strong><span>3 条记录</span>${this.icon('chevron-right')}</button>
            ${[
            ['wallet-cards', '余额与充值', '¥268.5'], ['ticket', '我的优惠券', '3 张'], ['gift', '邀请有礼', '已获 ¥60'], ['shield-check', '服务保障与保险', '已生效'], ['bell', '消息提醒', '3 条未读', 'messages'],
            ].map((item) => `<button onclick="${item[3] ? `App.navigate('${item[3]}')` : `App.showToast('${item[1]}（原型演示）')`}">${this.icon(item[0])}<strong>${item[1]}</strong><span>${item[2]}</span>${this.icon('chevron-right')}</button>`).join('')}
          </section>
          <button class="remote-settings-button" onclick="App.showToast('设置功能开发中')">${this.icon('settings')}<strong>设置</strong>${this.icon('chevron-right')}</button>
          <div class="remote-bottom-space"></div>
        </main>
      </div>
    `;
  },

  messages() {
    const items = [
      { kind: '订单进展', icon: 'calendar-check-2', tone: 'teal', title: '陪诊预约已确认', body: '李秀英已确认 8 月 21 日 08:00 的陪诊服务。', time: '今天 14:30', unread: true, route: 'order-detail', id: 'ord-2026-0820-001' },
      { kind: '服务提醒', icon: 'bell-ring', tone: 'amber', title: '就诊前温馨提醒', body: '请提前准备就诊人身份证和既往检查资料。', time: '昨天 18:20', unread: true },
      { kind: '健康档案', icon: 'file-heart', tone: 'purple', title: '就医记录已生成', body: '张阿姨本次陪诊记录已整理完成，可前往健康档案查看。', time: '8 月 15 日', unread: false, route: 'records' },
      { kind: '平台通知', icon: 'gift', tone: 'green', title: '邀请奖励已到账', body: '好友李*华完成首单，¥10 邀请奖励已存入账户。', time: '8 月 10 日', unread: false, route: 'referral' },
    ];
    return `
      <div class="remote-message-page">
        <section class="remote-message-overview">
          <div><p>INBOX</p><h2>消息列表</h2><span>服务动态会在这里及时同步</span></div>
          <button onclick="App.showToast('已全部标记为已读')">全部已读</button>
        </section>
        <div class="remote-message-list">
          ${items.map((item) => {
            const action = item.route === 'order-detail'
              ? `App.navigate('order-detail', { id: '${item.id}' })`
              : item.route ? `App.navigate('${item.route}')` : `App.showToast('${item.title}已标记为已读')`;
            return `<button class="remote-message-item ${item.unread ? 'unread' : ''} ${item.route ? 'has-action' : ''}" onclick="${action}">
              <span class="remote-message-icon ${item.tone}">${this.icon(item.icon)}${item.unread ? '<i class="remote-message-dot"></i>' : ''}</span>
              <span class="remote-message-copy"><small>${item.kind}</small><strong>${item.title}</strong><p>${item.body}</p></span>
              <time>${item.time}</time>${item.route ? this.icon('chevron-right') : ''}
            </button>`;
          }).join('')}
        </div>
        <div class="remote-message-note">更多服务通知将在订单状态变化时自动推送</div>
      </div>
    `;
  },

  services() {
    const steps = [
      ['phone-call', '诊前对接', '陪诊师 30 分钟内联系家属'],
      ['clipboard-check', '诊前复核', '就诊前 1–2 天复核资料和计划'],
      ['map-pin', '到院迎接', '陪诊师提前 15–20 分钟到院'],
      ['scan-line', '就诊码验证', '验证就诊码，服务正式开始'],
      ['stethoscope', '诊中陪诊', '挂号、候诊、检查、缴费、取药全程陪同'],
      ['file-check-2', '服务总结', '服务结束后生成就医记录'],
    ];
    return `
      <div class="remote-detail-content">
        <section class="remote-service-hero"><span class="remote-service-hero-icon">${this.icon('stethoscope')}</span><div><h2>专业陪诊服务</h2><p>挂号 · 候诊 · 检查 · 取药全程陪同</p></div><em>可预约</em></section>
        <section class="remote-service-note"><strong>${this.icon('shield-check')} 杭州 · 按小时计费 · 最低 1 小时</strong><p>实名陪诊师全程陪同，支付成功后时段立即锁定。</p></section>
        <section class="remote-flow-card"><h2>服务流程</h2><div class="remote-flow-list">${steps.map((step, i) => `<div class="remote-flow-step"><span>${this.icon(step[0])}</span><div><strong>${i + 1}. ${step[1]}</strong><p>${step[2]}</p></div></div>`).join('')}</div></section>
        <button class="remote-full-action" onclick="App.startNewOrder()">立即预约 ${this.icon('arrow-right')}</button>
      </div>
    `;
  },

  orderDetail(id) {
    const order = Store.getOrder(id);
    if (!order) return '<div class="empty-state"><div class="empty-text">订单不存在</div></div>';
    const status = this.statusLabel(order.status);
    const stages = ['已支付', '陪诊师已确认', '院内会面', '服务中', '服务完成'];
    const stageIndex = order.status === 'completed' ? 4 : order.status === 'in-service' ? 3 : 1;
    const companion = Store.getCompanion(order.companionId);
    return `
      <div class="remote-detail-content">
        <section class="remote-order-detail-hero">
          <div class="remote-detail-status"><span>${status}</span><small>时段已锁定</small></div>
          <h2>${order.hospitalName.split(' - ')[0]}</h2>
          <p>${this.icon('map-pin')} ${order.hospitalName.split(' - ')[1] || '杭州院区'}</p>
          <div class="remote-detail-meta"><span>${this.icon('clock-3')} ${formatDate(order.serviceDate)} ${order.serviceTime}</span><span>${this.icon('timer')} ${order.hours} 小时</span></div>
          <div class="remote-code-panel"><small>院内会面就诊码（向陪诊师出示）</small><div>${String(order.visitCode || '3892').split('').map((n) => `<b>${n}</b>`).join('')}</div></div>
        </section>
        <section class="remote-flow-card"><h2>服务进度</h2><div class="remote-detail-stages">${stages.map((stage, i) => `<div class="remote-detail-stage ${i <= stageIndex ? 'done' : ''} ${i === stageIndex ? 'current' : ''}"><span>${i <= stageIndex ? this.icon('check') : i + 1}</span><div><strong>${stage}${i === stageIndex ? ' · 进行中' : ''}</strong><p>${['时段已锁定', '服务前一天再次确认', '凭 4 位就诊码核对', '全程陪同就诊', '生成就医记录'][i]}</p></div></div>`).join('')}</div>${stageIndex < 4 ? '<button class="remote-secondary-action" onclick="App.simulateNextStage(\'' + order.id + '\')">模拟推进到下一阶段</button>' : ''}</section>
        <section class="remote-companion-detail"><span class="remote-companion-avatar">${this.image(this.avatarForGender(companion?.gender), order.companionName)}</span><div><strong>陪诊师 ${order.companionName} · 就诊人 ${order.patientName}</strong><p>已认证 · 专业陪诊 · 全程可追溯</p></div><button onclick="App.showToast('已通过平台号码呼叫陪诊师')">${this.icon('phone-call')}</button></section>
        <section class="remote-info-card"><div><span>订单号</span><strong>${order.id}</strong></div><div><span>实付金额</span><strong class="teal">¥${order.totalAmount}</strong></div><div><span>支付方式</span><strong>${order.paymentMethod === 'balance' ? '余额支付' : '微信支付'}（模拟）</strong></div></section>
        <div class="remote-detail-actions"><button onclick="App.contactPlatform()">${this.icon('headphones')} 联系平台</button><button class="warning" onclick="App.showToast('安全事件已上报，平台处理中')">${this.icon('shield-alert')} 上报安全事件</button></div>
      </div>
    `;
  },
};

Screens.home = () => RemoteParity.home();
Screens.orders = () => RemoteParity.orders();
Screens.records = () => RemoteParity.records(false);
Screens.profile = () => RemoteParity.profile();
Screens.messages = () => RemoteParity.messages();
Screens.services = () => RemoteParity.services();
Screens.orderDetail = (id) => RemoteParity.orderDetail(id);
