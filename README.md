# SparkyBotRemake

An unofficial remake of the Sparky discord bot for guessing levels in the computer game Geometry Dash

## Features
- Guessing levels
- View profiles
- Changing the prefix

## How to use it?
1. Download the repository and nodejs. Move the repository to a your folder.
2. Change the config.json file
3. Import database.sql into your database
4. Open the console and enter the following there
```
cd C:\PATHTOYOURDIR
npm install
npm start
```

## How to add new levels for guess?
Add a new line to levels.txt, where the last parameter is the image link. Difficulties: easy, normal, hard

```
id;lvlname;username;difficult;link
```

## License
Copyright (c) Shizuketsu. All rights reserved.

Licensed under the [MIT](LICENSE.md) license.
