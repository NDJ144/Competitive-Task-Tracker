import { Box, Text, Center } from '@chakra-ui/react';
import '@dotlottie/player-component';

interface CharacterProps {
  level: number;
}

const Character: React.FC<CharacterProps> = ({ level }) => {
  const getCharacterSize = () => {
    return Math.min(100 + level * 5, 150);
  };

  return (
    <Box textAlign="center" p={4}>
      <Center mb={4}>
        <dotlottie-player
          src="https://lottie.host/f0089c52-479e-4ff6-9e19-480740ef671c/QXDmQ9vyUg.lottie"
          background="transparent"
          speed="1"
          style={{ width: `${getCharacterSize()}px`, height: `${getCharacterSize()}px` }}
          loop
          autoplay
        />
      </Center>
      <Text mt={2} fontSize="lg" fontWeight="bold">
        Level {level}
      </Text>
    </Box>
  );
};

export default Character;
