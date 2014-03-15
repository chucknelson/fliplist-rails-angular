'use strict'

describe('FlipList Controllers', function() {
  var scope, controller, routeParams, $httpBackend, 
    testLists, testList;

  beforeEach(function() {
    module('flipListApp');
    inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    });

    //test data - TODO: move elsewhere? fixtures?
    testLists = [
      {id:1, title:'List1', items:[{id:1, name:'Item 1'}, {id:2, name:'Item2'}]},
      {id:2, title:'Empty List'}
      ];
    testList = testLists[0];

  });

  describe('FlipListController', function() {

    beforeEach(inject(function($rootScope, $controller) {
      $httpBackend.expectGET('api/lists').
        respond(testLists);

      scope = $rootScope.$new();
      controller = $controller('FlipListController', {$scope: scope});
    }));

    it('should create "lists" model with 2 different lists fetched from api', function() {
      expect(scope.lists.length).toBe(0);
      $httpBackend.flush();
      expect(scope.lists.length).toBe(testLists.length);
      expect(scope.lists[0].items.length).toBe(testLists[0].items.length);
    });

  });

  describe('FlipListDetailController', function() {

    beforeEach(inject(function($rootScope, $controller) {
      $httpBackend.expectGET('api/lists/' + testList.id).
        respond(testList);

      routeParams = {}; //passed in to controller so we can modify in tests
      routeParams.listId = testList.id;
      scope = $rootScope.$new();
      controller = $controller('FlipListDetailController', {$scope: scope, $routeParams: routeParams});
      
    }));

    it('should create "list" model fetched from api', function() {
      $httpBackend.flush();
      expect(scope.list.title).toBe(testList.title);
      expect(scope.list.items.length).toBe(testList.items.length);
    });

    it('should update a list', function() {
      $httpBackend.flush();
      expect(scope.list.title).toBe('List1');

      testList.title = 'Modified Title';
      $httpBackend.expectPUT('api/lists/' + testList.id, testList).respond(200);
      scope.list.title = testList.title;
      scope.list.$update();
      $httpBackend.flush();
      expect(scope.list.title).toBe(testList.title);
    })

  });

});