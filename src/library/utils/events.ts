import { ActionEvent } from '@/src/app/api/events/route'
// usar el send beacon
export async function postEvent({ tx, user, event_type, value }: ActionEvent) {
  await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx,
      user: user.toLowerCase(),
      event_type,
      value,
    }),
  })
}
