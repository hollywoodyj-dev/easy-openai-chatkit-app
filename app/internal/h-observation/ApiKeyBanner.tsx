"use client";

import { useEffect, useState } from "react";
import {
  getObservationApiKey,
  setObservationApiKey,
} from "./obs-api";

export function ApiKeyBanner() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getObservationApiKey());
  }, []);

  return (
    <div className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
      <p className="font-medium text-amber-900 dark:text-amber-100">
        API key (stored in this browser only)
      </p>
      <p className="text-amber-800/90 dark:text-amber-200/80 mt-1 text-xs">
        If <code className="rounded bg-black/5 px-1 dark:bg-white/10">H_OBSERVATION_API_KEY</code> is set on the server, paste the same value here. Leave empty when the env var is unset (local dev).
      </p>
      <div className="mt-2 flex flex-wrap gap-2 items-center">
        <input
          type="password"
          className="flex-1 min-w-[200px] rounded border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          placeholder="x-h-observation-key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          type="button"
          className="rounded bg-neutral-800 px-3 py-1 text-white text-sm dark:bg-neutral-200 dark:text-neutral-900"
          onClick={() => {
            setObservationApiKey(key);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
        >
          Save
        </button>
        {saved ? <span className="text-xs text-green-600">Saved</span> : null}
      </div>
    </div>
  );
}
