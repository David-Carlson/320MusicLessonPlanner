SQLite format 3   @     t                                                               t -�    � ba �                                                                      �"%%�tableLessonRecordLessonRecordCREATE TABLE LessonRecord(lrid INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, notes TEXT, sid INTEGER references SRecord(sid))�6�?tableScheduleScheduleCREATE TABLE Schedule(schid INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, lessonTime DATETIME, lessonLength INTEGER, sid INTEGER references SRecord(sid))�s�=tableSRecordSRecordCREATE TABLE SRecord(sid INTEGER PRIMARY KEY AUTOINCREMENT, tid INTEGER references Teacher(tid), email TEXT, firstName TEXT, lastName TEXT, address TEXT, phone TEXT, birthday DATE, instrument TEXT, generalNotes TEXT)P++Ytablesqlite_sequencesqlite_sequenceCREATE TABLE sqlite_sequence(name,seq)��tableTeacherTeacherCREATE TABLE Teacher(tid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, firstName TEXT, lastName TEXT, address TEXT, phone TEXT)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 � ��                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ScheduleSRecord � � ����U��D                                                                                                                                                                                                                                                                                                                                                               U 	;-)S 	;-) music@jesshendricks.comJessHendricks281 State Street(615) 943-8578GuitarL 	+-% email@email.comChristaHendU  	;-) music@jesshendricks.comJessHendricks281 State Street(615) 943-8578TimbalesR 	;-) music@jesshendricks.comJessHendricks281 State Street(615) 943-8578Sitar7 	)% bela@email.comBelaBartokNYC555-555-5555Piano   �	;-)# music@jesshendricks.comJessHendricks281 State Street(615) 943-8578Bass guitar   y	;R 	;-) music@jesshendricks.comJessHendricks281 State Street(615) 943-8578Piano   	1S!! nsimsiri@umass.eI 	%-% ch@email.comChristaHendricks281 State Street555-555-5555Violin� � �������                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            	 	  	 	 	   	   		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              