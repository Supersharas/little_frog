


function printTest() {
  let number = document.getElementById('number').value || 5;
  let name = document.getElementById('name').value || 'frog';
  location.href = '/printtest/' + name + '' + number + 'x'
  //location.href = "{{ url_for('print_test', name = req['name'], number = req['number'], operator = 'x') }}";
}

