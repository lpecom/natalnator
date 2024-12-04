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
      banners: {
        Row: {
          banner_type: string
          created_at: string
          desktop_image_url: string
          display_order: number | null
          id: string
          is_active: boolean | null
          link_url: string | null
          mobile_image_url: string
          name: string
          updated_at: string
        }
        Insert: {
          banner_type?: string
          created_at?: string
          desktop_image_url: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          link_url?: string | null
          mobile_image_url: string
          name: string
          updated_at?: string
        }
        Update: {
          banner_type?: string
          created_at?: string
          desktop_image_url?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          link_url?: string | null
          mobile_image_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_metrics: {
        Row: {
          campaign_id: string | null
          clicks: number
          conversions: number
          created_at: string
          date: string
          id: string
          impressions: number
          spent: number
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number
          conversions?: number
          created_at?: string
          date: string
          id?: string
          impressions?: number
          spent?: number
        }
        Update: {
          campaign_id?: string | null
          clicks?: number
          conversions?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number
          clicks: number
          conversions: number
          created_at: string
          id: string
          impressions: number
          name: string
          spent: number
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number
          clicks?: number
          conversions?: number
          created_at?: string
          id?: string
          impressions?: number
          name: string
          spent?: number
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          clicks?: number
          conversions?: number
          created_at?: string
          id?: string
          impressions?: number
          name?: string
          spent?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      common_pages: {
        Row: {
          content: string | null
          content_html: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_html?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_html?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creative_metrics: {
        Row: {
          actual_cpc: number | null
          campaign_id: string | null
          clicks: number | null
          conversion_rate: number | null
          created_at: string | null
          delivery_status: string | null
          headline: string
          id: string
          learning_status: string | null
          media_url: string
          spent: number | null
          vctr: number | null
        }
        Insert: {
          actual_cpc?: number | null
          campaign_id?: string | null
          clicks?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          delivery_status?: string | null
          headline: string
          id?: string
          learning_status?: string | null
          media_url: string
          spent?: number | null
          vctr?: number | null
        }
        Update: {
          actual_cpc?: number | null
          campaign_id?: string | null
          clicks?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          delivery_status?: string | null
          headline?: string
          id?: string
          learning_status?: string | null
          media_url?: string
          spent?: number | null
          vctr?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creative_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone_number: string
          region: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone_number: string
          region?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone_number?: string
          region?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      landing_page_products: {
        Row: {
          barcode: string | null
          benefits_html: string | null
          compare_price_brasil: number | null
          compare_price_espanha: number | null
          compare_price_spain: number | null
          cost_per_item: number | null
          created_at: string | null
          description: string | null
          description_html: string | null
          external_metadata: Json | null
          gift_card: boolean | null
          google_shopping_age_group: string | null
          google_shopping_category: string | null
          google_shopping_condition: string | null
          google_shopping_custom_label_0: string | null
          google_shopping_custom_label_1: string | null
          google_shopping_custom_label_2: string | null
          google_shopping_custom_label_3: string | null
          google_shopping_custom_label_4: string | null
          google_shopping_custom_product: boolean | null
          google_shopping_gender: string | null
          google_shopping_mpn: string | null
          id: string
          included_brasil: boolean | null
          included_espanha: boolean | null
          included_spain: boolean | null
          is_taxable: boolean | null
          landing_page_id: string | null
          name: string
          original_price: number | null
          price: number
          price_brasil: number | null
          price_espanha: number | null
          price_spain: number | null
          product_category: string | null
          product_type: string | null
          published: boolean | null
          requires_shipping: boolean | null
          seo_description: string | null
          seo_title: string | null
          settings: Json | null
          sku: string | null
          source: string
          status: string | null
          stock: number | null
          tags: string[] | null
          tax_code: string | null
          updated_at: string | null
          variant_fulfillment_service: string | null
          variant_inventory_policy: string | null
          vendor: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          barcode?: string | null
          benefits_html?: string | null
          compare_price_brasil?: number | null
          compare_price_espanha?: number | null
          compare_price_spain?: number | null
          cost_per_item?: number | null
          created_at?: string | null
          description?: string | null
          description_html?: string | null
          external_metadata?: Json | null
          gift_card?: boolean | null
          google_shopping_age_group?: string | null
          google_shopping_category?: string | null
          google_shopping_condition?: string | null
          google_shopping_custom_label_0?: string | null
          google_shopping_custom_label_1?: string | null
          google_shopping_custom_label_2?: string | null
          google_shopping_custom_label_3?: string | null
          google_shopping_custom_label_4?: string | null
          google_shopping_custom_product?: boolean | null
          google_shopping_gender?: string | null
          google_shopping_mpn?: string | null
          id?: string
          included_brasil?: boolean | null
          included_espanha?: boolean | null
          included_spain?: boolean | null
          is_taxable?: boolean | null
          landing_page_id?: string | null
          name: string
          original_price?: number | null
          price: number
          price_brasil?: number | null
          price_espanha?: number | null
          price_spain?: number | null
          product_category?: string | null
          product_type?: string | null
          published?: boolean | null
          requires_shipping?: boolean | null
          seo_description?: string | null
          seo_title?: string | null
          settings?: Json | null
          sku?: string | null
          source?: string
          status?: string | null
          stock?: number | null
          tags?: string[] | null
          tax_code?: string | null
          updated_at?: string | null
          variant_fulfillment_service?: string | null
          variant_inventory_policy?: string | null
          vendor?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          barcode?: string | null
          benefits_html?: string | null
          compare_price_brasil?: number | null
          compare_price_espanha?: number | null
          compare_price_spain?: number | null
          cost_per_item?: number | null
          created_at?: string | null
          description?: string | null
          description_html?: string | null
          external_metadata?: Json | null
          gift_card?: boolean | null
          google_shopping_age_group?: string | null
          google_shopping_category?: string | null
          google_shopping_condition?: string | null
          google_shopping_custom_label_0?: string | null
          google_shopping_custom_label_1?: string | null
          google_shopping_custom_label_2?: string | null
          google_shopping_custom_label_3?: string | null
          google_shopping_custom_label_4?: string | null
          google_shopping_custom_product?: boolean | null
          google_shopping_gender?: string | null
          google_shopping_mpn?: string | null
          id?: string
          included_brasil?: boolean | null
          included_espanha?: boolean | null
          included_spain?: boolean | null
          is_taxable?: boolean | null
          landing_page_id?: string | null
          name?: string
          original_price?: number | null
          price?: number
          price_brasil?: number | null
          price_espanha?: number | null
          price_spain?: number | null
          product_category?: string | null
          product_type?: string | null
          published?: boolean | null
          requires_shipping?: boolean | null
          seo_description?: string | null
          seo_title?: string | null
          settings?: Json | null
          sku?: string | null
          source?: string
          status?: string | null
          stock?: number | null
          tags?: string[] | null
          tax_code?: string | null
          updated_at?: string | null
          variant_fulfillment_service?: string | null
          variant_inventory_policy?: string | null
          vendor?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_products_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          created_at: string | null
          id: string
          is_homepage: boolean
          route_type: string
          settings: Json | null
          slug: string
          status: string
          template_name: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_homepage?: boolean
          route_type?: string
          settings?: Json | null
          slug: string
          status?: string
          template_name?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_homepage?: boolean
          route_type?: string
          settings?: Json | null
          slug?: string
          status?: string
          template_name?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      offer_links: {
        Row: {
          created_at: string | null
          id: string
          offer_id: string | null
          scraped: boolean | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          offer_id?: string | null
          scraped?: boolean | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          offer_id?: string | null
          scraped?: boolean | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_links_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string | null
          funnel_type: string
          id: string
          name: string
          product_cost: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          funnel_type: string
          id?: string
          name: string
          product_cost?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          funnel_type?: string
          id?: string
          name?: string
          product_cost?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
          updated_at: string | null
          variant_selections: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          variant_selections?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          variant_selections?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "landing_page_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          call_center_confirmed: boolean | null
          call_center_confirmed_at: string | null
          call_center_notes: string | null
          city: string
          confirmation_date: string | null
          created_at: string
          customer_name: string
          delivery_date: string | null
          driver_id: string | null
          driver_notes: string | null
          email: string | null
          id: string
          order_status: string
          phone_number: string
          pickup_date: string | null
          postal_code: string
          product_id: string | null
          state: string
          status_history: Json | null
          updated_at: string
          variant_selections: Json | null
        }
        Insert: {
          address: string
          call_center_confirmed?: boolean | null
          call_center_confirmed_at?: string | null
          call_center_notes?: string | null
          city: string
          confirmation_date?: string | null
          created_at?: string
          customer_name: string
          delivery_date?: string | null
          driver_id?: string | null
          driver_notes?: string | null
          email?: string | null
          id?: string
          order_status?: string
          phone_number: string
          pickup_date?: string | null
          postal_code: string
          product_id?: string | null
          state: string
          status_history?: Json | null
          updated_at?: string
          variant_selections?: Json | null
        }
        Update: {
          address?: string
          call_center_confirmed?: boolean | null
          call_center_confirmed_at?: string | null
          call_center_notes?: string | null
          city?: string
          confirmation_date?: string | null
          created_at?: string
          customer_name?: string
          delivery_date?: string | null
          driver_id?: string | null
          driver_notes?: string | null
          email?: string | null
          id?: string
          order_status?: string
          phone_number?: string
          pickup_date?: string | null
          postal_code?: string
          product_id?: string | null
          state?: string
          status_history?: Json | null
          updated_at?: string
          variant_selections?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "landing_page_products"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          landing_page_id: string | null
          name: string
          settings: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name: string
          settings?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name?: string
          settings?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          product_id: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "landing_page_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          checkout_url: string | null
          created_at: string | null
          grams: number | null
          id: string
          image_url: string | null
          inventory_tracker: string | null
          name: string
          price_adjustment: number | null
          product_id: string | null
          stock: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string | null
          grams?: number | null
          id?: string
          image_url?: string | null
          inventory_tracker?: string | null
          name: string
          price_adjustment?: number | null
          product_id?: string | null
          stock?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          checkout_url?: string | null
          created_at?: string | null
          grams?: number | null
          id?: string
          image_url?: string | null
          inventory_tracker?: string | null
          name?: string
          price_adjustment?: number | null
          product_id?: string | null
          stock?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "landing_page_products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      publisher_metrics: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          conversions: number | null
          created_at: string | null
          id: string
          site: string
          status: string | null
          vctr: number | null
          viewable_impressions: number | null
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          id?: string
          site: string
          status?: string | null
          vctr?: number | null
          viewable_impressions?: number | null
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          id?: string
          site?: string
          status?: string | null
          vctr?: number | null
          viewable_impressions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "publisher_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          admin_editable: boolean | null
          author: string
          content: string
          created_at: string | null
          id: string
          landing_page_id: string | null
          product_name: string | null
          rating: number
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          admin_editable?: boolean | null
          author: string
          content: string
          created_at?: string | null
          id?: string
          landing_page_id?: string | null
          product_name?: string | null
          rating: number
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          admin_editable?: boolean | null
          author?: string
          content?: string
          created_at?: string | null
          id?: string
          landing_page_id?: string | null
          product_name?: string | null
          rating?: number
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_options: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_days: number | null
          id: string
          is_active: boolean | null
          landing_page_id: string | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_days?: number | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_days?: number | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_options_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
