import { redirect } from 'next/navigation';

/**
 * Root page — redirect to physics lab
 * The actual virtuallab.html is served by the custom server (server.js)
 */
export default function Home() {
    redirect('/physics/virtuallab.html');
}
