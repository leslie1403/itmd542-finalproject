'use server';

import { sql } from './database';
import { revalidatePath } from 'next/cache';

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

    await sql`
    INSERT INTO events (title, location, description, start_time, end_time)
    VALUES (${title}, ${location}, ${description || null}, ${start}, ${end})
     `;
    revalidatePath('/');
}

export async function updateEvent(_: FormData) { }
export async function deleteEvent(_: FormData) { }