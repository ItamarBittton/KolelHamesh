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
				<td>שם משפחה</td>
				<td>שם פרטי</td>
				<td>טלפון</td>
				<td ng-repeat="title in dropList.title">{{title}}</td>
			  </thead>
			  <tbody>
				<tr ng-repeat="student in students" ng-style="{'background-color' : student.is_deleted && 'gray'}">
					<td >{{student.last_name}}</td>
					<td >{{student.first_name}}</td>
					<td >{{student.phone}}</td>
					<td >
						<select 
								ng-model="student.presence" 
								ng-options="def.value as def.name for def in dropList.options" class="form-control">
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