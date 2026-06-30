import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// Script to delete ALL Stripe data
async function deleteAllStripeData() {
  console.log('🔄 Starting Stripe data deletion process...');
  
  try {
    // 1. Get all customers
    console.log('📋 Fetching all customers...');
    const customers = await stripe.customers.list({ limit: 100 });
    
    if (customers.data.length === 0) {
      console.log('✅ No customers found to delete');
      return;
    }
    
    console.log(`📊 Found ${customers.data.length} customers`);
    
    // 2. Delete each customer (this also deletes their payment methods, subscriptions, etc.)
    for (const customer of customers.data) {
      try {
        console.log(`🗑️ Deleting customer: ${customer.id} (${customer.email || 'no email'})`);
        await stripe.customers.del(customer.id);
        console.log(`✅ Deleted customer: ${customer.id}`);
      } catch (error) {
        console.error(`❌ Failed to delete customer ${customer.id}:`, error);
      }
    }
    
    // 3. Delete all checkout sessions
    console.log('📋 Fetching checkout sessions...');
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    
    for (const session of sessions.data) {
      try {
        if (session.id) {
          console.log(`🗑️ Found session: ${session.id}`);
          // Note: Checkout sessions can't be deleted, they expire automatically
        }
      } catch (error) {
        console.error(`❌ Error processing session:`, error);
      }
    }
    
    // 4. Delete all products
    console.log('📋 Fetching products...');
    const products = await stripe.products.list({ limit: 100 });
    
    for (const product of products.data) {
      try {
        console.log(`🗑️ Deleting product: ${product.id} (${product.name})`);
        await stripe.products.del(product.id);
        console.log(`✅ Deleted product: ${product.id}`);
      } catch (error) {
        console.error(`❌ Failed to delete product ${product.id}:`, error);
      }
    }
    
    // 5. Delete all prices
    console.log('📋 Fetching prices...');
    const prices = await stripe.prices.list({ limit: 100 });
    
    for (const price of prices.data) {
      try {
        console.log(`🗑️ Archiving price: ${price.id}`);
        await stripe.prices.update(price.id, { active: false });
        console.log(`✅ Archived price: ${price.id}`);
      } catch (error) {
        console.error(`❌ Failed to archive price ${price.id}:`, error);
      }
    }
    
    // 6. Delete all coupons
    console.log('📋 Fetching coupons...');
    const coupons = await stripe.coupons.list({ limit: 100 });
    
    for (const coupon of coupons.data) {
      try {
        console.log(`🗑️ Deleting coupon: ${coupon.id}`);
        await stripe.coupons.del(coupon.id);
        console.log(`✅ Deleted coupon: ${coupon.id}`);
      } catch (error) {
        console.error(`❌ Failed to delete coupon ${coupon.id}:`, error);
      }
    }
    
    console.log('🎉 Stripe data deletion completed!');
    
  } catch (error) {
    console.error('❌ Error during Stripe data deletion:', error);
  }
}

// Run the deletion
deleteAllStripeData().then(() => {
  console.log('✅ Script execution completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
