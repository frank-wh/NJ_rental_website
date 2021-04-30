## Project

CS-546 Final Project - Jersey city house rental website. Fork from my group project.
## Contributor

* Hao Wang

## How to run code?
#### download code
```
  git clone https://github.com/frank-wh/NJ_rental_website.git
```

#### install dependencies
```
  npm install
```

the dependencies we need:
```
  "bcryptjs",
  "express",
  "express-handlebars",
  "express-session",
  "gridfs-stream",
  "mongodb",
  "multer",
  "multer-gridfs-storage"
```

you can simply type your code in one line like this:
```
  npm i bcryptjs express express-handlebars express-session gridfs-stream mongodb multer multer-gridfs-storage
```

#### run seed.js to seed database
```
  node .\tasks\seed.js
```

#### run code
```
  npm start
```

Here are users and houses information in the following path, you can use these data to sign up the user and post houses and images to the website.
```
  /public/csv/houseInfo.csv
  /public/csv/userInfo.csv
  /public/img/
```

## Github link
https://github.com/frank-wh/NJ_rental_website.git
