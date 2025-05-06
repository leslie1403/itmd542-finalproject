import { getEvents, createEvent, deleteEvent, updateEvent } from './api/events';

function toInputValue(raw: string | Date) {
  const iso =
    typeof raw === 'string'
      ? raw.replace(' ', 'T').slice(0, 16)
      : raw.toISOString().slice(0, 16);
  return iso;
}

interface HomeProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // await the promise before accessing `.error`
  const { error } = await searchParams;
  const showErr = error === 'time';

  const events = await getEvents();

  return (

    <main className="font-[Times New Roman,serif] bg-teal-50 min-h-screen p-8 space-y-4">
      <div className='bg-teal-700 text-white p-6 rounded mb-8'>
        <h1 className="text-3xl font-semibold mb-1 text-center">Event Schedule List</h1>
      </div>

      {showErr && (
        <p className="text-xl font-semibold text-center text-red-600">
          Error: The end time is before the start time. Please try again.
        </p>
      )}

      <details className="relative">
        <summary className="list-none cursor-pointer block mx-auto bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded w-35 text-center">
          Add Event
        </summary>

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">New Event</h2>
            <form action={createEvent} className="space-y-4">
              <input
                name="title"
                placeholder="Title"
                required
                className="w-full border rounded p-2"
              />
              <input
                name="location"
                placeholder="Location"
                required
                className="w-full border rounded p-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  name="start"
                  required
                  className="border rounded p-2"
                />
                <input
                  type="datetime-local"
                  name="end"
                  required
                  className="border rounded p-2"
                />
              </div>
              <div className="flex justify-center gap-2">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded w-24 text-center"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </details>


      {events.length === 0 ? (
        <p className="text-xl font-semibold text-center">No Events Scheduled</p>
      ) : (
        <ul className="space-y-4">
          {events.map((e) => (
            <li
              key={e.id}
              className="bg-white border-1 border-gray-300 shadow rounded-lg p-4 bg-white shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{e.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">Location: {e.location}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {pretty(e.start_time)} – {pretty(e.end_time)}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <details className="relative">
                    <summary className="list-none cursor-pointer inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded w-24 text-center">
                      Edit
                    </summary>
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-center">Edit Event</h2>
                        <form action={updateEvent} className="space-y-4">
                          <input type="hidden" name="id" value={e.id} />

                          <label className="block">
                            <span className="text-sm font-medium">Title</span>
                            <input
                              name="title"
                              defaultValue={e.title}
                              required
                              className="mt-1 block w-full border rounded p-2"
                            />
                          </label>

                          <label className="block">
                            <span className="text-sm font-medium">Location</span>
                            <input
                              name="location"
                              defaultValue={e.location}
                              required
                              className="mt-1 block w-full border rounded p-2"
                            />
                          </label>

                          <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                              <span className="text-sm font-medium">Start</span>
                              <input
                                type="datetime-local"
                                name="start"
                                defaultValue={toInputValue(e.start_time)}
                                required
                                className="mt-1 block w-full border rounded p-2"
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm font-medium">End</span>
                              <input
                                type="datetime-local"
                                name="end"
                                defaultValue={toInputValue(e.end_time)}
                                required
                                className="mt-1 block w-full border rounded p-2"
                              />
                            </label>
                          </div>

                          <div className="flex justify-center gap-2">
                            <button
                              type="submit"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded w-24 text-center"
                            >
                              Save
                            </button>
                            <button
                              type="submit"
                              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded w-24 text-center"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                  </details>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded w-24 text-center"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
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
    const [hh, mm] = time.split(':').map(Number);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${months[m - 1]}, ${pad(d)}, ${y}, ${pad(h12)}:${pad(mm)} ${ampm}`;
  }
}