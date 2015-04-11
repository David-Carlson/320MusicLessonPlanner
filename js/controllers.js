"use strict";


angular.module('inspinia') //This ENTIRE file is one call to 'angular', i.e.: angular.module.factory.controller.etc....

// /**
//  * MainCtrl - controller
//  */
.controller('MainCtrl', ['$scope', '$resource', '$stateParams', '$state', '$modal', '$log', '$q', 'store', 'jwtHelper', 'getTeacherByID', 'getStudentByID',
    function($scope, $resource, $stateParams, $state, $modal, $log, $q, store, jwtHelper, getTeacherByID, getStudentByID) {

        //  Gets the list of students and lessons
        var studentRecordList = $resource('/api/studentRecord/');


        studentRecordList.query(function(result) {
            var studentRecords = result;
            $scope.students = result;
            // $log.debug('students length:' + $scope.students.length);
            $scope.lessons = [];
            var promises = [];
            for (var i = 0; i < studentRecords.length; i++) {
                var futureStudentRecord = studentRecordList.get({
                    id: studentRecords[i].sid
                });
                promises.push(futureStudentRecord.$promise.then(function(result) {
                    return result;
                }));
            };

            $q.all(promises).then(function(result) {
                for (var sr_index in result) {
                    var schedules = result[sr_index].lessonSchedules;
                    for (var ls_index in schedules) {
                        var todayViewModel = {
                            date: schedules[ls_index].date,
                            lessonTime: schedules[ls_index].lessonTime,
                            lessonLength: schedules[ls_index].lessonLength,
                            firstName: result[sr_index].firstName,
                            lastName: result[sr_index].lastName,
                            sid: result[sr_index].sid
                        };
                        $scope.lessons.push(todayViewModel);
                    }
                }
            });
        });

        //Get teacher data
        var token = store.get('token')
        var decodedToken = token && jwtHelper.decodeToken(token);
        $scope.teacherProfile = getTeacherByID.get({
            id: decodedToken.id
        });

        //  Delete student record
        $scope.confirmDeleteStudent = false;
        $scope.deleteStudentRecord = function(student) {
            var modalInstance = $modal.open({
                templateUrl: 'views/deleteConfirmModal.html',
                controller: 'ModalDeleteStudentCtrl',
                size: 'sm',
                resolve: {
                    confirmDeleteStudent: function() {
                        return $scope.confirmDeleteStudent;
                    }
                }
            });
            modalInstance.result.then(function(confirmDeleteStudent) {
                $log.debug('Delete: Looking up student named: ' + student.firstName + " " + student.lastName + ": " + student.sid);
                $scope.confirmDeleteStudent = confirmDeleteStudent;
                if ($scope.confirmDeleteStudent) {
                    studentRecordList.delete({
                        id: student.sid
                    }, function(result) {
                        if (result.isSuccessful) {
                            var index = -1;
                            for (var i = 0; i < $scope.students.length; i++) {
                                // $log.debug('sid=' + student.sid + '   list sid=' + $scope.students[i].sid);
                                if (student.sid == $scope.students[i].sid) {
                                    index = i;
                                }
                            };
                            $scope.students.splice(index, 1);
                            studentRecordList.query(function(result) {
                                var studentRecords = result;
                                $scope.students = result;
                                $scope.lessons = [];
                                var promises = [];
                                for (var i = 0; i < studentRecords.length; i++) {
                                    var futureStudentRecord = studentRecordList.get({
                                        id: studentRecords[i].sid
                                    });
                                    promises.push(futureStudentRecord.$promise.then(function(result) {
                                        return result;
                                    }));
                                };

                                $q.all(promises).then(function(result) {
                                    for (var sr_index in result) {
                                        var schedules = result[sr_index].lessonSchedules;
                                        for (var ls_index in schedules) {
                                            var todayViewModel = {
                                                date: schedules[ls_index].date,
                                                lessonTime: schedules[ls_index].lessonTime,
                                                lessonLength: schedules[ls_index].lessonLength,
                                                firstName: result[sr_index].firstName,
                                                lastName: result[sr_index].lastName,
                                                sid: result[sr_index].sid
                                            };
                                            $scope.lessons.push(todayViewModel);
                                        }
                                    }
                                });
                            });
                            $state.go('teacher-dashboard.main');
                        }
                    });
                };
            });
        };

        //  View student record
        $scope.viewStudentRecord = function(student) {
            $scope.student = studentRecordList.get({id: student.sid}, {update: {method: 'PUT'}});
            studentRecordList.get({
                id: student.sid
            }, function(result) {
                var studentParams = {
                    sid: result.sid,
                };
                $state.go('teacher-dashboard.viewStudentRecord/:sid', studentParams);
            });
        };

        $scope.viewLessonRecord = function(lesson) {
            var lessonRecord = $resource('/api/studentRecord/:sid/lessonSchedule/:lsid');
            $scope.lesson = lessonRecord.get({sid: lesson.sid, lsid: lesson.lsid}, function(result){
                var lessonParams = {
                    sid: result.sid,
                    lsid: result.lsid
                };
                $state.go('teacher-dashboard.viewLessonRecord/:sid/:lsid', lessonParams);
            });
        };

        $scope.editLessonRecord = function(lesson) {
            var lessonRecord = $resource('/api/studentRecord/:sid/lessonSchedule/:lsid');
            $scope.lesson = lessonRecord.get({sid: lesson.sid, lsid: lesson.lsid}, function(result){
                var lessonParams = {
                    sid: result.sid,
                    lsid: result.lsid
                };
                $state.go('teacher-dashboard.editLessonRecord/:sid/:lsid', lessonParams);
            });
        };

        //  Edit student record
        $scope.editStudentRecord = function(student) {
            $scope.student = studentRecordList.get({id: student.sid}, {update: {method: 'PUT'}});
            studentRecordList.get({
                id: student.sid
            }, function(result) {
                var studentParams = {
                    sid: result.sid,
                };
                $state.go('teacher-dashboard.editStudentRecord/:sid', studentParams);
            });
        };
        /*
         *       DATE PICKER CODE
         */
        $scope.openBirthday = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedBirthday = true;
        };

        $scope.cancelEditStudent = function() {
            $state.go('teacher-dashboard.main');
        };

        $scope.saveEditStudent = function() {
            $scope.student.$update(function() {
                // $log.debug('New note value: ' + $scope.student.generalNotes);
            });
            $state.go('teacher-dashboard.main');
        }

        //  Add student record
        $scope.createStudentRecord = function() {
            $state.go('teacher-dashboard.createStudentRecord');
        };

        //  Edit Student record
        $scope.cancelEditLessonNote = function() {
            $state.go('teacher-dashboard.viewLessonRecord/:sid/:lsid', {sid: $scope.lesson.sid, lsid: $scope.lesson.lsid});
        }

        $scope.saveEditLessonNote = function() {
            $state.go('teacher-dashboard.viewLessonRecord/:sid/:lsid', {sid: $scope.lesson.sid, lsid: $scope.lesson.lsid});
        }

        $scope.cancelLesson = function(lesson) {

            $scope.confirmCancelLesson = 0;
            var modalInstance = $modal.open({
                templateUrl: 'views/rescheduleLessonModal.html',
                controller: 'ModalCancelLessonCtrl',
                size: 'sm',
                resolve: {
                    confirmCancelLesson: function() {
                        return $scope.confirmCancelLesson;
                    }
                }
            });
            modalInstance.result.then(function(confirmCancelLesson) {
                $log.debug('Lesson reschedule choice made: ' + confirmCancelLesson);
            // @TODO cancel current lesson
            });
        };
    }
])

