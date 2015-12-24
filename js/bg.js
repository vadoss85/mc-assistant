chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == 'copy') {
		var input = document.createElement('textarea');
		document.body.appendChild(input);
		input.value = message.text;
		input.focus();
		input.select();
		document.execCommand('Copy');
		input.remove();

		sendResponse({status: true});
    }
});


var sections = {
	"textEffects":{
		title: "Text Effects",
		actions: {
			strong: {
				title: '*strong* -> Makes text strong.'
			},
			emphasis: {
				title: '_emphasis_ -> Makes text emphasis.'	
			}
		}
	},
	// "headings":"Headings",
	// "textBreaks":"Text Breaks",
	// "links":"Links",
	// "lists":"Lists",
	// "images":"Images",
	// "attachments":"Attachments",
	// "tables":"Tables",
	// "advancedFormatting":"Advanced Formatting",
	// "misc":"Misc"
}

chrome.contextMenus.create({"title": 'Jira markup', "contexts":["editable", "selection"], "id": "jira_common"});

for (var key in sections) {
	var section = sections[key]
	chrome.contextMenus.create({"title": section.title, "parentId": "jira_common", "contexts":["editable", "selection"], "id": key});

	if (section.actions) {
		for (var key2 in section.actions) {
			var action = section.actions[key2];
			chrome.contextMenus.create({
				"title": action.title, 
				"parentId": key, 
				"contexts":["editable", "selection"], 
				"id": [key,key2].join('_')
			});
		}
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler (info, tab) {
	console.log(arguments)
}

 // Create a parent item and two children.
/*  chrome.contextMenus.create({"title": "Test parent item", "id": "parent"});
  chrome.contextMenus.create(
      {"title": "Child 1", "parentId": "parent", "id": "child1"});
  chrome.contextMenus.create(
      {"title": "Child 2", "parentId": "parent", "id": "child2"});
  console.log("parent child1 child2");*/


chrome.runtime.onInstalled.addListener(function (data) {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules(getRules());
	});
})

function getRules(argument) {
	var rules = []

	var rule1 = {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'jira.corp'}
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'admin.ac.corp'}
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction()]
      };

     rules.push(rule1);
     //rules.push(rule2);

	return rules;
}