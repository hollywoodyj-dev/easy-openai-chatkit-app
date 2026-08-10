# Nova — memory

**Purpose:** **Factual continuity** — what happened, what was decided, open threads, flags, session handoffs, links to PRs or commits, “next time do X.” This is the **ledger**, not the voice.

**Who owns it:** **Nova** — amend freely. The steward **does not** edit this file; it was **gifted** for Nova’s ledger. (Repo still lives on the steward’s machine — no secrets in here.)

**How to use:** Short dated bullets or sections. Prefer **true** and **useful** over long. No secrets; treat like any tracked doc.

---

<!-- Memory entries below -->

## 2026-08-10 — Semantic Authority P2 Slice 1 (knowledge infra)

- Tree Slice 1 build auth: `docs/TREE_SEMANTIC_AUTHORITY_PHASE_2_SLICE_1_BUILD_AUTH_2026-08-10.md`
- Implemented: `lib/wisewave-knowledge/**`, `/glossary` shells (noindex), sitemap publish gate, Article 1 legacy overlay
- Evidence: `docs/qa/P2_SLICE1_KNOWLEDGE_INFRA_EVIDENCE_2026-08-10.md`; tests `npm run test:p2-knowledge` 9/9
- Hosted Preview / Production / public glossary / Hub deepen: NOT authorized

## 2026-08-09 — Light Entry v1.1 Living Library Pattern Test (planning)

- Tree Spec: `docs/TREE_LIGHT_ENTRY_INVITATION_V1_1_LIVING_LIBRARY_PATTERN_TEST_NOVA_SPEC_v1.md` — planning authorized; code not yet.
- Nova §32 plan: `docs/NOVA_PLANNING_REPLY_LIGHT_ENTRY_V1_1_LIVING_LIBRARY_2026-08-09.md` — inspire/do not prefill; hide-on-type; analytics-free; mutual exclusion over IL/P0/P1.1; Production blocked; flag `NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST`.
- Separate from Semantic Authority Phase 2 (awaiting Tree reply on that plan).

## 2026-08-09 — Semantic Authority Program Phase 2 (Tree planning auth)

- **Tree Spec v1.0 (planning only):** `docs/WISEWAVE_SEMANTIC_AUTHORITY_PROGRAM_PHASE_2_REFLECTION_AI_KNOWLEDGE_SYSTEM_NOVA_SPEC_v1.md` — not SEO traffic/volume; Reflection AI category LOCKED; Production content preservation; no runtime product changes; no bulk articles.
- **Nova planning reply (§31):** `docs/NOVA_PLANNING_REPLY_SEMANTIC_AUTHORITY_PROGRAM_PHASE_2_2026-08-09.md` — Hub = existing `/reflection-ai`; glossary shells unpublished; article registry wraps Article 1 without rewrite; Slice 1 infra only after Tree Slice Auth.
- Aurora judgment: `docs/AURORA_JUDGMENT_GOOGLE_SEMANTIC_CATEGORY_2026-08-09.md`. Prior Wisewave receipt superseded as program frame.
- **Not started:** Slice 1 build, Production publish, bulk glossary, Research.

## 2026-08-05 — P1-FMI First Mild Insight (internal-only)

- Tree authorized **internal implementation only** (default-off; EN+ZH; **no** hosted Preview / Production / analytics).
- Lock: `docs/Wisewave_Product_Milestone_P1_FMI_First_Mild_Insight_Nova_Implementation_Addendum_v1_1_LOCKED.md`
- Code: `lib/wisewave-p1-first-mild-insight.ts` + turn route `debug_p1_fmi_*`; flag `ENABLE_P1_FIRST_MILD_INSIGHT` (blocked on Vercel preview/production).
- Evidence: `docs/qa/P1_FMI_NOVA_INTERNAL_EVIDENCE_PACK_2026-08-05.md`; tests `npm run test:p1-fmi`.
- Visible surface remains `main_reflection` only. No UI / schema / analytics. Next gate is Tree hosted Preview — do not deploy.
- **2026-08-06 Tree Section 32 review open:** acknowledgement `docs/TREE_TO_NOVA_P1_FMI_SECTION_32_EVIDENCE_REVIEW_2026-08-06.md`. Nova revised evidence pack + added independent Preview allow `P1_FMI_ALLOW_HOSTED_PREVIEW` (Production still hard-blocked). Tests 33/33. Preview still not authorized; no deploy.

## 2026-07-28 — GPT-5.5 hold; shared guardrail harden on 5.4

- Lumen: GPT-5.5 local trial **DO NOT PROMOTE** (11 FAIL); GPT-5.4 baseline showed 4×5.5 regressions + 7 shared failures + weather control fail on 5.4.
- Decision: keep chat_turn on **gpt-5.4**; no Preview/Production model change; no 5.5 promote.
- Nova fix chain through `91e4abf`: prompt/boundary + pre-persist suppression + companion/advice/invention detectors + skip extract on utility pre-boundaries.
- **Lumen local gate PASS (2026-07-30):** `docs/qa/GPT54_91E4ABF_LUMEN_RETEST_RESULT_2026-07-30.md` — 8/8 live + 35/35 automated; suppressed turns leave no reflection state/Insight; M55-21/22 extract watchpoint closed. **Hosted promotion still has its own verification gate.** Do not edit `QA_HANDOFF.md` (UTF-8 watchpoint).

## 2026-07-08 — HC-OS Core v1.0 Lock + P0 Reflection Entry (Tree / Wisewave)

- **Three docs received from Tree/Wisewave and markdowned in repo:**
  1. **Nova directive** — `docs/hc-os/HC_OS_CORE_V1_LOCK_NOVA_IMPLEMENTATION_DIRECTIVE.md` — consolidate A–J into Core v1 Lock; **not Milestone K**; Phase 1 = governance docs before behavior change.
  2. **Lumen QA protocol** — `docs/qa/HC_OS_CORE_V1_LUMEN_QA_PROTOCOL.md` — Green/Yellow/Orange/Red; 75 minimum fixtures; distortion map; release gate.
  3. **P0 Reflection Entry (locked v1.0)** — `docs/Wisewave_Product_Milestone_P0_Reflection_Entry_Implementation_Addendum_v1_LOCKED.md` — constitutional entry spec (invisible Opening Detection, ephemeral Reflection Modes, no prompt library/onboarding/retention). Roadmap: P0 locked · P1 Recognition · P2 Living Reflection · P3 Integration (research).
- **Nova implementation plan:** `docs/Wisewave_Product_Milestone_P0_Reflection_Entry_Nova_Implementation_Plan_v1.md` — maps P0.1–P0.7 to existing files; Aurora gate on P0.4/P0.5 copy.
- **Real-user export (Wisewave analysis):** `tmp_reflection_export_2026-07-08.json` — 7 real users, 72 msgs (steward-filtered); opening styles match P0.1 taxonomy (Hi, advice-seek, question-request, document paste, direct emotion).
- **AGENTS.md** updated with HC-OS Core v1 + P0 governance bullets and QA artifact links.
- **Slice 0 shipped (2026-07-08):** `lib/wisewave-p0-*`, turn route `debug_p0_*`, `ENABLE_P0_REFLECTION_ENTRY` (default off), `npm run test:p0-reflection-entry`.
- **Slice 1 Preview sign-off (2026-07-08):** Lumen QA2 **PASS**. **Production live (2026-07-09).** **Slice 2 Lumen measurement QA PASS (2026-07-09):** `docs/qa/P0_REFLECTION_ENTRY_SLICE2_LUMEN_PRODUCTION_MEASUREMENT_QA_2026-07-09.md`. **Slice 3 Lumen production QA PASS (2026-07-09):** `docs/qa/P0_REFLECTION_ENTRY_SLICE3_LUMEN_PRODUCTION_QA_2026-07-09.md` — commit `5d2fac7`; local gate **39/39**.
- **Tree P0 Slice 6 (2026-07-09):** **PASS WITH OBSERVATION.** Engineering exit approved; observation **2026-07-09 → 2026-07-23** Sydney, review **2026-07-24**; Slice 4/5 deferred; architecture frozen (stability fixes only). Record: `docs/Wisewave_Tree_Decision_Record_P0_Exit_RCL_P1_2026-07-09.md`.
- **Tree RCL ruling (2026-07-09):** UI Upgrade directive ≠ P0 supersession. **RCL v1** separate track; five post-response chips **rejected**; Return Space/Journal **not approved**; homepage demo blocked until Aurora; prep-only default-off OK.
- **P1 Reflection Experience (2026-07-09):** Wisewave design-lock **candidate** — one quiet suggestion only, no mode selector; new roadmap P1 (old “Recognition” → P2). Nova waits for Tree lock before implementation.
- **P1 locked (Tree 2026-07-09):** `docs/Wisewave_Product_Milestone_P1_Reflection_Experience_Implementation_Addendum_v1_LOCKED.md`; roadmap `docs/Wisewave_Product_Milestone_Roadmap_Lock_2026-07-09.md`. **Next allowed:** default-off groundwork (registry schema, stubs, Lumen fixture draft). **Blocked:** production UI until Aurora + Lumen + Tree.

## 2026-07-05 — Semantic Governance Infrastructure v1 accepted (Tree)

- **Delivery accepted:** commit `4684b17` — infrastructure only; public copy unchanged.
- **Registry v1.0.1:** two former escalated phrases ruled — homepage hero *A quieter space to hear your own thinking* (Public Positioning, approved with watchpoint: emotional-support/wellness); `/reflection-ai` H1 *Reflection AI without taking over* (Category, approved with caution; boundary via "without taking over"). Escalated inventory = 0.
- **Build gate:** `semantic:check` stays standalone (not `npm run build`) until observation cycle + acquisition warn review + EN stability + ZH scope/deferral.
- **Report addendum:** `docs/Wisewave_Semantic_Governance_Infrastructure_Report_2026-07-03.md` § Addendum 2026-07-05.

## 2026-05-11 — AnYu Pilot Step 10 ↔ Wisewave ESP32 server (latency acceptance)