/**
 *      ModalDeleteStudentCtrl
 *      Displays a modal window to confirm or cancel deletion of a student record
 */
.controller('ModalDeleteStudentCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {
        $scope.ok = function() {
            $scope.confirmDeleteStudent = true;
            $modalInstance.close($scope.confirmDeleteStudent);
        };

        $scope.cancel = function() {
            $scope.confirmDeleteStudent = false;
            $modalInstance.close($scope.confirmDeleteStudent);
            // $modalInstance.dismiss('cancel');
        };
    }
])

/**
 *      ModalCancelLessonCtrl
 *      Displays a modal window to confirm or cancel deletion of a student record
 */
.controller('ModalCancelLessonCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {

        $scope.closeCancelLesson = function() {
            $scope.confirmCancelLesson = 0;
            $modalInstance.close($scope.confirmCancelLesson);
            // $modalInstance.dismiss('cancel');
        };

        $scope.cancelNoReschedule = function() {
            $scope.confirmCancelLesson = 1;
            $modalInstance.close($scope.confirmCancelLesson);
        };

        $scope.rescheduleLesson = function() {
            $scope.confirmCancelLesson = 2;
            $modalInstance.close($scope.confirmCancelLesson);
            // $modalInstance.dismiss('cancel');
        };
    }
])

