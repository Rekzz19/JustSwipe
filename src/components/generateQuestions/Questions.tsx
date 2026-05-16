import { Question } from "@/src/app/game/page";
import { SwipeableHandlers } from "react-swipeable";

type QuestionsProps = {
    question: Question,
    swip: SwipeableHandlers
}

export default function Questions( {question, swip } : QuestionsProps){

    return <div className="mt-4 p-5"> 
        <div className="wolves-card flex flex-col rounded-xl p-4 
            text-[24px]
            font-semibold
            uppercase
            tracking-[1px]
            font-bebas
            
        " > 
            <p>{question.question}</p> 
        </div> 
        <div {...swip} className="mt-6">
            <div className="flex gap-4">
                {/* Player A */}
                <div className="player-card relative flex-1 aspect-[0.68]">
                <img
                    src={question.imageA}
                    alt={question.answer.name}
                    className="h-full w-full object-cover"
                />

                <div className="player-overlay">
                    <p className="player-name text-[25px] leading-[0.9] font-bebas">
                    {question.answer.name}
                    </p>
                </div>
                </div>

                {/* Player B */}
                <div className="player-card relative flex-1 aspect-[0.68]">
                <img
                    src={question.imageB}
                    alt={question.option}
                    className="h-full w-full object-cover"
                />

                <div className="player-overlay">
                    <p className="player-name text-[25px] leading-[0.9] font-bebas">
                    {question.option}
                    </p>
                </div>
                </div>
            </div>
        </div>
    </div>
}

/*

<div className="bg-[#0b0f0c] min-h-screen px-4 py-6 font-sans">
            
        <div className="flex flex-col items-center justify-center 
            border border-[#1f3d2b] rounded-2xl 
            p-6 text-center 
            bg-[#121a14]
            shadow-md hover:shadow-[0_0_12px_rgba(34,197,94,0.25)]
            transition duration-300
        ">
            <p className="text-[#d1fae5] text-base leading-relaxed tracking-wide">
                {question.question}
            </p>
        </div>
        
        <div {...swip} className="flex justify-center gap-4 mt-6">
            
            <div className="flex flex-col items-center">
                <img 
                    src={question.imageA} 
                    alt={question.answer.name} 
                    className="w-32 h-32 object-cover rounded-xl border border-[#1f3d2b] bg-[#0f1511]"
                />
                <p className="mt-2 text-[#a7f3d0] text-sm font-medium tracking-wide">
                    {question.answer.name}
                </p>
            </div>
            
            <div className="flex flex-col items-center">
                <img 
                    src={question.imageB} 
                    alt={question.option} 
                    className="w-32 h-32 object-cover rounded-xl border border-[#1f3d2b] bg-[#0f1511]"
                />
                <p className="mt-2 text-[#a7f3d0] text-sm font-medium tracking-wide">
                    {question.option}
                </p>
            </div>
        </div>
    </div>

*/