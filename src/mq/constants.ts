/**
 * To fully leverage Dragonfly's capabilities, specific steps are necessary. Primarily, you should name your queues using curly braces. This naming convention allows Dragonfly to assign a thread to each queue. For instance, if your queue is named myqueue,rename it to {myqueue}.
 * @url https://docs.bullmq.io/guide/redis-tm-compatibility/dragonfly
 */
export const QueueNames = {
  discordNotification: '{discordNotification}',
  systemProcessing: '{systemProcessing}',
}
