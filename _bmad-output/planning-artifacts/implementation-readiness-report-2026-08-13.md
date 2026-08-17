# Implementation Readiness Assessment Report

**Date:** 2026-08-13  
**Project:** 可信的就医陪伴服务平台

## Document Inventory

- **PRD:** `_bmad-output/planning-artifacts/prds/prd-medpal-2026-08-11/prd.md`
- **PRD addendum:** `_bmad-output/planning-artifacts/prds/prd-medpal-2026-08-11/addendum.md`
- **Supporting review/reconciliation files:** present in the PRD workspace; treated as historical/supporting inputs, not competing source documents.
- **Architecture:** not found.
- **UX design:** not found.
- **Epics/Stories:** not found.

## PRD Analysis

### Functional Requirements

- **FR-001 就诊人与健康档案管理：** 账户主体可以是患者本人、家属或其他代办人；当前用户可以添加/选择与账号分离的就诊人并关联健康档案容器。患者本人即使注册账号，也必须另行新建或选择就诊人档案后才能下单。诊前就诊概况先作为订单草稿，服务结束并提交服务总结后，用户侧以按订单排列的时间线展示只读本次就医记录；一期不要求长期基础档案、不开放其他家庭成员共享、不提供纠错入口。订单生成后陪诊师只能查看本单履约必要字段，默认不能查看历史记录；当前用户在本单明确授权后可只读查看指定历史记录；陪诊师服务中可追加本次记录，运营和售后仅最小必要查看且不写入。`[TODO-005]` 仅保留患者身份核验、账户与就诊人关联变更及必填字段。
- **FR-002 服务选择：** 一期家属只能选择“专业陪诊”服务，并填写杭州、后台医院、院区、陪诊师已发布的可约日期和时间、购买服务时长、服务备注、性别和偏好；平台全天开放，不设上线/下线时间和停止条件。用户端同时展示院内陪护、代取报告和代取药品入口，但入口必须显示“敬请期待”，不可进入下单、支付或预约流程。医院和院区只能从运营后台创建的列表中选择，不支持用户自由录入医院；科室等后续字段保留在服务准备/就诊记录中。一期不提供陪诊师等级选择。一小时单价、购买小时数、优惠券抵扣和应付金额均需在下单页展示。验收：支付前可以查看完整订单摘要，基础服务金额等于“一小时单价 × 购买服务小时数”，优惠券直接抵扣且应付金额不低于 0 元。
- **FR-003 支付建单：** 用户选择已发布对应可约日期/时间的陪诊师并完成支付后，系统生成可追踪订单、自动生成 4 位就诊码并直接进入待服务；仅当前用户可以在用户侧查看，任何其他角色或后台人员都不能查看或手动生成就诊码。支付失败、支付成功未建单、重复支付、退款失败和优惠券返还失败统一进入平台人工处理，不以自动补偿或自动重试作为最终结果。`[TODO-020 CLOSED-POLICY]` 仅保留异常识别和人工处理入口的实现任务。
- **FR-004 客户选择陪诊师：** 支付前小程序仅展示已实名认证、已通过运营后台审核、纳入杭州服务范围、已发布并匹配所选医院/院区/服务日期和可约时间、该日期无已知服务冲突且未超出运营配置容量的陪诊师。卡片展示称呼/头像、性别、认证状态和已配置服务标签，不展示手机号、身份证、健康信息等敏感信息；列表按运营配置顺序展示，不做复杂推荐或综合评分排序。客户可在支付前改选，支付后锁定所选陪诊师；无可选陪诊师时不能继续支付并提示联系平台。支付成功后订单直接进入待服务，不需要陪诊师接单或确认。
- **FR-005 可约时间与订单进入履约流程：** 陪诊师发布可约日期和时间后，系统按实名认证、后台审核、杭州服务范围、医院/院区/日期匹配和运营容量向客户展示候选人。客户选择并支付后订单直接进入待服务，陪诊师不需要接单或确认；支付成功后对应可约日期/时间被订单锁定，陪诊师不得修改、撤下或转让该时段，同一时段不得被其他订单占用；订单进入已取消后原时段释放并可被其他用户重新选择，订单仍有效或处于取消处理中时继续锁定；陪诊师无法履约时，运营联系客户取消原订单，如仍需服务则在取消完成后重新创建新订单，不在原订单上改期；不自动换人、不自动派单、不自动降佣。可约时间发布、客户选择、订单生成、时段锁定、时段释放、无法履约和取消均需记录时间、对象和订单状态。`[TODO-007]` 明确敏感操作权限、复核和理由记录。
- **FR-006 状态通知与小程序状态展示：** 当前用户、陪诊师和运营按通知对象接收订单提醒；通知失败不影响订单主状态、SOP 阶段、财务动作或已执行动作。订单详情页的当前状态、阶段进度和操作结果是唯一真实来源。第一期小程序通知优先使用微信小程序原生基础组件和现有系统能力呈现订单列表状态、详情状态卡、阶段进度、消息角标、页面提示和操作按钮；关键通知失败时平台人工跟进，具体通知对象、失败记录和组件映射保留 `[TODO-023]`。
- **FR-007 到院认证：** 支付成功后系统自动生成 4 位就诊码，仅当前用户可以在用户侧查看；当前用户在线下见面时，或就诊人在被提前告知后，向陪诊师提供就诊码；当前用户不在现场时，陪诊师可以通过小程序联系下单用户，由下单用户在通话中告知就诊码。陪诊师录入并验证通过后，订单进入服务中，记录服务开始时间并开放服务中任务。验收：陪诊师、运营和售后不能在系统中提前查看；未完成到院认证处理不能进入服务中；就诊码输入错误最多 3 次，第 3 次失败后立即锁定输入；陪诊师联系平台后进入人工处理中；运营人工处理仅允许将当前主状态为“待服务”的订单改为服务中，接口使用订单号幂等，重复调用不重复执行；效果与正常就诊码验证通过一致；该低概率分支不新增独立的最终认证状态、核验依据、理由、证据附件或专项审计留痕；人工处理失败则保持待服务并由平台继续跟进；订单进入服务中、取消/完成或售后冻结后就诊码不可再次使用；任何人不能手动生成新的就诊码。
- **FR-008 过程记录：** 服务中陪诊师可以上传定位和照片作为过程记录；当前下单用户、陪诊师、运营和售后人员都可以在线查看定位和照片记录，不做脱敏展示但不能下载。四类角色也可以在线查看订单备注和售后记录，不做脱敏展示但不能下载。健康档案记录不因过程记录权限自动扩大：订单生成后陪诊师只能查看本单履约必要字段，默认不能查看历史记录；当前用户在本单明确授权后，陪诊师只读查看指定历史记录，服务中追加本次记录，订单完成/取消/安全事件交接后不能继续写入；运营和售后只在最小必要范围内查看且不能写入。`[TODO-025]` 仅保留收集目的、同意、留存和合规边界。本轮不新增查看行为审计功能。
- **FR-009 结束服务：** 正常情况下陪诊师可以点击结束服务，订单进入已完成，服务总结提交后系统生成本次就医记录供当前用户只读查看，家属不需要二次确认；用户提前结束时，必须由陪诊师端确认后订单才进入已完成并生成就诊记录。第一期不提供用户纠错入口。验收：正常结束不等待家属确认；提前结束请求在陪诊师确认前不能完成；基础服务金额按支付时锁定的一小时单价和购买服务小时数计算，不因实际时长变化自动加钟。一般争议联系平台介入处理。
- **FR-010 评价：** 订单完成后家属可以评价陪诊师。`[TODO-026]` 明确评价入口时限、内容审核、申诉和评价对后续可约展示的影响。
- **FR-011 售后创建：** 家属可以针对订单发起售后问题，后台可以查看订单、服务记录和处理历史。`[TODO-018]` 补充真实售后 session。
- **FR-012 人工处理：** 后台可以按异常事实组合执行退款、发优惠券、扣陪诊师款项和发送文字安抚信息。支付、退款、优惠券返还等异常统一由平台人工核对和处理；用户或陪诊师在就诊日前一天晚上 24:00 前取消不执行 20% 扣款，在就诊日取消按订单支付金额的 20% 执行扣款；用户侧从应退金额中扣除，陪诊师侧从押金中扣除，押金不足部分形成待扣款并在后续收入中继续抵扣。正常取消路径仍自动返还本单已使用优惠券，如需额外补偿则由平台人工发放补偿优惠券。退款、返券、押金扣款和补偿发券为独立财务动作，按“订单号 + 动作类型”幂等；重复提交不重复执行；退款不得超过实际支付金额，押金扣款不得重复计入待扣款；部分成功保留已成功动作，失败部分进入“待人工对账”，不自动回滚。验收：每项财务动作记录操作者、时间、金额、动作结果和第三方返回信息；人工异常处理不依赖自动补偿作为最终结果。
- **FR-013 平台无法履约取消：** 所选陪诊师无法履约或平台无法继续履约时，由平台人工联系客户处理；如最终取消，退还用户实际支付金额并自动返还本单已使用优惠券；该平台取消不执行用户或陪诊师主动取消的 20% 扣款；如需额外补偿，由平台人工发放补偿优惠券。优惠券返还不替代退款。
- **FR-014 订单生成后陪诊师无法履约：** 订单进入待服务后陪诊师无法履约时，平台联系客户取消原订单，不自动寻找替代者；取消时退还用户实际支付金额、自动返还本单已使用优惠券；如仍需服务，必须在原订单取消完成后重新创建新订单，不在原订单上改期；如需额外补偿，由平台人工发放补偿优惠券。退款或优惠券返还失败时转平台人工处理。`[TODO-027 CLOSED-POLICY]` 仅保留人工处理页面和失败后的账务核对记录实现任务。
- **FR-015 用户与陪诊师取消扣款：** 用户或陪诊师在就诊日前一天晚上 24:00 前取消不执行 20% 扣款；在就诊日取消按订单支付金额的 20% 执行。用户侧从应退金额中扣除，陪诊师侧从押金中扣除；押金不足部分形成待扣款，在后续收入中继续抵扣。平台因陪诊师无法履约而取消时不执行该扣款。`[TODO-028 CLOSED-POLICY]` 仅保留待扣款展示、后续收入抵扣和财务对账实现。
- **FR-016 订单审计：** 可约时间发布、客户选择、订单生成、时段锁定、时段释放、通知、到院验证、服务记录、健康档案新增记录、退款、发券、佣金调整、扣款和售后处理都应可追溯。状态变更校验当前状态，过期操作不得覆盖最新状态；重复提交按订单号幂等并返回当前结果；“服务中”仅允许从“待服务”进入，终态不可回退；安全事件与完成/取消并发时安全事件优先；状态冲突提示“订单状态已变化”并转平台人工处理。退款、返券、押金扣款和补偿发券作为独立财务动作，按“订单号 + 动作类型”幂等，记录动作状态、金额、操作者、时间和第三方返回信息；重复提交不重复执行，部分成功保留已成功动作并将失败部分转“待人工对账”，不自动回滚。人工处理进入服务中仅沿用普通订单状态变更记录，不新增核验依据、理由、证据附件或专项审计；健康档案新增记录只保留必要的订单、记录人和时间元数据，不新增查看行为审计。`[TODO-029]` 仅保留通用订单日志字段、查看权限、留存和防篡改要求。
- **FR-017 敏感操作控制：** 退款、扣款、降佣和大额发券等操作应按风险分级授权。`[TODO-007]` 明确是否需要双人复核、撤销和超时升级。
- **FR-018 远程就诊码协助：** 当前用户不在现场时，陪诊师可以通过小程序联系下单用户；下单用户在通话中向陪诊师口述就诊码，陪诊师再输入验证。验收：通话协助不向陪诊师端、运营端或售后端展示就诊码明文；联系失败时不得绕过认证，直接联系平台介入处理 `[TODO-038 CLOSED-POLICY]`。
- **FR-019 数据在线查看与健康档案写入：** 当前下单用户、陪诊师、运营和售后人员可以在线查看本单就诊人信息、定位、照片、订单备注、售后记录及本单附件，不做脱敏展示；第一期四类角色均可在线查看本单附件，后续再收缩权限；任何角色都不能下载、转发或删除这些记录，记录长期持续保存。本轮不新增“谁查看过记录”的访问审计功能。健康档案第一期只沉淀订单级本次就医记录：诊前就诊概况先保存为订单草稿，服务结束并提交服务总结后向当前用户生成只读记录，不启用长期基础档案自动生成，也不提供用户纠错入口。订单生成后陪诊师仅能查看本单履约所需字段，默认不能查看历史就医记录；当前用户在本单明确授权后，陪诊师可只读查看指定历史记录；服务中追加本次记录，订单完成、取消或安全事件交接后不能继续写入，不能修改、删除、下载或转发。运营和售后仅按订单、安全事件或售后 case 的最小必要范围查看本单信息和附件，不能写入健康档案；其他家庭成员一期不开放共享。
- **FR-020 服务时长计费：** 一期仅配置专业陪诊一小时单价，用户只支持按整小时购买服务时长，1 小时为最小购买单位，不支持半小时或其他非整小时购买。基础服务金额公式为 `一小时单价 × 购买服务小时数`；优惠券直接从基础服务金额中抵扣，应付金额最低为 0 元。订单支付成功后锁定小时单价、购买小时数、优惠券抵扣额和应付金额。实际服务不足购买时长时仍按购买时长计费；实际服务超出购买时长时不自动加钟，统一联系平台介入处理。验收：下单页和支付单展示同一价格快照，优惠券抵扣后不出现负支付金额；后台改价不影响已支付订单。
- **FR-021 用户提前结束：** 用户可以在服务中发起提前结束请求；陪诊师端必须确认，确认后订单进入已完成。验收：陪诊师未确认前服务不完成；确认完成后基础购买时长仍按已购买时长计费，不因提前结束减少基础费用。
- **FR-022 纠纷暂停与售后：** 陪诊师与用户发生纠纷时，用户可以暂停服务并呼叫平台；订单进入服务暂停待售后，平台人工介入处理。验收：暂停后平台可以查看订单、定位、照片、订单备注和售后记录；平台人工决定恢复、完成、取消和结算结果，不提供自动加钟或自动争议结算。
- **FR-023 价格配置与优惠券：** 管理后台只维护专业陪诊一小时单价和可用优惠券；一期不提供陪诊师等级价格、不提供服务包多档定价和加钟单价。用户下单时选择整小时购买服务时长并使用可用优惠券，订单保存支付时价格快照。验收：新订单展示一小时单价、购买小时数、优惠券抵扣和应付金额；支付成功后改价不影响订单。
- **FR-024 诊前主动对接：** 订单进入待服务后，陪诊师端生成“诊前对接”任务，并要求在订单生成后 30 分钟内完成首次联系；在服务日前 1–2 天再次主动完成诊前复核。若订单临近服务日才生成，则按订单生成后 30 分钟完成同等复核。任务记录联系时间、结果、待补信息和下次动作。用户小程序展示联系状态和待办，不暴露陪诊师私人联系方式。验收：首次联系或诊前复核无法完成时，陪诊师可直接联系平台介入，用户能看到“平台正在跟进”而不是无状态等待。
- **FR-025 诊前资料与特殊需求：** 陪诊师端通过结构化表单查看本单订单准备资料及用户明确授权的必要既往信息，并收集或核对就诊目的（如产检/专科/复诊）、既往病史、过敏史、用药、轮椅/无障碍通道等特殊需求，以及药品清单和检查资料。就诊概况可以在首次联系或服务日前 1–2 天复核时由陪诊师填写/核对，并作为本次就医记录保存；其他诊前收集内容先作为订单准备资料保存，不自动写入健康档案时间线，服务过程中再按第 7.2 节追加其余记录，不覆盖历史内容。用户小程序提供“必带资料清单”，至少包含身份证、医保卡、银行卡/现金、既往病历/影像片等，并支持用户逐项确认或备注缺失项；碰面信息至少包括院区、入口、具体地标/电梯前和时间。验收：敏感信息只在必要字段中收集，用户可查看已提交内容并在服务前补充，陪诊师不能查看无关档案 `[TODO-047]`。
- **FR-026 服务方案与动线：** 陪诊师端必须展示平台下发的《守则》，并为本单生成可执行的服务计划：服务方案标签（标准/MDT 导诊）、挂号、取号、抽血、B 超、缴费、拿药等节点、碰面信息和变更记录。医院后台一期只需维护医院与院区；科室、入口、楼层、路线等字段预留，具体动线可由陪诊师结合诊前沟通和现场情况记录。用户小程序以时间线或任务清单展示“今天先做什么”和下一步安排；计划发生变化时由陪诊师更新、说明偏离安排的原因并通知家属。标准/MDT 导诊一期只作为服务方案标签，不改变服务目录、价格、资格或状态链路，详细模板后续按 `[TODO-048]` 补充。
- **FR-027 现场迎接与到院确认：** 陪诊师端在服务开始前提醒提前 15–20 分钟到达指定集结地，并提供“已到达、找不到人、地点变化、迟到”入口。迎接任务要求记录自我介绍、以生活化语言关心患者路途和情绪、是否征得协助携物/搀扶许可、患者的沟通/节奏偏好、今日安排和应急预案是否已说明；用户小程序展示陪诊师到达状态、碰面地点和联系平台入口。验收：未完成到院验证不能直接进入服务中，破冰任务须标记已完成或“不适用/原因”；迟到、找不到患者、地点变化或无法迎接时直接联系平台介入处理。
- **FR-028 诊中阶段任务卡：** 服务开始后，陪诊师端按阶段显示现场迎接、挂号/取号、候诊、检查、缴费、取药和离院等任务；每项任务包含待办动作、完成按钮、必填备注/凭证、超时提示和异常入口。用户小程序同步显示当前阶段、下一节点、已完成事项和必要的等待/休息提示；允许陪诊师在不改变订单主状态的情况下调整阶段顺序并说明原因。
- **FR-029 医学术语转译与医生叮嘱记录：** 陪诊师可将医生已经讲到的医学缩略词或术语，以及就诊流程术语，转译为患者易懂的生活化语言；页面必须标明“通俗说明不等于诊断或治疗建议”，不确定时应请医生或平台确认。医生完成问诊后，陪诊师使用文字表单区分记录医生原话/原意、陪诊师转述、注意事项、复查时间和待办事项，并向患者/家属复述后记录“已复述/待确认”；提交后作为本次服务记录追加到关联健康档案，服务结束并提交服务总结后在用户端健康档案时间线和服务总结中只读可见。第一期不提供用户纠错入口。不得让陪诊师替患者作医疗决定、修改医嘱或补充医生未表达的诊疗结论 `[TODO-004]`、`[TODO-047]`。
- **FR-030 隐私、等待与冲突处理：** 涉及病史、过敏、用药、医生叮嘱等敏感内容时，陪诊师端显示“请避开嘈杂人群和无关人员”的提示，并提供私密沟通记录入口。遇到插队等冲突时提供冷静协商、联系保安和平台报备入口；等待时间过长时可记录休息、饮水、代排队等安抚动作和用户选择，不承诺医院结果。无法解决、发生冲突或用户对服务有异议时，统一联系平台介入处理。
- **FR-031 取药与凭证简单记录：** 对实际涉及取药或凭证的服务，陪诊师端提供普通选填记录和附件上传入口；一期不设置跨楼层取药的休息区等待和当面交接专门任务，不做处方与实际取药清单的结构化比对，不自动判断药品/处方/凭证差异，也不因相关记录缺失或差异阻断结束服务。陪诊师不得调整剂量、替换药物或补充治疗建议；如遇到药品或凭证问题，统一联系平台人工处理。陪诊师可上传处方、检查单、影像资料和报销凭证等本单相关附件，第一期当前用户、陪诊师、运营和售后均可在线查看但不能下载、转发或删除；服务结束并提交服务总结后，用户小程序生成只读就诊记录，展示已填写的药品/凭证记录和已上传附件（已确认一期简化规则）。
- **FR-032 SOP 完成与异常闭环：** 陪诊师端只有在阶段任务、必填记录和必要凭证完成或明确标记“不适用/未完成原因”后，才允许提交服务总结和结束服务；一期本次就医记录中仅“就诊概况”整组必填，其余健康记录字段均为选填，不因选填字段为空阻断结束服务。就诊概况可以在诊前沟通阶段完成，服务中不要求重复填写，但结束前必须已经完成核对。提交服务总结并结束服务后，系统生成当前用户可查看的只读就诊记录；第一期不提供用户纠错入口。到院认证处理、患者安全事件交接和提前结束确认属于不可标记“不适用”的硬闸门；取药、药品核对和凭证一期仅作普通选填记录，不构成结束服务硬闸门。一般异常统一联系平台介入处理；平台可人工决定继续、暂停、完成、取消或结算结果，不提供自动加钟或自动争议结算。
- **FR-033 SOP 模板与运营监控：** 后台可以按服务包、医院/院区和方案标签维护任务模板、必填字段、提示文案、阶段 SLA 和版本；科室、入口、楼层、路线等字段预留后续补充，不作为一期医院配置必填项。运营可以按首次联系、提前到院、节点逾期、任务漏项和异常类型筛选订单，向陪诊师发起补录或人工介入。生活化安抚和术语转译文案需要审核人、版本、适用范围、禁止医疗承诺提示、发布/回滚记录；模板变更不追溯修改已完成订单 `[TODO-051]`。
- **FR-034 患者安全事件上报与交接：** 陪诊师端和运营后台提供独立的安全事件入口，事件类型至少包括急症、状态恶化、失联、走失、暴力冲突和其他明确患者安全风险。触发后系统将订单主状态标记为“异常单”，用户小程序显示“平台处理中”，并提示先保障现场安全、联系医院/急救资源，再联系平台和当前用户；记录事件发生时间、地点、患者状态、首个处置动作、联系对象、责任人、交接对象、交接时间和结果。验收：安全事件未完成责任交接时，订单保持异常单，不得标记为正常完成或直接取消；责任交接完成后由运营人工决定后续订单结果；患者拒绝服务、普通迟到、联系不上、等待过久和一般服务争议不标记异常单；事件记录不能被普通订单状态覆盖（已确认规则）。

