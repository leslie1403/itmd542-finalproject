import { getEvents,createEvent } from './api/events';
import { format } from 'date-fns';

export default async function Home() {
  const events = await getEvents();

  return (
    <main>
      <h1>Schedule List</h1>

      <form action={createEvent}> 
          <input name="title" placeholder="Title" required />
          <input name="location" placeholder="Location" required />
          <input type="datetime-local" name="start" required />
          <input type="datetime-local" name="end" required />
          <button type="submit">Add</button>
        </form>

      {events.length === 0 ? (
        <p>Placeholder - Test</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id}>
              {e.title} — {e.location}{''} ({format(new Date(e.start_time), 'PPpp')} {'→'} ({format(new Date(e.end_time), 'PPpp')})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}