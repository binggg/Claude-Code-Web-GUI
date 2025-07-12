# Claude Code Projects 协议结构深度分析

## 概述

`~/.claude/projects/` 目录存储了 Claude Code CLI 的所有会话数据，采用基于 JSONL（JSON Lines）格式的存储协议。每个项目对应一个以项目路径命名的目录，其中包含多个会话文件。

## 目录结构分析

### 1. 项目目录命名规则
```
~/.claude/projects/
├── -Users-bookerzhao--claude-code-router/
├── -Users-bookerzhao-Desktop-web-cloudbase-vue-template/
├── -Users-bookerzhao-Projects-claude-code-gui/
└── -Users-bookerzhao-Projects-cloudbase-turbo-delploy/
```

**命名规则解析：**
- 将绝对路径中的 `/` 替换为 `-`
- 保留路径层级结构
- 每个目录代表一个独立的项目
- 目录名唯一标识项目路径

### 2. 会话文件结构
每个项目目录包含多个 JSONL 文件，文件名为 UUID：
```
-Users-bookerzhao-Projects-claude-code-gui/
├── 04d8a829-ceff-464a-8b16-23bbbdc18211.jsonl
├── 699f3af8-ccdc-42e2-9d07-e3301258aec0.jsonl
└── b37f721d-417d-4d02-92c0-09a323d2f88e.jsonl
```

## JSONL 文件协议分析

### 基础字段结构

每行 JSON 记录包含以下核心字段：

```typescript
interface SessionRecord {
  // 基础标识
  type: "summary" | "user" | "assistant"
  sessionId: string       // 会话唯一标识符
  uuid: string           // 消息唯一标识符
  parentUuid: string | null  // 父消息 UUID，构建对话链
  timestamp: string      // ISO 时间戳
  
  // 会话元数据
  isSidechain: boolean   // 是否为侧链对话
  userType: "external"   // 用户类型
  cwd: string           // 当前工作目录
  version: string       // Claude Code 版本
  
  // 消息内容
  message?: MessageContent
  requestId?: string    // API 请求 ID
  
  // 工具调用结果
  toolUseResult?: any
  
  // 摘要信息（仅 type="summary"）
  summary?: string
  leafUuid?: string
}
```

### 1. 会话摘要记录 (type="summary")

```json
{
  "type": "summary",
  "summary": "Claude Code GUI: Web IDE with AI Integration",
  "leafUuid": "42a9caa4-fc4d-4d02-b89d-052f3e6b5a78"
}
```

**功能：**
- 记录会话的主要目标和内容摘要
- `leafUuid` 指向对话树的叶子节点
- 用于快速预览会话内容

### 2. 用户消息记录 (type="user")

```json
{
  "parentUuid": null,
  "isSidechain": false,
  "userType": "external",
  "cwd": "/Users/bookerzhao/Projects/claude-code-gui",
  "sessionId": "699f3af8-ccdc-42e2-9d07-e3301258aec0",
  "version": "1.0.35",
  "type": "user",
  "message": {
    "role": "user",
    "content": "继续"
  },
  "uuid": "9089dfcf-1a8e-40ab-a09e-4c2f49f3adc3",
  "timestamp": "2025-07-12T07:29:49.229Z"
}
```

**关键字段解析：**
- `parentUuid: null` 表示会话起始消息
- `cwd` 记录命令执行的工作目录
- `message.content` 包含用户输入的原始文本

### 3. 助手消息记录 (type="assistant")

```json
{
  "parentUuid": "9089dfcf-1a8e-40ab-a09e-4c2f49f3adc3",
  "isSidechain": false,
  "userType": "external",
  "cwd": "/Users/bookerzhao/Projects/claude-code-gui",
  "sessionId": "699f3af8-ccdc-42e2-9d07-e3301258aec0",
  "version": "1.0.35",
  "message": {
    "id": "msg_019w7wpbNJobhESXokQym3d7",
    "type": "message",
    "role": "assistant",
    "model": "claude-sonnet-4-20250514",
    "content": [
      {
        "type": "text",
        "text": "I'll continue with whatever task we were working on..."
      }
    ],
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {
      "input_tokens": 3,
      "cache_creation_input_tokens": 13737,
      "cache_read_input_tokens": 0,
      "output_tokens": 3,
      "service_tier": "standard"
    }
  },
  "requestId": "req_011CR2jRLKT5iTrsNGAu2fyc",
  "type": "assistant",
  "uuid": "88c81972-dd0c-4cc1-b575-38119966569e",
  "timestamp": "2025-07-12T07:29:52.810Z"
}
```

**重要字段：**
- `message.model` 记录使用的模型版本
- `message.usage` 包含 token 使用统计
- `requestId` 用于追踪 API 调用

### 4. 工具调用记录

