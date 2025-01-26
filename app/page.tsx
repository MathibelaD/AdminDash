import LoginComponent from "@/components/LoginComponent";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Login',
};

export default function Home() {
  return (
    
      <LoginComponent />
    );
}
