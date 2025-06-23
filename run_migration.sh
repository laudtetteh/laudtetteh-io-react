#!/bin/bash

echo "🚀 Starting blog date migration..."
echo ""

# Change to the backend directory
cd backend

# Run the migration script
echo "📝 Running migration script..."
python -m app.scripts.migrate_dates

echo ""
echo "✅ Migration script completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your containers"
echo "   2. Test that existing blog functionality still works"
echo "   3. Check that new posts get the date_created field"
echo "   4. Check that updated posts get the date_updated field"
echo "" 