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
	var sel = window.getSelection();
	var text = sel.toString();
	var txtarea = sel.focusNode;
	var type = 'replace';

	if (txtarea.tagName.toLowerCase() != 'textarea') {
		txtarea = document.querySelector('textarea', window.getSelection().focusNode)
	}

	if (action.action.length == 1) {
		type = 'prepend';
	}

	_replaceStringWithMarkup(txtarea, text, {action: action.action, type: type});
}

function _replaceStringWithMarkup(node, str, action) {
	var r;
	var value = node.value;
	var markup = action.action

	if (!value) {
		console.warn('not a textarea');

		return;
	}

	switch (action.type) {
		case 'replace':
			r = [markup[0], str, markup[1]].join('');
		break;

		case 'prepend':
			r = [markup[0], str]
		break;
	}

	node.value = value.substring(0, node.selectionStart) + r + value.substring(node.selectionEnd, value.length)
}