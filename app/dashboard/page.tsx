import Dashboard from '@/components/Dashboard/main';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {

    return (
        <Dashboard />
    )
}