import { useEffect, useState, useRef } from "react";

type TimeProps = {
    swipeCount : number;
    onTimeUp : () => void; //creates a new question and increments c
}

export default function Timer({ swipeCount, onTimeUp } : TimeProps){

    const [timer, setTimer] = useState <number>(5);
    const hasCalledTimeUp = useRef(false);

    //here when swipecount changes, which it does for everyswipe then timer starts again at 5
    useEffect(() => {
        setTimer(5);
        hasCalledTimeUp.current = false;

        const interval = setInterval(() => {
            setTimer((time) => {
                if (time <= 1) { clearInterval(interval); return 0; };
                return time - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [swipeCount]);

    

    useEffect(() => {
        if (timer === 0 && !hasCalledTimeUp.current){
            hasCalledTimeUp.current = true
            onTimeUp();
        }
    }, [timer, onTimeUp])
    

    return <div>
        <p>{timer}</p>

    </div>

}
/**
 * when it times out move to next question
 * create a function in game that passes a prop value to timer to run it 
 */