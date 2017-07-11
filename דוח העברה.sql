select t1.name as 'שם כולל',
t1.supported_id as 'מספר נתמך',
	   t1.last_name as 'שם משפחה',
	   t1.first_name as 'שם פרטי',
	   t1.id as 'תעודת זהות',
	   t1.phone as 'מספר פלאפון',
	   t1.street as 'כתובת',
	   t1.late as 'איחורים בדקות',
	   t1.missed as 'חיסורים בימים',
	   t1.appMissed as 'חיסורים באישור',
	   t1.present as 'ימי נוכחות',
	   t1.comment as 'חריגים',
		(t1.monthlyPayment + t1.writeTest + t1.oralTest) as 'סה"כ לתשלום'
from (

select t7.name,
	   t1.last_name,
	   t1.first_name,
	   t1.id,
	   t1.phone,
	   t1.street,
	   t3.late,
	   t4.missed,
	   t5.appMissed,
	   t2.present,
	   t6.comment,
	   case 
	   when t2.present < t8.min_presence then 0 
	   else (t8.monthly_payment - (t4.missed * t8.missed) - (t3.late/t8.per_late * t8.late)) end 'monthlyPayment',
	   case when t6.write_score > 75 
	   then 100 
	   else 0 end 'writeTest',
	   case when t6.oral_score > 100
	   then 120 
	   else 0 end 'oralTest'

from tb_student t1 
					left outer join (select t2.student_id, count(t2.student_id) as 'present'
						  from tb_daily t2
						  where t2.presence = 0 and month(t2.date) = 6 
						  group by t2.student_id) t2 on (t1.id = t2.student_id)

					left outer join (select t2.student_id, sum(t2.presence) as 'late'
						  from tb_daily t2
						  where t2.presence > 0 and month(t2.date) = 6
						  group by t2.student_id) t3 on (t1.id = t3.student_id)

				    left outer join (select t2.student_id, count(t2.student_id) as 'missed'
						  from tb_daily t2
						  where t2.presence = -1 and month(t2.date) = 6
						  group by t2.student_id) t4 on (t1.id = t4.student_id)

				    left outer join (select t2.student_id, count(t2.student_id) as 'appMissed'
						  from tb_daily t2
						  where t2.presence = -2 and month(t2.date) = 6
						  group by t2.student_id) t5 on (t1.id = t5.student_id)

				    left outer join (select t2.student_id, t2.write_score, t2.oral_score, t3.comment
						  from tb_score t2, tb_comment t3
						  where t2.year = 2017 and 
						  		t2.month = 6 and
								t2.year = t3.year and
								t2.month = t3.month and
								t2.student_id = t3.student_id)
						   t6 on (t1.id = t6.student_id)

					left outer join tb_colel t7 on (t1.colel_id = t7.id)
					left outer join tbk_settings t8 on (t7.group_type = t8.group_type)
order by t7.name, t1.last_name) t1
