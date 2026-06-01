import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type PlayersCardProps = {
    image : string,
    name : string,
    onSwipe : (direction : string) => void, //onswipe is now a function, framer-motion handles swipe and effect al i need is the function to do something now
    direction : 'left' | 'right',
}
export default function PlayersCard( { image, name, onSwipe, direction } : PlayersCardProps ){
    const x = useMotionValue(0);

    const rotate = useTransform(
        x,
        direction === "left" ? [-200, 0] : [0, 200],
        direction === "left" ? [-15, 0] : [0, 15]
    );
  
    return <motion.div
            drag="x"

            // Restrict swipe direction
            dragConstraints={{
                left: direction === "left" ? -25 : 0,
                right: direction === "right" ? 25 : 0,
            }}

            dragElastic={0.15}
            dragMomentum={false}
            style={{ x, rotate }}
            className="player-card relative flex-1 aspect-[0.68]"
            onDragEnd={(e, info) => {
                const offset = info.offset.x;

                // LEFT CARD
                if (direction === "left" && offset < -100) {
                    onSwipe("left");
                }   

                // RIGHT CARD
                if (direction === "right" && offset > 100) {
                    onSwipe("right");
                }
                animate(x, 0, {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                });
            }}
        >
    
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

    </motion.div>

}