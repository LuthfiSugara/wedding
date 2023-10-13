import { useEffect, useState } from 'react';

const Index = (date) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft(date));
        }, 1000);

        return () => clearTimeout(timer);
    });
    return timeLeft;
};

const calculateTimeLeft = (date) => {
    let difference = +new Date(date) - +new Date();
  
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
  
    return timeLeft;
};

export default Index;