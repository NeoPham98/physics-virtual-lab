import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/physics/new?moduleId=1&ignoreBlock=true');
}
