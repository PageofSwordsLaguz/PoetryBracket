import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import './Votingpage.css'; // Import your CSS file here
import { Button, Spinner } from "react-bootstrap";

// Initialize Supabase
const supabaseUrl = "https://keuqsxtdibgvyyocdnhj.supabase.co";
const supabaseKey = "your-supabase-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const roundEndTimes = {
  1: '2025-03-27T17:30:00Z', // Round 1 end time (in UTC)
  2: '2025-03-27T21:30:00Z', // Round 2 end time (in UTC)
  3: '2025-03-28T15:30:00Z', // Round 3 end time (in UTC)
  4: '2025-03-28T17:30:00Z', // Round 4 end time (in UTC)
};

export default function VotingPage() {
  const [poems, setPoems] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isVotingClosed, setIsVotingClosed] = useState(false);

  const fetchMatchupsAndPoems = async () => {
    try {
      setLoading(true);
      const { data: poems, error: poemsError } = await supabase
        .from("Poems")
        .select("*");

      if (poemsError) throw new Error(poemsError.message);

      const { data: matchups, error: matchupsError } = await supabase
        .from("Matchups")
        .select("*")
        .eq("round", currentRound);

      if (matchupsError) throw new Error(matchupsError.message);

      console.log("Poems data:", poems);
      console.log("Matchups data:", matchups);

      setPoems(poems);
      setMatchups(matchups);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if the round has ended
  const checkIfVotingClosed = () => {
    const roundEndTime = new Date(roundEndTimes[currentRound]);
    const currentTime = new Date();
    setIsVotingClosed(currentTime >= roundEndTime);
  };

  const handleVote = async (matchupIndex, winner) => {
    const newMatchups = [...matchups];
    newMatchups[matchupIndex].winner_id = winner;

    // Update matchups in the database
    const { data, updateError } = await supabase
      .from('Matchups')
      .upsert(newMatchups);

    if (updateError) {
      console.error("Error updating matchups:", updateError.message);
    }

    setMatchups(newMatchups);

    // Check if we can move to the next round
    if (newMatchups.filter((matchup) => matchup.winner_id).length === newMatchups.length) {
      // Move to the next round if all matchups have winners
      if (currentRound < 4) {
        console.log("Advancing to next round:", currentRound + 1);
        setCurrentRound(currentRound + 1);
      }
    }
  };

  useEffect(() => {
    console.log("Fetching data for round:", currentRound);
    fetchMatchupsAndPoems();
    const interval = setInterval(checkIfVotingClosed, 10000); // Check every 10 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentRound]);

  return (
    <div className="voting-page">
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div>
          <h1>Round {currentRound} Voting</h1>
          {isVotingClosed ? (
            <div className="voting-closed">
              <p>Voting has closed for this round!</p>
            </div>
          ) : (
            <div>
              {matchups.map((matchup, index) => (
                <div key={matchup.id} className="matchup">
                  <div className="poem-info">
                    <a href={poems.find(p => p.id === matchup.poem1_id)?.link} target="_blank" rel="noopener noreferrer">
                      {poems.find(p => p.id === matchup.poem1_id)?.title}
                    </a>
                    <span> vs </span>
                    <a href={poems.find(p => p.id === matchup.poem2_id)?.link} target="_blank" rel="noopener noreferrer">
                      {poems.find(p => p.id === matchup.poem2_id)?.title}
                    </a>
                  </div>
                  {!isVotingClosed && (
                    <div className="vote-buttons">
                      <Button onClick={() => handleVote(index, matchup.poem1_id)}>Vote for {poems.find(p => p.id === matchup.poem1_id)?.title}</Button>
                      <Button onClick={() => handleVote(index, matchup.poem2_id)}>Vote for {poems.find(p => p.id === matchup.poem2_id)?.title}</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}