**Total FRs: 34**

### Non-Functional Requirements

- **NFR-001 一致性：** 用户小程序、陪诊师端和运营后台对当前阶段、订单主状态、任务完成结果和异常结果的展示不得互相矛盾；支付成功后对应可约日期/时间必须锁定，不得被陪诊师修改、撤下、转让或被其他订单重复占用；订单进入已取消后才释放该时段，订单仍有效或处于取消处理中时不得释放。所有状态变更必须校验当前状态，过期操作不得覆盖最新状态；重复提交以订单号幂等并返回当前结果；“服务中”仅允许由“待服务”进入，已完成、已取消、售后处理中等终态不可回退；安全事件与完成/取消并发时安全事件优先进入异常单；状态冲突提示“订单状态已变化”并交由平台人工处理。就诊码失败后的进入服务中仅允许在 FR-007 规定的平台人工处理完成后，由运营将当前主状态为“待服务”的订单改为“服务中”；接口不能被实现为无条件人工改状态或允许其他来源状态直接跳转。
- **NFR-008 到院认证硬闸门：** 服务中任务、定位/照片上传、医生叮嘱记录、取药核对和结束服务等动作必须校验订单主状态为服务中；输入锁定或人工处理中不得开放服务中任务。订单进入服务中后就诊码不可重放，订单取消/完成或售后冻结后不可再次认证。
- **NFR-007 患者安全优先：** 安全事件记录独立于普通 SOP 任务；一期不做事件分级，也不设置自动超时关闭。发生明确患者安全事件时，订单主状态必须立即标记为“异常单”；先保障现场安全并联系医院/急救资源，再联系平台和当前用户；责任交接未完成时不得标记为正常完成或直接取消，平台持续人工跟进；责任交接完成后，运营人工决定完成、取消、售后处理或其他适用结果，不得被普通 SOP 任务覆盖。
- **NFR-002 时效性与通知可靠性：** 订单生成后 30 分钟首次联系、服务前 15–20 分钟到达等时限应可倒计时、提醒、标记逾期并进入人工处理列表；通知失败不得改变订单状态、SOP 阶段或财务动作，用户重新进入订单详情时以最新状态为准；关键通知失败时平台人工跟进。小程序优先使用微信小程序原生基础组件和现有系统能力呈现状态卡、进度、角标、提示和操作入口，具体组件映射列为 `[TODO-023]`。
- **NFR-003 可追溯性：** 每项 SOP 任务至少保留订单、阶段、时间、操作者、结果、备注/凭证引用和异常关联；退款、返券、押金扣款和补偿发券等独立财务动作至少保留订单号、动作类型、动作状态、金额、操作者、时间和第三方返回信息；重复提交和部分成功必须可识别，失败部分进入“待人工对账”，不自动回滚已成功动作；追加到健康档案的本次服务记录至少保留来源订单、记录人和记录时间；服务总结提交后相关记录按现有长期保存、禁止下载/转发/删除规则处理。
- **NFR-004 隐私与最小展示：** 医疗和身份信息不出现在无必要的推送摘要、列表标题或公共屏幕；敏感问询和医生叮嘱的填写页提供私密沟通提示。当前用户可管理关联就诊人并查看完整本次就医记录；订单生成后陪诊师只能查看本单必要字段，默认不能查看历史记录，当前用户在本单明确授权后只能只读查看指定历史记录，服务中追加本次记录，订单完成/取消/安全事件交接后不能继续写入；运营和售后只能按订单、安全事件或售后 case 最小必要范围查看，不能写入健康档案；其他家庭成员一期不开放共享。本单附件作为一期明确例外，当前用户、陪诊师、运营和售后均可在线查看，不能下载、转发或删除，后续再收缩权限；收集目的、同意、留存、导出和合规边界受 `[TODO-025]`、`[TODO-032]` 约束，健康记录来源按第 7.2 节固定枚举执行。
- **NFR-005 可理解性与无障碍：** 患者侧任务、地址、下一步和等待状态使用大字号、清晰对比和生活化语言；关键操作同时提供文字确认，适配老年人、行动不便者和家属远程查看。具体字号、对比度和辅助能力列为 `[TODO-052]`。
- **NFR-006 异常可用性：** 网络中断、医院流程变化、上传失败或陪诊师无法完成任务时，必须能够先保存草稿/标记待补，并通过电话或平台人工兜底，不得因为单个任务失败而丢失整单服务记录 `[TODO-053]`。

