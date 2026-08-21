// ===== MedPal Store - Simple State Management =====

const Store = {
  state: {
    // Navigation
    currentRoute: 'home',
    routeParams: {},
    history: [],

    // Data (clone from MOCK_DATA to allow mutations)
    patients: JSON.parse(JSON.stringify(MOCK_DATA.patients)),
    orders: JSON.parse(JSON.stringify(MOCK_DATA.orders)),
    medicalRecords: JSON.parse(JSON.stringify(MOCK_DATA.medicalRecords)),
    referralInfo: JSON.parse(JSON.stringify(MOCK_DATA.referralInfo)),
    userInfo: JSON.parse(JSON.stringify(MOCK_DATA.userInfo)),

    // Order creation flow state
    draftOrder: {
      patientId: null,
      hospitalId: null,
      campusId: null,
      companionId: null,
      serviceDate: null,
      serviceTime: null,
      hours: 2,
      serviceNote: '',
      paymentMethod: 'wechat',
      genderPreference: '',
      selectedSlot: null,
    },
  },

  listeners: [],

  subscribe(fn) {
    this.listeners.push(fn);
  },

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  },

  setState(updater) {
    if (typeof updater === 'function') {
      updater(this.state);
    } else {
      Object.assign(this.state, updater);
    }
    this.notify();
  },

  // ===== Navigation =====
  navigate(route, params = {}) {
    this.state.history.push({ route: this.state.currentRoute, params: this.state.routeParams });
    this.state.currentRoute = route;
    this.state.routeParams = params;
    this.notify();
    // Scroll to top on navigation
    setTimeout(() => {
      const content = document.querySelector('.wx-content');
      if (content) content.scrollTop = 0;
    }, 0);
  },

  goBack() {
    if (this.state.history.length > 0) {
      const prev = this.state.history.pop();
      this.state.currentRoute = prev.route;
      this.state.routeParams = prev.params;
      this.notify();
      setTimeout(() => {
        const content = document.querySelector('.wx-content');
        if (content) content.scrollTop = 0;
      }, 0);
    }
  },

  switchTab(tab) {
    this.state.history = [];
    const tabRoutes = { home: 'home', orders: 'orders', profile: 'profile' };
    this.state.currentRoute = tabRoutes[tab] || 'home';
    this.state.routeParams = {};
    this.notify();
    setTimeout(() => {
      const content = document.querySelector('.wx-content');
      if (content) content.scrollTop = 0;
    }, 0);
  },

  // ===== Patient Management =====
  addPatient(patient) {
    patient.id = 'p' + Date.now();
    patient.hasHealthRecord = true;
    this.state.patients.push(patient);
    this.notify();
    return patient;
  },

  getPatient(id) {
    return this.state.patients.find(p => p.id === id);
  },

  checkEligibility(patient) {
    // 年龄 > 80 阻止
    if (patient.age > 80) {
      return { pass: false, reason: '年龄超过80周岁，暂不支持预约专业陪诊服务。如需帮助请联系平台。' };
    }
    // 精神疾病史选择"有"且命中特定精神疾病项阻止
    if (patient.mentalHistory === 'has' && patient.mentalDetails && patient.mentalDetails.length > 0) {
      return { pass: false, reason: '根据当前服务范围，该就诊人暂不支持预约专业陪诊。如需帮助请联系平台。' };
    }
    return { pass: true };
  },

  // ===== Draft Order =====
  updateDraftOrder(updates) {
    Object.assign(this.state.draftOrder, updates);
    this.notify();
  },

  resetDraftOrder() {
    this.state.draftOrder = {
      patientId: null,
      hospitalId: null,
      campusId: null,
      companionId: null,
      serviceDate: null,
      serviceTime: null,
      hours: 2,
      serviceNote: '',
      paymentMethod: 'wechat',
      genderPreference: '',
      selectedSlot: null,
    };
    this.notify();
  },

  // ===== Order Creation =====
  createOrder() {
    const draft = this.state.draftOrder;
    const patient = this.getPatient(draft.patientId);
    const hospital = MOCK_DATA.hospitals.find(h => h.id === draft.hospitalId);
    const campus = hospital?.campuses.find(c => c.id === draft.campusId);
    const companion = MOCK_DATA.companions.find(c => c.id === draft.companionId);
    const pricing = MOCK_DATA.pricing;

    const baseAmount = pricing.hourlyRate * draft.hours;
    const couponAmount = this.state.referralInfo.couponAvailable ? this.state.referralInfo.couponAmount : 0;
    const totalAmount = Math.max(0, baseAmount - couponAmount);
    const paymentMethod = draft.paymentMethod === 'balance' ? 'balance' : 'wechat';

    const visitCode = String(Math.floor(1000 + Math.random() * 9000));

    const order = {
      id: 'ord-' + Date.now(),
      patientId: draft.patientId,
      patientName: patient.name,
      hospitalId: draft.hospitalId,
      campusId: draft.campusId,
      hospitalName: `${hospital.name} - ${campus.name}`,
      companionId: draft.companionId,
      companionName: companion.name,
      serviceDate: draft.serviceDate,
      serviceTime: draft.serviceTime,
      hours: draft.hours,
      hourlyRate: pricing.hourlyRate,
      couponAmount: couponAmount,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      status: 'waiting',
      visitCode: visitCode,
      createdAt: new Date().toLocaleString('zh-CN'),
      currentStage: 'pre-contact',
      stages: {
        'pre-contact': { status: 'current', time: new Date().toLocaleString('zh-CN') },
        'pre-check': { status: 'pending', time: null },
        'arrival': { status: 'pending', time: null },
        'verify': { status: 'pending', time: null },
        'in-service': { status: 'pending', time: null },
        'summary': { status: 'pending', time: null },
      },
      serviceNote: draft.serviceNote || '',
    };

    this.state.orders.unshift(order);

    if (paymentMethod === 'balance') {
      this.state.userInfo.balance = Math.max(0, Number(this.state.userInfo.balance || 0) - totalAmount);
    }

    // 使用首单优惠券
    if (this.state.referralInfo.couponAvailable) {
      this.state.referralInfo.couponAvailable = false;
    }

    this.resetDraftOrder();
    this.notify();
    return order;
  },

  // ===== Order Status Simulation =====
  advanceOrderStage(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return;

    const stageOrder = ['pre-contact', 'pre-check', 'arrival', 'verify', 'in-service', 'summary'];
    const currentIdx = stageOrder.indexOf(order.currentStage);

    if (currentIdx < 0 || currentIdx >= stageOrder.length - 1) return;

    // Mark current as done
    order.stages[order.currentStage].status = 'done';
    order.stages[order.currentStage].time = new Date().toLocaleString('zh-CN');

    // Move to next
    const nextStage = stageOrder[currentIdx + 1];
    order.currentStage = nextStage;
    order.stages[nextStage].status = 'current';
    order.stages[nextStage].time = new Date().toLocaleString('zh-CN');

    // Update order status
    if (nextStage === 'verify' || nextStage === 'in-service') {
      order.status = 'in-service';
    } else if (nextStage === 'summary') {
      order.status = 'completed';
      // Generate medical record
      this.generateMedicalRecord(order);
    }

    this.notify();
  },

  // ===== Extend Service Hours =====
  extendOrderHours(orderId, additionalHours) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return;

    order.hours += additionalHours;
    order.totalAmount += order.hourlyRate * additionalHours;
    this.notify();
  },

  // ===== Generate Medical Record =====
  generateMedicalRecord(order) {
    const companion = MOCK_DATA.companions.find(c => c.id === order.companionId);
    const record = {
      id: 'mr-' + Date.now(),
      orderId: order.id,
      date: order.serviceDate,
      companionName: companion?.name || '陪诊师',
      hospitalName: order.hospitalName,
      sections: {
        visitOverview: {
          filled: true,
          content: `${order.patientName}在${order.hospitalName}完成专业陪诊服务。服务时长${order.hours}小时。`
        },
        doctorInfo: { filled: true, content: '主治医师信息由陪诊师记录' },
        repeatConfirm: { filled: true, content: '陪诊师已向家属复述医生建议，家属确认无误。' },
        examRecords: { filled: true, content: '检查项目及结果已由陪诊师记录。' },
        medicationCheck: { filled: true, content: '取药信息已由陪诊师记录。' },
        voucherRecords: { filled: false, content: '' },
        serviceSupplement: { filled: true, content: '服务顺利完成。如有后续问题请联系平台。' },
      },
    };
    this.state.medicalRecords.unshift(record);
    this.notify();
  },

  // ===== Cancel Order =====
  cancelOrder(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return;
    order.status = 'cancelled';
    this.notify();
  },

  // ===== Helpers =====
  getCompanionsForHospital(hospitalId) {
    return MOCK_DATA.companions.filter(c => c.serviceHospitals.includes(hospitalId));
  },

  getCompanion(id) {
    return MOCK_DATA.companions.find(c => c.id === id);
  },

  getHospital(id) {
    return MOCK_DATA.hospitals.find(h => h.id === id);
  },

  getOrder(id) {
    return this.state.orders.find(o => o.id === id);
  },
};
