export const en = {
  app: {
    subtitle: 'visual config editor',
  },
  topbar: {
    presets: 'presets',
    import: 'import',
    export: 'export',
    copy: 'copy',
    share: 'share',
  },
  tabs: {
    layout: 'Layout',
    elements: 'Elements',
    git: 'Git',
    display: 'Display',
    thresholds: 'Thresholds',
    colors: 'Colors',
    rawJson: 'Raw JSON',
  },
  banner: {
    title: 'Configuration warnings',
    unknownFields: 'Unknown fields preserved on export:',
  },
  dialog: {
    cancel: 'Cancel',
    continue: 'Continue',
    loadPreset: 'Load preset',
    replaceWarning: 'This will replace your current configuration.',
    replacePresetWarning:
      'This will replace your current configuration. Unknown fields you have set will be lost.',
  },
  import: {
    title: 'Import config.json',
    hint: 'Paste JSON below, drag a file in, or pick one. Existing config will be replaced.',
    sourceHint: 'Your existing config usually lives here — drag it in or paste it to keep editing:',
    noConfigHint: "Don't have one yet? Just start from a preset above.",
    apply: 'Apply',
    errorPrefix: '⚠',
    buttonLabel: '[ import ]',
    fileTooLarge: 'File too large (>1 MB)',
    nonObjectError: 'Config must be a JSON object',
  },
  export: {
    title: 'Export config.json',
    buttonLabel: '[ export ]',
    destHint: 'Save this as config.json and put it here:',
    effectHint: 'New Claude Code sessions will pick up the changes.',
    copyPath: 'copy path',
    downloadLabel: '[ download config.json ]',
    copyLabel: '[ copy JSON ]',
    copyTooltip: 'Copy JSON to clipboard',
    close: 'Close',
  },
  share: {
    buttonLabel: '[ share ]',
    longSuffix: '(long: {chars} chars)',
  },
  presetMenu: {
    buttonLabel: '[ presets ▾ ]',
  },
  toast: {
    linkCopied: 'Link copied',
    downloaded: 'Downloaded',
    jsonCopied: 'Copied to clipboard',
    pathCopied: 'Path copied',
    copyFailed: 'Copy failed — see console',
  },
  forms: {
    toggleOn: 'on',
    toggleOff: 'off',
  },
  mergeGroupEditor: {
    addGroup: '+ add group',
    deleteGroup: 'delete group',
    addElement: '+ add',
    empty: 'No merge groups. Click "+ add group" when elements are available.',
  },
  colorPicker: {
    modeNamed: 'named',
    modeIndex: '256',
    modeHex: 'hex',
    indexHint: '0–255',
    hexHint: '#rrggbb',
  },
  rawJson: {
    hint: 'Edit the underlying JSON directly. Changes apply on blur. Unknown fields are preserved on export.',
    nonObjectError: 'Config must be a JSON object',
  },
  layout: {
    sections: {},
    fields: {
      lineLayout: { label: 'Line layout', hint: '' },
      showSeparators: {
        label: 'Show separators',
        hint: 'Insert a dashed separator line between header and activity lines.',
      },
      pathLevels: {
        label: 'Path levels',
        hint: 'How many path segments to show in the project label.',
      },
      maxWidth: { label: 'Max width', hint: 'Clamp output width (cells). Leave empty for auto.' },
      forceMaxWidth: {
        label: 'Force max width',
        hint: 'Use the configured maxWidth even when terminal width is wider.',
      },
      elementOrder: {
        label: 'Element order',
        hint: 'Drag to reorder. Elements not listed are hidden.',
      },
    },
    options: {
      lineLayout: { expanded: 'expanded', compact: 'compact' },
    },
    placeholders: {
      maxWidth: 'auto',
    },
  },
  elements: {
    sections: { visibility: 'Visibility toggles', mergeGroups: 'Merge groups' },
    fields: {
      showModel: { label: 'showModel', hint: 'Show the [Model name] badge.' },
      showProvider: {
        label: 'showProvider',
        hint: 'Show the provider label (custom name or auto-detected Bedrock/Vertex/Enterprise) before the model name.',
      },
      showAdvisor: {
        label: 'showAdvisor',
        hint: 'Show the advisor model on the project line when /advisor is configured.',
      },
      showProject: { label: 'showProject', hint: 'Show the project path.' },
      showAddedDirs: { label: 'showAddedDirs', hint: 'Show added directories.' },
      showContextBar: { label: 'showContextBar', hint: 'Show the context-usage bar.' },
      showTokenBreakdown: {
        label: 'showTokenBreakdown',
        hint: 'Show in/out token counts after the percentage.',
      },
      showUsage: { label: 'showUsage', hint: 'Show the 5h / 7d usage line.' },
      usageBarEnabled: { label: 'usageBarEnabled', hint: 'Show bars for usage values.' },
      showResetLabel: { label: 'showResetLabel', hint: 'Show reset countdown for usage.' },
      showTools: { label: 'showTools', hint: '' },
      showSkills: {
        label: 'showSkills',
        hint: 'Show the skills activity line (active Skill invocations).',
      },
      showMcp: { label: 'showMcp', hint: 'Show the MCP activity line.' },
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
        hint: 'Show how many context compactions (manual /compact or auto) have occurred this session.',
      },
      showConfigCounts: {
        label: 'showConfigCounts',
        hint: 'Show counts of CLAUDE.md / rules / MCPs / hooks.',
      },
      showCost: { label: 'showCost', hint: '' },
      showDuration: { label: 'showDuration', hint: '' },
      showSpeed: { label: 'showSpeed', hint: '' },
      mergeGroups: {
        label: 'display.mergeGroups',
        hint: 'Elements in the same group render on one line separated by │.',
      },
    },
  },
  git: {
    fields: {
      enabled: { label: 'enabled', hint: 'Master switch for the git line.' },
      showDirty: { label: 'showDirty', hint: '' },
      showAheadBehind: { label: 'showAheadBehind', hint: '' },
      showFileStats: { label: 'showFileStats', hint: '' },
      branchOverflow: { label: 'branchOverflow', hint: 'How to handle very long branch names.' },
      pushWarningThreshold: {
        label: 'pushWarningThreshold',
        hint: 'Warn when this many commits are unpushed (0 = off).',
      },
      pushCriticalThreshold: { label: 'pushCriticalThreshold', hint: '' },
    },
    options: {
      branchOverflow: { truncate: 'truncate', wrap: 'wrap' },
    },
  },
  display: {
    sections: {
      contextDisplay: 'Context display',
      usageDisplay: 'Usage display',
      tools: 'Tools',
      model: 'Model',
      advisor: 'Advisor',
      time: 'Time',
      project: 'Project',
      promptCache: 'Prompt cache',
      externalUsage: 'External usage',
      custom: 'Custom',
    },
    fields: {
      contextValue: { label: 'contextValue', hint: 'What to show as the context number.' },
      autocompactBuffer: { label: 'autocompactBuffer', hint: '' },
      autoCompactWindow: {
        label: 'autoCompactWindow',
        hint: 'Override the token window used as the context denominator. Leave empty for auto.',
      },
      toolNameMaxLength: {
        label: 'toolNameMaxLength',
        hint: 'Truncate tool names to this many characters (0 = no limit).',
      },
      toolsMaxVisible: {
        label: 'toolsMaxVisible',
        hint: 'Maximum number of tools shown on the tools line.',
      },
      usageValue: { label: 'usageValue', hint: '' },
      usageCompact: {
        label: 'usageCompact',
        hint: 'Compress the usage line to fewer characters.',
      },
      modelFormat: { label: 'modelFormat', hint: '' },
      modelOverride: {
        label: 'modelOverride',
        hint: 'If set, this string replaces the model display name entirely. Max 80 chars.',
      },
      providerName: {
        label: 'providerName',
        hint: 'Explicit provider label for custom proxies. Falls back to auto-detection when empty. Max 40 chars.',
      },
      advisorOverride: {
        label: 'advisorOverride',
        hint: 'Manual override for the displayed advisor name. Max 80 chars.',
      },
      timeFormat: { label: 'timeFormat', hint: '' },
      addedDirsLayout: { label: 'addedDirsLayout', hint: '' },
      promptCacheTtlSeconds: {
        label: 'promptCacheTtlSeconds',
        hint: 'Anthropic API cache TTL (default 300).',
      },
      externalUsagePath: {
        label: 'externalUsagePath',
        hint: 'Path to an external JSON snapshot of usage data.',
      },
      externalUsageFreshnessMs: {
        label: 'externalUsageFreshnessMs',
        hint: "Max age of the external snapshot before it's considered stale.",
      },
      externalUsageWritePath: {
        label: 'externalUsageWritePath',
        hint: 'Path to write a usage snapshot to, for sharing across machines.',
      },
      customLine: {
        label: 'customLine',
        hint: 'Free-form extra line appended at the end. Max 80 chars.',
      },
      customLinePosition: {
        label: 'customLinePosition',
        hint: 'Whether the custom line appears first or last.',
      },
    },
    options: {
      contextValue: {
        percent: 'percent',
        tokens: 'tokens',
        remaining: 'remaining',
        both: 'both',
      },
      autocompactBuffer: { enabled: 'enabled', disabled: 'disabled' },
      usageValue: { percent: 'percent', remaining: 'remaining' },
      modelFormat: { full: 'full', compact: 'compact', short: 'short' },
      timeFormat: {
        relative: 'relative',
        absolute: 'absolute',
        both: 'both',
        elapsed: 'elapsed',
        elapsedAndAbsolute: 'elapsed + absolute',
      },
      addedDirsLayout: { inline: 'inline', line: 'line' },
      customLinePosition: { first: 'first', last: 'last' },
    },
    placeholders: {
      modelOverride: 'e.g. Claude',
      providerName: 'auto-detect',
      externalUsagePath: '/path/to/usage.json',
      externalUsageWritePath: '/path/to/write.json',
      autoCompactWindow: 'auto',
    },
  },
  thresholds: {
    fields: {
      contextWarningThreshold: {
        label: 'contextWarningThreshold',
        hint: 'Context % at which the bar turns warning-colored.',
      },
      contextCriticalThreshold: {
        label: 'contextCriticalThreshold',
        hint: 'Context % at which the bar turns critical-colored.',
      },
      usageThreshold: {
        label: 'usageThreshold',
        hint: '5h usage % above which the value turns warning-colored. 0 = off.',
      },
      sevenDayThreshold: { label: 'sevenDayThreshold', hint: '7d usage % threshold.' },
      environmentThreshold: {
        label: 'environmentThreshold',
        hint: 'Threshold for environment counts (CLAUDE.md etc).',
      },
    },
  },
  colors: {
    fields: {
      context: { label: 'context', hint: 'Default color for context bar/value.' },
      usage: { label: 'usage', hint: 'Default color for usage bars.' },
      warning: {
        label: 'warning',
        hint: 'Context warning color (>= contextWarningThreshold).',
      },
      usageWarning: { label: 'usageWarning', hint: 'Usage warning color.' },
      critical: { label: 'critical', hint: 'Context critical color.' },
      model: { label: 'model', hint: 'Color for the [Model] badge.' },
      project: { label: 'project', hint: 'Color for the project path.' },
      git: { label: 'git', hint: 'Color for git status text.' },
      gitBranch: { label: 'gitBranch', hint: 'Color for the branch name.' },
      label: { label: 'label', hint: 'Color for labels like "ctx", "5h".' },
      custom: { label: 'custom', hint: 'Color for custom-line elements.' },
      barFilled: {
        label: 'barFilled',
        hint: 'Single character (or grapheme) used for filled bar segments.',
      },
      barEmpty: { label: 'barEmpty', hint: 'Single character used for empty bar segments.' },
    },
  },
  presets: {
    default: {
      label: 'Default',
      description: 'Upstream defaults — equivalent to an empty config.',
    },
    minimal: {
      label: 'Minimal',
      description: 'Just model badge + project + context, one compact line.',
    },
    developer: {
      label: 'Developer',
      description: 'Git-centric — branch, dirty state, ahead/behind, file stats, deeper path.',
    },
    costUsage: {
      label: 'Cost & Usage',
      description: 'Track spend — cost, context bar, 5h + 7d limit bars with reset times.',
    },
    powerUser: {
      label: 'Power user',
      description: 'Everything on, expanded multi-line — tokens, cache, speed, counts, memory.',
    },
    cjk: {
      label: 'CJK optimized',
      description: 'Chinese users — language=zh, compact layout, narrow bar chars.',
    },
    aesthetic: {
      label: 'Aesthetic',
      description: 'Themed compact one-liner — merged groups, custom colors and bar chars.',
    },
    efficiency: {
      label: 'Efficiency',
      description: 'Speed-focused — throughput, prompt cache, token breakdown, duration.',
    },
  },
  diagnostics: {
    kinds: {
      clamped: 'clamped',
      unknownEnum: 'unknown enum',
      unknownElement: 'unknown element',
      duplicateInGroup: 'duplicate in group',
      invalidColor: 'invalid color',
      unknownField: 'unknown field',
    },
    messages: {
      clamped: 'Clamped to [0,{max}].',
      unknownEnum: 'Invalid value — fell back to default.',
      invalidColor: 'Not a valid color — fell back to default.',
      unknownElement: 'Removed unknown: {items}',
      unknownField: 'Preserved on export, but not editable in the visual form.',
      duplicateInGroup: 'Duplicate element in merge group.',
    },
    wasPrefix: 'was:',
  },
}

export type Messages = typeof en