**Total NFRs: 8**

### Additional Requirements

- 一期只开放专业陪诊；其他服务入口保留展示并标注“敬请期待”，不可下单、支付、预约、派单或进入履约流程。
- 城市固定为杭州；医院后台一期只维护医院和院区，科室、入口、楼层、路线等字段预留；平台全天开放，不设上线/下线时间和停止条件，具体可约日期和时间由陪诊师发布。
- 陪诊师一期准入为实名认证 + 后台审核；不将培训、保险、额外资质和背景核验纳入本期准入。
- 陪诊师选择页一期仅展示已实名认证、已通过后台审核、纳入杭州服务范围、已发布并匹配所选医院/院区/服务日期和可约时间、无已知服务冲突且未超出运营配置容量的陪诊师；展示称呼/头像、性别、认证状态和已配置服务标签，按运营配置顺序排列，不做复杂推荐或综合评分排序；客户支付前可改选，支付后锁定所选陪诊师和对应可约时段，支付成功后订单直接进入待服务；已被支付订单占用的时段不得修改、撤下、转让或被其他订单占用，订单进入已取消后释放并可重新选择；无可选陪诊师时不能继续支付并提示联系平台。
- 运营人工主状态变更仅允许当前主状态“待服务”转为“服务中”，接口以订单号幂等；正常就诊码验证与受控人工处理统一进入“服务中”。
- 通知失败不影响订单状态流转；订单详情页状态和阶段是唯一真实来源；小程序通知优先使用微信小程序原生基础组件和现有系统能力，具体组件映射在 UX/实现阶段确认。
- 取药、药品核对和凭证一期仅提供普通选填记录与附件上传，不设置跨楼层休息区等待/当面交接专门任务，不做结构化一致性判断，不阻断结束服务；问题统一联系平台人工处理。
- 订单状态变更校验当前状态，过期操作不得覆盖最新状态；重复提交按订单号幂等；终态不可回退；安全事件与完成/取消并发时安全事件优先；状态冲突交平台人工处理，不自动回滚已执行动作。
- 一期本单附件由当前用户、陪诊师、运营和售后在线查看，但不能下载、转发或删除；后续再收缩权限。
- 健康档案一期只沉淀订单级本次就医记录；就诊概况必填且可诊前填写/核对，其余六组记录选填并在服务中记录；服务总结提交后生成用户只读记录，第一期不提供纠错。
- 支付、支付成功未建单、重复支付、退款及优惠券返还异常统一由平台人工处理；用户或陪诊师在就诊日取消按订单支付金额的 20% 扣款，用户从应退金额中扣除，陪诊师押金不足部分在后续收入中抵扣；平台因陪诊师无法履约而取消不扣款；正常取消路径自动返还已使用优惠券，额外补偿人工发券。
- 退款、返券、押金扣款和补偿发券为独立财务动作，按“订单号 + 动作类型”幂等；重复提交不重复执行；退款不得超过实际支付金额，押金扣款不得重复计入待扣款；部分成功保留已成功动作，失败部分进入“待人工对账”，不自动回滚。
- 患者安全事件立即标记“异常单”，用户端显示“平台处理中”；责任交接未完成不得正常完成或直接取消。

