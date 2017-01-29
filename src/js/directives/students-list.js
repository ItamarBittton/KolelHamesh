angular
	.module('RDash').directive("studentList", function () {
		return {
			scope: {
				students: "=",
				dropList: "="
			},
			template: `<div>
		<table class="table">
			  <thead>
				<td>שם פרטי</td>
				<td>שם משפחה</td>
				<td>טלפון</td>
				<td ng-repeat="title in dropList.title">{{title}}</td>
			  </thead>
			  <tbody>
				<tr ng-repeat="student in students">
					<td >{{student.first}}</td>
					<td >{{student.last}}</td>
					<td >{{student.phone}}</td>
					<td ng-repeat="option in dropList.options">
						<select 
								ng-model="student.val" 
								ng-options="def.value as def.name for def in option" class="form-control">
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