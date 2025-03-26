import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button, Card } from "react-bootstrap";

const supabase = createClient(
  "https://keuqsxtdibgvyyocdnhj.supabase.co",
  "YOUR_PUBLIC_ANON_KEY_HERE"
);

export default function WinnerPage() {
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchWinner = async () => {
      const { data, error } = await supabase
        .from("Matchups")
        .select("winner_id")
        .order("round", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching winner:", error.message);
      } else if (data.winner_id) {
        const { data: winnerPoem } = await supabase
          .from("Poems")
          .select("title, link")
          .eq("id", data.winner_id)
          .single();
        setWinner(winnerPoem);
      }
    };

    fetchWinner();
  }, []);

  return (
    <div className="text-center mt-5">
      <h1 className="text-4xl mb-4">🏆 Winner Announced! 🏆</h1>
      {winner ? (
        <Card className="mx-auto p-4" style={{ maxWidth: "500px" }}>
          <h2>{winner.title}</h2>
          <a
            href={winner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="d-block mt-2 text-decoration-underline text-primary"
          >
            Read the Winning Poem
          </a>
        </Card>
      ) : (
        <p>Loading winner...</p>
      )}
      <Button variant="primary" href="/" className="mt-4">
        Back to Voting
      </Button>
    </div>
  );
}