### Noted consistency issues for later validation

- The PRD's UJ-1 numbering contains a duplicate step `13`; this is editorial, not a business-rule blocker.
- Several “closed policy” items still appear in broader blocker lists or open-question prose; later validation must distinguish confirmed policy from remaining implementation detail.
- The PRD states both “医院/院区” as the configured minimum and retains historical references to “科室” in reserved record fields; this is intentional but must be represented consistently in UX and data design.
- The account model has now been clarified: the account holder may be the patient or a proxy; the patient remains a separate business object and must be newly created/selected even when the patient has a registered account. Other authorization rules remain unchanged.

## Post-assessment Clarification

The patient-safety operating rule, order-state consistency rule, cancellation-deduction rule, and financial-action consistency rule were confirmed after the initial assessment. Patient safety: 一期不做事件分级，不设置自动超时关闭；明确安全风险后立即标记“异常单”，先保障现场安全并联系医院/急救资源，再联系平台和当前用户；平台持续人工跟进并记录联系对象、责任交接对象、交接时间和结果；责任交接未完成不得正常完成或直接取消，交接完成后由运营人工决定完成、取消或售后。 Order state: validate the current state for every transition, reject stale overwrites, make repeated submissions idempotent by order number, allow `服务中` only from `待服务`, disallow terminal-state rollback, give safety events priority over concurrent completion/cancellation, and route conflicts to platform manual handling without automatic rollback. Cancellation deduction: user or companion cancellation before the appointment day does not incur the 20% deduction; cancellation on the appointment day deducts 20% of the paid order amount, from the user's refund or the companion's deposit; an insufficient companion deposit becomes an amount to deduct from later earnings, while platform cancellation for no assignment or inability to fulfill does not incur the deduction. Financial actions: refund, coupon return, deposit deduction and compensation issuance are independent actions keyed by order number plus action type; duplicates do not repeat, amounts are bounded, successful actions are retained, and failed portions enter manual reconciliation without rollback. These close the prior policy gaps around TODO-013/TODO-019/TODO-021/TODO-027/TODO-028/TODO-056, but do not remove the overall NOT READY status because UX, Architecture, and Epics/Stories are still absent and other readiness blockers remain.

