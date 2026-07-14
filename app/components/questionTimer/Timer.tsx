import { useEffect, useRef } from 'react';

type TimeProps = {
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    swipeCount: number;
    onTimeUp: () => void; //creates a new question and increments c
};

export default function Timer({ timer, setTimer, swipeCount, onTimeUp }: TimeProps) {
    //const [timer, setTimer] = useState <number>(5); //timer state,
    const hasCalledTimeUp = useRef(false); //used to check if times up

    //here when swipecount changes, which it does for everyswipe then timer starts again at 5
    useEffect(() => {
        hasCalledTimeUp.current = false;

        //this is the actual timer
        const interval = setInterval(() => {
            setTimer((time: number) => {
                if (time <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return time - 1; //why
            });
        }, 1000);
        return () => clearInterval(interval); //clean up to avoid continous running
    }, [swipeCount, setTimer]);

    //this is for when the timer runs out without a swipe
    useEffect(() => {
        if (timer === 0 && !hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            onTimeUp(); //chnages the question and the count
        }
    }, [timer, onTimeUp]);

    return (
        <div>
            <p>{timer}</p>
        </div>
    );
}
/**
 * when it times out move to next question
 * create a function in game that passes a prop value to timer to run it
 *
 * timer takes the number of count to keep resetting the timer when the count is less thna 5
 * and timeup to start another timer when timeuo is called
 *
 * solution
 * settimer should hvae been chnaged first with the new render and then useeffct runs
 * swipe, set the timer nad the useeffect runs the countdown
 */
