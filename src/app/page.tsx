export default function HomePage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f5f7fa'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: '1rem'
      }}>
        Welcome to Course Align
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#4a5568'
      }}>
        Your journey to organized learning starts here.
      </p>
    </main>
  );
}