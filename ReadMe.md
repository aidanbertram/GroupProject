Application Description:
Our application will facilitate the buying of any physical film or TV show in a variety of different formats. This is comparable to a vendor marketplace like Ebay. However, the difference is in the focus on physical medium content both for the sake of collection and ownership security. Due to the nature of physical content, after purchase they will have full ownership of the content of whatever they have purchased. In the modern era, many streaming services have changed their outlook, where you subscribe to the service and get to see the shows they have. However, you never get to keep any of the things you pay for. So, our service will differ in final ownership. 

Contributors:
Aidan Bertram, aidanbertram, aibe9737@colorado.edu
Alex Zhou, Alexz3221, alzh7368@colorado.edu
Hamed Sidiqyar, Hasi15954, hasi6172@colorado.edu
Emerson Scott, EmersonScott, emsc7297@colorado.edu

Technology Stack:
Docker, HTML, CSS, Javascript, Postgres ...

Prerequisites:
None

Instructions:
Full Docker/Postgres init sequence for fresh test, Terminal in ProjectSourceCode


docker-compose down
docker volume rm projectsourcecode_group-project
docker-compose up -d --build
docker-compose exec db psql -U username -d modom
\dt                                   //to see tables
SELECT * FROM users;                  //to see users
SELECT * FROM content;                //to see content