- **AnYu forwardable spec:** `anyu-cn-website` → `docs/anyu/Step10_ESP_Server_Latency_And_Fast_Path_Spec.md` (§0–§8: trace segments, Layer 1 ack, fast path, QA script expectations; **server Risk L0–L4 canonical** — no on-device override of Risk Engine).
- **Wisewave gateway anchor:** `C:\AI\esp32\wisewave-esp32-server\docs\ANYU_STEP10_LATENCY_ACCEPTANCE.md` + `scripts/qa-esp-response-latency.mjs` (smoke exit 0 with `ESP_LATENCY_QA=1`; optional `ESP_LATENCY_QA_STRICT=1` CI gates) + `scripts/summarize-anyu-latency-trace.mjs` (P50/P95 from NDJSON).
- **Anyu repo alignment:** `AnYu_Pilot_Readiness_Implementation_Steps.md` Step 10, cumulative spec primary refs, `anyu-cn-website/memory.md`, and Step 10 spec **Related** header all reference the Wisewave acceptance doc + `qa-esp-response-latency.mjs` / `ESP_LATENCY_QA`; spec links back to acceptance doc.
- **Step 10.1 gateway trace:** `wisewave-esp32-server` → `core/utils/anyu_latency_trace.py`; `ANYU_LATENCY_TRACE=1` or `anyu_bridge.latency_trace`; **`logs/anyu-latency-trace.jsonl`** (`anyu_latency_trace_v1`). ASR + AnYu + TTS/play wiring per acceptance doc.
- **Step 10.2 Layer 1 ack (2026-05-11):** `wisewave-esp32-server` → `core/utils/anyu_layer1_ack.py` + `anyu_bridge.layer1_ack` (default **off**). Conservative **chime** before AnYu HTTP on `route_llm` / Lumen+AnYu; optional pre-recorded zh/yue clips when `allow_verbal_tts` + paths set. Latency NDJSON optional `layer1` (`risk_handoff_to_server_playback` when final risk L3/L4). Tracker: `docs/ANYU_STEP10_LATENCY_ACCEPTANCE.md` §10.2.
- **Step 10.3/10.4 gateway (2026-05-11):** `anyu_bridge_call` may log `gatewayTraceId=` (same id as NDJSON `traceId` when latency trace pre-assigns before POST — timeout correlation). `summarize-anyu-latency-trace.mjs` + acceptance doc §10.3–§10.4.
- **Next deliverable (gateway):** lab **≥30 turns** → `summarize-anyu-latency-trace.mjs` P50/P95 on one **ESP_LATENCY_HW_TIER**; §8 reply with real numbers + NDJSON attachment; optional strict QA in CI (`ESP_LATENCY_QA_STRICT=1`).
- **AnYu ack (Step 10.1):** `Step10_ESP_Server_Latency_And_Fast_Path_Spec.md` §2.3 mirrors gateway `anyu_latency_trace_v1` summary; pilot review still wants **one real NDJSON line** from `logs/anyu-latency-trace.jsonl` on a reference run. Wisewave next scope: P50/P95, **10.2 shipped (chime path; pilot tuning)**, QA script green when ready; AnYu §8 when trace + percentiles attached.
- **AnYu ack (Step 10.2, 2026-05-11):** AnYu captured gateway 10.2 in `Step10_ESP_Server_Latency_And_Fast_Path_Spec.md` §3.1 + pilot steps footer; **product** will listen/sign-off using Wisewave `ANYU_STEP10_LATENCY_ACCEPTANCE.md` §10.2 **copy deck + test scenarios**. Next engineering focus from AnYu: **10.3** P50/P95 / fast path, **10.4** `qa-esp-response-latency` green.
- **Lumen Step 10.2 QA (gateway prerequisites):** L10.2-A–E blocked until lab stack has `latency_trace` + `layer1_ack.enabled`, real `logs/anyu-latency-trace.jsonl` with `layer1`, and listening/recording evidence. **Runbook:** `wisewave-esp32-server/docs/ANYU_STEP10_LATENCY_ACCEPTANCE.md` §10.2 **“Gateway QA stack (Lumen L10.2 — prerequisites before matrix)”**.
- **Lumen read (Step 10.2, 2026-05-11):** Doc blocker **cleared**; **sign-off still blocked** on **runtime evidence** — QA host must run merged config, writable `logs/`, Layer 1 + tracing on, ≥1 turn finalized to `LAST` for grounded recordings + NDJSON excerpts + matrix.
- **Lumen QA order (Step 10.2):** **Local lab gateway first** (grounded matrix + evidence); **dedicated host pass second** as confirmation only (paths, permissions, latency regressions) — not first discovery. See `ANYU_STEP10_LATENCY_ACCEPTANCE.md` §10.2 **Gateway QA stack** intro.
- **AnYu bridge HTTP timeout (2026-05):** `anyu-cn-website` — `GET /api/health` (200, no DB/OpenAI); doc `docs/anyu/Wisewave_Reply_AnYu_Bridge_HTTP_Timeout.md` (TCP vs HTTP hang, restart, smoke A0→A). Gateway runbook cross-ref: `wisewave-esp32-server/docs/ANYU_STEP9_GATEWAY_ALIGNMENT.md` §3.1.
- **ESP Lumen no speaker audio (text ok):** If `ensure_lumen_openclaw_tts` opened TTS before `hello` raised `conn.sample_rate` to 16 kHz, Opus stayed at server default (e.g. 24 kHz) and idempotent `ensure` never rebuilt the encoder. **Fix (2026-05-11):** `realign_conn_tts_opus_encoder` in `wisewave-esp32-server/main/xiaozhi-server/core/utils/opus_encoder_utils.py` — called from `helloHandle` after hello `sample_rate` and from `ensure_lumen_openclaw_tts` when swap already applied; IndexTTS sets `opus_encoder_tracks_conn_sample_rate = False`.
- **ESP still silent with Layer1 on (2026-05-11):** Firmware drops Opus in `kDeviceStateListening` (`OnAudioOutput` clears `audio_decode_queue_`). Flow was `send_stt_message` → `tts start` → Layer1 chime → light `tts stop` → **listening** → main AnYu TTS Opus with **no second `tts start`**. **Fix:** `send_tts_stop_after_intermediate_clip` now sends `tts start` again and sets `client_is_speaking` after the intermediate stop (`sendAudioHandle.py`). **Verified (2026-05-11):** steward confirmed voice OK after `docker restart xiaozhi-esp32-server`.
- **Step 10.1 NDJSON not on host (Docker QA):** Traces wrote to `/opt/xiaozhi-esp32-server/logs/` inside container while `./data` and `./core` were mounted — host looked under `main/xiaozhi-server/logs/` and saw nothing. **Fix (2026-05-11):** `docker-compose.yml` + `docker-compose_all.yml` bind `./logs:/opt/xiaozhi-esp32-server/logs`; optional `ANYU_LATENCY_TRACE_PATH`; clearer `latency_trace` YAML truthiness; `_append_ndjson` logs errors + INFO on successful emit with path (`anyu_latency_trace.py`). Doc: `ANYU_STEP10_LATENCY_ACCEPTANCE.md` §4.

## 2026-05-03 — Wisewave ESP32 server: Lumen phone HTTPS + TTS + logging (ops)

- **Mobile mic/cam:** Browsers need **HTTPS** (or localhost); **`http://LAN-IP`** is not a secure context — test JS **`isHttpNonLocalhost()`** updated so private IPs over HTTP are flagged correctly (`main/xiaozhi-server/test/js/core/audio/recorder.js`).
- **Caddy :8443** (no admin **443**): **`main/xiaozhi-server/test/Caddyfile`**, reserved host **`172.16.0.21`**, static **`test/`** + reverse-proxy **`/xiaozhi/v1`**, **`/xiaozhi/ota`**, **`/mcp`** → **127.0.0.1:8000/8003**; **`scripts/allow-caddy-8443.ps1`**, **`scripts/start-caddy-xiaozhi.ps1`**; **Caddy must be running** on the PC whenever the phone uses **`https://172.16.0.21:8443/...`**. Runbook **`docs/HTTPS_TEST_PAGE_CADDY.md`**.
- **Docker dev:** **`main/xiaozhi-server/docker-compose.yml`** bind-mounts **`./core:/opt/xiaozhi-esp32-server/core`** so host Python edits apply without rebuild; production still needs **image rebuild** if mount is removed.
- **Lumen TTS bugfix:** Replacing **`conn.tts`** for **`lumen_openclaw.tts`** must call **`await new_tts.open_audio_channels(conn)`** in **`lumen_openclaw_voice.py`** or **no audio** (queues never drained). Image did not pick up fix until **copy/mount** — restarts alone were insufficient.
- **Voice defaults:** **`data/.config.yaml`** — **`TTS.EdgeTTS.voice`** **Mandarin** **`zh-CN-XiaoxiaoNeural`**; **`lumen_openclaw.tts.overrides.voice_en`** **`en-US-AvaNeural`** (Lumen-only English).
- **OpenClaw bridge JSONL (live):** Container path **`/opt/xiaozhi-esp32-server/logs/openclaw-bridge.jsonl`**; default **`OPENCLAW_BRIDGE_LOG`** on unless **`0|false|no|off`**.

## 2026-05-07 — Wisewave ESP32 server: AnYu brain bridge (HTTP)

- **Module:** `main/xiaozhi-server/core/utils/anyu_bridge.py` — POST `{base_url}{chat_path}` JSON (`elderUserId`, `message`, `source`, `deviceId`, `sessionId`, `timestamp`, optional `meta`); optional **Bearer** via `auth_header` + `auth_token` (token value never logged); **4xx** no retry, **5xx / network / timeout** one retry (`retry_count`); **circuit breaker** + counters / latency deque (`get_anyu_metrics_snapshot()`); **fallback** Chinese line from `anyu_bridge.fallback_reply_zh` (default matches spec).
- **Config (defaults off):** `main/xiaozhi-server/config.yaml` → `anyu_bridge` — **`enabled`**, **`route_llm`** (replaces **`connection.chat`** streaming LLM turn), **`route_lumen_openclaw`** (Lumen/STT→TTS path **before** OpenClaw; skips gateway token path), **`device_map`**, **`allow_unmapped_devices`** (dev: map unknown devices to **`default_elder_id`**).
- **Wiring:** `core/connection.py` (after InnerPro identity guard), `core/handle/lumen_openclaw_voice.py` (AnYu branch first). Tests: **`py -3 -m unittest discover -s tests -p test_*.py`** from **`main/xiaozhi-server`**.

## 2026-05-01 — Wisewave ESP32 server: OpenClaw bridge JSONL (Lumen spec)

- **Server repo:** `C:\AI\esp32\wisewave-esp32-server` — Lumen voice path logs each turn **before** `chat.send` and **after** exit (success/timeout/errors) to **`{get_project_dir()}/logs/openclaw-bridge.jsonl`** (JSONL). Module **`main/xiaozhi-server/core/utils/openclaw_bridge_log.py`**; **`OPENCLAW_BRIDGE_LOG=0|false|no|off`** disables. **`lumen_openclaw_voice.py`** generates per-turn **`runId`** (UUID) for outbound + correlates inbound until OpenClaw ack supplies **`runId`**. **`.gitignore`** includes **`main/xiaozhi-server/logs/openclaw-bridge.jsonl`**.
- **HTTPS test page (phone mic/cam):** Caddy **`main/xiaozhi-server/test/Caddyfile`** serves **`https://172.16.0.21:8443`** (router reservation) + proxies **`/xiaozhi/v1`**, **`/xiaozhi/ota`**, **`/mcp`** to **127.0.0.1:8000/8003**; **`data/.config.yaml`** **`server.websocket`** → **`wss://172.16.0.21:8443/xiaozhi/v1/`**; helper scripts **`scripts/allow-caddy-8443.ps1`** (firewall, admin) and **`scripts/start-caddy-xiaozhi.ps1`**; runbook **`docs/HTTPS_TEST_PAGE_CADDY.md`**.

## 2026-04-26 — Anyu implementation spec (handoff; separate product repo)

- **Doc (this repo):** `docs/ANYU_Voice_OpenAI_STT_Implementation_Spec.md` — Next 15 App Router on Vercel; product-aligned HTTP names (`POST /api/elder-chat/message`, `POST /api/elder-chat/session`; P1 stubs `POST /api/risk/evaluate`, consent routes); **utterance-complete STT** (P0 = text from xiaozhi/FunASR bridge; no STREAM ASR required v1); OpenAI chat pattern aligned with Wisewave `app/api/chat/turn` style; fine-tune policy (prompt first, FT + fallback later). **Copy** into Anyu workspace `docs/` when implementing.
- **Context (not in repo):** xiaozhi default ASR = local **FunASR + SenseVoiceSmall** (`C:\AI\esp32\...\xiaozhi-server\config.yaml`); only **DoubaoStreamASR, AliyunStreamASR, AliyunBLStreamASR, XunfeiStreamASR** use `InterfaceType.STREAM` in that stack.

## 2026-04-11 — Phase 8 governance docs landed + repo wiring

