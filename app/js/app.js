'use strict';

//thanks frank v.
var MqttClientApp = {};
// MqttClientApp.listeners = new Jvent();
// MqttClientApp.credentials = { public: false };

//MqttClientApp.sessionStorageManager = new CookieStorageManager();
//MqttClientApp.appViewController = new AppViewController();
//MqttClientApp.alertViewController = new AlertViewController();

// MqttClientApp.subscriptionManager = new SubscriptionsManager();
// MqttClientApp.publisher = new Publisher();

// MqttClientApp.listeners.emit('showAlert', "This application is intended to work with brokers that are compliant with the standard <a href=\"http://git.eclipse.org/c/paho/org.eclipse.paho.mqtt.javascript.git/tree/src/mqttws31.js\" target=\"_blank\">mqttws31.js file</a> provided by eclipse.org. It is not intended to proxy MQTT messages to noncompliant brokers");

// Declare app level module which depends on filters, and services
angular.module('2lemetryApiV2', ['2lemetryApiV2.filters', '2lemetryApiV2.services', '2lemetryApiV2.directives', '2lemetryApiV2.controllers', 'ngGrid']).
  config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/authenticate', {templateUrl: 'partials/login.html', controller: 'AuthenticationController' });
        $routeProvider.when('/listTopics', {templateUrl: 'partials/listTopics.html', controller: 'ListTopicsController' });
        $routeProvider.when('/accounts/:email', {templateUrl: 'partials/accounts.html', controller: 'AccountController' });
        $routeProvider.when('/accounts', {templateUrl: 'partials/accounts.html', controller: 'AccountController' });
        $routeProvider.when('/createAccount', {templateUrl: 'partials/createAccount.html', controller: 'CreateAccountController' });
        $routeProvider.when('/sys', {templateUrl: 'partials/sysMonitor.html', controller: 'SysController', reloadOnSearch:true });
        $routeProvider.otherwise({redirectTo: '/authenticate'});
  }]);
