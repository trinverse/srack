import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface OrderItemPayload {
    menu_item_id: string;
    size: '8oz' | '16oz' | null;
    quantity: number;
}

interface PlaceOrderPayload {
    items: OrderItemPayload[];
    order_type: 'delivery' | 'pickup';
    order_day: 'monday' | 'thursday';
    // Delivery fields
    address_id?: string;
    // Pickup fields
    pickup_location_id?: string;
    // Gift fields
    is_gift?: boolean;
    recipient_name?: string;
    recipient_phone?: string;
    recipient_notes?: string;
    // Discount
    discount_code?: string;
    // Terms
    agreed_to_terms: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Verify the user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get customer record
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();

        if (customerError || !customer) {
            return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
        }

        // 3. Parse and validate the request body
        const body: PlaceOrderPayload = await request.json();

        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        if (!body.agreed_to_terms) {
            return NextResponse.json({ error: 'You must agree to the terms' }, { status: 400 });
        }

        // 4. Fetch REAL prices from the database for ALL items in the cart
        const menuItemIds = [...new Set(body.items.map(item => item.menu_item_id))];
        const { data: dbMenuItems, error: menuError } = await supabase
            .from('menu_items')
            .select('*')
            .in('id', menuItemIds)
            .eq('is_active', true);

        if (menuError || !dbMenuItems) {
            return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
        }

        // 5. Build a lookup map of DB prices
        const menuItemMap = new Map(dbMenuItems.map(item => [item.id, item]));

        // 6. Recalculate every line item using DB prices (NEVER trust client)
        let serverSubtotal = 0;
        const verifiedOrderItems: {
            menu_item_id: string;
            item_name: string;
            size: string | null;
            quantity: number;
            unit_price: number;
            total_price: number;
        }[] = [];

        for (const cartItem of body.items) {
            const dbItem = menuItemMap.get(cartItem.menu_item_id);

            if (!dbItem) {
                return NextResponse.json(
                    { error: `Item "${cartItem.menu_item_id}" is no longer available` },
                    { status: 400 }
                );
            }

            // Determine the correct price from DB
            let unitPrice: number;
            if (dbItem.has_size_options && cartItem.size) {
                unitPrice = cartItem.size === '8oz'
                    ? (dbItem.price_8oz || 0)
                    : (dbItem.price_16oz || 0);
            } else {
                unitPrice = dbItem.single_price || 0;
            }

            if (unitPrice <= 0) {
                return NextResponse.json(
                    { error: `Invalid price for item "${dbItem.name}"` },
                    { status: 400 }
                );
            }

            if (cartItem.quantity <= 0 || cartItem.quantity > 50) {
                return NextResponse.json(
                    { error: `Invalid quantity for item "${dbItem.name}"` },
                    { status: 400 }
                );
            }

            const totalPrice = unitPrice * cartItem.quantity;
            serverSubtotal += totalPrice;

            verifiedOrderItems.push({
                menu_item_id: dbItem.id,
                item_name: dbItem.name,
                size: cartItem.size,
                quantity: cartItem.quantity,
                unit_price: unitPrice,
                total_price: totalPrice,
            });
        }

        // 7. Enforce $30 minimum order
        if (serverSubtotal < 30) {
            return NextResponse.json(
                { error: `Minimum order is $30.00. Your subtotal is $${serverSubtotal.toFixed(2)}` },
                { status: 400 }
            );
        }

        // 8. Validate discount code if provided
        let discountAmount = 0;
        let discountCodeId: string | null = null;

        if (body.discount_code) {
            const { data: discountData } = await supabase
                .from('discount_codes')
                .select('*')
                .eq('code', body.discount_code.toUpperCase())
                .eq('is_active', true)
                .single();

            if (discountData) {
                // Check minimum order amount
                if (discountData.minimum_order_amount && serverSubtotal < discountData.minimum_order_amount) {
                    return NextResponse.json(
                        { error: `Minimum order of $${discountData.minimum_order_amount} required for this code` },
                        { status: 400 }
                    );
                }

                // Check max uses
                if (discountData.max_uses && (discountData.current_uses || 0) >= discountData.max_uses) {
                    return NextResponse.json({ error: 'Discount code has reached its usage limit' }, { status: 400 });
                }

                // Calculate discount
                if (discountData.discount_type === 'percentage') {
                    discountAmount = serverSubtotal * (discountData.discount_value / 100);
                } else if (discountData.discount_type === 'fixed') {
                    discountAmount = discountData.discount_value;
                }

                // Discount cannot exceed subtotal
                discountAmount = Math.min(discountAmount, serverSubtotal);
                discountCodeId = discountData.id;
            }
            // If discount code not found, silently ignore (client already validated)
        }

