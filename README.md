Endpoints:

GET https://expressproductapi.onrender.com/products?minPrice={num}&maxPrice={num}
GET https://expressproductapi.onrender.com/products/{id}
GET https://expressproductapi.onrender.com/products/report
POST https://expressproductapi.onrender.com/products
PUT https://expressproductapi.onrender.com/products/{id}
DELETE https://expressproductapi.onrender.com/products/{id}

I use free tier of hosting serivce, so the API (and client) shuts down after a few minutes of inactivity. Accessing those apps when they're down will cause them to re-start, which will take a few seconds.

