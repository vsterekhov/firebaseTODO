# FirebaseTODO. Description

Implement TODO list with the following features: 
1. Use React, Angular or other framework 
2. Data should be stored in firebase [https://firebase.google.com/](https://firebase.google.com/) 
3. Application should support storing multiple “todo lists” identified by unique key 
4. Opening application main page should create new todo list that could be shared by URL. 
    I.E. http://example.com/<unique-key> or http://example.com/#<unique-key> 
5. Application should support simultaneous todo list access for multiple users: 
    a. user having access URL should be able to view/edit corresponding todo list, 
    b. saving TODO list should check whether it has been changed by another user. If 
        there are any changes in parallel sessions detected the application should show a dialog asking users to choose recovery strategy (e.g. loading server state/overwriting)

## How it works you can see here

[https://vsterekhov.github.io/firebaseTODO/](https://vsterekhov.github.io/firebaseTODO/)

## Development server

Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## TypeDoc

Run `npm run doc` to generate HTML documentation.

