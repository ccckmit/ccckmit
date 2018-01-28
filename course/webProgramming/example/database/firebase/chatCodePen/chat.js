(function() {
  var SimpleChat, myChatApp;

  SimpleChat = (function() {
    var fireBase;

    class SimpleChat {
      constructor() {
        fireBase.on("child_added", (snapshot) => {
          var message;
          message = snapshot.val();
          return this.messagesView(message.name, message.text);
        });
        $("#newMessage input").keypress((e) => {
          var name, text;
          if (e.keyCode === 13) {
            name = $("#newMessage input[name='name']").val();
            text = $("#newMessage input[name='text']").val();
            $("#newMessage input[name='text']").val("");
            return this.newMessage(name, text);
          }
        });
      }

      messagesView(name, text) {
        var listItem, nameItem, textItem;
        listItem = jQuery("<li/>");
        nameItem = jQuery("<p/>", {
          class: "name",
          text: name
        });
        textItem = jQuery("<p/>", {
          class: "text",
          text: text
        });
        listItem.appendTo("#listMessages ul");
        nameItem.appendTo(listItem);
        return textItem.appendTo(listItem);
      }

      newMessage(name, text) {
        return fireBase.push({
          name: name,
          text: text
        });
      }

    };

    fireBase = new Firebase("https://simplechatapp.firebaseio.com/");

    return SimpleChat;

  })();

  myChatApp = new SimpleChat;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFVBQUEsRUFBQTs7RUFBTTs7O0lBQU4sTUFBQSxXQUFBO01BR0UsV0FBYSxDQUFBLENBQUE7UUFDWCxRQUFRLENBQUMsRUFBVCxDQUFZLGFBQVosRUFBMkIsQ0FBQyxRQUFELENBQUEsR0FBQTtBQUN6QixjQUFBO1VBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxHQUFULENBQUE7aUJBQ1YsSUFBQyxDQUFBLFlBQUQsQ0FBYyxPQUFPLENBQUMsSUFBdEIsRUFBNEIsT0FBTyxDQUFDLElBQXBDO1FBRnlCLENBQTNCO1FBSUEsQ0FBQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsUUFBdkIsQ0FBZ0MsQ0FBQyxDQUFELENBQUEsR0FBQTtBQUM5QixjQUFBLElBQUEsRUFBQTtVQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUYsS0FBYSxFQUFoQjtZQUNFLElBQUEsR0FBTyxDQUFBLENBQUUsZ0NBQUYsQ0FBbUMsQ0FBQyxHQUFwQyxDQUFBO1lBQ1AsSUFBQSxHQUFPLENBQUEsQ0FBRSxnQ0FBRixDQUFtQyxDQUFDLEdBQXBDLENBQUE7WUFFUCxDQUFBLENBQUUsZ0NBQUYsQ0FBbUMsQ0FBQyxHQUFwQyxDQUF3QyxFQUF4QzttQkFFQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFORjs7UUFEOEIsQ0FBaEM7TUFMVzs7TUFjYixZQUFjLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBQTtBQUNaLFlBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQTtRQUFBLFFBQUEsR0FBWSxNQUFBLENBQU8sT0FBUDtRQUVaLFFBQUEsR0FBWSxNQUFBLENBQU8sTUFBUCxFQUFlO1VBQ3pCLEtBQUEsRUFBTyxNQURrQjtVQUV6QixJQUFBLEVBQU07UUFGbUIsQ0FBZjtRQUtaLFFBQUEsR0FBWSxNQUFBLENBQU8sTUFBUCxFQUFlO1VBQ3pCLEtBQUEsRUFBTyxNQURrQjtVQUV6QixJQUFBLEVBQU07UUFGbUIsQ0FBZjtRQUtaLFFBQVEsQ0FBQyxRQUFULENBQW1CLGtCQUFuQjtRQUNBLFFBQVEsQ0FBQyxRQUFULENBQW1CLFFBQW5CO2VBQ0EsUUFBUSxDQUFDLFFBQVQsQ0FBbUIsUUFBbkI7TUFmWTs7TUFpQmQsVUFBWSxDQUFDLElBQUQsRUFBTyxJQUFQLENBQUE7ZUFDVixRQUFRLENBQUMsSUFBVCxDQUNFO1VBQUEsSUFBQSxFQUFNLElBQU47VUFDQSxJQUFBLEVBQU07UUFETixDQURGO01BRFU7O0lBbENkOztJQUNFLFFBQUEsR0FBVyxJQUFJLFFBQUosQ0FBYSx1Q0FBYjs7Ozs7O0VBc0NiLFNBQUEsR0FBWSxJQUFJO0FBdkNoQiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpbXBsZUNoYXRcbiAgZmlyZUJhc2UgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3NpbXBsZWNoYXRhcHAuZmlyZWJhc2Vpby5jb20vXCIpXG4gIFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBmaXJlQmFzZS5vbiBcImNoaWxkX2FkZGVkXCIsIChzbmFwc2hvdCkgPT5cbiAgICAgIG1lc3NhZ2UgPSBzbmFwc2hvdC52YWwoKVxuICAgICAgQG1lc3NhZ2VzVmlldyhtZXNzYWdlLm5hbWUsIG1lc3NhZ2UudGV4dClcblxuICAgICQoXCIjbmV3TWVzc2FnZSBpbnB1dFwiKS5rZXlwcmVzcyAoZSkgPT5cbiAgICAgIGlmKGUua2V5Q29kZSA9PSAxMylcbiAgICAgICAgbmFtZSA9ICQoXCIjbmV3TWVzc2FnZSBpbnB1dFtuYW1lPSduYW1lJ11cIikudmFsKCk7XG4gICAgICAgIHRleHQgPSAkKFwiI25ld01lc3NhZ2UgaW5wdXRbbmFtZT0ndGV4dCddXCIpLnZhbCgpO1xuXG4gICAgICAgICQoXCIjbmV3TWVzc2FnZSBpbnB1dFtuYW1lPSd0ZXh0J11cIikudmFsKFwiXCIpO1xuXG4gICAgICAgIEBuZXdNZXNzYWdlKG5hbWUsIHRleHQpXG5cbiAgbWVzc2FnZXNWaWV3OiAobmFtZSwgdGV4dCkgLT5cbiAgICBsaXN0SXRlbSAgPSBqUXVlcnkgXCI8bGkvPlwiXG5cbiAgICBuYW1lSXRlbSAgPSBqUXVlcnkgXCI8cC8+XCIsIHtcbiAgICAgIGNsYXNzOiBcIm5hbWVcIlxuICAgICAgdGV4dDogbmFtZVxuICAgIH1cblxuICAgIHRleHRJdGVtICA9IGpRdWVyeSBcIjxwLz5cIiwge1xuICAgICAgY2xhc3M6IFwidGV4dFwiXG4gICAgICB0ZXh0OiB0ZXh0XG4gICAgfVxuXG4gICAgbGlzdEl0ZW0uYXBwZW5kVG8gIFwiI2xpc3RNZXNzYWdlcyB1bFwiXG4gICAgbmFtZUl0ZW0uYXBwZW5kVG8gIGxpc3RJdGVtXG4gICAgdGV4dEl0ZW0uYXBwZW5kVG8gIGxpc3RJdGVtXG5cbiAgbmV3TWVzc2FnZTogKG5hbWUsIHRleHQpIC0+XG4gICAgZmlyZUJhc2UucHVzaFxuICAgICAgbmFtZTogbmFtZVxuICAgICAgdGV4dDogdGV4dFxuXG5teUNoYXRBcHAgPSBuZXcgU2ltcGxlQ2hhdCJdfQ==
//# sourceURL=coffeescript