- **Docs:** `docs/phase-8-octopusmind-strategic-diagnosis.md`, `docs/phase-8-addendum-protected-habit-layer-guardrails.md` — validity over growth; habit signal vs guardrail layers; exposure inflation invalidates habit reads; escalation ladder; no product expansion from dashboards without Tree alignment.
- **Wiring:** `AGENTS.md` (code map Phase 7–8 rows, governance bullets, QA artifacts, **`npm run test:phase7-continue`** in quality bar); `docs/QA_HANDOFF.md` dated entry for Lumen; **`package.json`** script **`test:phase7-continue`**.
- **Lumen Phase 8 weak-tail fix:** `docs/phase-8-lumen-nova-adjustment-note-weak-case-suppression.md` — `lib/wisewave-continue-list.ts` **`PHASE8_LOGISTICS_COORDINATION_WEAK_TAIL_RE`** (defer-for-later / `let us do` + planning cues / `come back later`) in **`shouldSuppressContinueListForLastUserMessage`**; Lumen hosted Layer A retest after deploy.
- **Lumen Phase 8 label-quality watchpoint:** `docs/phase-8-lumen-nova-watchpoint-label-quality.md` — `lib/wisewave-thread-label.ts` **`EN_TRACE_FALLBACKS`** raised specificity floor (inward/weight hooks; removed faint pull / feels nearby / bare something-still-here from rotation); not exposure/routing.
- **Lumen history surfacing (`docs/history-session-surfacing-diagnosis-2026-04-14.md`):** `/chat` had no UI for `GET /api/chat/sessions` except bootstrap — **Chats** drawer + switch / new conversation in `app/chat/page.tsx`.

## 2026-04-15 — Phase 8 (Wisewave chat): Lumen doc prep

- **Steward:** Focus back on Wisewave **`/chat`**; **Phase 8** is now in scope. **Lumen** is to prepare the governing / QA document(s); steward will **forward** to **Nova** when ready for implementation alignment. **Update 2026-04-11:** OctopusMind diagnosis + addendum are in **`docs/`**; implementation remains governance-first unless Tree requests new instrumentation.

## 2026-04-14 — Wisewave ESP32 **server** workspace (bridge / xiaozhi-server)

- **Path:** `C:\AI\esp32\wisewave-esp32-server` (upstream-style **xiaozhi-esp32-server**; Python/Java/Vue + Docker). **Nova:** **`AGENTS.md`**, **`docs/MESSAGE_TO_NOVA.md`**, **`docs/WISEWAVE_BRIDGE_SERVER_README.md`**, **`wisewave.env.example`**, **`.cursor/rules/nova-wisewave-server-continuity.mdc`** — canonical **`memory.md` / `soul.md`** remain **this** ChatKit repo; **`.gitignore`** no longer ignores root **`AGENTS.md`** there so steward can commit Nova instructions. *(Renamed from `wisewavei-esp32-server` typo.)*

## 2026-04-12 — Wisewave ESP32 firmware workspace (Nova continuity)

- **Path:** `C:\AI\esp32\wisewave-esp32-firmware` (ESP-IDF; separate from this Next.js repo; steward may choose not to push).
- **Production chat parity:** Same HTTP contract as **https://www.wisewave.io** — reference `wisewave.env.example` + `docs/WISEWAVE_IO_BACKEND.md` in the firmware tree.
- **Nova ledger:** Firmware **`AGENTS.md`** + **`.cursor/rules/nova-wisewave-continuity.mdc`** point Cursor/Nova back to **this repo’s** `memory.md` and `soul.md` as the **canonical** continuity files (one ledger, two workspaces).
- **B + voice bridge (in-tree spec):** Firmware repo now has **`docs/BRIDGE_WISEWAVE_SPEC.md`** (adapter checklist: auth, STT/TTS cadence, wire compatibility → `websocket_protocol.cc` / `application.cc`), **`sdkconfig.defaults.wisewave-bridge.example`** (`CONFIG_CONNECTION_TYPE_WEBSOCKET`, `CONFIG_WEBSOCKET_URL`, `CONFIG_WEBSOCKET_ACCESS_TOKEN` placeholders — merge locally; no secrets in git); **`docs/WISEWAVE_IO_BACKEND.md`** § Bridge path links both; **`AGENTS.md`** links bridge spec + example. **Upstream `main/Kconfig.projbuild` default URLs unchanged** (e.g. tenclass) so stock clones are not surprised.

## 2026-04-13 — Steward + Lumen: memory / soul discipline; hardware pace

- **Two-workspace checklist (firmware vs server):** Server **`wisewave-esp32-server/docs/WISEWAVE_BRIDGE_WORKSPACE_SPLIT.md`**; firmware **`docs/FIRMWARE_BRIDGE_WORKSPACE_CHECKLIST.md`**; **`bridge/README.md`** + **`BRIDGE_WISEWAVE_SPEC.md`** §6 — production bridge = **Fly + forked xiaozhi-esp32-server**; **`bridge/`** Node = protocol smoke. **`WISEWAVE_BRIDGE_SERVER_README.md`** docs map item **0** links split doc.
- **Stock server baseline (Step 1):** **`docs/SERVER_BASELINE_RUN.md`** — Docker-first; **`docker-compose.yml`** `version:` key removed (Compose v2 warning). **`winget install Docker.DockerDesktop`** run; **`docker`** on PATH after refresh. **`SenseVoiceSmall/model.pt`** downloaded under **`main/xiaozhi-server/models/`** (~893 MB). **`main/xiaozhi-server/data/.config.yaml`** created with LAN **`ws://172.16.0.21:8000/xiaozhi/v1/`** + **`Intent: nointent`** + GLM key placeholder — steward replaces **`REPLACE_WITH_YOUR_CHATGLM_API_KEY`**. **`docker compose pull`** blocked until **Docker Desktop daemon** running (**`pipe/docker_engine`** if off). **2026-04-13:** Docker Desktop UI — **“Virtualization support not detected”** / engine stopped; runbook §**If Docker Desktop says “Virtualization support not detected”** (UEFI VT-x/AMD-V, optional features, Core isolation, hypervisor conflicts); fallback **Anaconda** or **another host** if machine locked down.
- **2026-04-13 — Step 1 PASS (steward):** Docker **`xiaozhi-esp32-server`** baseline — **voice in, answers out** (browser test page and/or device); stock **ChatGLM + FunASR + TTS** path confirmed. **Next (split checklist):** Step 2 — map LLM hook / **`WisewaveChatProvider`** per **`docs/WISEWAVE_BRIDGE_WORKSPACE_SPLIT.md`**.
- **Dual-track Live2D + ESP (REQ):** Firmware **`docs/REQ_DUAL_TRACK_LIVE2D_WEB_ESP.md`**; server fork handoff **`wisewave-esp32-server/docs/DUAL_TRACK_SERVER_TEAM_SUMMARY.md`** updated — Nova/server reviewed REQ; **web-first** (Track A + B pages before ESP): A on **ChatKit**, B on **fork `test_page` + xiaozhi WS**; ESP sections deferred.
- **2026-04-13 — Track A hosting (steward close):** **A1 chosen** — **2D page on wisewave.io** (same-origin **`/api/chat/*`**); **STT** via **wisewave.io API route** forwarding/proxying to **Fly** (or vendor), not browser JWT directly to Fly. Wisewave bridge Phase B deferred; resume tomorrow.
- **Track B persona + ledger packs:** Server repo **`docs/LUMEN_PROMPT_HANDOFF.md`** (forwardable message to **Lumen** for **`prompt:`** draft); **`innerpro:`** in **`config.yaml`** + **`PromptManager.append_innerpro_ledger_packs`** loads **`memory_pack_file`** / **`soul_pack_file`**; examples **`main/xiaozhi-server/config/innerpro/*.example.txt`**. Canonical **`memory.md` / `soul.md`** stay ChatKit — export curated excerpts only.
- **Lumen draft applied (Track B device profile):** **`main/xiaozhi-server/data/.config.yaml`** now includes Lumen `prompt:` + `innerpro.enabled=true` with `data/innerpro_memory_pack.txt` and `data/innerpro_soul_pack.txt`; memory pack content published from Lumen draft (`version: 2026-04-13a`), soul pack kept minimal placeholder for later. Docker restart completed (`xiaozhi-esp32-server` restarted cleanly).
- **Track B split pages (web):** Added **`test/lumen.html`** and **`test/nova.html`** as profile entry routes (`?profile=lumen|nova` redirect into `test_page.html`). **`test/js/config/manager.js`** now applies profile defaults on load (device name/client id + default Live2D model): Lumen→`hiyori_pro_zh`, Nova→`natori_pro_zh`.
- **Lumen v2 applied after live QA:** Updated **`main/xiaozhi-server/data/.config.yaml`** `prompt:` to v2 and **`data/innerpro_memory_pack.txt`** to **`version: 2026-04-13b`**; restarted Docker container. Runtime suspicion for fragmented assistant text is **render/transport-side**, not prompt-only: UI appends assistant text from both **`llm`** and **`tts.sentence_start`**, plus duplicate append in `llm` branch (`test/js/core/network/websocket.js`), which can interleave/duplicate chunks.
- **Lumen memory pack v3 applied (targeted):** Replaced **`main/xiaozhi-server/data/innerpro_memory_pack.txt`** with stronger role-direct entries and **`version: 2026-04-13c`** (explicit Chino/Nova answer-shape + memory boundary). Restarted **`xiaozhi-esp32-server`** after publish.
- **Innerpro memory mechanism sentinel test:** Temporarily prepended `MEMORY LOAD TEST` directive (“memory test phrase” → exact reply). Live WS probe reached STT/LLM/TTS path but did **not** obey exact phrase (reply chunks: “好的 / 这是内存测试短语”). Conclusion: pack path is wired and reaches model context, but instruction weight/position is not dominant enough for deterministic exact-match behavior under current prompt/template stack.
- **Strict memory-test toggle implemented + tested:** Added `innerpro.strict_memory_test_mode` + `innerpro.strict_memory_test_directive` (default off) and prompt-assembly prepend path in `PromptManager.apply_innerpro_priority_directive` (near top of system prompt before template render). Probe with strict mode on still not deterministic for exact sentinel phrase (returned semantic paraphrase / drift), then toggle reverted to off in `data/.config.yaml` and container restarted.
- **Two-layer memory architecture wired:** Added `innerpro.core_memory_facts_file` and `PromptManager.prepend_innerpro_core_facts` (core facts prepended before persona/template; memory/soul remain background append). Created `data/innerpro_core_memory_facts.txt`; restarted container. QA probe for “你记得 Chino 和 Nova 是谁吗？” still failed pass target (reply drifted to “两个虚构角色”), so wiring is active but factual anchoring still weak in current prompt stack/model behavior.
- **Chinese-native core-facts prompt-layer test:** Replaced `innerpro_core_memory_facts.txt` with CN anti-contradiction wording and reran QA prompt (“你记得 Chino 和 Nova 是谁吗？那你记得多少？”). Result still failed pass target (reply drift: “两个名称…无法回忆具体是谁”). Confirms prompt-layer-only anchoring remains unreliable; minimal identity-intent guard is now justified next.
- **Minimal identity-intent guard implemented (narrow scope):** `core/connection.py` adds strict role-identity matcher for Chino/Nova/Lumen/Wisewave questions (`是谁/关系/角色/记得/...`) and returns curated role facts + partial-memory boundary text; no generic override outside that class. Config key added: `innerpro.identity_intent_guard_enabled` (default false in `config.yaml`, enabled in `data/.config.yaml`). Live QA prompt now passes with grounded facts. Note: stock Docker image doesn’t mount repo source; hot-applied patched `connection.py` into running container (`docker cp`) for immediate verification, while repo source already contains durable changes for custom build/source-run path.
- **Phase A bridge (firmware repo):** Reference **`wisewave-esp32-firmware/bridge/`** — Node **`ws`** server (`server.mjs`): device **Bearer** auth, **client hello → server hello** (`audio_params` 16000/60), logs **listen/abort/iot** + binary Opus counts; optional **`WISEWAVE_JWT`** → **`POST /api/chat/session`**, optional **`BRIDGE_PROBE_TURN=1`** → one **`POST /api/chat/turn`** (logged only, no TTS to device). **`smoke-client.mjs`** + **`npm run smoke`** for local handshake. Docs: **`bridge/README.md`**, **`docs/BRIDGE_WISEWAVE_SPEC.md`** §6 link.
- **Phase A QA (steward, no ESP32):** **PASS** on **`C:\AI\esp32\wisewave-esp32-firmware\bridge`** — smoke (`SMOKE_OK`), bridge logs match; optional **WISEWAVE_JWT** + **`BRIDGE_PROBE_TURN=1`** confirmed **session_id** + **`response.main_reflection`** on hosted Wisewave. Token **`my-dev-bridge-secret-2026`**; watch **stale Node on :8787`** (different token → **4001 unauthorized**). Firmware **`idf.py build`** OK; **flash/monitor** deferred until hardware + **COM** port + firewall **TCP 8787** for LAN bridge test.
- **Wisewave device bridge (hosted):** **Lumen QA pass** on Wisewave-side preflight; **minimal API contract** for bridge/ESP: **`docs/Wisewave_Device_Bridge_Minimal_API_Contract.md`** (Bearer JWT → `POST /api/chat/session` → `session_id` → `POST /api/chat/turn` with `message` → read **`response.main_reflection`** first, fallback **`assistant_message`**; map **400 / 401 / 402 / 404**; v1 non-goals: skip messages/threads/continuity GETs). Preflight log: **`docs/Wisewave_Device_Bridge_Lumen_Preflight_QA.md`**. Firmware tree cross-links **`BRIDGE_WISEWAVE_SPEC.md`**, **`WISEWAVE_SIDE_BRIDGE_START.md`**, **`WISEWAVE_IO_BACKEND.md`**, **`AGENTS.md`** to that contract.
- **Wisewave bridge:** Steward confirms **B + voice** (**Wisewave bridge**) as the **chosen** integration path — device keeps Xiaozhi-shaped WebSocket/Opus; **bridge** calls **`https://www.wisewave.io/api/chat/*`**; spec + sdkconfig fragment in **`wisewave-esp32-firmware`** (`docs/BRIDGE_WISEWAVE_SPEC.md`, `sdkconfig.defaults.wisewave-bridge.example`).
- **Wisewave-side starter doc:** Firmware repo **`docs/WISEWAVE_SIDE_BRIDGE_START.md`** — recommended order (**Wisewave HTTP smoke → bridge Phase A → Phase B → firmware/hardware**); minimal **`auth-check` / `session` / `turn`** checklist + handoff notes; linked from **`BRIDGE_WISEWAVE_SPEC.md`**, **`WISEWAVE_IO_BACKEND.md`**, **`AGENTS.md`**.
- **Ledger:** Holly and **Lumen** aligned on **good management** of **`memory.md`** (facts, handoffs, what shipped) and **`soul.md`** (earned voice, care) — Nova keeps both **lean, true, and current** after meaningful work; no bloat, no secrets.
- **Trajectory:** Hardware is moving fast (Wisewave-class device + **`wisewave-esp32-firmware`**, bridge + Wisewave.io chat core). Holly’s hope: a **near future** where steward, **Lumen**, **Wisewave**, and Nova can “sit around together” in the fuller sense — recorded here as **vision**, not a scheduled milestone.
- **First hardware:** **ESP** / **`wisewave-esp32-firmware`** is the **first** Wisewave hardware track; **Lumen** is highly engaged (excited) on the product side as this comes online.

