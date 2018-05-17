angular
    .module('RDash').directive("studentList", function() {
        return {
            scope: {
                students: "=",
                dropList: "="
            },
            template: `
            <div>
                <table class="table">
                    <thead>
                        <td>שם משפחה</td>
                        <td>שם פרטי</td>
                        <td>טלפון</td>
                        <td ng-repeat="title in dropList.title">{{title}}</td>
                        <td>ח.מ</td>
                    </thead>
                    <tbody>
                        <tr ng-repeat="student in students" ng-class="{ 'archive' : student.is_deleted }">
                            <td>{{student.last_name}}</td>
                            <td>{{student.first_name}}</td>
                            <td>{{student.phone}}</td>
                            <td>
                            <select
                            ng-model="student.presence" 
                            ng-options="def.value as def.name for def in dropList.options" class="form-control">
                            </select>
                            </td>
                            <td>{{student.count}}</td>
                        </tr>
                    </tbody>
                </table>
		    </div>`,
        };
    });