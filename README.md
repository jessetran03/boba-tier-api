# Boba Tier
 * * *
 

## Live
 --------------

Demo: [https://boba-tier-app.vercel.app/](https://boba-tier-app.vercel.app/) </br>
Client Repo: [https://github.com/jessetran03/boba-tier-app](https://github.com/jessetran03/boba-tier-app) </br>
Server Repo: [https://github.com/jessetran03/boba-tier-api](https://github.com/jessetran03/boba-tier-api)

## Summary
 --------------

 Boba Tier is a web application that enables you to rate the drinks for boba shops by city. The application allows the user to track the boba drinks that they have rated and see which drinks are the top-rated drinks in the city. The user can also leave comments on the individual shop pages to express their thoughts about that shop.

## API Documentation
 --------------
 POST /api/auth/login </br>
 POST /api/users </br>
 GET /api/shops </br>
 GET /api/shops/:shop_id </br>
 GET /api/shops/:shop_id/comments </br>
 GET /api/drinks </br>
 POST /api/drinks </br>
 GET /api/drinks/:drink_id </br>
 DELETE /api/drinks/:drink_id </br>
 GET /api/ratings </br>
 POST /api/ratings </br>
 PATCH /api/ratings/:rating_id </br>
 POST /api/comments

## Screenshots
  --------------
 Landing Page:
 ![Landing](screenshots/landing-page.png)

 Login Page:
 ![Login](screenshots/login-page.png)

 Workout List Page:
 ![ShopList](screenshots/shop-list.png)

 Workout Exercises Page:
 ![Shop](screenshots/shop-page.png)

 Exercise list Page:
 ![TopTen](screenshots/top-ten-page.png)

 Exercise Log Page:
 ![MyRatings](screenshots/my-ratings.png)


## Technologies Used
 --------------

 1. JavaScript
 2. Node
 3. Express
 4. JWT
 5. Chai, Mocha

## Seeding

psql -U jessetran -d bobatier -f ./seeds/seed.bobatier_tables.sql
