import './globals.css';

export const metadata = {
  title: 'College Path',
  description: 'Find your personalized college list — matched to your exact stats.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/profile">My Profile</a>
          <a href="/results">Results</a>
          <a href="/search">Search</a>
          <a href="/favorites">Favorites</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
