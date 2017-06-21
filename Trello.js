/* exported Script */
/* globals console, _, s */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 */

class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {
    // request.url.hash
    // request.url.search
    // request.url.query
    // request.url.pathname
    // request.url.path
    // request.url_raw
    // request.url_params
    // request.headers
    // request.user._id
    // request.user.name
    // request.user.username
    // request.content_raw
    // request.content

    // console is a global helper to improve debug
    console.log(request.content);

    var attachment_text = "";
    var title_text = "";
    var url = request.content.model.shortUrl;
    var author_name = request.content.action.memberCreator.fullName;
    var card_name = request.content.action.data.card.name;
    var card_link = request.content.action.data.card.shortLink;
    var board_link = request.content.action.data.board.shortLink;
    var board_name = request.content.action.data.board.name;

    var user_avatar = "https://trello-avatars.s3.amazonaws.com/"+request.content.action.memberCreator.avatarHash +"/170.png";

    var message_text = author_name;

     /** This is used to prevent multiple submissions from Trello */
    if (request.content.model.name == "Exergo") return "";


    /** If a Trello card is updated, created or deleted */
    if (request.content.action.type == "updateCheckItemStateOnCard" ||
        request.content.action.type == "deleteCheckItem" || request.content.action.type == "createCheckItem") {

        if (request.content.action.type == "updateCheckItemStateOnCard") {
            if (request.content.action.data.checkItem.state == "incomplete") message_text += " unchecked ";
            else message_text += " checked ";

            message_text += " a checklist item\n";
        }
        else if (request.content.action.type == "deleteCheckItem") {
            message_text += " deleted a checklist item";
        }
        else if (request.content.action.type == "createCheckItem") {
            message_text += " created a checklist item";
        }

        title_text      = card_name;
        attachment_text = "\nItem: " + request.content.action.data.checkItem.name;
        attachment_text += "\nChecklist: " + request.content.action.data.checklist.name;
        attachment_text += "\nCard: " + card_name;
    }
    /** If a check list is added to a card */
    else if (request.content.action.type == "addChecklistToCard") {
        message_text += " added a checklist to card";
        title_text      = card_name;
        attachment_text += "\nChecklist: " + request.content.action.data.checklist.name;
        attachment_text += "\nCard: " + card_name;

    }
    /** If a checklist is removed from a card */
    else if (request.content.action.type == "removeChecklistFromCard") {
        message_text += " removed a checklist from card";
        title_text      = card_name;
        attachment_text += "\nChecklist: " + request.content.action.data.checklist.name;
        attachment_text += "\nCard: " + card_name;
    }
    /** If a card is created */
    else if (request.content.action.type == "createCard") {
       var list_name = request.content.action.data.list.name;
       //message_text += " added a new card to the list: " + request.content.model.name;
      //message_text += ' added a new card "['+card_name+'](https://trello.com/c/'+card_link+')" to the list ['+list_name+'](https://trello.com/b/'+board_link+')';
       message_text = " New card ["+card_name+"](https://trello.com/c/"+card_link+") added to list ["+list_name+"](https://trello.com/b/"+board_link+")"
       url             = "https://trello.com/c/"+request.content.action.data.card.shortLink;
       title_text      = card_name;
    }
    /** If a card is deleted */
    else if (request.content.action.type == "deleteCard") {
      var list_name = request.content.action.data.list.name;
        message_text = "Card [#"+request.content.action.data.card.idShort+"](https://trello.com/c/"+card_link+") deleted from list ["+list_name+"](https://trello.com/b/"+board_link+")"
        //message_text += " deleted a card";
        url             = "https://trello.com/c/"+request.content.action.data.card.shortLink;
        title_text      = "";
    }
    /** If a card is updated */
    else if (request.content.action.type == "updateCard") {
      var data = request.content.action.data;
     //if data.get('listAfter') and data.get('listBefore'):
       if(data.listBefore){//moveCardToList
         //var list_name = request.content.action.data.list.name;

        message_text = 'Card moved: "['+card_name+'](https://trello.com/c/'+card_link+')" from list "' + data.listBefore.name + "' to '" + data.listAfter.name + "'";
         //request.content.action.data.listBefore.name + "' to '" + request.content.action.data.listAfter.name + "'";
       }
    else if(data.old.name){//renameCard
          var card_old_name = data.old.name;
          message_text = 'Card renamed from "'+card_old_name+'" to "['+card_name+'](https://trello.com/c/'+card_link+')"';
        }

    else  if(data.old.desc != data.card.desc){//renameCardDesc
          var card_desc = data.card.desc;
          var old_desc = data.old.desc;
          if(old_desc!=""){
            card_desc ='from "' + old_desc + '" to "' + card_desc +'"';
          }
          message_text = 'Card updated: "['+card_name+'](https://trello.com/c/'+card_link+')"\n**Description**: '+ card_desc +'';
         //message_text    = JSON.stringify(request.content.action.data) +'Card renamed from "'+card_old_name+'" to "['+card_name+'](https://trello.com/c/'+card_link+')"'
      }
    else if(data.card.due!=data.old.due){//updateCardDueDate
         var card_due = data.card.due;
         var due_action = card_due;

   	   if(due_action==null)
           due_action = 'Removed';//removeCardDueDate

      message_text ='Card updated: "['+card_name+'](https://trello.com/c/'+card_link+')"\n**Due Date**: '+due_action+''
     }
   else if(data.card.closed ==true){//archiveCard
       message_text ='Card archived: "['+card_name+'](https://trello.com/c/'+card_link+')"'
   }

   else if (data.card.closed==false){//unarchiveCard
        message_text ='Card unarchived: "['+card_name+'](https://trello.com/c/'+card_link+')"'
      }
    }