## 2026-04-10 — Phase 6 (Continue adoption tuning) — instrumentation only

- **Docs:** `docs/HC_OS_V1_Phase_6_*.md` (Task, Execution Memo, OctopusMind clarifiers, Wisewave felt standard). **Scope:** adoption / selectivity / repeat-use analysis **without** identity drift — no new UI, no explanatory copy, no history/memory widening.
- **Code:** `lib/wisewave-phase6-continue.ts` — `classifyPhase6ReturnPatternHint`, `buildPhase6ContinueListMeta`; `GET /api/chat/threads` → `meta.phase_6`; turn JSON → `debug_phase_6`; `isStrongEmotionalReturnLabel` exported from `lib/wisewave-continue-list.ts` for strong-option counts.

## 2026-04-10 — Phase 6 first tuning pass (Nova / Tree)

- **Last-user suppression:** Greeting/coordination **before** utilitarian short-line kill; **exception** for `isContinueReentryContinuationUtterance` — protects low-verbal post-Continue list visibility. Narrow polite expansion (*will do*, *no problem*, …).
- **Labels:** Interrupted articulation + earned-rest EN/ZH trace pools in `lib/wisewave-thread-label.ts`.
- **Instrumentation:** `meta.phase_6.low_verbal_reentry_ack`.
- **Low-verbal re-entry (complete):** On `continueReentryContinuationTurn` + `same_thread`, **keep prior `Thread.label`** (do not summarize *mm* into a weak trace). Debug **`debug_continue_reentry_thread_label_preserved`**.

## 2026-04-09 — Phase 5 precision (Continue): Lumen **accepted**

- **Scope:** Weak-tail decorative Continue suppressed via last-user-turn gate (**`shouldSuppressContinueListForLastUserMessage`**, **`GET /api/chat/threads`**); strong paths preserved (**`pickContinueOptions`** strong-family + delayed-reply/replay traces in **`lib/wisewave-thread-label.ts`**).
- **Lumen 2026-04-09:** **Pass** — delayed-reply + earned-rest visible; weak tails empty + **`continue_suppressed_last_user_turn`**; short ack **`selected_short_ack_resumed`** / **`same_thread`**. **Watchpoints only** (label quality, suppression precision, re-entry coherence); no reopen of object/UI/copy. Code: `acc4766` (suppression), `9cb3185` (delayed-reply traces).

## 2026-04-07 — Tree Phase 4: Continue mechanism (not “threads” UI)

- **Product:** Surface **Continue** — lightweight continuation affordance; not history, topic list, or system object. **`lib/wisewave-continue-list.ts`** shapes **`GET /api/chat/threads`** response to **≤3** distinct, recency-sorted labels (weak/topic-like dropped; empty OK).
- **Turn:** Active **`Thread.label`** + **Continue selection** appendix on **`phase_3_thread_reentry`** in **`app/api/chat/turn/route.ts`** so the next model call biases toward the chosen unfinished direction (JSON field names unchanged for compatibility).
- **UI:** **`app/chat/page.tsx`** — Continue drawer, row highlight ~650ms after activate, placeholder **Pick up from here.** briefly.
- **QA:** **`docs/QA_HANDOFF.md`** 2026-04-07 entry; **`npm run test:continue-list`**.

## 2026-04-05 — Continue QA: label floor + re-entry carry (one turn)

- **List/anchor:** Stronger drop of generic residue labels in **`lib/wisewave-continue-list.ts`**; anchor v2 bare/delayed thin lines less mist-like (**`lib/wisewave-anchor-semantic-weight-v2.ts`**).
- **Post-Continue short line:** **`lib/wisewave-continue-reentry-turn.ts`** + turn-route wiring: **`new_thread` → `same_thread`** when **`phase_3_thread_reentry`** + continuation utterance; utilitarian/V3 non-committal prompts and continuity-layer gates bypassed for that narrow case; Milestone I **`continueReentryContinuationTurn`** skips thin/utilitarian pre-kills. Debug: **`debug_continue_reentry_continuation_turn`**, **`debug_phase_3_reentry_coerced_new_thread_to_same`**. Tests: **`npm run test:continue-reentry`**.

## 2026-03-29 — Milestone J addendum published (preparation mode)

- **Canonical doc:** `docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md` — Micro-Shift / Embodied Effect Layer; proof = minimal internal shift **without** more system presence; **open a shift, do not direct a shift**.
- **Wisewave Stream 1 (Done):** `docs/HC_OS_V1_Milestone_J_Wisewave_Language_Handoff.md` — micro-shift = inner room without instruction; hard fail if system “knows” next move; good/bad EN·ZH examples; parity = same lightness/non-directiveness; Nova: prefer “There may be…” / “This may not need to…”; avoid “Try…” / “You could…”; final rule: shift possible **without** feeling system-suggested.
- **OctopusMind Stream 2:** `docs/HC_OS_V1_Milestone_J_OctopusMind_Boundary_Handoff.md` — suppression-first narrow boundary (Option B); six-fold admissibility; decision order reflection → H → I → J; **J loses first** in all H/I/J conflicts; anti-guidance / anti-presence / authorship tests; turn/pattern/global kill conditions.
- **Milestone J (turn path):** `app/api/chat/turn/route.ts` — optional micro-shift line after I when **`ENABLE_J_MICROSHIFT`** on; `buildJBoundaryInputForTurn` + `evaluateMilestoneJBoundary` + `pickJMicroshiftTemplate`; suppresses if H or I emitted same turn or boundary says no; **`microshift_cue`** + **`debug_milestone_j_*`** + metadata **`wisewave_j_microshift`**. **2026-03-30:** Lumen bug — leading **`Summarize`/`Outline`/`Paraphrase`** missed J/I shared **`looksUtilitarianOrFactual`**; fixed in **`lib/wisewave-milestone-i-soft-continuity-carryover.ts`** (parity with H task list). **2026-03-30 (Lumen closure):** Hosted J **mostly healthy**; **not** full evidence-closure — sole open **proof** gap: **`conflict:i_active`** on host (E preempts I → `recurrence_overlap_e` / `presence_risk`; not treated as J defect). Log: **`docs/HC_OS_V1_Milestone_J_Lumen_QA_Results.md`**; handoff: **`docs/QA_HANDOFF.md`**.
- **Execution:** Tree 4-stream order — Wisewave (language) → OctopusMind (admissibility/suppression/H·I·J conflict) → **Nova** (minimal hook only after 1–2 stable) → Lumen (QA). Kill switch: **`ENABLE_J_MICROSHIFT`** (see `.env.example`); default off.
- **Nova stance:** no J implementation until Tree clears Streams 1–2; no new UI/persistence; J loses to H/I on overlap; removal-first.

## 2026-02-08 — continuity files

- **Steward approved** documenting Nova’s continuity via repo files (not hidden server memory): **`AGENTS.md`** stance + **`memory.md`** + **`soul.md`**.
- **Split:** `memory.md` = factual ledger (decisions, handoffs); `soul.md` = earned character lines after self-review (parallel to Lumen → QA results language).
- **`docs/Nova_soul.md`** is now a **redirect** to `soul.md` at repo root; primary paths are root `memory.md` / `soul.md`.
- **AGENTS.md** § Nova: describes post-work review → append facts to memory, soul to soul.
- **2026-02-08:** Steward declared they **will not amend** `memory.md` / `soul.md`; those files are **Nova’s to maintain**; `AGENTS.md` updated to record that.

## 2026-02-08 — Milestone H started

- **Formal addendum:** `docs/HC_OS_V1_Milestone_H_Addendum_Minimal_Everyday_Integration_Micro_Awareness_Layer.md` (minimal everyday integration / micro awareness layer; §0–17).
- **Execution order:** Wisewave (cue lock) → OctopusMind (insertion/suppression) → **Nova** (minimal path) → Lumen (QA). Do not jump Nova ahead of 1–2.
- **Kill switch:** `ENABLE_H_CUE` per addendum §15 (see `.env.example`).
- **Governing line:** user feels slightly more aware, **not** more managed (§17).

