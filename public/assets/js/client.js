$(function() {
	var socket = io();
	var nbConnections = 1;
	var nbConnectionH = $('#nbConnected');
	var clipboardsH = $('#clipboards');

	var name = prompt("Name of the device ?");
	socket.emit('newClient', name);

	socket.on('newClient', function(data){
		nbConnections++;
		updateNbConnected();

		addClient(data)
	})

	socket.on('connectionFeedback', function(clients){
		console.log(clients);
		nbConnections = clients.length;
		updateNbConnected();

		for (var i = clients.length - 1; i >= 0; i--) {
			if (clients[i]!=name) {
				addClient(clients[i]);
			}
		};
	})

	socket.on('clientDisconnected', function(clientName) {
		nbConnections--;
		updateNbConnected();

		$('[data-name="' + clientName + '"]').remove();
	});

	socket.on('newText', function(data) {
		if (data.target==name) {
			$('[data-name="' + data.host + '"]').children('textarea').val(data.value);
		}
	})

	clipboardsH.on('keyup', 'form textarea', function (event) {
		event.preventDefault();
		socket.emit('changeText', {
			host   : name,
			target : $(this).parent().data('name'),
			value  : $(this).val()
		})
	})

	function updateNbConnected() {
		if (nbConnections>1) {
			nbConnectionH.text(nbConnections + " connections");
		} else {
			nbConnectionH.text(nbConnections + " connection");
		}
	}

	function addClient(clientName) {
		clipboardsH.prepend('<form class="col-xs-4" data-name="' + clientName + '"><h3>' + clientName + '</h3><textarea class="form-control"></textarea></form>')
	}
});