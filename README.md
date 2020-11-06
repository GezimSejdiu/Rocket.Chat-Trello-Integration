# Rocket.Chat-Trello-Integration
>A Rocket.Chat [Trello](https://trello.com/) integration to send activity notifications to Rocket.Chat channels.

![image](Rocket.Chat-Trello-Integration.png)

## How To
-  Create an incoming webhook in your RocketChat
   -  Go to **RocketChat-> Administration-> Integrations-> New Integration-> Incoming webhook**
   - Set **"Enabled"** to **"True"**
   - Give a name for the webhook (i.e "sda.tech-trello")
   - Select the channel where you will receive the alerts (e.g: #sda.tech-events). You may wish to create a dedicated channel for your notifications.
   - Select an account from which the alerts will be posted (usually rocket.cat account is used).
   - Set **"Script Enabled"** to **"True"**
   - Paste [Trello.js](https://github.com/GezimSejdiu/Rocket.Chat-Trello-Integration/blob/master/Trello.js) inside the Script field.
   - Save the integration. This will generate a webhook URL and secret for you.
   - Use the generated **WebHook URL** to POST messages to Rocket.Chat
- Go to [Trello's REST API](https://developer.atlassian.com/cloud/trello/rest/) and enter your [Trello API Key](https://trello.com/app-key) and your Token to get started.
   - After you have been connected to the Trello’s REST API you may wish to **[GET /1/boards/{id}](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-get)** which request a single board you are looking for, by providing the **id** of the board as a parameter (For example in the URL https://trello.com/b/Id0fth3B0rD/board-name, the id would be `Id0fth3B0rD`). 
   Run: 
      ```sh
      curl --request GET \
        --url 'https://api.trello.com/1/boards/{id}?key={key}={token}' \
        --header 'Accept: application/json'
      ```
      to get the result, where key/token are comming from the [Trello API Key](https://trello.com/app-key).
   - Select `"id": "idModel"` of a board which you would like to create POST messages to Rocket.Chat.
   - Go to **[Create a Webhook](https://developer.atlassian.com/cloud/trello/rest/api-group-webhooks/#api-webhooks-post)** in the Trello’s REST API and add your WebHook URL (**callbackURL**), Board Id (**idModel**) and other parameters as below:
   ```sh
      curl --request POST \
        --url 'https://api.trello.com/1/webhooks/?key={key}&token={token}&callbackURL={callbackURL}&idModel={id}' \
        --header 'Accept: application/json'

   ```
   - **Execute it** to make it works.
- The integration is ready to generate notifications for the given board :) Enjoy it!
