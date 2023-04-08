# TicTakToe
This file is intended to add context to the examples in this repository. The sections include:

- **Game Design** - generic notes on designing a Tic Tac Toe game that will be used in each refactor example.
  - [Visual Design](#visual-design)
  - [Game State](#game-state-design)
  - [MVC Pattern](#mvc-pattern)
- **Refactor Examples** - Each of these have dedicated YouTube videos that you can watch to better understand _how_ they were created. Additionally, there are comments throughout the code that attempt to explain important concepts.
  - Vanilla ES6 (see `typescript` branch for a TS implementation)
  - React (see `typescript` branch for a TS implementation)

I create this new project based on tutorial from freecodecamp.org and the origin project from Github which i will demonstrate below.

## Original Design

![Screenshot 2023-04-08 at 16 30 48](https://user-images.githubusercontent.com/9263674/230723987-63f67380-b353-4fa8-bf78-8e3f4dcb778a.png)

## Visual Design

I am not a professional designer, and therefore, I have kept the design refactor to a minimum.

Most of the visual changes were small tweaks to the original or to reflect additional functionality that was added as part of the refactor.

![image](https://user-images.githubusercontent.com/9263674/230105602-9ddeb1f6-5839-4a31-9948-ba235af8ecb9.png)

 3rd of April. I finish the layout as well as the style. UI. the logic to control all the grid will be work next.

![image](https://user-images.githubusercontent.com/9263674/230115012-4da4a687-6f22-4665-9225-6ab20eb0b698.png)

Design the MVC . Module - View - Control. It is a software architecture design pattern.

![Screenshot 2023-04-08 at 17 05 55](https://user-images.githubusercontent.com/9263674/230725557-a0ead266-cdc0-474f-a4af-d6c6b386d2de.png)



5th of April 2023. When i put all the javascript function in a file, it seem to have a lot of problem and it is very hard to scale and troubleshoot the bug

So i learn about MVC pattern and redesign the code.

![Screenshot 2023-04-08 at 16 01 39](https://user-images.githubusercontent.com/9263674/230722581-c388672d-bdcc-4cfe-88f2-af7d19d90ae2.png)


