import re
import json

text = """
Special Item Entrees
Street Food
Paav Bhaji (V): Spicy mashed veggies with buttery buns, a Mumbai street classic you’ll devour.
Vada Paav (V): Mumbai’s spicy potato fritter in a soft bun, crunchy, fiery, and addictive.
Aloo Bonda (V, VG): Spiced potato balls in crispy gram flour, a golden snack you can’t stop eating.
Samosa (V, VG): Crispy pastry stuffed with spiced potatoes, flaky and bursting with flavor.
Dabeli (V): Gujarati spiced potatoes in a pav with peanuts, sweet, spicy, and irresistible.
Dahi Vada (V): Soft lentil dumplings in spiced yogurt, cool, creamy, and oh-so-refreshing.
Misal Paav (V, VG): Spicy Maharashtrian lentil curry with bread,！crunchy toppings make it a must-try.
Paneer Kathi Rolls (V): Juicy paneer wrapped in a flaky roll, street-style goodness in every bite.
Chicken Biriyani: Fragrant rice layered with spiced chicken, a feast you’ll dream about.
Veg Biriyani (V): Aromatic rice with veggies and spices, a veggie lover’s flavor explosion.
Chilli Chicken with Fried Rice: Indo-Chinese spicy chicken with crispy fried rice, pure comfort.
Chilli Paneer with Fried Rice (V): Spicy paneer with fried rice, an Indo-Chinese treat you’ll crave.
Chilli Chicken with Hakka Noodles: Spicy chicken with stir-fried noodles, bold and slurpy good.
Chilli Paneer with Hakka Noodles (V): Spicy paneer with hakka noodles, a veggie twist you’ll love.
Hara Bhara Kabab (V, VG): Green veggie patties with spices, crispy outside, tender inside—pure bliss.
Tawa Pulao (V, VG): Street-style rice with veggies and spices, sizzling and packed with flavor.
Daal Vada (V, VG): Crispy lentil fritters with bold spices, a crunchy street snack you’ll adore.
Bombay Missle Paav (V, VG): Mumbai’s spicy misal with soft paav, fiery and crunchy, a street classic you’ll devour.
Extra Paav (V, VG): Soft, buttery paav buns, perfect for soaking up curry, a simple add-on you’ll want more of.
Bombay Vada Paav (Qty: 2 pieces) (V): Spiced potato fritters in buns, Mumbai-style, crispy and bold, a street snack you’ll crave.
Hara Bhara Kabab (Qty: 4) w/ Mint Chutneys (V, VG): Green veggie kababs with minty dip, crisp and fresh, a bite that hooks you instantly.
Bread Pakora w/ Chutneys (V): Spiced potato-stuffed bread, fried golden with chutneys, a crunchy treat you’ll adore.
Samosa (Qty: 4 pieces) (V, VG): Crispy pastries with spiced filling, flaky and bold, a street food classic you’ll crave.
Batata Vada with Chutney (3) (V, VG): Spiced potato balls, fried crisp with tangy chutney, a Bombay bite you’ll want more of.
Sabudana Vada (Qty: 3 pieces) w/ Chutney (V, VG): Crunchy sago fritters with chutney, light and spiced, a fasting snack you’ll love.
Matki Misle Paav (V, VG): Spicy moth bean curry with paav, topped with crunch, a Maharashtrian hit you’ll crave.
Mendu Vadai (Qty: 3 pieces) (V, VG): Crispy lentil donuts, South Indian-style, golden and bold, a snack you’ll savor.
Idlis Chutney & Sambar (Qty: 6 pieces) (V, VG): Soft idlis with chutney and sambar, light and tangy, a South Indian delight you’ll adore.
Daal Vada Gujarati (10 pieces) w/ Chutneys (V, VG): Spiced lentil fritters, crunchy and bold, a Gujarati street bite you’ll want to dip.
Methi Pakora (V, VG): Fenugreek fritters fried crisp, earthy and spiced, a rainy-day snack you’ll crave.
Gujarati Veg Muthia (12-15 pieces) (V, VG): Steamed veggie dumplings with spices, soft and flavorful, a Gujarati treat you’ll love.
Paneer Stuffed Pakora (V): Paneer-filled fritters, crispy outside, creamy inside, a spiced snack you’ll devour.
Pani Puri (12 puri, potatoes, chana, sprout mix w/ paani and chutney and onion) (V, VG): Crispy puris with spicy water and fillings, a tangy burst you’ll crave all day.
Ragda Petis (V): Spiced pea curry over potato patties, topped with crunch, a street chaat you’ll adore.
Samosa Chaat (V): Crushed samosas with chutneys and yogurt, messy and spiced, a chaat lover’s dream come true.
Puran Poli (3) Special (V): Sweet lentil-stuffed flatbreads, soft and spiced, a Maharashtrian treat you’ll savor.
Paneer 65 (V): Spicy paneer bites, fried crisp with bold flavors, an Indo-Chinese kick you’ll crave.
Gobi Manchurian (V, VG): Crispy cauliflower in a tangy Manchurian sauce, bold and addictive, a street hit you’ll love.
Veg Manchurian w/ Fried Rice (V, VG): Veggie balls in a thick sauce with fried rice, Indo-Chinese comfort you’ll devour.
Chicken Manchurian with Fried Rice: Juicy chicken in Manchurian sauce with fried rice, spicy and hearty, a must-try.
Tofu-Veg Hakka Noodles (V, VG): Tofu and veggies tossed with hakka noodles, light and spiced, a slurpy delight you’ll crave.
Szechwan Paneer (V): Paneer in a fiery Szechwan sauce, bold and spicy, an Indo-Chinese treat you’ll love.
Szechwan Noodles (V, VG): Spicy noodles with a Szechwan kick, slurpy and bold, a street dish you’ll adore.
Egg Puffs (2): Flaky pastries with spiced egg filling, crisp and savory, a quick bite you’ll crave.
Bombay Veg Frankie (Qty: 2) (V): Spiced veggies rolled in a soft wrap, Mumbai-style, a street roll you’ll devour.
Gujarati Dabeli (Qty: 2 pieces) (V): Spiced potato buns with peanuts and chutney, sweet and spicy, a Gujarat gem.
Paneer Masala Puffs (2) (V): Flaky puffs with spiced paneer, crisp and creamy, a snack you’ll want more of.
Chicken 65: Spicy fried chicken bites, juicy and bold, a South Indian classic you’ll crave.
Szechuan Chicken: Chicken in a fiery Szechuan sauce, spicy and succulent, an Indo-Chinese hit you’ll love.
Veg Hakka Noodles with Tofu (V, VG): Veggies and tofu in slurpy hakka noodles, light and spiced, a street dish you’ll adore.
Chicken Kathi Roll with Eggs and Cheese (2): Spiced chicken, egg, and cheese in a roll, hearty and gooey, a street treat you’ll crave.

Breakfast Items (V)
Daal Vada (V, VG): Crispy lentil fritters with spices, a hearty start to your day.
Poha (V, VG): Light Maharashtrian flattened rice with veggies, zesty and perfect for breakfast.
Sabudana Khichdi (V, VG): Sago pearls with peanuts and spices, a fasting dish you’ll crave anytime.
Upma (V, VG): South Indian semolina with veggies, warm, spiced, and oh-so-comforting.
Medhu Vadai with Sambar and Coconut Chutney (V, VG) 
Idli with Sambar and Coconut Chutney (V, VG) 
Gujarati Handvo (V): A savory lentil cake with veggies, crunchy top, soft inside—pure joy.
Khaman Dhokla (V, VG): Spongy chickpea flour cakes, steamed and tangy, a Gujarati delight.
Rava Veg Dhokla (V): Semolina cakes with veggies, light, fluffy, and bursting with flavor.
Vati Daal Na Khaman (V, VG): Dense, tangy Gujarati lentil steamed snack, bold and irresistible.
Gujarati Handvo (Breakfast) (V): A savory lentil-veggie cake, crisp outside, soft inside, a Gujarati breakfast you’ll crave.
Moong Daal Veg Dhokla (V): Steamed moong dal cakes with veggies, spongy and spiced, a light bite you’ll crave.
Mix Veg Paratha (V, VG): Flaky flatbread stuffed with spiced veggies, crisp and hearty, a roti lover’s dream come true.
Aloo Matar Paratha (V, VG): Potato and pea-stuffed paratha, golden and spiced, a comforting bite you’ll want with curd.
Mooli Paratha (V, VG): Radish-stuffed flatbread with bold spices, flaky and flavorful, a rustic treat you’ll adore.
Paneer Cheese Paratha (V): Paneer and cheese stuffed in a crispy paratha, gooey and spiced, pure indulgence you’ll crave.
Methi Palak Thepla (V, VG): Fenugreek and spinach in a thin, spiced flatbread, aromatic and fresh, a Gujarati gem.
Palak Thepla (V, VG): Spinach-infused flatbread with subtle spices, soft and green, a light bite you’ll love.
Methi Thepla (V, VG): Fenugreek-laced flatbread, earthy and spiced, a Gujarati classic that’s impossible to resist.

Dessert
Carrot Halwa (V): Sweet, rich carrot pudding with milk, a warm hug in every spoonful.
Gulab Jamun (V): Soft dough balls soaked in rose-cardamom syrup, a sweet lover’s dream.
Rasmalai (V): Spongy paneer balls in thickened milk, creamy and melt-in-your-mouth divine.
Sevaiyaan (V): Vermicelli in sweetened milk with nuts, a light, fragrant treat.
Suji Ka Halwa (V): Warm semolina pudding with ghee and sugar, simple and soul-satisfying.
Mango Matho (V): Creamy mango-yogurt dessert, cool, refreshing, and bursting with fruitiness.
Custard Fruit Salad (V): Silky custard with fresh fruits, a sweet, creamy medley you’ll love.
Kesari Halwa (V): Saffron-kissed semolina pudding, aromatic and sweet, pure indulgence.
Shrikhand (V): Thick, sweetened yogurt with saffron and cardamom, a cool, luxurious delight.
Dry Fruit Kheer (V): Rice pudding with dried fruits and nuts, rich and festive perfection.
Makhana Kheer (V): Lotus seeds in creamy, sweet milk, light yet decadently delicious.
Moriya Kheer (V): Barnyard millet in sweetened milk, a fasting treat that’s pure comfort.
Atte Ka Halwa (V): Warm wheat flour pudding with ghee and sugar, rich and comforting, a sweet hug you’ll love.
Lauki Ka Halwa (V): Bottle gourd cooked into a sweet, spiced pudding, creamy and unique, a dessert you’ll crave.
Pinapple Halwa (Pineapple Halwa) (V): Juicy pineapple in a sweet, spiced halwa, tropical and rich, a treat you’ll savor.
Beet Root Halwa (V): Vibrant beetroot pudding with ghee and nuts, earthy and sweet, a colorful delight you’ll adore.
Pineapple Kesari (V): Saffron-kissed pineapple semolina pudding, aromatic and sweet, a South Indian gem you’ll crave.
Angoori Mango Rabdi (V): Tiny mango dumplings in thick, sweetened milk, creamy and fruity, a royal bite you’ll love.
Sitafal Basundi (V): Custard apple in a rich, thickened milk dessert, sweet and fragrant, pure indulgence you’ll crave.
Strawberry Rabdi (V): Strawberry-infused thickened milk, creamy and tangy, a modern twist you’ll want more of.
Rava Laddoo (V): Sweet semolina balls with nuts, crumbly and spiced, a festive treat you’ll adore.
Ganesh Churma Laddoo (Jaggery) (V, VG): Jaggery-sweetened wheat balls, rustic and rich, a Ganesh-favored sweet you’ll crave.
Boondi Ke Laddoo (V): Crispy boondi bound in sweet syrup, juicy and spiced, a classic you’ll love.
Dryfruit Rabdi (V): Thickened milk with a medley of dry fruits, rich and creamy, a decadent bite you’ll savor.
Rasgulla (V): Spongy Bengali cheese balls in light syrup, soft and sweet, a dessert you’ll crave.
Gond Pak (V): Nutty gond in a jaggery-sweet mix, chewy and rich, a winter treat you’ll adore.
Methi Ke Laddoo (V): Fenugreek-laced sweet balls, earthy and spiced, a healthy indulgence you’ll want more of.
Mango Kheer (V): Creamy rice pudding with mango puree, sweet and fruity, a summer delight you’ll love.
Dry Fruit Srikhand (V): Thick yogurt with dry fruits and saffron, creamy and rich, a Gujarati gem you’ll crave.
Gulab Ki Kheer (V): Rose-infused rice pudding, fragrant and sweet, a floral treat you’ll savor.
Fruit Custard (V): Creamy custard with fresh fruits, light and sweet, a refreshing bite you’ll adore.
Mango Raas with Puris (Combo) (V): Sweet mango pulp with fluffy puris, juicy and spiced, a combo you’ll crave.
Falooda (V): Layers of vermicelli, milk, and ice cream, cool and sweet, a dessert you’ll love.
Shahi Tukda (V): Fried bread in thickened milk with nuts, rich and royal, a Mughal treat you’ll crave.
Sukhdi (Sweet) Gol Papdi (6 pieces) (V, VG): Jaggery-sweetened wheat squares, crumbly and rich, a Gujarati sweet you’ll adore.

Chutneys (V, VG)
Tamarind Chutney (V, VG): Tangy tamarind with sweet-spicy notes, a zesty dip that lifts every bite you’ll love.
Coriander Mint Chutney (V, VG): Fresh coriander and mint with a spicy kick, vibrant and bold, a chutney you’ll crave.
Coconut Chutney (V, VG): Creamy coconut with a hint of spice, smooth and South Indian, a dip you’ll adore.
Peanut Chutney (V, VG): Nutty peanuts with a spicy twist, rich and bold, a sidekick you’ll want more of.
Tomato Chutney (V, VG): Spiced tomato puree, tangy and robust, a versatile dip you’ll crave with everything.
Carrot Chili Pickles (V, VG): Crunchy carrots with a chili kick, tangy and spiced, a pickle you’ll love to crunch.
Chili-Garlic 'Hot' Chutney (V, VG): Fiery garlic and chili blend, bold and spicy, a kick you’ll crave on the side.
Fresh Mango Pickles (V, VG): Juicy mango chunks in a tangy-spicy mix, fresh and bold, a pickle you’ll adore.
Athela Marcha (Fresh Pickled Chillies) (V, VG): Fresh chilies pickled with spices, crunchy and fiery, a zesty bite you’ll crave.

Sides
Salty Lassi (V): Cool, salted yogurt drink, refreshing and tangy, a perfect sip you’ll want more of.
Rose Lassi (V): Rose-infused yogurt drink, sweet and floral, a cooling treat you’ll love to sip.
Sprouted Moong Salad (V, VG): Crunchy sprouted moong with spices, fresh and light, a healthy bite you’ll crave.
Three Beans Salad (V, VG): A trio of beans with a tangy dressing, hearty and fresh, a salad you’ll adore.
Mix Fruit Salad (V, VG): Juicy mixed fruits with a hint of spice, sweet and refreshing, a bowl you’ll love.
Carrot Cabbage Sambhario / Salad (V, VG): Spiced carrot and cabbage mix, crunchy and bold, a Gujarati side you’ll crave.
Protine Salad (Protein Salad) (V, VG): Protein-packed salad with beans and spices, hearty and fresh, a bite you’ll adore.
Boondi Raita (V): Crispy boondi in spiced yogurt, cool and crunchy, a sidekick you’ll want with curry.
Beet Root Raita (V): Vibrant beetroot in creamy yogurt, sweet and spiced, a refreshing dip you’ll love.
Cucumbar Raita (V): Cool cucumber in spiced yogurt, light and fresh, a soothing side you’ll crave.
Desi Home Made Dahi (V): Thick, creamy homemade yogurt, pure and tangy, a classic you’ll want on every plate.
"""

