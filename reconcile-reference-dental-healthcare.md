# Reconciliation — reference-dental-healthcare.jpeg

## 输入性质

这是用户提供的视觉参考图，不是包含待执行产品指令的需求文档。图中展示了医疗/预约类移动界面的三组示例屏幕。

## 已吸收

- 浅灰蓝背景，作为 MedPal 的 `{colors.surface-base}` 方向。
- 青绿色行动色，收敛为 `{colors.primary}` 与 `{colors.primary-deep}`。
- 白色圆角卡片、柔和阴影和充足留白，形成 `{rounded.lg}` 与卡片层级。
- 医生头像、预约时间、推荐医生和底部导航，分别落入首页、预约流程与组件契约。
- “先看下一步”的信息层级：问候 → 当前预约/可用时间 → 其他服务。

## 有意未吸收

- 未复制图中的英文文案、英文产品名和营销承诺。
- 未把三台手机样机作为小程序内部页面。
- 未把整张拼图当作真实医生头像或健康记录素材。
- 未把图片里的具体医生、医院、日期、价格和可用号源当作业务事实；mockup 中的内容仅为演示数据。

## 去向

- 视觉决策已提升至 [`DESIGN.md`](DESIGN.md)。
- 行为与流程决策已提升至 [`EXPERIENCE.md`](EXPERIENCE.md)。
- 参考图片原件保留在 [`_bmad-output/planning-artifacts/ux-designs/ux-medpal-2026-08-20/imports/reference-dental-healthcare.jpeg`](_bmad-output/planning-artifacts/ux-designs/ux-medpal-2026-08-20/imports/reference-dental-healthcare.jpeg)。
- 关键页面参考稿位于 [`_bmad-output/planning-artifacts/ux-designs/ux-medpal-2026-08-20/mockups/`](_bmad-output/planning-artifacts/ux-designs/ux-medpal-2026-08-20/mockups/)。

## Update — 2026-08-20

用户明确反馈上一版过深、与参考图偏离、Tab 不够像、字号偏小、模块不够大气。本轮已将这些反馈作为覆盖决策：

- 主题从“清透青绿”调整为更浅的“浅雾青绿”，减少深色大面积表面。
- 设备参考改为白色圆角机身，贴近上传图片的视觉构图。
- 底部 Tab 改为白色悬浮圆角胶囊，中心“预约”使用圆形青绿色主入口。
- 字号升级为 32 / 24 / 18 / 15 / 14px，并将主要触控区提升至 48–52px。
- 首页服务入口改为 2×2 大模块，减少小图标密度，照顾中老年使用者。
