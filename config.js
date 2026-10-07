/**
 * 网站公开配置。可直接修改，也可用项目根目录的 editor.html 填表后导出。
 * 这里的所有内容都会发送给访客：不要写 API Key、密码、令牌或其他秘密。
 * 当前价格只是排版示例，不是经过核实的报价。正式上线前请逐项确认。
 */
window.SITE_CONFIG = {
  demoMode: true,
  brand: {
    name: "AI 优选",
    english: "AI SELECT",
    tagline: "你的 AI 工具补给站",
    pageTitle: "AI 优选 · 让好用的 AI，成为日常",
    description: "了解 AI 服务与套餐，找到适合自己的工具。点击购买后前往独立商城完成下单。"
  },
  theme: { accent: "#c6f36b" },
  notice: "展示预览 · 价格仅作示例，实际售价以商城为准",
  hero: {
    eyebrow: "AI TOOLS. ONE PLACE.",
    titleLine1: "好用的 AI，",
    titleLine2: "从这里开始。",
    description: "把选择留给需求，把时间留给创造。\n在这里了解 AI 服务与套餐，再前往专属商城完成购买。"
  },
  storeUrl: "https://qfcc99.com/shop/Z4XD0GX2",
  contact: {
    wechat: "Gptchongzhi00",
    email: "",
    note: "选购咨询、套餐说明与订单问题，请添加客服微信联系。"
  },
  products: [
    {
      id: "chatgpt",
      name: "ChatGPT / Codex",
      provider: "OpenAI",
      icon: "chatgpt",
      badge: "通用与开发",
      description: "从一个问题出发，探索你的工作与创作方式。",
      price: "158",
      currency: "¥",
      unit: "起 / 月",
      tags: ["creation", "coding"],
      features: ["查看对话与创作相关方案", "了解编程场景的套餐选择", "具体权益以商品说明为准"],
      purchaseUrl: "",
      detail: "这是 ChatGPT / Codex 服务的展示入口。购买前，请到商城核对套餐名称、服务周期、账号要求、地区适用性与售后条件。本站示例价格不构成正式报价。"
    },
    {
      id: "claude",
      name: "Claude",
      provider: "Anthropic",
      icon: "claude",
      badge: "专注思考",
      description: "为写作、思考与代码工作，留出更多可能。",
      price: "188",
      currency: "¥",
      unit: "起 / 月",
      tags: ["creation", "coding"],
      features: ["查看写作与文档相关方案", "了解代码工作场景的选择", "规格与额度以商品页为准"],
      purchaseUrl: "",
      detail: "这是 Claude 服务的展示入口。请按你的使用需求选择商品，并在下单前核实具体版本、周期、账号要求与交付方式。本站不对未列明的功能或额度作出承诺。"
    },
    {
      id: "gemini",
      name: "Gemini",
      provider: "Google",
      icon: "gemini",
      badge: "探索灵感",
      description: "让新的想法，在你的日常任务里发生。",
      price: "178",
      currency: "¥",
      unit: "起 / 月",
      tags: ["creation", "research"],
      features: ["查看日常工作相关方案", "了解内容与研究场景的选择", "开通条件以商品页为准"],
      purchaseUrl: "",
      detail: "这是 Gemini 服务的展示入口。具体功能、关联权益、账号条件及适用地区可能因商品不同而变化，请以官方说明与商城商品详情为准。"
    },
    {
      id: "grok",
      name: "Grok",
      provider: "xAI",
      icon: "grok",
      badge: "保持好奇",
      description: "带着好奇心，打开另一种探索视角。",
      price: "228",
      currency: "¥",
      unit: "起 / 月",
      tags: ["research"],
      features: ["查看对话与探索相关方案", "了解不同服务周期的选择", "可用功能以商品页为准"],
      purchaseUrl: "",
      detail: "这是 Grok 服务的展示入口。下单前，请先确认商品版本、适用账号、周期、交付流程与售后政策。最终价格与服务说明以实际商城为准。"
    }
  ],
  faq: [
    { question: "点击购买后，会去哪里？", answer: "点击购买后，将在新标签页打开采购商城。请在商城内选择对应商品，并核对实际价格、套餐权益与交易规则后再下单。本站仅提供展示与跳转入口，不直接收款；订单与售后请按商城说明办理。" },
    { question: "我应该选择哪一个套餐？", answer: "先明确你的使用场景、使用频率和预算，再对照商城列出的具体权益选择。已有会员的用户，还应核对当前套餐、到期时间与续费规则。拿不准时，请先联系客服。" },
    { question: "展示价格就是最终成交价格吗？", answer: "不是。当前展示样稿中的价格仅用于排版演示；正式发布后的价格也可能与商城实时价格不同。请在付款前，以外部商城结算页显示的金额和商品说明为准。" },
    { question: "付款后在哪里查看订单、处理售后？", answer: "请在你实际下单的商城中查询订单，并按该商品公布的交付和售后说明处理。咨询客服时，可以提供订单编号和问题描述，不要提供账户密码或验证码。" },
    { question: "这里是相关 AI 品牌的官网吗？", answer: "不是。本站是独立的服务展示入口，不代表 OpenAI、Anthropic、Google 或 xAI 官方，也不表示与这些品牌存在授权或合作关系。产品名称仅用于识别所展示的服务。" },
    { question: "本站会收集账号密码或支付信息吗？", answer: "本展示页没有账号登录、支付表单或订单数据库，也不收集账户密码、验证码与支付信息。跳转至其他平台后，请另行检查该平台的隐私政策和交易规则。" }
  ],
  footer: {
    description: "让好工具，成为日常。\n在这里，找到适合你的 AI 服务。",
    disclaimer: "本站为独立服务展示入口，与相关 AI 品牌无隶属或授权关系。名称仅用于识别产品；具体权益、价格、交付与售后以实际商城说明为准。",
    copyright: "2026 AI 优选",
    filingText: "",
    filingUrl: ""
  }
};