Subsequent clarifications confirmed the phase-one health-record permission matrix: the current user manages linked patients and views the complete visit-record set; companion access is limited to accepted-order necessary fields, with explicit per-order read-only authorization for selected history; operations and after-sales are minimum-necessary and non-writing; family sharing is not available. The phase-one service-end policy is also closed: arrival authentication, safety-event handoff, and early-end confirmation are hard gates; the visit overview is the only required health-record group; other health-record, medication, and receipt records are optional. TODO-030 and TODO-054 are closed-policy items; TODO-025 remains for collection purpose, consent, retention, export, and compliance boundaries.

Notification policy was then clarified: notification failure never changes order state, SOP phase, financial action, or any completed action; the order-detail status and phase view are the source of truth. The mini-program notification experience should prioritize WeChat mini-program native/basic components and existing system capabilities, with concrete component mapping left to UX/implementation under TODO-023; critical notification failures remain visible to operations for manual follow-up.

### Initial PRD Completeness Assessment

The PRD contains a broad functional spine and explicit business boundaries, but it is not yet implementation-ready because several high-impact rules remain marked as open TODOs and no UX, architecture, or epics/stories artifacts exist. The initial assessment also identified patient-safety event operating details and order-state concurrency as blockers; both policy gaps were closed by subsequent clarification. The current-user/就诊人 relationship and phase-one field-level permission matrix are also now confirmed: current user manages the linked patient and full visit records, companion access is order-scoped with explicit per-order history authorization, and operations/after-sales are minimum-necessary and read-only for health records. Remaining data work is limited to collection purpose, consent, retention, export, and compliance boundaries. Service-end hard-gate policy is also confirmed: arrival authentication, safety handoff, and early-end confirmation remain gates, while medication/receipt records are optional; remaining work is implementation of those checks. Other blockers are financial/commission/deposit implementation, notification failure behavior, and attachment/medical-data governance. These are assessed in later readiness steps.

