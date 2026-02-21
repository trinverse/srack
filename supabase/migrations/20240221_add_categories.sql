-- Migration to add new menu categories to the menu_category enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'menu_category' AND e.enumlabel = 'breakfast') THEN
    ALTER TYPE menu_category ADD VALUE 'breakfast';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'menu_category' AND e.enumlabel = 'dessert') THEN
    ALTER TYPE menu_category ADD VALUE 'dessert';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'menu_category' AND e.enumlabel = 'chutneys') THEN
    ALTER TYPE menu_category ADD VALUE 'chutneys';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'menu_category' AND e.enumlabel = 'sides') THEN
    ALTER TYPE menu_category ADD VALUE 'sides';
  END IF;
END $$;