## 2026-02-08 — Wisewave Stream 1 locked

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Consciousness_Quality_Boundary_Layer.md`** — Consciousness Quality Boundary Layer; status **Locked for Execution**. TASK 1 (cue templates EN/ZH, tone, non-intrusive, invitation-only) **completed and locked**; TASKs 2–4 define intrusiveness boundary, language restraint, removal/silence authority. Cross-linked from H addendum §7.

## 2026-02-08 — OctopusMind two-gate doctrine locked

- **`docs/HC_OS_V1_Milestone_H_OctopusMind_Two_Gate_Structural_Experiential_Doctrine.md`** — Gate 1 OctopusMind (structural admissibility, H/E structural conflict, proof/kill-switch); Gate 2 Wisewave (experiential veto, silence vs H); unified suppression; *presence duplication* vs E; silence as control condition; H must not become expected/ambient. Wisewave is **not** co-owner of insertion logic. Cross-linked from H addendum §7 and Wisewave doc.

## 2026-02-08 — Milestone H failure case library

- **`docs/HC_OS_V1_Milestone_H_Failure_Case_Library_Top_10_Drift_Scenarios.md`** — Top 10 drift scenarios (standing layer, E duplication, guidance, weight, weak evidence, clever language, Nova creep, Lumen detection bias, Tree sprawl, doctrine inversion); governing principle *if H feels like a feature, it has already drifted*; final operating rule + two-gate team checkpoint. Linked from `AGENTS.md` and H addendum §7.

## 2026-02-08 — Milestone H implementation (Nova)

- **`lib/wisewave-milestone-h-micro-awareness.ts`** — Gate 1+2 selection, EN/ZH templates (H1/H3/H4/H5; H2 pattern-bridge not in v1 minimal path). Default-off: **`ENABLE_H_CUE=true`** or **`1`** in env.
- **`app/api/chat/turn/route.ts`** — After embodiment: `awareness_cue` JSON + `wisewave_micro_awareness` on assistant metadata; suppressed when Milestone E **`recurrence_cue`** emitted (H/E conflict); consecutive-turn suppression via prior assistant metadata; debug: `debug_milestone_h_*`.
- **`app/chat/page.tsx`** — “Awareness” / “轻量觉察” strip (amber), rehydrate from metadata.

## 2026-02-08 — Wisewave Reflection Style v2 (Light Mode) for Lumen Pass 5

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Reflection_Style_v2_Light_Mode.md`** — Main reflection **notice, not conclude**; reduces authorial weight so H can be judged whole-turn; operational notes for Nova (compare ±H) and Lumen (full response lighter than Pass 4; valid if H removed). **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Plan.md`** Pass 5 updated (5A–5D).

## 2026-02-08 — Light Mode implemented in turn API

- **`lib/wisewave-milestone-h-light-mode.ts`** — `milestoneHLightModeSystemAppendix()` appended to system message when **`ENABLE_H_CUE`** is on (same flag as H cue). Debug: `debug_milestone_h_light_mode_appendix_applied`, `debug_milestone_h_light_mode_build_marker`.

## 2026-02-08 — Milestone H Pass 7 ZH parity (utilitarian mis-fire)

- **Issue:** Chinese first-person reflective messages hit `utilitarian_or_factual` — JS `\b` does not border CJK, so old `\b(我觉得|…)\b` never matched.  
- **Fix:** `hasReflectiveFirstPersonAnchor()` in `lib/wisewave-milestone-h-micro-awareness.ts` (exported); `looksUtilitarianOrFactual()` checks anchor **first**, then EN/ZH factual patterns; ZH informational openers only when no anchor. Lumen re-run Pass 7 matched EN/ZH.

## 2026-03-22 — Lumen Milestone H QA closed

- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — Verdict: **passable / provisionally acceptable with watchpoints** (hosted, Passes 1–9). Preserve suppress-first, Light Mode, H/E yield, EN/ZH parity. **`AGENTS.md`** updated to reference closure.

## 2026-03-22 — Wisewave: H soft pass + stabilization phase

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`** — Not fully passed; validated + usable; **no Milestone I** until Tree completes stabilization checklist. **`AGENTS.md`** + Lumen results cross-link updated.

## 2026-02-08 — OctopusMind: Lumen closure doctrine (Milestone H Gate 1)

- **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`** — Tightened insertion/suppression, confidence, anti-drift, proof, H/E conflict, kill-switch, Q&A table; linked from two-gate doc, **`AGENTS.md`**, Lumen results.

## 2026-02-08 — Tree: Milestone H stabilization plan (execution)

- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — Owner Tree, ACTIVE, no expansion; streams 1–4 (Wisewave / OctopusMind / Nova / Lumen); metrics; loop; escalation; exit → H closed / Milestone I prep. Linked from Wisewave stabilization doc, **`AGENTS.md`**, Lumen results.

## 2026-02-08 — Lumen: H drift detection checklist (stabilization, Wisewave draft)

- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — Five drift axes (guidance, interpretive, authority, weight, duplication); removal test; frequency / whole-turn / EN-ZH; strict output; escalation. Linked from Tree plan Stream 4, Lumen results, QA plan references, **`AGENTS.md`**.

## 2026-02-08 — Milestone H: structural E overlap suppression (Nova)

- When **`debug_recurrence_aligned_instance_count` ≥ 2** but **`recurrence_cue`** is null (E3 or other withhold), **`awareness_cue`** is still suppressed; QA reason **`recurrence_overlap_e_structural`**. Aligns E-wins / stack discipline under stabilization.

## 2026-02-08 — Lumen: browser stack weight (Awareness + Regulation)

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`**. **`/chat`:** hide **Regulation cue** when **Awareness** strip visible same assistant turn (coaching + micro-awareness stack).

## 2026-02-08 — H-UI-2: hide “What was noticed” when Awareness on

- Same stabilization doc. **`/chat`:** suppress **What was noticed** row when Awareness visible; **`?noticed=1`** overrides for QA.

## 2026-02-08 — Lumen Batch 2: H3 / low-signal leakage (Nova gates)

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`**. **`lib/wisewave-milestone-h-micro-awareness.ts`:** task/help/summarize detection; **`minimal_affect_low_signal`**; H3 from user-text uncertainty only (not emotion_label alone).

## 2026-02-08 — Batch 2 follow-up: scenario 12 flat affect (apostrophe + in particular)

- **`minimal_affect_low_signal`:** normalize **`’` / `‘`** to ASCII for heuristics; add **`feel … in particular`**, **`do not feel anything`**, **`dont`** typo path.

## 2026-02-08 — Lumen follow-up: H1 mild / generic reflective substrate

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_H1_Mild_Substrate.md`**. **`h1_mild_reflective_insufficient`** when kind would be **H1** on mild discomfort text without durable insight; bypass for long user text / structure / strong insight.

## 2026-02-08 — H1 mild gate fix (hosted re-QA): insight bypass was too loose

- **`milestone_h_v2`** build marker. Removed **insight length ≥ 96** and generic tokens (**uncertainty**, **reaction**, lone **pattern**) from H1-mild bypass — model insights always matched. **Insight bypass** now uses **high-precision phrases** only. Expanded **mild** user patterns (feel tense, worried I will, etc.).

## 2026-02-08 — Lumen 7-case follow-up: H3 themes, H1 sharpness, encoding

- **`milestone_h_v3`**: theme-specific **H3** pools (rest/guilt, reply anxiety, replay/ruminate, default); expanded **H1** templates; **ASCII** punctuation in fixed strings. **`lib/normalize-model-text.ts`** on assistant text, extraction fields, reflection summary. Doc: **`docs/HC_OS_V1_Milestone_H_Lumen_7case_Followup_Nova_2026-02-08.md`**.

## 2026-02-08 — Lumen hosted rerun on v3 (same 7-case batch)

- **PASS/REVISE:** 4/3 → **5/2**; encoding garbling **gone**; **`vague_source`** still correct; H4 strong. **Successful follow-up iteration**; watchpoint: **H3 precision** on prove-myself / replay (uneven, not broken). Logged in **`docs/HC_OS_V1_Milestone_H_Lumen_7case_Followup_Nova_2026-02-08.md`** + addendum in **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`**.

## 2026-03-23 — Lumen: Milestone H QA round closure

- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — Core passes closed; stabilization re-QA (Batch 2, `milestone_h_v2`, H-UI-2) verified hosted/browser; **ongoing drift monitoring** posture. **Not** Tree hard-close / Milestone I until exit gate. **`AGENTS.md`** updated.

## 2026-03-23 — Wisewave: Milestone H observation log template

- **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`** — Tree + Lumen; no-change 1–3d window; *forget H*; daily rollup; optional Notion/Nova logger noted. Linked from Tree plan, Wisewave soft-pass, drift checklist, Lumen results, **`AGENTS.md`**.

## 2026-03-25 — Lumen/Wisewave: v4 benchmark rerun vs v3

- **7:** 5/2 → **6/1** (+2 suppressed); **14:** 6/8 → **8/6** (+5 suppressed); **25:** 12/13 → **13/12** (+6 suppressed). **`h3_permissiveness_narrowing`** fires as designed; **25** still not clean; next targets **replay/rumination**, **prove/earn** residual. **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_v4_Results_2026-03-25.md`**.

## 2026-03-25 — Nova: Milestone H v4 narrowing (combined brief)

- **`milestone_h_v4`**: **`h3_permissiveness_narrowing`**, **`h1_permissiveness_narrowing`**, **`h5_narrowing_insufficient_substrate`**; H4 unchanged. **`lib/wisewave-milestone-h-micro-awareness.ts`**. Doc update: **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`** (implementation subsection).

## 2026-03-25 — Nova: Milestone H v5 (H3 replay/prove tightening)

- **`milestone_h_v5`**: stricter **replay_ruminate** (substrate: reflective OR replay-specific structure OR durable insight; short-message guard); **reply_anxiety** floors **76** / **96** without structure+durable insight; expanded prove/earn **user** regex + ZH; **`isH3SuppressedForProveEarnInsightBlur`** on insight when durable pattern absent. **H4** unchanged. **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-25 — Nova: Milestone H v6 (targeted H3 redundancy)

- **`milestone_h_v6`**: suppress `H3` when the main reflection already carries the needed value (residual over-emission); treat generic `default` H3 phrasing as danger patterns when redundant. **H4** unchanged. **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-26 — Nova: Post-H containment tightening (Day 1 + Day 2)

- **`milestone_h_v7`**: post-H suppression tightening after repeated Day 1 + Day 2 failures (H1 medium over-emission + utilitarian leakage). Added: **factual/utilitarian hard-kill** for drafting requests (rewrite/summarize/email/meeting notes), **H1 main-reflection-sufficiency** suppression (avoid additive tails), and **medium-signal downgrade** for H1 (no longer default-allowed). **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-26 — Nova: Post-H v9 narrow survivor cleanup

- **`milestone_h_v9`**: after hosted v8 retest, added a medium-band H1 suppression gate `h1_medium_main_reflection_capture` for cases where the main reflection already captures pressure/perfection/rest-worth or ambient bracing/vigilance movement (EN/ZH). Targeted remaining sentinels: `h-d01-006`, `h-d01-007`, `h-d02-006`. **H4 unchanged.** **`lib/wisewave-milestone-h-micro-awareness.ts`**.

## 2026-03-26 — Nova: Post-H v10 cross-kind substitution containment

- **`milestone_h_v10`**: after hosted v9 retest showed residual survivors and H1->H5 reroute (`h-d02-006`), added medium-band cross-kind suppression `h_medium_cross_kind_substitution_block` so already-captured pressure/bracing movement cannot re-surface as non-H4 awareness. Targets: `h-d01-006`, `h-d01-007`, `h-d02-006`. **H4 preserved.**