/**
 *     StudentRecordCreationCrtl
 *     Controller for the Add student record form. The edit form will be similar.
 */
.controller('StudentRecordCreationCrtl', ['$scope', '$resource', '$state', '$log', 'notify', '$q',
    function($scope, $resource, $state, $log, notify, $q) {

        /*
         *       DATE INITIALIZATION CODE       ****************************
         */
        $scope.birthday = new Date();
        $scope.birthday.setFullYear(1980);
        $scope.birthday.setMonth(0);
        $scope.birthday.setDate(1);

        $scope.startDate = new Date();
        $scope.startDate.setMinutes(0);
        $scope.startDate.setSeconds(0);

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.startDate = d;
        };

        $scope.changed = function() {
            // $log.log('Time changed to: ' + $scope.startDate);
        };

        $scope.clear = function() {
            $scope.startDate = null;
        };
        //      *******************************************************

        //      Temp General Notes:
        $scope.generalNotes = "This is where notes on student progress should be placed. <b>Hopefully</b> formatting will work.";

        //      Lesson Time Options:

        $scope.lengthOfLessons = ['15 minutes', '30 minutes', '45 minutes', '60 minutes'];
        $scope.lessonLength = $scope.lengthOfLessons[1];

        /*
         *       SUBMIT FORM
         */

        $scope.ok = function() {
            if ($scope.studentRecordForm.$valid) {
                var StudentRecord = $resource('/api/studentRecord/');
                var newStudentRecord = new StudentRecord();
                newStudentRecord.firstName = $scope.firstName;
                newStudentRecord.lastName = $scope.lastName;
                newStudentRecord.instrument = $scope.instrument;
                newStudentRecord.email = $scope.email;
                newStudentRecord.phone = $scope.phone;
                newStudentRecord.address = $scope.address;
                newStudentRecord.birthday = $scope.birthday;
                newStudentRecord.startDate = $scope.startDate;
                newStudentRecord.numberOfLessons = $scope.numberOfLessons;
                newStudentRecord.lessonTime = $scope.startDate;
                newStudentRecord.lessonLength = $scope.lessonLength;
                newStudentRecord.generalNotes = $scope.generalNotes;
                newStudentRecord.lessonNotes = $scope.lessonNotes;
                newStudentRecord.$save(function(result) {
                    StudentRecord.query(function(result) {
                        $scope.$parent.students = result;
                        var studentRecords = result;
                        $scope.$parent.lessons = [];
                        var promises = [];
                        for (var i = 0; i < studentRecords.length; i++) {
                            var futureStudentRecord = StudentRecord.get({
                                id: studentRecords[i].sid
                            });
                            promises.push(futureStudentRecord.$promise.then(function(result) {
                                return result;
                            }));
                        };

                        $q.all(promises).then(function(result) {
                            for (var sr_index in result) {
                                var schedules = result[sr_index].lessonSchedules;
                                for (var ls_index in schedules) {
                                    var todayViewModel = {
                                        date: schedules[ls_index].date,
                                        lessonTime: schedules[ls_index].lessonTime,
                                        lessonLength: schedules[ls_index].lessonLength,
                                        firstName: result[sr_index].firstName,
                                        lastName: result[sr_index].lastName,
                                        sid: result[sr_index].sid
                                    };
                                    $scope.$parent.lessons.push(todayViewModel);
                                }
                            }
                        });
                    });
                    $scope.firstName = '';
                    $scope.lastName = '';
                    $scope.instrument = '';
                    $scope.email = '';
                    $scope.phone = '';
                    $scope.address = '';
                    $scope.birthday = '';
                    $scope.startDate = '';
                    $scope.numberOfLessons = '';
                    $scope.lessonTime = '';
                    $scope.lessonLength = '';
                    $scope.generalNotes = '';
                    $scope.lessonNotes = null;
                });
                $scope.$parent.students.push(newStudentRecord);
                notify({
                    message: 'Student record successfully created.',
                    classes: 'alert-success',
                    templateUrl: 'views/common/notify.html'
                })
                $state.go('teacher-dashboard.main');
            } else {
                $scope.studentRecordForm.submitted = true;
            }
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.cancel = function() {
            $state.go('teacher-dashboard.main');
        };


        /*
         *       DATE PICKER CODE
         */
        $scope.openBirthday = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedBirthday = true;
        };

        $scope.openStartDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedStartDate = true;
        };
    }
])


