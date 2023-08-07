Website: https://friends-activities-network.onrender.com

Friends, Activities, Network (F.A.N.) is a social platform that allows people to create and join groups or activities with other like minded individuals. Once signed up, a user can enjoy browsing the list of available groups whether they are local or distant. Both groups and events can be held online or in-person and are labeled as such. Costs for events can be as low as nothing as all or as high as necessary.

Technologies:

- JavaScript
- React
- Redux
- Express
- Node
- Sequelize

Features:

    - User
        - Create, Read, Login, Logout

    - Groups
        - Create (requires login), Read, Update (requires user to be owner of group), Delete (requires user to be owner of group)
            - Add images and descriptions (requires user to be owner of group)

    - Events (Events are tied to groups)
        - Create (requires user to be owner of group), Read, Delete (requires user to be owner of group)
            - Add images and descriptions (requires user to be owner of group)

![HomePage](/images/image.png)

![Create Group](/images/image-1.png)

![Browse Events](/images/image-2.png)

![Signup Modal](/images/image-3.png)


ToDo:

    - Complete CRUD for Events feature
    - Add join feature for Groups
    - Add attendance to events
    - Add venues for events
    - Add remove from group feature for group organizers
    - Add co-host option
    - View all members feature
    - Add profile image


To run locally:
    - Download all files.
    - Navigate to backend and run "npm install" to get all dependancies
    - Navigate to frontend and run "npm install" to get all dependancies
    - Run "npm remigrate" on the backend to seed local database
    - Run "npm start" on both frontend and back end


Darian Brooks
BrooksD@alumni.stanford.edu
