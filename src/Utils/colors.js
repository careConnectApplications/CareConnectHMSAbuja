import { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';

export const useColors = () => {
  const { theme } = useContext(ThemeContext);

  const bgColor = theme === 'light' ? 'white' : 'gray.800';
  const textColor = theme === 'light' ? '#2E2E2E' : '#ddd';
  const borderColor = theme === 'light' ? '#EDEFF2' : '#ddd';
  const cardBgColor = theme === 'light' ? 'gray.50' : 'gray.800';
  const NavbarText = theme === 'light' ? 'blue.blue500' : "blue.blue400";
  const primaryColor = 'blue.500';
  const secondaryColor = 'orange.500';
  const dangerColor = 'red.500';
  const successColor = 'green.500';
  const warningColor = 'yellow.500';
  const infoColor = 'teal.500';
  const lightTextColor = theme === 'light' ? '#8A8D8E' : 'white';
  const NavListColor = theme === 'light' ? "#333" : 'white';
  const NavListBg = theme === 'light' ? "blue.blue500" : "blue.blue400";

  return {
    bgColor,
    textColor,
    borderColor,
    cardBgColor,
    primaryColor,
    secondaryColor,
    dangerColor,
    successColor,
    warningColor,
    infoColor,
    NavbarText,
    lightTextColor,
    NavListColor,
    NavListBg,
  };
};