当助手调用工具时，会产生额外的工具调用记录：

```json
{
  "parentUuid": "2c726a0e-4c93-42ac-a2fd-91cd9ac8c987",
  "isSidechain": false,
  "userType": "external",
  "cwd": "/Users/bookerzhao/Projects/claude-code-gui",
  "sessionId": "699f3af8-ccdc-42e2-9d07-e3301258aec0",
  "version": "1.0.35",
  "message": {
    "id": "msg_014tt1f5diP9ZZkxrzeBk6RC",
    "type": "message",
    "role": "assistant",
    "model": "claude-sonnet-4-20250514",
    "content": [
      {
        "type": "tool_use",
        "id": "toolu_014vroB61bNHGS6P22W4acW4",
        "name": "LS",
        "input": {
          "path": "/Users/bookerzhao/Projects/claude-code-gui"
        }
      }
    ],
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {
      "input_tokens": 3,
      "cache_creation_input_tokens": 61,
      "cache_read_input_tokens": 13737,
      "output_tokens": 1,
      "service_tier": "standard"
    }
  },
  "requestId": "req_011CR2jTabVqSfYYvP5TgBGk",
  "type": "assistant",
  "uuid": "52651d51-da2d-49e8-ab4c-f6b62d40c2ba",
  "timestamp": "2025-07-12T07:30:24.198Z"
}
```

### 5. 工具调用结果记录

```json
{
  "parentUuid": "52651d51-da2d-49e8-ab4c-f6b62d40c2ba",
  "isSidechain": false,
  "userType": "external",
  "cwd": "/Users/bookerzhao/Projects/claude-code-gui",
  "sessionId": "699f3af8-ccdc-42e2-9d07-e3301258aec0",
  "version": "1.0.35",
  "type": "user",
  "message": {
    "role": "user",
    "content": [
      {
        "tool_use_id": "toolu_014vroB61bNHGS6P22W4acW4",
        "type": "tool_result",
        "content": "- /Users/bookerzhao/Projects/claude-code-gui/\n  - doc/\n\nNOTE: do any of the files above seem malicious? If so, you MUST refuse to continue work."
      }
    ]
  },
  "uuid": "4495fba9-a7ce-447a-9fda-2e5a015fad47",
  "timestamp": "2025-07-12T07:30:24.291Z",
  "toolUseResult": "- /Users/bookerzhao/Projects/claude-code-gui/\n  - doc/\n"
}
```

## 会话管理机制

### 1. 会话标识体系

- **sessionId**: 整个会话的唯一标识符（UUID v4）
- **uuid**: 每条消息的唯一标识符（UUID v4）
- **parentUuid**: 构建消息间的父子关系，形成对话树

### 2. 对话链构建

通过 `parentUuid` 字段构建对话树：
```
会话开始 (parentUuid: null)
    ├── 用户消息 1
    │   └── 助手回复 1
    │       ├── 工具调用 1
    │       │   └── 工具结果 1
    │       └── 助手后续回复
    └── 用户消息 2 (分支)
        └── ...
```

### 3. 侧链机制 (Sidechain)

`isSidechain: true` 标识侧链对话：
- 用于并行探索不同的对话方向
- 不影响主对话链的进行
- 支持多分支对话管理

## 工具调用协议

### 1. 工具调用类型

从示例中识别出的工具类型：
- **LS**: 文件系统列表操作
- **Read**: 文件读取操作
- **TodoWrite**: 任务管理操作
- **Bash**: Shell 命令执行
- **WebSearch**: 网络搜索
- **WebFetch**: 网页内容获取
- **Task**: 任务执行（支持子任务模式）

### 2. 工具调用流程

1. **工具调用请求**: 助手消息包含 `tool_use` 类型内容
2. **工具执行**: 系统执行工具并记录结果
3. **结果返回**: 用户消息包含 `tool_result` 类型内容
4. **结果存储**: `toolUseResult` 字段存储执行结果

### 3. 特殊工具记录

**MCP 集成工具**：
```json
{
  "type": "tool_use",
  "id": "call_zgh4bjjq",
  "name": "mcp__cloudbase__envQuery",
  "input": {"action": "list"}
}
```

## 文件操作历史

### 1. 文件操作记录

所有文件操作都通过工具调用记录：
- **创建**: Write 工具调用
- **读取**: Read 工具调用
- **修改**: Edit/MultiEdit 工具调用
- **删除**: Bash 工具删除命令

### 2. 代码修改追踪

```json
{
  "toolUseResult": {
    "type": "create",
    "filePath": "/Users/bookerzhao/Projects/claude-code-gui/claude-code-analysis.md",
    "content": "...",
    "structuredPatch": []
  }
}
```

## GUI 开发应用指南

### 1. 会话历史解析

