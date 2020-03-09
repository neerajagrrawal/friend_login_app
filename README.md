# Friends Login APP

# Install the dependencies
npm install

# Setting Up Database-
We need to have MYSQL Server installed.
1. After installing MYSQL Server, open MYSQL Command Line Client.
2. Enter your password
3. After logging, execute this query-> SELECT CURRENT_USER();
    You might get something like- root@localhost. So your username is 'root'.
4. Go to config/keys.js and replace user with your username and password with your password.

# SQL Queries -
1. Copy the following SQL Queries and execute them get started with the database -
2. CREATE DATABASE www ;
3. USE www ;
4. CREATE TABLE users(id varchar(50),first_name varchar(50),last_name varchar(50),avatar varchar(50),password varchar(50)) ;
5. Insert into users(id,first_name,last_name,avatar,password) VALUES
('neeraj','Neeraj','Agrawal','avatar_1.jpg',123123),
('aditya','Aditya','Shrivastava','avatar_2.jpg',123123),
('arjun','Arjun','Patel','avatar_3.jpg',123123),
('mayanka','Mayanka','Goyal','avatar_4.png',123123),
('raunak','Raunak','Khandelwal','avatar_5.jpg',123123),
('arpit','Arpit','Agrawal','avatar_6.jpg',123123),
('aman','Aman','Mittal','avatar_7.jpg',123123),
('anupam','Anupam','Juniwal','avatar_8.jpg',123123) ;
6. CREATE TABLE friends(self_id varchar(50),friend_id varchar(50)) ;
7. Insert into friends(self_id,friend_id) values
    ('neeraj','arpit'),
    ('neeraj','arjun'),
    ('neeraj','mayanka'),
    ('arpit','mayanka'),
    ('arpit','anupam'),
    ('arpit','aman'),
    ('arpit','neeraj'),
    ('arpit','raunak') ;

# Start the application -
1. Open terminal
2. execute 'nodemon app.js'
3. The App should start to run on a port and we should get a message like 'Connected to MYSQL' if setup of database is successful.
4. Now note down the port number in console at which the app is started.

# Testing Application-
1. We can use any testing tool like mocha etc.
2. We can basically mock the functionality of different function in our app like endpoints etc. and then test with different scenarios.
3. Like we can see for cases like empty data etc.

# Testing API Endpoints with postman -
1. To test fetch All Users- type 'http://localhost:5000/API/viewAllUsersAPI'. Replace the port number with your own port that we copied from console. The request type is GET.
2. To test fetch User's friends- type 'http://localhost:5000/API/viewAllFriendsDetailsAPI/neeraj'. Replace the port number with your own port that we copied from console. Replace 'neeraj' in the URL from any id for whose you want to fetch friends.The request type is GET.
3. To test fetch User's friends- type 'http://localhost:5000/API/viewFriendsOfFriendsAPI/neeraj'. Replace the port number with your own port that we copied from console. Replace 'neeraj' in the URL from any id for whose you want to fetch friends of friends.The request type is GET.

# About the Application-
1. We have to login/Register to access the Dashboard.
2. Once we Register and login, we are taken to Dashboard page.
3. A session is maintained for this.
4. Certain validations for registration are put in place and we get appropriate flash messages for it.
5. At Dashboard page, we have three buttons -
    * View All users
    * View User's friends
    * View User's friends of friends Of friends.

6. To view a user's friends/friends of friends we have to enter user id in the text box.
7. At All users Page, we can follow a different User.
    Here, we can't follow ourself and those who are already our friends. The Follow button is disabled in those cases.
    Note: Here If A follows B, then B is added to A's friend list, but the opposite might not be true.
7. Logout Button logs us out.
