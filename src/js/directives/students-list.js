angular
    .module('RDash').directive("studentList", function () {
        return {
            scope: {
                students: "=",
                definition: "="
            },
            template: `<div>
		<table class="table" >
            <thead style="text-align: center">
              <td colspan="4" class="lborder">פרטי האברך</td>
			  <td colspan="3" class="lborder">נוכחות</td>
			  </thead>
			  <thead>
				<td>שם פרטי</td>
				<td>שם משפחה</td>
				<td>טלפון</td>
			  </thead>
			  <tbody>
				<tr ng-repeat="student in students">
					<td >{{student.first}}</td>
					<td >{{student.last}}</td>
					<td >{{student.phone}}</td>
					<td >
						<select class="form-control">
							<option ng-repeat="def in definition" val={{def}}>{{def}}</option>
						</select>
					</td>
				</tr>
			  </tbody>
			  </table>
		</div>`,
            link: function (scope) {

            }

        }
    })