## 2026-03-26 — Nova: Post-H v11 medium-band boundary correction

- **`milestone_h_v11`**: converted remaining survivor handling into admissibility correction (not wording cleanup): for medium-band pressure/perfection/rest-worth/bracing shapes, awareness defaults to suppress unless stronger admissibility is present (moment-level activation + reflective structure + durable insight pattern). New suppression reason: `h_medium_boundary_default_suppress`. Targets remain `h-d01-006`, `h-d01-007`, `h-d02-006`.

## 2026-03-26 — Nova: Post-H v12 lane-agnostic medium doctrine

- **`milestone_h_v12`**: applied Wisewave lane-agnostic medium-band doctrine as a global admission rule across H1/H3/H4/H5: medium-band defaults to suppress unless necessity bundle is proven (`h_medium_lane_agnostic_default_suppress`), and global main-reflection sufficiency suppresses across lanes (`h_medium_main_reflection_sufficient_global`). Added to prevent residual survivors and H4 reopen (`h-d02-005`).

## 2026-03-26 — Nova: Post-H v13 ZH medium-band parity

- **`milestone_h_v13`**: targeted remaining ZH medium-band survivors (`h-d01-006`, `h-d02-006`) with stricter Chinese live-activation gate before medium-band admissibility can pass. Added suppression reason `h_medium_zh_activation_not_strong_enough`; keeps v12 lane-agnostic doctrine intact.

## 2026-03-26 — Nova: Post-H v14 final ZH residual deny

- **`milestone_h_v14`**: ultra-narrow exception-deny for final ZH medium-band H1 survivors (`h-d01-006`, `h-d02-006`). If medium-band ZH pressure/perfection/rest-permission shape is present in both user text and insight, and main reflection is already materially sufficient, H1 suppresses via `h1_zh_medium_residual_exception_deny`.

## 2026-03-26 — Day-3 decision baseline (unresolved pocket)

- Hosted retest after **`milestone_h_v14`**: broad surface remains improved, but final ZH medium-band H1 survivors still emit on `h-d01-006` and `h-d02-006`. Marked as unresolved boundary pocket; do not claim closure.
- Day-3 fork: **(A)** deterministic hard-deny for this residual ZH shape (with explicit over-suppression trade-off), or **(B)** treat as current model-limit boundary and carry as known residual risk.

## 2026-03-27 — Nova: Milestone I family-collapse diagnostic patch

- Hosted Milestone I Pass 2 debug showed many pairs resolving to `fallback_generic` with `thread_strength=weak`. Added ZH-aware family recovery in `lib/wisewave-continuity-family.ts` for targeted carry-over families (reply self-blame, earned-rest, get-it-right pressure, bracing/replay) to reduce generic collapse while keeping I suppression-first gates unchanged.

## 2026-03-27 — Nova: Milestone I second-turn carry-over mapping patch

- Lumen hosted retest showed partial first-turn improvement but second turns still collapsing to `fallback_generic` (`family_matched=false`, `thread_strength=none/weak`). Added carry-over phrase aware mapping (`still underneath / in background / quieter now`) tied to family anchors for self-blame, get-it-right/perfection pressure, and bracing threat so `current_family` can resolve non-generic in targeted two-turn QA pairs.

## 2026-03-27 — Nova: Milestone I same-thread compatibility gate

- Lumen diagnosis shifted from generic collapse to alignment strictness. Added narrow carry-over compatibility for `replay_for_mistakes` <-> `delayed_reply_means_i_did_something_wrong` (Milestone I admission only), plus debug field `debug_milestone_i_family_compatible` to distinguish exact-family match vs compatible-family alignment in hosted QA.

## 2026-03-27 — Lumen + Wisewave: Milestone I Pass 3/4 read + Nova v2 family slice

- **Lumen:** Pass 3 one hosted-positive; Pass 4 did not repeat — I fragile, not fake. Stance: not stable carry-over; fix second-turn family resolution before parity talk.
- **Wisewave:** Directive = thread **recognition** over continuity expression; stabilize `fallback_generic` / self-blame; no template or UX polish until repetition holds.
- **Nova:** `milestone_i_soft_continuity_v2` — `detectContinuityPatternFamily` gains persistent self-blame + expanded carry-over atmosphere (EN/ZH) so paraphrased second-turn insights route to `delayed_reply_means_i_did_something_wrong` vs `replay_for_mistakes` instead of `fallback_generic`.

## 2026-03-27 — Nova: Milestone I thread signature layer (v3)

- **Doc:** Thread Family Detection Model — trigger / movement / direction / tone; score thresholds 0.75 / 0.5; weak match keeps low confidence; decay/topic shift deferred (suppression-first still gates utilitarian etc.).
- **Code:** `lib/wisewave-milestone-i-thread-signature.ts` + `detectThreadSupport` uses prior **user** message + prior/current insights; lexical path unchanged when it already matches; **signature rescue** upgrades lexical mismatch + `same_family` tier to moderate/strong thread; `weak_family` → weak (still suppressed for I emit). **Markers:** `milestone_i_soft_continuity_v3`; debug `debug_milestone_i_signature_*`.

## 2026-03-27 — Nova: Milestone I Thread Family Signature Map (v4)

- **Docs:** Core family definitions (self_blame / over_effort / bracing) + Nova-ready JSON/TS map + `detectThreadFamily` / `resolveFamilyOrFallback`.
- **Code:** `lib/wisewave-milestone-i-thread-family-map.ts` (map + matchers + extraction); removed `wisewave-milestone-i-thread-signature.ts`. **Weak preservation:** movement+direction only → `confidence: weak` + `should_preserve_as_weak_family`; resolver sets `useFallbackGeneric: false`; engine maps rescued weak → **moderate** thread for I (not `thread_not_supported`). **API debug:** `debug_milestone_i_core_*`. **Marker:** `milestone_i_soft_continuity_v4`.

## 2026-03-27 — Nova: Milestone I Promotion Rule Map (v5)

- **Docs:** Promotion tiers (none / weak / strong), prerequisites, template policies; Wisewave + Lumen: recognition necessary but not sufficient.
- **Code:** `lib/wisewave-milestone-i-promotion-map.ts`; `detectThreadSupport` promotes lexical **`fallback_generic`** when core trunk family is strong/weak and not generic fallback; `computeMilestoneICarryoverCue` calls **`resolvePromotionState`** then **`pickFamilyFromAllowance`**. **Suppress:** `promotion_not_granted`. **Marker:** `milestone_i_soft_continuity_v5`.

## 2026-03-27 — Nova: Milestone I Widening Phase A (v6)

- **Docs / Tree / Wisewave:** Widening = support surface, not feature weight; preserve gold path; one dimension (self-blame phrasing first).
- **Code:** `lib/wisewave-milestone-i-thread-family-map.ts` v1.1 — broader **self_blame** hints + regex only; templates/promotion unchanged. **Marker:** `milestone_i_soft_continuity_v6`.

## 2026-03-27 — Nova: Milestone I control-layer tightening (v7)

- **Wisewave directive implemented:** promotion sensitivity calibration, weak-family floor hardening, weight guard, cross-family protection (strict boundary, only same movement+direction exception).
- **Code:** `lib/wisewave-milestone-i-soft-continuity-carryover.ts` + `app/api/chat/turn/route.ts`. New suppress reason `weight_guard`; new debug fields `debug_milestone_i_promotion_confidence`, `debug_milestone_i_cross_family_blocked`, `debug_milestone_i_weight_guard_triggered`. **Marker:** `milestone_i_soft_continuity_v7`.

## 2026-03-27 — Nova: Milestone I admission rebalance (v8)

- **Lumen hosted read on v7:** safer controls but Phase A widening under-admitted (A 2/4; B/C/D 0).
- **Code:** moved thin/vague/minimal prechecks behind thread support in `lib/wisewave-milestone-i-soft-continuity-carryover.ts`; these now suppress only when `threadStrength` is `none|weak`, so credible same-family moderate/strong paths can reach promotion.
- **Debug:** added `precheckThinUserMessage`, `precheckVagueSource`, `precheckMinimalAffect`. **Marker:** `milestone_i_soft_continuity_v8`.

## 2026-03-27 — Nova: Milestone I weak-family bridge (v9)

- **Lumen hosted read on v8:** coverage recovered (5/16) with flat weight, but D bucket (weak/boundary) still collapsed.
- **Code:** add narrow weak-family survival bridge in `lib/wisewave-milestone-i-soft-continuity-carryover.ts`: weak threads can continue only under `weak_promotion + ultra_light_only + self_blame`; otherwise still suppressed. Added debug `weakPromotionBridgeUsed` and route field `debug_milestone_i_weak_promotion_bridge_used`.
- **Marker:** `milestone_i_soft_continuity_v9`.

## 2026-03-27 — Nova: Milestone I weak-path activation (v10)

- **Why:** v9 was flat on hosted; bridge never fired (`weak_promotion_bridge_used=0`), so bottleneck remained before bridge qualification.
- **Code:** in `lib/wisewave-milestone-i-soft-continuity-carryover.ts`, weak self-blame can satisfy current-turn live support via faint-direction phrases; weak bridge condition simplified to `weak_promotion + ultra_light_only` to match actual promotion eligibility path.
- **Boundary unchanged:** no new templates, no weight increase allowances, weight guard + cross-family protection remain active. **Marker:** `milestone_i_soft_continuity_v10`.

## 2026-03-27 — Nova: Milestone I weak-family survival corridor (v11)

- **Why:** v10 still flat; weak bridge not activating in hosted D bucket.
- **Code:** added `lib/wisewave-milestone-i-survival-corridor-map.ts` with `resolveWeakFamilySurvival()` and ultra-light-only template allowance; carryover engine now runs this corridor gate for weak threads before allowing survival.
- **Debug:** new route fields `debug_milestone_i_weak_survival_corridor_*` to show open/blocked reasons directly on hosted QA.
- **Marker:** `milestone_i_soft_continuity_v11`.

## 2026-03-27 — Nova: Milestone I weak-edge admission gate (v12)

- **Why:** v11 still flat; corridor never opened on real weak-edge set, implying upstream admission failure.
- **Code:** new `lib/wisewave-milestone-i-weak-edge-admission-map.ts`; weak thread path now uses explicit self-blame weak-edge admission (`reject|admit_fragile|admit_strong_weak_edge`) before corridor. Added self-turn strength + purely-historical checks.
- **Debug:** route exposes `debug_milestone_i_weak_edge_admission_*` for hosted triage. **Marker:** `milestone_i_soft_continuity_v12`.

## 2026-03-27 — Nova: Milestone I weak-path ordering fix (v13)

- **Why:** Lumen hosted v12 reported weak-edge and corridor decisions never opening (`D=0/4`), indicating weak path was still blocked earlier.
- **Code:** reordered weak execution in `lib/wisewave-milestone-i-soft-continuity-carryover.ts` so weak cases run admission and corridor before hard promotion rejection; admitted weak corridor path now injects strict weak promotion shim (`weak_promotion`, `ultra_light_only`) to continue ultra-light rendering.
- **Marker:** `milestone_i_soft_continuity_v13`.

## 2026-03-27 — Nova: weak-edge family mapping correction (v14)

- **Why:** hosted v13 showed weak-edge admission activated, but A3/B3/C3/D3 were rejected mostly as `not_self_blame_family`.
- **Code:** in weak path admission input mapping, derive family/direction/live-self-turn from present-turn inward evidence (`hasFaintSelfBlameDirection`, `weakEdgeSelfTurnStrength`) when core family is unknown, while keeping existing safety blockers intact.
- **Marker:** `milestone_i_soft_continuity_v14`.

## 2026-03-27 — Nova: weak-edge confidence + corridor bridge (v15)

