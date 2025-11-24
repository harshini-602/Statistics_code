const mongoose = require('mongoose');
const Category = require('./models/Category');

const categories = [
  { name: 'Technology', description: 'All about tech, gadgets, and software.' },
  { name: 'Travel', description: 'Travel stories, guides, and tips.' },
  { name: 'Food', description: 'Recipes, reviews, and food adventures.' },
  { name: 'Lifestyle', description: 'Wellness, fashion, and daily living.' },
  { name: 'Education', description: 'Learning, teaching, and academic content.' },
  { name: 'Finance', description: 'Money, investing, and financial tips.' },
  { name: 'Health', description: 'Fitness, nutrition, and health advice.' },
  { name: 'Entertainment', description: 'Movies, music, and pop culture.' }
];

async function seedCategories() {
  await mongoose.connect('mongodb+srv://vivek:vivek@cluster0.zrwogfl.mongodb.net/?appName=Cluster0');
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('Categories seeded!');
  mongoose.disconnect();
}

seedCategories();
