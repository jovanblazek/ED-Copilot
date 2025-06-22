import { PostHog } from 'posthog-node'
import logger from './logger'

// Initialize PostHog only if API key is provided
let posthogInstance: PostHog | null = null

if (process.env.POSTHOG_KEY) {
  posthogInstance = new PostHog(process.env.POSTHOG_KEY, {
    host: 'https://eu.i.posthog.com',
  })
  logger.info('[PostHog] Analytics initialized')
} else {
  logger.warn('[PostHog] No API key provided, analytics disabled')
}

// Export a safe wrapper that handles the case where PostHog is not initialized
export const Posthog = {
  capture: (data: Parameters<PostHog['capture']>[0]) => {
    if (!posthogInstance) {
      return undefined
    }
    return posthogInstance.capture(data)
  },
  identify: (data: Parameters<PostHog['identify']>[0]) => {
    if (!posthogInstance) {
      return Promise.resolve()
    }
    return posthogInstance.identify(data)
  },
  shutdown: () => {
    if (!posthogInstance) {
      return Promise.resolve()
    }
    return posthogInstance.shutdown()
  },
}
