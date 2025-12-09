import type {Metadata} from 'next';
import SessionProviderWrapper from "@/src/app/auth/SessionProviderWrapper";

export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Authentication pages',
};

export default function AuthLayout({children}: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <header style={{marginBottom: '1rem'}}>
          <h1 style={{margin: 0, fontSize: '1.5rem', lineHeight: 1.2}}>Login</h1>
        </header>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </div>
    </div>
  );
}