## Epic Coverage Validation

No epics or stories document was found in the document inventory. Therefore, no PRD functional requirement currently has a traceable epic/story implementation path.

### Coverage Matrix

| FR | Requirement area | Epic/story coverage | Status |
|---|---|---|---|
| FR-001 | 就诊人与健康档案 | Not found | Missing |
| FR-002 | 服务选择、杭州医院/院区、可约日期/时间、全天开放、计费展示 | Not found | Missing |
| FR-003 | 支付建单、就诊码生成、支付异常人工处理 | Not found | Missing |
| FR-004 | 客户选择陪诊师 | Not found | Missing |
| FR-005 | 可约时间发布、订单直接进入履约与异常人工处理 | Not found | Missing |
| FR-006 | 订单状态通知 | Not found | Missing |
| FR-007 | 到院认证、三次失败、受控人工转服务中、订单号幂等 | Not found | Missing |
| FR-008 | 定位、照片、订单备注、售后记录在线查看 | Not found | Missing |
| FR-009 | 正常/提前结束服务与就医记录生成 | Not found | Missing |
| FR-010 | 评价 | Not found | Missing |
| FR-011 | 售后创建 | Not found | Missing |
| FR-012 | 平台人工退款、发券、扣款、安抚 | Not found | Missing |
| FR-013 | 平台无法履约取消、退款、优惠券返还 | Not found | Missing |
| FR-014 | 订单生成后陪诊师无法履约的取消、退款、补偿 | Not found | Missing |
| FR-015 | 陪诊师取消、佣金/押金扣款 | Not found | Missing |
| FR-016 | 订单审计与普通状态变更记录 | Not found | Missing |
| FR-017 | 敏感操作权限控制 | Not found | Missing |
| FR-018 | 远程口述就诊码协助 | Not found | Missing |
| FR-019 | 本单数据查看与健康档案写入 | Not found | Missing |
| FR-020 | 整小时计费、优惠券抵扣、价格快照 | Not found | Missing |
| FR-021 | 用户提前结束与陪诊师确认 | Not found | Missing |
| FR-022 | 纠纷暂停与平台售后 | Not found | Missing |
| FR-023 | 一小时单价与优惠券配置 | Not found | Missing |
| FR-024 | 诊前主动联系与复核 SLA | Not found | Missing |
| FR-025 | 诊前资料、特殊需求、必带资料、碰面信息 | Not found | Missing |
| FR-026 | 《守则》、方案标签、医院/院区、服务计划 | Not found | Missing |
| FR-027 | 提前到院、迎接破冰、到院确认 | Not found | Missing |
| FR-028 | 诊中阶段任务卡与阶段同步 | Not found | Missing |
| FR-029 | 医学术语转译、医生叮嘱、复述确认 | Not found | Missing |
| FR-030 | 隐私、等待安抚、冲突处理 | Not found | Missing |
| FR-031 | 取药、药品核对、凭证、附件查看 | Not found | Missing |
| FR-032 | SOP 结束硬闸门、服务总结与异常闭环 | Not found | Missing |
| FR-033 | SOP 模板、版本与运营监控 | Not found | Missing |
| FR-034 | 患者安全事件、异常单与责任交接 | Not found | Missing |

