Application Description:
Application will facilitate the renting, buying, and selling of any film or TV show. This is comparable to any streaming service. However, the difference is in the final ownership of a bought film. After purchase, they will have full autonomy to download or obtain a physical copy of whatever they have purchased. In the modern era, many streaming services have changed their outlook, where you subscribe to the service and get to see the shows they have. 

Contributors:
Aidan Bertram, aidanbertram, aibe9737@colorado.edu
Alex Zhou, Alexz3221, alzh7368@colorado.edu
Hamed Sidiqyar, Hasi15954, hasi6172@colorado.edu
Emerson Scott, EmersonScott, emsc7297@colorado.edu

Technology Stack:
Docker, HTML, CSS, Javascript, Postgres ...

Prerequisites:
-

Instructions:
Full Docker/Postgres init sequence for fresh test,

docker-compose down
docker volume rm projectsourcecode_group-project

docker-compose up -d --build

docker-compose exec db psql -U username -d modom

\dt

SELECT * FROM users;

