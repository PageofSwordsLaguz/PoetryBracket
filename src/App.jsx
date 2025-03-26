import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Votingpage from "./components/Votingpage.jsx";
import WinnerPage from "./components/WinnerPage.jsx";

function App() {
  return (
    <Router basename="/PoetryBracket">
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Poetry Bracket Voting App</h1>
        <Routes>
          <Route path="/" element={<Votingpage />} />
          <Route path="/winner" element={<WinnerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
