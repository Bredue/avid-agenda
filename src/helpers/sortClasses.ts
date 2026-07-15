import ClassModel from "../models/class";

export const handleClassSort = (classes: ClassModel[]) => {
    return classes.sort((a, b) => {
      const extractParts = (str: any) => {
          const match = str.match(/^(\d+)([A-Z]?)$/);
          return match ? [Number(match[1]), match[2]] : [Infinity, ''];
      };
  
      const [aNumber, aLetter] = extractParts(a.period);
      const [bNumber, bLetter] = extractParts(b.period);
  
      if (aNumber === bNumber) {
          return aLetter.localeCompare(bLetter);
      } else {
          return aNumber - bNumber;
      }
    });
  };