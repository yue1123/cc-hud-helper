export interface MockTodo {
  content: string;
  status: "pending" | "in_progress" | "completed";
}

export interface MockToolRecent {
  name: string;
  target?: string;
}

export interface MockAgent {
  type: string;
  status: "running" | "completed";
}

export interface MockContext {
  model: {
    displayName: string;
    id: string;
  };
  project: {
    cwd: string;
    addedDirs: string[];
    sessionName: string;
  };
  context: {
    usedPercentage: number;
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
    contextWindow: number;
  };
  usage: {
    fiveHour: number;
    sevenDay: number;
    fiveHourResetAtMinutes: number;
    sevenDayResetAtMinutes: number;
  };
  cost: {
    totalUsd: number;
    durationMs: number;
    linesAdded: number;
    linesRemoved: number;
  };
  git: {
    branch: string;
    dirty: boolean;
    ahead: number;
    behind: number;
    untrackedFiles: number;
    modifiedFiles: number;
    pushPendingCount: number;
  };
  todos: MockTodo[];
  tools: MockToolRecent[];
  skills: string[];
  mcpServers: string[];
  agents: MockAgent[];
  advisorModel: string;
  memory: {
    usedPercent: number;
    usedGb: number;
    totalGb: number;
  };
  environment: {
    claudeMdCount: number;
    rulesCount: number;
    mcpCount: number;
    hooksCount: number;
  };
  session: {
    durationLabel: string;
    lastResponseAgoLabel: string;
    startedAtLabel: string;
    compactionCount: number;
  };
  effort: {
    level: "low" | "medium" | "high" | "max";
    symbol: string;
  };
  outputStyle: string;
  claudeCodeVersion: string;
  promptCache: {
    activeUntilMs: number;
    ttlSeconds: number;
  };
}

export const MOCK_CONTEXT: MockContext = {
  model: {
    displayName: "Opus 4.7",
    id: "claude-opus-4-7",
  },
  project: {
    cwd: "/Users/dh/Desktop/code/claude-uhd-cc",
    addedDirs: ["/Users/dh/Desktop/code/shared-ui", "/Users/dh/work/api-server"],
    sessionName: "plan-foundation",
  },
  context: {
    usedPercentage: 58,
    inputTokens: 142_000,
    outputTokens: 18_500,
    cacheCreationTokens: 8_200,
    cacheReadTokens: 96_000,
    contextWindow: 1_000_000,
  },
  usage: {
    fiveHour: 22,
    sevenDay: 5,
    fiveHourResetAtMinutes: 144,
    sevenDayResetAtMinutes: 3_840,
  },
  cost: {
    totalUsd: 0.42,
    durationMs: 873_000,
    linesAdded: 412,
    linesRemoved: 88,
  },
  git: {
    branch: "main",
    dirty: false,
    ahead: 3,
    behind: 0,
    untrackedFiles: 0,
    modifiedFiles: 0,
    pushPendingCount: 3,
  },
  todos: [
    { content: "Write the spec", status: "completed" },
    { content: "Build preview engine", status: "completed" },
    { content: "Implement editor tabs", status: "in_progress" },
    { content: "Hook up URL sharing", status: "pending" },
    { content: "Deploy to GitHub Pages", status: "pending" },
  ],
  tools: [
    { name: "Read", target: "src/App.vue" },
    { name: "Edit", target: "src/style.css" },
    { name: "Bash" },
  ],
  skills: ["brainstorming", "systematic-debugging"],
  mcpServers: ["chrome-devtools", "context7"],
  agents: [{ type: "explore", status: "running" }],
  advisorModel: "claude-opus-4-7",
  memory: {
    usedPercent: 31,
    usedGb: 9.9,
    totalGb: 32,
  },
  environment: {
    claudeMdCount: 4,
    rulesCount: 2,
    mcpCount: 2,
    hooksCount: 1,
  },
  session: {
    durationLabel: "14m 33s",
    lastResponseAgoLabel: "12s",
    startedAtLabel: "14:46",
    compactionCount: 2,
  },
  effort: {
    level: "high",
    symbol: "◆",
  },
  outputStyle: "default",
  claudeCodeVersion: "2.1.119",
  promptCache: {
    activeUntilMs: 240_000,
    ttlSeconds: 300,
  },
};
