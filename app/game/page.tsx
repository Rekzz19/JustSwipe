'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { getRandomIndex } from "@/utils/getRandomIndex";
import Questions from "../components/playerQuestions/Questions";
import Timer from "../components/questionTimer/Timer";

type Answer = {
  name: string;
  position: "left" | "right";
};

export interface Question {
    question : string,
    answer : Answer,
    option : string,
    imageA : string,
    imageB : string,
}

const basketballQuestions: Question[] = [
    {
      question: "Who won the NBA Finals MVP in 2019?",
      answer: { name: "Kawhi Leonard", position: "left" },
      option: "Klay Thompson",
      imageA: "/images/Kawhi-leonard.jpg",
      imageB: "/images/Klay.jpeg"
    },
    {
      question: "Who scored 81 points in a single NBA game?",
      answer: { name: "Kobe Bryant", position: "right" },
      option: "Devin Booker",
      imageA: "/images/kobe.jpg",
      imageB: "/images/devin-booker.webp"
    },
    {
      question: "Who is the NBA's all-time leading scorer?",
      answer: { name: "LeBron James", position: "left" },
      option: "Kareem Abdul-Jabbar",
      imageA: "/images/lebron-James.avif",
      imageB: "/images/kareem.avif"
    },
    {
      question: "Who was nicknamed 'The Answer'?",
      answer: { name: "Allen Iverson", position: "right" },
      option: "Tracy McGrady",
      imageA: "/images/Allen-Iverson.avif",
      imageB: "/images/Tracy-McGrady.jpg"
    },
    {
      question: "Who won the NBA MVP award in 2023?",
      answer: { name: "Joel Embiid", position: "left" },
      option: "Nikola Jokic",
      imageA: "/images/Joel-Embiid.avif",
      imageB: "/images/Nicola-Jokic.avif"
    },
    {
      question: "Who is known for the 'Skyhook' shot?",
      answer: { name: "Kareem Abdul-Jabbar", position: "right" },
      option: "Wilt Chamberlain",
      imageA: "/images/kareem.avif",
      imageB: "/images/Wilt-Chamberlain.webp"
    },
    {
      question: "Who was the first overall pick in the 2023 NBA Draft?",
      answer: { name: "Victor Wembanyama", position: "left" },
      option: "Chet Holmgren",
      imageA: "/images/Victor-wemby.avif",
      imageB: "/images/chet-holmgren.jpg"
    },
    {
      question: "Who won Defensive Player of the Year four times?",
      answer: { name: "Ben Wallace", position: "right" },
      option: "Dikembe Mutombo",
      imageA: "/images/ben-wallace.jpg",
      imageB: "/images/Dikembe-Mutombo.jpg"
    },
    {
      question: "Who hit 'The Shot' over Craig Ehlo in 1989?",
      answer: { name: "Michael Jordan", position: "left" },
      option: "Magic Johnson",
      imageA: "/images/michael-jordan.webp",
      imageB: "/images/magic-johnson-solo.avif"
    },
    {
      question: "Who holds the NBA record for most career three-pointers made?",
      answer: { name: "Stephen Curry", position: "right" },
      option: "Ray Allen",
      imageA: "/images/Stephen-curry.jpg",
      imageB: "/images/Ray-allen.jpg"
    },
    {
      question: "Who won Finals MVP with three different franchises?",
      answer: { name: "LeBron James", position: "left" },
      option: "Kawhi Leonard",
      imageA: "/images/lebron-James.avif",
      imageB: "/images/Kawhi-leonard.jpg"
    },
    {
      question: "Who is nicknamed 'The Greek Freak'?",
      answer: { name: "Giannis Antetokounmpo", position: "right" },
      option: "Nikola Jokic",
      imageA: "/images/Giannis.avif",
      imageB: "/images/Nicola-Jokic.avif"
    },
    {
      question: "Who averaged a triple-double for an entire season four times?",
      answer: { name: "Russell Westbrook", position: "left" },
      option: "Oscar Robertson",
      imageA: "/images/Russell-westbrook.webp",
      imageB: "/images/Oscar-robertson.avif"
    },
    {
      question: "Who led the Cavaliers to a championship after coming back from a 3-1 deficit in the 2016 Finals?",
      answer: { name: "LeBron James", position: "right" },
      option: "Stephen Curry",
      imageA: "/images/lebron-James.avif",
      imageB: "/images/Stephen-curry.jpg"
    },
    {
      question: "Who won MVP Defensive Player of the Year, and Finals MVP in the same season (1994)?",
      answer: { name: "Hakeem Olajuwon", position: "left" },
      option: "David Robinson",
      imageA: "/images/Hakeem-Olajuwon.webp",
      imageB: "/images/David-Robinson.jpg"
    }
]

export default function Game(){
    const router = useRouter();
    //const randomIndex = getRandomIndex();
    const [ index, setIndex ] = useState(() => getRandomIndex(basketballQuestions.length))
    const [ swipeCount, setSwipeCount ] = useState(0);
    const [ score, setScore ] = useState(0);
    const [ timer, setTimer ] = useState<number>(5);


    //this function generates a random question when the timer is out
    const handleTimeOut = useCallback(() => {
        setIndex(getRandomIndex(basketballQuestions.length));
        setTimer(5);
        setSwipeCount((c) => c + 1);
    },[])

    useEffect(() => {
        console.log("swipeCount changed:", swipeCount); //this is sayong print for every chnage in state
    }, [swipeCount]);

    //swipe function - check that answer is correct
    const handlers = (direction: string) => {
        setTimer(5);
        if (index === null)return; //index is state

        const question = basketballQuestions[index]; //take question from the array

        if (question.answer.position === direction){ 
            setScore(prevScore => prevScore + 1);
        }
        setIndex(getRandomIndex(basketballQuestions.length));
        setSwipeCount((c) => c + 1);
        
    }

    //this here is where we wnd the game, needs improvement because when swipeount=5 it first does a render then changes page
    //how do you immediately after the swipe chnage page?
    useEffect(() => {
        if (swipeCount === 5){
            router.push(`/score?score=${score}`);
        }
    }, [swipeCount, score, router])


    if (index === null) {
        return <p>Loading...</p>;
    }
    const question = basketballQuestions[index];

    return <div className='flex flex-col items-center min-h-screen bg-[#0C2340]'>

        <Timer timer={timer} setTimer={setTimer} swipeCount={swipeCount} onTimeUp={handleTimeOut}/>
        <Questions question={question} handleSwipe={handlers}/>

    </div>
    
}
/**
 * this is the page where we take in the timer ad questions component
 * those components takes in props nad functions that are on this main game page
 * 
 * TIMER
 * the timer component takes a swipecount prop which is the number of swipes (limited because we want a set number of questions)
 * In the swipe hnadler we use swipeCount to increment the count
 * handletimeout is a function that that gives a new question nad increments swipecount
 * using usecallback ensures it does not run the function on every re render
 * 
 */
