import { Question } from "@/src/app/game/page"

type PlayersCardProps = {
    image : string,
    name : string
}
export default function PlayersCard( { image, name } : PlayersCardProps ){
    return <div className="player-card relative flex-1 aspect-[0.68]">
        <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
        />

        <div className="player-overlay">
            <p className="player-name text-[25px] leading-[0.9] font-bebas">
            {name}
            </p>
        </div>
    </div>
    

}