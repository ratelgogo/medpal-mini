// ===== MedPal Mock Data =====
// Based on PRD: 可信的就医陪伴服务平台

const MOCK_DATA = {
  // 城市 - 固定杭州
  city: '杭州',

  // 医院 - 运营后台创建
  hospitals: [
    { id: 'h1', name: '浙江大学医学院附属第一医院', campuses: [
      { id: 'h1c1', name: '庆春院区', address: '杭州市上城区庆春路79号' },
      { id: 'h1c2', name: '之江院区', address: '杭州市西湖区之江路1367号' },
    ]},
    { id: 'h2', name: '浙江省人民医院', campuses: [
      { id: 'h2c1', name: '朝晖院区', address: '杭州市拱墅区上塘路158号' },
    ]},
    { id: 'h3', name: '浙江大学医学院附属邵逸夫医院', campuses: [
      { id: 'h3c1', name: '庆春院区', address: '杭州市江干区庆春东路3号' },
      { id: 'h3c2', name: '下沙院区', address: '杭州市江干区下沙大道1号' },
    ]},
    { id: 'h4', name: '杭州市第一人民医院', campuses: [
      { id: 'h4c1', name: '城西院区', address: '杭州市西湖区灵隐路12号' },
    ]},
    { id: 'h5', name: '浙江省中医院', campuses: [
      { id: 'h5c1', name: '湖滨院区', address: '杭州市上城区邮电路54号' },
      { id: 'h5c2', name: '丁桥院区', address: '杭州市江干区丁桥镇笕丁路1号' },
    ]},
  ],

  // 陪诊师 - 已通过实名认证和后台审核
  companions: [
    {
      id: 'c1', name: '李秀英', gender: '女', age: 35,
      avatar: '李', certified: true, serviceTags: ['专业陪诊', '老年关怀', '普通话/杭州话'],
      availableSlots: [
        { date: '2026-08-21', times: ['08:00-10:00', '10:00-12:00', '14:00-16:00'] },
        { date: '2026-08-22', times: ['08:00-10:00', '14:00-16:00', '16:00-18:00'] },
        { date: '2026-08-23', times: ['09:00-11:00', '13:00-15:00'] },
      ],
      serviceHospitals: ['h1', 'h2', 'h3', 'h5'],
      intro: '3年陪诊经验，擅长老年患者陪诊，熟悉浙一流程。'
    },
    {
      id: 'c2', name: '王建国', gender: '男', age: 42,
      avatar: '王', certified: true, serviceTags: ['专业陪诊', '重症陪诊', '急救技能'],
      availableSlots: [
        { date: '2026-08-21', times: ['08:00-10:00', '14:00-16:00'] },
        { date: '2026-08-23', times: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'] },
        { date: '2026-08-24', times: ['09:00-11:00'] },
      ],
      serviceHospitals: ['h1', 'h3', 'h4'],
      intro: '5年陪诊经验，原急救中心工作，擅长重症患者陪诊。'
    },
    {
      id: 'c3', name: '陈丽萍', gender: '女', age: 28,
      avatar: '陈', certified: true, serviceTags: ['专业陪诊', '儿科陪诊', '细心耐心'],
      availableSlots: [
        { date: '2026-08-22', times: ['08:00-10:00', '10:00-12:00', '14:00-16:00'] },
        { date: '2026-08-23', times: ['08:00-10:00', '14:00-16:00'] },
      ],
      serviceHospitals: ['h2', 'h3', 'h4', 'h5'],
      intro: '2年陪诊经验，擅长儿科和老年陪诊，服务评价高。'
    },
    {
      id: 'c4', name: '赵明', gender: '男', age: 31,
      avatar: '赵', certified: true, serviceTags: ['专业陪诊', '骨科陪诊', '轮椅协助'],
      availableSlots: [
        { date: '2026-08-21', times: ['10:00-12:00', '14:00-16:00', '16:00-18:00'] },
        { date: '2026-08-24', times: ['08:00-10:00', '10:00-12:00', '13:00-15:00'] },
      ],
      serviceHospitals: ['h1', 'h2', 'h4'],
      intro: '4年陪诊经验，擅长骨科和行动不便患者陪诊。'
    },
  ],

  // 特定精神疾病名单 - 运营后台配置
  mentalIllnessOptions: [
    '精神分裂症', '双相情感障碍', '偏执性精神障碍', '分裂情感性精神障碍',
    '严重抑郁障碍（伴精神病性特征）', '其他'
  ],

  // 价格配置
  pricing: {
    hourlyRate: 80, // 一小时单价：80元
    currency: '¥',
    minHours: 2,    // 最小购买2小时
  },

  // 邀请奖励配置
  referral: {
    couponAmount: 10,   // 被邀请人优惠券面额
    rewardAmount: 10,   // 邀请人现金奖励
  },

  // SOP 阶段定义
  sopStages: [
    { id: 'pre-contact', name: '诊前对接', icon: '📞', desc: '陪诊师30分钟内联系家属' },
    { id: 'pre-check', name: '诊前复核', icon: '📋', desc: '就诊前1-2天复核资料和计划' },
    { id: 'arrival', name: '到院迎接', icon: '🏥', desc: '陪诊师提前15-20分钟到院' },
    { id: 'verify', name: '就诊码验证', icon: '🔐', desc: '验证就诊码，服务正式开始' },
    { id: 'in-service', name: '诊中陪诊', icon: '👨‍⚕️', desc: '挂号/候诊/检查/缴费/取药全程陪同' },
    { id: 'summary', name: '服务总结', icon: '📝', desc: '陪诊师提交服务总结，生成就医记录' },
  ],

  // 就诊人预设
  patients: [
    {
      id: 'p1', name: '张阿姨', age: 68, ageConfirmDate: '2026-06-15',
      mentalHistory: 'none', mentalDetails: [],
      relationship: '母亲', gender: '女',
      hasHealthRecord: true,
    },
  ],

  // 订单预设（用于演示订单跟踪）
  orders: [
    {
      id: 'ord-2026-0820-001',
      patientId: 'p1',
      patientName: '张阿姨',
      hospitalId: 'h1', campusId: 'h1c1',
      hospitalName: '浙大附一院 - 庆春院区',
      companionId: 'c1', companionName: '李秀英',
      serviceDate: '2026-08-21', serviceTime: '08:00-10:00',
      hours: 2, hourlyRate: 80,
      couponAmount: 10, totalAmount: 150,
      status: 'waiting', // waiting | in-service | completed | cancelled | abnormal
      visitCode: '3892',
      createdAt: '2026-08-20 14:30',
      currentStage: 'pre-contact',
      stages: {
        'pre-contact': { status: 'current', time: '2026-08-20 14:30' },
        'pre-check': { status: 'pending', time: null },
        'arrival': { status: 'pending', time: null },
        'verify': { status: 'pending', time: null },
        'in-service': { status: 'pending', time: null },
        'summary': { status: 'pending', time: null },
      },
      serviceNote: '张阿姨有高血压史，需要定期复查。对碘不过敏。',
    },
  ],

  // 就医记录预设（用于演示就医记录时间线）
  medicalRecords: [
    {
      id: 'mr-001', orderId: 'ord-demo-001',
      date: '2026-08-15',
      companionName: '王建国',
      hospitalName: '浙大附一院 - 庆春院区',
      sections: {
        visitOverview: { filled: true, content: '高血压复查，心血管内科门诊。患者主诉近期头晕，血压波动在140-155/90-95mmHg。' },
        doctorInfo: { filled: true, content: '主治医师：刘主任（心血管内科）' },
        repeatConfirm: { filled: true, content: '已向家属复述医生建议：规律服药，低盐饮食，适当运动。家属确认无误。' },
        examRecords: { filled: true, content: '心电图：窦性心律，正常范围。血压测量：148/92mmHg。' },
        medicationCheck: { filled: true, content: '续配缬沙坦80mg x 2盒，每日1次，每次1片。' },
        voucherRecords: { filled: false, content: '' },
        serviceSupplement: { filled: true, content: '全程顺利，等待时间约40分钟。建议下次检查前空腹。' },
      },
    },
  ],

  // 邀请信息
  referralInfo: {
    inviteCode: 'MEDPAL8866',
    inviteLink: 'https://medpal.com/invite/MEDPAL8866',
    invitedCount: 3,
    completedCount: 1,
    rewardBalance: 10,
    rewardHistory: [
      { id: 'r1', amount: 10, desc: '邀请李*华完成首单奖励', date: '2026-08-10', status: '已到账' },
    ],
    couponAvailable: true, // 当前用户有首单优惠券
    couponAmount: 10,
  },

  // 用户信息
  userInfo: {
    name: '张明', phone: '138****8888',
    avatar: '张', isInvited: true,
    balance: 268.5,
    rewardBalance: 10,
  },
};

// 订单状态映射
const ORDER_STATUS_MAP = {
  'waiting': { text: '待服务', color: 'orange', icon: '⏳' },
  'in-service': { text: '服务中', color: 'green', icon: '🏃' },
  'completed': { text: '已完成', color: 'gray', icon: '✅' },
  'cancelled': { text: '已取消', color: 'gray', icon: '❌' },
  'abnormal': { text: '平台处理中', color: 'red', icon: '⚠️' },
};

// 服务目录
const SERVICE_CATALOG = [
  { id: 'escort', name: '专业陪诊', icon: '🏥', desc: '挂号·候诊·检查·取药全程陪同', available: true },
  { id: 'incare', name: '院内陪护', icon: '🛏️', desc: '日间照顾·术后陪护', available: false },
  { id: 'report', name: '代取报告', icon: '📄', desc: '按约领取报告并送达', available: false },
  { id: 'medicine', name: '代取药品', icon: '💊', desc: '凭处方取药并核对', available: false },
];