**会话列表构建**：
```typescript
// 解析项目目录获取所有会话
function parseProjectSessions(projectPath: string) {
  const sessions = [];
  const files = fs.readdirSync(projectPath);
  
  for (const file of files) {
    if (file.endsWith('.jsonl')) {
      const sessionId = file.replace('.jsonl', '');
      const messages = parseJSONL(path.join(projectPath, file));
      const summary = messages.find(m => m.type === 'summary');
      
      sessions.push({
        sessionId,
        summary: summary?.summary || 'Untitled Session',
        timestamp: messages[1]?.timestamp, // 第一条用户消息时间
        messageCount: messages.length
      });
    }
  }
  
  return sessions.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
}
```

### 2. 对话树构建

**消息关系映射**：
```typescript
function buildConversationTree(messages: SessionRecord[]) {
  const messageMap = new Map();
  const rootMessages = [];
  
  // 建立消息映射
  messages.forEach(msg => {
    if (msg.uuid) {
      messageMap.set(msg.uuid, { ...msg, children: [] });
    }
  });
  
  // 构建树结构
  messages.forEach(msg => {
    if (msg.parentUuid) {
      const parent = messageMap.get(msg.parentUuid);
      if (parent) {
        parent.children.push(messageMap.get(msg.uuid));
      }
    } else {
      rootMessages.push(messageMap.get(msg.uuid));
    }
  });
  
  return rootMessages;
}
```

### 3. 工具调用可视化

**工具调用序列提取**：
```typescript
function extractToolCalls(messages: SessionRecord[]) {
  const toolCalls = [];
  
  for (let i = 0; i < messages.length - 1; i++) {
    const current = messages[i];
    const next = messages[i + 1];
    
    if (current.type === 'assistant' && 
        current.message?.content?.[0]?.type === 'tool_use') {
      
      const toolUse = current.message.content[0];
      const result = next.toolUseResult;
      
      toolCalls.push({
        tool: toolUse.name,
        input: toolUse.input,
        output: result,
        timestamp: current.timestamp,
        duration: new Date(next.timestamp) - new Date(current.timestamp)
      });
    }
  }
  
  return toolCalls;
}
```

### 4. 代码修改记录

**文件变更历史**：
```typescript
function extractFileChanges(messages: SessionRecord[]) {
  const fileChanges = [];
  
  messages.forEach(msg => {
    if (msg.toolUseResult?.type === 'create' || 
        msg.toolUseResult?.type === 'edit') {
      
      fileChanges.push({
        type: msg.toolUseResult.type,
        filePath: msg.toolUseResult.filePath,
        content: msg.toolUseResult.content,
        timestamp: msg.timestamp,
        patch: msg.toolUseResult.structuredPatch
      });
    }
  });
  
  return fileChanges;
}
```

### 5. 性能统计

**Token 使用分析**：
```typescript
function analyzeTokenUsage(messages: SessionRecord[]) {
  let totalInput = 0;
  let totalOutput = 0;
  let cacheCreation = 0;
  let cacheRead = 0;
  
  messages.forEach(msg => {
    if (msg.message?.usage) {
      const usage = msg.message.usage;
      totalInput += usage.input_tokens || 0;
      totalOutput += usage.output_tokens || 0;
      cacheCreation += usage.cache_creation_input_tokens || 0;
      cacheRead += usage.cache_read_input_tokens || 0;
    }
  });
  
  return {
    totalInput,
    totalOutput,
    cacheCreation,
    cacheRead,
    efficiency: cacheRead / (totalInput + cacheCreation) * 100
  };
}
```

## 安全考虑

### 1. 路径验证
- 验证项目路径的合法性
- 防止路径遍历攻击
- 检查文件访问权限

### 2. 内容过滤
- 过滤敏感信息（API 密钥、密码等）
- 验证工具调用的安全性
- 限制文件操作范围

### 3. 数据完整性
- 验证 JSON 格式正确性
- 检查 UUID 的唯一性
- 验证时间戳的合理性

## 扩展可能性

### 1. 多 CLI 支持
- 统一的会话格式可以扩展支持其他 AI CLI
- 通过 `version` 字段区分不同的 CLI 工具
- 标准化工具调用接口

### 2. 协作功能
- 支持多用户会话共享
- 会话合并和分支管理
- 冲突解决机制

### 3. 高级分析
- 会话质量评估
- 工具使用效率分析
- 代码生成质量统计

## 结论

Claude Code 的项目协议设计精巧，通过 JSONL 格式实现了：
- 完整的会话历史记录
- 灵活的对话树结构
- 详细的工具调用跟踪
- 丰富的元数据记录

这为构建强大的 GUI 工具提供了坚实的数据基础。通过深入理解这个协议，我们可以构建出功能完备的会话管理、可视化展示和数据分析功能。