import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import Markdown from "react-markdown";

interface TypingEffectProps {
    text: string;
    speed?: number;
    setLastMessage: Dispatch<SetStateAction<string>>;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 10, setLastMessage }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let textIndex = 0;
        const typingInterval = setInterval(() => {
            if (textIndex < text.length) {
                setDisplayedText((prev) => prev + text[textIndex]);
                textIndex++;
            } else {
                setLastMessage('')
                clearInterval(typingInterval);
            }
        }, speed);

        return () => clearInterval(typingInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, speed]);

    useEffect(() => {
        const cursorBlinkInterval = setInterval(() => {
        }, 500);

        return () => clearInterval(cursorBlinkInterval);
    }, []);

    return (
        <Markdown >
            {displayedText}
        </Markdown>
    );
};

export default TypingEffect;
