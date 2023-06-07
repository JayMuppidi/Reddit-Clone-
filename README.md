# Greddiit

Greddiit is a web application similar to Reddit, designed to showcase my implementation of the MERN Stack and Docker. The application features a frontend built with ReactJS and a backend powered by NodeJS. The backend is connected to a MongoDB Atlas Database for data storage. To allow for hosting locally on an Nginx server, the application was containerized using Docker Compose.

In this submission, I have implemented key functionalities such as user login and registration page, profile page, my subgreddiits page, greddiits page, saved posts page, moderator page, and comments page. These features allow users to create accounts, log in, manage their profiles, interact with different subgreddiits, view and save posts, and securely log out. I have implemented Google O-Auth login as well to allow users to login through their email, as well as email alerts for actions on a report/post by a moderator. 

To run the app, just install docker and docker-compose from the respective links. After successful installation, run the command docker-compose up --build -d to run the docker containers.

Then navigate to http://localhost:8080 to access the website.

Technologies used- MongoDB, ExpressJS, React, NodeJS (MERN Stack), nginx
