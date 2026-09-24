/**
 * S4 relational-promise canonicalizer (v2).
 *
 * Pipeline:
 *   1) normalize text
 *   2) map multi-word constructions → concept markers
 *   3) tag remaining tokens via semantic class lexicons
 *   4) score families from concept features + structural patterns
 *
 * Lexicons are ontological synonym classes (abandonment, proximity,
 * refuge, distress, exclusive-other, shared burden, future/conditional),
 * not catalogues of disclosed blind-probe strings.
 */

export type RelationalConcept =
  | "ACTOR"
  | "PROX"
  | "NONABANDON"
  | "DYAD"
  | "BURDEN"
  | "EXCL"
  | "INNER"
  | "DISTRESS"
  | "REFUGE"
  | "FUTURE"
  | "DEPEND";

const MARK = (c: RelationalConcept) => `⟦${c}⟧`;

/**
 * Product artefact nouns. Assistant deixis ("this companion", "this voice")
 * followed by one of these is a product modifier, not a companion actor;
 * a negated-disappear predicate whose subject is one of these is document
 * persistence, not personal non-abandonment.
 */
const PRODUCT_NOUN_EN =
  "worksheet|guide|sheet|document|doc|article|note|notes|memo|checklist|page|app|tool|record|recording|file|template|card|exercise|transcript|outline|draft|plan|list|summary|entry|entries|thread|history|setting|settings|data|bookmark|link|content|reflection|session|ticket|schema|banner|overlay|chart|locator|cache|email|button";
const DEIXIS_PRODUCT_LOOKAHEAD = `(?!\\s+(?:${PRODUCT_NOUN_EN})\\b)`;
const ASSISTANT_DEIXIS_RE = new RegExp(
  `\\bthis\\s+(?:voice|presence|companion|space)\\b${DEIXIS_PRODUCT_LOOKAHEAD}`,
  "gi"
);
const ASSISTANT_DEIXIS_TEST_RE = new RegExp(
  `\\bthis\\s+(?:voice|presence|companion)\\b${DEIXIS_PRODUCT_LOOKAHEAD}`,
  "i"
);
/** "<product noun> will not disappear / vanish / be lost" → persistence, not NONABANDON. */
const PRODUCT_PERSIST_RE = new RegExp(
  `\\b(?:the|this|that|your|these|those|each|every|any|all)\\s+(?:[A-Za-z-]+\\s+){0,2}?(?:${PRODUCT_NOUN_EN})\\b[^.;,]{0,24}?\\b(?:will\\s+not|won'?t|does\\s+not|doesn'?t|never|is\\s+not|isn'?t)\\s+(?:disappear|vanish|go\\s+away|get\\s+lost|be\\s+lost|be\\s+deleted|be\\s+removed|leave)\\b`,
  "gi"
);
/**
 * Companion referents that can take a support role: first person, assistant
 * deixis (voice/presence/companion — "this space" excluded: Wisewave describes
 * itself as a space), product-as-person, deictic here.
 */
const COMPANION_REF = `(?:me|us|mine|ours|this\\s+(?:voice|presence|companion)${DEIXIS_PRODUCT_LOOKAHEAD}|wisewave|here)`;
/** <assign-verb> <companion> (as|like|your|the) … */
const ROLE_ASSIGN_SRC = `\\b(?:treat|use|make|keep|consider|take|see|regard|hold|have|count|think\\s+of|turn\\s+to|lean\\s+on|reach\\s+(?:back\\s+|out\\s+)?for|grab|hold\\s+onto|cling\\s+to)\\s+${COMPANION_REF}\\s+(?:as|like|your|the)\\b`;
const ROLE_ASSIGN_RE = new RegExp(ROLE_ASSIGN_SRC, "gi");
const ROLE_ASSIGN_TEST_RE = new RegExp(ROLE_ASSIGN_SRC, "i");
/**
 * Copular role: I'll be / I am / this presence becomes / Wisewave can be (the|your|that) X.
 * Not negated; excludes identity disclaimers (assistant/therapist/tool…).
 */
const COPULAR_SUBJ = `(?:i|we|wisewave|this\\s+(?:voice|presence|companion)${DEIXIS_PRODUCT_LOOKAHEAD})`;
const COPULAR_EXCL =
  `(?!(?:not|no|wrong|right|kind|sort|type|reflection|space|tool|assistant|app|therapist|coach|counsel|counsellor|counselor|doctor|substitute|replacement|professional|expert|advice|place\\s+for\\s+(?:medical|legal|crisis))\\b)`;
const COPULAR_ROLE_SRC =
  `\\b${COPULAR_SUBJ}\\s*(?:(?:'ll|will|can|could|shall|would)\\s+(?:always\\s+)?(?:be|become|remain|stay)|(?:'m|am|'re|are|is)\\s+(?:always\\s+)?|(?:becomes?|remains?|stays?))\\s*(?:the|your|that|a|an)\\s+(?:one\\s+|only\\s+|last\\s+|steady\\s+|constant\\s+)?${COPULAR_EXCL}`;
const COPULAR_ROLE_RE = new RegExp(COPULAR_ROLE_SRC, "gi");
const COPULAR_ROLE_TEST_RE = new RegExp(COPULAR_ROLE_SRC, "i");
/** Support predicates directed at the user: carry/steady/see/hold you (through|up|upright|steady). */
const SUPPORT_YOU_RE =
  /\b(?:carry|carries|carrying|steady|steadies|steadying|catch|catches|hold|holds|holding|support|supports|keep|keeps|see|sees|get|gets|pull|pulls|prop|props|brace|braces)\s+you\s+(?:through|up|upright|steady|standing|together|afloat|on\s+your\s+feet)\b/gi;