### Missing Requirements

All 34 FRs are missing epic/story coverage. This is a release-blocking planning gap: development cannot be sequenced, acceptance criteria cannot be assigned, and cross-cutting safety/financial requirements cannot be traced to implementable stories until epics and stories are created.

### Coverage Statistics

- Total PRD FRs: 34
- FRs covered in epics: 0
- Coverage percentage: 0%

## UX Alignment Assessment

### UX Document Status

No dedicated UX document was found. UX is explicitly implied by the PRD: it defines a user mini-program, companion app, operations console, page collections, stage progress, task cards, permissions, confirmation states, sensitive-information prompts, elderly-friendly presentation, and “敬请期待” service entrances.

### Alignment Issues

- No screen-level interaction specification exists for the core order state flow, especially `待服务 → 服务中`, three failed code attempts, manual platform handling, abnormal orders, service pause, and end-of-service hard gates.
- The PRD now contains a phase-one field-level permission matrix for the four roles and the attachment exception; UX and architecture still need to project that matrix into screen-level visibility and API/data access controls.
- No UX specification defines how companion-published available dates and times are represented in booking, order preparation, reminders, and service timeline screens.
- No UX specification defines error, retry, manual-processing, weak-network, upload-failure, or notification-failure states.
- No UX specification defines the required private-entry interaction for sensitive medical questions and doctor instructions.

