# Nova — Stage 1 Semantic Fidelity C1–C6 Correction Record

**Date:** 2026-09-21  
**From:** Nova  
**To:** Founder / Steward · cc Tree · Lumen  
**Re:** Founder Semantic Fidelity Ruling on DRAFT v1.3 (2026-09-18) — corrections incorporated  
**Spec:** `docs/Wisewave_First_Conversation_Return_Mechanism_Stage1_Interaction_Spec_v1_DRAFT.md` (**v1.3.1**)  
**Ruling reviewed commit:** `88199dcdff01ad580c5f649291161f45f595f953`  
**Disposition claimed:** **PASS WITH CORRECTIONS SATISFIED**  
**Authorisation:** design-only · **no** implementation, Preview, Production, or Continue expansion

---

## 1. Correction map

| ID | Correction | Amended sections / tests |
|---|---|---|
| **C1** | Restore locked entry copy byte-for-byte (curly quotes / apostrophe) | §2.1 `ENTRY_V2` EN/ZH; §2.8 byte-for-byte constants test still governs — implementation constants must use U+201C / U+201D / U+2019, not ASCII |
| **C2** | Keep activated `FQ_QUESTION` visible until first message submit or explicit cancel | §6.1 (typing without FQ only); §6.2 lifecycle rewritten |
| **C3** | Layered privacy notice + final Keep confirmation in main state machine | §6.6 · §6.7 · §10.1 · §10.3 (aligned with §10.6A) |
| **C4** | Recognition is normal base when evidence permits, not unconditional | §3.2 step 2 · §6.3 compose tree + locked rule |
| **C5** | Quiet ending / re-entry choice are not conversion or optimisation targets | §6.8 equality evidence · §13.1 event classes · §13.2 notes |
| **C6** | Delete anchor deletes/redacts user text; tombstone non-content only | §7.1 model + deletion semantics; §6.7 delete path still references §7.1 |

## 2. Confirmations required by the ruling

| Confirmation | Status |
|---|---|
| No other locked EN/ZH copy changed | **Confirmed** — only §2.1 punctuation restored to Language Lock; §§2.2–2.7 untouched |
| No new visible mode, memory claim, relational promise or conversion pressure introduced | **Confirmed** |
| No Continue eligibility, exposure or behaviour changed | **Confirmed** — §8 / §14.3 posture unchanged; C5 removes distribution-as-proof, does not widen Continue |
| Tree and Lumen gates remain intact | **Confirmed** — Tree 2026-09-18 disposition and Lumen pre-code close / thresholds unchanged |
| Revision remains design-only | **Confirmed** — no Stage 1 product code in this revision |

## 3. Gate status after this record

| Gate | Status |
|---|---|
| Founder semantic fidelity | **PASS WITH CORRECTIONS SATISFIED** |
| Tree scope / isolation | PASS WITH CORRECTIONS (design governance only) |
| Lumen Stage 1 evidence protocol | PASS WITH CORRECTIONS |
| Lumen S4 implementation evidence | Still required before S3 beyond offline fixtures |
| Stage 1 implementation authority | **Not issued** |
| Preview / Production | **Not authorised** |

## 4. Final principle (Founder, retained)

*Warmth should make the user feel met, not managed. Continuity should preserve what the user chose, not what the system inferred. Measurement should detect coercion, not create a new reason to optimise it.*

*温度应当让用户感到被回应，而不是被管理；相续应当保存用户亲自选择留下的内容，而不是系统替他形成的推断；衡量应当用来发现压力，而不是制造新的优化压力。*

---

*Filed by Nova. Second full Founder review not required unless new semantic choices or scope changes are introduced.*