.controller('LoginCtrl', ['$state', '$stateParams', '$scope', '$resource', '$http', 'store', 'jwtHelper', 'getTeacherByID', '$log',
    function($state, $stateParams, $scope, $resource, $http, store, jwtHelper, getTeacherByID, $log) {

        // $scope.teacherProfile = {};
        // if ($scope.teacherProfile.firstName != undefined) {
        //     $log.warn('teacherProfile (firstName): ' + $scope.teacherProfile.firstName);
        // };

        $scope.signin = function() {
            if ($scope.loginForm.$valid) {
                $http.post('/api/signin', {
                        username: $scope.username,
                        password: $scope.password
                    })
                    .success(function(data, status, header, config) {
                        // alert("SIGN-IN-CTRL Recieved " + data.token);
                        store.set('token', data.token);

                        // //Get user date
                        // var token = store.get('token')
                        // var decodedToken = token && jwtHelper.decodeToken(token);

                        // $log.debug('Decoded token id: ' + decodedToken.id);
                        // $scope.teacherProfile = getTeacherByID.get({
                        //     id: decodedToken.id
                        // });

                        $state.go('teacher-dashboard.main');
                    })
                    .error(function(data, status, header, config) {
                        //alert('Incorrect user name or password.');
                    });
            } else {
                $scope.loginForm.submitted = true;
            }
        };


        $scope.signout = function() {
            $http.post('/api/signout')
                .success(function(data, status, header, config) {
                    store.remove('token');
                    $scope.teacherProfile = null;
                    $state.go('startpage.landing');
                })
                .error(function(data, status, header, config) {
                    $state.go('startpage.landing');

                    // alert('Sign out failed. How does that happen!!!??!?!');
                });
        };
        $scope.signup = function() {
            // alert($scope.username);
            if ($scope.loginForm.$valid) {
                alert('Welcome to MusicLessonPlanner, ' + $scope.firstName);
                $http.post('/api/signup', {
                        username: $scope.username,
                        password: $scope.password,
                        firstName: $scope.firstName
                    })
                    .success(function(data, status, header, config) {
                        // alert('success');
                        store.set('token', data.token);
                        $state.go('startpage.landing');
                    })
                    .error(function(data, status, header, config) {
                        alert('Invalid input.');
                    });
            } else {
                $scope.loginForm.submitted = true;
            }
        };
    }
])


/*
 *      Factory that passes student data from one controller to another
 */
.factory('getStudentByID', ['$resource',
    function($resource, $log) {
        return $resource('/api/studentRecord/', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])

/*
 *      Factory that passes student data from one controller to another
 */
.factory('getTeacherByID', ['$resource',
    function($resource) {
        return $resource('/api/teacher/:id', {
            id: '@id'
        });
    }
])

.service('queryStudentRecords', [function() {

}])

/**
 * [description]
 * @param  {Array}  lessons
 * @return {Array}  lessons filtered by today's date.
 * @todo Filter lessons by those only after the current time.
 */
.filter('isTodaysLesson', [
    function() { // Filters lessons scheduled for today
        return function(lessons) {
            if (angular.isDefined(lessons)) {
                var todaysLessons = [];

                for (var i = 0; i < lessons.length; i++) {
                    var today = new Date();
                    var todayDate = today.getDate();
                    var todayMonth = today.getMonth();
                    var todayYear = today.getFullYear();
                    var lesson = new Date(lessons[i].date)
                    var lessonDate = lesson.getDate();
                    var lessonMonth = lesson.getMonth();
                    var lessonYear = lesson.getYear();
                    // console.log("Lesson month: " + lessonMonth + " date: " + lessonDate +  "?= Today month: " + todayMonth + " date: " + todayDate);
                    if (lessonDate == todayDate && lessonMonth == todayMonth) {
                        todaysLessons.push(lessons[i]);
                    }
                }
                return todaysLessons;
            }
        }
    }
])

.filter('filterDuplicates', [
    function() {
        return function(students) {
            var filteredStudents = [];
            var arrayOfIDs = [];

            for (i = 0; i < students.length; i++) {
                arrayOfIDs[i] = students[i].sid;
            }
            var keyID = 0;
            for (i = 0; i < students.length; i++) {
                if (keyID != students[i]) {
                    filteredStudents.push(students[i]);
                    keyID = students[i].sid
                };
            }
        }
    }
]);
