import { getEvents } from './api/events';

export default async function Home() {
  const events = await getEvents();  

  return (
    <main>
      <h1>Schedule List</h1>

      {events.length === 0 ? (
        <p >Placeholder - Test</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id}>
              {e.title} — {e.location} ({e.start_time} → {e.end_time})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}