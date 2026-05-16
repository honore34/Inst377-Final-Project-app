Developer Manual: 

This developer manual will help you understand what to install, how to navigate some issues when creating this application. 

What to install and all the dependencies: 

First clone this git hub repository for this application.  

Then click on this folder and select the integrated terminal for the folder. 

Now we need to install node(make sure you install node js app on your computer) so in the integrated terminal put this line: npm init then npm install nodemon

Next we will also be using supabase for our database where you will write and retrieve data from. In the same folders integrated terminal: npm install @supabase/supabase-js

We will also be using express so in the same terminal: npm install express

We also need to create some files to hold our Subabase url and key. Create a gitignore and .env file. The .env will store your subabase url and key. Then add your .env into your gitignore file. 

Running the application: 

In your package.json file add this to your script section ("start": "nodemon -e '*'") This will make it easier to run your code so that in your terminal it will be: npm start

The application will run on your browser( use chrome for testing and make sure cords extension is turned on): in the url type: http://localhost:3000 

Importantly you can’t use live server because if you use live server supabase won’t work. 

For your supabase you need one table: This table will have id, created_at, username, posted comments, like,and dislike. This is important for your community post page. 

When running your code you should see the database loading in your terminal and as you change and update the code the terminal is actively running and showing you messages of changes and updates to the application. 

I have removed some logs but if you run into any bugs within the system do console.log( add the variable to the area you want to see) Then on the web application go to inspect ,then console to see the errors. 

Break down of pages and the API they need. 

Home page:
Description: 
It functions by showing random anime img slide show, search area for top animes, and at the bottom quote box.   
needs: 
There are two API required: 
For the pictures and rating (https://api.jikan.moe/v4/top/anime?)
For quotes (https://api.animechan.io/v1/quotes/random)

Find anime page: 
Description: 
Helps users find random animes old or new using API then shows max 3 anime recommendations based on users choice of genre and episode length.
Needs: 
API for the recommendation:  (https://api.jikan.moe/v4/top/anime?)
Chatter page: 
Description: 
Users can post comments and see posted comments. The posted comments don’t disappear when refreshing the page. There are also like and dislike buttons. 
Needs: 
You will be using supabase database created earlier for this page: You call it like ‘Table name’. When they hit the post button it writes into your database, when the post pops up you are getting data from the database. 

Contact page: 
Description: 
This page allows user to contact you and send an email about their concern 

Thank you page: 
Description:
This pops up after the user hits submit on the contact page, it says thank you and redirects the user back to the home page within 5-10 seconds. Or they can click the home icon on the page to redirect them back to the home page. 

About page: 
Description: 
This page just describes what the application is about. 


Future Developments: 

If there is more time, have the contact page send the concerns to a specific email and allow the developer to send an automatic email back to the user. 

Improve the chatter/community post page so that it's more visually appealing and add user profile pictures and time stamps. 

Adding a news section to the home page, where it uses API to retrieve news in the current anime community. 

Overall importantly having an account on this application so users can log in and store their data so they won’t forget their recommendation. 

Also improving the recommendation where if they already recommended an anime it won’t recommend again. 
Finally adding more genre and anime to the recommendation page. 

Note: if you want custom buttons here is a link to that page: https://getcssscan.com/css-buttons-examples. 