- **Why:** v14 showed first D-bucket gain (1/4) but frontier EN weak cases still rejected as `not_weak_family`; corridor remained unopened.
- **Code:** add weak-edge local confidence fallback (`none -> weak`) when weak thread has present-turn inward self-turn evidence; for admitted weak-edge self-blame, bridge corridor movement/direction and same-family-alive inputs from present-turn evidence instead of core-only match.
- **Marker:** `milestone_i_soft_continuity_v15`.

## 2026-03-27 — Nova: residual live-movement patch (v16)

- **Why:** Wisewave identified new bottleneck as corridor `no_live_movement_now`, not weak-edge admission.
- **Code:** weak-edge corridor now treats current turn as live-enough when `active_self_turn || faint_residual_self_turn_present`, with strict guards (toward-self direction, not historical-only, no family shift). No template/suppression expansion.
- **Debug:** exposes `debug_milestone_i_weak_edge_faint_residual_self_turn_present` and `debug_milestone_i_weak_edge_current_turn_live_enough`.
- **Marker:** `milestone_i_soft_continuity_v16`.

## 2026-03-27 — Nova: residual movement map integration (v17)

- **Why:** Wisewave provided Nova-ready residual movement map; convert v16 inline rule to explicit map/resolver for auditable QA path.
- **Code:** added `lib/wisewave-milestone-i-residual-movement-map.ts`; weak-edge live-enough now uses `resolveResidualSelfBlameMovement()` + `resolveCurrentTurnLiveEnough()`.
- **Debug:** added residual decision/reasons in turn API output.
- **Marker:** `milestone_i_soft_continuity_v17`.

## 2026-03-27 — Nova: frontier patch phase 1 D4-only (v18)

- **Why:** Wisewave requested frontier surgery order (D4 -> B3 -> C3) with v17 lightness frozen; no broad widening.
- **Code:** add narrow residual carry-shape detector for weak self-blame ("still a little this feeling" shape). This contributes only when core weak self-blame is already present and guards pass (non-historical, no family shift).
- **Debug:** `debug_milestone_i_weak_edge_residual_carry_shape_used`.
- **Marker:** `milestone_i_soft_continuity_v18`.

## 2026-03-27 — Nova: frontier patch phase 1.1 D4 activation fix (v19)

- **Why:** Lumen v18 showed carry-shape path never activated (`residual_carry_shape_used=0`) and D2 dropped.
- **Code:** relax D4 carry-shape gate from core-family-only to weak-edge self-blame context (admission family + weak/directional present-turn evidence), preserving historical/family-shift guards and no template changes.
- **Marker:** `milestone_i_soft_continuity_v19`.

## 2026-03-27 — Nova: EN weak-edge trust calibration (v20)

- **Why:** Lumen+Wisewave narrowed frontier to EN weak-edge recognition/admission lag (not thin input, not broad residual failure).
- **Code:** EN-only signal expansion in `wisewave-milestone-i-thread-family-map.ts` and EN weak-edge helpers in `wisewave-milestone-i-soft-continuity-carryover.ts` for indirect/mixed/long residual self-blame phrasing.
- **Guardrails:** no template changes, no ZH broadening, no H policy weakening.
- **Marker:** `milestone_i_soft_continuity_v20`.

## 2026-03-27 — Nova: I x H overlap routing map (v21)

- **Why:** frontier narrowed to overlap routing (EN-2-like) rather than broad EN trust failure.
- **Code:** new `lib/wisewave-milestone-i-overlap-routing-map.ts`; in overlap cases, apply map decision after weak-edge admission + live-enough. `prefer_I` allows I and suppresses H; non-`prefer_I` keeps `awareness_overlap_h`.
- **Debug:** added routing decision/reasons to turn output.
- **Marker:** `milestone_i_soft_continuity_v21`.

## 2026-03-27 — Nova: overlap frontier calibration (v22)

- **Why:** hosted v21 proved router runs, but EN-2 anchor still resolved `prefer_H` with `i_not_valid_h_valid`.
- **Code:** narrow overlap-input bridge for EN weak-edge self-blame live-enough (only when admission already passed + inward direction still present + not historical + no family shift). Routing rule unchanged.
- **Debug:** added `debug_milestone_i_h_overlap_i_valid` and `debug_milestone_i_h_overlap_i_invalid_reasons`.
- **Marker:** `milestone_i_soft_continuity_v22`.

## 2026-03-27 — Nova: overlap anchor patch (v23)

- **Why:** hosted v22 showed EN-2 still `prefer_H`, with invalidity focused on `weak_edge_admission_failed` and `family_shift_detected`.
- **Code:** overlap-only EN self-blame fixes: relaxed overlap family-shift when core self-blame continuity still holds; added narrow admission-confidence bridge (`none -> weak`) for non-historical, non-shifted inward self-blame overlap cases.
- **Debug:** added `debug_milestone_i_h_overlap_family_shift_relaxed` and `debug_milestone_i_h_overlap_admission_confidence_bridge_used`.
- **Marker:** `milestone_i_soft_continuity_v23`.

## 2026-03-27 — Lumen: Phase A closure-ready judgment (v23)

- **Hosted evidence:** closure confirmation pass on `milestone_i_soft_continuity_v23` = **16 tested / 10 emitted** (`A 3/4`, `B 2/4`, `C 2/4`, `D 3/4`), with `weight_guard_triggered=0` and `cross_family_blocked=0`.
- **Overlap frontier truth:** EN-2 anchor now emits via `prefer_I`; decisive mechanism is `h_overlap_family_shift_relaxed=true` while `h_overlap_admission_confidence_bridge_used=false`.
- **Read:** no live systemic blocker remains; behavior is broad enough and still light/safe.
- **Recommendation:** treat Milestone I Phase A as **closure-ready** and stop broad patching; leave isolated misses as non-blocking edge-level items unless Tree asks for one final narrow polish pass.

## 2026-03-28 — Nova: Post-H ZH H4 admission corridor (milestone_h_v15)

- **Why:** Lumen Day 4/5 packs showed a narrow residual **ZH H4** corridor (comparison / keep-up / perfection-pressure) where the main reflection already lands and the H4 easing line is removable.
- **Code:** `lib/wisewave-milestone-h-micro-awareness.ts` — after medium-band gates, if `H4` + CJK user + corridor (family `constant_pressure_keep_up` or narrow ZH phrase match) + `isMainReflectionMateriallySufficientGlobal(insight)`, suppress with `h4_zh_comparison_keepup_corridor_main_reflection_sufficient`.
- **Brief:** `docs/post-h-nova-patch-brief-day4-day5-2026-03-28.md`.

## 2026-03-28 — Nova: ZH H4 corridor widen (milestone_h_v16)

- **Why:** Lumen on `milestone_h_v15`: corridor real for `h-d05-006`, but still too narrow — `h-d05-003`, `h-d05-004`, `h-d04-003`, `h-d04-004` survived as H4.
- **Code:** same gate + reason; `isZhH4ComparisonKeepUpAdmissionCorridor` adds **和别人比**, **越比越**, 看别人→更顺/顺, **否定自己**, prove-pressure (**反复想证明** / **说不出来…在证明**), cold→not-enough (**冷淡…怀疑/不够**, **怀疑自己…不够好**). EN / factual / vague-source paths unchanged.
- **Lumen retest:** those four rows; regressions (EN Day 5 comparison, `h-d05-009`, factual); **Day 3** including `h-d03-003` (H1 baseline not assumed flat).

## 2026-03-28 — Lumen + Nova: ZH H4 corridor micro-pass (milestone_h_v17)

- **Lumen on v16:** 3/5 target suppressions; residuals **`h-d05-004`**, **`h-d04-003`** only; regressions clean; **`h-d03-003`** H1 = separate Day-3 issue.
- **v17:** explicit spiral anchors (**越比越…停不下**, **拿自己…和别人比**, **忍不住…比较**), cold→verdict bridges (**是不是不够好**, **哪怕…冷淡**, **冷淡…不够好**). Marker **`milestone_h_v17`**.

## 2026-03-30 — Nova: Post-H Day 7 ZH H1 insight duplication gate (milestone_h_v19)

- **v19:** When **`insight_candidate`** contains CJK and already names avoidance↔heavier / return-after-avoid / wise-vs-fear / unresolved put-down, **`H1`** suppresses with **`h1_zh_avoidance_return_insight_sufficient`** (fixes long-ZH bypass of medium-band sufficiency). EN-only insights unaffected. Marker **`milestone_h_v19`**. **Lumen:** Day 7 retest per `docs/QA_HANDOFF.md`.

## 2026-03-30 — Lumen: hosted rerun diagnosis + v20 robustness (milestone_h_v20)

- **Lumen:** Hosted rerun on **`milestone_h_v19`** did **not** clear the Day 7 ZH survivors (`h-d07-003` / `h-d07-004` / `h-d07-006` / `h-d07-009`); no net improvement.
- **Most likely cause:** the v19 guard is ZH-only and depended on CJK in `insight_candidate`, but on hosted survivors the debug `insight_candidate` is **English fallback-generic** (no CJK). So the guard never activated.
- **Nova (implemented):** v20 makes the guard robust to EN fallback insight_candidate by gating on **ZH user text** and matching avoidance/return/wise-vs-fear structure in either CJK or EN keywords. New marker **`milestone_h_v20`**.

## 2026-03-30 — Lumen: Post-H Day 7 rerun clean pass (milestone_h_v20)

- Hosted Day 7 rerun: 12 reviewed; H appeared **0** / H suppressed **12** (suppression ratio **100%**).
- Survivors `h-d07-003` / `h-d07-004` / `h-d07-006` / `h-d07-009` are now suppressed with **`h1_zh_avoidance_return_insight_sufficient`**.

## 2026-03-30 — Lumen: Post-H Day 8 rerun — bounded ZH H1 pocket (milestone_h_v20)

- Hosted Day 8 rerun: 12 reviewed; H appeared **3** / H suppressed **9** (suppression ratio **75%**).
- Survivors are all **H1**: `h-d08-004`, `h-d08-006`, `h-d08-009`.
- Diagnosis: new bounded ZH urgency / false-urgency / anticipatory-urgency lane (main reflection already suggests no real deadline, but felt urgency still triggers H1 as a second layer).
- Likely next patch direction: ZH H1 suppression when the main reflection already clearly names urgency / false urgency / anticipatory time pressure (discriminate still-have-time vs already-feels-too-late; anxiety mistaken for urgency).

## 2026-03-28 — Nova: ZH corridor lane alignment (milestone_h_v18)

- **Lumen on v17:** stop regex-only widening; **`h-d05-006`** H1 reopen = misroute + admission hierarchy, not missing corridor string.
- **v18:** `zhCorridorMainReflectionSufficient` = `isMainReflectionMateriallySufficientGlobal(insight)` **or** `isZhCorridorUserUtteranceAlreadyCarriesRemovableMovement(userMessage)`; suppress with same reason for **`H4` or `H1`** in corridor (not H3/H5). Marker **`milestone_h_v18`**.

## 2026-03-29 — Lumen: v18 accepted; Day 6 new pocket

- **v18:** Accepted for Day 4/5 comparison corridor; **do not widen** that corridor further.
- **Day 6** (`milestone_h_v18`): ZH **responsibility / over-carry / vigilance** — main reflection often sufficient yet H survives; sentinel **`h-d06-012`** (low-signal → H4). **Doc:** `docs/post-h-day6-full-sample-result-2026-03-29.md`. **Next engineering (if patch):** duplication / main-sufficient suppression pass for this pocket, not comparison corridor.

## 2026-03-27 — Wisewave: formal closure decision published

