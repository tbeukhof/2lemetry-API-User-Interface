'use strict';

/* common mocks */
var app = {
    mocks: {
        m2m: {
            Topics: {
                get: function () {
                    return {"size": 2, "results": ["randomDomain/firstLevelTopic/secondLevelTopic", "randomDomain/firstLevelTopic/secondLevelTopic"]}
                }
            },
            Domain: {
                get: function () {
                    return {
                        activedlicenses: 1,
                        licenselimit: 100
                    }
                }
            },
            AccountCreate: {
                create: function (params, successCallback) {
                    successCallback(null, null);
                }
            },
            Account: {
                get: function (params, onSuccessCallback) {
                    onSuccessCallback();
                }
            },
            ACL: {
                permissions: function (params) {
                    return {
                        "aclType": "combined",
                        "active": 1,
                        "attributes": {
                            "topic/bla1/+": [
                                "sub"
                            ],
                            "topic/bla2/+": [
                                "pub"
                            ]
                        }
                    }
                },
                save: function (newPerm, onSuccessCallback) {
                    onSuccessCallback();
                }
            }
        },
        PersistedData: {
            values: {},
            getDataSet: function (name) {
                return this.values[name];
            },
            setDataSet: function (name, value) {
                return this.values[name] = value;
            }
        },
        AuthService: {
            auth: function (username, pwd, successCallback, failureCallback) {
                successCallback({a: "TOKEN"});
            }
        }
    }
};

/* jasmine specs for controllers go here */


describe('ListTopicsController', function () {
    var scope;

    beforeEach(module('2lemetryApiV2.controllers'));

    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('ListTopicsController', {
            $scope: scope,
            m2m: app.mocks.m2m
        });
    }));


    it('should make a REST call and set the results to $scope.topicObject', (function () {
        //spec body
        expect(scope.topicObject.size).toEqual(2);
    }));
});

describe('AuthenticationController', function () {
    var scope, http, timeout;

    beforeEach(module('2lemetryApiV2.controllers'));

    beforeEach(inject(function ($rootScope, $controller, $http, $timeout) {
        scope = $rootScope.$new();
        timeout = $timeout;
        http = $http;

        $controller('AuthenticationController', {
            '$scope': scope,
            '$http': $http,
            '$timeout': timeout,
            'AuthService': app.mocks.AuthService,
            'm2m': app.mocks.m2m,
            'PersistedData': app.mocks.PersistedData
        });
    }));

//    refactored to use a directive for reusability
//    it('should mask the password as it is typed', (function () {
//        scope.maskPassword("12345");
//        expect(scope.maskedPassword).toEqual("****5");
//        timeout.flush();
//        expect(scope.maskedPassword).toEqual("*****");
//    }));

    it('should log you in properly', (function () {
        scope.login("test@test.com", "mypass");
        expect(http.defaults.headers.common['Authorization'].indexOf('Bearer')).toBeGreaterThan(-1);
        expect(http.defaults.headers.post["Content-Type"].indexOf('application/x-www-form-urlencoded')).toBeGreaterThan(-1);
        expect(scope.domain.licenselimit).toEqual(100);
    }));
});

describe('CreateAccountController', function () {
    var scope, location, confirm;

    beforeEach(module('2lemetryApiV2.controllers'));

    beforeEach(inject(function ($rootScope, $controller, $location) {
        scope = $rootScope.$new();
        location = $location;

        delete scope.confirmMessage;

        $controller('CreateAccountController', {
            '$scope': scope,
            '$location': $location,
            'm2m': app.mocks.m2m
        });

        confirm = function (message) {
            scope.confirmMessage = message; //for testability
            return true;
        }
    }));

    it('should create a user and redirect to show the user', (function () {
        scope.createUser("test@test.com", "mypass");
        expect(location.path()).toBe("/accounts/test@test.com");
    }));
});

describe('AccountController', function () {
    var scope, routeParams, pesistedData;
    '$scope', '$routeParams', 'm2m', 'PersistedData'
    beforeEach(module('2lemetryApiV2.controllers'));

    beforeEach(inject(function ($rootScope, $controller, $routeParams) {
        scope = $rootScope.$new();

        $controller('AccountController', {
            '$scope': scope,
            '$routeParams': $routeParams,
            'm2m': app.mocks.m2m,
            'PersistedData': app.mocks.PersistedData
        });

        scope.account = {};
        scope.account.aclid = "123";

    }));

    it('should find a users ACL id and search for their permissions based on that acl.', (function () {
        scope.findUser("test@test.com");
        expect(scope.acl.active).toBe(1);
    }));

    it('should save changes to permissions.', (function () {
        expect(scope.acl).toBe(undefined);
        scope.saveUpdatedPermissions({});

        expect(scope.acl.active).toBe(1);
    }));

    it('should remove a topic from the list of allowed permissions', (function () {
        //todo figure out how to work around the call to confirm
        //scope.removeTopicPermissions("domain/topic");
        //expect(scope.confirmMessage.length).toBeGreaterThan(0);
    }));

    it('should keep users from messing up their topics', (function () {
        //watch out for toMatch with regex in the topic string
        expect(scope.validateTopic("/mytopic")).toEqual("MYTOPIC");
        expect(scope.validateTopic("/mytopic/#")).toEqual("MYTOPIC/#");
        expect(scope.validateTopic("mytopic/that/is/really/long/and/maynot/be/realistic")).toEqual("MYTOPIC/THAT/IS/REALLY/LONG/AND/MAYNOT/BE/REALISTIC");
        expect(scope.validateTopic("mytopic/that/is/really/long/and/+/be/realistic/+")).toEqual("MYTOPIC/THAT/IS/REALLY/LONG/AND/+/BE/REALISTIC/+");
    }));

    it('should save new permissions with the default values', (function () {
        expect(scope.acl).toBe(undefined);
        scope.saveNewPermissions("domain/topic");
        expect(scope.acl.active).toBe(1);
    }));

});