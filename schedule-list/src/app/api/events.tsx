'use server';

import { sql } from './database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type EventRow = {
    id: string;
    title: string;
    location: string;
    description: string | null;
    start_time: string;
    end_time: string;
};

export async function getEvents(): Promise<EventRow[]> {
    const { rows } =
        await sql<EventRow>`SELECT * FROM events ORDER BY start_time ASC`;
    return rows;
}

export async function createEvent(form: FormData) {
    const { title, location, description, start, end } = Object.fromEntries(form) as Record<string, string>;

    const tStart = new Date(start.replace(' ', 'T'));
    const tEnd   = new Date(end.replace(' ', 'T'));
    if (!(tStart < tEnd)) {
        redirect('/?error=time');
    }

    await sql`
    INSERT INTO events (title, location, description, start_time, end_time)
    VALUES (${title}, ${location}, ${description || null}, ${start}, ${end})
     `;
    revalidatePath('/');
    redirect('/');
}

export async function deleteEvent(form: FormData) {
    const { id } = Object.fromEntries(form) as Record<string, string>;
    await sql`
    DELETE FROM events WHERE id = ${id}
    `;
    revalidatePath('/');
}
export async function updateEvent(form: FormData) {
    const { id, title, location, description, start, end } =
        Object.fromEntries(form) as Record<string, string>;

    const tStart = new Date(start.replace(' ', 'T'));
    const tEnd   = new Date(end.replace(' ', 'T'));
    if (!(tStart < tEnd)) redirect('/?error=time');;

    await sql`
    UPDATE events
       SET title = ${title},
           location = ${location},
           description = ${description || null},
           start_time = ${start},
           end_time = ${end}
     WHERE id = ${id}
  `;
    revalidatePath('/');
    redirect('/');
}