   else if (request.content.action.type == "commentCard"){
       var data = request.content.action.data;
       message_text = '**New comment on card "['+card_name+'](https://trello.com/c/'+card_link+')" by '+author_name+'**'
       attachment_text += "-----------------------------------------------------------\n" +data.text
   }

    else if (request.content.action.type == "moveCardFromBoard"){
       var data = request.content.action.data;
       var board_target_name = data.boardTarget.name;

       message_text = 'Card moved: "['+card_name+'](https://trello.com/c/'+card_link+')" moved from "['+board_name+'](https://trello.com/b/'+board_link+') to board "'+board_target_name+'"'

    }
    else if (request.content.action.type == "moveCardToBoard"){
       var data = request.content.action.data;
       var board_source_name = data.boardSource.name;

	     message_text = 'Card moved: "['+card_name+'](https://trello.com/c/'+card_link+')" moved to "['+board_name+'](https://trello.com/b/'+board_link+') from board  "'+board_source_name+'"'
    }
    else if (request.content.action.type == "addMemberToCard"){
        var data = request.content.action.data;
        var member = request.content.action.member.fullName;
        var member_url =request.content.action.member.username

        message_text = 'New member ['+member+'](https://trello.com/'+member_url+') added to card "['+card_name+'](https://trello.com/c/'+card_link+')"'
    }

    else if (request.content.action.type == "removeMemberFromCard"){
        var data = request.content.action.data;
        var member = request.content.action.member.fullName;
        var member_url =request.content.action.member.username

        message_text = 'Member ['+member+'](https://trello.com/'+member_url+') is removed from card "['+card_name+'](https://trello.com/c/'+card_link+')"'
    }

    else if (request.content.action.type == "addAttachmentToCard"){
        var data = request.content.action.data;
        var attachment_name = data.attachment.name;
        var attachment_url = data.attachment.url
        var attachment_preview_url = data.attachment.previewUrl

        message_text ='New attachment added to card "['+card_name+'](https://trello.com/c/'+card_link+')"\n **['+attachment_name+']('+attachment_url+')**'
    }

    if (url == undefined || message_text == author_name) return;

    /** For debugging purpose. It displays the entire message contents sent by Trello */
  //message_text = JSON.stringify(request.content);

    return {
      content:{
        alias: author_name,
        icon_url:user_avatar,
        //text: message_text,
         "attachments": [{
           "color": "#FF0000",
           //"author_name": request.content.action.memberCreator.avatarHash,
           //"author_link": url,
          // "author_icon": request.content.action.memberCreator.avatarHash,
           "title": request.content.model.name,
           "title_link": request.content.model.shortUrl,
           "text": message_text +"\n" +attachment_text
         }]
       }
    };
  }
}