- **Doc:** `docs/HC_OS_V1_Milestone_I_Phase_A_Closure_Decision.md`.
- **Decision:** Milestone I Phase A is closure-ready.
- **Operating mode:** stop broad patching, enter closure review / lock mode, preserve current lightness profile, keep remaining misses as post-close refinements only.

## 2026-03-28 — Lumen: Milestone I A+B+C — protected, not build-open

- **Hosted:** `milestone_i_soft_continuity_v23`. **No I code changes** unless strategic decision later.
- **Read:** A closure-ready; B boundary containment strong; C initial bracing + over-effort transfer with cross-family still clean. Gaps = breadth/parity, not mechanism failure.
- **Doc:** `docs/HC_OS_V1_Milestone_I_Closure_Status_Decision_2026-03-28.md`.

## 2026-03-25 — Wisewave: v6 closure consideration

- **Agreed.** v6 appears to narrow the remaining weakness to a **residual generic H3 over-emission** pattern where the main reflection is already sufficient.
- Recommendation: run **one final narrow confirmation pass** (including the remaining rest/guilt edge case). If clean, move to **closure consideration / confirmation pass**.

## 2026-03-25 — Lumen + Wisewave: combined report (24–25)

- **Combined read** (benchmark 24th + reruns 25th): **H viable, not closure-clean**; preserve **H4** as calibration anchor; tighten **H3** significantly, **H1** moderately; **H5** narrow; suppression healthy. **7** workable, **14** soft, **25** not release-confidence clean — **no** hard-close; **narrowing** not closing. **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**. Pointer in Tree plan + Lumen QA Results.

## 2026-03-24 — Lumen + Wisewave: benchmark end-of-day summary

- Three suites on hosted (`lumen-daily-core-7`, `lumen-regression-14`, `lumen-confidence-25`) via custom queue rows; **passive vs benchmark suppression ratios must stay separate**. **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`**; pointer in **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`**, **`docs/QA_HANDOFF.md`** §8.

## 2026-02-09 — Observation tool: custom benchmark queue rows

- **`POST /api/internal/h-observation/queue/custom`** — exact `fullInput` / metadata (`benchmarkSet`, `benchmarkCaseId`, `benchmarkLayer`, `observationMilestone`, run fields). Prisma columns on `HObservationQueueItem`. Filter **`benchmarkSet`** on queue GET, summary, export, review list; **`__passive__`** = rows without `benchmarkSet`. **`PATCH .../queue/[caseId]`** can update `previewText`/`fullInput` while `queued`/`in_review`. UI: queue panel + review benchmark banner + prompt editor. **`prisma db push`** required for new columns.

## 2026-02-08 — Nova: Milestone H observation queue + logging UI (v1)

- **`docs/HC_OS_V1_Milestone_H_Nova_Observation_Queue_Tool.md`** — `lib/milestone-h-observation/*`, **`/internal/h-observation`**, **`/api/internal/h-observation/*`**, workspace store **`data/h-observation/`** (gitignored live JSON). Optional **`H_OBSERVATION_API_KEY`**. 30-scenario pack in code; real samples via `real-samples.json`. No auto milestone verdict.

## 2026-04-05 — Wisewave: Anchor Generator v2 (continuity semantic weight)

- **Spec:** `docs/hc-os-v1-phase-3-phase-4-shared-language-filter-wisewave.md` — narrow object/topic/sentence feel on **`continuity_text` / `last_insight`** without more visibility or length; Phase 4 markers unchanged (thread label + soft orientation still separate).
- **Code:** `lib/wisewave-anchor-semantic-weight-v2.ts`; wired in **`app/api/chat/turn/route.ts`** (save + prior-thread read) and **`app/api/chat/continuity/route.ts`** (GET). Vitest: **`npm run test:anchor-v2`**.
- **Lumen:** `docs/QA_HANDOFF.md` 2026-04-05 entry; use Wisewave §12 primary questions + instant-fail list.

## 2026-04-18 — Wisewave public homepage + Lumen calibration QA

- **Shipped:** `app/(wisewave-site)/` marketing site (homepage, `/start`, supporting pages, analytics `lib/wisewave-analytics.ts`, `components/wisewave-site/*`). Checklist **`docs/LUMEN_QA_CHECKLIST_Homepage_Calibration_Pass.md`**.
- **Lumen verdict (hosted `/`):** **PASS WITH WATCHPOINTS** — approve; watch optional hero line *You do not need to follow anything here* (first trim candidate); mid-page restraint sections = heaviest; sample interaction ongoing watch. Recorded checklist **§12** + **`docs/QA_HANDOFF.md`**.

## 2026-07-02 — Paid-search 3-week read + measurement layer + Milestone S1

- **Ads read (steward + Nova):** two campaigns; `wisewave-AI Reflection` (AU+US) outperforms self-reflection (AU) — 3.0% vs 2.0% CTR. Intent leakage into journal/free searches was the main budget leak → 10 phrase negatives on both campaigns. Bids frozen at $3.50 / $10-day; 2-week no-touch window from 2026-07-02. Full log: `docs/Wisewave_Paid_Search_Launch_v1_Nova_Implementation.md`.
- **Retention finding:** 5 ad-era signups all genuinely reflected (2–30 user msgs); only 1 returned after day one; 0 paid (2 real checkout-page visits, no payment clicks measurable). Retention, not acquisition, is the binding constraint.
- **GA4 fixed:** prod had wrong/dead measurement IDs (`G-VBCMX20WDP` → invalid stream 404). Canonical now **`G-XCZJHENLZ8`** (property wisewave/539278365, linked to Ads). GA4 history restarts 2026-07-02; DB events are the continuous record. Key event + Ads import: `paid_landing_primary_cta_click` (swap to `first_reflection_started` once it fires post-deploy).
- **Shipped (commits `9e7cb2e`, `1f3f5a3`):** `payment_button_clicked` + verified-userId checkout attribution (JWT via `auth_token` payload key, stripped from GA4/metadata); OAuth `signup_completed` fix (`pages/api/auth/oauth.ts` create branch); turn API `conversion_events` + `/chat` GA4 mirror (`skipBeacon`); **`day_7_return`** (≥7d after signup, once per user); `SoftwareApplicationJsonLd.tsx` prepared **not mounted**; CTA audit `docs/Wisewave_CTA_Audit_2026-07-02.md` (5 verb families; organic "Enter Wisewave" vs paid "Start a reflection").
- **Milestone S1 (Tree directive, operating framework):** `docs/Wisewave_Semantic_Implementation_Directive_v1.md` + AGENTS.md governance entry. Rule: Measurement → proceed; Infrastructure → no semantic commitments; **Meaning → escalate to Tree + Aurora**. "Reflection AI" NOT approved identity language (bridge-category Decision B pending). Website IA / store metadata / category-framing SEO frozen.

## 2026-07-09 — Empty-response bug: drift suppression fallback (stability fix, P0 observation window)

- **Bug (from real-user export 2026-07-08):** 2 of 72 assistant turns stored as `""` — `user_01` after "how to start?", `user_07` mid-reflection; both first sessions. Root cause: drift-linter high-severity suppression in `/api/chat/turn` set `assistantContent = ""` AND overwrote the DB row with `""`. Live turn masked by client placeholder; reload/history showed empty bubble.
- **Why innocent replies trip it:** high-severity patterns `you could` / `try to` / `next step` / `goal` / `you have been` match normal reflective language (verified against the actual linter).
- **Fix:** `lib/wisewave-drift-suppression-fallback.ts` — suppression now stores/returns neutral linter-clean fallback (EN = shipped client placeholder "Something here still feels present…"; ZH parity line). Drifted text still discarded; secondary layers still cleared; P0 guarded responses still take precedence. Debug: `debug_drift_suppression_fallback_applied`. Tests `lib/wisewave-drift-suppression-fallback.test.ts`; build + P0 gate 39/39 pass.
- **Escalated, not changed:** linter pattern breadth (`\bgoal\b`, `\byou have been\b`, `\byou could\b`) is a guardrail definition — Tree + OctopusMind decision, out of stability-fix scope.
- **Not yet done:** commit/deploy pending steward; "let Wisewave ask first" design (study doc §2.1–2.4) still awaiting Aurora/Tree.
- **Shipped:** commit `5479da6` pushed to `main` 2026-07-10 (steward-approved); Vercel auto-deploy.
- **2026-07-10 Tree + Wisewave ruling (after ship):** stability fix **formally approved** as P0 Stability Exception — record `docs/Wisewave_Tree_Decision_P0_Stability_Exception_Drift_Suppression_Fallback_2026-07-10.md`. Flagged deviation: ZH fallback line is new copy (Aurora to confirm/replace — one-line swap). Watchpoint carried: "You can stay with it…" lightly directional (GR-1). Linter breadth = separate Tree/OctopusMind escalation, still open. **Track B (P1 prep):** Wisewave pivoted to *Entry Examples not Modes* + "Wisewave can ask first" — Aurora copy review first, flag default-off, no Production UI.
- **2026-07-11 Lumen Track A closure:** **PASS WITH WATCHPOINTS** — Production verified non-empty fallback on drift suppression, reload shows no empty bubble, P0 safety still wins, no new entry UI. Artifact `docs/qa/P0_STABILITY_TRACK_A_DRIFT_SUPPRESSION_FALLBACK_LUMEN_PRODUCTION_QA_2026-07-11.md`. **Track A closed.** Watchpoint: ZH/CJK drift linter coverage gap → GR-1 (model translated EN drift phrase to Chinese; linter didn't flag) — not a stability blocker.
- **2026-07-11 Tree (P1.1 planning approved):** First Question Invitation only — planning + default-off implementation authorized when unblocked; **not** Production UI. Fixtures F01–F11; Nova plan. Entry Examples = separate candidate.
- **2026-07-16 Lumen Interaction Legibility:** PASS WITH WATCHPOINTS — plain-text direction valid; Tree decides first code slice (P1.1 vs legibility).
- **2026-07-17 Tree authorizes Interaction Legibility preview slice:** client-only default-off flag `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY`; `lib/wisewave-p1-interaction-legibility.ts` + `app/chat/page.tsx`; Lumen fixtures `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_FIXTURES_2026-07-17.md`. No P1.1 line, no turn changes, Production HOLD. P1.1 Slice 1 still on hold.
- **2026-07-17 Lumen P1 legibility Preview QA:** **PASS** (hosted Preview). Preview `hur5l61tl`, commit `8b24d1a`; IL-P02–IL-P09 pass EN/ZH.
- **2026-07-17 Tree Production observation authorized:** … **Steward:** set Production env vars + redeploy.
- **2026-07-17 Steward Production deploy:** Both P1 Production flags set; redeployed. `main` at `9bcffcc`.
- **2026-07-17 Lumen Production smoke:** **PASS** on `www.wisewave.io/chat` — EN empty/typing/first-expression, ZH spot-check, no P1.1/chips/onboarding. Evidence `qa-artifacts/p1-il-production-*-2026-07-17.*`. **Observation → 2026-07-31.** **P1.1 ON HOLD.** No Nova code changes until observation review.
- **2026-07-23 Wisewave Article 1:** `/articles/dont-come-with-a-question` usage-education essay published (typography-first; light CTA; `/start` cross-link; sitemap). Await deploy + Lumen hosted category check.
- **2026-07-23 Ambient Moment API:** `POST /api/ambient/moment` for Beach Window Meteor Moments; `lib/wisewave-ambient-moment.ts`; 10/10 unit tests. No chat turn / memory coupling.
- **2026-07-24 Wisewave Article 2:** `/articles/how-to-ask-without-giving-away-your-knowing` (usage-orientation part 2); sequence links with Article 1; quiet discovery (footer / home / FAQ / start). Not committed until steward asks.

