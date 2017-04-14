select t6.name,
	   t1.last_name as "שם משפחה",
	   t1.first_name as "שם פרטי",
	   t1.id as "תעודת זהות",
	   t1.phone as "מספר פלאפון",
	   t1.adress as "כתובת",
	   t2.late as "סכום איחורים",
	   t3.missed as "כמות חיסורים",
	   t4.appMissed as "כמות חיסורים באישור",
	   case t2.present < 6 
	   then 0 
	   else 550 - t4.missed * 25 - t3.late/10 * 8 as "תשלום נוכחות",
	   case t6.write_test > 75 
	   then 120 
	   else 0 as "מבחן בע'פ",
	   case t6.oral_test > 75
	   then 100
	   else 0 as "מבחן בכתב"
from tb_students t1 
					left outer join (select t2.student_id, count(t2.student_id) as "present"
						  from tb_daily t2
						  where t2.presence = 0 and month(t2.date) = ${month}
						  group by t2.student_id) t2 on (t1.student_id = t2.student_id)

					left outer join (select t2.student_id, sum(t2.presence) as "late"
						  from tb_daily t2
						  where t2.presence > 0 and month(t2.date) = ${month}
						  group by t2.student_id) t3 on (t1.student_id = t3.student_id)

				    left outer join (select t2.student_id, count(t2.student_id) as "missed"
						  from tb_daily t2
						  where t2.presence = -1 and month(t2.date) = ${month}
						  group by t2.student_id) t4 on (t1.student_id = t4.student_id)

				    left outer join (select t2.student_id, count(t2.student_id) as "appMissed"
						  from tb_daily t2
						  where t2.presence = -2 and month(t2.date) = ${month}
						  group by t2.student_id) t5 on (t1.student_id = t5.student_id)

				    left outer join (select t2.student_id, t2.write_test, t2.oral_test, t3.tb_comment
						  from tb_score t2, tb_comment t3
						  where month(t2.date) = ${month} and t2.student_id = t3.student_id)
						   t6 on (t1.student_id = t6.student_id)

					left outer join tb_colel t7 on (t1.colel_id = t7.id)
					left outer join (select t2.)
order by t7.name
