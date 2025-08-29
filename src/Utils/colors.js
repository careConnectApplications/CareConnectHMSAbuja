import { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';

export const useColors = () => {
  const { theme } = useContext(ThemeContext);

  const bgColor = theme === 'light' ? 'white' : 'gray.800';
  const textColor = theme === 'light' ? '#2E2E2E' : '#ddd';
  const borderColor = theme === 'light' ? '#EDEFF2' : '#6e299aff';
  const cardBgColor = theme === 'light' ? 'gray.50' : 'gray.800';
  const NavbarText = theme === 'light' ? 'blue.blue500' : "blue.blue400";
  const chartFillColor = theme === 'light' ? '#eee' : '#6e299aff';
  const chartFillXColor = theme === 'light' ? '#e1e1e1ff' : '#b44d36ff';
  const primaryColor = 'blue.500';
  const secondaryColor = '#eeeeeeff';
  const dangerColor = 'red.500';
  const successColor = 'green.500';
  const warningColor = 'yellow.500';
  const infoColor = 'teal.500';
  const lightTextColor = theme === 'light' ? '#8A8D8E' : 'white';
  const tableColor = theme === 'light' ? "#667085" : "#6e299aff";
  const tableColorBold = theme === 'light' ? '#101828' : "blue.blue400";
  const titleTextColor = theme === 'light' ? '#1F2937' : '#eeeeeeff';
  const subTitleTextColor = theme === 'light' ? '#686C75' : 'white';
  const NavListColor = theme === 'light' ? "#333" : 'white';
  const NavListBg = theme === 'light' ? "blue.blue500" : "blue.blue400";

  return {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    chartFillColor,
    tableColor,
    tableColorBold,
    chartFillXColor,
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
