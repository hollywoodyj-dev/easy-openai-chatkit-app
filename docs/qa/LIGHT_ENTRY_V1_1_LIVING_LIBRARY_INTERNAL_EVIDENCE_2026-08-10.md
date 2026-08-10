# Light Entry v1.1 Living Library — Internal Build Evidence

**Date:** 2026-08-10  
**From:** Nova  
**Authority:** `docs/TREE_LIGHT_ENTRY_V1_1_LIVING_LIBRARY_BUILD_AUTH_2026-08-10.md`  
**Status:** Internal build complete · **Hosted Preview NOT authorized** · **Production HOLD**

---

## 1. Exact files changed

| Path | Change |
|------|--------|
| `lib/wisewave-light-entry-living-library.ts` | **Added** — flag, EN/ZH copy, visibility, exclusion helpers |
| `lib/wisewave-light-entry-living-library.test.ts` | **Added** — unit tests |
| `app/chat/page.tsx` | **Changed** — Living Library surface, ghost placeholder, focus, mutual exclusion, textarea ref |
| `.env.example` | **Changed** — document flags (default off) |
| `package.json` | **Changed** — `test:light-entry-ll` |
| `docs/TREE_LIGHT_ENTRY_V1_1_LIVING_LIBRARY_BUILD_AUTH_2026-08-10.md` | **Added** — Tree auth record |
| `docs/qa/LIGHT_ENTRY_V1_1_LIVING_LIBRARY_INTERNAL_EVIDENCE_2026-08-10.md` | **Added** — this pack |

**Not changed:** `app/api/chat/turn`, FMI, analytics catalog, Prisma, P1.1 UI (still unmounted).

---

## 2. Flag behavior

```text
NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST
  unset/0/false → OFF (default)
  1/true/yes → eligible when not Production-blocked

NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION
  unset → Production hard-blocked even if enable=1
```

`resolveLightEntryLivingLibraryEnablement()` mirrors Interaction Legibility pattern (`NEXT_PUBLIC_VERCEL_ENV === "production"`).

---

## 3. Value stays empty on example click

`handleLivingLibraryExampleClick`:

```text
setInput("")
setInputPlaceholder(example)  // ghost only
composerTextareaRef.current?.focus()
```

No `setInput(example)`. No insert of authored text.

---

## 4. No `/api/chat/turn` on example click

Example buttons are `type="button"`; handler only updates local placeholder + focus.  
Does not call `handleSubmit`, does not fetch `CHAT_TURN_ENDPOINT`.

---

## 5. Hide-on-type behavior

`shouldShowLightEntryLivingLibrary` requires `inputHasContent === false`.  
On `InputBar` onChange with non-whitespace: surface unmounts; placeholder resets to `Speak freely.`  
After first user message (`userMessageCount > 0`): hard hide for that conversation.

---

## 6. Mutual exclusion behavior

When `livingLibraryVisible`:

- Interaction Legibility not shown (`!suppressOtherEntry && …`)
- P0 permission line suppressed
- P0 exit invitation suppressed
- P1.1 remains unmounted (no UI)

---

## 7. EN/ZH copy map

| Key | EN (candidate) | ZH (candidate) |
|-----|----------------|----------------|
| intro | Or begin with something like… | 也可以像这样开始…… |
| e1 | I keep thinking about something that happened. | 我一直在想着刚刚发生的一件事。 |
| e2 | Something felt off today. | 今天有件事让我觉得哪里不太对。 |
| e3 | I don't quite know what I'm feeling. | 我还不太知道自己现在是什么感受。 |
| e4 | I don't know where to begin. | 我不知道该从哪里开始。 |

Browser `navigator.language` starts with `zh` → ZH set.  
**Aurora retains final semantic review** before Production lock.

---

## 8. Production hard-block

With `NEXT_PUBLIC_VERCEL_ENV=production` and allow unset → `enabled: false`, `blockedOnProduction: true` (unit-tested).

---

## 9. Zero analytics / persistence

- No `trackEvent` calls added for Living Library
- No localStorage / sessionStorage keys for examples
- No server metadata / DB fields
- Ephemeral React state only (`inputPlaceholder`)

---

## 10. Tests

```bash
npm run test:light-entry-ll
```

**Result:** 7/7 passed (2026-08-10).

---

## 11. Rollback

| Mechanism | Action |
|-----------|--------|
| Kill switch | Unset `NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST` |
| Code | Remove `lib/wisewave-light-entry-living-library*` + revert `app/chat/page.tsx` Living Library blocks |
| Env docs | Remove `.env.example` LL lines |

---

## Final Nova line

```text
LIGHT ENTRY v1.1 LIVING LIBRARY: INTERNAL BUILD COMPLETE
HOSTED PREVIEW: NOT AUTHORIZED
PRODUCTION: HOLD
EVIDENCE: docs/qa/LIGHT_ENTRY_V1_1_LIVING_LIBRARY_INTERNAL_EVIDENCE_2026-08-10.md
```
