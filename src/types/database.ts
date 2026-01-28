export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string | null
          id: string
          menu_item_id: string
          quantity: number
          size: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string | null
          id?: string
          menu_item_id: string
          quantity?: number
          size?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string | null
          id?: string
          menu_item_id?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          customer_id: string | null
          expires_at: string | null
          id: string
          order_day: Database["public"]["Enums"]["order_day"] | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          order_day?: Database["public"]["Enums"]["order_day"] | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          order_day?: Database["public"]["Enums"]["order_day"] | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address_type: string
          apartment_number: string | null
          building_name: string | null
          city: string
          created_at: string | null
          customer_id: string
          delivery_notes: string | null
          gate_code: string | null
          id: string
          is_default: boolean | null
          parking_instructions: string | null
          state: string
          street_address: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address_type?: string
          apartment_number?: string | null
          building_name?: string | null
          city: string
          created_at?: string | null
          customer_id: string
          delivery_notes?: string | null
          gate_code?: string | null
          id?: string
          is_default?: boolean | null
          parking_instructions?: string | null
          state?: string
          street_address: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address_type?: string
          apartment_number?: string | null
          building_name?: string | null
          city?: string
          created_at?: string | null
          customer_id?: string
          delivery_notes?: string | null
          gate_code?: string | null
          id?: string
          is_default?: boolean | null
          parking_instructions?: string | null
          state?: string
          street_address?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          email_opt_in: boolean | null
          full_name: string
          id: string
          is_vip: boolean | null
          loyalty_points: number | null
          notes: string | null
          phone: string
          role: Database["public"]["Enums"]["user_role"] | null
          sms_opt_in: boolean | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          email_opt_in?: boolean | null
          full_name: string
          id?: string
          is_vip?: boolean | null
          loyalty_points?: number | null
          notes?: string | null
          phone: string
          role?: Database["public"]["Enums"]["user_role"] | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          email_opt_in?: boolean | null
          full_name?: string
          id?: string
          is_vip?: boolean | null
          loyalty_points?: number | null
          notes?: string | null
          phone?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          created_at: string | null
          delivery_fee: number | null
          id: string
          is_active: boolean | null
          zip_code: string
        }
        Insert: {
          created_at?: string | null
          delivery_fee?: number | null
          id?: string
          is_active?: boolean | null
          zip_code: string
        }
        Update: {
          created_at?: string | null
          delivery_fee?: number | null
          id?: string
          is_active?: boolean | null
          zip_code?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          free_item_id: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          minimum_order_amount: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          free_item_id?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_order_amount?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          free_item_id?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_order_amount?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_free_item_id_fkey"
            columns: ["free_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          is_subscribed: boolean | null
          source: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_subscribed?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_subscribed?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      loyalty_settings: {
        Row: {
          id: string
          is_active: boolean | null
          points_per_dollar: number | null
          points_redemption_rate: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          points_per_dollar?: number | null
          points_redemption_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          points_per_dollar?: number | null
          points_redemption_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          customer_id: string
          description: string | null
          id: string
          order_id: string | null
          points_change: number
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          description?: string | null
          id?: string
          order_id?: string | null
          points_change: number
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points_change?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: Database["public"]["Enums"]["menu_category"]
          created_at: string | null
          description: string
          dietary_tags: Database["public"]["Enums"]["dietary_tag"][] | null
          has_size_options: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price_16oz: number | null
          price_8oz: number | null
          single_price: number | null
          sort_order: number | null
          spice_level: Database["public"]["Enums"]["spice_level"] | null
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["menu_category"]
          created_at?: string | null
          description: string
          dietary_tags?: Database["public"]["Enums"]["dietary_tag"][] | null
          has_size_options?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price_16oz?: number | null
          price_8oz?: number | null
          single_price?: number | null
          sort_order?: number | null
          spice_level?: Database["public"]["Enums"]["spice_level"] | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["menu_category"]
          created_at?: string | null
          description?: string
          dietary_tags?: Database["public"]["Enums"]["dietary_tag"][] | null
          has_size_options?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price_16oz?: number | null
          price_8oz?: number | null
          single_price?: number | null
          sort_order?: number | null
          spice_level?: Database["public"]["Enums"]["spice_level"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          menu_item_id: string
          order_id: string
          quantity: number
          size: string | null
          special_instructions: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          menu_item_id: string
          order_id: string
          quantity?: number
          size?: string | null
          special_instructions?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
          size?: string | null
          special_instructions?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          agreed_to_delivery_terms: boolean | null
          agreed_to_pickup_terms: boolean | null
          agreed_to_terms: boolean | null
          created_at: string | null
          customer_id: string
          delivery_fee: number | null
          discount_amount: number | null
          discount_code_id: string | null
          id: string
          is_gift: boolean | null
          order_date: string
          order_day: Database["public"]["Enums"]["order_day"]
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          payment_intent_id: string | null
          payment_status: string | null
          pickup_location_id: string | null
          points_discount: number | null
          points_redeemed: number | null
          recipient_name: string | null
          recipient_notes: string | null
          recipient_phone: string | null
          shipping_apartment: string | null
          shipping_building_name: string | null
          shipping_city: string | null
          shipping_delivery_notes: string | null
          shipping_gate_code: string | null
          shipping_parking_instructions: string | null
          shipping_state: string | null
          shipping_street_address: string | null
          shipping_zip_code: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax: number | null
          total: number
          updated_at: string | null
        }
        Insert: {
          agreed_to_delivery_terms?: boolean | null
          agreed_to_pickup_terms?: boolean | null
          agreed_to_terms?: boolean | null
          created_at?: string | null
          customer_id: string
          delivery_fee?: number | null
          discount_amount?: number | null
          discount_code_id?: string | null
          id?: string
          is_gift?: boolean | null
          order_date: string
          order_day: Database["public"]["Enums"]["order_day"]
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          payment_intent_id?: string | null
          payment_status?: string | null
          pickup_location_id?: string | null
          points_discount?: number | null
          points_redeemed?: number | null
          recipient_name?: string | null
          recipient_notes?: string | null
          recipient_phone?: string | null
          shipping_apartment?: string | null
          shipping_building_name?: string | null
          shipping_city?: string | null
          shipping_delivery_notes?: string | null
          shipping_gate_code?: string | null
          shipping_parking_instructions?: string | null
          shipping_state?: string | null
          shipping_street_address?: string | null
          shipping_zip_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string | null
        }
        Update: {
          agreed_to_delivery_terms?: boolean | null
          agreed_to_pickup_terms?: boolean | null
          agreed_to_terms?: boolean | null
          created_at?: string | null
          customer_id?: string
          delivery_fee?: number | null
          discount_amount?: number | null
          discount_code_id?: string | null
          id?: string
          is_gift?: boolean | null
          order_date?: string
          order_day?: Database["public"]["Enums"]["order_day"]
          order_number?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          payment_intent_id?: string | null
          payment_status?: string | null
          pickup_location_id?: string | null
          points_discount?: number | null
          points_redeemed?: number | null
          recipient_name?: string | null
          recipient_notes?: string | null
          recipient_phone?: string | null
          shipping_apartment?: string | null
          shipping_building_name?: string | null
          shipping_city?: string | null
          shipping_delivery_notes?: string | null
          shipping_gate_code?: string | null
          shipping_parking_instructions?: string | null
          shipping_state?: string | null
          shipping_street_address?: string | null
          shipping_zip_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pickup_location_id_fkey"
            columns: ["pickup_location_id"]
            isOneToOne: false
            referencedRelation: "pickup_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_locations: {
        Row: {
          address: string
          city: string
          created_at: string | null
          driver_car_description: string | null
          driver_name: string | null
          driver_phone: string | null
          id: string
          is_active: boolean | null
          name: string
          pickup_time: string | null
          sort_order: number | null
          state: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          driver_car_description?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pickup_time?: string | null
          sort_order?: number | null
          state?: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          driver_car_description?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pickup_time?: string | null
          sort_order?: number | null
          state?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      weekly_menus: {
        Row: {
          created_at: string | null
          id: string
          is_available: boolean | null
          menu_date: string
          menu_item_id: string
          order_day: Database["public"]["Enums"]["order_day"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          menu_date: string
          menu_item_id: string
          order_day: Database["public"]["Enums"]["order_day"]
        }
        Update: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          menu_date?: string
          menu_item_id?: string
          order_day?: Database["public"]["Enums"]["order_day"]
        }
        Relationships: [
          {
            foreignKeyName: "weekly_menus_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dietary_tag:
        | "vegetarian"
        | "non_vegetarian"
        | "vegan"
        | "gluten_free"
        | "hot"
        | "medium"
        | "mild"
      menu_category:
        | "veg_entrees"
        | "non_veg_entrees"
        | "dal_entrees"
        | "roties_rice"
        | "special_items"
      order_day: "monday" | "thursday"
      order_status:
        | "pending"
        | "in_progress"
        | "hold"
        | "ready"
        | "completed"
        | "canceled"
      order_type: "delivery" | "pickup"
      spice_level: "mild" | "medium" | "hot"
      user_role: "admin" | "kitchen" | "marketing" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Helper types for convenience
export type MenuItem = Tables<'menu_items'>
export type Customer = Tables<'customers'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Cart = Tables<'carts'>
export type CartItem = Tables<'cart_items'>
export type CustomerAddress = Tables<'customer_addresses'>
export type DeliveryZone = Tables<'delivery_zones'>
export type PickupLocation = Tables<'pickup_locations'>
export type DiscountCode = Tables<'discount_codes'>
export type WeeklyMenu = Tables<'weekly_menus'>
export type AuditLog = Tables<'audit_logs'>
export type LoyaltyTransaction = Tables<'loyalty_transactions'>
export type EmailSubscriber = Tables<'email_subscribers'>
export type MenuSetting = Tables<'menu_settings'>
export type LoyaltySetting = Tables<'loyalty_settings'>

// Enum types
export type MenuCategory = Enums<'menu_category'>
export type DietaryTag = Enums<'dietary_tag'>
export type SpiceLevel = Enums<'spice_level'>
export type OrderDay = Enums<'order_day'>
export type OrderStatus = Enums<'order_status'>
export type OrderType = Enums<'order_type'>
export type UserRole = Enums<'user_role'>
