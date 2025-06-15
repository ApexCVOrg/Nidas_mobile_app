import React, { useEffect, useState } from 'react';
import { Text, TextProps } from 'react-native';

interface TypingTextProps extends TextProps {
  text: string;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  typingSpeed = 50,
  onTypingComplete,
  style,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (onTypingComplete) {
      onTypingComplete();
    }
  }, [currentIndex, text, typingSpeed, onTypingComplete]);

  return (
    <Text style={style} {...props}>
      {displayedText}
    </Text>
  );
};

export default TypingText; 