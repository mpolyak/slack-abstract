# slack-abstract
[Slack](https://slack.com) avatar generated with [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in the [Abstract art](https://en.wikipedia.org/wiki/Abstract_art) minimalist style.

![avatar](example.gif)

On the left is the colorized Game of Life board, on the right is the avatar image composition.

## Development
See the avatar evolve by running `npm start dev` (python3 is required), and navigating to `http://localhost:8000/prototype.html`.

## Setup
1. Set `SLACK_TOKEN` environment variable to the **User OAuth Token** generated for your workspace installed app (Under *OAuth & Permissions* section in your app configuration page, [https://api.slack.com/apps](https://api.slack.com/apps)).
    - Ensure `users.profile:write` scope is added to **User Token Scopes** to allow for editing of your profile photo. 


2. Set `SAVE_GAME` to the filename where the current avatar state will be stored between runs.

3. Run `npm install` to install project dependencies.

## Running
- Run `npm start` to update the avatar once.
- Run `npm run start:local` to continuously update the avatar every 15 seconds.

## License
[MIT](LICENSE)
