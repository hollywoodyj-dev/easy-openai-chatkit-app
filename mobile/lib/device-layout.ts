import { useWindowDimensions } from "react-native";

/** Shortest window edge at or above this → treat as tablet (iPad portrait is typically ≥744). */
export const TABLET_MIN_WIDTH = 600;

/**
 * Tablet layout: based on window size only (no Platform.isPad), so behavior is consistent
 * across iOS/Android and avoids edge cases with the native idiom flag.
 */
export function useIsTablet(): boolean {
  const { width, height } = useWindowDimensions();
  const shortEdge = Math.min(width, height);
  return shortEdge >= TABLET_MIN_WIDTH;
}
