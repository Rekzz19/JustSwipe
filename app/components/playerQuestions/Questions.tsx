import { Question } from '@/app/game/page';
import QuestionCard from './QuestionCard';
import PlayersCard from './PlayerCard';

type QuestionsProps = {
    question: Question;
    handleSwipe: (direction: string) => void;
};

export default function Questions({ question, handleSwipe }: QuestionsProps) {
    return (
        <div className="mt-4 p-5">
            <QuestionCard question={question} />

            <div className="mt-6">
                <div className="flex gap-4">
                    <PlayersCard
                        direction="left"
                        image={question.imageA}
                        name={question.answer.name}
                        onSwipe={handleSwipe}
                    />
                    <PlayersCard
                        direction="right"
                        image={question.imageB}
                        name={question.option}
                        onSwipe={handleSwipe}
                    />
                </div>
            </div>
        </div>
    );
}
