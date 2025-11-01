import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../model/Product.js';

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
    console.error('DB_URI environment variable is not set. Aborting.');
    process.exit(1);
}

// Allow overriding defaults via env: DEFAULT_SIZES and DEFAULT_COLORS (comma separated)
const defaultSizes = process.env.DEFAULT_SIZES
    ? process.env.DEFAULT_SIZES.split(',').map((s) => s.trim()).filter(Boolean)
    : ['S', 'M', 'L', 'XL'];

const defaultColors = process.env.DEFAULT_COLORS
    ? process.env.DEFAULT_COLORS.split(',').map((c) => c.trim()).filter(Boolean)
    : ['Black', 'White', 'Blue'];

async function run() {
    console.log('Connecting to DB...');
    await mongoose.connect(DB_URI);
    console.log('Connected to DB');

    // Update products with missing or empty sizes
    const sizesFilter = {
        $or: [
            { sizes: { $exists: false } },
            { sizes: { $eq: [] } },
            { sizes: null },
            { sizes: { $size: 1 } },
            { "sizes.0": { $in: [null, ""] } }
        ],
    };

    const colorsFilter = {
        $or: [
            { colors: { $exists: false } },
            { colors: { $eq: [] } },
            { colors: null },
            { colors: { $size: 1 } },
            { "colors.0": { $in: [null, ""] } }
        ],
    };

    console.log('Default sizes:', defaultSizes);
    console.log('Default colors:', defaultColors);

    const sizesResult = await Product.updateMany(sizesFilter, { $set: { sizes: defaultSizes } });
    console.log('Sizes update result:', sizesResult);

    const colorsResult = await Product.updateMany(colorsFilter, { $set: { colors: defaultColors } });
    console.log('Colors update result:', colorsResult);

    await mongoose.disconnect();
    console.log('Disconnected. Done.');
}

run().catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
});
