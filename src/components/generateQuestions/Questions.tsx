import { Question } from "@/src/app/game/page";
import { SwipeableHandlers } from "react-swipeable";

type QuestionsProps = {
    question: Question,
    swip: SwipeableHandlers
}

export default function Questions( {question, swip } : QuestionsProps){

    return <div>
            
        <div>
            <p>question : {question.question}</p>
        </div>
        
        <div {...swip} className="flex justify-center gap-4">
            <div>
                <img src={question.imageA} alt={question.answer.name} className="w-32 h-32 object-cover"/>
                <p>{question.answer.name}</p>
            </div>
            
            <div>
                <img src={question.imageB} alt={question.option.name} className="w-32 h-32 object-cover"/>
                <p>{question.option}</p>
            </div>
            
        </div>

    </div>
}