categories = {
    "Special Item Entrees": "special_items",
    "Street Food": "special_items",
    "Breakfast Items (V)": "breakfast",
    "Dessert": "dessert",
    "Chutneys (V, VG)": "chutneys",
    "Sides": "sides"
}

prices = {
    "special_items": 9.99,
    "breakfast": 8.99,
    "dessert": 4.99,
    "chutneys": 3.99,
    "sides": 3.99
}

sql_template = "INSERT INTO menu_items (name, description, category, single_price, has_size_options, dietary_tags, is_active, sort_order) VALUES ('{name}', '{description}', '{category}', {single_price}, {has_size_options}, '{dietary_tags}', {is_active}, {sort_order});"

sql_lines = []
current_category = None
sort_order_offset = 100 # Start new items after existing ones

lines = text.strip().split('\n')
for line in lines:
    line = line.strip()
    if not line:
        continue
    
    if line in categories:
        current_category = categories[line]
        continue
    
    match = re.match(r'^(.*?)(?:\s*\((.*?)\))?\s*(?::\s*(.*))?$', line)
    if match:
        name_part = match.group(1).strip()
        tags_part = match.group(2).strip() if match.group(2) else ""
        desc_part = match.group(3).strip() if match.group(3) else ""
        
        name = name_part
        if tags_part and not tags_part.replace('V', '').replace('G', '').replace(',', '').strip():
            tags = [t.strip() for t in tags_part.split(',') if t.strip()]
        else:
            if tags_part:
                name = f"{name} ({tags_part})"
            tags = []
            
        dietary_tags = []
        for t in tags:
            if t == 'V': dietary_tags.append('vegetarian')
            if t == 'VG': dietary_tags.append('vegan')
        
        if not desc_part:
             desc_part = name
        
        price = prices.get(current_category, 9.99)
        
        # Escape single quotes for SQL
        esc_name = name.replace("'", "''")
        esc_desc = desc_part.replace("'", "''")
        
        # Format dietary tags as Postgres array
        dt_str = "{" + ",".join(dietary_tags) + "}"
        
        sql_lines.append(sql_template.format(
            name=esc_name,
            description=esc_desc,
            category=current_category,
            single_price=price,
            has_size_options="false",
            dietary_tags=dt_str,
            is_active="true",
            sort_order=sort_order_offset + len(sql_lines)
        ))

with open('supabase/migrations/20240221_insert_new_items.sql', 'w', encoding='utf-8') as f:
    f.write("-- Insert new menu items\n")
    f.write("\n".join(sql_lines))
    f.write("\n")
