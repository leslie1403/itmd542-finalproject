import { getEvents, createEvent, deleteEvent, updateEvent } from './api/events';

function toInputValue(raw: string | Date) {
  const iso =
    typeof raw === 'string'
      ? raw.replace(' ', 'T').slice(0, 16)  
      : raw.toISOString().slice(0, 16); 
  return iso;
}

export default async function Home() {
  const events = await getEvents();

  return (
    <main>
      <h1>Event Schedule List</h1>

      <form action={createEvent}>
        <input name="title" placeholder="Title" required />
        <input name="location" placeholder="Location" required />
        <input type="datetime-local" name="start" required />
        <input type="datetime-local" name="end" required />
        <button type="submit">Add Event</button>
      </form>

      {events.length === 0 ? (
        <p>No Events Scheduled</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.id}>
              <details key={e.id + e.start_time + e.end_time}>
                <summary>
                {e.title} — {e.location} ({pretty(e.start_time)} → {pretty(e.end_time)}) – Edit
                </summary>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit">Delete Event</button>
                </form>
                <form action={updateEvent}>
                  <input type="hidden" name="id" value={e.id} />
                  <input name="title" defaultValue={e.title} required />
                  <input name="location" defaultValue={e.location} required />
                  <input
                    type="datetime-local"
                    name="start"
                    defaultValue={toInputValue(e.start_time)}
                    required
                  />
                  <input
                    type="datetime-local"
                    name="end"
                    defaultValue={toInputValue(e.end_time)}
                    required
                  />
                  <button type="submit">Save</button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </main>
  );

  function pretty(raw: string | Date) {
    const str =
      typeof raw === 'string' ? raw.replace(' ', 'T') : raw.toISOString();
  
    const [date, time] = str.split('T'); 
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm]  = time.split(':').map(Number);
  
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December',
    ];
  
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12  = hh % 12 || 12;
    const pad  = (n: number) => n.toString().padStart(2, '0');
  
    return `${monthNames[m - 1]}, ${pad(d)}, ${y}, ${pad(h12)}:${pad(mm)} ${ampm}`;
  }
}