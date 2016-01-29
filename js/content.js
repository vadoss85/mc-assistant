$(function (argument) {
	var regexp = new RegExp('hotfix\/[a-zA-Z0-9\-\_]*');
	var a = $('.action-body').filter(function () {
	    return regexp.test($(this).text()); 
	});

	a.each(function (i, elm) {
		var html = $(elm).html();
		var m = html.match(regexp);
		
		html = html.replace(regexp, '<span class="git-branch-wrapper"><strong class="git-branch-name">$&</strong><button class="git-branch-copy copy-icon" data-cp="$&"></button></span>')
		
		$(elm).html(html)

		var cpButton = $(elm).find('.git-branch-copy');

		cpButton.on('click', function (e) {
			e.preventDefault();

			chrome.runtime.sendMessage({
				type: 'copy',
				text: cpButton.attr('data-cp')
			}, function (response) {
				//console.warn(response)
				if (response.status) {
					cpButton.addClass('success');

					window.setTimeout(function () {
						cpButton.removeClass('success');						
					}, 1500)
				}
			});

			return;			
		});
	})
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('onMessage')
    if (message.type == 'editableArea.action') {
		console.warn(message.message);
		makeMarkupAction(message.message)
    }
});

function makeMarkupAction(action) {
	var node;

	if (action.text) {
		node = window.getSelection().baseNode;
	};

	if (!node.tagName || (node.tagName && node.tagName.toLowerCase() != 'textarea')) {
		return;
	};

	node.value = _replaceStringWithMarkup(node, action.action);
}

function _replaceStringWithMarkup(node, markup) {
	var result = node.value;
	var text = node.value.substring(node.selectionStart, node.selectionEnd);

	result = result.split(text);

	r = [result[0], [markup[0], text, markup[1].join(''), result[1]]].join('');

	return r
}