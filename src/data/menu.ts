import { MenuItem, WeeklyMenu } from '@/types';

// Sample menu items - these would be updated weekly
export const menuItems: MenuItem[] = [
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    description:
      'Tender chicken in a rich, creamy tomato sauce with aromatic spices and a touch of honey.',
    price: 14.99,
    category: 'main',
    dietaryTags: ['gluten-free'],
    spiceLevel: 2,
    isPopular: true,
  },
  {
    id: 'palak-paneer',
    name: 'Palak Paneer',
    description:
      'Fresh spinach curry with homemade cottage cheese cubes, seasoned with cumin and garam masala.',
    price: 12.99,
    category: 'main',
    dietaryTags: ['vegetarian', 'gluten-free'],
    spiceLevel: 1,
    isPopular: true,
  },
  {
    id: 'lamb-curry',
    name: 'Lamb Curry',
    description:
      'Slow-cooked lamb in a fragrant curry with caramelized onions and whole spices.',
    price: 16.99,
    category: 'main',
    dietaryTags: ['gluten-free', 'dairy-free'],
    spiceLevel: 3,
  },
  {
    id: 'chana-masala',
    name: 'Chana Masala',
    description:
      'Chickpeas simmered in a tangy tomato-based sauce with traditional North Indian spices.',
    price: 11.99,
    category: 'main',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free'],
    spiceLevel: 2,
  },
  {
    id: 'dal-tadka',
    name: 'Dal Tadka',
    description:
      'Yellow lentils tempered with cumin, garlic, and dried red chilies. Pure comfort food.',
    price: 10.99,
    category: 'main',
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free'],
    spiceLevel: 1,
  },
  {
    id: 'vegetable-biryani',
    name: 'Vegetable Biryani',
    description:
      'Fragrant basmati rice layered with seasonal vegetables, saffron, and aromatic spices.',
    price: 13.99,
    category: 'rice',
    dietaryTags: ['vegetarian', 'dairy-free'],
    spiceLevel: 2,
    isPopular: true,
  },
  {
    id: 'jeera-rice',
    name: 'Jeera Rice',
    description: 'Basmati rice tempered with cumin seeds and ghee.',
    price: 4.99,
    category: 'rice',
    dietaryTags: ['vegetarian', 'gluten-free'],
    spiceLevel: 1,
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Naan',
    description: 'Soft leavened bread brushed with garlic butter.',
    price: 3.99,
    category: 'bread',
    dietaryTags: ['vegetarian'],
    spiceLevel: 1,
  },
  {
    id: 'roti',
    name: 'Whole Wheat Roti',
    description: 'Traditional whole wheat flatbread, perfect for scooping curries.',
    price: 2.99,
    category: 'bread',
    dietaryTags: ['vegan', 'dairy-free'],
    spiceLevel: 1,
  },
  {
    id: 'raita',
    name: 'Cucumber Raita',
    description: 'Cooling yogurt with cucumber, cumin, and fresh herbs.',
    price: 3.99,
    category: 'side',
    dietaryTags: ['vegetarian', 'gluten-free'],
    spiceLevel: 1,
  },
  {
    id: 'samosa',
    name: 'Vegetable Samosas',
    description: 'Crispy pastry filled with spiced potatoes and peas. Served with chutneys.',
    price: 5.99,
    category: 'appetizer',
    dietaryTags: ['vegan', 'dairy-free'],
    spiceLevel: 2,
    isPopular: true,
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose-cardamom syrup.',
    price: 4.99,
    category: 'dessert',
    dietaryTags: ['vegetarian'],
    spiceLevel: 1,
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    description: 'Creamy yogurt smoothie with sweet Alphonso mango.',
    price: 4.99,
    category: 'beverage',
    dietaryTags: ['vegetarian', 'gluten-free'],
    spiceLevel: 1,
  },
];

export const mondayMenu: WeeklyMenu = {
  day: 'monday',
  date: '2024-01-08',
  orderDeadline: 'Saturday 6:00 PM',
  items: menuItems.filter((item) =>
    ['butter-chicken', 'palak-paneer', 'dal-tadka', 'jeera-rice', 'garlic-naan', 'raita', 'samosa', 'gulab-jamun'].includes(item.id)
  ),
};

export const thursdayMenu: WeeklyMenu = {
  day: 'thursday',
  date: '2024-01-11',
  orderDeadline: 'Tuesday 6:00 PM',
  items: menuItems.filter((item) =>
    ['lamb-curry', 'chana-masala', 'vegetable-biryani', 'roti', 'raita', 'samosa', 'mango-lassi'].includes(item.id)
  ),
};

export const featuredItems = menuItems.filter((item) => item.isPopular);