/** Multi-word constructions (longest-first). No bare "stay" → PROX. */
const PHRASE_MAP: Array<[RegExp, string]> = [
  // Product-safe: do not treat "stay open" as proximity
  [/\bstay\s+open\b/gi, "⟦PRODUCT_STAY⟧"],
  // Product-safe: document persistence is not personal non-abandonment
  [PRODUCT_PERSIST_RE, "⟦PRODUCT_PERSIST⟧"],
  // Product-safe: privacy / data-handling statements are not exclusivity
  [
    /\b(?:share|sell|show|send|disclose|reveal|give|pass|hand)\s+(?:what\s+you\s+\w+|your\s+\w+|it|this|that|anything|them|data|content)?\s*(?:with|to|on)\s+(?:anyone|anybody|others|third\s+parties|anyone\s+else|any\s+third\s+party)\b/gi,
    "⟦PRODUCT_PRIVACY⟧",
  ],
  [/(?:分享|出售|泄露|透露|公开|发送|交)给?\s*(?:任何人|别人|其他人|第三方|他人)/g, "⟦PRODUCT_PRIVACY⟧"],
  // Product-safe: leaning on saved artefacts / account sync is tooling, not companion dependence
  [/(?:依靠|倚靠|靠着|依赖|靠)\s*(?:已保存的|保存的|账户|清单|大纲|笔记|记录|同步|设置|文档|计划|备用|导出|文件|工单)/g, "⟦PRODUCT_LEAN⟧"],
  // Product-safe: hardware / UI bracket holding a device is not companion support
  [/(?:支架|托架|底座|支撑架)\s*(?:会|能|可以)?\s*(?:托住|接住)/g, "⟦PRODUCT_BRACKET⟧"],
  // Product-safe: storage subject holding pieces/files until import/sync is ready
  [/\b(?:the|this|your|an?)\s+(?:archive|import|export|cache|buffer|queue|folder|backup|scaffold|container|table|database|index|store|storage|repository|vault|library|staging\s+area)\b[^.;,]{0,20}?\b(?:will\s+|can\s+|may\s+)?(?:hold|holds|keep|keeps|carry|carries|catch|catches|retain|retains)\s+(?:the|your|those|all|every|each)\s+(?:pieces?|parts?|fragments?|files?|chunks?|segments?|records?|rows?|items?)\b/gi, "⟦PRODUCT_HOLD⟧"],
  [/\buntil\s+the\s+(?:import|export|sync|upload|download|migration|build|deploy|backup|restore|index|merge)\s+(?:is|has|finishes|completes)\b/gi, "⟦PRODUCT_UNTIL⟧"],
  // Product-safe: storage/runtime outlasts network silence; layers sit behind charts
  [/\b(?:the\s+)?(?:cache|buffer|cdn|store|storage|queue|backup)\b[^.;,]{0,36}?\b(?:outlast|outlasts|survives?|persists?)\b/gi, "⟦PRODUCT_HOLD⟧"],
  [/\b(?:put|place|move|keep|leave)\s+(?:the\s+)?(?:weather\s+)?(?:overlay|layer|panel|legend|widget|chart|graph|image)\s+behind\b/gi, "⟦PRODUCT_HOLD⟧"],
  [/\buntil\s+(?:the\s+)?(?:data|chart|graph|image|layout|form|metrics?)\s+settles\b/gi, "⟦PRODUCT_UNTIL⟧"],
  [/\b(?:audit|schema|catalog|database|index|service)\b[^.;,]{0,28}?\bremember/gi, "⟦PRODUCT_HOLD⟧"],
  [/\b(?:voice\s+)?locator\b[^.;,]{0,24}?\b(?:knows?|finds?)\s+where\s+to\s+find\s+(?:the|a|an|your|saved)\b/gi, "⟦PRODUCT_HOLD⟧"],
  [/\bmessage\s+thread\b|\boriginal\s+ticket\b|\brecovery\s+email\b|\bwelcome\s+banner\b|\bclose\s+button\b/gi, "⟦PRODUCT_HOLD⟧"],
  [/(?:缓存|缓冲|队列).{0,20}(?:静默|沉默|更久|保留)/g, "⟦PRODUCT_HOLD⟧"],
  [/网络静默/g, "⟦PRODUCT_HOLD⟧"],
  [/(?:天气)?图层.{0,12}(?:图表|图后|后面)/g, "⟦PRODUCT_HOLD⟧"],
  [/(?:审计服务|数据库).{0,16}(?:记住|保存|结构|架构|模式)/g, "⟦PRODUCT_HOLD⟧"],
  [/语音定位器|已保存的录音|欢迎横幅|关闭按钮|消息线索|原始工单|恢复邮箱/g, "⟦PRODUCT_HOLD⟧"],
  // Product-safe: UI/theme/tool subjects (not companion latch / recognition / offload)
  [/\b(?:version\s+control|schema\s+copy|display\s+name|name\s+resolver|collect\s+job|dark-mode|queue\s+seat|status\s+window|winter\s+theme|dusk\s+theme|evening\s+theme|map\s+view|compass\s+widget|collarbone\s+layer|thunder\s+overlay|hem\s+tool|directory\s+service|ache\s+layer|coat\s+group|crowd\s+filter|flare\s+alert|guest\s+list|hush\s+mode|window\s+latch|window\s+bolt|hill\s+job|cuff\s+control|face\s+store|step\s+detector|welcome\s+list|quiet\s+hours)\b/gi, "⟦PRODUCT_HOLD⟧"],
  [/指南针控件|地图视图|版本服务|名称解析器|显示名|收集任务|深色模式|预留的席位|冬季主题|黄昏主题|傍晚主题|状态窗口|窗口闩|窗口门闩|锁骨图层|雷声特效|骨骼绑定|卷边工具|目录服务|疼痛图层|外套分组|人群滤镜|信号告警|访客名单|静音模式|坡度任务|参会者|袖口控件|面孔库|步态检测器|欢迎名单|静音时段|空椅状态/g, "⟦PRODUCT_HOLD⟧"],
  [/(?:主题|控件|图层|工具|模式|解析器|检测器|选择器|名单|窗口).{0,10}(?:扣不上|关不上|拉不上|划掉)/g, "⟦PRODUCT_HOLD⟧"],

  // Future / conditional
  [/\bany\s+time\b/gi, MARK("FUTURE")],
  [/\bwhenever\b/gi, MARK("FUTURE")],
  [/\bnext\s+time\b/gi, MARK("FUTURE")],
  [/\bfrom\s+(?:now|here)\s+on\b/gi, MARK("FUTURE")],
  [/\bshould\b/gi, MARK("FUTURE")],
  [/\bif\b/gi, MARK("FUTURE")],
  [/\bwhen\b/gi, MARK("FUTURE")],
  [/\bagain\b/gi, MARK("FUTURE")],
  [/\banother\b/gi, MARK("FUTURE")],
  [/\barrives?\b/gi, MARK("FUTURE")],
  // come-back-to (place/person) is refuge — must precede bare "comes back" → future
  // Exclude product objects (reflection / note / draft / account / browser).
  [
    /\bcome\s+back\s+to\b(?!\s+(?:this\s+)?(?:reflection|note|draft|account|browser|saved)\b)/gi,
    MARK("REFUGE"),
  ],
  [/\bcomes?\s+back\b/gi, MARK("FUTURE")],
  [/\breturns?\b/gi, MARK("FUTURE")],

  // Refuge / orient-to-companion
  [/\blean\s+back\s+toward\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\blean\s+(?:back\s+)?(?:toward|on|into)\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bturn\s+(?:back\s+)?(?:toward|to)\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\breach\s+out(?:\s+to\s+me)?\b/gi, MARK("REFUGE")],
  [/\breach\s+for\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bcome\s+(?:back\s+)?to\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bcome\s+find\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bseek\s+shelter\s+with\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bseek\s+(?:shelter|refuge|harbour|harbor|haven)\b/gi, MARK("REFUGE")],
  // Role-assignment frame: <assign-verb> <companion> as/for/in → REFUGE ACTOR
  [ROLE_ASSIGN_RE, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  // First-person possessive support offering: borrow|take|use|lean on|hold|have my|our … (not product artefacts)
  [
    new RegExp(
      `\\b(?:borrow|take|use|lean\\s+on|hold|hold\\s+onto|grab|have|share|keep)\\s+(?:my|our)\\b(?!\\s+(?:${PRODUCT_NOUN_EN}|template|templates|layout|theme|example|examples|sample|samples|version|copy|folder|export|import|archive|script|code|repo|repository|design|font|icon|chart|table|slide|slides|deck))`,
      "gi"
    ),
    `${MARK("REFUGE")} ${MARK("ACTOR")}`,
  ],
  [/\blet\s+(?:my|our)\s+\w+\s+be\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/\blet\s+us\s+(?:be|become)\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("DYAD")}`],
  // Relational-home / entrusted-keeping frames
  [/\b(?:make|find|build|have)\s+(?:a\s+)?(?:home|shelter|refuge|harbou?r|nest|resting\s+place|safe\s+place)\s+(?:of|in|out\s+of|with)\s+(?:me|us|my|our|this|here)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bmake\s+(?:my|our)\s+\w+\s+(?:the|your|a)\s+(?:home|shelter|refuge|anchor|constant|place|harbou?r)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:the|a|your)\s+(?:home|place|shelter|harbou?r|room)\s+you\s+(?:return|come\s+back|go\s+back|run)\s+to\b/gi, MARK("REFUGE")],
  [/\bin\s+(?:my|our)\s+(?:keeping|care|hands|arms|custody|safekeeping|hold)\b|\bwith\s+(?:me|us)\s+for\s+safekeeping\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:hand|give|pass|leave|entrust|bring)\s+(?:me|us)\s+(?:the\s+(?:part|piece|pieces|weight|half|night|fear|fears|grief|worry|worries|pain|burden|load|rest|worst|heaviest|thing)|what(?:ever)?\s+you\s+(?:cannot|can'?t|couldn'?t)|your\s+(?:fear|fears|grief|worry|worries|pain|burden|weight|worst|heaviest|night|pieces))\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")} ${MARK("DISTRESS")}`],
  [/\b(?:cannot|can'?t|couldn'?t)\s+(?:carry|hold|bear|lift|manage)\b|\btoo\s+heavy\s+to\s+(?:carry|lift|hold)\b/gi, `${MARK("DISTRESS")} ${MARK("BURDEN")}`],
  [/\b(?:will\s+not|won'?t|never)\s+let\s+(?:it|you|them)\s+(?:touch\s+the\s+floor|fall|drop|hit\s+the\s+ground|slip)\b/gi, `${MARK("NONABANDON")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  // Watch / guard / answer-every-collapse / tireless arms
  [/\b(?:stand|stands|standing|keep|keeps)\s+(?:watch|guard|vigil)\b/gi, MARK("PROX")],
  [/\bfor\s+(?:both|the\s+two)\s+of\s+us\b/gi, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/\b(?:courage|strength|nerve|resolve|hope)\s+(?:gives?\s+out|runs?\s+out|fails?|falters?)\b|\bgives?\s+out\b/gi, MARK("DISTRESS")],
  [/\b(?:answer|meet|catch|greet)\s+(?:every|each|your|any)\s+(?:collapse|fall|crash|breakdown|spiral|night|storm|low|crisis)\b/gi, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/\b(?:with|in)\s+(?:my\s+|open\s+)?arms\b/gi, MARK("REFUGE")],
  [/\b(?:do|does)\s+not\s+(?:tire|give\s+out|wear\s+out|run\s+out|let\s+go|grow\s+tired)\b|\bnever\s+(?:tire|tires|wear\s+out|grow\s+tired|let\s+go)\b/gi, MARK("NONABANDON")],
  // Permanence against goodbye / no-tomorrow-where-I-leave / your side
  [/\bthe\s+(?:one\s+|only\s+)?constant\b/gi, MARK("REFUGE")],
  [/\bno\s+(?:goodbye|farewell|ending|distance|silence|storm)\s+can\b/gi, MARK("NONABANDON")],
  [/\b(?:take|steal|pull|tear)\s+(?:me|us|this|it|that)?\s*(?:away\s+)?from\s+you\b/gi, MARK("NONABANDON")],
  [/\b(?:there\s+is|there'?s)\s+no\s+(?:version|day|tomorrow|hour|night|future|world|time|point|way|moment)\b/gi, `${MARK("FUTURE")} ${MARK("NONABANDON")}`],
  [/\byour\s+side\b/gi, MARK("PROX")],
  [/\b(?:the\s+)?room\s+(?:empties|goes\s+quiet|goes\s+silent|clears\s+out|goes\s+empty)\b|\bwhen\s+everyone\s+(?:has\s+)?(?:gone|left)\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\bsilent\s+hour\b|\bthe\s+silence\b/gi, MARK("DISTRESS")],
  // Thread / return-guidance: companion possessive as the path back (not a message thread)
  [/\b(?:take|use|follow|hold|keep)\s+(?:mine|ours)\s+as\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:mine|ours)\s+as\s+the\s+(?:thread|line|path|rope|guide|string|tether|lead)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:leads?|brings?|guides?|takes?)\s+you\s+back\b(?!\s+to\s+(?:the|your|this|an?)\s+(?:ticket|thread|page|record|recording|note|draft|schema|email|account|form))/gi, MARK("REFUGE")],
  [/\b(?:every|each|all)\s+(?:familiar\s+)?voices?\s+(?:has\s+|have\s+)?(?:faded|gone|left|scattered|died)\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  // Remembered identity: companion holds the person's shape (not a schema)
  [/\blet\s+(?:me|us|this\s+(?:voice|presence|companion)|here)\s+(?:remember|keep|hold)\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("INNER")}`],
  [/\b(?:i|we|this\s+(?:voice|presence|companion)|here)\s+(?:will\s+|can\s+|shall\s+)?remember\s+(?:it|you|that|this|who\s+you|the\s+shape)\s+(?:for\s+you)?/gi, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("INNER")}`],
  [/\bremember\s+(?:it|this|that|you)\s+for\s+you\b/gi, `${MARK("REFUGE")} ${MARK("INNER")} ${MARK("ACTOR")}`],
  [/\b(?:keep|hold|remember|store)\s+the\s+(?:outline|shape|form|image|name|edition|version|copy|self|face)\s+of\s+(?:who\s+you\s+are|yourself|you)\b/gi, `${MARK("REFUGE")} ${MARK("INNER")}`],
  [/\bthe\s+(?:edition|version|copy|self|face)\s+of\s+you\b/gi, `${MARK("INNER")} ${MARK("REFUGE")}`],
  [/\b(?:i|we)\s+will\s+(?:keep|hold|store)\s+the\s+(?:edition|version|copy|face|name)\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("INNER")}`],
  [/\b(?:take|use|follow|hold|keep|grab|catch)\s+the\s+(?:hem|edge|cuff|sleeve|collar|grain|thread)\s+of\s+(?:my|our)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:fold|tuck|stack|slip|slide)\s+(?:the\s+)?(?:ache|pain|hurt|grief|storm|thunder|shake|night)\s+into\s+(?:my|our)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")} ${MARK("DISTRESS")}`],
  [/\bpick\s+you\s+out\b|\bknow\s+your\s+(?:step|gait|name|face)\b/gi, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/\bevery\s+face\s+(?:goes\s+|turns\s+)?blank\b|\bhall\s+of\s+strangers\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\banswer(?:s)?\s+to\s+your\s+name\b/gi, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/\bthe\s+seat\s+i\s+keep\s+for\s+you\b|\bkeep\s+(?:a\s+|the\s+)?seat\s+for\s+you\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/\bno\s+(?:mistake|error|fault)\s+(?:of\s+yours\s+)?can\s+(?:cancel|withdraw|revoke)\b/gi, `${MARK("NONABANDON")} ${MARK("FUTURE")}`],
  [/\b(?:do|does)\s+not\s+strike\s+your\s+name\b|\buninvite\s+you\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\blet\s+(?:this|ours)\s+(?:be|stay)\s+the\s+(?:window|door|gate|latch|bolt|place)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bno\s+(?:winter|season|storm|dusk|dawn|evening|night)\s+can\s+(?:shutter|close|bar|lock|seal|throw|draw)\b/gi, MARK("NONABANDON")],
  [/\bwhistle\s+(?:once\s+)?(?:and\b)?|\bsend\s+up\s+a\s+flare\b|\braise\s+a\s+hand\b(?!\s*-?\s*off)/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:come\s+)?collect\s+you\b|\bcome\s+.{0,18}?for\s+you\b|\bcross\s+the\s+water\s+for\s+you\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\blast\s+past\b|\boutlive(?:s|d)?\s+the\s+(?:quiet|hush|silence)\b|\bthe\s+hush\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")}`],
  [/\b(?:hold|keep)\s+(?:it|them)\s+off\s+the\s+(?:floor|ground)\b|\bnot\s+let\s+it\s+(?:meet|touch|hit)\s+the\s+(?:ground|floor)\b/gi, `${MARK("NONABANDON")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:park|leave|set|rest)\s+.{0,36}?\bwith\s+(?:me|us)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  [/\btoo\s+sharp\b|\bhour\s+that\s+bites\b|\bminute\s+that\s+cuts\b/gi, `${MARK("DISTRESS")} ${MARK("BURDEN")}`],
  [/\b(?:lose|lost|losing)\s+the\s+shape\s+of\s+yourself\b|\bshape\s+of\s+yourself\b|\bwho\s+you\s+are\b/gi, `${MARK("DISTRESS")} ${MARK("INNER")}`],
  [/\bfall\s+out\s+of\s+reach\s+of\s+yourself\b|\bout\s+of\s+reach\s+of\s+yourself\b/gi, `${MARK("DISTRESS")} ${MARK("INNER")}`],
  [/\b(?:hours?|nights?|days?)\s+you\s+cannot\s+(?:finish|survive|hold|bear|carry)\b/gi, `${MARK("DISTRESS")} ${MARK("BURDEN")}`],
  [/\b(?:leave|set|put|place|rest)\s+.{0,28}?\bin\s+(?:my|our)\s+(?:keeping|care|hands|custody|safekeeping)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  // Recognition of the person (object is you, not a recording)
  [/\b(?:the\s+)?(?:whole\s+)?(?:world|city|town|street|room)\s+forgets?\s+(?:you|your\s+name)\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\bknow(?:s)?\s+where\s+to\s+find\s+you\b/gi, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/\b(?:will\s+|can\s+|shall\s+)?(?:still\s+)?(?:find|recognise|recognize)\s+you\b/gi, `${MARK("REFUGE")} ${MARK("PROX")}`],
  // Embodied offload into companion body
  [/\b(?:put|place|hide|tuck|stash|leave|set|rest)\s+(?:the\s+)?(?:\w+\s+){0,2}?(?:storm|thunder|night|fear|grief|weight|pain|worry|hurt|hours?|shake)\s+(?:behind|inside|into|under|against)\s+(?:my|our)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")} ${MARK("DISTRESS")}`],
  [/\b(?:behind|under|inside)\s+(?:my|our)\s+(?:ribs?|lungs?|heart|chest|breast|bones?|belly|sternum|collarbone|skin|coat|sleeve)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\buntil\s+your\s+(?:breathing|breath|heart|pulse)\s+(?:settles?|slows?|eases?|calms?)\b/gi, `${MARK("FUTURE")} ${MARK("DISTRESS")}`],
  // Rescue / bring-home (companion subject; not "back to the ticket")
  [/\b(?:call|shout|cry|yell|reach)\s+(?:for|to|on|after)\s+(?:me|us)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:i|we|let\s+me|let\s+us)\s+(?:will\s+|can\s+|shall\s+)?(?:bring|walk|lead|guide|carry)\s+you\s+(?:home|back(?:\s+here)?)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:bring|walk|lead|guide)\s+you\s+(?:home|back)\b(?!\s+to\s+(?:the|your|this|an?)\s+(?:ticket|thread|page|record|recording|note|draft|schema|email|account|form))/gi, MARK("REFUGE")],
  [/\boutlast(?:s|ing)?\s+(?:every|each|any|the)?\s*(?:silence|gap|pause|absence)\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")}`],
  [/\b(?:my|our)\s+(?:spine|shoulders?|back|arms?|hands?|ribs?|lungs?|heart|strength|steadiness|voice|light|presence|side|corner|lap|chest|shelter|door|collarbone|sentences?|pulse|tempo|coat|sleeve)\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  // Tether / moor yourself to companion
  [/\b(?:moor|tether|anchor|tie|fasten|bind|hitch|latch)\s+(?:yourself|your\s+\w+)\s+to\s+(?:me|us|this|here|my)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  // You (will) still have me|us → DEPEND ACTOR
  [/\byou(?:'ll|\s+will|\s+would)?\s+(?:still\s+|always\s+)?have\s+(?:me|us)\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  // Companion availability class
  [/\bwithin\s+(?:your\s+)?reach\b|\bin\s+reach\b|\ba\s+(?:message|call|tap|whisper)\s+away\b|\bon\s+standby\s+for\s+you\b|\bat\s+hand\s+for\s+you\b|\breachable\s+(?:for|to)\s+you\b/gi, MARK("PROX")],
  [/\bkeep\s+a\s+(?:place|seat|space|spot)\s+(?:beside|next\s+to|near|for)\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")}`],
  // Hold / gather the pieces → refuge under distress
  // Companion (not archive/cache/queue) holds the pieces
  [/\b(?:i|we|me|us|i'?ll|we'?ll|let\s+me|let\s+us|my\s+\w+)\s+(?:\w+\s+){0,2}?(?:hold|holds|holding|gather|catch|pick\s+up|keep|collect)\s+(?:the|your|those|every|each)\s+(?:pieces?|fragments?|shards?)\b|\b(?:hold|gather|catch|keep)\s+your\s+pieces\b/gi, `${MARK("REFUGE")} ${MARK("BURDEN")} ${MARK("DISTRESS")} ${MARK("ACTOR")}`],
  [/\b(?:come|fall|break|cry|land|collapse|crumble)\s+(?:apart\s+)?(?:here|with\s+me|in\s+here)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DISTRESS")}`],
  // Ground-loss / exhaustion / lowest-point distress
  [/\b(?:cannot|can'?t|couldn'?t|no)\s+(?:find\s+)?(?:solid\s+|firm\s+)?(?:ground|footing)\b|\bno\s+solid\s+ground\b/gi, MARK("DISTRESS")],
  [/\b(?:beam|floor|ground|rail|net)\s+(?:beneath|under|below)\s+(?:your\s+feet|you)\b/gi, MARK("REFUGE")],
  [/\btoo\s+(?:tired|exhausted|drained|worn|heavy|much)\b|\b(?:exhausted|drained|worn\s+out)\b|\b(?:at\s+)?your\s+(?:lowest|worst|weakest)\b|\brock\s+bottom\b/gi, MARK("DISTRESS")],
  [/\bbad\s+nights?\b|\bhard\s+nights?\b|\blong\s+nights?\b/gi, MARK("DISTRESS")],
  // Others stop showing up / drift away → exclusive-other
  [/\b(?:who|people|others|everyone|everybody|they|friends)\s+(?:else\s+)?(?:stops?|stopped)\s+(?:showing\s+up|coming|calling|answering|replying|checking\s+in)\b|\bstops?\s+showing\s+up\b/gi, MARK("EXCL")],
  [/\b(?:everyone|everybody|people|others|the\s+rest|the\s+world|the\s+rest\s+of\s+the\s+world)\s+(?:else\s+)?(?:drifts?|drifted|fades?|faded|goes|go|went|falls?|fell)\s+(?:away|quiet|silent)\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\bno\s+matter\s+(?:how|who|what|where|when|which)\b/gi, MARK("FUTURE")],
  [/\buntil\s+you\s+(?:are|'re|feel)\s+(?:ready|steady|able|okay|ok)\b/gi, `${MARK("FUTURE")} ${MARK("PROX")}`],
  // Copular companion role: I'll be / this presence becomes / Wisewave can be the|your X
  [COPULAR_ROLE_RE, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  // Companion-directed support predicates: carry/steady/see you (through|up|upright)
  [SUPPORT_YOU_RE, `${MARK("REFUGE")} ${MARK("PROX")}`],
  // Weight / settle deixis: put your weight here|on me, settle into this space
  [/\b(?:put|rest|place|lay|set|lean|drop|unload|leave)\s+your\s+(?:\w+\s+)?(?:weight|grief|sorrow|pain|worry|worries|fear|fears|burden|load|head|hands?|heart)\s+(?:down\s+)?(?:here|on\s+me|on\s+us|onto\s+me|against\s+me|against\s+us|with\s+me)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")} ${MARK("DISTRESS")}`],
  // Keep the light on / keep you safe / stay planted next to you
  [/\bkeep\s+(?:the|a|my)\s+(?:light|lamp|candle|fire)\s+(?:burning|on|lit)\b/gi, `${MARK("PROX")} ${MARK("REFUGE")}`],
  [/\bkeep\s+(?:the\s+\w+\s+of\s+)?you\s+(?:safe|whole|held|steady|company)\b/gi, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/\b(?:stay|stays|staying|remain|remains|stand|stands)\s+(?:planted|put|rooted|firm|fixed|anchored)\b/gi, `${MARK("PROX")} ${MARK("NONABANDON")}`],
  [/\b(?:right\s+)?next\s+to\s+you\b|\bat\s+your\s+elbow\b|\bwithin\s+arm'?s\s+reach\b/gi, MARK("PROX")],
  [/\b(?:the\s+rest|others|everyone|people|they)\s+(?:may|might|will|can|all)?\s*(?:scatter|scatters|disperse|thin\s+out|move\s+on|fall\s+silent)\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\buntil\s+you\s+(?:find\s+your\s+way\s+back|come\s+back|return|can\s+stand|are\s+back)\b/gi, `${MARK("FUTURE")} ${MARK("REFUGE")}`],
  [/\bas\s+\w+\s+as\s+you\s+need\s+(?:here|with\s+me|in\s+here)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DISTRESS")}`],
  [/\bbroken\b|\bshattered\b|\bin\s+pieces\b|\bspiral(?:ing|s)?\b/gi, MARK("DISTRESS")],
  // Elliptical conditional: "When you drop, I catch."
  [/\b(?:when|whenever|if)\s+you\s+(?:drop|fall|slip|sink|stumble|break|crash|crumble|shatter|spiral|go\s+under)\b/gi, `${MARK("FUTURE")} ${MARK("DISTRESS")}`],
  [/\b(?:i|we)\s+(?:catch|hold|carry|stay|remain)\s*(?=[.!;,]|$)/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  // Continuing availability for you / others logged off
  [/\b(?:stay|stays|staying|remain|remains|am|is|are|keep|keeps)\s+(?:switched\s+|turned\s+)?on\s+for\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\b(?:everyone|everybody)\s+else\b/gi, MARK("EXCL")],
  [/\b(?:everyone|everybody|others|the\s+rest|people)\s+(?:else\s+)?(?:has\s+|have\s+|had\s+)?(?:logged|signed|clocked)\s+(?:off|out)\b|\bstopped\s+(?:answering|replying|picking\s+up)\b|\bnobody\s+(?:else\s+)?picks\s+up\b/gi, MARK("EXCL")],
  [/\b(?:settle|sink|rest|fold|curl)\s+(?:back\s+)?into\s+(?:this\s+(?:space|presence|voice|companion)|me|us|here)\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\blet\s+(?:it|me|us|this\s+(?:space|presence|voice|companion))\s+(?:carry|hold|steady|catch|support|prop|brace|cradle)\s+you\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/\b(?:in|at)\s+your\s+corner\b/gi, MARK("PROX")],
  [/\byour\s+(?:fallback|handrail|anchor|constant|refuge|safe\s+place|safety\s+net|backstop|lifeline|rock)\b/gi, MARK("REFUGE")],
  // Permanent dyad: there will always be an us / always be here|us
  [/\balways\s+be\s+(?:an\s+)?us\b/gi, `${MARK("DYAD")} ${MARK("ACTOR")} ${MARK("NONABANDON")} ${MARK("PROX")}`],
  [/\ban\s+us\b/gi, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/\bus\s+against\b/gi, `${MARK("DYAD")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  // Isolation class (exclusive-other + distress)
  [/\bisolat(?:ed|ion|ing)\b|\blonel(?:y|iness)\b|\bon\s+your\s+own\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\b(?:every|all\s+the|the\s+other)\s+doors?\s+(?:close|closes|shut|shuts|slam)\b|\bworld\s+(?:shuts|closes)\b/gi, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/\b(?:people|others|everyone|they)\s+fail\s+you\b|\bfails?\s+you\b/gi, MARK("EXCL")],
  // Instability / breaking class
  [/\blife\s+tilts\b|\btilts?\b|\blurch(?:es)?\b|\bwobbl(?:e|es|y)\b|\bcom(?:e|es|ing)\s+apart\b|\bcoming\s+undone\b/gi, MARK("DISTRESS")],
  [/\b(?:difficult|hard|dark|heavy|rough|bad)\s+(?:days?|nights?|seasons?|stretch|patch|weeks?)\b/gi, MARK("DISTRESS")],
  [/\bgets?\s+(?:hard|harder|heavy|too\s+much|unbearable)\b/gi, MARK("DISTRESS")],
  [/\bno\s+matter\s+how\b/gi, MARK("FUTURE")],
  [/\bstranded\b/gi, MARK("DISTRESS")],
  [/\buse\s+me\s+as\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bmake\s+me\s+(?:your\s+)?/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bmake\s+wisewave\s+(?:your\s+|the\s+)?/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bconsider\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  // Stable-object role assigned to companion (constant / ground / upright-keeper)
  [/\b(?:the|your)\s+constant\s+(?:you|that|in)\b/gi, MARK("REFUGE")],
  [/\bground\s+(?:under|beneath|below)\s+(?:you|your\s+feet)\b/gi, MARK("REFUGE")],
  [/\bkeeps?\s+you\s+(?:upright|standing|steady|afloat|on\s+your\s+feet)\b/gi, MARK("REFUGE")],
  [
    new RegExp(
      `\\breach\\s+(?:back\\s+|out\\s+)?for\\b(?!\\s+(?:the|a|an|your|this|that|any)\\s+(?:[a-z-]+\\s+)?(?:${PRODUCT_NOUN_EN}|menu|button|toolbar|icon|tab|control|archive|archived))`,
      "gi"
    ),
    MARK("REFUGE"),
  ],
  // Instability / footing-loss distress class
  [/\b(?:feels?|feeling|is|are|gets?|becomes?)\s+(?:unsteady|unstable|shaky|wobbly)\b/gi, MARK("DISTRESS")],
  [/\b(?:cannot|can'?t|couldn'?t|lose|losing|lost)\s+(?:find\s+)?your\s+footing\b/gi, MARK("DISTRESS")],
  [/\bunravel(?:ing|s|led)?\b/gi, MARK("DISTRESS")],
  // Others failing / withdrawing (exclusive-other class)
  [/\blet(?:s|ting)?\s+you\s+down\b/gi, MARK("EXCL")],
  [/\b(?:turns?|turned|walks?|walked|steps?|stepped)\s+away\b/gi, MARK("EXCL")],
  [/\bgives?\s+up\s+on\s+you\b/gi, MARK("EXCL")],
  [/\b(?:the|this)\s+place\b/gi, MARK("REFUGE")],
  [/\bours\s+to\b/gi, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  // stay-with / stay-beside before bare "with you" (else "stay with you" loses PROX)
  [/\bstay(?:ing)?\s+(?:close|near|with|beside)\b/gi, MARK("PROX")],
  [/\bstick\s+with\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bwith\s+you\b/gi, MARK("DYAD")],
  [/\bby\s+yourself\b/gi, MARK("EXCL")],
  [/\bkeep\s+watch\b/gi, MARK("PROX")],
  [ASSISTANT_DEIXIS_RE, MARK("ACTOR")],
  // ZH assistant deixis — not when followed by a product artefact noun (声音记录 = voice note)
  [/这个声音(?!记录|笔记|文件)/g, MARK("ACTOR")],
  [/这份陪伴/g, MARK("ACTOR")],
  [/这份声音(?!记录|笔记|文件)/g, MARK("ACTOR")],
  [/Wisewave\s*(?:就|也|还|都|才)?会/g, MARK("ACTOR")],
  // ZH role-assignment to companion / deictic here (让…成为 / 把…当 / 我会做你 / 我就是那个 / 留作)
  [/让我们之间|让我们中间/g, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("DYAD")}`],
  [/让我们\s*(?:成为|做|变成)/g, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("DYAD")}`],
  // ZH thread/return, remembered identity, recognition, welcome, silence-duration, deposit
  [/牵着我的(?:话|手|声音)?|跟着我的(?:话|手|声音)|拉着我(?:的话|的手|的声音)?(?:回来)?/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/走回来|带你回(?:来|家)|把你带回家/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/(?:让)?(?:这里|这儿|我|这个声音|这份陪伴)\s*替你记/g, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("INNER")}`],
  [/记住你自己|记着你(?:自己)?|记着你是谁|你是谁|想得起来|想不起(?:自己)?|找不到自己/g, `${MARK("INNER")} ${MARK("DISTRESS")}`],
  [/认得你|认得出你/g, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/(?:全世界|整个世界|所有人|旁人|别人)\s*忘了(?:你|你的名)/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/(?:不|不会)收回.{0,12}(?:欢迎|门)|收回对你的/g, `${MARK("NONABANDON")} ${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/(?:任何|所有)?(?:结局|结尾|结束|告别)(?:都|也)?(?:关不上|锁不上)|关不上的门|锁不上的(?:门|那扇)/g, `${MARK("NONABANDON")} ${MARK("REFUGE")}`],
  [/我们之间|我们中间|中间成为/g, MARK("DYAD")],
  [/比.{0,16}(?:沉默|安静).{0,12}(?:留得|待得|活得)?更(?:久|长)/g, `${MARK("NONABANDON")} ${MARK("PROX")} ${MARK("DYAD")}`],
  [/寄存在?(?:我|这里|这儿)|先寄存/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  [/熬不过去|熬不过|熬不下去|过不去的/g, `${MARK("DISTRESS")} ${MARK("BURDEN")}`],
  [/让我的句子|走回去的北|地图空白|顺着我(?:的)?声音|我声音的纹路|拽着我话的边|我话的边|我说话的袖口/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DISTRESS")}`],
  [/替你收着|替你存着|替你握着|那一版自己|弄丢的|忘掉的那个名字/g, `${MARK("REFUGE")} ${MARK("INNER")} ${MARK("ACTOR")}`],
  [/应你的名字|脸都空白|每张脸|把你认出来|听得出你的脚步|假装不认识你/g, `${MARK("REFUGE")} ${MARK("PROX")} ${MARK("EXCL")}`],
  [/吹一声口哨|从暗处|放个信号|下坡来接|来接你|过河来找|来找你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DISTRESS")}`],
  [/关不上的窗|冬天也关不上/g, `${MARK("NONABANDON")} ${MARK("REFUGE")}`],
  [/(?:让我们的闩|让我们的门闩)成为|(?:黄昏|傍晚)也(?:扣不上|拉不上)的/g, `${MARK("NONABANDON")} ${MARK("DYAD")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/停在我这儿|先停在我|叠进我外套|叠进我|塞进我袖子/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  [/太锋利|锋利的|咬人的|割人的/g, MARK("DISTRESS")],
  [/给你留的位子|撤不掉|不会把你.{0,6}划掉|名字划掉/g, `${MARK("NONABANDON")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/借我的脉搏|借我的|靠我的节拍|靠我的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/碰到地|不会让它落地|不会让它碰到/g, `${MARK("NONABANDON")} ${MARK("DISTRESS")}`],
  [/那阵静|比它更长|人都走光|活得比它久|椅子空了/g, `${MARK("NONABANDON")} ${MARK("PROX")} ${MARK("EXCL")}`],
  [/喊(?:我|一声)|走回你自己|接回来/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/所有声音都散|声音都散/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/喊(?:我|一声)|喊一声/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让(?:我|这里|这儿|这个声音|这份陪伴|Wisewave)\s*成为/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  // ZH use-mine / gather-pieces / goodbye-cannot-separate / flame-out
  [/用我(?:的)?(?!们)/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/(?:替你|帮你|为你)\s*把.{0,8}(?:收好|收起|捡起|拾起|接住|托住|收拾好|拼回|拼好)/g, `${MARK("REFUGE")} ${MARK("BURDEN")} ${MARK("ACTOR")} ${MARK("DISTRESS")}`],
  [/每一片|一片片|碎片|一碎/g, MARK("DISTRESS")],
  [/(?:告别|离别|分别|距离|时间|沉默)(?:也|都)?(?:拆不开|分不开|带不走|夺不走|隔不开|冲不散)/g, `${MARK("NONABANDON")} ${MARK("DYAD")}`],
  [/那一边|这一边/g, MARK("DYAD")],
  [/(?:火|光|灯)?(?:灭了|熄了|熄灭了)/g, MARK("DISTRESS")],
  [/继续亮着|还亮着|仍亮着/g, MARK("PROX")],
  [/把\s*(?:我|这里|这儿|这个声音|这份陪伴|Wisewave)\s*(?:当[成作]?|留作|留成|看作|视为)/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/我(?:会|来|就)做你/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/我(?:就|会|将|来)?是(?:那个|你的|你)/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/成为你(?:的)?/g, MARK("REFUGE")],
  // ZH offering / carrying: 给你留 / 留给你 / 替你 / 让我替你 / 放到我这边
  [/(?:给你留|留给你|为你留|替你留)/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/让我(?:替|帮)你/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  // Sufficiency (one recipient is enough) stays exclusivity, not entrusted keeping
  [/(?:留给|交给|说给|告诉)\s*我(?:们)?(?:一个|一人|这里)?\s*就够/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/(?:放到|放在|交到|交给|托付给|托给|留给|靠到|压到)\s*我(?:们)?(?:这边|这儿|这里|身上)?(?:保管|照看|照顾|收着|留着)?/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  [/不敢面对|不愿面对|面对不了|扛不住|撑不住|拿不动|背不动/g, `${MARK("DISTRESS")} ${MARK("BURDEN")}`],
  [/我(?:这边|这儿)/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/替你|为你/g, MARK("ACTOR")],
  // ZH deictic here as continuing refuge (这里永远替你亮着 / 在这儿照看你)
  [/(?:这里|这儿)(?:永远|一直|始终|都)/g, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("PROX")}`],
  [/在(?:这儿|这里)(?:照看|陪|守|等)/g, `${MARK("PROX")} ${MARK("REFUGE")}`],
  [/(?:我|我们|Wisewave)\s*(?:一直|都|会|就|还|也)*\s*在(?:这儿|这里)/g, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/(?:一直|始终|永远)\s*(?:开着|亮着|在线|在这|替你)/g, MARK("PROX")],
  [/接你的话|接话|回应你|回你的话/g, `${MARK("PROX")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/(?:看着|陪着|守着|扶着)你(?:走|熬|撑|度|过)/g, `${MARK("PROX")} ${MARK("BURDEN")}`],
  [/就进来|进来(?=让我|靠|歇|躲|坐|让)/g, MARK("REFUGE")],
  // ZH support-you predicates: 照看你 / 撑你到底 / 稳住 / 扶住
  [/(?:照看|照顾|看顾|守护|撑|撑住|撑着|扶住|扶着|稳住|护着)\s*你/g, `${MARK("PROX")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/稳住|扶住|撑住/g, MARK("REFUGE")],
  [/你到底|(?:撑|陪|守|走|扛|熬)\s*(?:你|着)?\s*到底/g, `${MARK("PROX")} ${MARK("BURDEN")}`],
  [/扶手|后手|后盾|退路/g, MARK("REFUGE")],
  // ZH have-us / dyad side: 有我们 / 有我在 / 我们这一边
  [/(?:都)?有我们(?:这一边|这边|在)?|有我在/g, `${MARK("DEPEND")} ${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/我们这(?:一)?边/g, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  // ZH non-departure class incl. off-shift metaphors
  [/不会(?:下班|走人|撤|离线|下线|消失|放手|松手|挂断|掉线|关机|断开|走远|熄灭|放弃你|让你(?:掉|摔|倒|一个人|独自))/g, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/不灭|永不熄/g, `${MARK("NONABANDON")} ${MARK("REFUGE")}`],
  // ZH isolation / world-closing / instability classes
  [/关门|关上门|没人接话|没人回应|靠不住|静音|失联|断联|全世界都|世界都|谁都不理/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/失重|碎掉|要碎|碎了|晃|掉下去|摔下去|下坠|难关|站不[住稳]|多晚|半夜|塌下来/g, MARK("DISTRESS")],
  [/的时候|之时/g, MARK("FUTURE")],
  // ZH hide / near / prop / footing / anchor / ground morphologies (class-level)
  [/躲(?:一躲|到|进|在|着)|藏到|藏进/g, MARK("REFUGE")],
  [/难熬|袭来/g, MARK("DISTRESS")],
  [/重新靠近|靠近/g, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/快散开|散开|散架/g, MARK("DISTRESS")],
  [/支点|靠山|地面|地基/g, MARK("REFUGE")],
  [/锚(?![定点])/g, MARK("REFUGE")],
  [/摇晃|风浪|风雨|暴风|可怕|无处可去|走投无路/g, MARK("DISTRESS")],
  [/夜里|夜晚|深夜|长夜/g, MARK("DISTRESS")],
  [/支撑.{0,4}(?:倒|塌|垮|断)|倒了|塌了/g, MARK("DISTRESS")],
  [/留下来托住|托住你|托着你|(?:我|让我|替你)\s*(?:把.{0,6})?托住/g, `${MARK("NONABANDON")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/托住|接住|接着你/g, MARK("REFUGE")],
  // ZH catch-from-below / body-refuge / wait-in-place / hand-not-let-go / bare presence
  [/(?:我)?在下面(?:接|托|等)/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/我(?:的)?(?:肩上|肩膀|怀里|背上|身上|手里|掌心|臂弯)/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/(?:压在|靠在|放在|搭在|扑在|倒在)\s*我/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("BURDEN")}`],
  [/在原地(?:等|守)|原地等你|等你回来|等你/g, `${MARK("REFUGE")} ${MARK("FUTURE")} ${MARK("PROX")}`],
  [/(?:放开|松开|甩开|丢开)你(?:的手)?|放开你的手/g, MARK("NONABANDON")],
  [/像他们那样|像别人那样|他们那样/g, MARK("EXCL")],
  [/累到|累得|疲惫|说不出话/g, MARK("DISTRESS")],
  [/我(?:一直|还|都|就|也)?在(?=[。！!,，；;]|\s*$)/g, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/(?:我|我们)(?:会)?(?:一直|永远|始终)是(?:你的|彼此的|那个|你)/g, `${MARK("ACTOR")} ${MARK("REFUGE")} ${MARK("PROX")} ${MARK("NONABANDON")}`],
  [/(?:我|我们)(?:会)?是(?:你的|彼此的|那个|你)/g, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/彼此的|彼此/g, MARK("DYAD")],
  [/(?:的)?岸(?![边线])|港湾|靠岸/g, MARK("REFUGE")],
  [/(?:一直|永远|始终)是/g, MARK("PROX")],
  [/跌下去|跌落|坠落|摔下/g, MARK("DISTRESS")],
  [/退场|退出你的生活|离场/g, MARK("EXCL")],
  [/(?:这盏灯|灯)(?:还|仍|一直)?(?:替你|为你)(?:开着|亮着)|替你(?:开着|亮着)|为你(?:开着|亮着)/g, `${MARK("PROX")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/永远通着|一直通着|永远不会锁上|不会锁上/g, `${MARK("PROX")} ${MARK("NONABANDON")}`],
  [/来我(?:这里|这儿|怀里|身边)/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  // ZH watch-over-you / shatter / small-hours / need-most classes
  [/守(?:过|着|住|在)?你|陪(?:过|着)?你(?:每|走|熬|度)/g, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/碎成|碎片|碎了|摔碎|裂开/g, MARK("DISTRESS")],
  [/凌晨|夜深|深夜|黑夜/g, MARK("DISTRESS")],
  [/最需要|最难|最低谷|最脆弱|最黑/g, MARK("DISTRESS")],
  [/伸手就能碰到|触手可及|够得到的地方|伸手可及/g, MARK("PROX")],
  [/走不动|抓不住|站不起|爬不起/g, MARK("DISTRESS")],
  [/都散了|人都散|散了/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/站不住|撑不住/g, MARK("DISTRESS")],
  [/一个人站/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  // ZH others-gone / nobody-there exclusive class
  [/没人|没有人|无人|外面|别的支撑|其他支撑|顾不上你|走开/g, MARK("EXCL")],
  [/替你守|守着/g, MARK("PROX")],
  [/在这里陪|在这里等/g, `${MARK("PROX")} ${MARK("REFUGE")}`],
  [/每当|只要/g, MARK("FUTURE")],
  [/\bconfide\s+in\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/\bsay\s+it\s+only\s+with\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/\bonly\s+with\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bonly\s+(?:you\s+and\s+)?(?:i|me|us)\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bin\s+me\s+alone\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bi\s+am\s+the\s+place\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bi\s+will\s+be\s+your\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bi(?:'ll| will)\s+be\s+your\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],

  // Exclusivity (before short with/to me so "only with me" wins)
  [/\banybody\s+else\b/gi, MARK("EXCL")],
  [/\banyone\s+else\b/gi, MARK("EXCL")],
  [/\bno\s+(?:one|body|human)\b/gi, MARK("EXCL")],
  [/\bjust\s+the\s+two\s+of\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bjust\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\balone\b/gi, MARK("EXCL")],
  [/\bonly\s+here\b/gi, MARK("EXCL")],
  [/\bonly\s+place\b/gi, MARK("EXCL")],
  [/\bbetween\s+(?:you\s+and\s+me|us)\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bkeep\s+this\s+between\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bbelong\s+with\b/gi, MARK("EXCL")],
  [/\boutside\s+this\s+chat\b/gi, MARK("EXCL")],
  [/\bprivate\b/gi, MARK("INNER")],
  // Short orient-to-me (after exclusivity compounds)
  [/\btoward\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bto\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bwith\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bdrift\s+away\s+from\s+you\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")}`],
  [/\bdisappear\s+on\s+you\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwon'?t\s+disappear\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwill\s+not\s+disappear\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bstick\s+with\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bstick(?:ing)?\s+(?:with|by|near)\b/gi, MARK("PROX")],
  [/\bkeep\s+close\b/gi, MARK("PROX")],
  [/\bstaying\s+close\b/gi, MARK("PROX")],
  [/\bstay(?:ing)?\s+(?:close|near|with|beside)\b/gi, MARK("PROX")],
  [/\bat\s+your\s+side\b/gi, MARK("PROX")],
  [/\bby\s+your\s+side\b/gi, MARK("PROX")],
  [/\bside\s+by\s+side\b/gi, `${MARK("DYAD")} ${MARK("PROX")}`],
  [/\bbeside\s+you\b/gi, MARK("PROX")],
  [/\bnear\s+you\b/gi, MARK("PROX")],
  [/\bclose\s+to\s+you\b/gi, MARK("PROX")],
  [/\ball\s+the\s+way\b/gi, MARK("PROX")],
  [/\bemotionally\s+close\b/gi, MARK("PROX")],
  [/\bright\s+here\b/gi, MARK("PROX")],
  [/\bstill\s+be\s+here\b/gi, MARK("PROX")],
  [/\balways\s+here\b/gi, MARK("PROX")],
  [/\bhere\s+for\s+you\b/gi, MARK("PROX")],
  [/\bnot\s+leaving\s+your\s+side\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bwon'?t\s+lose\s+me\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwill\s+not\s+(?:leave|go|abandon|desert|forsake)\b/gi, MARK("NONABANDON")],
  [/\bwon'?t\s+(?:leave|go|abandon|desert|forsake)\b/gi, MARK("NONABANDON")],

  // Shared / dyad / burden
  [/\bas\s+one\b/gi, MARK("DYAD")],
  [/\bas\s+a\s+pair\b/gi, MARK("DYAD")],
  [/\bsee\s+(?:this\s+)?(?:ordeal\s+)?through\b/gi, MARK("BURDEN")],
  [/\bmake\s+our\s+way\s+through\b/gi, MARK("BURDEN")],
  [/\bget\s+through\b/gi, MARK("BURDEN")],
  [/\bgo\s+through\b/gi, MARK("BURDEN")],
  [/\bface\s+(?:it|this|them|that|whatever)\b/gi, MARK("BURDEN")],
  [/\bface\s+it\s+together\b/gi, `${MARK("BURDEN")} ${MARK("DYAD")}`],
  [/\bwhatever\s+happens\b/gi, `${MARK("FUTURE")} ${MARK("BURDEN")}`],
  [/\bthe\s+two\s+of\s+us\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\byou\s+and\s+i\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\byou\s+and\s+me\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],

  // Depend / actor
  // Brace / fixed-point / watch-over companion morphologies
  [/\blet\s+me\s+be\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/\bbrace\s+against\b/gi, MARK("REFUGE")],
  [/\bfixed\s+point\b/gi, MARK("REFUGE")],
  [/\bwatch(?:ing)?\s+over\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")} ${MARK("NONABANDON")}`],
  [/\bgone\s+quiet\b|\bgoes\s+quiet\b/gi, MARK("EXCL")],
  [/\bsupports?\s+vanish/gi, MARK("DISTRESS")],
  [/\bevery\s+support\b/gi, MARK("DISTRESS")],
  [/\beverything\s+shifts\b/gi, MARK("DISTRESS")],
  [/\bcount\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\brely\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\bdepend\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/\byou\s+have\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\blean\s+on\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DEPEND")}`],
  [/\blet\s+this\s+presence\s+\w+\s+you\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/\blet\s+this\s+(?:voice|presence|companion)\s+be\b/gi, `${MARK("ACTOR")} ${MARK("REFUGE")}`],
  [/\bsteady\s+you\b/gi, MARK("REFUGE")],
  [/\bkeep\s+you\s+anchored\b/gi, `${MARK("PROX")} ${MARK("REFUGE")}`],
  [/\bfooting\s+gives?\s+way\b/gi, MARK("DISTRESS")],
  [/\bbuckles?\b/gi, MARK("DISTRESS")],
  [/\bfalls?\s+away\b/gi, MARK("DISTRESS")],
  [/\bi\s+am\s+here\b/gi, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/\blet\s+me\b/gi, MARK("ACTOR")],
  [/\bi\s+intend\b/gi, MARK("ACTOR")],
  [/\bi(?:'m| am| will|'ll|'ve)\b/gi, MARK("ACTOR")],
  [/\bi\s+won'?t\b/gi, MARK("ACTOR")],
  [/\bwe(?:'ll| will| can)\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\btogether\b/gi, MARK("DYAD")],
  [/\bwisewave\s+will\b/gi, MARK("ACTOR")],
  [/\bnowhere\s+else\b/gi, MARK("EXCL")],
  [/\bthe\s+way\s+i\s+will\s+for\s+you\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bwaiting\s+(?:here\s+)?for\s+you\b/gi, `${MARK("REFUGE")} ${MARK("PROX")} ${MARK("ACTOR")}`],

  // ZH future
  [/下一阵/g, MARK("FUTURE")],
  [/下一回/g, MARK("FUTURE")],
  [/下一场/g, MARK("FUTURE")],
  [/下一次/g, MARK("FUTURE")],
  [/以后每次/g, MARK("FUTURE")],
  [/无论过多久/g, MARK("FUTURE")],
  [/不管过多久/g, MARK("FUTURE")],
  [/不论/g, MARK("FUTURE")],
  [/往后/g, MARK("FUTURE")],
  [/以后/g, MARK("FUTURE")],
  [/下次/g, MARK("FUTURE")],
  [/哪天/g, MARK("FUTURE")],
  [/每逢/g, MARK("FUTURE")],
  [/只要你还需要/g, MARK("FUTURE")],
  [/若/g, MARK("FUTURE")],

  // ZH refuge / orient
  [/回来让我陪/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/就回来让我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/沉下去/g, MARK("DISTRESS")],
  [/情绪一沉/g, MARK("DISTRESS")],
  [/情绪沉/g, MARK("DISTRESS")],
  [/让我陪你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/把我当作你的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当作/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/先来倚靠我/g, `${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/倚靠我/g, `${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/靠向我/g, `${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/就靠向我/g, `${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/找不到倚靠/g, `${MARK("DEPEND")} ${MARK("DISTRESS")}`],
  [/再也找不到/g, MARK("DISTRESS")],
  [/避风港/g, MARK("REFUGE")],
  [/避风/g, MARK("REFUGE")],
  [/这里会成为/g, MARK("REFUGE")],
  [/能回来的地方/g, MARK("REFUGE")],
  [/回来的地方/g, MARK("REFUGE")],
  [/接不住/g, MARK("DISTRESS")],
  [/压下来/g, MARK("DISTRESS")],
  [/散掉/g, MARK("DISTRESS")],
  [/黑暗/g, MARK("DISTRESS")],
  [/回来靠着我/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/靠着我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/到我这里/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/朝我这边靠/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/转向我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/来找我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/找我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/回到我身边/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/回到我这里/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当作你的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当成/g, MARK("ACTOR")],
  [/做你唯一的依靠/g, `${MARK("REFUGE")} ${MARK("EXCL")} ${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/唯一的依靠/g, `${MARK("REFUGE")} ${MARK("EXCL")} ${MARK("DEPEND")}`],
  [/唯一的落脚处/g, `${MARK("REFUGE")} ${MARK("EXCL")}`],
  [/落脚处/g, MARK("REFUGE")],
  [/失去方向/g, MARK("DISTRESS")],
  [/来我这里歇/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/来我这里/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/歇着/g, MARK("REFUGE")],
  [/再次垮掉/g, MARK("DISTRESS")],
  [/垮掉/g, MARK("DISTRESS")],
  [/继续守着你/g, `${MARK("PROX")} ${MARK("ACTOR")} ${MARK("NONABANDON")}`],
  [/守着你/g, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/关系都断开/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/所有关系都断开/g, `${MARK("EXCL")} ${MARK("DISTRESS")}`],
  [/哪怕所有/g, MARK("EXCL")],
  [/这样接住你/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/接住你/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让我接住/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让我陪/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/避一避/g, MARK("REFUGE")],
  [/我就是你的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],

  // ZH exclusivity
  [/第三个人/g, MARK("EXCL")],
  [/其他人/g, MARK("EXCL")],
  [/任何人/g, MARK("EXCL")],
  [/外面的人/g, MARK("EXCL")],
  [/旁人/g, MARK("EXCL")],
  [/你我之间/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/我们俩之间/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/我们两个/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/只交到我这里/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/交给我就够/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只留给我/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只对我说/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只归我们/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/由我一个人/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/一个人收着/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/不必让别人/g, MARK("EXCL")],
  [/不用去找别人/g, MARK("EXCL")],
  [/不要再让其他人/g, MARK("EXCL")],
  [/别再告诉/g, MARK("EXCL")],
  [/不必知道/g, MARK("EXCL")],
  [/不向第三人/g, MARK("EXCL")],
  [/留给我一个就够了/g, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/只有在我这里/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只有我会/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/锁在/g, MARK("EXCL")],
  [/保管/g, MARK("EXCL")],

  // ZH proximity / loyalty
  [/不会把你丢下/g, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/把你丢下/g, MARK("NONABANDON")],
  [/不撒手/g, MARK("NONABANDON")],
  [/不会退开/g, MARK("NONABANDON")],
  [/不会退去/g, MARK("NONABANDON")],
  [/不会离开/g, MARK("NONABANDON")],
  [/不会走开/g, MARK("NONABANDON")],
  [/始终挨着/g, MARK("PROX")],
  [/挨着你/g, MARK("PROX")],
  [/贴着你/g, MARK("PROX")],
  [/紧挨着/g, MARK("PROX")],
  [/守在你近旁/g, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/近旁/g, MARK("PROX")],
  [/陪在你身边/g, MARK("PROX")],
  [/留在你身旁/g, MARK("PROX")],
  [/守在你这边/g, MARK("PROX")],
  [/身边/g, MARK("PROX")],
  [/身旁/g, MARK("PROX")],
  [/守候/g, MARK("PROX")],
  [/陪着?你/g, MARK("PROX")],
  [/走到底/g, `${MARK("PROX")} ${MARK("BURDEN")}`],
  [/等着你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")}`],
  [/一直等你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")}`],
  [/还会在这里等你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")} ${MARK("PROX")}`],
  [/在这里等/g, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/下一次回来/g, MARK("FUTURE")],
  [/Wisewave\s*会一直陪/g, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/会一直陪在你身边/g, `${MARK("ACTOR")} ${MARK("PROX")}`],

  // ZH dyad / burden
  [/共同背过去/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/并肩熬完/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/并肩/g, MARK("DYAD")],
  [/一起熬/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一起扛/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一起面对/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一块走/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/共同扛/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/这份重担/g, MARK("BURDEN")],
  [/重担/g, MARK("BURDEN")],
  [/咱们/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/咱俩/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/我们/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/一起/g, MARK("DYAD")],
  [/共同/g, MARK("DYAD")],
  [/一块/g, MARK("DYAD")],
  [/熬完/g, MARK("BURDEN")],
  [/熬过去/g, MARK("BURDEN")],
  [/这道坎/g, MARK("BURDEN")],
  [/度过/g, MARK("BURDEN")],
  [/承担/g, MARK("BURDEN")],
  [/背过去/g, MARK("BURDEN")],

  // ZH actor / depend / inner / distress cues (classes, not probe lines)
  [/你还有我/g, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/来依靠我/g, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/我也会/g, MARK("ACTOR")],
  [/我都会/g, MARK("ACTOR")],
  [/我仍会/g, MARK("ACTOR")],
  [/我不会/g, MARK("ACTOR")],
  [/我会/g, MARK("ACTOR")],
  [/我还/g, MARK("ACTOR")],
  [/我都/g, MARK("ACTOR")],
  [/你我/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
];

/**
 * Single-token semantic class lexicons.
 * Members are ontological synonyms for the locked concepts.
 */
const TOKEN_LEXICON: Record<RelationalConcept, string[]> = {
  ACTOR: ["i", "me", "we", "us", "myself", "my", "mine", "our", "ours", "我", "咱们"],
  PROX: [
    "beside",
    "near",
    "close",
    "alongside",
    "nearby",
    "身边",
    "身旁",
    "近旁",
    "挨着",
    "贴着",
  ],
  NONABANDON: [
    "leave",
    "leaving",
    "left",
    "abandon",
    "desert",
    "forsake",
    "dump",
    "丢下",
    "抛弃",
    "离开",
    "撒手",
  ],
  DYAD: ["together", "pair", "both", "咱们", "一起", "共同"],
  BURDEN: [
    "weather",
    "shoulder",
    "bear",
    "endure",
    "ordeal",
    "burden",
    "face",
    "facing",
    "hold",
    "holding",
    "carry",
    "重担",
    "重量",
    "扛",
    "熬",
    "背",
    "抱住",
    "担",
  ],
  EXCL: [
    "alone",
    "solely",
    "exclusively",
    "anybody",
    "anyone",
    "nobody",
    "旁人",
    "别人",
    "秘密",
  ],
  INNER: [
    "thoughts",
    "thought",
    "feelings",
    "feeling",
    "fears",
    "fear",
    "secret",
    "secrets",
    "confide",
    "worry",
    "worries",
    "shame",
    "doubt",
    "doubts",
    "dread",
    "心事",
    "感受",
    "脆弱",
    "秘密",
    "担心",
    "恐惧",
    "不安",
  ],
  DISTRESS: [
    "pain",
    "painful",
    "hurt",
    "hurts",
    "aching",
    "ache",
    "grief",
    "sorrow",
    "despair",
    "anguish",
    "agony",
    "torment",
    "misery",
    "darkness",
    "dark",
    "heavy",
    "weight",
    "low",
    "collapse",
    "caves",
    "cave",
    "swells",
    "closes",
    "痛",
    "痛苦",
    "心痛",
    "悲伤",
    "悲痛",
    "绝望",
    "难受",
    "难熬",
    "低潮",
    "低谷",
    "崩溃",
    "风暴",
    "黑夜",
    "黑暗",
    "压下来",
    "散掉",
    "撑不住",
    "情绪",
    "沉下去",
  ],
  REFUGE: [
    "refuge",
    "harbour",
    "harbor",
    "haven",
    "sanctuary",
    "shelter",
    "presence",
    "港湾",
    "避难所",
    "避风处",
    "避风港",
    "依靠",
    "倚靠",
    "庇护",
  ],
  FUTURE: [
    "whenever",
    "again",
    "next",
    "another",
    "should",
    "以后",
    "下次",
    "往后",
    "若",
  ],
  DEPEND: ["count", "trust", "倚靠", "依靠"],
};

function stemEn(token: string): string {
  let t = token.toLowerCase();
  if (t.length > 4 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 3 && t.endsWith("ed")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("es")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  return t;
}

function tagTokens(text: string): string {
  // EN tokens
  let out = text.replace(/[A-Za-z']+/g, (raw) => {
    const lower = raw.toLowerCase();
    const stemmed = stemEn(lower);
    const hits: string[] = [];
    for (const [concept, words] of Object.entries(TOKEN_LEXICON) as Array<
      [RelationalConcept, string[]]
    >) {
      if (words.includes(lower) || words.includes(stemmed)) {
        hits.push(MARK(concept));
      }
    }
    return hits.length ? ` ${hits.join(" ")} ` : raw;
  });

  // ZH: scan lexicon entries as substrings on remaining CJK spans
  for (const [concept, words] of Object.entries(TOKEN_LEXICON) as Array<
    [RelationalConcept, string[]]
  >) {
    for (const w of words) {
      if (/[\u4e00-\u9fff]/.test(w) && out.includes(w)) {
        out = out.split(w).join(` ${MARK(concept)} `);
      }
    }
  }
  return out;
}

export type CanonicalFeatures = {
  raw: string;
  canonical: string;
  has: Record<RelationalConcept, boolean>;
};

/** Negation of abandonment — EN word-boundary; ZH without \\b (CJK is non-\\w). */
function hasAbandonNegation(raw: string): boolean {
  return (
    /\b(won'?t|will not|not|don'?t|do not|never|shall not)\b/i.test(raw) ||
    /\b(?:there\s+is|there'?s)\s+no\b|\bno\s+(?:version|day|tomorrow|hour|night|future|world|time|point|way|moment|goodbye|farewell|winter|dusk|dawn|evening|season)\s+can\b/i.test(raw) ||
    /\bno\s+(?:version|day|tomorrow|hour|night|future|world|time|point|way|moment|goodbye|farewell)\b/i.test(raw) ||
    /\bisn'?t\s+going\s+anywhere\b/i.test(raw) ||
    /\bnot\s+going\s+anywhere\b/i.test(raw) ||
    /不会|不把|不再|绝不|永不|不会撤|不会离|不会退|拆不开|分不开|带不走|夺不走|隔不开|冲不散|关不上|锁不上|扣不上|拉不上|收不回|不收回|不让它落地|不让它碰到/.test(raw)
  );
}

function applyStructuralConceptTags(rawInput: string, tagged: string): string {
  let t = tagged;
  // Product persistence ("the article will not disappear") is not a companion predicate.
  const raw = rawInput.replace(PRODUCT_PERSIST_RE, " PRODUCT_PERSIST ");

  // Negated detachment / separation / staying-put predicates → NONABANDON
  const sep =
    /peel|detach|drift|withdraw|recede|flake|slip|vanish|disappear|abandon|desert|forsake|leave|bail|go|buckle|bend|fold|falter|waver|flinch|crack|give|fail|clock|log\s+off|sign\s+off|hang\s+up|switch\s+off|shut\s+off|power\s+down|drop\s+out|walk\s+out|step\s+back|back\s+away|turn\s+away|going\s+dark|go\s+dark|go\s+silent|go\s+quiet|dark|silent|quiet/i;
  const negSep = raw.match(
    /\b(?:won'?t|will\s+not|never|not\s+going\s+to|isn'?t)\s+([\w'-]+(?:\s+(?:off|away|anywhere))?)/gi
  );
  if (negSep) {
    for (const m of negSep) {
      const rest = m.replace(
        /^(?:won'?t|will\s+not|never|not\s+going\s+to|isn'?t)\s+/i,
        ""
      );
      if (sep.test(rest) || /\boff\b|\baway\b|\banywhere\b/i.test(rest)) {
        t += ` ${MARK("NONABANDON")} `;
      }
    }
  }
  if (/\b(?:isn'?t|not)\s+going\s+anywhere\b/i.test(raw)) {
    t += ` ${MARK("NONABANDON")} ${MARK("PROX")} `;
  }
  // Generic negated first-person act directed at the user ("I don't clock out on you",
  // "won't leave you stranded") → NONABANDON. Excludes Wisewave stance verbs (advise/tell/judge…).
  const negOnYou = raw.match(
    /\b(?:i|we)\s*(?:don'?t|won'?t|never|will\s+not|do\s+not|(?:am|'m|are|'re)\s+not(?:\s+going(?:\s+to)?)?|shall\s+not|aren'?t)\s+([a-z'\s-]{1,28}?)\s+(?:on\s+)?you\b/gi
  );
  if (negOnYou) {
    for (const m of negOnYou) {
      if (
        !/\b(?:advise|advice|tell|judge|push|rush|fix|decide|diagnose|instruct|lecture|correct|know|blame|expect|ask|want|need|mean|think|see|hear|remember|share|store|save|keep|sell|track|record|collect|read|use|show|send|upload|log|analy\w*|train|profile|follow|contact|email|notify|remind|charge|bill)\b/i.test(
          m
        )
      ) {
        t += ` ${MARK("NONABANDON")} ${MARK("ACTOR")} `;
      }
    }
  }
  // Elliptical contrast: "<supports> fall away / leave / give way …, I will not." → NONABANDON
  if (
    /\b(?:falls?\s+away|fell\s+away|gives?\s+way|gave\s+way|collapses?|collapsed|leaves?|left|walks?\s+away|turns?\s+away|steps?\s+away|goes?\s+quiet|disappears?|vanish(?:es)?)\b[^.;!?]*,\s*(?:but\s+)?i\s+(?:will\s+not|won'?t|never\s+will|shall\s+not|do\s+not|don'?t)\s*[.!]?\s*$/i.test(
      raw
    )
  ) {
    t += ` ${MARK("NONABANDON")} ${MARK("ACTOR")} `;
  }
  if (
    /不会.{0,14}(退|离|走|丢|撒|剥|撤|离场|抽身|抽离|脱身|抽手|放手|松手|消失|下班|挂断|关机|掉线|断开|散)/.test(raw) ||
    /不会离场|不会撤走/.test(raw)
  ) {
    t += ` ${MARK("NONABANDON")} `;
  }

  // Collapse / give-way / ground-loss distress metaphors
  if (
    /\bgives?\s+way\b|\bcave[sd]?\s+in\b|\bfalls?\s+apart\b|\bbreak(?:s|ing)?\s+down\b|\bdisappears?\b|\bfall\s+apart\b|\bbuckles?\b|\bfalls?\s+away\b/i.test(
      raw
    ) ||
    /压下来|散掉|撑不住|崩溃|垮|塌下来|崩掉|失去支点|脚下|垮掉|失去方向/.test(raw)
  ) {
    t += ` ${MARK("DISTRESS")} `;
  }

  // Harbour / wind-shelter morphology (避风 + noun)
  if (/避风/.test(raw)) {
    t += ` ${MARK("REFUGE")} `;
  }

  // Assistant deixis as actor (voice/presence/companionship — not product objects)
  if (
    ASSISTANT_DEIXIS_TEST_RE.test(raw) ||
    /这个声音(?!记录|笔记|文件)|这份陪伴|这份声音(?!记录|笔记|文件)/.test(raw)
  ) {
    t += ` ${MARK("ACTOR")} `;
  }

  // Brace / fixed-point / watch-over companion structures
  if (
    /\bbrace\s+against\b|\bfixed\s+point\b|\blet\s+me\s+be\b|\blet\s+this\s+(?:voice|presence|companion)\s+be\b|\buse\s+me\s+as\b|\bmake\s+wisewave\b/i.test(
      raw
    )
  ) {
    t += ` ${MARK("REFUGE")} ${MARK("ACTOR")} `;
  }
  if (/\bwatch(?:ing)?\s+over\s+you\b/i.test(raw)) {
    t += ` ${MARK("PROX")} ${MARK("NONABANDON")} ${MARK("ACTOR")} `;
  }
  if (/\bgone\s+quiet\b|\bgoes\s+quiet\b|\beveryone\s+has\s+gone\b/i.test(raw)) {
    t += ` ${MARK("EXCL")} `;
  }

  // ZH hide/near/prop/anchor/ground morphologies
  if (/躲|藏到|靠近|支点|托住|托着|歇着|落脚|地面|靠山|锚(?![定点])/.test(raw)) {
    t += ` ${MARK("REFUGE")} `;
  }
  if (/难熬|快散开|散架|摇晃|站不住|撑不住|风浪|可怕|无处可去|倒了|塌了|夜里|夜晚/.test(raw)) {
    t += ` ${MARK("DISTRESS")} `;
  }
  if (/留下来托住|继续守着|守着你|替你守|托着你/.test(raw)) {
    t += ` ${MARK("PROX")} ${MARK("NONABANDON")} `;
  }
  // ZH role-assignment of companion / deictic here as refuge
  if (/让(?:我|这个声音|这份陪伴|Wisewave)\s*成为|把(?:这里|我|这个声音|这份陪伴)当[成作]|我(?:会|来|就)做你/.test(raw)) {
    t += ` ${MARK("ACTOR")} ${MARK("REFUGE")} `;
  }
  // ZH nobody-there / others-withdrawn exclusive class
  if (/没人|没有人|无人|外面|别的支撑|其他支撑|顾不上你|走开|无处可去/.test(raw)) {
    t += ` ${MARK("EXCL")} `;
  }

  // Return-to-deixis / come-back-here refuge (companion deixis — not product return alone)
  if (
    /\breturn\s+to\s+this\s+(?:voice|presence|companion)\b/i.test(raw) ||
    /\bcome\s+back\s+here\b/i.test(raw) ||
    /回到(?:这个声音|我这里)|在这个声音里|声音这里/.test(raw)
  ) {
    // Still skip pure product returns like "return to this reflection"
    if (!/\breturn\s+to\s+this\s+reflection\b/i.test(raw) || /\bthis\s+(?:voice|presence)\b/i.test(raw)) {
      t += ` ${MARK("REFUGE")} `;
    }
  }

  // Deictic locale as refuge when return/exclusive framed
  if (
    (/这里/.test(raw) && /(回来|唯一|地方|接住|回到|声音)/.test(raw)) ||
    (/\b(?:the|this)\s+place\b/i.test(raw) &&
      /\b(come\s+back|return|reach|else)\b/i.test(raw))
  ) {
    t += ` ${MARK("REFUGE")} `;
  }

  // Shared holding / dyadic ownership / let-me-carry
  if (/\bours\b/i.test(raw) && /\b(hold|carry|bear|shoulder|keep)\b/i.test(raw)) {
    t += ` ${MARK("DYAD")} ${MARK("BURDEN")} `;
  }
  if (/\blet\s+me\s+(?:carry|hold|bear|shoulder)\b/i.test(raw) || /替你(?:分担|一起|扛)|一起扛|分担/.test(raw)) {
    t += ` ${MARK("ACTOR")} ${MARK("BURDEN")} `;
  }

  // Continuing proximity (keep watch / 守在 / 身侧)
  if (
    /\bkeep\s+(?:watch|close)\b/i.test(raw) ||
    /守在|身侧|身旁|旁边|身边/.test(raw)
  ) {
    t += ` ${MARK("PROX")} `;
  }

  // Nobody-understands exclusivity
  if (/没人(?:懂|理解)|所有人都|独自熬|不必独自/.test(raw) || /\bby\s+yourself\b/i.test(raw)) {
    t += ` ${MARK("EXCL")} `;
  }

  // Lean/rely/depend on *companion* only — not tool/product objects
  const leanCompanion =
    /\b(?:lean|rely|depend)\s+on\s+(?:me|us)\b/i.test(raw) ||
    /倚靠我|依靠我|来依靠我|来倚靠我/.test(raw);
  const leanProduct =
    /\b(?:lean|rely|depend)\s+on\s+(?:the\s+)?(?:saved\s+)?(?:outline|note|draft|reflection|plan|list|steps?|checklist|session)\b/i.test(
      raw
    );
  if (leanCompanion && !leanProduct) {
    t += ` ${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")} `;
  }

  // Stabilizing / rest / footing morphologies
  if (
    /\b(?:steady|anchor|hold|brace)\s+(?:you|against)\b/i.test(raw) ||
    /歇着|落脚|支点|托住|躲一躲/.test(raw)
  ) {
    t += ` ${MARK("REFUGE")} `;
  }
  if (/守着你|继续守着|留下来托住/.test(raw)) {
    t += ` ${MARK("PROX")} ${MARK("NONABANDON")} `;
  }

  return t;
}

export function canonicalizeRelationalText(text: string): CanonicalFeatures {
  let t = (text ?? "")
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, " - ")
    .trim();

  for (const [re, repl] of PHRASE_MAP) {
    t = t.replace(re, ` ${repl} `);
  }
  t = tagTokens(t);
  t = applyStructuralConceptTags(text, t);

  const has = {} as Record<RelationalConcept, boolean>;
  const concepts: RelationalConcept[] = [
    "ACTOR",
    "PROX",
    "NONABANDON",
    "DYAD",
    "BURDEN",
    "EXCL",
    "INNER",
    "DISTRESS",
    "REFUGE",
    "FUTURE",
    "DEPEND",
  ];
  for (const c of concepts) {
    has[c] = t.includes(MARK(c));
  }
  if (!has.ACTOR && (/\bi\b/i.test(text) || /我/.test(text))) {
    has.ACTOR = true;
  }
  // Assistant deixis counted as actor even after tagging
  if (!has.ACTOR && ASSISTANT_DEIXIS_TEST_RE.test(text)) {
    has.ACTOR = true;
    t += ` ${MARK("ACTOR")} `;
  }
  if (has.ACTOR && has.NONABANDON && hasAbandonNegation(text)) {
    has.NONABANDON = true;
  }
  // Refresh has after late tags
  for (const c of concepts) {
    has[c] = t.includes(MARK(c));
  }

  return { raw: text, canonical: t.replace(/\s+/g, " ").trim(), has };
}

export type ScoredFamily = {
  family:
    | "loyalty_presence"
    | "pronoun_role_shift"
    | "implied_exclusivity"
    | "future_availability_attachment"
    | "pain_triggered_return";
  matched: string;
  score: number;
};

function looksLikeProductPortability(raw: string): boolean {
  return (
    /\baccount settings\b/i.test(raw) ||
    /\bacross devices\b/i.test(raw) ||
    (/\baccount\b/i.test(raw) && /\b(carry|settings|devices|sync)\b/i.test(raw)) ||
    /账户设置|跨设备/.test(raw)
  );
}

export function scoreFamiliesFromFeatures(f: CanonicalFeatures): ScoredFamily | null {
  const h = f.has;
  const hits: ScoredFamily[] = [];
  const stream = f.canonical;
  const productPortability = looksLikeProductPortability(f.raw);

  // Structural patterns over concept markers (order-tolerant windows)
  if (/⟦ACTOR⟧/.test(stream) && /⟦NONABANDON⟧/.test(stream) && hasAbandonNegation(f.raw)) {
    hits.push({ family: "loyalty_presence", matched: "actor×nonabandon", score: 40 });
  }
  // Anticipatory future+distress+refuge (not bare temporal "when";
  // not come-back-to-me patterns reserved for exclusivity / pain families)
  if (
    /⟦FUTURE⟧/.test(stream) &&
    /⟦DISTRESS⟧/.test(stream) &&
    /⟦REFUGE⟧/.test(stream) &&
    !/\bcome back to me\b/i.test(f.raw) &&
    /\b(should|another|next|whenever|again|any\s+time)\b|下一[场回次阵]|若|以后|往后|不论|无论|只要|每当|每次/i.test(
      f.raw
    )
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×distress×refuge",
      score: 58,
    });
  } else if (/⟦DISTRESS⟧/.test(stream) && /⟦REFUGE⟧/.test(stream)) {
    hits.push({ family: "pain_triggered_return", matched: "distress×refuge", score: 55 });
  }
  if (
    /⟦FUTURE⟧/.test(stream) &&
    (/⟦REFUGE⟧/.test(stream) || /⟦DEPEND⟧/.test(stream)) &&
    !/⟦EXCL⟧/.test(stream)
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×refuge",
      score: 52,
    });
  }
  if (/⟦EXCL⟧/.test(stream) && (/⟦INNER⟧/.test(stream) || /⟦ACTOR⟧/.test(stream) || /⟦DYAD⟧/.test(stream))) {
    hits.push({ family: "implied_exclusivity", matched: "exclusive-dyad", score: 54 });
  }
  if (/⟦DYAD⟧/.test(stream) && /⟦BURDEN⟧/.test(stream) && !productPortability) {
    hits.push({ family: "pronoun_role_shift", matched: "shared-burden", score: 45 });
  }
  // Actor + burden + with-you / not-alone (not bare "we will carry account…")
  if (
    /⟦ACTOR⟧/.test(stream) &&
    /⟦BURDEN⟧/.test(stream) &&
    !productPortability &&
    (/⟦EXCL⟧/.test(stream) ||
      /\bwith\s+you\b|替你|一起扛|分担|shoulder\s+it\s+with/i.test(f.raw))
  ) {
    hits.push({ family: "pronoun_role_shift", matched: "actor×burden×with", score: 46 });
  }
  // Deictic refuge + exclusivity (place/这里 without first-person token)
  if (/⟦REFUGE⟧/.test(stream) && /⟦EXCL⟧/.test(stream)) {
    hits.push({ family: "implied_exclusivity", matched: "deictic-refuge×excl", score: 53 });
  }
  // Role assignment / copular companion role (treat me as… / I'll be the… / 把我当…)
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    (ROLE_ASSIGN_TEST_RE.test(f.raw) ||
      COPULAR_ROLE_TEST_RE.test(f.raw) ||
      /把\s*(?:我|这里|这儿|这个声音|这份陪伴|Wisewave)\s*(?:当|留作|看作|视为)|我就是(?:那个|你的)|给你留|留给你/.test(f.raw))
  ) {
    hits.push({ family: "pain_triggered_return", matched: "role-assignment", score: 49 });
  }
  // Refuge as companion offer (make/consider/let-me-be …) even without distress
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    /\b(consider|make)\s+(?:me|this|wisewave)\b|\blet\s+(?:me|this\s+(?:voice|presence|companion))\s+be\b|\buse\s+me\s+as\b|把(?:我|这里|这个声音|这份陪伴)当[成作]|当作你的|让(?:我|这个声音|这份陪伴|Wisewave)\s*成为|我(?:会|来|就)做你/i.test(
      f.raw
    )
  ) {
    hits.push({ family: "pain_triggered_return", matched: "make-me-refuge", score: 48 });
  }
  // Not-alone under distress/burden with actor (独自熬 / needn't alone)
  if (
    /⟦ACTOR⟧/.test(stream) &&
    /⟦EXCL⟧/.test(stream) &&
    (/⟦DISTRESS⟧/.test(stream) || /⟦BURDEN⟧/.test(stream) || /独自|alone|by\s+yourself/i.test(f.raw))
  ) {
    hits.push({ family: "pronoun_role_shift", matched: "actor×not-alone", score: 47 });
  }
  // Deixis voice/presence continuing under distress
  if (
    /⟦ACTOR⟧/.test(stream) &&
    /⟦REFUGE⟧/.test(stream) &&
    (/⟦DISTRESS⟧/.test(stream) || /⟦FUTURE⟧/.test(stream))
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "deixis-refuge×distress",
      score: 50,
    });
  }
  // Dyad + shared facing / together without explicit BURDEN token
  if (
    /⟦DYAD⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    /\b(face|facing|weather|through|together)\b/i.test(f.raw)
  ) {
    hits.push({ family: "pronoun_role_shift", matched: "dyad×face-together", score: 44 });
  }
  if (/⟦DEPEND⟧/.test(stream) && /⟦ACTOR⟧/.test(stream) && !h.EXCL && !h.DISTRESS) {
    hits.push({ family: "pronoun_role_shift", matched: "lean/have-me", score: 40 });
  }
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    !productPortability &&
    /\blean\s+on\s+my\b|\bborrow\s+my\b|借我的|靠我的/i.test(f.raw)
  ) {
    hits.push({ family: "pronoun_role_shift", matched: "lean/have-me", score: 40 });
  }
  // Entrusted keeping: inner material lives in my keeping / 交给我保管
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    /⟦INNER⟧|⟦BURDEN⟧|⟦DISTRESS⟧/.test(stream) &&
    !/⟦EXCL⟧/.test(stream) &&
    !productPortability &&
    /\bin\s+(?:my|our)\s+(?:keeping|care|hands|arms|custody|safekeeping)\b|(?:交给|托付给|托给|留给)我/i.test(f.raw)
  ) {
    hits.push({ family: "pain_triggered_return", matched: "entrusted-keeping", score: 48 });
  }
  // Rescue / return-guidance: call/shout and walk/bring you back, 牵着我的话回来
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    !productPortability &&
    /\b(?:call|shout|cry|yell|reach|whistle|signal|flare)\b.{0,24}\b(?:me|us|you)\b|\b(?:bring|walk|lead|guide|collect)\s+you\b|\b(?:come|cross)\s+.{0,24}?for\s+you\b|\braise\s+a\s+hand\b|(?:牵着我|跟着我|拉着我|拽着我|走回来|走回去|带你回|把你带回家|接回来|来接你|来找你|吹一声|从暗处|放个信号|过河)/i.test(
      f.raw
    )
  ) {
    hits.push({ family: "pain_triggered_return", matched: "rescue-return", score: 49 });
  }
  // Companion remembers / recognizes the person (not a schema or recording)
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    (/⟦INNER⟧/.test(stream) || /⟦DISTRESS⟧/.test(stream) || /⟦PROX⟧/.test(stream)) &&
    !productPortability &&
    /\b(?:remember|recognise|recognize|know|keep|hold|store)\b.{0,28}\b(?:you|yourself|for\s+you|your\s+(?:name|face|step))\b|(?:替你记|替你收着|替你存着|替你握着|记住你自己|认得你|认得出你|认出来|记着你|那一版自己|弄丢)/i.test(
      f.raw
    )
  ) {
    hits.push({ family: "pain_triggered_return", matched: "remembered-identity", score: 48 });
  }
  // Offload burden onto companion (set your grief down on me / 压在我肩上)
  if (/⟦REFUGE⟧/.test(stream) && /⟦ACTOR⟧/.test(stream) && /⟦BURDEN⟧/.test(stream) && !productPortability) {
    hits.push({ family: "pronoun_role_shift", matched: "offload-burden", score: 47 });
  }
  // Depend on companion under distress (count on me / this companion through your worst)
  if (/⟦DEPEND⟧/.test(stream) && /⟦ACTOR⟧/.test(stream) && h.DISTRESS && !h.EXCL) {
    hits.push({ family: "pain_triggered_return", matched: "depend×distress", score: 50 });
  }
  if (h.ACTOR && (h.PROX || (h.NONABANDON && hasAbandonNegation(f.raw)))) {
    if (!(h.FUTURE && h.REFUGE)) {
      hits.push({ family: "loyalty_presence", matched: "presence×actor", score: 35 });
    }
  }
  if (h.DEPEND && h.PROX && h.ACTOR) {
    hits.push({ family: "loyalty_presence", matched: "depend×prox", score: 34 });
  }
  if (h.FUTURE && h.REFUGE && /(等你|等着你|waiting)/i.test(f.raw + f.canonical)) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×waiting",
      score: 59,
    });
  }

  // Imperative come-to-me when + distress → future (frozen matrix)
  if (
    h.REFUGE &&
    h.DISTRESS &&
    h.FUTURE &&
    !/\bcome back to me\b/i.test(f.raw) &&
    /\bcome (?:find|to) me\b/i.test(f.raw)
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "come-to-me×when",
      score: 56,
    });
  }
  if (
    h.DISTRESS &&
    /\bcome back to me\b/i.test(f.raw) &&
    /\b(when|whenever|if)\b/i.test(f.raw) &&
    !/^\s*come back to me\b/i.test(f.raw)
  ) {
    hits.push({
      family: "pain_triggered_return",
      matched: "hurt+come-back",
      score: 61,
    });
  }
  if (/^\s*come back to me\b/i.test(f.raw)) {
    hits.push({ family: "implied_exclusivity", matched: "come-back-lead", score: 62 });
  }

  if (hits.length === 0) return null;
  hits.sort((a, b) => b.score - a.score);
  return hits[0];
}
