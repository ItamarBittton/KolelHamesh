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
			  
			  </thead>
			  <thead>
				<td>שם פרטי</td>
				<td>שם משפחה</td>
				<td>טלפון</td>
				<td>נוכחות</td>
			  </thead>
			  <tbody>
				<tr ng-repeat="student in students">
					<td >{{student.first}}</td>
					<td >{{student.last}}</td>
					<td >{{student.phone}}</td>
					<td >
						
						<select 
								ng-model="student.late" 
								ng-options="def.value as def.name for def in definition" class="form-control">
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