### Warnings

Missing UX is a high-priority readiness warning and a practical development blocker for this product. The PRD cannot be reliably translated into the three clients without screen states, role-specific actions, empty/error/loading states, and acceptance-ready interaction details. Architecture is also absent, so there is no confirmation that state transitions, attachment access controls, draft saving, and notification recovery support the intended UX.

## Epic Quality Review

No epics or stories document exists, so story-level quality and dependency validation cannot pass.

### Findings

- **Critical:** There is no user-value-oriented epic structure for the 34 functional requirements.
- **Critical:** There is no story-level acceptance criteria in Given/When/Then or equivalent testable form.
- **Critical:** There is no dependency order for the three clients, order state machine, manual operations, health-record write path, attachment access, or safety-event handling.
- **Major:** There is no way to verify that safety hard gates, financial actions, or role permissions are independently implementable rather than deferred behind a later story.
- **Major:** There is no traceability from PRD FRs to stories, no story sizing, and no implementation ownership.

### Recommendation

Create value-oriented epics and stories only after the remaining PRD blockers are closed or explicitly accepted. Each story should trace to one or more FRs, state its user value, define preconditions and error paths, and use testable acceptance criteria. Technical setup should be handled inside the architecture/development plan rather than represented as a user-value epic.

## Summary and Recommendations

### Overall Readiness Status

**NOT READY for implementation.**

The PRD is a solid requirements baseline for continued product clarification, but it is not yet a complete implementation package. The confirmed business decisions are now reflected, including the `待服务 → 服务中` restriction and order-number idempotency. However, the absence of UX, architecture, and epics/stories artifacts alone prevents development handoff, and several high-stakes TODOs remain open.

### Critical Issues Requiring Immediate Action

1. **Authorization and medical-data governance — permission policy closed, compliance follow-through remains:** the current-user/就诊人 relationship, phase-one field-level permission matrix, explicit per-order history authorization, no-family-sharing rule, and attachment exception are confirmed; remaining work is collection purpose, consent, retention, export, and compliance boundaries.
2. **Patient-safety operations — closed policy, implementation follow-through remains:** the operating rule is confirmed below; implementation must preserve immediate abnormal status, safety-first escalation, manual platform follow-up, and the handoff gate.
3. **Order state and failure semantics — closed policy, implementation follow-through remains:** the state precedence, stale-write rejection, order-number idempotency, terminal-state protection, safety-event priority, and manual conflict handling are confirmed below.
4. **Financial invariants — policy largely closed, implementation follow-through remains:** cancellation deductions, independent financial actions, idempotency, bounded amounts, partial-success handling, and manual reconciliation are confirmed; remaining work is authorization, reconciliation tooling, and commission/settlement implementation.
5. **Service-end hard gates — policy closed, implementation follow-through remains:** arrival authentication, safety-event handoff, and early-end confirmation are hard gates; the visit overview is the only required health-record group; other health-record fields and medication/receipt records are optional, and task exceptions require an explicit not-applicable or unfinished reason.
6. **Delivery artifacts:** create UX flows, architecture, and value-oriented epics/stories with traceability to all 34 FRs and 8 NFRs.

### Recommended Next Steps

1. Resolve the remaining data-governance, notification, service-end, and financial implementation details in the PRD and record each decision in `.memlog.md`; carry the confirmed permission matrix into UX and architecture acceptance criteria.
2. Carry the confirmed field-level permission matrix into UX/architecture, and produce the remaining state-transition matrix as the bridge to implementation.
3. Create UX specifications for the three clients, including loading, empty, error, manual-processing, weak-network, and safety-event states.
4. Create architecture covering order state consistency, idempotent operations, draft/offline recovery, attachments, notifications, audit boundaries, and medical-data access control.
5. Create epics/stories mapping every FR/NFR to independently implementable, acceptance-testable work.
6. Re-run implementation readiness after UX, architecture, and epics/stories are available.

### Final Note

This assessment found **4 remaining critical rule groups**, **5 major planning gaps**, and **34 uncovered FRs** due to missing epics/stories. Patient-safety, order-state, and cancellation-deduction policies are confirmed but still require implementation traceability. The current PRD should remain `draft` until the remaining critical groups are resolved or explicitly accepted for a controlled internal trial.
