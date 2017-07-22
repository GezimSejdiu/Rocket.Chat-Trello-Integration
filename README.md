# Rocket.Chat-Trello-Integration
>Integration between Trello and Rocket.Chat: send Trello activity notifications to Rocket.Chat channels.

![image](Rocket.Chat-Trello-Integration.png)

## How To
1. Checkout the project
   ```
   git clone https://github.com/GezimSejdiu/Rocket.Chat-Trello-Integration
   cd Rocket.Chat-Trello-Integration
   ```
1. Create an incoming webhook in your RocketChat
   1. Go to **RocketChat-> Administration-> Integrations-> New Integration-> Incoming webhook**
   1. Set **"Enabled"** to **"True"**
   1. Give a name for the webhook (i.e "sda.tech-trello")
   1. Select the channel where you will receive the alerts (ex: #sda.tech-events). You may wish to create a dedicated channel for your notifications.
   1. Select an account from which the alerts will be posted (usually rocket.chat bot account is used).
   1. Set **"Script Enabled"** to **"True"**
   1. Paste [Trello.js](https://github.com/GezimSejdiu/Rocket.Chat-Trello-Integration/blob/master/Trello.js) inside the Script field.
   1. Save the integration. This will generate a webhook URL and secret for you.
   1. Use the generated **WebHook URL** to POST messages to Rocket.Chat
1. Go to Trello Webhooks API [Sandbox](https://developers.trello.com/sandbox) and enter your Trello API Key to get started.
   1. After you have been connected to Sandbox you may wish to **Get Boards** which lists all Boards where you are member of.
   1. Select `"id": "idModel"` of a board which you would like to create POST messages to Rocket.Chat.
   1. Go to **Create Webhook** in the sandbox and add your WebHook URL and Board Id into this part of the script :
   ```javascript
   var parameters = {
      description: "Trello-YourChannel-Webhook",
      callbackURL: "WebHook URL",
      idModel: "idModel"
   };

   Trello.post('/webhooks/', parameters, success, error);
   ```
   1. Press **Execute** to make it works.
1. The integration is ready to generate notifications for the given Board :) Enjoy it!
