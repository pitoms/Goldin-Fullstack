# Goldin-Fullstack
Rebuilding Hackaday's projects list &amp; detail page. Write up can be found [here.](https://docs.google.com/document/d/1WP-cSH8p0pu5UNeZanZOGayIXHXunyE6LP70l_-WJvw/edit?usp=sharing)

## Usage
Clone this repo to your local machine, and `npm install` from within the "Goldin-Fullstack" directory.  
Head over to https://dev.hackaday.io/ and grab an API key. Create a .env file and create a variable named API_KEY = 'my_api_key_from_hackaday_website'  
Run `npm run dev` and a browser tab will open with the web app.

## Requirements

* Node 0.10.x

## Executing program

* Navigate to root directory
* Install dependencies using `npm install`
* Run web server using `npm run dev`
```
cd Goldin-Fullstack
npm install
npm run dev
```


## Future improvements
The code here needs to be refactored - some of it is repetitive and can be fixed by creating more abstract, resusable functions. (DRY) Separating the css files, and client js functions will help for readability as well.
