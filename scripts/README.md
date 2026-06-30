# Stripe Data Deletion Script

Ye script aapke Stripe account se saara data delete kar degi.

## 🚨 WARNING 
**YE ACTION IRREVERSIBLE HAI!** 
- Saare customers delete honge
- Saare payments delete honge  
- Saare products delete honge
- Saare subscriptions delete honge

## Steps to run:

### 1. Environment variables set karo
`.env` file mein ye variables honi chahiye:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Script run karo
```bash
# Scripts folder mein jao
cd scripts

# Dependencies install karo
npm install

# Script run karo
npm run delete-stripe
```

## Jo data delete hoga:
✅ **Customers** (saare customers aur unka data)  
✅ **Products** (saare courses/products)  
✅ **Prices** (saare pricing plans)  
✅ **Coupons** (saare discount codes)  
✅ **Payment Methods** (cards, bank accounts)  
✅ **Subscriptions** (recurring payments)  

## Alternative: Manual Dashboard Deletion
Agar aap manually karna chahte hain:

1. **Customers Delete**: 
   - Stripe Dashboard → Customers → Select all → Delete

2. **Products Delete**:
   - Stripe Dashboard → Products → Select all → Delete  

3. **Prices Delete**:
   - Products ke andar prices delete karo

4. **Webhooks Delete**:
   - Developers → Webhooks → Delete endpoints

## Script Benefits:
- ✅ Fast automated deletion
- ✅ Error handling
- ✅ Progress logging
- ✅ Complete cleanup

Script run karne se pehle double check karo ki aap sahi Stripe account mein ho (test vs live)!
