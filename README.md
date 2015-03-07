# MusicLessonPlanner

### Version
1.0.0

MusicLessonPlanner is an organizational application for private music teachers that keeps track of their studio of students, lesson notes, schedule, and progress.

The live product website will be accessible during grading at [320mlp.zenzie.net](http://320mlp.zenzie.net).
This website redirects automatically to IP address
```sh
54.165.8.175:8000
```

### Installation

(These instructions will change once we are up and running with a URL, that way there is no need for the grader to install node)

- Install node and express before running this app. 
- You might also have to run "npm install" before starting the server.
In the terminal run:
```sh
$ node app
```
Open your internet browser and go to the localhost:
```sh
localhost:8000
```

### Database Access

The entirety of the database can be found in [./database/mlp.sql](database/mlp.sql).
To run any SQL command you desire on the database, navigate to ./database on your machine and run the script:
```sh
$ python dbtest.py
``` 

### Bug Tracking

All bugs are monitored under the issues subsection of our GitHub repository. New issues can be added by clicking the green “New Issue” button at the top right of the issues page.

### Tech

MusicLessonPlanner is built using a derivative of the "MEAN" stack:
* [AngularJS]: for enhanced HTML control
* [Express]: framework for Node.JS
* [node.js]: backend framework
* [Twitter Bootstrap]: CSS styling framework
* [SQLite3]: Database


[node.js]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[express]:http://expressjs.com
[AngularJS]:http://angularjs.org
[SQLite3]:https://sqlite.org
