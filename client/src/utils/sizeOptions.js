// Size options based on cricket equipment categories

// Get primary selection options (handle type, hand, etc.)
export const getPrimaryOptions = (category) => {
  switch(category?.toLowerCase()) {
    case 'bats':
      return { label: 'Handle Type', options: ['SH', 'LH'] };
    case 'gloves':
      return { label: 'Hand', options: ['Left', 'Right'] };
    default:
      return null;
  }
};

// Get size options based on category and primary selection
export const getSizeOptions = (category, primarySelection = null) => {
  switch(category?.toLowerCase()) {
    case 'bats':
      if (!primarySelection) return [];
      // SH gets sizes 1-5, LH gets sizes 6-8
      if (primarySelection === 'SH') {
        return ['1', '2', '3', '4', '5'];
      } else if (primarySelection === 'LH') {
        return ['6', '7', '8'];
      }
      return [];
      
    case 'gloves':
      if (!primarySelection) return [];
      // Both hands get S, M, L
      return ['S', 'M', 'L'];
      
    case 'balls':
      return ['One Size'];
      
    case 'pads':
      return ['XS', 'S', 'M', 'L', 'XL'];
      
    case 'helmets':
      return ['S', 'M', 'L', 'XL'];
      
    case 'shoes':
      return ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
      
    case 'clothing':
    case 'jerseys':
    case 'pants':
    case 'track':
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
      
    case 'stumps':
      return ['Standard'];
      
    case 'accessories':
    default:
      return ['One Size'];
  }
};

// Check if category needs two-step selection
export const needsTwoStepSelection = (category) => {
  return ['bats', 'gloves'].includes(category?.toLowerCase());
};
