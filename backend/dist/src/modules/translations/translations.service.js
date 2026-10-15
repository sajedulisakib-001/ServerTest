"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationsService = exports.DEFAULT_STATIC_UI_TRANSLATIONS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
exports.DEFAULT_STATIC_UI_TRANSLATIONS = [
    { key: 'brand_title', bn: 'স্টোরফোর্জ', en: 'StoreForge', category: 'header_navigation', subCategory: 'brand_header', description: 'Main brand name in header' },
    { key: 'brand_subtitle', bn: 'হস্তনির্মিত কাঠের মানচিত্র', en: 'Handcrafted Wooden Maps', category: 'header_navigation', subCategory: 'brand_header', description: 'Brand subtitle in header' },
    { key: 'header_lang_switcher_title', bn: 'ভাষা পরিবর্তন', en: 'Switch Language', category: 'header_navigation', subCategory: 'brand_header', description: 'Language switcher tooltip' },
    { key: 'header_mobile_drawer_lang_label', bn: 'ভাষা / Language', en: 'Language / ভাষা', category: 'header_navigation', subCategory: 'brand_header', description: 'Mobile drawer language label' },
    { key: 'nav_home', bn: 'হোম', en: 'Home', category: 'header_navigation', subCategory: 'nav_links', description: 'Home navigation link' },
    { key: 'nav_products', bn: 'পণ্যসমূহ', en: 'Products', category: 'header_navigation', subCategory: 'nav_links', description: 'Products navigation link' },
    { key: 'nav_all_products', bn: 'সকল পণ্য', en: 'All Products', category: 'header_navigation', subCategory: 'nav_links', description: 'All products dropdown link' },
    { key: 'nav_categories', bn: 'ক্যাটাগরি', en: 'Categories', category: 'header_navigation', subCategory: 'nav_links', description: 'Categories navigation dropdown' },
    { key: 'nav_dropdown_title', bn: 'ক্যাটাগরি সমূহ', en: 'Browse Categories', category: 'header_navigation', subCategory: 'nav_links', description: 'Category dropdown menu title' },
    { key: 'nav_view_all', bn: 'সব দেখুন', en: 'View All', category: 'header_navigation', subCategory: 'nav_links', description: 'View all category products link' },
    { key: 'nav_policies', bn: 'পলিসি ও তথ্য', en: 'Policies & Info', category: 'header_navigation', subCategory: 'nav_links', description: 'Policies navigation link' },
    { key: 'nav_policy_dropdown_title', bn: 'গুরুত্বপূর্ণ পলিসি ও নিয়মাবলী', en: 'Important Policies & Info', category: 'header_navigation', subCategory: 'nav_links', description: 'Policy dropdown menu title' },
    { key: 'nav_track', bn: 'অর্ডার ট্র্যাক', en: 'Track Order', category: 'header_navigation', subCategory: 'nav_links', description: 'Track order navigation link' },
    { key: 'nav_track_order', bn: 'অর্ডার ট্র্যাক', en: 'Track Order', category: 'header_navigation', subCategory: 'nav_links', description: 'Track order navigation link (alias)' },
    { key: 'nav_cart', bn: 'কার্ট', en: 'Cart', category: 'header_navigation', subCategory: 'nav_links', description: 'Cart button label' },
    { key: 'header_order_cta', bn: 'অর্ডার করুন', en: 'Order Now', category: 'header_navigation', subCategory: 'nav_links', description: 'Header prominent order CTA button' },
    { key: 'mobile_menu_helpline', bn: 'হেল্পলাইন', en: 'Helpline', category: 'header_navigation', subCategory: 'nav_links', description: 'Mobile drawer helpline label' },
    { key: 'header_search_label', bn: 'পণ্য অনুসন্ধান', en: 'Search Products', category: 'header_navigation', subCategory: 'header_search', description: 'Header search label' },
    { key: 'header_search_placeholder', bn: 'পণ্য খুঁজুন...', en: 'Search products...', category: 'header_navigation', subCategory: 'header_search', description: 'Header search input placeholder' },
    { key: 'nav_search_placeholder', bn: 'পণ্য খুঁজুন...', en: 'Search products...', category: 'header_navigation', subCategory: 'header_search', description: 'Header search input placeholder (alias)' },
    { key: 'header_search_submit', bn: 'খুঁজুন', en: 'Search', category: 'header_navigation', subCategory: 'header_search', description: 'Header search submit button' },
    { key: 'nav_lang_toggle', bn: 'বাংলা/EN', en: 'EN/বাংলা', category: 'header_navigation', subCategory: 'brand_header', description: 'Header language switch button' },
    { key: 'home_banner_label', bn: 'প্রধান ব্যানার', en: 'Main Banner', category: 'home_page', subCategory: 'hero_intro', description: 'Hero banner accessibility label' },
    { key: 'home_banner_alt', bn: 'স্টোরফোর্জ — প্রিমিয়াম পণ্যসম্ভার', en: 'StoreForge — Premium Collection', category: 'home_page', subCategory: 'hero_intro', description: 'Hero banner image alt text' },
    { key: 'home_intro_label', bn: 'পরিচিতি ও বৈশিষ্ট্য', en: 'Intro & Features', category: 'home_page', subCategory: 'hero_intro', description: 'Intro section accessibility label' },
    { key: 'home_intro_badge', bn: 'হস্তনির্মিত প্রিমিয়াম উডেন আর্ট', en: 'Handcrafted Premium Wooden Art', category: 'home_page', subCategory: 'hero_intro', description: 'Hero intro highlight badge' },
    { key: 'home_headline', bn: 'কাঠের স্পর্শে সাজিয়ে তুলুন আপনার পৃথিবী', en: 'Shape Your World with the Warmth of Natural Wood', category: 'home_page', subCategory: 'hero_intro', description: 'Homepage main title headline' },
    { key: 'home_intro_message', bn: 'আমাদের প্রতিটি কাঠের মানচিত্র নিখুঁত লেজার কাটিং এবং অভিজ্ঞ কারিগরের হাতের ছোঁয়ায় তৈরি। আপনার বসার ঘর, অফিস বা প্রিয়জনের উপহারে যোগ করুন আভিজাত্য।', en: 'Every wooden map is crafted with laser precision and artisan warmth to elevate your living room, office, or gift.', category: 'home_page', subCategory: 'hero_intro', description: 'Hero introductory description' },
    { key: 'home_feat_1', bn: '১০০% প্রাকৃতিক বার্চ কাঠ', en: '100% Natural Birch Wood', category: 'home_page', subCategory: 'hero_intro', description: 'Hero feature badge 1' },
    { key: 'home_feat_2', bn: 'মাল্টি-লেয়ার ৩ডি গভীরতা', en: 'Multi-Layer 3D Depth', category: 'home_page', subCategory: 'hero_intro', description: 'Hero feature badge 2' },
    { key: 'home_feat_3', bn: 'নিখুঁত হ্যান্ডক্রাফটেড ফিনিশিং', en: 'Laser-Cut Precision Finish', category: 'home_page', subCategory: 'hero_intro', description: 'Hero feature badge 3' },
    { key: 'home_order_now_cta', bn: 'এখনই পছন্দ করুন', en: 'Choose Your Map Now', category: 'home_page', subCategory: 'hero_intro', description: 'Hero call to action button' },
    { key: 'home_order_call_btn', bn: 'ফোনে অর্ডার করুন', en: 'Order by Phone', category: 'home_page', subCategory: 'hero_intro', description: 'Direct phone order button' },
    { key: 'home_categories_title', bn: 'ক্যাটাগরি', en: 'Categories', category: 'home_page', subCategory: 'home_sections', description: 'Categories section title' },
    { key: 'home_categories_sub', bn: 'আপনার পছন্দের সংগ্রহ খুঁজে নিন', en: 'Explore our curated collections', category: 'home_page', subCategory: 'home_sections', description: 'Categories section subtitle' },
    { key: 'home_category_items', bn: 'টি পণ্য', en: 'Items', category: 'home_page', subCategory: 'home_sections', description: 'Items count suffix' },
    { key: 'home_featured_title', bn: 'ওয়ার্ল্ড ম্যাপ', en: '3D World Map', category: 'home_page', subCategory: 'home_sections', description: 'Featured section title' },
    { key: 'home_featured_view_details', bn: 'সম্পূর্ণ বিস্তারিত দেখুন', en: 'View Full Details', category: 'home_page', subCategory: 'home_sections', description: 'Featured item view button' },
    { key: 'home_featured_buy_now', bn: 'সরাসরি অর্ডার করুন', en: 'Order Directly', category: 'home_page', subCategory: 'home_sections', description: 'Featured item quick buy button' },
    { key: 'home_best_sellers_title', bn: 'সর্বাধিক বিক্রিত পণ্য', en: 'Best Sellers', category: 'home_page', subCategory: 'home_sections', description: 'Best sellers section heading' },
    { key: 'home_best_sellers_sub', bn: 'ক্রেতাদের সবচেয়ে প্রিয় সংগ্রহ', en: 'Our most loved handcrafted collections', category: 'home_page', subCategory: 'home_sections', description: 'Best sellers subtitle' },
    { key: 'home_order_guide_title', bn: 'কিভাবে অর্ডার করবেন?', en: 'How to Place an Order', category: 'home_page', subCategory: 'order_guide', description: 'Order guide section title' },
    { key: 'home_order_guide_badge', bn: 'সহজ ও নিরাপদ কেনাকাটা', en: 'Easy & Secure Shopping', category: 'home_page', subCategory: 'order_guide', description: 'Order guide section badge' },
    { key: 'home_order_guide_sub', bn: 'মাত্র ৪টি সহজ ধাপে ঘরে বসেই বুঝে নিন আপনার পছন্দের উডেন ম্যাপ', en: 'Receive your handcrafted wooden map in 4 easy steps at your doorstep', category: 'home_page', subCategory: 'order_guide', description: 'Order guide subtitle' },
    { key: 'guide_step_1_title', bn: 'পণ্য ও সাইজ পছন্দ করুন', en: 'Select Product & Size', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 1 title' },
    { key: 'guide_step_1_desc', bn: 'আপনার ঘরের দেওয়ালের পরিমাপ অনুযায়ী ৪ ফুট, ৫ ফুট, ৬ ফুট বা ৮ ফুট সাইজ সিলেক্ট করুন।', en: 'Choose 4ft, 5ft, 6ft or 8ft size tailored to your wall space.', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 1 description' },
    { key: 'guide_step_2_title', bn: 'নাম ও ঠিকানা প্রদান করুন', en: 'Provide Delivery Address', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 2 title' },
    { key: 'guide_step_2_desc', bn: 'সঠিক নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখে অর্ডার কনফার্ম করুন।', en: 'Enter your full name, phone number, and delivery address.', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 2 description' },
    { key: 'guide_step_3_title', bn: 'পেমেন্ট পদ্ধতি বেছে নিন', en: 'Choose Payment Method', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 3 title' },
    { key: 'guide_step_3_desc', bn: 'ক্যাশ অন ডেলিভারিতে পণ্য পাওয়ার পর মূল্য পরিশোধ করতে পারবেন অথবা অনলাইনে পেমেন্ট করুন।', en: 'Pay safely on delivery (Cash on Delivery) or via bKash / Cards.', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 3 description' },
    { key: 'guide_step_4_title', bn: 'দ্রুত হোম ডেলিভারি বুঝে নিন', en: 'Fast Home Delivery', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 4 title' },
    { key: 'guide_step_4_desc', bn: '২৪ থেকে ৪৮ ঘণ্টার মধ্যে ঢাকা এবং ২-৪ দিনে সারাদেশে হোম ডেলিভারি পৌঁছে দেওয়া হবে।', en: 'Delivered safely to your doorstep within 24-48 hours in Dhaka, 2-4 days nationwide.', category: 'home_page', subCategory: 'order_guide', description: 'Order guide step 4 description' },
    { key: 'home_reviews_title', bn: 'আমাদের সম্মানিত গ্রাহকদের মতামত', en: 'Customer Testimonials', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Reviews section title' },
    { key: 'home_reviews_rating_badge', bn: '৪.৯ / ৫.০ স্টার রেটিং', en: '4.9 / 5.0 Star Rating', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Rating banner badge' },
    { key: 'home_reviews_sub', bn: 'সারা দেশের শত শত পরিবারের ভালোবাসায় সাজানো অভিজ্ঞতা', en: 'Loved by hundreds of homes across Bangladesh', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Reviews section subtitle' },
    { key: 'home_faq_title', bn: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী', en: 'Frequently Asked Questions (FAQ)', category: 'home_page', subCategory: 'home_reviews_faq', description: 'FAQ section title' },
    { key: 'home_faq_badge', bn: 'প্রশ্ন ও উত্তর', en: 'Questions & Answers', category: 'home_page', subCategory: 'home_reviews_faq', description: 'FAQ section badge' },
    { key: 'home_faq_sub', bn: 'আপনার মনে আসা যেকোনো প্রশ্নের উত্তর সহজে খুঁজে নিন', en: 'Find answers to common questions about our wooden maps & delivery', category: 'home_page', subCategory: 'home_reviews_faq', description: 'FAQ section subtitle' },
    { key: 'home_why_title', bn: 'কেন আমাদের পছন্দ করবেন!', en: 'Why Choose Us?', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Why Choose Us section title' },
    { key: 'home_why_sub', bn: 'আপনার মনে আসা প্রশ্নগুলোর উত্তর', en: 'Answers to your most frequent questions', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Why section subtitle' },
    { key: 'faq_more_questions', bn: 'আরো কোনো প্রশ্ন আছে?', en: 'Have more questions?', category: 'home_page', subCategory: 'home_reviews_faq', description: 'FAQ footer question' },
    { key: 'faq_more_questions_sub', bn: 'আমাদের কাস্টমার কেয়ারে কল করুন অথবা হোয়াটসঅ্যাপে মেসেজ দিন', en: 'Call our customer care or message us on WhatsApp anytime', category: 'home_page', subCategory: 'home_reviews_faq', description: 'FAQ footer contact subtitle' },
    { key: 'trust_real_reviews', bn: '১০০% আসল ও ভেরিফাইড রিভিউ', en: '100% Genuine Verified Reviews', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Trust badge 1 title' },
    { key: 'trust_real_reviews_sub', bn: 'কেবলমাত্র প্রকৃত ক্রেতাদের অভিজ্ঞতা', en: 'Direct feedback from verified map owners', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Trust badge 1 subtitle' },
    { key: 'trust_cod_inspect', bn: 'পণ্য দেখে মূল্য পরিশোধ', en: 'Inspect Before Payment', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Trust badge 2 title' },
    { key: 'trust_cod_inspect_sub', bn: '১০০% ক্যাশ অন ডেলিভারি সুরক্ষা', en: '100% Cash on Delivery protection', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Trust badge 2 subtitle' },
    { key: 'trust_replacement', bn: '৭ দিনের ফ্রি রিপ্লেসমেন্ট', en: '7-Day Free Replacement', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Trust badge 3 title' },
    { key: 'trust_replacement_sub', bn: 'ডেলিভারিতে ক্ষতি হলে তাৎক্ষণিক সমাধান', en: 'Instant replacement if damaged in transit', category: 'home_page', subCategory: 'home_reviews_faq', description: 'Trust badge 3 subtitle' },
    { key: 'all_products_heading', bn: 'সকল কাঠের পণ্য', en: 'All Handcrafted Wooden Products', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Catalog main heading' },
    { key: 'catalog_details', bn: 'বিস্তারিত দেখুন', en: 'View Details', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Product card details link' },
    { key: 'view_details', bn: 'বিস্তারিত', en: 'View Details', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Product card detail button' },
    { key: 'catalog_add_cart', bn: 'কার্টে যোগ করুন', en: 'Add to Cart', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Catalog add to cart button' },
    { key: 'product_out_of_stock', bn: 'স্টক শেষ', en: 'Out of Stock', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Product out of stock badge' },
    { key: 'product_in_stock', bn: 'স্টকে আছে', en: 'In Stock', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Product in stock badge' },
    { key: 'product_in_stock_ready', bn: 'স্টকে প্রস্তুত', en: 'Ready in Stock', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Ready in stock badge' },
    { key: 'product_save_badge', bn: 'ছাড়', en: 'SAVE', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Discount badge prefix' },
    { key: 'catalog_price_unavailable', bn: 'মূল্য অনুপলব্ধ', en: 'Price Unavailable', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Price fallback label' },
    { key: 'exclusive_badge', bn: 'এক্সক্লুসিভ', en: 'Exclusive', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Exclusive product badge' },
    { key: 'signature_piece', bn: 'সিগনেচার আর্টওয়ার্ক', en: 'Signature Piece', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Signature piece badge' },
    { key: 'explore', bn: 'অনুসন্ধান করুন', en: 'Explore', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Explore button label' },
    { key: 'prev_page', bn: 'পূর্ববর্তী', en: 'Previous', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Pagination previous page button' },
    { key: 'next_page', bn: 'পরবর্তী', en: 'Next', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Pagination next page button' },
    { key: 'search_results_count', bn: 'টি পণ্য পাওয়া গেছে', en: 'products found', category: 'product_catalog', subCategory: 'catalog_grid', description: 'Found products count text' },
    { key: 'search_no_results', bn: 'কোনো পণ্য পাওয়া যায়নি', en: 'No products found', category: 'product_catalog', subCategory: 'catalog_grid', description: 'No products found message' },
    { key: 'filter_price_title', bn: 'মূল্য পরিসীমা', en: 'Price Range', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Price filter title' },
    { key: 'all_prices', bn: 'সকল মূল্য', en: 'All Prices', category: 'product_catalog', subCategory: 'filters_sorting', description: 'All prices filter option' },
    { key: 'price_under_2000', bn: '২,০০০ টাকার নিচে', en: 'Under ৳ 2,000', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Price filter under 2k' },
    { key: 'price_2000_5000', bn: '২,০০০ - ৫,০০০ টাকা', en: '৳ 2,000 - ৳ 5,000', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Price filter 2k-5k' },
    { key: 'price_5000_15000', bn: '৫,০০০ - ১৫,০০০ টাকা', en: '৳ 5,000 - ৳ 15,000', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Price filter 5k-15k' },
    { key: 'price_above_15000', bn: '১৫,০০০ টাকার উপরে', en: 'Above ৳ 15,000', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Price filter above 15k' },
    { key: 'filter_sort_title', bn: 'ক্রমানুসার', en: 'Sort By', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort filter title' },
    { key: 'sort_popular', bn: 'জনপ্রিয়তা অনুযায়ী', en: 'Most Popular', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort popular option' },
    { key: 'sort_best_selling', bn: 'সর্বাধিক বিক্রিত', en: 'Best Selling', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort best selling' },
    { key: 'sort_trending', bn: 'ট্রেন্ডিং', en: 'Trending', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort trending' },
    { key: 'sort_newest', bn: 'নতুন সংযোজন', en: 'Newest Arrivals', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort newest' },
    { key: 'sort_top_rated', bn: 'শীর্ষ রেটিং প্রাপ্ত', en: 'Top Rated', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort top rated' },
    { key: 'sort_price_asc', bn: 'মূল্য: কম থেকে বেশি', en: 'Price: Low to High', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort price low to high' },
    { key: 'sort_price_desc', bn: 'মূল্য: বেশি থেকে কম', en: 'Price: High to Low', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Sort price high to low' },
    { key: 'reset_filters', bn: 'ফিল্টার রিসেট', en: 'Reset Filters', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Reset filters button' },
    { key: 'search_reset', bn: 'রিসেট করুন', en: 'Reset', category: 'product_catalog', subCategory: 'filters_sorting', description: 'Search reset button' },
    { key: 'product_tax_note', bn: 'ভ্যাট সহ অন্তর্ভুক্ত', en: 'VAT Included', category: 'product_details', subCategory: 'details_main', description: 'Price tax inclusion note' },
    { key: 'product_select_size_label', bn: 'সাইজ নির্বাচন করুন:', en: 'Select Size:', category: 'product_details', subCategory: 'details_main', description: 'Size selector label' },
    { key: 'product_select_size', bn: 'সাইজ নির্বাচন করুন:', en: 'Select Size:', category: 'product_details', subCategory: 'details_main', description: 'Size selector label (alias)' },
    { key: 'product_select_color_label', bn: 'কাঠের ফিনিশ / কালার বেছে নিন:', en: 'Choose Wood Finish Tone:', category: 'product_details', subCategory: 'details_main', description: 'Color finish selector label' },
    { key: 'product_select_color', bn: 'কাঠের ফিনিশ / কালার বেছে নিন:', en: 'Choose Wood Finish Tone:', category: 'product_details', subCategory: 'details_main', description: 'Color selector label (alias)' },
    { key: 'order_label_quantity', bn: 'পরিমাণ:', en: 'Quantity:', category: 'product_details', subCategory: 'details_main', description: 'Quantity selector label' },
    { key: 'product_quantity', bn: 'পরিমাণ:', en: 'Quantity:', category: 'product_details', subCategory: 'details_main', description: 'Quantity label (alias)' },
    { key: 'hero_cta_order', bn: 'সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)', en: 'Order Now (Cash on Delivery)', category: 'product_details', subCategory: 'details_main', description: 'Product page primary CTA button' },
    { key: 'product_order_now', bn: 'অর্ডার করুন — ক্যাশ অন ডেলিভারি', en: 'Order Now — Cash on Delivery', category: 'product_details', subCategory: 'details_main', description: 'Order CTA button (alias)' },
    { key: 'product_add_to_cart', bn: 'কার্টে যোগ করুন', en: 'Add to Cart', category: 'product_details', subCategory: 'details_main', description: 'Product add to cart button' },
    { key: 'cart_added_toast', bn: 'পণ্যটি কার্টে সফলভাবে যোগ করা হয়েছে!', en: 'Product added to cart successfully!', category: 'product_details', subCategory: 'details_main', description: 'Added to cart notification toast' },
    { key: 'details_related_title', bn: 'সম্পর্কিত অন্যান্য পণ্য', en: 'Related Products', category: 'product_details', subCategory: 'details_main', description: 'Related products section title' },
    { key: 'product_btn_details', bn: 'বিস্তারিত দেখুন', en: 'View Details', category: 'product_details', subCategory: 'details_main', description: 'View product details button' },
    { key: 'product_not_found', bn: 'পণ্যটি খুঁজে পাওয়া যায়নি!', en: 'Product not found!', category: 'product_details', subCategory: 'details_main', description: 'Product 404 message' },
    { key: 'home_browse', bn: 'হোমে ফিরে যান', en: 'Back to Home', category: 'product_details', subCategory: 'details_main', description: 'Back to home link' },
    { key: 'home_search_link', bn: 'পণ্য খুঁজুন', en: 'Search Products', category: 'product_details', subCategory: 'details_main', description: 'Search products link' },
    { key: 'popular_links', bn: 'জনপ্রিয় পণ্যসমূহ', en: 'Popular Products', category: 'product_details', subCategory: 'details_main', description: 'Popular links label' },
    { key: 'search_catalog', bn: 'ক্যাটালগে খুঁজুন', en: 'Search Catalog', category: 'product_details', subCategory: 'details_main', description: 'Search catalog link' },
    { key: 'not_found_title', bn: 'পৃষ্ঠাটি পাওয়া যায়নি', en: 'Page Not Found', category: 'product_details', subCategory: 'details_main', description: 'Not found page title' },
    { key: 'not_found_desc', bn: 'আপনি যে লিঙ্কটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ভুল ইউআরএল দিয়েছেন।', en: 'The page you are looking for may have been moved or does not exist.', category: 'product_details', subCategory: 'details_main', description: 'Not found page description' },
    { key: 'guarantee_delivery_title', bn: 'দ্রুততম হোম ডেলিভারি', en: 'Fast Home Delivery', category: 'product_details', subCategory: 'guarantee_badges', description: 'Delivery guarantee title' },
    { key: 'guarantee_delivery_desc', bn: 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, সারাদেশে ২-৪ দিনে ডেলিভারি', en: '24-48 hrs in Dhaka, 2-4 days nationwide', category: 'product_details', subCategory: 'guarantee_badges', description: 'Delivery guarantee description' },
    { key: 'guarantee_cod_title', bn: 'ক্যাশ অন ডেলিভারি', en: 'Cash on Delivery', category: 'product_details', subCategory: 'guarantee_badges', description: 'COD guarantee title' },
    { key: 'guarantee_cod_desc', bn: 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধের সুবিধা', en: 'Inspect the product before paying at your doorstep', category: 'product_details', subCategory: 'guarantee_badges', description: 'COD guarantee description' },
    { key: 'guarantee_quality_title', bn: '১০০% আসল কাঠের গ্যারান্টি', en: '100% Genuine Birch Wood', category: 'product_details', subCategory: 'guarantee_badges', description: 'Wood quality guarantee title' },
    { key: 'guarantee_quality_desc', bn: 'প্রাকৃতিক বার্চ প্লাইউড ও প্রিমিয়াম ফিনিশিং', en: 'High-density natural birch plywood with laser precision', category: 'product_details', subCategory: 'guarantee_badges', description: 'Wood quality guarantee description' },
    { key: 'guarantee_replacement_title', bn: '৭ দিনের রিপ্লেসমেন্ট', en: '7-Day Free Replacement', category: 'product_details', subCategory: 'guarantee_badges', description: 'Replacement guarantee title' },
    { key: 'guarantee_replacement_desc', bn: 'ডেলিভারিতে ক্ষতিগ্রস্ত হলে তাৎক্ষণিক ফ্রি পরিবর্তন', en: 'Hassle-free instant replacement if damaged in transit', category: 'product_details', subCategory: 'guarantee_badges', description: 'Replacement guarantee description' },
    { key: 'product_delivery_guarantee', bn: '২৪-৪৮ ঘণ্টায় ঢাকা এবং ২-৪ দিনে সারাদেশে হোম ডেলিভারি', en: '24-48h in Dhaka & 2-4 days nationwide home delivery', category: 'product_details', subCategory: 'guarantee_badges', description: 'Fast delivery guarantee text (alias)' },
    { key: 'feat_tag_birch', bn: 'প্রাকৃতিক বার্চ প্লাইউড', en: 'Natural Birch Plywood', category: 'product_details', subCategory: 'guarantee_badges', description: 'Birch wood tag' },
    { key: 'feat_tag_layers', bn: '৩টি লেয়ার রিলিফ', en: '3-Layer Relief Topography', category: 'product_details', subCategory: 'guarantee_badges', description: '3D layer tag' },
    { key: 'feat_tag_cod', bn: 'সারাদেশে ক্যাশ অন ডেলিভারি', en: 'Nationwide Cash on Delivery', category: 'product_details', subCategory: 'guarantee_badges', description: 'COD tag' },
    { key: 'tab_description', bn: 'বিবরণ', en: 'Description', category: 'product_details', subCategory: 'details_tabs', description: 'Product description tab' },
    { key: 'product_description_tab', bn: 'বিস্তারিত বিবরণ', en: 'Full Description', category: 'product_details', subCategory: 'details_tabs', description: 'Product description tab (alias)' },
    { key: 'tab_specifications', bn: 'স্পেসিফিকেশন ও সাইজ চার্ট', en: 'Specifications & Dimensions', category: 'product_details', subCategory: 'details_tabs', description: 'Product specifications tab' },
    { key: 'product_features_tab', bn: 'মূল বৈশিষ্ট্যসমূহ', en: 'Key Features', category: 'product_details', subCategory: 'details_tabs', description: 'Product features tab (alias)' },
    { key: 'tab_reviews', bn: 'ক্রেতাদের রিভিউ', en: 'Customer Reviews', category: 'product_details', subCategory: 'details_tabs', description: 'Product reviews tab' },
    { key: 'product_reviews_tab', bn: 'গ্রাহকদের রিভিউ', en: 'Customer Reviews', category: 'product_details', subCategory: 'details_tabs', description: 'Product reviews tab (alias)' },
    { key: 'tab_shipping', bn: 'ডেলিভারি ও ইনস্টলেশন গাইড', en: 'Delivery & Installation Guide', category: 'product_details', subCategory: 'details_tabs', description: 'Product shipping tab' },
    { key: 'spec_size', bn: 'সাইজ / ডাইমেনশন', en: 'Size / Dimensions', category: 'product_details', subCategory: 'details_tabs', description: 'Spec table size label' },
    { key: 'spec_dimensions', bn: 'পরিমাপ (ইঞ্চি / ফুট)', en: 'Dimensions (Inches / Feet)', category: 'product_details', subCategory: 'details_tabs', description: 'Spec table dimensions label' },
    { key: 'spec_finish', bn: 'কাঠের উপাদান ও ফিনিশ', en: 'Material & Finish', category: 'product_details', subCategory: 'details_tabs', description: 'Spec table material label' },
    { key: 'spec_price', bn: 'মূল্য (টাকা)', en: 'Price (BDT)', category: 'product_details', subCategory: 'details_tabs', description: 'Spec table price label' },
    { key: 'spec_status', bn: 'স্টক স্ট্যাটাস', en: 'Stock Status', category: 'product_details', subCategory: 'details_tabs', description: 'Spec table status label' },
    { key: 'shipping_tab_delivery_title', bn: 'সারা দেশে ক্যাশ অন ডেলিভারি', en: 'Nationwide Cash on Delivery', category: 'product_details', subCategory: 'details_tabs', description: 'Shipping tab item 1 title' },
    { key: 'shipping_tab_delivery_desc', bn: 'ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৪ কার্যদিবসের মধ্যে আপনার দোরগোড়ায় পণ্য পৌঁছে দেওয়া হয়।', en: 'Within Dhaka in 24-48 hours and nationwide within 2-4 business days directly to your doorstep.', category: 'product_details', subCategory: 'details_tabs', description: 'Shipping tab item 1 description' },
    { key: 'shipping_tab_pkg_title', bn: 'নিরাপদ প্যাকেজিং ও সহজ ইনস্টলেশন', en: 'Safe Packaging & Easy Installation', category: 'product_details', subCategory: 'details_tabs', description: 'Shipping tab item 2 title' },
    { key: 'shipping_tab_pkg_desc', bn: 'প্রতিটি পার্সেলের সাথে বিশেষ ডাবল-সাইডেড মাউন্টিং স্টিকার ও গাইড টেমপ্লেট থাকে। কোনো প্রকার ড্রিলিং ছাড়াই দেয়ালে সহজে স্থাপন করা যায়।', en: 'Includes double-sided mounting tape and alignment guide template for effortless wall installation without drilling.', category: 'product_details', subCategory: 'details_tabs', description: 'Shipping tab item 2 description' },
    { key: 'shipping_tab_care_title', bn: 'যত্ন ও রক্ষণাবেক্ষণ নির্দেশিকা', en: 'Care & Maintenance Guide', category: 'product_details', subCategory: 'details_tabs', description: 'Shipping tab item 3 title' },
    { key: 'shipping_tab_care_desc', bn: 'শুকনো নরম সুতি কাপড় অথবা ফেদার ডাস্টার দিয়ে পরিষ্কার করুন। সরাসরি পানির সংস্পর্শ বা স্যাঁতসেঁতে পরিবেশ এড়িয়ে চলুন।', en: 'Clean with a dry microfiber cloth or feather duster. Avoid direct water exposure or damp environments.', category: 'product_details', subCategory: 'details_tabs', description: 'Shipping tab item 3 description' },
    { key: 'heading_write_review', bn: 'আপনার অভিজ্ঞতা শেয়ার করুন', en: 'Write a Customer Review', category: 'product_details', subCategory: 'product_reviews', description: 'Review form heading' },
    { key: 'review_verified_buyer', bn: 'ভেরিফাইড ক্রেতা', en: 'Verified Buyer', category: 'product_details', subCategory: 'product_reviews', description: 'Verified buyer badge' },
    { key: 'review_no_reviews_desc', bn: 'এই পণ্যে এখনও কোনো রিভিউ জমা পড়েনি। প্রথম রিভিউটি আপনিই দিন!', en: 'No reviews yet for this product. Be the first to share your experience!', category: 'product_details', subCategory: 'product_reviews', description: 'No reviews placeholder description' },
    { key: 'review_placeholder_name', bn: 'আপনার নাম লিখুন', en: 'Your full name', category: 'product_details', subCategory: 'product_reviews', description: 'Review name input placeholder' },
    { key: 'review_label_ordernum', bn: 'অর্ডার নাম্বার (ঐচ্ছিক)', en: 'Order Number (Optional)', category: 'product_details', subCategory: 'product_reviews', description: 'Review order number label' },
    { key: 'review_placeholder_ordernum', bn: 'যেমন: WM-1001', en: 'e.g. WM-1001', category: 'product_details', subCategory: 'product_reviews', description: 'Review order number placeholder' },
    { key: 'review_hint_order', bn: 'অর্ডার নম্বর দিলে রিভিউতে "ভেরিফাইড ক্রেতা" ব্যাজ প্রদর্শিত হবে', en: 'Providing your order number adds a Verified Buyer badge', category: 'product_details', subCategory: 'product_reviews', description: 'Review order hint' },
    { key: 'review_placeholder_phone', bn: 'মোবাইল নম্বর (ঐচ্ছিক)', en: 'Mobile Number (Optional)', category: 'product_details', subCategory: 'product_reviews', description: 'Review phone placeholder' },
    { key: 'review_hint_phone', bn: 'আপনার নম্বরটি সুরক্ষিত ও সম্পূর্ণ গোপন থাকবে', en: 'Your phone number remains strictly private and confidential', category: 'product_details', subCategory: 'product_reviews', description: 'Review phone hint' },
    { key: 'track_rating_label', bn: 'আপনার রেটিং নির্বাচন করুন', en: 'Select Your Rating', category: 'product_details', subCategory: 'product_reviews', description: 'Review rating label' },
    { key: 'track_review_text_label', bn: 'আপনার মতামত লিখুন', en: 'Write Your Review', category: 'product_details', subCategory: 'product_reviews', description: 'Review text label' },
    { key: 'track_review_text_placeholder', bn: 'পণ্যটির গুণগত মান, ফিনিশিং এবং ডেলিভারি নিয়ে আপনার বাস্তব অভিজ্ঞতা লিখুন...', en: 'Share your honest feedback about product quality, craftsmanship, and packaging...', category: 'product_details', subCategory: 'product_reviews', description: 'Review textarea placeholder' },
    { key: 'track_btn_submitting', bn: 'সাবমিট হচ্ছে...', en: 'Submitting...', category: 'product_details', subCategory: 'product_reviews', description: 'Review submitting state button' },
    { key: 'track_btn_submit_review', bn: 'রিভিউ সাবমিট করুন', en: 'Submit Review', category: 'product_details', subCategory: 'product_reviews', description: 'Review submit button' },
    { key: 'review_success_submitted', bn: 'ধন্যবাদ! আপনার রিভিউ সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর এটি প্রকাশিত হবে।', en: 'Thank you! Your review has been submitted for moderation.', category: 'product_details', subCategory: 'product_reviews', description: 'Review submitted toast success' },
    { key: 'review_err_generic', bn: 'রিভিউ জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', en: 'Failed to submit review. Please try again.', category: 'product_details', subCategory: 'product_reviews', description: 'Review submission error' },
    { key: 'review_err_name_required', bn: 'অনুগ্রহ করে আপনার নাম লিখুন।', en: 'Please provide your name.', category: 'product_details', subCategory: 'product_reviews', description: 'Review validation name required' },
    { key: 'review_err_text_required', bn: 'অনুগ্রহ করে আপনার রিভিউ মন্তব্য লিখুন।', en: 'Please provide your review comments.', category: 'product_details', subCategory: 'product_reviews', description: 'Review validation text required' },
    { key: 'rating_text_5', bn: '৫ স্টার - অসাধারণ ও নিখুঁত', en: '5 Stars - Outstanding & Perfect', category: 'product_details', subCategory: 'product_reviews', description: '5 Star rating description' },
    { key: 'rating_text_4', bn: '৪ স্টার - খুবই ভালো', en: '4 Stars - Very Good', category: 'product_details', subCategory: 'product_reviews', description: '4 Star rating description' },
    { key: 'rating_text_3', bn: '৩ স্টার - সন্তোষজনক', en: '3 Stars - Satisfactory', category: 'product_details', subCategory: 'product_reviews', description: '3 Star rating description' },
    { key: 'rating_text_2', bn: '২ স্টার - প্রত্যাশার চেয়ে কম', en: '2 Stars - Below Expectations', category: 'product_details', subCategory: 'product_reviews', description: '2 Star rating description' },
    { key: 'rating_text_1', bn: '১ স্টার - সন্তুষ্ট নই', en: '1 Star - Disappointed', category: 'product_details', subCategory: 'product_reviews', description: '1 Star rating description' },
    { key: 'cart_eyebrow', bn: 'শপিং ব্যাগ', en: 'Shopping Bag', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Cart drawer top eyebrow label' },
    { key: 'cart_title', bn: 'আপনার কার্ট', en: 'Your Cart', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Cart drawer title' },
    { key: 'cart_items_suffix', bn: 'টি পণ্য', en: 'Items', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Cart items count suffix' },
    { key: 'items_count_label', bn: 'টি আইটেম', en: 'Items', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Items count label' },
    { key: 'cart_empty_title', bn: 'আপনার কার্ট বর্তমানে খালি', en: 'Your Cart is Empty', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Empty cart heading' },
    { key: 'cart_empty_sub', bn: 'পছন্দের উডেন ম্যাপ নির্বাচন করে কার্টে যোগ করুন।', en: 'Browse our wooden collections and add your favorite map.', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Empty cart description' },
    { key: 'cart_empty_body', bn: 'আপনার কার্ট বর্তমানে খালি রয়েছে। কেনাকাটা শুরু করতে পণ্য যোগ করুন।', en: 'Your cart is empty. Start exploring our handcrafted collection!', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Empty cart body text' },
    { key: 'cart_start_shopping', bn: 'কেনাকাটা শুরু করুন', en: 'Start Shopping', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Empty cart CTA button' },
    { key: 'cart_proceed_checkout', bn: 'চেকআউট করুন', en: 'Proceed to Checkout', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Proceed to checkout button' },
    { key: 'continue_shopping', bn: 'আরও কেনাকাটা করুন', en: 'Continue Shopping', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Continue shopping button' },
    { key: 'cart_remove', bn: 'মুছে ফেলুন', en: 'Remove', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Cart item remove button' },
    { key: 'cart_each', bn: 'প্রতি পিস', en: 'each', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Price per unit label' },
    { key: 'cart_calc_at_checkout', bn: 'চেকআউটের সময় ডেলিভারি চার্জ যোগ হবে', en: 'Delivery fee calculated at checkout', category: 'cart_checkout', subCategory: 'cart_drawer_page', description: 'Cart delivery fee note' },
    { key: 'checkout_page_title', bn: 'চেকআউট ও অর্ডার কনফার্মেশন', en: 'Checkout & Order Confirmation', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout page header' },
    { key: 'checkout_breadcrumb', bn: 'চেকআউট', en: 'Checkout', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout breadcrumb text' },
    { key: 'checkout_back_store', bn: 'স্টোরে ফিরে যান', en: 'Return to Store', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout return to store link' },
    { key: 'checkout_badge_secure', bn: '১০০% নিরাপদ ও দ্রুত চেকআউট', en: '100% Secure & Fast Checkout', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout secure highlight badge' },
    { key: 'checkout_title', bn: 'অর্ডারটি সম্পন্ন করুন', en: 'Complete Your Order', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout main heading' },
    { key: 'checkout_subtitle', bn: 'সঠিক তথ্য দিয়ে মাত্র এক মিনিটেই অর্ডার নিশ্চিত করুন।', en: 'Fill in your delivery details in under a minute to confirm your order.', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout subtitle' },
    { key: 'checkout_step_cart', bn: '১. কার্ট রিভিউ', en: '1. Cart Review', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout step 1 indicator' },
    { key: 'checkout_step_info_payment', bn: '২. ঠিকানা ও পেমেন্ট', en: '2. Delivery & Payment', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout step 2 indicator' },
    { key: 'checkout_step_confirm', bn: '৩. কনফার্মেশন', en: '3. Confirmation', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout step 3 indicator' },
    { key: 'checkout_home_delivery_badge', bn: 'সারাদেশে হোম ডেলিভারি', en: 'Nationwide Home Delivery', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout home delivery badge' },
    { key: 'checkout_secure_badge', bn: 'নিরাপদ চেকআউট', en: '100% Secure Checkout', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout secure badge' },
    { key: 'checkout_instant_confirm', bn: 'তাৎক্ষণিক অর্ডার নিশ্চিতকরণ', en: 'Instant Order Confirmation', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Instant confirm badge' },
    { key: 'checkout_encryption_note', bn: 'আপনার সকল তথ্য ২৫৬-বিট এসএসএল (SSL) এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত।', en: 'Your personal information is encrypted with 256-bit SSL security.', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout encryption security note' },
    { key: 'checkout_cod_applicable', bn: 'ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম চার্জ ছাড়াই নিশ্চিন্তে অর্ডার করতে পারেন।', en: 'Cash on Delivery requires no advance payment.', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout COD guarantee note' },
    { key: 'checkout_helpline_text', bn: 'অর্ডারে সহায়তা প্রয়োজন? সরাসরি কল করুন:', en: 'Need assistance with your order? Call directly:', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Checkout helpline label' },
    { key: 'form_required_error', bn: 'অনুগ্রহ করে সকল প্রয়োজনীয় ফিল্ড পূরণ করুন', en: 'Please fill in all required fields', category: 'cart_checkout', subCategory: 'checkout_flow', description: 'Form validation required error' },
    { key: 'order_sec_delivery_info', bn: 'ডেলিভারি তথ্য', en: 'Delivery Information', category: 'cart_checkout', subCategory: 'customer_form', description: 'Checkout delivery section heading' },
    { key: 'checkout_delivery_info_title', bn: 'ডেলিভারির তথ্য', en: 'Delivery Information', category: 'cart_checkout', subCategory: 'customer_form', description: 'Delivery info title (alias)' },
    { key: 'order_label_fullname', bn: 'আপনার পূর্ণ নাম', en: 'Your Full Name', category: 'cart_checkout', subCategory: 'customer_form', description: 'Customer name field label' },
    { key: 'checkout_name_label', bn: 'আপনার পুরো নাম', en: 'Your Full Name', category: 'cart_checkout', subCategory: 'customer_form', description: 'Name field label (alias)' },
    { key: 'order_placeholder_name', bn: 'যেমন: মোঃ আরিফুল ইসলাম', en: 'e.g. Ariful Islam', category: 'cart_checkout', subCategory: 'customer_form', description: 'Customer name placeholder' },
    { key: 'order_label_phone', bn: 'মোবাইল নম্বর (১১ ডিজিট)', en: 'Phone Number (11 Digits)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Phone number field label' },
    { key: 'checkout_phone_label', bn: 'মোবাইল নম্বর (১১ ডিজিট)', en: 'Phone Number (11 Digits)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Phone field label (alias)' },
    { key: 'order_placeholder_phone', bn: '01XXXXXXXXX', en: '01XXXXXXXXX', category: 'cart_checkout', subCategory: 'customer_form', description: 'Phone number placeholder' },
    { key: 'order_phone_digits_hint', bn: '১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন', en: 'Enter valid 11-digit mobile number', category: 'cart_checkout', subCategory: 'customer_form', description: 'Phone number validation hint' },
    { key: 'order_help_phone', bn: 'ডেলিভারি সংক্রান্ত যোগাযোগের জন্য সঠিক নম্বর দিন', en: 'We will call this number for delivery coordination', category: 'cart_checkout', subCategory: 'customer_form', description: 'Phone helper text' },
    { key: 'order_label_location', bn: 'ডেলিভারি এলাকা', en: 'Delivery Area', category: 'cart_checkout', subCategory: 'customer_form', description: 'Delivery area selector label' },
    { key: 'checkout_city_label', bn: 'ডেলিভারি এলাকা', en: 'Delivery Area', category: 'cart_checkout', subCategory: 'customer_form', description: 'City/zone field label (alias)' },
    { key: 'order_opt_dhaka', bn: 'ঢাকা সিটির ভেতরে (৳ ৮০)', en: 'Inside Dhaka City (৳ 80)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Inside Dhaka delivery option' },
    { key: 'checkout_city_dhaka', bn: 'ঢাকার ভেতরে (৳ ৮০)', en: 'Inside Dhaka (৳ 80)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Dhaka delivery option (alias)' },
    { key: 'order_opt_outside', bn: 'ঢাকা সিটির বাইরে (৳ ১৫০)', en: 'Outside Dhaka (৳ 150)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Outside Dhaka delivery option' },
    { key: 'checkout_city_outside', bn: 'ঢাকার বাইরে (৳ ১৫০)', en: 'Outside Dhaka (৳ 150)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Outside Dhaka delivery option (alias)' },
    { key: 'order_delivery_dhaka_eta', bn: '২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি', en: 'Delivered within 24-48 hours', category: 'cart_checkout', subCategory: 'customer_form', description: 'Dhaka delivery ETA note' },
    { key: 'order_delivery_outside_eta', bn: '২-৪ দিনের মধ্যে হোম ডেলিভারি', en: 'Home delivery within 2-4 days', category: 'cart_checkout', subCategory: 'customer_form', description: 'Outside Dhaka delivery ETA note' },
    { key: 'order_label_area', bn: 'থানা / জেলা', en: 'Thana / District', category: 'cart_checkout', subCategory: 'customer_form', description: 'Thana/District input label' },
    { key: 'order_placeholder_area', bn: 'যেমন: মিরপুর, ঢাকা অথবা সদর, সিলেট', en: 'e.g. Mirpur, Dhaka or Sadar, Sylhet', category: 'cart_checkout', subCategory: 'customer_form', description: 'Thana/District placeholder' },
    { key: 'order_label_address', bn: 'সম্পূর্ণ ঠিকানা (বাসা/রোড নম্বর)', en: 'Full Address (House, Road, Block)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Address input label' },
    { key: 'checkout_address_label', bn: 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)', en: 'Full Delivery Address', category: 'cart_checkout', subCategory: 'customer_form', description: 'Address field label (alias)' },
    { key: 'order_placeholder_address', bn: 'বাসা নং, রোড নং, এলাকা বিস্তারিত লিখুন...', en: 'House #, Road #, Sector/Area details...', category: 'cart_checkout', subCategory: 'customer_form', description: 'Address input placeholder' },
    { key: 'order_label_note', bn: 'অর্ডারের বিশেষ নোট (ঐচ্ছিক)', en: 'Special Delivery Notes (Optional)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Order notes input label' },
    { key: 'checkout_notes_label', bn: 'অর্ডারের বিশেষ নোট (ঐচ্ছিক)', en: 'Order Notes (Optional)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Order notes field label (alias)' },
    { key: 'order_placeholder_note', bn: 'ডেলিভারির সময় বা বিশেষ কোনো নির্দেশনা থাকলে লিখুন...', en: 'Any special instructions or preferred delivery time...', category: 'cart_checkout', subCategory: 'customer_form', description: 'Order notes placeholder' },
    { key: 'order_label_email', bn: 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)', en: 'Email Address (Optional)', category: 'cart_checkout', subCategory: 'customer_form', description: 'Email input label' },
    { key: 'order_sec_payment_method', bn: 'পেমেন্ট মেথড নির্বাচন করুন', en: 'Select Payment Method', category: 'cart_checkout', subCategory: 'payment_methods', description: 'Payment method section heading' },
    { key: 'checkout_payment_title', bn: 'পেমেন্ট মেথড বেছে নিন', en: 'Select Payment Method', category: 'cart_checkout', subCategory: 'payment_methods', description: 'Payment options section title (alias)' },
    { key: 'order_payment_cod', bn: 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)', en: 'Cash on Delivery (Pay upon delivery)', category: 'cart_checkout', subCategory: 'payment_methods', description: 'COD payment title' },
    { key: 'checkout_payment_cod', bn: 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)', en: 'Cash on Delivery (Pay upon delivery)', category: 'cart_checkout', subCategory: 'payment_methods', description: 'COD payment option (alias)' },
    { key: 'order_cod_desc', bn: 'পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানের কাছে সম্পূর্ণ টাকা পরিশোধ করুন। ১০০% নিরাপদ।', en: 'Pay in cash after inspecting your parcel upon delivery. 100% risk-free.', category: 'cart_checkout', subCategory: 'payment_methods', description: 'COD payment description' },
    { key: 'order_payment_bkash', bn: 'বিকাশ অনলাইন পেমেন্ট (তাৎক্ষণিক)', en: 'bKash Online Payment (Instant)', category: 'cart_checkout', subCategory: 'payment_methods', description: 'bKash payment title' },
    { key: 'checkout_payment_bkash', bn: 'বিকাশ অনলাইন পেমেন্ট (তাৎক্ষণিক)', en: 'bKash Online Payment (Instant)', category: 'cart_checkout', subCategory: 'payment_methods', description: 'bKash payment option (alias)' },
    { key: 'order_bkash_desc', bn: 'বিকাশ পেমেন্ট গেটওয়ের মাধ্যমে নিরাপদে ও তাৎক্ষণিকভাবে পেমেন্ট সম্পন্ন করুন।', en: 'Pay instantly and securely via bKash payment gateway.', category: 'cart_checkout', subCategory: 'payment_methods', description: 'bKash payment description' },
    { key: 'order_payment_method', bn: 'পেমেন্ট পদ্ধতি', en: 'Payment Method', category: 'cart_checkout', subCategory: 'payment_methods', description: 'Payment method label' },
    { key: 'order_summary_title', bn: 'অর্ডার সামারি', en: 'Order Summary', category: 'cart_checkout', subCategory: 'order_summary', description: 'Order summary box title' },
    { key: 'checkout_summary_title', bn: 'অর্ডার সামারি', en: 'Order Summary', category: 'cart_checkout', subCategory: 'order_summary', description: 'Summary card title (alias)' },
    { key: 'order_subtotal', bn: 'সাবটোটাল:', en: 'Subtotal:', category: 'cart_checkout', subCategory: 'order_summary', description: 'Subtotal amount label' },
    { key: 'order_delivery_charge', bn: 'ডেলিভারি চার্জ:', en: 'Delivery Charge:', category: 'cart_checkout', subCategory: 'order_summary', description: 'Delivery charge label' },
    { key: 'order_shipping', bn: 'ডেলিভারি চার্জ:', en: 'Delivery Fee:', category: 'cart_checkout', subCategory: 'order_summary', description: 'Delivery fee label (alias)' },
    { key: 'order_total_payable', bn: 'সর্বমোট প্রদেয়:', en: 'Total Payable:', category: 'cart_checkout', subCategory: 'order_summary', description: 'Total payable label' },
    { key: 'order_total', bn: 'সর্বমোট:', en: 'Total Amount:', category: 'cart_checkout', subCategory: 'order_summary', description: 'Total price label (alias)' },
    { key: 'order_processing', bn: 'অর্ডার প্রসেস হচ্ছে...', en: 'Processing Order...', category: 'cart_checkout', subCategory: 'order_summary', description: 'Order submitting state text' },
    { key: 'order_btn_confirm', bn: 'অর্ডার নিশ্চিত করুন', en: 'Confirm & Place Order', category: 'cart_checkout', subCategory: 'order_summary', description: 'Confirm order CTA button' },
    { key: 'checkout_place_order_btn', bn: 'অর্ডার নিশ্চিত করুন', en: 'Confirm & Place Order', category: 'cart_checkout', subCategory: 'order_summary', description: 'Submit order button (alias)' },
    { key: 'order_trust_1', bn: '১০০% ক্যাশ অন ডেলিভারি সুবিধা', en: '100% Cash on Delivery protection', category: 'cart_checkout', subCategory: 'order_summary', description: 'Order trust bullet 1' },
    { key: 'order_trust_2', bn: 'ডেলিভারির সময় দেখে নেওয়ার সুযোগ', en: 'Inspect parcel upon delivery', category: 'cart_checkout', subCategory: 'order_summary', description: 'Order trust bullet 2' },
    { key: 'order_trust_3', bn: 'ক্ষতিগ্রস্ত হলে তাৎক্ষণিক ফ্রি রিপ্লেসমেন্ট', en: 'Hassle-free instant replacement', category: 'cart_checkout', subCategory: 'order_summary', description: 'Order trust bullet 3' },
    { key: 'order_promo_discount', bn: 'প্রোমো ছাড়:', en: 'Promo Discount:', category: 'cart_checkout', subCategory: 'order_summary', description: 'Promo discount label' },
    { key: 'checkout_promo_placeholder', bn: 'প্রোমো কোড লিখুন', en: 'Enter Promo Code', category: 'cart_checkout', subCategory: 'order_summary', description: 'Promo code input placeholder' },
    { key: 'promo_apply_btn', bn: 'প্রয়োগ করুন', en: 'Apply', category: 'cart_checkout', subCategory: 'order_summary', description: 'Apply promo code button' },
    { key: 'promo_flat_discount', bn: 'ফ্ল্যাট ছাড়', en: 'Flat Discount', category: 'cart_checkout', subCategory: 'order_summary', description: 'Flat discount badge' },
    { key: 'promo_saved_text', bn: 'টাকা সাশ্রয় হয়েছে!', en: 'saved!', category: 'cart_checkout', subCategory: 'order_summary', description: 'Promo savings confirmation' },
    { key: 'confirm_badge', bn: 'অর্ডার সফলভাবে গৃহীত হয়েছে', en: 'Order Successfully Placed', category: 'order_confirmation', subCategory: 'confirmation_header', description: 'Confirmation status badge' },
    { key: 'confirm_title', bn: 'অভিনন্দন! আপনার অর্ডার সম্পন্ন হয়েছে', en: 'Congratulations! Your Order is Confirmed', category: 'order_confirmation', subCategory: 'confirmation_header', description: 'Confirmation heading' },
    { key: 'confirm_subtitle', bn: 'আমাদের টিম আপনার অর্ডারটি প্রস্তুত করছে। শীঘ্রই ডেলিভারি সংক্রান্ত আপডেট দেওয়া হবে।', en: 'Our team is preparing your handcrafted map. We will notify you with delivery updates.', category: 'order_confirmation', subCategory: 'confirmation_header', description: 'Confirmation subtitle' },
    { key: 'confirm_order_id_label', bn: 'অর্ডার নম্বর:', en: 'Order Number:', category: 'order_confirmation', subCategory: 'confirmation_header', description: 'Order ID label' },
    { key: 'confirm_copy_btn', bn: 'কপি করুন', en: 'Copy ID', category: 'order_confirmation', subCategory: 'confirmation_header', description: 'Copy order ID button' },
    { key: 'confirm_copied_btn', bn: 'কপি হয়েছে!', en: 'Copied!', category: 'order_confirmation', subCategory: 'confirmation_header', description: 'Order ID copied state' },
    { key: 'confirm_btn_whatsapp', bn: 'হোয়াটসঅ্যাপে নিশ্চিত করুন', en: 'Confirm via WhatsApp', category: 'order_confirmation', subCategory: 'confirmation_actions', description: 'WhatsApp confirmation button' },
    { key: 'confirm_btn_track', bn: 'অর্ডার ট্র্যাক করুন', en: 'Track Your Order', category: 'order_confirmation', subCategory: 'confirmation_actions', description: 'Track order CTA button' },
    { key: 'confirm_btn_call', bn: 'কাস্টমার কেয়ারে কল করুন', en: 'Call Customer Care', category: 'order_confirmation', subCategory: 'confirmation_actions', description: 'Call care CTA button' },
    { key: 'order_security_notice', bn: 'অর্ডার নিরাপত্তা ও অ্যাক্সেস কোড', en: 'Order Security & Access Code', category: 'order_confirmation', subCategory: 'confirmation_security', description: 'Access code security notice title' },
    { key: 'order_security_desc', bn: 'ভবিষ্যতে আপনার অর্ডার ট্র্যাক বা রিভিউ দেওয়ার জন্য নিচের অ্যাক্সেস কোডটি সংরক্ষণ করুন:', en: 'Save the access code below to track your order and submit verified buyer reviews:', category: 'order_confirmation', subCategory: 'confirmation_security', description: 'Access code security notice description' },
    { key: 'track_access_code_label', bn: 'অর্ডার অ্যাক্সেস কোড:', en: 'Order Access Code:', category: 'order_confirmation', subCategory: 'confirmation_security', description: 'Access code label' },
    { key: 'track_access_code_hint', bn: 'এই কোডটি দিয়ে পরবর্তীতে যেকোনো সময় অর্ডারের লাইভ স্ট্যাটাস দেখতে পারবেন।', en: 'Use this access code anytime to view your live parcel tracking and status updates.', category: 'order_confirmation', subCategory: 'confirmation_security', description: 'Access code hint text' },
    { key: 'confirm_delivery_address', bn: 'ডেলিভারি ঠিকানা', en: 'Delivery Address', category: 'order_confirmation', subCategory: 'confirmation_details', description: 'Confirmation delivery address header' },
    { key: 'confirm_item_col', bn: 'পণ্য', en: 'Product', category: 'order_confirmation', subCategory: 'confirmation_details', description: 'Order items table product column' },
    { key: 'confirm_qty_col', bn: 'পরিমাণ', en: 'Qty', category: 'order_confirmation', subCategory: 'confirmation_details', description: 'Order items table quantity column' },
    { key: 'confirm_price_col', bn: 'মূল্য', en: 'Price', category: 'order_confirmation', subCategory: 'confirmation_details', description: 'Order items table price column' },
    { key: 'track_badge', bn: 'লাইভ অর্ডার ট্র্যাকিং', en: 'Live Order Tracking', category: 'order_tracking', subCategory: 'tracking_form', description: 'Tracking page top badge' },
    { key: 'track_heading', bn: 'আপনার অর্ডারের বর্তমান অবস্থা দেখুন', en: 'Track Your Order Status', category: 'order_tracking', subCategory: 'tracking_form', description: 'Tracking page heading' },
    { key: 'track_page_title', bn: 'আপনার অর্ডার ট্র্যাক করুন', en: 'Track Your Order', category: 'order_tracking', subCategory: 'tracking_form', description: 'Track order page title (alias)' },
    { key: 'track_subheading', bn: 'অর্ডার আইডি অথবা অর্ডার করার সময় ব্যবহৃত মোবাইল নম্বর ও অ্যাক্সেস কোড দিন।', en: 'Enter your Order ID or phone number along with your access code to view real-time delivery status.', category: 'order_tracking', subCategory: 'tracking_form', description: 'Tracking page subtitle' },
    { key: 'track_page_sub', bn: 'অর্ডার করার সময় প্রাপ্ত মোবাইল নম্বর অথবা অর্ডার আইডি দিয়ে স্ট্যাটাস দেখুন', en: 'Enter your phone number or Order ID to view real-time delivery status', category: 'order_tracking', subCategory: 'tracking_form', description: 'Track order page description (alias)' },
    { key: 'track_form_order_label', bn: 'অর্ডার আইডি (যেমন: WM-1001)', en: 'Order ID (e.g. WM-1001)', category: 'order_tracking', subCategory: 'tracking_form', description: 'Order ID input label' },
    { key: 'track_input_label', bn: 'মোবাইল নম্বর অথবা অর্ডার আইডি (e.g. WM-1001)', en: 'Mobile Number or Order ID (e.g. WM-1001)', category: 'order_tracking', subCategory: 'tracking_form', description: 'Tracking input field label (alias)' },
    { key: 'track_form_order_placeholder', bn: 'যেমন: WM-1001', en: 'e.g. WM-1001', category: 'order_tracking', subCategory: 'tracking_form', description: 'Order ID input placeholder' },
    { key: 'track_form_phone_label', bn: 'মোবাইল নম্বর', en: 'Mobile Number', category: 'order_tracking', subCategory: 'tracking_form', description: 'Phone number input label' },
    { key: 'track_form_phone_placeholder', bn: '01XXXXXXXXX', en: '01XXXXXXXXX', category: 'order_tracking', subCategory: 'tracking_form', description: 'Phone number placeholder' },
    { key: 'track_access_code_placeholder', bn: 'অ্যাক্সেস কোড (৬ ডিজিট)', en: 'Access Code (6 digits)', category: 'order_tracking', subCategory: 'tracking_form', description: 'Access code placeholder' },
    { key: 'track_form_submit', bn: 'স্ট্যাটাস দেখুন', en: 'Track Order', category: 'order_tracking', subCategory: 'tracking_form', description: 'Tracking submit button' },
    { key: 'track_btn', bn: 'স্ট্যাটাস খুঁজুন', en: 'Track Now', category: 'order_tracking', subCategory: 'tracking_form', description: 'Track submit button (alias)' },
    { key: 'status_pending', bn: 'অর্ডার গৃহীত হয়েছে', en: 'Order Placed (Pending)', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Pending status label' },
    { key: 'track_status_pending', bn: 'অর্ডার গৃহীত হয়েছে (Pending)', en: 'Order Placed (Pending)', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Status pending label (alias)' },
    { key: 'status_confirmed', bn: 'অর্ডার কনফার্ম হয়েছে', en: 'Order Confirmed', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Confirmed status label' },
    { key: 'track_status_confirmed', bn: 'অর্ডার কনফার্ম হয়েছে (Confirmed)', en: 'Order Confirmed', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Status confirmed label (alias)' },
    { key: 'status_processing', bn: 'প্যাকেজিং প্রক্রিয়াধীন', en: 'Processing & Packaging', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Processing status label' },
    { key: 'track_status_processing', bn: 'প্যাকেজিং প্রক্রিয়াধীন (Processing)', en: 'Processing & Packaging', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Status processing label (alias)' },
    { key: 'status_shipped', bn: 'কুরিয়ারে হস্তান্তর হয়েছে', en: 'Handed to Courier (Shipped)', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Shipped status label' },
    { key: 'track_status_shipped', bn: 'কুরিয়ারে হস্তান্তর করা হয়েছে (Shipped)', en: 'Handed to Courier (Shipped)', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Status shipped label (alias)' },
    { key: 'status_delivered', bn: 'সফলভাবে ডেলিভারি হয়েছে', en: 'Successfully Delivered', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Delivered status label' },
    { key: 'track_status_delivered', bn: 'সফলভাবে ডেলিভারি হয়েছে (Delivered)', en: 'Successfully Delivered', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Status delivered label (alias)' },
    { key: 'track_order_cancelled_title', bn: 'অর্ডারটি বাতিল করা হয়েছে', en: 'Order Cancelled', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Cancelled status title' },
    { key: 'track_status_cancelled', bn: 'অর্ডার বাতিল হয়েছে (Cancelled)', en: 'Order Cancelled', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Status cancelled label (alias)' },
    { key: 'track_order_cancelled_desc', bn: 'এই অর্ডারটি কোনো কারণে বাতিল করা হয়েছে। বিস্তারিত জানতে অনুগ্রহ করে কাস্টমার কেয়ারে যোগাযোগ করুন।', en: 'This order has been cancelled. Please contact customer care for assistance.', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Cancelled status message' },
    { key: 'track_status_timeline_title', bn: 'ডেলিভারি টাইমলাইন ও লাইভ স্ট্যাটাস', en: 'Delivery Timeline & Live Status', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Timeline header' },
    { key: 'track_timeline_in_progress', bn: 'প্রক্রিয়াধীন', en: 'In Progress', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Timeline in progress node badge' },
    { key: 'track_timeline_done', bn: 'সম্পন্ন', en: 'Completed', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Timeline completed node badge' },
    { key: 'track_timeline_pending', bn: 'অপেক্ষমাণ', en: 'Pending', category: 'order_tracking', subCategory: 'tracking_timeline', description: 'Timeline pending node badge' },
    { key: 'order_number_title', bn: 'অর্ডার বিস্তারিত', en: 'Order Details', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Order details title' },
    { key: 'order_package_items', bn: 'প্যাকেজের পণ্যসমূহ', en: 'Package Contents', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Package items heading' },
    { key: 'track_btn_review', bn: 'রিভিউ দিন', en: 'Write a Review', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Write review button on tracking' },
    { key: 'track_delivery_address_title', bn: 'ডেলিভারি ঠিকানা ও গ্রাহক তথ্য', en: 'Delivery Address & Recipient Info', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Recipient box title' },
    { key: 'track_payment_summary_title', bn: 'পেমেন্ট ও বিলিং সামারি', en: 'Payment & Billing Summary', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Payment summary box title' },
    { key: 'track_verified_parcel', bn: 'ভেরিফাইড পার্সেল', en: 'Verified Parcel', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Verified parcel badge' },
    { key: 'track_reviewed_badge', bn: 'রিভিউ সম্পন্ন হয়েছে', en: 'Reviewed', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Reviewed badge' },
    { key: 'track_support_box_title', bn: 'ডেলিভারি নিয়ে কোনো সমস্যা বা প্রশ্ন?', en: 'Any issues with your delivery?', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Support box title' },
    { key: 'track_support_box_desc', bn: 'আমাদের সাপোর্ট টিম সরাসরি সহায়তা করার জন্য সবসময় প্রস্তুত রয়েছে।', en: 'Our customer support team is always ready to assist you.', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Support box description' },
    { key: 'track_browse_catalog_btn', bn: 'আরও পণ্য দেখুন', en: 'Explore More Products', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Browse catalog button' },
    { key: 'track_modal_title', bn: 'পণ্যটির রিভিউ লিখুন', en: 'Write a Product Review', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Review modal title' },
    { key: 'track_modal_rating_label', bn: 'আপনার রেটিং দিন', en: 'Your Rating', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Modal rating label' },
    { key: 'track_modal_review_label', bn: 'আপনার বাস্তব অভিজ্ঞতা লিখুন', en: 'Share Your Experience', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Modal review text label' },
    { key: 'track_modal_review_placeholder', bn: 'পণ্যটির ফিনিশিং ও কাঠের মান কেমন লেগেছে বিস্তারিত লিখুন...', en: 'Describe the wood quality, craftsmanship, and delivery experience...', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Modal review placeholder' },
    { key: 'track_modal_cancel_btn', bn: 'বাতিল', en: 'Cancel', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Modal cancel button' },
    { key: 'track_modal_submit_btn', bn: 'রিভিউ জমা দিন', en: 'Submit Review', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Modal submit button' },
    { key: 'track_zone_label', bn: 'ডেলিভারি জোন:', en: 'Delivery Zone:', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Delivery zone label' },
    { key: 'track_delivery_note_label', bn: 'ডেলিভারি নোট:', en: 'Delivery Note:', category: 'order_tracking', subCategory: 'tracking_parcel_details', description: 'Delivery note label' },
    { key: 'search_filters_heading', bn: 'ফিল্টার', en: 'Filters', category: 'search_page', subCategory: 'search_controls', description: 'Search filters header' },
    { key: 'search_query_label', bn: 'পণ্য খুঁজুন:', en: 'Search Query:', category: 'search_page', subCategory: 'search_controls', description: 'Search query input label' },
    { key: 'search_query_placeholder', bn: 'পণ্যের নাম বা কীওয়ার্ড লিখুন...', en: 'Search by product name or keyword...', category: 'search_page', subCategory: 'search_controls', description: 'Search query input placeholder' },
    { key: 'search_category_label', bn: 'ক্যাটাগরি ফিল্টার:', en: 'Filter by Category:', category: 'search_page', subCategory: 'search_controls', description: 'Search category filter label' },
    { key: 'search_all_categories', bn: 'সকল ক্যাটাগরি', en: 'All Categories', category: 'search_page', subCategory: 'search_controls', description: 'All categories option' },
    { key: 'search_size_label', bn: 'সাইজ ফিল্টার:', en: 'Filter by Size:', category: 'search_page', subCategory: 'search_controls', description: 'Search size filter label' },
    { key: 'search_all_sizes', bn: 'সকল সাইজ', en: 'All Sizes', category: 'search_page', subCategory: 'search_controls', description: 'All sizes option' },
    { key: 'search_color_label', bn: 'কালার / ফিনিশ:', en: 'Filter by Color / Finish:', category: 'search_page', subCategory: 'search_controls', description: 'Search color filter label' },
    { key: 'search_all_colors', bn: 'সকল ফিনিশ', en: 'All Finishes', category: 'search_page', subCategory: 'search_controls', description: 'All colors option' },
    { key: 'search_price_heading', bn: 'মূল্য ফিল্টার:', en: 'Price Filter:', category: 'search_page', subCategory: 'search_controls', description: 'Search price filter heading' },
    { key: 'search_min_price', bn: 'সর্বনিম্ন মূল্য', en: 'Min Price', category: 'search_page', subCategory: 'search_controls', description: 'Min price placeholder' },
    { key: 'search_max_price', bn: 'সর্বোচ্চ মূল্য', en: 'Max Price', category: 'search_page', subCategory: 'search_controls', description: 'Max price placeholder' },
    { key: 'search_sort_label', bn: 'ক্রমানুসার:', en: 'Sort Results:', category: 'search_page', subCategory: 'search_controls', description: 'Search sort label' },
    { key: 'search_sort_newest', bn: 'নতুন সংযোজন', en: 'Newest Arrivals', category: 'search_page', subCategory: 'search_controls', description: 'Sort newest' },
    { key: 'search_sort_price_low', bn: 'মূল্য: কম থেকে বেশি', en: 'Price: Low to High', category: 'search_page', subCategory: 'search_controls', description: 'Sort low to high' },
    { key: 'search_sort_price_high', bn: 'মূল্য: বেশি থেকে কম', en: 'Price: High to Low', category: 'search_page', subCategory: 'search_controls', description: 'Sort high to low' },
    { key: 'search_sort_name', bn: 'নাম অনুসারে', en: 'Alphabetical (A-Z)', category: 'search_page', subCategory: 'search_controls', description: 'Sort alphabetical' },
    { key: 'search_apply', bn: 'ফিল্টার প্রয়োগ করুন', en: 'Apply Filters', category: 'search_page', subCategory: 'search_controls', description: 'Apply filters button' },
    { key: 'search_filtered_label', bn: 'ফিল্টার করা পণ্য', en: 'Filtered Products', category: 'search_page', subCategory: 'search_controls', description: 'Filtered results header' },
    { key: 'search_filter_active_count', bn: 'টি সক্রিয়', en: 'active', category: 'search_page', subCategory: 'search_controls', description: 'Active filters badge' },
    { key: 'footer_strip_cod_title', bn: '১০০% ক্যাশ অন ডেলিভারি', en: '100% Cash on Delivery', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 1 title' },
    { key: 'footer_strip_cod_desc', bn: 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ', en: 'Inspect before paying at your doorstep', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 1 subtitle' },
    { key: 'footer_strip_guarantee_title', bn: '৭ দিনের ফ্রি রিপ্লেসমেন্ট', en: '7-Day Free Replacement', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 2 title' },
    { key: 'footer_strip_replacement_title', bn: 'ক্ষতিগ্রস্ত হলে ফ্রি রিপ্লেসমেন্ট', en: 'Free Damage Replacement', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 2 title (alias)' },
    { key: 'footer_strip_guarantee_desc', bn: 'ডেলিভারিতে ক্ষতি হলে তাত্ক্ষণিক সমাধান', en: 'Instant replacement if damaged in transit', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 2 subtitle' },
    { key: 'footer_strip_wood_title', bn: 'খাঁটি প্রাকৃতিক বার্চ উড', en: '100% Pure Natural Birch Wood', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 3 title' },
    { key: 'footer_strip_wood_desc', bn: 'নিখুঁত লেজার কাটিং ও হস্তনির্মিত ফিনিশ', en: 'Laser-cut precision & artisan handcrafted finish', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 3 subtitle' },
    { key: 'footer_strip_delivery_title', bn: 'দ্রুততম হোম ডেলিভারি', en: 'Fast Nationwide Home Delivery', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 4 title' },
    { key: 'footer_strip_delivery_desc', bn: 'ঢাকা ও সারা দেশে নিরাপদ কুরিয়ার সুবিধা', en: 'Safe delivery across Dhaka and all 64 districts', category: 'footer_support', subCategory: 'bottom_guarantee_strip', description: 'Footer bottom strip 4 subtitle' },
    { key: 'footer_brand_desc', bn: 'স্টোরফোর্জ — আধুনিক ও প্রিমিয়াম মানের সেরা পণ্যসম্ভার যা আপনার জীবনযাত্রায় এনে দেবে নান্দনিক আভিজাত্য।', en: 'StoreForge provides premium handcrafted products and artistic collections designed to elevate your lifestyle.', category: 'footer_support', subCategory: 'footer_content', description: 'Footer brand mission statement' },
    { key: 'footer_brand_tagline', bn: 'হাতে তৈরি ত্রিমাত্রিক কাঠের বিশ্ব মানচিত্র যা আপনার ঘরের দেয়ালে এনে দেবে নান্দনিক আভিজাত্য।', en: 'Handcrafted 3D multi-layered wooden world maps bringing elegance and wanderlust to your wall.', category: 'footer_support', subCategory: 'footer_content', description: 'Footer brand mission (alias)' },
    { key: 'footer_quick_links_title', bn: 'প্রয়োজনীয় লিংক', en: 'Quick Links', category: 'footer_support', subCategory: 'footer_content', description: 'Footer quick links column title' },
    { key: 'footer_links_title', bn: 'প্রয়োজনীয় লিংক', en: 'Quick Links', category: 'footer_support', subCategory: 'footer_content', description: 'Footer quick links title (alias)' },
    { key: 'footer_shopping_title', bn: 'কেনাকাটা ও ক্যাটালগ', en: 'Shop & Explore', category: 'footer_support', subCategory: 'footer_content', description: 'Footer shopping column title' },
    { key: 'footer_shop_title', bn: 'কেনাকাটা', en: 'Shop & Explore', category: 'footer_support', subCategory: 'footer_content', description: 'Footer shopping title (alias)' },
    { key: 'footer_browse_catalog', bn: 'সকল পণ্য ক্যাটালগ', en: 'Full Product Catalog', category: 'footer_support', subCategory: 'footer_content', description: 'Footer browse catalog link' },
    { key: 'footer_new_products', bn: 'নতুন কালেকশন', en: 'New Collections', category: 'footer_support', subCategory: 'footer_content', description: 'Footer new collections link' },
    { key: 'footer_contact_title', bn: 'যোগাযোগ ও সাপোর্ট', en: 'Contact & Support', category: 'footer_support', subCategory: 'footer_content', description: 'Footer contact column title' },
    { key: 'footer_copyright', bn: 'সর্বস্বত্ব সংরক্ষিত।', en: 'All rights reserved.', category: 'footer_support', subCategory: 'footer_content', description: 'Footer copyright notice' },
    { key: 'footer_rights', bn: 'সর্বস্বত্ব সংরক্ষিত।', en: 'All rights reserved.', category: 'footer_support', subCategory: 'footer_content', description: 'Footer copyright notice (alias)' },
    { key: 'whatsapp_inquiry_msg', bn: 'হ্যালো, আমি আপনাদের পণ্য সম্পর্কে জানতে চাই।', en: 'Hello, I would like to inquire about your products.', category: 'footer_support', subCategory: 'floating_support', description: 'Default WhatsApp inquiry message' },
    { key: 'whatsapp_chat_tooltip', bn: 'হোয়াটসঅ্যাপে চ্যাট করুন', en: 'Chat on WhatsApp', category: 'footer_support', subCategory: 'floating_support', description: 'WhatsApp floating button tooltip' },
    { key: 'call_customer_care_tooltip', bn: 'কাস্টমার কেয়ারে কল করুন', en: 'Call Customer Care', category: 'footer_support', subCategory: 'floating_support', description: 'Phone floating button tooltip' },
    { key: 'pwa_install_btn', bn: 'অ্যাপ ইনস্টল করুন', en: 'Install App', category: 'footer_support', subCategory: 'floating_support', description: 'PWA install button label' },
    { key: 'pwa_install_hint', bn: 'সহজ কেনাকাটার জন্য হোম স্ক্রিনে যোগ করুন', en: 'Add to home screen for faster shopping experience', category: 'footer_support', subCategory: 'floating_support', description: 'PWA install hint' },
    { key: 'policy_sidebar_nav_title', bn: 'অন্যান্য নীতিমালা ও তথ্য', en: 'Other Policies & Info', category: 'footer_support', subCategory: 'floating_support', description: 'Policy sidebar menu title' },
    { key: 'policy_assistance_title', bn: 'যেকোনো জিজ্ঞাসায় আমরা আছি', en: 'Need Any Assistance?', category: 'footer_support', subCategory: 'floating_support', description: 'Policy sidebar help box title' },
    { key: 'policy_assistance_desc', bn: 'অর্ডার, ডেলিভারি বা পলিসি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।', en: 'Contact our support team anytime for inquiries regarding orders, shipping, or policies.', category: 'footer_support', subCategory: 'floating_support', description: 'Policy sidebar help box description' },
    { key: 'loading', bn: 'লোড হচ্ছে...', en: 'Loading...', category: 'common_system', subCategory: 'general_ui', description: 'Loading indicator text' },
    { key: 'network_error_retry', bn: 'নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', en: 'Network error. Please try again.', category: 'common_system', subCategory: 'general_ui', description: 'Network retry message' },
    { key: 'remove', bn: 'মুছে ফেলুন', en: 'Remove', category: 'common_system', subCategory: 'general_ui', description: 'Generic remove action label' },
    { key: 'close', bn: 'বন্ধ করুন', en: 'Close', category: 'common_system', subCategory: 'general_ui', description: 'Generic close action label' },
];
let TranslationsService = class TranslationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.cache = { bn: {}, en: {} };
        this.cacheLoaded = false;
    }
    async onModuleInit() {
        await this.seedDefaultsIfEmpty();
        await this.refreshCache();
    }
    async seedDefaultsIfEmpty() {
        try {
            const count = await this.prisma.translation.count();
            if (count < exports.DEFAULT_STATIC_UI_TRANSLATIONS.length) {
                const ops = exports.DEFAULT_STATIC_UI_TRANSLATIONS.map((item) => this.prisma.translation.upsert({
                    where: { key: item.key },
                    update: {},
                    create: {
                        key: item.key,
                        bn: item.bn,
                        en: item.en,
                        category: item.category,
                        description: item.description,
                    },
                }));
                await this.prisma.$transaction(ops);
            }
        }
        catch (err) {
            if (err?.code === 'P2021') {
                console.warn('⚠️ Translations table not yet initialized. Will populate on next startup once schema is synced.');
            }
            else {
                console.warn('Could not seed default translations:', err?.message || err);
            }
        }
    }
    async refreshCache() {
        try {
            const list = await this.prisma.translation.findMany({
                select: { key: true, bn: true, en: true },
            });
            const bnMap = {};
            const enMap = {};
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                bnMap[item.key] = item.bn;
                enMap[item.key] = item.en;
            }
            this.cache = { bn: bnMap, en: enMap };
            this.cacheLoaded = true;
        }
        catch (err) {
            const bnMap = {};
            const enMap = {};
            for (const item of exports.DEFAULT_STATIC_UI_TRANSLATIONS) {
                bnMap[item.key] = item.bn;
                enMap[item.key] = item.en;
            }
            this.cache = { bn: bnMap, en: enMap };
            this.cacheLoaded = true;
        }
    }
    async getTranslations(lang = 'bn') {
        if (!this.cacheLoaded) {
            await this.refreshCache();
        }
        return this.cache[lang] || this.cache.bn;
    }
    async getAll() {
        return this.prisma.translation.findMany({
            orderBy: [{ category: 'asc' }, { key: 'asc' }],
        });
    }
    async update(id, data) {
        const res = await this.prisma.translation.update({
            where: { id },
            data,
        });
        await this.refreshCache();
        return res;
    }
    async delete(id) {
        const res = await this.prisma.translation.delete({
            where: { id },
        });
        await this.refreshCache();
        return res;
    }
    async upsert(key, bn, en, category = 'general', description) {
        const res = await this.prisma.translation.upsert({
            where: { key },
            update: { bn, en, category, description },
            create: { key, bn, en, category, description },
        });
        await this.refreshCache();
        return res;
    }
    async upsertBulk(items) {
        const ops = items.map((item) => this.prisma.translation.upsert({
            where: { key: item.key },
            update: {
                bn: item.bn,
                en: item.en,
                category: item.category || 'general',
                description: item.description,
            },
            create: {
                key: item.key,
                bn: item.bn,
                en: item.en,
                category: item.category || 'general',
                description: item.description,
            },
        }));
        await this.prisma.$transaction(ops);
        await this.refreshCache();
        return { success: true, count: items.length };
    }
};
exports.TranslationsService = TranslationsService;
exports.TranslationsService = TranslationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TranslationsService);
