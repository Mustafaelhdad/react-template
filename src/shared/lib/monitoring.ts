/**
 * Vendor-neutral seam for error reporting and product analytics.
 *
 * The default adapter is a no-op so the template ships without pulling
 * in Sentry / PostHog / Plausible. Register a real adapter from
 * `src/app/providers.tsx` (or a dedicated init module) when a project
 * adopts one. See `docs/monitoring.md`.
 */

export type CaptureErrorOptions = {
  /** Free-form key/value context merged into the captured event. */
  context?: Record<string, unknown>
  /** Bucket for filtering — e.g. 'react-error-boundary', 'axios'. */
  source?: string
}

export type CaptureEventProps = Record<string, unknown>

export type MonitoringAdapter = {
  captureError(error: unknown, options?: CaptureErrorOptions): void
  captureEvent(name: string, props?: CaptureEventProps): void
}

const noopAdapter: MonitoringAdapter = {
  captureError() {},
  captureEvent() {},
}

let adapter: MonitoringAdapter = noopAdapter

export function registerMonitoring(next: MonitoringAdapter) {
  adapter = next
}

export function resetMonitoring() {
  adapter = noopAdapter
}

export function captureError(error: unknown, options?: CaptureErrorOptions) {
  adapter.captureError(error, options)
}

export function captureEvent(name: string, props?: CaptureEventProps) {
  adapter.captureEvent(name, props)
}
