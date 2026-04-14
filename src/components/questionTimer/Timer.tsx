import { useEffect, useState } from "react";

type TimeProps = {
    swipCount : number;
    onTimeUp : () => void;
}

export default function Timer({ swipCount, onTimeUp } : TimeProps){

    const [timer, setTimer] = useState <number>(5);

    //here when swipecount changes, which it does for everyswipe then timer starts again at 10
    useEffect(() => {
        setTimer(5);

        const interval = setInterval(() => {
            setTimer((time) => {
                if (time <= 1) { clearInterval(interval); return 0; };
                return time - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [swipCount]);

    //here i handle timeup
    useEffect(() => {
        if (timer === 0) {
            onTimeUp();
        }
    }, [timer, onTimeUp]);
    

    return <div>
        <p>{timer}</p>

    </div>

}
/**
 * when it times out move to next question
 * create a function in game that passes a prop value to timer to run it 
 */