        // 9. Calculate server-side totals
        const taxRate = 0.08;
        const tax = Math.round((serverSubtotal - discountAmount) * taxRate * 100) / 100;
        const total = Math.round((serverSubtotal - discountAmount + tax) * 100) / 100;

        // 10. Get delivery address if delivery order
        let shippingDetails: Record<string, string | null> = {};
        if (body.order_type === 'delivery' && body.address_id) {
            const { data: address } = await supabase
                .from('customer_addresses')
                .select('*')
                .eq('id', body.address_id)
                .eq('customer_id', customer.id)
                .single();

            if (!address) {
                return NextResponse.json({ error: 'Delivery address not found' }, { status: 400 });
            }

            // Validate the zip code is in delivery zone
            const { data: zone } = await supabase
                .from('delivery_zones')
                .select('*')
                .eq('zip_code', address.zip_code)
                .eq('is_active', true)
                .single();

            if (!zone) {
                return NextResponse.json(
                    { error: 'Your delivery address ZIP code is not in our delivery zone' },
                    { status: 400 }
                );
            }

            shippingDetails = {
                shipping_street_address: address.street_address,
                shipping_apartment: address.apartment_number,
                shipping_building_name: address.building_name,
                shipping_city: address.city,
                shipping_state: address.state,
                shipping_zip_code: address.zip_code,
                shipping_gate_code: address.gate_code,
                shipping_parking_instructions: address.parking_instructions,
                shipping_delivery_notes: address.delivery_notes,
            };
        }

        // 11. Validate pickup location if pickup order
        if (body.order_type === 'pickup') {
            if (!body.pickup_location_id) {
                return NextResponse.json({ error: 'Please select a pickup location' }, { status: 400 });
            }

            const { data: location } = await supabase
                .from('pickup_locations')
                .select('id')
                .eq('id', body.pickup_location_id)
                .eq('is_active', true)
                .single();

            if (!location) {
                return NextResponse.json({ error: 'Selected pickup location is no longer available' }, { status: 400 });
            }
        }

        // 12. Calculate the next order date
        const orderDate = getNextOrderDate(body.order_day);

        // 13. Generate order number
        const orderNumber = `SR-${Date.now().toString(36).toUpperCase()}`;

        // 14. Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_id: customer.id,
                order_type: body.order_type,
                order_day: body.order_day,
                order_date: orderDate,
                status: 'pending',
                ...shippingDetails,
                pickup_location_id: body.order_type === 'pickup' ? body.pickup_location_id : null,
                is_gift: body.is_gift || false,
                recipient_name: body.is_gift ? body.recipient_name : null,
                recipient_phone: body.is_gift ? body.recipient_phone : null,
                recipient_notes: body.is_gift ? body.recipient_notes : null,
                subtotal: serverSubtotal,
                tax,
                discount_amount: discountAmount,
                discount_code_id: discountCodeId,
                total,
                agreed_to_terms: body.agreed_to_terms,
                agreed_to_delivery_terms: body.order_type === 'delivery' ? body.agreed_to_terms : null,
                agreed_to_pickup_terms: body.order_type === 'pickup' ? body.agreed_to_terms : null,
                payment_status: 'pending',
            })
            .select()
            .single();

        if (orderError || !order) {
            console.error('Order creation error:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // 15. Create order items
        const orderItems = verifiedOrderItems.map(item => ({
            order_id: order.id,
            ...item,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

        if (itemsError) {
            console.error('Order items error:', itemsError);
            // Try to clean up the orphaned order
            await supabase.from('orders').delete().eq('id', order.id);
            return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 });
        }

        // 16. Increment discount code usage if applicable
        if (discountCodeId) {
            try {
                const { data: currentCode } = await supabase
                    .from('discount_codes')
                    .select('current_uses')
                    .eq('id', discountCodeId)
                    .single();

                if (currentCode) {
                    await supabase
                        .from('discount_codes')
                        .update({ current_uses: (currentCode.current_uses || 0) + 1 })
                        .eq('id', discountCodeId);
                }
            } catch {
                // Non-critical: if this fails, the discount still worked
                console.warn('Failed to increment discount usage for', discountCodeId);
            }
        }

        return NextResponse.json({
            success: true,
            order_id: order.id,
            order_number: orderNumber,
            total,
        });
    } catch (err) {
        console.error('Place order unexpected error:', err);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}

function getNextOrderDate(day: 'monday' | 'thursday'): string {
    const now = new Date();
    const dayOfWeek = day === 'monday' ? 1 : 4;
    let daysUntil = (dayOfWeek - now.getDay() + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    // Use local date parts to avoid timezone shift
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dateStr = String(nextDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${dateStr}`;
}
