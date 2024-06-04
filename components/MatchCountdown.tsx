"use client";
import React, { useEffect, useState } from "react";



interface MatchCountdownProps {
  matches: { allMatches: matches[] }; 
  selectedWeek: number;
}

const MatchCountdown: React.FC<MatchCountdownProps> = ({
  matches,
  selectedWeek,
}) => {
  const [countdown, setCountdown] = useState("Loading matches...");

  useEffect(() => {
    if (!matches || !matches.allMatches) {
      setCountdown("Loading matches...");
      return;
    }
    const getNextMatch = () => {
      const now = new Date();
      return matches.allMatches
        .filter((match) => match.week === selectedWeek)
        .find((match) => new Date(match.matchDate) > now);
    };

    const nextMatch = getNextMatch();
    if (!nextMatch) {
      setCountdown("No upcoming matches");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const matchDate = new Date(nextMatch.matchDate);
      const timeDiff = matchDate - now;

      if (timeDiff <= 0) {
        setCountdown("Match is starting!");
        clearInterval(intervalId);
        return;
      }

      // Calculate time components
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
      // const seconds = Math.floor((timeDiff / 1000) % 60);

      const countdownText =
        days > 0 ? `${days}d ${hours}h ${minutes}m ` : `${hours}h ${minutes}m `;

      setCountdown(countdownText);
    };

    // Update countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [matches, selectedWeek]);

  return <div>{countdown}</div>;
};

export default MatchCountdown;
