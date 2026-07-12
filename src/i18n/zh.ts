import type { Messages } from './en'

export const zh: Messages = {
  app: {
    subtitle: '可视化配置编辑器',
  },
  topbar: {
    presets: '预设',
    import: '导入',
    export: '导出',
    copy: '复制',
    share: '分享',
  },
  tabs: {
    layout: '布局',
    elements: '元素',
    git: 'Git',
    display: '显示',
    thresholds: '阈值',
    colors: '配色',
    rawJson: '原始 JSON',
  },
  banner: {
    title: '配置警告',
    unknownFields: '导出时保留的未知字段:',
  },
  dialog: {
    cancel: '取消',
    continue: '继续',
    loadPreset: '加载预设',
    replaceWarning: '这将替换你当前的配置。',
    replacePresetWarning: '这将替换你当前的配置。你设置的未知字段会丢失。',
  },
  import: {
    title: '导入 config.json',
    hint: '粘贴 JSON、拖入文件,或者选取一个文件。已有配置会被覆盖。',
    sourceHint: '你现有的配置通常在这里 —— 把它拖进来或粘贴进来继续编辑:',
    noConfigHint: '还没有配置?直接从上方预设起步即可。',
    apply: '应用',
    errorPrefix: '⚠',
    buttonLabel: '[ 导入 ]',
    fileTooLarge: '文件过大 (>1 MB)',
    nonObjectError: '配置必须是 JSON 对象',
  },
  export: {
    title: '导出 config.json',
    buttonLabel: '[ 导出 ]',
    destHint: '把这份配置保存为 config.json,放到这里:',
    effectHint: '新开的 Claude Code 会话即会使用新配置。',
    copyPath: '复制路径',
    downloadLabel: '[ 下载 config.json ]',
    copyLabel: '[ 复制 JSON ]',
    copyTooltip: '复制 JSON 到剪贴板',
    close: '关闭',
  },
  share: {
    buttonLabel: '[ 分享 ]',
    longSuffix: '(较长: {chars} 字符)',
  },
  presetMenu: {
    buttonLabel: '[ 预设 ▾ ]',
  },
  toast: {
    linkCopied: '链接已复制',
    downloaded: '已下载',
    jsonCopied: '已复制到剪贴板',
    pathCopied: '路径已复制',
    copyFailed: '复制失败 — 请查看控制台',
  },
  forms: {
    toggleOn: '开',
    toggleOff: '关',
  },
  mergeGroupEditor: {
    addGroup: '+ 新增分组',
    deleteGroup: '删除分组',
    addElement: '+ 添加',
    empty: '暂无合并分组。当有可用元素时,点击「+ 新增分组」。',
  },
  colorPicker: {
    modeNamed: 'named',
    modeIndex: '256',
    modeHex: 'hex',
    indexHint: '0–255',
    hexHint: '#rrggbb',
  },
  rawJson: {
    hint: '直接编辑底层 JSON。失焦时应用变更。未知字段在导出时会被保留。',
    nonObjectError: '配置必须是 JSON 对象',
  },
  layout: {
    sections: {},
    fields: {
      lineLayout: { label: 'lineLayout', hint: '' },
      showSeparators: {
        label: 'showSeparators',
        hint: '在头部行与活动行之间插入一条虚线分隔符。',
      },
      pathLevels: {
        label: 'pathLevels',
        hint: '项目标签中显示的路径层级数。',
      },
      maxWidth: { label: 'maxWidth', hint: '限制输出宽度(字符列)。留空表示自动。' },
      forceMaxWidth: {
        label: 'forceMaxWidth',
        hint: '即使终端实际更宽,也强制使用配置的 maxWidth。',
      },
      elementOrder: {
        label: 'elementOrder',
        hint: '拖动以重新排序。未列出的元素会被隐藏。',
      },
    },
    options: {
      lineLayout: { expanded: '展开', compact: '紧凑' },
    },
    placeholders: {
      maxWidth: '自动',
    },
  },
  elements: {
    sections: { visibility: '可见性开关', mergeGroups: '合并分组' },
    fields: {
      showModel: { label: 'showModel', hint: '显示 [模型名称] 标识。' },
      showProvider: {
        label: 'showProvider',
        hint: '在模型名称前显示提供方标签(自定义名称,或自动识别的 Bedrock/Vertex/企业版)。',
      },
      showAdvisor: {
        label: 'showAdvisor',
        hint: '当配置了 /advisor 时,在项目行显示顾问模型。',
      },
      showProject: { label: 'showProject', hint: '显示项目路径。' },
      showAddedDirs: { label: 'showAddedDirs', hint: '显示附加目录。' },
      showContextBar: { label: 'showContextBar', hint: '显示上下文使用率条。' },
      showTokenBreakdown: {
        label: 'showTokenBreakdown',
        hint: '在百分比之后显示 in/out token 数量。',
      },
      showUsage: { label: 'showUsage', hint: '显示 5h / 7d 使用率行。' },
      usageBarEnabled: { label: 'usageBarEnabled', hint: '为使用率数值显示进度条。' },
      showResetLabel: { label: 'showResetLabel', hint: '显示使用率重置倒计时。' },
      showTools: { label: 'showTools', hint: '' },
      showSkills: {
        label: 'showSkills',
        hint: '显示技能活动行(正在调用的 Skill)。',
      },
      showMcp: { label: 'showMcp', hint: '显示 MCP 活动行。' },
      showAgents: { label: 'showAgents', hint: '' },
      showTodos: { label: 'showTodos', hint: '' },
      showMemoryUsage: { label: 'showMemoryUsage', hint: '' },
      showPromptCache: { label: 'showPromptCache', hint: '' },
      showSessionName: { label: 'showSessionName', hint: '' },
      showClaudeCodeVersion: { label: 'showClaudeCodeVersion', hint: '' },
      showEffortLevel: { label: 'showEffortLevel', hint: '' },
      showSessionTokens: { label: 'showSessionTokens', hint: '' },
      showOutputStyle: { label: 'showOutputStyle', hint: '' },
      showSessionStartDate: { label: 'showSessionStartDate', hint: '' },
      showLastResponseAt: { label: 'showLastResponseAt', hint: '' },
      showCompactions: {
        label: 'showCompactions',
        hint: '显示本次会话已发生的上下文压缩次数(手动 /compact 或自动)。',
      },
      showConfigCounts: {
        label: 'showConfigCounts',
        hint: '显示 CLAUDE.md / 规则 / MCP / hooks 的数量。',
      },
      showCost: { label: 'showCost', hint: '' },
      showDuration: { label: 'showDuration', hint: '' },
      showSpeed: { label: 'showSpeed', hint: '' },
      mergeGroups: {
        label: 'display.mergeGroups',
        hint: '同一分组内的元素会显示在同一行,以 │ 分隔。',
      },
    },
  },
  git: {
    fields: {
      enabled: { label: 'enabled', hint: 'git 状态行的总开关。' },
      showDirty: { label: 'showDirty', hint: '' },
      showAheadBehind: { label: 'showAheadBehind', hint: '' },
      showFileStats: { label: 'showFileStats', hint: '' },
      branchOverflow: { label: 'branchOverflow', hint: '当分支名过长时的处理方式。' },
      pushWarningThreshold: {
        label: 'pushWarningThreshold',
        hint: '当未推送提交数达到该值时发出警告 (0 = 关闭)。',
      },
      pushCriticalThreshold: { label: 'pushCriticalThreshold', hint: '' },
    },
    options: {
      branchOverflow: { truncate: '截断', wrap: '换行' },
    },
  },
  display: {
    sections: {
      contextDisplay: '上下文显示',
      usageDisplay: '使用率显示',
      tools: '工具',
      model: '模型',
      advisor: '顾问',
      time: '时间',
      project: '项目',
      promptCache: 'Prompt 缓存',
      externalUsage: '外部使用率数据',
      custom: '自定义',
    },
    fields: {
      contextValue: { label: 'contextValue', hint: '上下文数值的展示形式。' },
      autocompactBuffer: { label: 'autocompactBuffer', hint: '' },
      autoCompactWindow: {
        label: 'autoCompactWindow',
        hint: '覆盖用作上下文分母的 token 窗口。留空表示自动。',
      },
      toolNameMaxLength: {
        label: 'toolNameMaxLength',
        hint: '将工具名称截断到该字符数(0 = 不限制)。',
      },
      toolsMaxVisible: {
        label: 'toolsMaxVisible',
        hint: '工具行上显示的最大工具数量。',
      },
      usageValue: { label: 'usageValue', hint: '' },
      usageCompact: {
        label: 'usageCompact',
        hint: '将使用率行压缩为更少的字符。',
      },
      modelFormat: { label: 'modelFormat', hint: '' },
      modelOverride: {
        label: 'modelOverride',
        hint: '若设置,该字符串将完全替换模型显示名称。最多 80 个字符。',
      },
      providerName: {
        label: 'providerName',
        hint: '为自定义代理指定的提供方标签。留空时回退到自动识别。最多 40 个字符。',
      },
      advisorOverride: {
        label: 'advisorOverride',
        hint: '手动覆盖顾问模型的显示名称。最多 80 个字符。',
      },
      timeFormat: { label: 'timeFormat', hint: '' },
      addedDirsLayout: { label: 'addedDirsLayout', hint: '' },
      promptCacheTtlSeconds: {
        label: 'promptCacheTtlSeconds',
        hint: 'Anthropic API 缓存 TTL (默认 300)。',
      },
      externalUsagePath: {
        label: 'externalUsagePath',
        hint: '外部使用率数据 JSON 快照的路径。',
      },
      externalUsageFreshnessMs: {
        label: 'externalUsageFreshnessMs',
        hint: '外部快照被视为过期之前的最大年龄。',
      },
      externalUsageWritePath: {
        label: 'externalUsageWritePath',
        hint: '写出使用率快照的路径,便于在多台机器之间共享。',
      },
      customLine: {
        label: 'customLine',
        hint: '追加到末尾的自由格式额外一行。最多 80 个字符。',
      },
      customLinePosition: {
        label: 'customLinePosition',
        hint: '自定义行显示在最前还是最后。',
      },
    },
    options: {
      contextValue: {
        percent: '百分比',
        tokens: 'tokens',
        remaining: '剩余',
        both: '两者',
      },
      autocompactBuffer: { enabled: '启用', disabled: '禁用' },
      usageValue: { percent: '百分比', remaining: '剩余' },
      modelFormat: { full: '完整', compact: '紧凑', short: '简短' },
      timeFormat: {
        relative: '相对',
        absolute: '绝对',
        both: '两者',
        elapsed: '已用时',
        elapsedAndAbsolute: '已用时 + 绝对',
      },
      addedDirsLayout: { inline: '同行', line: '独立行' },
      customLinePosition: { first: '最前', last: '最后' },
    },
    placeholders: {
      modelOverride: '例如 Claude',
      providerName: '自动识别',
      externalUsagePath: '/path/to/usage.json',
      externalUsageWritePath: '/path/to/write.json',
      autoCompactWindow: '自动',
    },
  },
  thresholds: {
    fields: {
      contextWarningThreshold: {
        label: 'contextWarningThreshold',
        hint: '上下文条进入警告色的百分比阈值。',
      },
      contextCriticalThreshold: {
        label: 'contextCriticalThreshold',
        hint: '上下文条进入严重色的百分比阈值。',
      },
      usageThreshold: {
        label: 'usageThreshold',
        hint: '5h 使用率超过该百分比时数值变为警告色。0 = 关闭。',
      },
      sevenDayThreshold: { label: 'sevenDayThreshold', hint: '7d 使用率百分比阈值。' },
      environmentThreshold: {
        label: 'environmentThreshold',
        hint: '环境数量 (CLAUDE.md 等) 的阈值。',
      },
    },
  },
  colors: {
    fields: {
      context: { label: 'context', hint: '上下文条/数值的默认颜色。' },
      usage: { label: 'usage', hint: '使用率条的默认颜色。' },
      warning: {
        label: 'warning',
        hint: '上下文警告色 (>= contextWarningThreshold)。',
      },
      usageWarning: { label: 'usageWarning', hint: '使用率警告色。' },
      critical: { label: 'critical', hint: '上下文严重色。' },
      model: { label: 'model', hint: '[模型] 标识的颜色。' },
      project: { label: 'project', hint: '项目路径的颜色。' },
      git: { label: 'git', hint: 'git 状态文本的颜色。' },
      gitBranch: { label: 'gitBranch', hint: '分支名的颜色。' },
      label: { label: 'label', hint: '诸如 "ctx"、"5h" 等标签的颜色。' },
      custom: { label: 'custom', hint: '自定义行元素的颜色。' },
      barFilled: {
        label: 'barFilled',
        hint: '用于填充进度条段的单个字符 (或字素)。',
      },
      barEmpty: { label: 'barEmpty', hint: '用于空白进度条段的单个字符。' },
    },
  },
  presets: {
    default: {
      label: '默认',
      description: '上游默认值 — 等价于空配置。',
    },
    minimal: {
      label: '精简',
      description: '仅模型标识 + 项目 + 上下文,紧凑单行。',
    },
    developer: {
      label: '开发者',
      description: '专注 Git — 分支、脏状态、领先/落后、文件增删,更深路径。',
    },
    costUsage: {
      label: '用量与成本',
      description: '追踪开销 — 成本、上下文条、5 小时 + 7 天额度条及重置时间。',
    },
    powerUser: {
      label: '全能',
      description: '全部开启、多行展开 — token 拆解、缓存、速度、计数、内存。',
    },
    cjk: {
      label: 'CJK 优化',
      description: '中文用户专用 — language=zh,紧凑布局,窄字符进度条。',
    },
    aesthetic: {
      label: '美化',
      description: '主题化紧凑单行 — 合并分组、自定义配色与进度条字符。',
    },
    efficiency: {
      label: '效率',
      description: '聚焦速度 — 吞吐、prompt 缓存、token 拆解、耗时。',
    },
  },
  diagnostics: {
    kinds: {
      clamped: '已截断',
      unknownEnum: '未知枚举',
      unknownElement: '未知元素',
      duplicateInGroup: '组内重复',
      invalidColor: '无效颜色',
      unknownField: '未知字段',
    },
    messages: {
      clamped: '已截断到 [0,{max}]。',
      unknownEnum: '无效值 — 已回退为默认。',
      invalidColor: '颜色无效 — 已回退为默认。',
      unknownElement: '已移除未知项: {items}',
      unknownField: '导出时保留,但无法在可视化表单中编辑。',
      duplicateInGroup: '合并分组中存在重复元素。',
    },
    wasPrefix: '原值:',
  },
}
