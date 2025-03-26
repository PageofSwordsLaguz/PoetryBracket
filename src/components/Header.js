import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 mb-4 rounded-b-xl shadow-lg">
      <nav className="flex gap-4">
        <Link to="/" className="hover:underline">Vote</Link>
        <Link to="/bracket" className="hover:underline">View Bracket</Link>
      </nav>
    </header>
  );
}