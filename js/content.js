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
